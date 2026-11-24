![claude-council](assets/banner.svg)

Un plugin Claude Code qui pose la même question à des agents de programmation IA en parallèle. Comparez leurs réponses quand le biais d'un modèle pourrait vous induire en erreur : décisions d'architecture, impasses de débogage, revues de sécurité ou choix de framework.

![Codex, Antigravity, Gemini, and OpenAI answer the SQLite-or-Postgres question while fake Kimi fails](assets/council-run.svg)

[![Tests](https://github.com/hex/claude-council/actions/workflows/tests.yml/badge.svg)](https://github.com/hex/claude-council/actions/workflows/tests.yml)

## Où il s'exécute

| Où | Ce que vous obtenez |
| -- | ------------------- |
| Claude Code dans un terminal | `/claude-council:ask`, tous les sièges et le panneau à côté de la conversation. |
| Claude Desktop, onglet Code | Le même plugin et les mêmes commandes. Le panneau s'ouvre dans le panneau latéral de Desktop. |
| Claude Desktop, conversation ordinaire | Le [Desktop extension](#claude-desktop) : cinq outils, un sélecteur de sièges et un panneau de réponses dans la conversation. macOS et Linux. |

![Claude Desktop's Code tab: Claude's synthesis of a primary-key question on the left, the Council pane with each seat's answer on the right](assets/desktop-code-tab.png)

Dans les deux cas, Claude peut aussi appeler le council comme outil. Il demande d'abord quels sièges et quel niveau de détail, puis affiche une carte Send, et rien ne quitte votre machine avant votre confirmation.

Les discussions claude.ai et Cowork s'exécutent dans un bac à sable qui peut bloquer les appels vers d'autres fournisseurs : le council n'y fonctionne pas.

## Installation

Il vous faut `curl` et `jq` sur macOS, Linux ou Windows via Git Bash.

```text
/plugin marketplace add hex/claude-marketplace
/plugin install claude-council
```

Fournissez au moins un fournisseur dans la coque depuis laquelle vous lancez Claude Code :

```bash
export OPENAI_API_KEY="..."
# Or GEMINI_API_KEY, XAI_API_KEY, PERPLEXITY_API_KEY,
# KIMI_API_KEY, OPENROUTER_API_KEY
```

Ou enregistrez les clés dans la configuration du plugin. Lancez `/plugin configure claude-council`, remplissez les lignes de clé API et choisissez Save configuration. Claude Code les garde dans son stockage sécurisé, pas dans un fichier de paramètres. Le mod du council définit chaque clé enregistrée comme variable pour toute la session, donc chaque commande lancée par Claude Code, dans tous les projets, reçoit la clé enregistrée à la place de celle que votre coque exporte. La ligne des modèles OpenRouter accepte les identifiants que prend `OPENROUTER_MODELS`, donc les sièges du routeur n'ont pas besoin d'export non plus.
Les clés enregistrées exigent Claude Code 2.1.287 ou supérieur. L'onglet Plugin Settings de l'application bureau les accepte aussi, pour les sessions sur cet ordinateur. Elles n'atteignent jamais les discussions claude.ai ni Cowork. [API keys](docs/REFERENCE.md#api-keys) couvre leur emplacement, les cas où le mod ne se charge pas et le comportement d'une clé effacée.

Les CLI `codex`, `agy` (Antigravity), `grok`, `kimi` et `cursor-agent` utilisent vos abonnements existants sans clé API. Claude Code lui-même, le Copilot CLI et OpenCode peuvent aussi siéger, s'ils sont nommés dans `--providers`. Un modèle local `ollama` ne demande ni clé ni réseau externe. Sans aucun de ces éléments, `--local` utilise des sous-agents Claude. Voir [provider selection](docs/REFERENCE.md#choosing-providers) et [local councils](docs/USAGE.md#local-council---local).

## Premier lancement en 60 secondes

Lisez [what gets sent and saved](docs/REFERENCE.md#what-gets-sent-and-saved) avant de poser une question sur votre code.

```text
/claude-council:status
/claude-council:ask "Should I use UUID or BIGINT primary keys for a SaaS users table?"
```

Chaque fournisseur répond indépendamment. Claude rédige une synthèse de leurs accords, désaccords et recommandation. Un accord n'est pas une vérification : les modèles partagent votre description et ses hypothèses. [The synthesis names the premise that could change the answer](docs/REFERENCE.md#reading-the-synthesis).

## Claude Desktop

Le plugin exige Claude Code. Pour une conversation Claude Desktop ordinaire, une extension Desktop, `council-<version>.mcpb`, donne à Claude cinq outils : `council_ask`, `council_pick`, `council_result`, `council_status` et `council_settings`. Elle ne tourne que sur macOS et Linux, car elle lance les scripts bash du council.

1. Téléchargez `council-<version>.mcpb` depuis le [latest release](https://github.com/hex/claude-council/releases/latest). Pour le construire vous-même, lancez `bash extension/build.sh` dans un checkout propre. Cela exige `npm` et écrit `dist/council-<version>.mcpb`.
2. Double-cliquez sur le fichier. Desktop avertit que l'extension accède à tout votre ordinateur et n'est pas vérifiée par Anthropic. C'est vrai de toute extension installée depuis un fichier : son serveur tourne sous votre identité, avec vos fichiers et votre réseau, et Anthropic ne l'a pas examinée. N'installez qu'un paquet que vous avez construit ou auquel vous faites confiance.
3. Dans Settings, Extensions, Claude Council, Configure, collez une clé pour chaque fournisseur souhaité : Gemini, OpenAI, xAI, Perplexity, Kimi, OpenRouter. Un champ vide exclut l'API de ce fournisseur. Desktop conserve les clés. Pour une question, chaque clé ne va qu'aux sièges de son propre fournisseur : API du fournisseur et agent CLI installé (`codex` reçoit la clé OpenAI, `agy` la clé Gemini, `grok` la clé xAI, `kimi` la clé Kimi). Un contrôle de statut diffère : il démarre chaque agent CLI installé avec toutes les clés définies.
4. Dans une conversation, demandez à Claude d'ouvrir les paramètres du council. Un panneau liste les modèles de chaque fournisseur muni d'une clé, récupérés en direct. Choisissez-en un par fournisseur, ou activez jusqu'à 12 modèles OpenRouter, un siège chacun. Chaque modification est enregistrée aussitôt et s'applique à la question suivante.
5. Demandez à Claude de poser une question au council. Desktop demande d'approuver l'appel d'outil, et cette approbation est le seul contrôle avant que la question quitte votre machine. Un panneau sous l'appel affiche la réponse de chaque siège, ou son erreur, dans une carte propre avec le nom du siège et le logo du fournisseur ; Claude rédige la synthèse en dessous. Desktop attend toute l'exécution, de quelques secondes à quelques minutes.

### Demander d'un coup

Nommez les sièges ou un niveau de détail (standard, bref ou détaillé) dans votre message, ou dites de demander à tout le monde, et Claude lance la question aussitôt, sur chaque siège par défaut en standard sauf indication contraire. Claude transmet votre question telle quelle, n'ajoutant du contexte que si elle dépend de messages précédents que le council ne voit pas.

### Le sélecteur

Sinon, comme dans « demande au council : quelle file utiliser ? », Claude ouvre `council_pick`, un panneau avec la question, un interrupteur par siège et les trois niveaux de détail. Claude attend ensuite, dans le même tour, l'exécution du sélecteur dans `council_result`.

1. Appuyez sur Ask. Les réponses apparaissent dans ce panneau, avec la ligne « Claude is writing the synthesis » en dessous.
2. Claude rédige la synthèse sans message de votre part. Quand tous les sièges échouent, Claude dit ce qui a échoué.

Quand aucun siège ne répond, le panneau le signale et Ask redevient utilisable.

### Changer de modèle dans le sélecteur

Sur un siège API ou OpenRouter, le modèle en gris est un bouton : cliquez pour en choisir un autre dans la liste en direct du fournisseur (celle d'OpenRouter a un filtre). Le choix est enregistré aussitôt, comme depuis le panneau de paramètres, et s'applique à cette question et aux suivantes. Un siège OpenRouter ne change que son propre modèle ; ajouter ou retirer des sièges OpenRouter se fait dans le panneau de paramètres.

### Quand Claude n'attend plus

Claude attend au maximum 11,5 minutes à partir de l'ouverture du sélecteur. S'il a cessé d'attendre quand les réponses arrivent, ou si vous appuyez une seconde fois sur Ask dans le même panneau :

- Desktop place « Synthesise the council's answers (run 3f9a2c). » dans la zone de message, sous un avertissement sur les contenus malveillants, et la ligne sous les réponses invite à appuyer sur Entrée. Le panneau ne peut pas envoyer ce message lui-même.
- Claude récupère alors les réponses de cette exécution avec `council_result` et rédige la synthèse.
- Si Desktop refuse le message, la ligne donne plutôt les mots à envoyer vous-même (`Ask Claude: "synthesise council run 3f9a2c"`).
- L'extension conserve les 5 dernières exécutions où un siège a répondu ; passé ce nombre, interrogez à nouveau le council.

Une question sans fournisseur nommé va à chaque fournisseur muni d'une clé et à chaque agent CLI que les scripts trouvent (`codex`, `agy`, `grok`, `kimi`, `cursor-agent`, `ollama`) dans votre PATH, `~/.local/bin`, `~/bin`, `/opt/homebrew/bin` ou `/usr/local/bin`. `claude`, `copilot` et `opencode` ne la reçoivent que si la question les nomme. Un agent CLI répond sous sa propre connexion : il reçoit donc la question même si le champ de clé de son fournisseur est vide ; hormis la clé de son propre fournisseur, il ne reçoit aucune clé du formulaire. Le [reference](docs/REFERENCE.md#claude-desktop-extension) liste les fichiers conservés et ses limites.

## Fonctionnalités

| Capacité | Guide |
| -------- | ----- |
| Interroger les fournisseurs ensemble, ou en nommer un en langage courant | [Command examples](docs/REFERENCE.md#command-examples) |
| Choisir les fournisseurs et épingler une liste permanente | [Provider selection](docs/REFERENCE.md#choosing-providers) |
| Attribuer des rôles spécialisés | [Roles](docs/USAGE.md#specialized-roles) |
| Faire challenger leurs réponses par les fournisseurs | [Debate](docs/USAGE.md#debate-mode) |
| Rassembler du contexte code avec des agents avant de questionner | [Agent mode](docs/USAGE.md#agent-enhanced-analysis---agents) |
| Utiliser des sous-agents Claude sans fournisseur externe | [Local council](docs/USAGE.md#local-council---local) |
| Inclure des fichiers pertinents ou choisir les vôtres | [Auto-context](docs/USAGE.md#auto-context-injection) |
| Joindre une capture d'écran | [Image input](docs/USAGE.md#image-input) |
| Poser une question sur la conversation courante | [`/advise`](docs/USAGE.md#asking-about-the-conversation-itself) |
| Exécuter en arrière-plan et récupérer le résultat | [Background jobs](docs/USAGE.md#background-jobs---async) |
| Exporter les réponses vers un fichier | [Export](docs/USAGE.md#export-to-file) |
| N'afficher que la synthèse | [Quiet mode](docs/USAGE.md#quiet-mode) |
| Voir arriver les réponses et réessayer les sièges en échec | [The pane](#the-pane) |
| Recevoir une note d'un siège pendant que Claude travaille | [Heads-up side-check](#heads-up-side-check) |
| Faire relire le diff par un second modèle avant que Claude s'arrête | [Stop-gate review](docs/USAGE.md#stop-gate-review-opt-in-off-by-default) |
| Interroger le council depuis une conversation Claude Desktop | [Claude Desktop](#claude-desktop) |
| Appeler les scripts sans Claude Code | [Direct script usage](docs/REFERENCE.md#direct-script-usage) |

Le [reference](docs/REFERENCE.md) liste tous les drapeaux, variables, modèles par défaut et limites. [Architecture](docs/ARCHITECTURE.md) couvre l'implémentation. [TESTING.md](TESTING.md) couvre les tests, les versions et l'ajout d'un fournisseur.

## Vérification latérale discrète

![The intro hint, a heads-up note, Learn more, and an unsent Tell Claude draft](assets/heads-up.svg)

Activez-la via la ligne « Heads-up side-check » dans `/config` ou le `.claude/council-heads-up.json` du projet. Un siège, codex par défaut, examine les tours et résultats d'outils récents pendant que Claude travaille. Pour un Write ou un Edit, il reçoit le texte écrit. La note indique ce qui a été où. « Learn more » la développe ; « Tell Claude » place un brouillon dans le prompt sans l'envoyer. Consultez le [data limits and off switch](docs/REFERENCE.md#what-gets-sent-and-saved) et le [heads-up guide](docs/USAGE.md#heads-up-side-check-opt-in-off-by-default).

## Le panneau

Sur Claude Code 2.1.287 ou supérieur, le panneau s'ouvre dans Claude Code, comme dans l'animation ci-dessus. Chaque siège a une ligne avec son modèle, une barre d'état, sa durée et un bouton pour l'action courante : annuler, réessayer, ouvrir ou replier. À la fin, la synthèse s'ouvre en haut avec les réponses repliées dessous. Rouvrez la dernière exécution avec `/council-pane`. Dans tmux, le mod demande une fois quel panneau vous voulez.

Le [mod guide](mods/council-pane/README.md) liste les clés, paramètres, limites et cas où le mod ne se charge pas. Il permet aussi à Claude d'appeler le council comme outil ; chaque appel vous demande d'abord.

### Ce que le mod exécute, lit et envoie

Le mod n'effectue aucun appel réseau lui-même. Il lance les programmes ci-dessous depuis un tableau d'arguments, jamais une chaîne de coque, et ne confie jamais de script à `bash -c`. Votre texte n'atteint les fournisseurs de modèles que par les deux premiers :

- `bash scripts/run-council.sh` quand Claude appelle l'outil council et que vous choisissez `Send to the council`. Il envoie votre question aux fournisseurs configurés.
- `bash scripts/heads-up.sh`, seulement avec la vérification latérale activée. Il lit la transcription de cette session (par défaut les 5 derniers tours et jusqu'à 8 résultats d'outils de 2 000 caractères chacun) et envoie ce résumé à un siège, `codex` sauf choix contraire. Le répertoire d'exécution conserve `digest.md` et `prompt.md`, exactement ce qui a quitté la machine, jusqu'à ce que le mod lise le résultat et le supprime. Le siège codex tourne dans ce répertoire avec un home codex propre : votre modèle et effort, un lien vers `auth.json` pour qu'un renouvellement de jeton atteigne votre connexion (sans cela, votre `CODEX_API_KEY` ou `OPENAI_API_KEY` connecte codex), et aucun de vos plugins, hooks, `AGENTS.md`, skills ou serveurs MCP.
- `bash scripts/query-council.sh --list-default-models` quand Claude appelle l'outil council, pour lister les sièges possibles et vérifier ceux nommés. Il lit votre configuration et n'envoie rien.
- `bash scripts/seat-info.sh discover`, `model <seat>` ou `allowlisted <seat>` pendant `/heads-up setup` et `/heads-up on <seat>`. Il vérifie quels sièges cette machine peut exécuter et n'envoie rien.
- `codex debug models` pendant `/heads-up setup` avec le siège codex, pour lister ses modèles. Cette commande appartient à codex, ainsi que toute requête qu'elle effectue.
- `kill -0 <pid>` pour vérifier qu'une exécution du council est encore active. Il n'envoie aucun signal.
- `rm -rf` et `mv -f` sur ses propres répertoires d'exécution sous `$TMPDIR/council-mod.<session id>`, pour nettoyer une exécution terminée et répondre à l'offre de réessai.

Il écrit des fichiers dans ce répertoire `$TMPDIR`, notamment `model.json` et `avoid.txt`, que lit `heads-up.sh`. En dehors, il écrit un seul fichier, `.claude/council-heads-up.json` dans le projet, et seulement depuis `/heads-up setup`, `/heads-up on`, `/heads-up off` ou l'action `Turn off` d'une note. Ce fichier est l'interrupteur de la vérification discrète. Claude Code ne le lit pas lui-même.

Il définit des variables d'environnement dans le processus même de Claude Code. Avec une clé API ou la liste de modèles OpenRouter enregistrées dans la configuration du plugin, il définit cette variable, comme `OPENAI_API_KEY` ou `OPENROUTER_MODELS`, au démarrage de la session. Toute commande lancée ensuite par Claude Code reçoit la valeur enregistrée à la place de celle exportée par votre coque, comme un export le ferait. Avant une exécution du council, il définit `COUNCIL_MOD_PANE_DIR`.

Il touche au prompt à deux endroits. Avec `wake_on_async_done` activé, il soumet `The background council job <id> has finished. Fetch it with /claude-council:result <id> and summarise it.` dès qu'une tâche d'arrière-plan se termine. L'action `Tell Claude` d'une note place un brouillon dans la zone de prompt, et vous décidez de l'envoyer.

Il lit le texte de chaque commande Bash lancée par Claude, seulement pour repérer un appel à `run-council.sh`. Juste avant cet appel, il définit `COUNCIL_MOD_PANE_DIR` pour que l'exécution s'affiche dans ce panneau, et l'efface quand tmux possède le panneau. Il lit `TMPDIR` et `TMUX`. Il active le paramètre `claude-council.heads_up` seulement quand vous choisissez « every project » dans `/heads-up setup`.

![Real SQLite-or-Postgres answers arrive in tmux beside a fake Kimi failure and the retry offer](assets/tmux-pane.svg)

Sans le mod, tmux ouvre un panneau latéral qui diffuse les réponses et l'état de chaque fournisseur. Il propose de réessayer les sièges en échec. Échap le ferme. `--no-pane` ou `COUNCIL_NO_PANE=1` le désactive. Hors des deux modes de panneau, les réponses arrivent dans la conversation. Voir [terminal integration](docs/REFERENCE.md#display--terminal-integration).

Les animations du council et de tmux montrent de vraies réponses à « Une application de démonstration mono-nœud doit-elle utiliser SQLite ou Postgres ? » Codex et Antigravity utilisent des abonnements ; Gemini et OpenAI utilisent leurs API. Kimi est une fixture de limite de débit. L'animation de vérification discrète utilise un siège factice et un véritable hôte Claude Code. [Capture scripts and raw frames](assets/capture/README.md) explique comment les reproduire.

## Ce que charge un siège CLI

Chaque siège CLI démarre dans un répertoire vide, `$TMPDIR/claude-council-<uid>/seat`, où `<uid>` est votre identifiant numérique. Les `CLAUDE.md`, `AGENTS.md`, règles, skills, hooks et serveurs MCP du projet depuis lequel vous interrogez n'y parviennent pas. Le répertoire ne limite pas ce qu'un siège peut lire : codex peut par exemple ouvrir n'importe quel fichier par son chemin complet.

Le répertoire est en lecture seule. Cela empêche un siège d'y écrire, mais pas de changer d'abord les droits. Un siège refuse aussi de démarrer s'il y trouve quoi que ce soit, et nomme le chemin pour que vous puissiez regarder avant de supprimer. Un fichier qui arrive pendant que d'autres sièges tournent peut les atteindre ; le siège suivant qui démarre refusera. Un siège refuse aussi de démarrer si `TMPDIR` se trouve dans un dépôt git, et le nomme : une CLI prendrait tout le dépôt comme projet du siège.

Les sièges ci-dessous tournent aussi sous un home propre, dans `$TMPDIR/claude-council-<uid>/seat-home`. Il ne renvoie que ce dont la CLI a besoin pour se connecter et démarrer. Seul vous pouvez ouvrir ces répertoires, et un siège refuse de démarrer si l'un d'eux appartient à un autre utilisateur ou est un lien symbolique.

| Siège | Ne charge plus | Charge encore |
| ----- | -------------- | ------------- |
| `cursor-cli` | Skills et plugins de `~/.cursor`, `~/.claude`, `~/.codex`, `~/.grok` et `~/.agents`, hooks Cursor et Claude, `~/.cursor/mcp.json` | Commandes Team du tableau de bord Cursor (lues depuis le paquet de la CLI, pas vues dans une exécution) |
| `grok-cli` | Plugins Claude, skills `~/.agents`, mémoire de grok entre sessions | Votre configuration `~/.grok` et les hooks de `~/.grok/hooks`, car aucun paramètre grok ne les désactive. Le home du siège lie votre trousseau de connexion (macOS) et `~/.docker/run`, pour la socket de Docker Desktop |
| `antigravity` | Sur macOS : vos règles `~/.gemini`, skills, serveurs MCP et conversations enregistrées | Sur Linux : tout sous `~/.gemini`, car l'emplacement de la connexion de agy n'est pas confirmé |
| `opencode` | Les skills, agents et `~/.claude` `~/.agents` | Votre connexion et votre historique de session dans `~/.local/share/opencode` |
| `codex` | Vos plugins, hooks, skills, mémoires et serveurs MCP. Chaque question reçoit son propre home codex avec votre modèle, votre effort et un lien vers `auth.json` | Rien. Sans `auth.json` et avec `cli_auth_credentials_store` réglé sur `keyring` ou `auto`, votre connexion est dans le trousseau système, que codex ne peut pas lire depuis un autre home : le siège tourne donc sous votre propre home codex et la réponse commence par une note. Un `OPENAI_API_KEY` exporté n'y change rien ; un `CODEX_API_KEY` exporté connecte tout de même codex avant toute connexion, comme quand vous lancez codex vous-même. Définissez `cli_auth_credentials_store = "file"` et relancez `codex login` pour l'isoler. Sans aucune connexion, le siège s'arrête et le dit |
| `claude-cli` | Le statut git et les instructions de commit ajoutés par un dépôt | La politique admin et les instructions de votre organisation |
| `kimi-cli`, `copilot-cli` | Les fichiers du projet | Votre home : hooks kimi dans `~/.kimi-code/config.toml`, skills copilot dans `~/.copilot` et `~/.agents` |

Cursor et Antigravity conservent le modèle choisi dans leur propre configuration : le siège le lit depuis votre vrai home et le transmet. Sur Windows, les sièges gardent votre home, car les CLI natives le trouvent via `USERPROFILE`. [Seat isolation](docs/ARCHITECTURE.md) donne les détails de chaque siège.

## Dépannage

| Problème | Solution |
| -------- | -------- |
| Dépôt cloné, rien ne se charge | Ne clonez pas dans `~/.claude/plugins/`. `pluginDirectories` n'est pas un paramètre. Suivez [running from a local clone](docs/REFERENCE.md#running-from-a-local-clone). |
| Aucun fournisseur trouvé | Lancez `/claude-council:status`. Exportez les clés dans la coque qui démarre Claude Code, enregistrez-les avec `/plugin configure claude-council`, ou utilisez `--local`. |
| Une clé enregistrée n'est pas utilisée | Après en avoir enregistré une avec `claude plugin configure` dans une coque, redémarrez Claude Code. Les clés enregistrées exigent le mod du council, qui se charge sur Claude Code 2.1.287 ou supérieur et pas sous `--safe-mode` ni `disableAllHooks`. Sans lui, exportez la clé dans votre coque. |
| Un autre modèle a répondu | Un en-tête tel que `grok-4.7 (grok-latest unavailable)` consigne un [model fallback](docs/REFERENCE.md#model-fallback). Définir la variable `_MODEL` de ce fournisseur désactive le repli. |
| Pas de panneau | Utilisez tmux, ou passez à Claude Code 2.1.287 ou supérieur pour le panneau intégré. [mod guide](mods/council-pane/README.md) liste ce qui empêche le chargement. |
| Mise à jour | Lancez `/plugin update claude-council`, puis redémarrez Claude Code. |
