# prismantis

Un mod Claude Code qui redessine les réponses de Claude en couleur : tableaux, titres, listes, citations, code coloré, nombres, chemins et liens, diagrammes et graphiques mermaid, ainsi que les lignes d'outils, en 17 thèmes, avec des boutons de copie. Exécutez `/prismantis setup` pour choisir un aspect, ou `/prismantis demo` pour voir tout ce qu'il dessine.

Captures d'écran, toutes les options et le journal des modifications se trouvent dans [full README](https://github.com/NahumLitvin/prismantis#readme).

## Ce qu'il exécute, lit et modifie

Prismantis n'effectue aucun appel réseau. Tout ce qui suit reste sur votre machine.

- **Programmes.** Cliquer sur `⧉ html` ou `▣ png` exécute l'utilitaire de presse-papiers avec le tableau, le diagramme ou la figure copié sur l'entrée standard : `osascript` sur macOS, `powershell.exe` sur Windows (il lit `SystemRoot` pour le trouver) ou `copyq` sur Linux. Quand `latex` est activé, il exécute `ratex-render` depuis votre `PATH` avec les formules de la réponse sur l'entrée standard. Il n'exécute rien d'autre.
- **Fichiers.** Il lit un PNG local lié par une réponse comme image Markdown, jusqu'à 2 Mo, pour l'afficher dans kitty ou Ghostty. Il relit les PNG écrits par `ratex-render` dans `$TMPDIR/prismantis-latex-<session>-<id>`. Il n'écrit aucun fichier lui-même.
- **Paramètres.** `/prismantis setup` et `/prismantis theme` enregistrent votre choix via `/config`, uniquement dans les options propres à prismantis (`prismantis.theme`, `prismantis.tableStyle` et les autres étapes de configuration). Rien d'autre dans vos paramètres n'est modifié.
- **Couleurs de l'application de bureau.** Uniquement lorsque `desktopColors` vaut `match` : au démarrage de la session et lors de `/prismantis theme`, il applique à la session les couleurs de l'application de bureau via `$.theme.set`, à partir de la palette courante. Remettre `desktopColors` sur `off` appelle `$.theme.clear()` une fois. Il n'efface jamais les couleurs au démarrage de la session ni lors d'un rechargement.
- **Hooks.** Il dessine via `ui.render`, répond à la commande `/prismantis` via `command.run`, surveille sa propre entrée `desktopColors` dans `config.set`, ajoute la note [diagram hints](https://github.com/NahumLitvin/prismantis#diagram-hints) réservée au modèle et, quand `keyPointHint` est activé, la note sur les points clés dans `prompt.submit`, et ajoute `$.prismantis.markdown` pour [other mods](https://github.com/NahumLitvin/prismantis#other-mods) dans `engine.create`. `prismantis.markdown` est l'événement propre à cet appel.

## Licence

[MIT](LICENSE), par Nahum Litvin. Le code et les palettes tiers fournis sont crédités dans [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
