// What the band, `/agentctl` and `/agentctl policy|events` say (requirements FR-2, FR-3, FR-17,
// FR-23; tech spec § 3.3). Pure: every input arrives as data, every line names its source and age,
// and a field whose source did not answer says so instead of showing a value.

import { checkLine } from './firstrun.js'
import { digest } from './fingerprint.js'
import { sanitize } from './sanitize.js'

// The opaque key evidence for a declared check is stored under: arguments never become a stored
// identifier in plaintext.
export function checkKey(argv) {
  return 'check-' + digest(argv.join('\u0000'))
}

// Evidence counts as current only when the check reported no error, the tree did not change during
// the run, the run's reading matches the last one, and no reading was partial.
export function evidenceCurrent(ev, fingerprint) {
  if (!fingerprint || !ev || ev.outcome !== 'ok' || !ev.before || !ev.after) return false
  if (ev.before.value !== ev.after.value || ev.after.value !== fingerprint.value) return false
  return ![ev.coverage, ev.before.coverage, ev.after.coverage, fingerprint.coverage].includes('partial')
}

// Where the task's declared checks stand on the current tree: how many there are, how many have run
// at all, and which are not current (never run, failed, or stale).
export function checkProgress(task, evidence, fingerprint) {
  const rows = (task?.executors ?? []).filter((e) => e.check).map((e) => {
    const ev = evidence?.[checkKey(e.argv)]
    // Never shortened: the line is one Claude runs, and a cut command would not match the check.
    return { argv: sanitize(checkLine(e.argv), Infinity), ran: Boolean(ev), current: evidenceCurrent(ev, fingerprint) }
  })
  return { declared: rows.length, ran: rows.filter((r) => r.ran).length, pending: rows.filter((r) => !r.current).map((r) => r.argv) }
}

// The four states a field can be in (FR-3).
export function field(label, reading, now) {
  if (!reading) return `${label} : absent`
  if (reading.failed) return `${label} : indisponible (${reading.failed})`
  const age = Math.max(0, Math.round((now - reading.at) / 1000))
  const stale = reading.staleAfterMs !== undefined && now - reading.at > reading.staleAfterMs
  return `${label} : ${reading.value} — ${reading.source}, il y a ${age} s${stale ? ' (obsolète)' : ''}`
}

// review-state.js check --format=json → a gate reading. A gate pass is a gate pass, never a test pass.
export function gateReading(run, at) {
  if (typeof run === 'string') return { failed: run, at }
  if (!run || run.exitCode !== 0) return { failed: `vérification terminée avec ${run ? run.exitCode : 'sans résultat'}`, at }
  let s
  try { s = JSON.parse(run.stdout) } catch { return { failed: 'pas du JSON', at } }
  const word = (p) => (!p ? '?' : p.passed ? '✅' : p.verdict === 'fail' && p.digest_match ? '⛔' : p.noted && !p.digest_match ? '⏳ obsolète' : p.owed ? '⏳ dû' : '·')
  return { value: `code ${word(s.code_review)} · doc ${word(s.doc_review)} · precommit ${word(s.precommit)}`, source: 'vérification review-state.js', at }
}

// Usage windows are read by kind; a missing window is missing, never 0%. One account's windows are
// shown for this session only and never summed with other sessions.
export function usageReading(usage, kind, at) {
  if (!usage) return null
  const w = (usage.rateLimits ?? []).find((r) => r.kind === kind)
  if (!w) return null
  return { value: `${Math.round(w.percentUsed)} %${w.resetsAt ? ` (réinitialisation ${w.resetsAt})` : ''}`, source: `utilisation de la session (${w.source ?? 'hôte'})`, at }
}

export function contextReading(usage, at) {
  const p = usage?.context?.percent
  return typeof p === 'number' ? { value: `${Math.round(p)}%`, source: 'utilisation de la session', at } : null
}

