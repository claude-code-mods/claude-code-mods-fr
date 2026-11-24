// What the user sees without asking: one status line while something needs
// attention, and the `/agent-guard` command's text.

import { highestLimit } from './agents.ts'
import type { Config } from './config.ts'
import { MAIN, type PeerRecord, type Scope, type SessionState, countOnMachine, runningAgents } from './state.ts'
import { count, duration, shortClock, tokens, windowName } from './text.ts'

/** The line under the prompt, or undefined when there is nothing to say. */
export function statusLine(state: SessionState, peers: readonly PeerRecord[], config: Config, now: number): string | undefined {
  if (!config.enabled) return undefined
  const parts = liftedOrPaused(state, now)
  const limit = highestLimit(state, peers, now)
  if (limit && limit.percent >= config.limitDenyPercent) {
    parts.push(`fenêtre ${windowName(limit.kind)} à ${limit.percent} % : nouveaux agents refusés`)
  } else if (limit && limit.percent >= config.limitAskPercent) {
    parts.push(`fenêtre ${windowName(limit.kind)} à ${limit.percent} % : les nouveaux agents nécessitent une approbation`)
  }
  const context = state.loops[MAIN]?.context
  if (context !== undefined && context >= config.contextHard) {
    parts.push(`contexte ${tokens(context)} : /compact recommandé`)
  } else if (context !== undefined && context >= config.contextWarn) {
    parts.push(`contexte ${tokens(context)}`)
  }
  return parts.length > 0 ? parts.join(' · ') : undefined
}

/** Which questions are open now, for the band. */
export type Asking = { agents: boolean; context: boolean }

/**
 * The band above the prompt: the guard's own state while it has something to
 * say, the agents on this machine against their limits first. `alert` when a
 * limit is reached or the guard is holding something.
 */
export function bandLine(
  state: SessionState,
  peers: readonly PeerRecord[],
  config: Config,
  now: number,
  asking: Asking,
): { text: string; alert: boolean } | undefined {
  if (!config.enabled) return undefined
  const window = config.windowMs
  const running = runningAgents(state) + peers.reduce((sum, p) => sum + p.running, 0)
  const starts = countOnMachine(state, peers, 'starts', now, window)
  const declined = state.refusals.agents !== undefined && now < state.refusals.agents ? state.refusals.agents : undefined
  const paused = state.fuseUntil !== undefined && now < state.fuseUntil ? state.fuseUntil : undefined
  const refusal = state.denials.filter((d) => now - d.at < window).at(-1)

  const parts: string[] = []
  if (running > 0 || starts > 0) parts.push(`${running} sur ${config.agentMax} agents en cours`)
  if (starts > 0) parts.push(`${starts} sur ${config.rollingMax} lancements ces ${duration(window)}`)
  if (asking.agents) parts.push('vous demande de lancer des agents')
  if (asking.context) parts.push('vous demande sur la taille du contexte')
  if (declined !== undefined) parts.push(`nouveaux agents refusés jusqu’à ${shortClock(declined)}`)
  if (paused !== undefined) parts.push(`lancements d’agents suspendus jusqu’à ${shortClock(paused)}`)
  if (refusal) parts.push(`dernier refus ${shortClock(refusal.at)} : ${refusal.rule}`)
  if (parts.length === 0) return undefined

  const holding = asking.agents || asking.context || declined !== undefined || paused !== undefined || refusal !== undefined
  const full = running >= config.agentMax || starts >= config.rollingMax
  return { text: `Garde d’utilisation · ${parts.join(' · ')}`, alert: holding || full }
}

/** When the band changes with no event to redraw it: a start, a refusal, a decline or the pause ages out. */
export function bandExpiry(state: SessionState, peers: readonly PeerRecord[], config: Config, now: number): number | undefined {
  if (!config.enabled) return undefined
  const window = config.windowMs
  const aging = [...state.starts, ...peers.flatMap((p) => p.starts), ...state.denials.map((d) => d.at)].map((t) => t + window)
  const later = [...aging, state.refusals.agents, state.fuseUntil].filter((t): t is number => t !== undefined && t > now)
  return later.length > 0 ? Math.min(...later) : undefined
}

/** When the line changes with no event to redraw it: an allow or the fuse ends, or the most-used plan window resets. */
export function statusLineExpiry(state: SessionState, peers: readonly PeerRecord[], config: Config, now: number): number | undefined {
  if (!config.enabled) return undefined
  const times = [state.override?.until, state.fuseUntil, highestLimit(state, peers, now)?.resetsAt]
  const later = times.filter((t): t is number => t !== undefined && t > now)
  return later.length > 0 ? Math.min(...later) : undefined
}

