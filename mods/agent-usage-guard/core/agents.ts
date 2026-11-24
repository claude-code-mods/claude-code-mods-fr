// The agent gate: every subagent, teammate, workflow agent and resumed agent
// passes here before it starts.

import type { Config } from './config.ts'
import { type LimitReading, type LoopId, type PeerRecord, type SessionState, countOnMachine, overrideCovers, runningAgents, tokensWithin } from './state.ts'
import { count, duration, join, sentence, shortClock, tokens, windowName } from './text.ts'
import { ALLOW, type Ask, type Deny, SIGNATURE, type Trip, type Verdict, refuse } from './verdict.ts'

export type AgentRequest = {
  /** The loop asking for the agent. */
  loop: LoopId
  /** Layers below the main conversation the new agent would run at. */
  depth: number
  /** True when a finished agent is being sent a new task. */
  resume: boolean
  /** It runs on Haiku: the running and starts caps leave it out. */
  cheap?: boolean
}

/** A model id or alias for Haiku, the tier the running and starts caps leave out. */
export function isHaiku(model: string | undefined): boolean {
  return model !== undefined && /haiku/i.test(model)
}

const AGENT_ALLOW = 'Autoriser'
/**
 * How long an approval of the subagent token budget lasts. A busy hour brings
 * one burst after another, and asking again at each burst only asks the same
 * question: over 30 days of use, 29 such questions were all allowed.
 */
const AGENT_TOKENS_LIFT_MS = 60 * 60_000
const AGENT_REFUSE = 'Ne pas le lancer'

export function agentGate(
  state: SessionState,
  peers: readonly PeerRecord[],
  config: Config,
  now: number,
  request: AgentRequest,
): Verdict {
  if (!config.enabled || overrideCovers(state, now, 'agents')) return ALLOW
  const what = request.resume ? 'la reprise de cet agent' : 'cet agent'

  if (request.depth > config.depthMax) {
    const base = `${request.resume ? 'Cet agent n’a pas pu être repris' : 'Cet agent n’a pas été lancé'} : les sous-agents ne peuvent pas lancer leurs propres agents ici (limite de profondeur ${config.depthMax}). Faites le travail vous-même et faites un compte rendu.`
    return refuse(state, config, now, 'depth', 'depth', base, true)
  }
  if (state.fuseUntil !== undefined && now < state.fuseUntil) {
    const base = `Les lancements d’agents dans cette session sont suspendus jusqu’à ${shortClock(state.fuseUntil)} après plusieurs refus. Continuez sans agents ; l’utilisateur peut lever cette limite avec /agent-guard allow.`
    return refuse(state, config, now, 'fuse', 'fuse', base, false)
  }

  const limit = highestLimit(state, peers, now)
  if (limit && limit.percent >= config.limitDenyPercent) {
    const base = `${sentence(what)} a été refusé : ${limitDetail(limit)}, et la garde réserve la suite de la fenêtre à l’utilisateur. Continuez sans agents ; l’utilisateur peut lever cette limite avec /agent-guard allow.`
    return refuse(state, config, now, 'limit-deny', 'limit-deny', base, true)
  }

  const trips = agentTrips(state, peers, config, now, limit, request.cheap === true).filter((t) => !leased(state, t, now))
  if (trips.length === 0) return ALLOW

  const details = join(trips.map((t) => t.detail))
  const declinedAt = state.refusals.agents
  if (declinedAt !== undefined && now < declinedAt) {
    const base = `L’utilisateur a refusé les nouveaux agents pour l’instant (${details}). Continuez sans en lancer ; l’utilisateur peut lever cette limite avec /agent-guard allow.`
    return refuse(state, config, now, trips[0]!.rule, `agents:${trips[0]!.rule}`, base, true)
  }
  if (!state.canAsk) return unattended(state, config, now, trips, details, request.resume)
  return {
    kind: 'ask',
    family: 'agents',
    loop: request.loop,
    trips,
    question: `${sentence(details)}. Autoriser lève ${trips.length > 1 ? 'ces limites' : 'cette limite'} jusqu’à ${shortClock(Math.max(...trips.map((t) => t.leaseUntil)))}. ${request.resume ? 'Reprendre cet agent' : 'Lancer cet agent'} ?`,
    options: [AGENT_ALLOW, AGENT_REFUSE],
  }
}

/**
 * Applies the user's answer to an agents question. Any answer other than the
 * allow label refuses, and typed words reach the model so it can act on them.
 * `answer` is undefined when the question was dismissed.
 */
