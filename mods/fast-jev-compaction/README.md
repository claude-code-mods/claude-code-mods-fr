# fast-jev-compaction

Plugin Claude Code qui remplace le résumé de compaction par les décisions de Jev : chaque appel d'outil et son résultat sont notés en une requête rapide, les obsoletes sont supprimés ou tronqués, tout ce qui est conservé reste verbatim. Utilisable aussi comme bibliothèque npm.

## Quoi et pourquoi

La plupart des compactages de contexte demandent à un LLM de résumer les anciens tours. Un résumé est lossy : un chemin de fichier, une erreur exacte, une contrainte ou une commande peuvent disparaître même s'ils importent plus tard. Cette bibliothèque ne réécrit jamais rien. Elle supprime uniquement les appels d'outil et les résultats d'outil que Jev juge inutiles, et elle interroge Jev en lui montrant toute la conversation. Le texte utilisateur et assistant reste verbatim et dans l'ordre.

Le dépôt est à la fois un paquet npm (`src/`) et un plugin Claude Code (`hooks/`, `.claude-plugin/`) qui utilise le paquet pour remplacer le résumé de compaction intégré de Claude Code par les messages d'origine.

## Comment ça marche

1. Chaque `tool_use` est associé à son `tool_result` par `tool_use_id`. Les appels du premier message ou des `preserveRecentMessages` messages les plus récents sont épinglés et jamais touchés.
2. L'**état** envoyé à Jev est toute la conversation jusqu'ici, du plus ancien au plus récent, avec chaque résultat d'outil remplacé par une courte note (`ok, 4213 chars (omitted)`). Les entrées d'outil sont incluses, les textes sont inclus, rien n'est résumé.
3. L'état est ajusté à `maxStateTokens` (25 k par défaut) par étapes, chacune appliquée seulement si la précédente n'a pas suffi : entrées d'outil tronquées à 1000, puis 200, puis 60 caractères ; textes longs abrégés en tête + queue, les messages non épinglés les plus anciens en premier ; anciens messages non épinglés réduits à une note `[… N chars omitted …]` ; anciens appels d'outil réduits à une ligne chacun (`t12 Read file_path=src/a.ts → ok 480ch`) ; anciens messages sans appel laissés de côté ; suites d'anciens messages avec appel seul repliées en une entrée. S'il ne rentre toujours pas, la compaction lève une erreur. Les jetons sont estimés sans tokenizer (un mot pour six lettres, un demi-jeton par chiffre, ~un par autre symbole), calibrés pour atterrir un peu au-dessus des comptes rapportés par Jev.
4. Pour chaque appel non épinglé, Jev reçoit deux questions `noul` : l'**appel** doit-il rester (savoir qu'il a été fait, avec son entrée, importe encore), et le **résultat** doit-il rester verbatim (son contenu est encore nécessaire et relancer l'outil ne le ferait pas).
5. Les questions sont réparties en autant de requêtes que nécessaire pour que l'état plus les questions reste sous `maxRequestTokens` (30 k par défaut, sous la limite de requête de 32 k de Jev). Le même état complet est renvoyé avec chaque requête ; les requêtes s'exécutent en parallèle et leurs réponses sont fusionnées.
6. Décisions par appel, selon `keepThreshold` :
   - `keepResult ≥ threshold` → garder l'appel et le résultat ;
   - sinon `keepCall ≥ threshold` → garder l'appel, tronquer le résultat à ses `truncateHeadChars` premiers caractères plus une note d'une ligne ;
   - sinon → supprimer l'appel avec son résultat.
7. La liste de messages est reconstruite : un message qui perd tout son contenu est supprimé, les messages intacts sont renvoyés comme les mêmes objets, et aucun résultat n'est jamais laissé sans son appel.

Les échecs de Jev, les réponses mal formées, une clé manquante ou un historique impossible à ajuster lèvent une erreur ; l'appelant (ou le hook Claude Code) décide du repli.

## Installation et utilisation

```sh
npm install fast-jev-compaction
export TYPESAFE_API_KEY=...
```

```ts
import { compactMessages, reductionRatio, type Message } from 'fast-jev-compaction';

const transcript: Message[] = [
  { role: 'user', text: 'Fix the failing test. Never edit src/generated.', toolUses: [] },
  {
    role: 'assistant',
    text: '',
    toolUses: [{ tool_use_id: 'toolu_1', tool: 'Read', input: { file_path: 'src/a.ts' } }],
  },
  { role: 'user', text: '', toolUses: [], toolResults: [{ tool_use_id: 'toolu_1', text: '…file…' }] },
  // …
];

const result = await compactMessages(transcript, { preserveRecentMessages: 4 });
console.log(result.messages, result.decisions, result.stats);
if (reductionRatio(result) < 0.25) {
  // not worth it: keep the original transcript, or summarize instead
}
```

`Message` est un sous-ensemble de `SessionMessage` de Claude Code, donc une transcription de session peut être passée telle quelle.

Pour apporter votre propre transport, implémentez `JevAsker` (une méthode `ask(state, questions)`) et appelez `compact(messages, asker, options)` ; `buildJevRequest` et `parseJevResponse` vous donnent le corps de la requête HTTP et la validation de la réponse. Les blocs de construction (`collectToolCalls`, `fitState`, `batchCalls`, `decideCall`, `applyDecisions`) sont aussi exportés.

`apiKey` vaut `process.env.TYPESAFE_API_KEY` par défaut. Ne commitez jamais la clé ni ne la mettez dans un fichier source.

## Options

| Option | Par défaut | Description |
| --- | --- | --- |
| `apiKey` | `TYPESAFE_API_KEY` | Clé API TypeSafe (`compactMessages`/`JevClient`) |
| `model` | `jev-latest` | Nom du modèle Jev |
| `baseUrl` | `https://api.typesafe.ai/v1/systemone` | Point de terminaison System One |
| `fetch` | fetch natif `fetch` | Implémentation fetch injectable pour les tests |
| `goal` | 3 derniers prompts utilisateur | Description de la tâche en cours incluse dans l'état |
| `keepThreshold` | `0.5` | Probabilité minimale de conservation pour qu'un appel ou un résultat reste |
| `preserveRecentMessages` | `6` | Messages les plus récents jamais touchés (le premier est toujours conservé) |
| `maxStateTokens` | `25000` | Plafond estimé de jetons pour l'état |
| `maxRequestTokens` | `30000` | Plafond estimé pour l'état plus un lot de questions |
| `truncateHeadChars` | `300` | Caractères d'un résultat d'outil supprimé conservés avant sa note |

`result.stats` rapporte les nombres de messages et de caractères avant et après, les comptes de décisions par raison, la taille de l'état en jetons estimés, l'étape d'ajustement nécessaire et le nombre de requêtes.

## Limitations

- Seuls les appels d'outil et leurs résultats sont candidats ; les messages texte ne sont jamais supprimés ni raccourcis dans la sortie (ils ne sont abrégés que dans l'état vu par Jev).
- Les tailles de jetons sont des estimations à partir des nombres de caractères, pas un tokenizer.
- Le calibrage se fait au niveau de la requête ; une probabilité n'est pas la preuve qu'un résultat est sûr à supprimer. L'assistant peut toujours relancer l'outil.
- L'état complet est répété avec chaque requête, donc un historique proche du plafond de l'état coûte une requête par poignée de questions.

