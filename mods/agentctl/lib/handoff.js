// Model-free hand-over (requirements FR-15, UC-6; tech spec § 3.4). Pure: built only from records.
// It answers the eight questions and keeps three sources apart: what the user confirmed (the task),
// what tools observed (operations, evidence), and what Claude only claimed (never stored as a fact,
// so the hand-over says plainly that nothing claimed is shown as verified).

import { CAPS, sanitize } from './sanitize.js'
import { HARD_FORBIDDEN } from './policy.js'
import { evidenceCurrent } from './view.js'

const s = (x, n = 200) => sanitize(x, n)

// Each section is { heading, items, fixed }: headings and `fixed` lines always appear; `items` fill the
// remaining budget in order and the rest is counted, so the size cap never drops a heading or the
// limits disclosure (INV-005) the way truncating the finished text would.
function assemble(head, sections, cap) {
  const fixedText = [...head, ...sections.flatMap((x) => ['', x.heading, ...x.fixed])].join('\n')
  const omitLine = (n) => `- … ${n} autres omis (limite de taille de la transmission)`
  let budget = cap - fixedText.length - sections.length * omitLine(99999).length
  const out = [...head]
  for (const x of sections) {
    out.push('', x.heading)
    let shown = 0
    for (const it of x.items) {
      if (it.length + 1 > budget) break
      out.push(it); budget -= it.length + 1; shown++
    }
    if (shown < x.items.length) out.push(omitLine(x.items.length - shown))
    out.push(...x.fixed)
  }
  return out.join('\n')
}