function evidenceLines(evidence, currentFingerprint, now) {
  const out = []
  for (const ev of Object.values(evidence ?? {})) {
    const fresh = currentFingerprint && ev.after && ev.after.value === currentFingerprint.value && ev.before && ev.before.value === ev.after.value
    const state = ev.outcome === 'backgrounded' ? 'lancé, achèvement non observé'
      : ev.outcome === 'refused' ? 'refusé'
      : !ev.after || !ev.before ? 'preuve indisponible'
      : ev.before.value !== ev.after.value ? 'arbre modifié pendant l’exécution — non lié'
      : fresh && [ev.coverage, ev.before.coverage, ev.after.coverage, currentFingerprint.coverage].includes('partial') ? 'correspond, mais une lecture était partielle'
      : fresh ? 'à jour'
      : 'obsolète (arbre modifié depuis)'
    const age = Math.max(0, Math.round((now - ev.at) / 1000))
    out.push(`  ${sanitize(ev.requested, 120)}: ${ev.outcome === 'ok' ? 'aucune erreur signalée' : ev.outcome} · ${state} · ${ev.coverage ?? 'couverture inconnue'} · il y a ${age} s`)
  }
  return out
}

const REASON_LABEL = {
  input: 'en attente de votre saisie',
  permission: 'en attente d’une décision de permission',
  'policy-denied': 'refusé par la politique de la tâche',
  'rate-limit': 'limite de débit atteinte',
  'suspected-stall': 'aucune activité (blocage non confirmé)',
}

function interventionLines(state, now) {
  return Object.entries(state.interventions ?? {}).map(([reason, v]) => {
    const age = Math.max(0, Math.round((now - v.since) / 1000))
    const detail = typeof v.detail === 'string' ? sanitize(v.detail, 120) : v.detail?.resetsAt ? `réinitialisation ${v.detail.resetsAt}` : ''
    return `  ${REASON_LABEL[reason] ?? reason}${detail ? ` — ${detail}` : ''} · depuis ${age} s`
  })
}

// Compact by default — it reaches Claude — and the diagnostic lines on `/agentctl status --details`.
// Labels say what they measure (found in a first-run test: "Observation: ok" read as "work passed").
export function statusText(m, { details = false } = {}) {
  const { now, task, state } = m
  const lines = []
  lines.push(task ? `Tâche : ${sanitize(task.goal, 120)} (${task.id})` : 'Tâche : aucune liée')
  const iv = interventionLines(state, now)
  lines.push(iv.length ? 'Nécessite une attention :' : 'Nécessite une attention : rien observé')
  lines.push(...iv)
  lines.push(field('Portes de revue', m.gate, now))
  const ev = evidenceLines(m.evidence, m.fingerprint, now)
  lines.push(ev.length ? 'Preuves d’exécution (pas un verdict de revue) :' : 'Preuves d’exécution : aucune vérification déclarée n’a été lancée')
  lines.push(...ev)
  const bg = Object.entries(state.background ?? {}).filter(([, b]) => b.status === 'started' || b.status === 'in-flight')
  if (bg.length) lines.push(`Tâches en arrière-plan en cours : ${bg.length} (${bg.map(([id]) => id).join(', ')})`)
  if (!details) {
    lines.push('Suite : /agentctl status --details · /agentctl help')
    return lines.join('\n')
  }
  lines.push(`Stockage d’état : ${m.health === 'ok' ? 'sain' : m.health}`)
  lines.push(`Exécution : ${state.runtime.value}${state.runtime.tool ? ` (${state.runtime.tool})` : ''} depuis ${Math.max(0, Math.round((now - state.runtime.since) / 1000))} s · phase ${state.phase.value} · résultat ${state.result.value}`)
  // A usage reading arrives with Claude's first reply in the session; before that it is absent.
  const usage = (label, r) => (r ? field(label, r, now) : `${label} : absent (lu après la première réponse de Claude)`)
  lines.push(usage('Contexte', m.context))
  lines.push(usage('Fenêtre 5 h', m.fiveHour))
  return lines.join('\n')
}