## Plugin Claude Code

La racine du dépôt est un plugin à hooks de fonction Claude Code : `hooks/fast-jev.ts` est un adaptateur léger qui fait passer les transcriptions `session.compact` par `src/` et retombe sur le résumé intégré de Claude Code en cas d'erreur ou de réduction insuffisante. Voir [`hooks/README.md`](hooks/README.md) pour la configuration et la référence de types Claude Code 2.1.274.

### Installation dans Claude Code

Les hooks de fonction sont une fonctionnalité d'accès anticipé de Claude Code (2.1.274+), donc le drapeau d'opt-in doit être défini partout où Claude Code s'exécute, par exemple dans `~/.claude/settings.json` :

```json
{ "env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1", "TYPESAFE_API_KEY": "<your key>" } }
```

Puis ajoutez ce dépôt comme marketplace de plugin et installez le plugin, soit depuis le shell, soit comme commandes slash dans une session :

```sh
claude plugin marketplace add tamaratran/fast-jev-compaction
claude plugin install fast-jev-compaction@fast-jev-compaction
```

L'installation demande les options du plugin (clé API, seuils, `truncateHeadChars`, …) ; laissez-les à leurs valeurs par défaut pour utiliser `TYPESAFE_API_KEY` depuis l'environnement. Redémarrez Claude Code ou lancez `/reload-plugins`. Dès lors `/compact` (et la compaction automatique) passe par Jev : le toast affiche `fast-jev-compaction: kept N/M messages, no summary (…)` quand l'historique élagué a remplacé le résumé intégré, ou `fallback to built-in summary (…)` quand Jev n'a pas pu supprimer assez (sessions courtes, ou en cas d'échec).

Pour exécuter depuis un checkout sans installer : `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir .` depuis la racine du dépôt. Aucune étape de publication n'est requise ; le marketplace n'est que le `.claude-plugin/marketplace.json` du dépôt.

## Développement

```sh
npm install
npm run typecheck        # library + hook
npm test
npm run build
npm run validate:plugin  # claude plugin validate
TYPESAFE_API_KEY="$(cat ~/.typesafe_key)" npm run demo
```

Les tests unitaires utilisent un Jev factice et ne contactent jamais TypeSafe. La démo est la vérification réseau réelle.

## Démo animée (macOS)

`demo/JevDemo` est une petite application native SwiftUI qui joue une version scénarisée et dramatisée du flux de compaction dans un terminal de style Claude Code : les appels d'outil d'une transcription préparée sont notés, les résultats et appels que Jev laisse tomber deviennent rouges et s'effondrent, et le reste reste verbatim. Elle n'appelle jamais l'API ; elle existe pour être enregistrée à l'écran.

```sh
demo/JevDemo/build.sh   # builds demo/JevDemo/build/JevDemo.app and launches it
```

Appuyez sur espace dans l'application pour rejouer depuis le début.
