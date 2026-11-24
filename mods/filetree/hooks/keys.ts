import type { RowSpec } from './rows'

export type ShortcutKey = { key: string; label: string; terminal?: true }
export type ShortcutGroup = { title: string; keys: ShortcutKey[] }

const GROUPS: readonly ShortcutGroup[] = [
  {
    title: 'Déplacement',
    keys: [
      { key: 'j / k', label: 'bas / haut' },
      { key: 'h / l', label: 'replier le parent / déplier' },
      { key: 'o, Enter', label: 'ouvrir un fichier ou basculer un dossier' },
      { key: 'z', label: 'aller à un dossier' },
      { key: 'Space', label: 'aperçu rapide (Quick Look) sur macOS', terminal: true },
    ],
  },
  {
    title: 'Recherche',
    keys: [
      { key: 's', label: 'placer le curseur dans la recherche' },
      { key: 'i', label: 'chercher dans le dossier sous le curseur' },
      { key: 'c / r', label: 'respecter la casse / expression régulière' },
      { key: 'q', label: 'chercher dans le contenu des fichiers plutôt que les noms' },
    ],
  },
  {
    title: 'Fichiers et actions',
    keys: [
      { key: 'd', label: 'diff' },
      { key: 'click', label: 'sélectionner une ligne' },
      { key: 'ctrl+click', label: 'ajouter ou retirer une ligne ; alt+clic sur macOS' },
      { key: 'shift+click', label: 'sélectionner la plage depuis l’ancre' },
      { key: 'shift+j / k', label: 'étendre la sélection vers le bas / le haut' },
      { key: 'v / V', label: 'ajouter ou retirer la ligne / effacer les marques' },
      { key: 'y / Y', label: 'copier le chemin relatif / absolu' },
      { key: 'u', label: 'copier le nom' },
      { key: 't', label: 'shell dans un volet tmux ou herdr' },
      { key: 'x', label: 'protéger des modifications de Claude' },
      { key: 'w', label: 'fichiers écrits hors du dépôt' },
    ],
  },
  {
    title: 'Affichage',
    keys: [
      { key: 'p', label: 'aperçu ou treemap', terminal: true },
      { key: 'f / b', label: 'feuilleter l’aperçu', terminal: true },
      { key: '[ / ]', label: 'page précédente / suivante d’un PDF ou Word', terminal: true },
      { key: 'a', label: 'repliage automatique' },
      { key: 'n / g / m', label: 'trier par nom / git / valeur' },
    ],
  },
  {
    title: 'Volet',
    keys: [
      { key: '?', label: 'afficher ou masquer cette liste', terminal: true },
      { key: 'ctrl+x tab', label: 'donner le clavier au volet', terminal: true },
      { key: 'alt+l', label: 'donner le clavier à l’arborescence', terminal: true },
      { key: 'alt+h', label: 'revenir à l’invite', terminal: true },
      { key: '/filetree keys', label: 'configurer alt+l et alt+h', terminal: true },
      { key: 'Esc', label: 'revenir à l’invite', terminal: true },
    ],
  },
]

export const SCROLL_KEYS: ReadonlySet<string> = new Set(['up', 'down', 'j', 'k', 'pageup', 'pagedown', 'f', 'b', 'home', 'end'])

export function shortcutGroups(desktop: boolean): ShortcutGroup[] {
  return GROUPS.map(g => ({ title: g.title, keys: g.keys.filter(k => !desktop || !k.terminal) })).filter(g => g.keys.length > 0)
}

export function shortcutRows(accent: string, muted: string): RowSpec[] {
  const groups = shortcutGroups(false)
  const width = Math.max(...groups.flatMap(g => g.keys.map(k => k.key.length))) + 2
  const rows: RowSpec[] = [{ id: '', left: [{ t: ' Raccourcis clavier', b: true, c: accent }], right: [{ t: '? ferme ', c: muted }] }]
  for (const g of groups) {
    rows.push({ id: '', left: [{ t: ' ' }], right: [] })
    rows.push({ id: '', left: [{ t: ` ${g.title}`, b: true }], right: [] })
    for (const k of g.keys) rows.push({ id: '', left: [{ t: `   ${k.key.padEnd(width)}`, c: accent }, { t: k.label }], right: [] })
  }
  return rows
}