export function bandText(m) {
  const { task, state, now } = m
  const iv = Object.keys(state.interventions ?? {})
  const attention = iv.length ? `⚠ ${iv.map((r) => REASON_LABEL[r] ?? r).join(', ')}` : 'aucune attention nécessaire'
  const head = task ? `agentctl · ${sanitize(task.goal, 40)}` : 'agentctl · aucune tâche'
  const rt = `${state.runtime.value}${state.runtime.tool ? `:${state.runtime.tool}` : ''} ${Math.max(0, Math.round((now - state.runtime.since) / 1000))}s`
  let gate = 'portes absentes'
  if (m.gate?.failed) gate = 'portes indisponibles'
  else if (m.gate) {
    const age = Math.max(0, Math.round((now - m.gate.at) / 1000))
    const stale = m.gate.staleAfterMs !== undefined && now - m.gate.at > m.gate.staleAfterMs
    gate = `${m.gate.value} (${age} s${stale ? ', obsolète' : ''})`
  }
  const resume = m.checkpoint ? ` · dernière transmission ${new Date(m.checkpoint.savedAt).toISOString()}` : ''
  const proposal = m.pending ? ` · brouillon ${m.pending.digest.slice(0, 8)} en attente — /agentctl accept` : ''
  return `${head} · ${rt} · ${attention} · ${gate}${proposal}${resume}${m.health === 'ok' ? '' : ` · ${m.health}`}`
}

export const LIMITS = [
  'Ce module contrôle et affiche, il n’est pas une frontière d’isolement ; l’accès en lecture seule en production est garanti par les identifiants et les permissions propres à la cible.',
  'Si l’hôte ignore le hook de ce module (plantage du worker, module désactivé), rien ici ne refuse ; gardez les commandes dangereuses nommées dans vos règles permissions.deny.',
  'Les règles de permission natives correspondent au texte de la commande, non aux programmes ; un autre module peut modifier un verdict lors de tool.check.',
  'Les exécuteurs autorisés s’exécutent sans classification de leurs effets.',
]

export function policyText(task) {
  if (!task) return ['Aucune tâche liée : les catégories intégrées d’écriture en production et d’écriture git distante sont toujours refusées ; tout le reste suit le flux de permissions de l’hôte.', ...LIMITS].join('\n')
  const one = (x) => (Array.isArray(x) ? x.join(' ') : Array.isArray(x?.argv) ? x.argv.join(' ') + (x.check ? ' (vérification)' : '') : String(x))
  const fmt = (xs) => (xs?.length ? xs.map((x) => sanitize(one(x), 200)).join('; ') : 'aucun')
  return [
    `Tâche ${task.id} · version de politique ${task.policyVersion ?? 1}`,
    ...(task.recordMissing ? ['L’enregistrement de la tâche liée est absent : tout sauf les lectures dans l’arbre de travail est refusé. Définissez à nouveau la tâche.'] : []),
    `Arbre de travail : ${sanitize(task.worktree, 200)}`,
    `Modifications : ${(task.allow ?? []).includes('edit') ? `autorisées dans ${fmt(task.editRoots ?? ['.'])}` : 'non autorisées'}`,
    `Interdits (tâche) : ${fmt(task.forbid)} · en plus des catégories intégrées d’écriture en production et d’écriture git distante`,
    `Exécuteurs autorisés : ${fmt(task.executors)}`,
    `Nécessite une personne : ${fmt(task.needsUser)}`,
    `Autres outils autorisés : ${fmt(task.tools)}`,
    'Tout le reste suit le flux de permissions de l’hôte (ou le mode auto) : le module ne le classe pas',
    'Au mieux : le module lit chaque appel d’outil, jamais le contenu d’un script ni les commandes qu’il lance',
    ...LIMITS,
  ].join('\n')
}

export function eventsText(decisions, n, now) {
  const list = (decisions ?? []).slice(-n)
  if (!list.length) return 'Aucune décision enregistrée dans cette session.'
  return list.map((d) => `il y a ${Math.max(0, Math.round((now - d.at) / 1000))} s · ${d.outcome} · ${d.tool} · ${sanitize(d.requested, 160)} · ${sanitize(d.rule, 160)}`).join('\n')
}