/** What is lifted or paused now, worded alike in the status line and the report. */
function liftedOrPaused(state: SessionState, now: number): string[] {
  const parts: string[] = []
  if (state.override && now < state.override.until) {
    parts.push(`${scopeName(state.override.scope)} levées jusqu’à ${shortClock(state.override.until)}`)
  }
  if (state.fuseUntil !== undefined && now < state.fuseUntil) {
    parts.push(`lancements d’agents suspendus jusqu’à ${shortClock(state.fuseUntil)}`)
  }
  return parts
}

export function scopeName(scope: Scope): string {
  if (scope === 'agents') return 'limites des agents'
  if (scope === 'context') return 'limites de contexte'
  return 'toutes les limites'
}

/** The text `/agent-guard` and `/agent-guard status` print. */
export function statusReport(
  state: SessionState,
  peers: readonly PeerRecord[],
  config: Config,
  now: number,
  problems: readonly string[],
  version?: string,
  storeFailure?: string,
): string {
  const running = version ? ` (${version})` : ''
  if (!config.enabled) return `Désactivé${running} : AGENT_GUARD est réglé pour le désactiver.`
  const window = config.windowMs
  const lines = [`Activé${running}.`]

  const peerRunning = peers.reduce((sum, p) => sum + p.running, 0)
  const starts = countOnMachine(state, peers, 'starts', now, window)
  lines.push(
    `Agents : ${runningAgents(state)} en cours ici, ${peerRunning} dans ${count(peers.length, 'autre session')} (limite ${config.agentMax}) ; ${starts} lancements ces ${duration(window)} (limite ${config.rollingMax}).`,
  )

  const limits = Object.values(state.limits).filter((r) => r.resetsAt === undefined || r.resetsAt > now)
  if (limits.length > 0) {
    const text = limits
      .map((r) => `${windowName(r.kind)} ${r.percent}%${r.resetsAt === undefined ? '' : ` (réinitialisation à ${shortClock(r.resetsAt)})`}`)
      .join(', ')
    lines.push(`Fenêtres du forfait : ${text}. Les nouveaux agents demandent confirmation à partir de ${config.limitAskPercent} % et sont refusés à partir de ${config.limitDenyPercent} %.`)
  } else {
    lines.push('Fenêtres du forfait : aucune lecture pour l’instant (une arrive avec la prochaine réponse sur un abonnement).')
  }

  const context = state.loops[MAIN]?.context
  lines.push(
    `Contexte : ${context === undefined ? 'inconnu jusqu’à la prochaine réponse' : `${tokens(context)} jetons`} (avertissement à ${tokens(config.contextWarn)}, confirmation avant un prompt à partir de ${tokens(config.contextHard)}).`,
  )

  const held = liftedOrPaused(state, now)
  for (const [key, until] of Object.entries(state.leases)) {
    if (now < until) held.push(`${key} approuvé${until < Number.MAX_SAFE_INTEGER ? ` jusqu’à ${shortClock(until)}` : ' jusqu’à la réduction du contexte'}`)
  }
  for (const [key, until] of Object.entries(state.refusals)) if (now < until) held.push(`${key} refusé jusqu’à ${shortClock(until)}`)
  if (held.length > 0) lines.push(`Actuellement : ${held.join(' ; ')}.`)
  for (const problem of problems) lines.push(`Configuration : ${problem}.`)
  if (storeFailure !== undefined) {
    lines.push(`Stockage : la garde n’a pas pu enregistrer ses comptages (${storeFailure}), donc les autres sessions de cette machine ne comptent pas les agents de cette session. Le journal peut aussi manquer des lignes.`)
  }
  lines.push('', USAGE)
  return lines.join('\n')
}

export const USAGE = [
  'Commandes :',
  '  /agent-guard allow [agents|context] [minutes]   lever les limites de la garde pour cette session (par défaut : toutes, 10 min)',
  '  /agent-guard pause [minutes]                     identique à allow, pour toutes les limites',
  '  /agent-guard resume                              mettre fin plus tôt à allow ou pause et effacer les refus',
  '  /agent-guard report [days]                       ce que la garde a fait sur cette machine (7 jours par défaut)',
  '  /agent-guard simulate <rule>                     montre l’effet d’une règle, sans blocage ni consommation',
  '  /agent-guard status                              ce résumé',
].join('\n')
