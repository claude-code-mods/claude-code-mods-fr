# Token Optimizer Desktop

Une barre d'état pour l'application de bureau Claude. Elle s'affiche au-dessus de votre prompt et montre la qualité de la session, le remplissage du contexte, le compte à rebours du cache ainsi que vos limites sur 5 heures et hebdomadaire, avec Clawd qui mime ce que fait la session.

## Installation

Elle est fournie dans le plugin Token Optimizer (`hooks/hooks.json` nomme le `hooks/register.tsx` de ce dossier sous `modules`) : rien de supplémentaire à installer. Ce dossier ne conserve son propre manifeste que pour que ses tests s'exécutent seuls avec `claude plugin test`. `npm run typecheck` et `npm test` couvrent les modules purs (CI) ; `npm run typecheck:engine` vérifie `hooks/` et `tests/engine/` par rapport aux déclarations de l'API des plugins de Claude Code, qui ne sont écrites que par la CLI Claude ; il s'exécute donc localement.

Nécessite Claude Code 2.1.287 ou une version plus récente et la fonctionnalité mods d'Anthropic. Anthropic peut désactiver les mods à distance ; dans ce cas, rien ne casse, la barre ne s'affiche simplement pas. Le terminal conserve sa ligne d'état existante. VS Code n'est pas pris en charge.

Pour vérifier qu'elle est active, ouvrez une session de bureau Claude avec le plugin Token Optimizer activé. Cherchez la bande Token Optimizer au-dessus du prompt, avec Clawd et le compte à rebours du cache. Si elle est absente, vérifiez que le plugin est activé, que les mods sont disponibles et que `TOKEN_OPTIMIZER_STATUS_BAR` n'est pas `0`, puis redémarrez la session. Le `hooks/hooks.json` du plugin enregistre `desktop/token-optimizer-desktop/hooks/register.tsx`.

Pour vérifier la réservation sans utiliser votre session, exécutez `python3 <plugin>/skills/token-optimizer/scripts/measure.py mod-action --selftest`. Cela affiche `PASS` ou `FAIL` et utilise un répertoire de données temporaire. Les diagnostics des actions échouées sont enregistrés dans le répertoire de données de Token Optimizer sous le nom `mod-actions.log`.

## Ce que vous obtenez

- Une phrase sur la chose la plus urgente, avec au plus un bouton.
- Cinq repères avec des cartes au survol : note de qualité, remplissage du contexte, compte à rebours du cache, limite sur 5 heures, limite hebdomadaire.
- La **flèche à côté de Clawd** déplie une ligne supplémentaire : branche, durée de la session, appels d'outils, compactages (s'il y en a), date du dernier point de sauvegarde (de n'importe quel type, ou un point pertinent d'une session précédente), et les jetons que Token Optimizer vous a économisés ces 30 derniers jours, le même total que celui affiché par le tableau de bord.
- Boutons : **Nettoyer** (compacte selon les conseils de Token Optimizer), **Repartir de zéro** (un second clic enregistre un point de sauvegarde, efface et transmet votre premier message), **Garder au chaud** (rafraîchissement manuel du cache en un clic, uniquement tant que le cache est chaud, jamais automatique, consomme une petite quantité d'usage).
- **Tableau de bord complet** : un lien en texte brut à la fin de la ligne dépliée, dans les deux tailles de bande (la bande repliée ne l'affiche pas). Un clic exécute `measure.py dashboard`, la même commande que la compétence `token-dashboard` : il régénère la page du tableau de bord et l'ouvre dans votre navigateur par défaut (`open` sur macOS, `xdg-open` sur Linux, l'association de fichiers sur Windows). Pendant l'exécution, la bande affiche « Opening the dashboard. » ; en cas d'échec, elle affiche « Could not open the dashboard. » pendant quelques secondes et ne fait rien d'autre. Un second clic pendant l'exécution est ignoré. Le lien est un Button dessiné avec le style `plain` (sa propriété figure sur la liste autorisée des Button du moteur de Claude Code 2.1.287, 2.1.294 et 2.1.296, lue dans les chaînes de chaque build ; exécuter sur 2.1.294 à 2.1.296). Le clic exécute `measure.py dashboard --user` : `--user` marque le clic comme provenant d'une personne afin que le budget de hook de 20 secondes n'interrompe pas une reconstruction lourde (environ 80 secondes à froid sur un historique réellement volumineux), et la bande attend jusqu'à 5 minutes. Seul ce lien attend aussi longtemps : Nettoyer et Repartir de zéro abandonnent toujours après 2 minutes.

Le compte à rebours du cache est une estimation : 1 heure sur les forfaits Claude, 5 minutes sur l'API, mesurée autant que possible à partir de la session elle-même.

## Paramètres

`TOKEN_OPTIMIZER_STATUS_BAR=0` masque la barre et `TOKEN_OPTIMIZER_STATUS_BAR_ANIMATE=0` garde Clawd immobile, à définir dans le bloc `env` de `~/.claude/settings.json`. `TOKEN_OPTIMIZER_STATUS_BAR_TIME_FORMAT=24h` (ou `12h`) force l'horloge utilisée pour les heures de renouvellement des limites ; si la variable n'est pas définie, elles suivent votre locale.

Le bouton `–` à côté de la flèche réduit la bande à une ligne et `+` la rétablit ; la flèche déplie toujours la ligne de détails située en dessous, et le choix est mémorisé d'une session et d'un redémarrage à l'autre. `TOKEN_OPTIMIZER_STATUS_BAR_SIZE=slim` définit la taille initiale avant qu'un choix soit enregistré, et la ligne d'état du terminal utilise la même variable pour n'afficher qu'une ligne.

Le repère de contexte se mesure à votre propre fenêtre de compactage si vous en définissez une : `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, `/autocompact` ou le paramètre `autoCompactWindow`, dans les limites de 100 K à 1 M de Claude Code et jamais au-dessus de la fenêtre du modèle. Une fenêtre fournie uniquement avec `--autocompact` pour un seul lancement n'est pas visible.

## Documentation complète

Voir [Token Optimizer README](../../README.md#desktop-status-bar) et la page du site de documentation « Claude desktop app ».

Pour réserver une tentative de maintien au chaud via la CLI, envoyez un reçu JSON sur l'entrée standard :

```bash
printf '%s' '{"action":"warm-prepare","action_id":"ATTEMPT_ID","session_id":"SESSION_ID","timestamp":UNIX_SECONDS,"transcript_path":"/path/to/SESSION_ID.jsonl","byte_size":FILE_SIZE,"transcript_mtime":FILE_MTIME}' | python3 <plugin>/skills/token-optimizer/scripts/measure.py mod-action
```

Remplacez les espaces réservés par la taille de fichier exacte et la date de modification de la transcription courante, un identifiant de tentative unique et l'heure Unix actuelle. La réponse est un JSON. Cela réserve la tentative ; l'appelant doit ensuite effectuer la requête de réchauffement et soumettre son usage comme reçu `warm`, ou envoyer `warm-cancel` si la requête n'a pas lieu.