export function resolveAgentAsk(
  state: SessionState,
  config: Config,
  now: number,
  ask: Ask,
  answer: string | undefined,
  resume = false,
): Verdict {
  if (answer === AGENT_ALLOW) {
    for (const trip of ask.trips) state.leases[trip.leaseKey] = Math.max(state.leases[trip.leaseKey] ?? 0, trip.leaseUntil)
    return ALLOW
  }
  state.refusals.agents = now + config.windowMs
  const details = join(ask.trips.map((t) => t.detail))
  const said =
    answer === undefined
      ? `L’utilisateur a ignoré la question concernant ${resume ? 'la reprise' : 'le lancement'} de cet agent`
      : answer === AGENT_REFUSE
        ? `L’utilisateur a choisi de ne pas ${resume ? 'reprendre' : 'lancer'} cet agent`
        : `L’utilisateur a répondu « ${answer} » au lieu de l’autoriser`
  const base = `${notRun(resume)} : ${details}. ${said}. Continuez sans lancer d’agents sauf indication contraire de l’utilisateur.`
  return refuse(state, config, now, ask.trips[0]!.rule, `agents:${ask.trips[0]!.rule}`, base, true)
}

/**
 * Holds back a call that tripped while the user is already being asked the
 * same question. It does not wait for the answer, which could outlast the
 * hook's time limit, and it is not a refusal of the condition: no ladder rung,
 * no fuse.
 */
export function heldForQuestion(subject: 'agents' | 'heavy'): Deny {
  const message =
    subject === 'agents'
      ? 'L’utilisateur est interrogé sur le lancement d’agents. Attendez sa réponse, puis relancez cet agent.'
      : 'L’utilisateur est interrogé sur la poursuite du travail avec cette taille de contexte. Attendez sa réponse, puis refaites cet appel.'
  return { kind: 'deny', rule: 'asking', message: `${message} [${SIGNATURE}]` }
}

function agentTrips(
  state: SessionState,
  peers: readonly PeerRecord[],
  config: Config,
  now: number,
  limit: LimitReading | undefined,
  cheap: boolean,
): Trip[] {
  const window = config.windowMs
  const span = duration(window)
  const until = now + window
  const trips: Trip[] = []

  const running = runningAgents(state) + peers.reduce((sum, p) => sum + p.running, 0)
  if (!cheap && running >= config.agentMax) {
    trips.push({
      rule: 'concurrency',
      detail: `${count(running, 'agent')} ${running === 1 ? 'est' : 'sont'} en cours sur cette machine (limite ${config.agentMax})`,
      leaseKey: 'concurrency',
      leaseUntil: until,
    })
  }

  const starts = countOnMachine(state, peers, 'starts', now, window)
  if (!cheap && starts >= config.rollingMax) {
    trips.push({
      rule: 'starts',
      detail: `${count(starts, 'agent')} lancés sur cette machine ces ${span} (limite ${config.rollingMax})`,
      leaseKey: 'starts',
      leaseUntil: until,
    })
  }

  const processed = tokensWithin(state.agentTokens, now, window) + peers.reduce((sum, p) => sum + tokensWithin(p.agentTokens, now, window), 0)
  if (processed >= config.agentTokensMax) {
    trips.push({
      rule: 'agent-tokens',
      detail: `les sous-agents ont traité ${tokens(processed)} jetons ces ${span} (limite ${tokens(config.agentTokensMax)})`,
      leaseKey: 'agent-tokens',
      leaseUntil: now + AGENT_TOKENS_LIFT_MS,
      tokens: processed,
    })
  }

  const burned = burn(state, peers, now, window)
  if (burned && burned.points >= config.burnPercent) {
    trips.push({
      rule: 'burn',
      detail: `la fenêtre de 5 h a augmenté de ${burned.points} points ces ${span} (maintenant ${burned.percent} %)`,
      leaseKey: 'burn',
      leaseUntil: until,
    })
  } else if (burned?.fullAt !== undefined && burned.resetsAt !== undefined) {
    trips.push({
      rule: 'burn',
      detail: `à ce rythme la fenêtre de 5 h sera pleine à ${shortClock(burned.fullAt)}, avant sa réinitialisation à ${shortClock(burned.resetsAt)} (maintenant ${burned.percent} %)`,
      leaseKey: 'burn',
      leaseUntil: until,
    })
  }

  if (limit && limit.percent >= config.limitAskPercent) {
    trips.push({
      rule: 'limit',
      detail: limitDetail(limit),
      leaseKey: `limit:${limit.kind}`,
      leaseUntil: limit.resetsAt ?? until,
    })
  }
  return trips
}