export function handoff({ task, state, evidence, fingerprint, decisions, now, sessionId }) {
  // When the last tree reading was taken: the hand-over starts no process, so it never re-reads.
  const seenAt = typeof fingerprint?.at === 'number' ? ` au ${new Date(fingerprint.at).toISOString()}` : ''
  const head = [
    `# Transmission — ${task ? s(task.goal, 120) : 'aucune tâche liée'}`,
    '',
    `Générée à partir d’enregistrements structurés le ${new Date(now).toISOString()} (session ${s(sessionId, 60)}) ; aucun modèle n’a été appelé.`,
  ]
  const sec = []
  sec.push({ heading: '## 1. Objectif', items: [], fixed: [task ? s(task.goal, 500) : 'Aucune tâche n’a été déclarée pour cette session.'] })
  const scope = []
  if (task) {
    scope.push(`- Arbre de travail : ${s(task.worktree)}`)
    scope.push(`- Modifications : ${(task.allow ?? []).includes('edit') ? `autorisées dans ${(task.editRoots ?? ['.']).map((r) => s(r)).join(', ')}` : 'non autorisées'}`)
    scope.push(`- Exécuteurs autorisés : ${(task.executors ?? []).map((e) => s(e.argv.join(' '))).join('; ') || 'aucun'}`)
    scope.push(`- Interdits : ${(task.forbid ?? []).map((f) => s(Array.isArray(f) ? f.join(' ') : f)).join('; ') || 'aucun'}, plus ${[...new Set(HARD_FORBIDDEN.map((h) => h.rule))].join(', ')}`)
    if (task.acceptance?.length) scope.push(`- Critères d’acceptation : ${task.acceptance.map((a) => s(a)).join('; ')}`)
  }
  sec.push({ heading: '## 2. Périmètre autorisé et interdit', items: scope, fixed: task ? [] : ['- Aucun périmètre n’a été déclaré.'] })
  const ops = Object.entries(state.ops ?? {})
  const edits = ops.filter(([, o]) => ['Write', 'Edit', 'NotebookEdit', 'MultiEdit'].includes(o.tool) && o.outcome === 'ok')
  sec.push({ heading: '## 3. Ce qui a changé', items: [], fixed: [
    fingerprint ? `- Arbre : HEAD ${s(fingerprint.head, 60)}, ${fingerprint.changedCount ?? '?'} chemin(s) modifié(s) ou non suivi(s) (${fingerprint.coverage})${seenAt ? `, lu${seenAt}` : ''}` : '- Arbre : non lu pour cette transmission',
    // Only the edit tools are counted here; a file changed through Bash shows in the tree line above
    // (found in an uncoached run: "Edits observed: 0" beside a changed README read as "nothing changed").
    `- Appels d’outils de modification cette session : ${edits.length} (les changements faits via Bash ne sont pas comptés ici ; la ligne de l’arbre fait foi)`,
  ] })
  const ev = Object.values(evidence ?? {})
  const matches = (e) => fingerprint && e.after && e.before && e.before.value === e.after.value && e.after.value === fingerprint.value && e.outcome === 'ok'
  // Partial coverage is never "verified": what a reading did not cover may have changed — the
  // before, the after and the last reading must each be complete. The same rule `/agentctl` uses.
  const current = (e) => evidenceCurrent(e, fingerprint)
  const verified = ev.filter(current).map((e) => `- ${s(e.requested)} — aucune erreur signalée, correspond à la dernière lecture de l’arbre${seenAt} (${e.coverage})`)
  sec.push({ heading: '## 4. Vérifié (preuve d’exécution sur la dernière lecture de l’arbre)', items: verified, fixed: verified.length ? [] : ['- Rien.'] })
  const notVerified = ev.filter((e) => !current(e)).map((e) => {
    const why = e.outcome === 'backgrounded' ? 'lancé, achèvement non observé' : e.outcome !== 'ok' ? `outcome ${e.outcome}` : !e.after || !e.before ? 'preuve indisponible' : e.before.value !== e.after.value ? 'arbre modifié pendant l’exécution' : matches(e) ? 'couverture partielle — une partie de l’arbre n’a pas été lue' : 'obsolète — l’arbre a changé depuis'
    return `- ${s(e.requested)} — ${why}`
  })
  sec.push({ heading: '## 5. Non vérifié', items: notVerified, fixed: ['- Tout ce que Claude a déclaré comme terminé, réussi ou corrigé sans preuve ci-dessus n’est que son propre jugement.'] })
  const open = ops.filter(([, o]) => o.endedAt === undefined && o.outcome !== 'refused')
  const bg = Object.entries(state.background ?? {}).filter(([, b]) => b.status === 'started' || b.status === 'in-flight')
  const running = [
    ...open.map(([id, o]) => `- ${s(o.requested)} (${o.tool}, ${o.outcome}) — ${id}`),
    ...bg.map(([id, b]) => `- tâche en arrière-plan ${s(id, 60)} — ${b.status}${b.asOf ? ` au ${new Date(b.asOf).toISOString()}` : ''}`),
  ]
  sec.push({ heading: '## 6. Encore en cours ou inconnu', items: running, fixed: running.length ? [] : ['- Rien n’a été observé comme encore en cours. Les processus non suivis ne peuvent être confirmés ni infirmés.'] })
  const iv = Object.keys(state.interventions ?? {})
  sec.push({ heading: '## 7. Prochaine étape', items: [], fixed: [iv.length ? `- À résoudre : ${iv.map((x) => s(x, 60)).join(', ')}` : '- Rien de consigné. Décidez d’après les sections 4 à 6.'] })
  const refused = (decisions ?? []).filter((d) => d.outcome === 'deny' || d.outcome === 'unknown' || d.outcome === 'needs-user-refused')
  sec.push({ heading: '## 8. Toujours non autorisé', items: [], fixed: [
    ...(refused.length ? refused.slice(-10).map((d) => `- ${s(d.requested)} — ${s(d.rule)}`) : ['- Aucun appel n’a été refusé cette session ; le périmètre interdit de la section 2 s’applique toujours.']),
    '- Les approbations précédentes ne sont pas reprises : à la reprise, chaque appel est reclassé et l’hôte demande à nouveau.',
    // INV-005: what this mod cannot refuse is disclosed here as in /agentctl policy, never silent.
    '- Limites : si l’hôte ignore le hook de ce module (plantage du worker, module désactivé), rien ici ne refuse ; un autre module peut modifier un verdict lors de tool.check. Les règles strictes appartiennent à permissions.deny.',
  ] })
  return assemble(head, sec, CAPS.handoff)
}