function unattended(state: SessionState, config: Config, now: number, trips: Trip[], details: string, resume: boolean): Deny {
  const first = trips[0]!
  const advice: Record<string, string> = {
    concurrency: 'Attendez qu’un agent en cours termine avant d’en lancer un autre',
    starts: 'Les lancements se libèrent en sortant de la fenêtre ; regroupez le travail ou faites-le vous-même',
    'agent-tokens': 'Faites le travail restant vous-même plutôt que dans des agents',
    burn: 'Continuez sans agents jusqu’à ce que la consommation ralentisse',
    limit: 'Continuez sans agents',
  }
  const base = `${notRun(resume)} : ${details}. Personne ne peut l’approuver dans cette session. ${advice[first.rule] ?? 'Continuez sans agents'}.`
  return refuse(state, config, now, first.rule, `agents:${first.rule}`, base, true)
}

function leased(state: SessionState, trip: Trip, now: number): boolean {
  const until = state.leases[trip.leaseKey]
  return until !== undefined && now < until
}

/** The most-used plan window with a current reading, from this session or its peers. */
export function highestLimit(state: SessionState, peers: readonly PeerRecord[], now: number): LimitReading | undefined {
  const readings = [...Object.values(state.limits), ...peers.flatMap((p) => (p.limit ? [p.limit] : []))]
  const freshest = new Map<string, LimitReading>()
  for (const r of readings) {
    if (r.resetsAt !== undefined && r.resetsAt <= now) continue
    const seen = freshest.get(r.kind)
    if (!seen || r.at > seen.at) freshest.set(r.kind, r)
  }
  let highest: LimitReading | undefined
  for (const r of freshest.values()) if (!highest || r.percent > highest.percent) highest = r
  return highest
}

export function limitDetail(limit: LimitReading): string {
  const reset = limit.resetsAt === undefined ? '' : ` (réinitialisation à ${shortClock(limit.resetsAt)})`
  return `la fenêtre ${windowName(limit.kind)} est utilisée à ${limit.percent} %${reset}`
}

/** A rise shorter or smaller than this is too coarse to project a pace from: readings move in steps. */
const PACE_MIN_MS = 2 * 60_000
const PACE_MIN_POINTS = 2
/**
 * How far ahead a pace is trusted. A few minutes of usage say little about
 * the hours after, and every new agent checks again, so a pace that holds is
 * caught as the window fills.
 */
const PACE_HORIZON_MS = 60 * 60_000

/**
 * Points the 5-hour window rose within the rolling window, across this
 * machine, and, at the pace of that rise, when it fills if that comes within
 * the next hour and before it resets.
 */
function burn(
  state: SessionState,
  peers: readonly PeerRecord[],
  now: number,
  windowMs: number,
): { points: number; percent: number; resetsAt?: number; fullAt?: number } | undefined {
  const own = state.limits.five_hour
  const peerReadings = peers.flatMap((p) => (p.limit?.kind === 'five_hour' ? [p.limit] : []))
  const current = [own, ...peerReadings].reduce<LimitReading | undefined>(
    (best, r) => (r && (!best || r.at > best.at) ? r : best),
    undefined,
  )
  if (!current) return undefined
  const sameWindow = [...state.limitHistory, ...peerReadings].filter(
    (r) => r.kind === 'five_hour' && r.resetsAt === current.resetsAt && now - r.at < windowMs,
  )
  if (sameWindow.length === 0) return undefined
  const lowest = Math.min(...sameWindow.map((r) => r.percent))
  const points = Math.round((current.percent - lowest) * 10) / 10
  const first = sameWindow.reduce((a, b) => (b.at < a.at ? b : a))
  const span = current.at - first.at
  const rise = current.percent - first.percent
  let fullAt: number | undefined
  if (span >= PACE_MIN_MS && rise >= PACE_MIN_POINTS && current.resetsAt !== undefined) {
    const at = current.at + ((100 - current.percent) * span) / rise
    if (at < current.resetsAt && at - now <= PACE_HORIZON_MS) fullAt = at
  }
  return { points, percent: current.percent, ...(current.resetsAt === undefined ? {} : { resetsAt: current.resetsAt }), ...(fullAt === undefined ? {} : { fullAt }) }
}

function notRun(resume: boolean): string {
  return resume ? 'Cet agent n’a pas été repris' : 'Cet agent n’a pas été lancé'
}
