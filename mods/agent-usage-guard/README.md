# agent-usage-guard

> Empêche Claude Code de passer votre fenêtre d'utilisation de cinq heures en dix minutes.

`agent-usage-guard` est un Claude Code [mod](https://code.claude.com/docs/en/plugins/mods/overview) : il s'exécute à l'intérieur de Claude Code et retient les dépenses incontrôlées avant qu'elles ne se produisent. Il lit l'utilisation en direct de votre plan et contient les boucles de distribution de sous-agents, de désabonnement à contexte lourd et de nouvelles tentatives.

<p align="center">
  <a href="https://www.producthunt.com/products/agent-usage-guard?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-agent-usage-guard" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1289693&amp;theme=dark">
      <img alt="agent-usage-guard on Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1289693&amp;theme=light">
    </picture>
  </a>
</p>

<p align="center">
  <img src="https://github.com/rbartoli/agent-usage-guard/releases/download/agent-usage-guard--v1.0.0/agent-usage-guard.gif" alt="Four scenes in Claude Code's interactive UI. The guard asks before a prompt re-writes the expired cache of a 486k-token session resumed after two hours, before a fifth parallel agent starts against a limit of four, before a twenty-first tool call at 433k context, and before a new agent once subagents have processed 10.9M tokens." width="900">
</p>

<p align="center">
  <sub>Enregistré depuis l'interface utilisateur interactive de Claude Code avec le garde chargé. Une API locale scriptée <a href="demo/scripted-api.ts">2 remplace Claude, de sorte que les sessions et le nombre de jetons sont échelonnés et qu'aucune utilisation n'est dépensée. Chaque question à l'écran appartient au gardien. <a href="demo/render.sh">Reconstruisez-le</a> à partir du <a href="demo/fixture/northstar-api">luminaire Northstar</a>.</sub>
</p>

Il agit avant la dépense, et non après : avant qu'un agent ne démarre, qu'une invite soit envoyée ou qu'un appel d'outil soit exécuté. Les limites des agents sont maintenues pour chaque session Claude Code sur votre ordinateur, et la diffusion et le contexte lourd sont plafonnés à tout niveau d'utilisation, pas seulement à proximité de la limite. Lorsque vous êtes au clavier, il vous pose la question, dans la boîte de dialogue de questions de Claude Code. Lorsque personne ne peut répondre, il refuse et explique à Claude pourquoi, afin que le modèle puisse attendre, regrouper le travail ou s'arrêter. `/agent-guard report` montre ce qu'il a fait.

- **Conforme aux plans.** Il lit les pourcentages sur 5 heures et hebdomadaires des rapports Claude Code et conserve la fin de la fenêtre pour vous.
- **Une réponse couvre un certain temps.** Une approbation lève sa condition jusqu'à ce qu'elle disparaisse ou expire, de sorte que la même question ne revient pas appel après appel.
- **Local et confidentialité minimale.** Pas de réseau, pas de processus. Il stocke les décomptes et les seaux grossiers, sans jamais inviter de texte, d'entrées d'outils ou de sortie de modèle.
- **Échec de l'ouverture.** Si l'un de ses hooks échoue, l'événement se poursuit : une garde brisée n'interrompt jamais votre session. La seule exception est un agent qu'il n'a pas pu juger, qui est refusé pour que Claude recommence.

## Installer

Exécutez ces commandes dans Claude Code v2.1.287 ou version ultérieure :

```text
/plugin marketplace add rbartoli/agent-usage-guard
/plugin install agent-usage-guard@agent-usage-guard
/reload-plugins
```

Ensuite, exécutez `/agent-guard` pour voir ce qu'il voit, et `/agent-guard simulate concurrency` pour voir la question qu'il pose lorsque trop d'agents s'exécutent, sans rien retenu ni dépensé. Les mods sont activés par défaut ; le [overview](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off) répertorie les paramètres qui les désactivent.

## Pourquoi cela existe

Un après-midi, j'ai donné à Claude Code une invite de recherche avec un effort maximum. Il a généré **394 appels de sous-agents, dont 341 exécutés en même temps, et a envoyé 84 millions de jetons de contexte via l'API en dix minutes.** Session terminée : *"Limite d'utilisation de Claude atteinte."* Verrouillé jusqu'à la réinitialisation de la fenêtre.

Ce n’était pas un cas isolé. Soixante jours de mes propres journaux ont contenu **12 lock-out** et 166 fenêtres de dix minutes avec des rafales d'agents. Le mode d'échec se multiplie : *un contexte étendu × boucles d'outils rapides × agents parallèles × tentatives aveugles*. Chaque protection ci-dessous supprime un facteur.

Et ce n'est pas seulement moi : [339 subagents from a single prompt](https://www.reddit.com/r/ClaudeAI/comments/1u5d02w/), [half a weekly Max plan consumed by recursive spawning](https://github.com/anthropics/claude-code/issues/68619) et les exécutions multi-agents utilisant [~15× the tokens of a chat session](https://www.anthropic.com/engineering/built-multi-agent-research-system).

## Ce que ça fait

| Zone | Règle | Par défaut | Que se passe-t-il |
|---|---|---|---|
| Planifier les fenêtres | Les nouveaux agents doivent être approuvés une fois qu'une fenêtre est aussi pleine | 80% | demande ; l'approbation dure jusqu'à ce que cette fenêtre soit réinitialisée |
| | Les nouveaux agents sont refusés une fois qu'une fenêtre est aussi pleine | 95% | refuse |
| | `ScheduleWakeup` et `CronCreate` sont refusés dès qu'une fenêtre est à ce point pleine, donc aucun tour ne démarre dans la limite | 95% | refuse |
| | On demande une fois à chaque session de terminer son étape et de dire ce qui reste | 95% | ajoute une note à l'invite suivante |
| | Les nouveaux agents ont besoin d’approbation alors que la fenêtre de 5 heures augmente aussi rapidement | 20 points / 10 minutes | demande |
| | Les nouveaux agents doivent être approuvés lorsque le rythme de la fenêtre de 5 heures au cours des 10 dernières minutes la remplira dans l'heure, avant qu'elle ne soit réinitialisée | au moins 2 points sur 2 min | demande |
| Agents | Agents exécutés simultanément, sur chaque session sur cette machine | 4 | demande |
| | Agents démarrés ou repris toutes les 10 minutes, sur cette machine | 12 | demande |
| | Jetons traités par les sous-agents toutes les 10 minutes, sur cette machine ; une approbation dure une heure | 10M | demande |
| | Les sous-agents ne peuvent pas démarrer leurs propres agents | profondeur 1 | refuse |
| Contexte | On dit une fois à Claude de garder le virage délimité | 300 000 jetons | ajoute une note à l'invite |
| | Une invite qui relireait autant de contexte | 500 000 jetons | demande : compactez puis envoyez, envoyez quand même ou annulez |
| | L'outil appelle toutes les 10 minutes pendant qu'une conversation ou un agent en porte autant | 20 appels à 400k | demande : continuez, compactez après ce tour ou arrêtez |
| | Une session lourde est inactive suffisamment longtemps pour que son cache d'invite expire | 150 000 jetons, 1 h d'inactivité | demande avant de réécrire le cache |
| Boucles | Le même appel d'outil échoue encore et encore, sans aucun autre appel entre les deux | 3 échecs identiques | refuse la même nouvelle tentative |
| | Appels d'agent refusés dans les 10 minutes | 5 | suspend l'apparition de l'agent pendant 10 minutes |

Agents couvre les sous-agents, les coéquipiers de l'équipe d'agents, les agents de workflow et les sous-agents terminés repris avec `SendMessage`. Les agents haïku restent en dehors de la course et commencent les limites, que Claude demande un haïku ou que la propre définition de l'agent le choisisse ; ils comptent toujours dans le budget des jetons de sous-agent et dans chaque règle de fenêtre de plan. Chaque appel d'outil est jugé en fonction du contexte de la boucle qui le réalise, de sorte qu'un petit sous-agent n'hérite jamais de la taille de la conversation principale.

**Quand il vous pose la question.** La question apparaît dans la boîte de dialogue de Claude Code, celle que Claude utilise pour vous demander quelque chose, et l'appel attend votre réponse. Les agents démarrés en parallèle alors qu'il est ouvert sont retenus, et Claude les relance dès que vous répondez. Si vous l'autorisez, cette condition reste autorisée pendant un certain temps : une fenêtre de plan jusqu'à ce qu'elle se réinitialise, un contexte lourd jusqu'à ce qu'il se rétrécisse (pour les appels d'outils, une heure au maximum), l'agent compte pour 10 minutes. Si vous refusez ou ignorez la question, ou si elle se termine sans réponse pour toute autre raison, il est demandé à Claude de ne pas démarrer d'agents pendant les 10 prochaines minutes (`AGENT_GUARD_WINDOW_SECONDS`), et aucune nouvelle question n'est posée pendant ce temps. Les mots tapés parviennent à Claude, vous pouvez donc répondre « utilisez plutôt des agents haïku ».

**Quand personne ne peut répondre.** En `claude -p`, le SDK Agent et en mode `dontAsk`, un agent ou une porte d'outil refuse au lieu de demander. Une invite lourde est affichée avec la raison, tout comme un CV lourd inactif une fois que le plafond de un toutes les 10 minutes à l'échelle de la machine est atteint. Les invites qui démarrent un tour d'elles-mêmes, comme un planning ou un déclenchement `/loop`, un message relayé depuis un canal comme Slack ou un ping Slack, sont conservées de la même manière, même dans une session où quelqu'un pourrait être invité à participer ; ils ne lèvent jamais les limites. Claude lit chaque refus comme le résultat de l'outil. Les refus répétés d'une même condition sont formulés différemment à chaque fois et s'intensifient : le deuxième dit que rien n'a changé et d'essayer autre chose, le troisième dit de terminer le tour. Si un crochet Stop tel que `/goal` continue de rouvrir le virage, le refus indique que c'est à l'utilisateur de décider.

**Ce que cela affiche.** Pendant que les agents courent sur cette machine, ou que le gardien retient ou vient de refuser quelque chose, une ligne au-dessus de l'invite l'indique : `Usage guard · 3 of 4 agents running · 5 of 12 started in the last 10 min · last refusal 14:22: concurrency`. Il est audacieux une fois qu'une limite est atteinte ou quelque chose est retenu, et disparaît lorsqu'il n'y a rien à dire. Le `[-]` de Claude Code à côté le réduit. Les fenêtres du plan et le contexte restent dans la ligne d'état.

**Ce qu'il laisse tranquille.** Il ne conserve jamais la notification d'une tâche en arrière-plan ou le message d'une autre session, car cela perdrait le résultat. Il ne bloque plus les invites après une limite d'utilisation : depuis la v2.1.234, Claude Code attend une limite et continue tout seul à la réinitialisation (`autoContinueAtUsageLimit`). Le travail du gardien est de vous empêcher d'atteindre la limite, et son journal compte les lock-out qu'il n'a pas empêchés. Près de la limite, il ajoute seulement une note : à partir de 95 %, l'invite suivante de chaque session indique à Claude de terminer l'étape en cours, de ne rien commencer de grand et de terminer le tour avec ce qui est fait et ce qui reste, de sorte qu'un verrouillage trouve chaque session à un arrêt net.

**Compactage inactif.** Depuis la version 2.1.299, Claude Code compacte une conversation de 200 000 jetons ou plus qui reste inactive pendant environ 54 minutes, avant l'expiration de son cache d'invite d'une heure (`idleCompaction`, activé par défaut). Le gardien lit la taille compactée et ne pose donc pas de questions sur cette session. Depuis la version 2.1.314, il s'exécute également dans VS Code et dans l'onglet Code de Claude Desktop, pour les abonnés dont la télémétrie est désactivée, et sur les passerelles Bedrock, Vertex, Foundry et LLM une fois le cache d'invite d'une heure activé. Sa question dormante couvre ce que le compactage inactif laisse de côté : les conversations de 150 000 à 200 000 jetons, les sessions `claude -p` et SDK, une machine endormie au bout de 54 minutes et les configurations avec compactage inactif ou auto-compactage désactivé.

**Avertissement de reprise de Claude Code.** Depuis la v2.1.304, sur les forfaits Pro et Max, Claude Code prévient avant de reprendre une conversation inactive, ou de l'envoyer à une conversation dont le cache s'est refroidi pendant l'inactivité, lorsque cela utiliserait une part notable de votre limite de 5 heures : vous reprenez quand même ou démarrez une nouvelle conversation. Il ne s'affiche qu'à partir d'une part minimale, qu'Anthropic définit par plan et par modèle, donc pour la plupart des modèles, il ne s'affiche que sur de très grandes conversations. La question dormante du garde demande 150 000 jetons, elle couvre donc toujours la plupart des CV froids, et sur le plus grand, vous pouvez voir les deux.

## Commandes

```text
/agent-guard [status]                          what the guard sees right now
/agent-guard allow [agents|context] [minutes]  lift its limits for this session (default: all, 10 min)
/agent-guard pause [minutes]                   the same as allow, for every limit
/agent-guard resume                            end an allow early, lift the agent pause, and let declined questions ask again
/agent-guard report [days]                     what it did on this machine (default: 7 days)
/agent-guard simulate <rule>                   show what a rule does, with nothing held or spent
/agent-guard help                              these commands
```

`/agent-guard` s'exécute en même temps, même à mi-tour, et ne démarre jamais un tour de modèle, donc Claude ne voit jamais de dérogation et ne peut pas en prendre une comme autorisation. Vous seul pouvez lever les limites : lorsqu'un autre plugin exécute `/agent-guard allow` ou `pause`, le gardien refuse et le dit dans la transcription. L'envoi de `[allow-usage-guard]` ou `[allow-agent-burst]` seuls comme invite, les marqueurs des versions antérieures, fait la même chose que `/agent-guard allow` ou `allow agents`.

## Ce qu'il peut et ne peut pas voir

Vérifié par rapport à Claude Code v2.1.316 :

| Chemin | Couverture |
|---|---|
| Sous-agents, coéquipiers et agents de workflow | Tenu avant le début (`agent.spawn`) |
| Un sous-agent terminé a envoyé un nouveau travail avec `SendMessage` | Tenu avant la reprise et compté comme un départ, une fois |
| Un coéquipier ramené du disque (Claude Code 2.1.299 ou version ultérieure) | Tenu avant la reprise et compté comme un départ |
| `/subtask` fourchettes, et tout ce qui démarre sans `agent.spawn` | Comptés au départ, jamais tenus : Claude Code ne propose aucun événement avant eux. Les Forks que Claude démarre via l'outil Agent se déroulent comme n'importe quel agent |
| Agents internes de Claude Code (suggestions rapides, compactage) | Non compté |
| Pourcentages de fenêtre de plan | A partir de la dernière réponse API sur un abonnement, en `claude -p` également. Les sessions de clé API n'en signalent aucune, donc seuls les budgets de jetons et de nombre s'appliquent |
| Des coéquipiers s'exécutant dans leurs propres volets de terminal | Non visible : leurs boucles s'exécutent dans d'autres processus |
| Sessions sur d'autres machines | Non compté : les enregistrements inter-sessions sont en direct dans le magasin de mods de cette machine |
| Outils que l'API exécute elle-même, comme le conseiller | Non tenable : aucun événement d'outil ne se déclenche pour eux |

Les mods s'exécutent en `claude` dans un terminal, dans l'onglet Code de l'application de bureau, en `claude -p` et dans le SDK de l'agent. Ils ne s'exécutent pas dans une session WSL d'application de bureau ([where mods run](https://code.claude.com/docs/en/plugins/mods/overview#where-mods-run)).

**Sur les forfaits Team et Enterprise**, et sur les machines avec paramètres gérés, Claude Code exécute son plugin `cc-plugin-sec-default` intégré avant tous les autres, à moins que `prependPlugins` géré ne le laisse de côté. Ce plugin envoie les événements de hook classiques de Claude Code sur les anciens plugins des utilisateurs, et Claude Code affiche une ligne pour chacun des gardes qu'il a ignorés, comme "agent-usage-guard: son hook classic.PostToolUse a été ignoré". Le garde suit les compactages, les lock-out, les `/clear` et les reprises, ainsi que les crochets d'arrêt qui rouvrent un virage à travers les événements qui l'atteignent encore. Deux choses nécessitent les événements classiques : le mode autorisation atteint le garde uniquement lorsqu'un agent démarre, il peut donc vous le demander en mode `dontAsk`, et les fourchettes `/subtask` ne sont pas comptées.

**Les limites natives comptent toujours.** Claude Code limite une session à 20 sous-agents simultanés (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) et trois couches d'imbrication (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`). Il n'y a aucune limite sur le nombre total d'agents qu'une session démarre. Depuis la version 2.1.316, `CLAUDE_CODE_SUBAGENT_EFFORT` définit l'effort d'exécution des sous-agents lorsque rien d'autre n'en nomme un, au lieu de celui de la session : un effort inférieur rend chaque agent moins cher, et la garde limite toujours le nombre d'exécutions. Les valeurs par défaut du garde sont plus strictes et s'étendent sur des sessions ; les caps indigènes restent le mur extérieur pour les chemins que compte seulement la garde.

## Voyez ce que ça a fait

```text
/agent-guard report 30
```

Le rapport compte les verrouillages de limite d'utilisation (chaque fenêtre verrouillée une fois), les franchissements de seuils de fenêtre de planification, les notes de fin de période, ainsi que chaque question et refus par règle, avec ce que vous avez répondu. Il lit le journal de chaque session sur cette machine et ne la quitte jamais. Réglez `AGENT_GUARD_JOURNAL=0` pour arrêter l'enregistrement.

## Sécurité et confidentialité

Un mod s'exécute dans Claude Code avec vos autorisations ; lisez [what a mod can reach](https://code.claude.com/docs/en/plugins/mods/overview#what-a-mod-can-reach) avant d’en installer un. Celui-ci contient environ 3 000 lignes de TypeScript sans dépendances, et `claude plugin validate .` répertorie toutes les API qu'il appelle et chaque variable d'environnement qu'il lit :

- Il n'effectue aucune requête réseau et ne démarre aucun processus. Le seul fichier qu'il lit est son propre `plugin.json`, comme le montre la version `/agent-guard status`.
- Il décide uniquement de ce que décrivent les règles ci-dessus : si un agent démarre, une invite est envoyée ou un appel d'outil s'exécute. Il vous demande chaque fois que vous pouvez répondre et vous donne la raison lorsqu'il refuse. Il lit les modes d'autorisation mais ne les modifie jamais et n'écrit aucun paramètre.
- La seule invite qu'il soumet est la vôtre. Après « Compacter, puis envoyer », il prend l'invite que vous avez tapée dans la zone de saisie et l'envoie inchangée une fois le compactage terminé, ou la remet en place si le compactage échoue. Une invite avec une image ou une mention @ reste dans la zone de saisie pour que vous puissiez l'envoyer, car un renvoi les supprimerait.
- Son crochet d'invite transmet votre invite sans modification, ajoute une note unique pour Claude lorsque le contexte dépasse 300k ou qu'une fenêtre de plan atteint 95%, ou maintient l'invite pour vous demander en premier (lorsque personne ne peut répondre, il indique pourquoi à la place). Son crochet `SessionStart` n'y change rien.
- Il conserve son état dans le mod store, un fichier JSON sous `~/.claude/plugins/store/`. Chaque session écrit ses propres décomptes (agents en cours d'exécution, démarrages récents et reprises inactives, jetons de sous-agent par minute, sa dernière lecture des 5 heures), la date de sa dernière activité (conservée 30 jours, donc une session reprise sait combien de temps elle est restée inactive) et ses lignes de journal (heure, préfixe d'identifiant de session, règle, nom de l'outil, compartiment de contexte tel que `400-500k`, fenêtre et pourcentage du plan, numéro de refus et votre réponse). Chaque enregistrement est stocké sous l'identifiant complet de la session, qui est également le nom du fichier de transcription de cette session. Si le magasin arrête de sauvegarder, par exemple lorsqu'il est plein, la ligne d'état l'indique : les autres sessions arrêtent alors de compter celle-ci.
- Il ne stocke jamais le texte d'invite, les entrées d'outils, le texte d'erreur ou la sortie du modèle. Lorsqu'un tour se termine sur une erreur API, il lit le dernier message de la conversation, l'erreur affichée par Claude Code, pour indiquer un verrouillage de la limite d'utilisation par rapport aux autres échecs. Un appel d’outil est réduit à une empreinte digitale de 13 caractères. Les noms d'agent restent en mémoire et ne sont jamais écrits.
- Les jours du journal datant de plus de 90 jours sont supprimés (`AGENT_GUARD_JOURNAL_DAYS`).
- `demo/`, qui construit le GIF ci-dessus, ne fait pas partie de ce qui s'exécute. Il démarre Claude Code dans un répertoire personnel temporaire avec une clé API inventée pour une API locale scriptée et ne lit aucune de vos informations d'identification.

Réglez `AGENT_GUARD=0` pour l'éteindre sans le désinstaller.

## Configuration

Définissez-les comme variables d'environnement, ou sous `env` dans `~/.claude/settings.json`. Les temps sont en secondes ; une valeur qui n'est pas un nombre dans la plage conserve sa valeur par défaut, et `/agent-guard` le dit.

| Variables | Signification (par défaut) |
|---|---|
| `AGENT_GUARD` | `0`, `false`, `off` ou `no` éteint la protection (`1`) |
| `AGENT_GUARD_JOURNAL` | `0` arrête le journal (`1`) |
| `AGENT_GUARD_HAIKU_EXEMPT` | `0` compte les agents Haiku en lice et démarre les limites comme les autres (`1` : ils restent en dehors) |
| `AGENT_GUARD_JOURNAL_DAYS` | Jours de tenue du journal (`90`) |
| `AGENT_GUARD_WINDOW_SECONDS` | Fenêtre glissante pour les budgets, burn et refus (`600`) |
| `AGENT_GUARD_AGENT_MAX` | Agents exécutés simultanément sur cette machine (`4`) |
| `AGENT_GUARD_ROLLING_MAX` | L'agent démarre et reprend par fenêtre sur cette machine (`12`) |
| `AGENT_GUARD_AGENT_TOKENS_MAX` | Jetons de sous-agent par fenêtre sur cette machine (`10000000`) |
| `AGENT_GUARD_DEPTH_MAX` | Couches d'agent sous la conversation principale (`1`) |
| `AGENT_GUARD_LIMIT_ASK_PERCENT` | Pourcentage de la fenêtre de planification à partir duquel les nouveaux agents demandent (`80`) |
| `AGENT_GUARD_LIMIT_DENY_PERCENT` | Pourcentage de fenêtre de planification à partir duquel les nouveaux agents, les réveils et les tâches planifiées sont refusés et chaque session doit se terminer (`95`) |
| `AGENT_GUARD_BURN_PERCENT` | Points de fenêtre de 5 heures par fenêtre qui incitent les nouveaux agents à poser des questions (`20`) |
| `AGENT_GUARD_CONTEXT_WARN` | Contexte dans lequel Claude est invité une fois à garder le virage délimité (`300000`) |
| `AGENT_GUARD_CONTEXT_HARD` | Contexte dans lequel une invite demande avant d'être envoyée (`500000`) |
| `AGENT_GUARD_TOOL_CONTEXT` | Contexte au-dessus duquel les appels d'outils sont comptabilisés dans le budget de l'outil (`400000`) |
| `AGENT_GUARD_TOOL_MAX` | Appels d'outils par fenêtre au-dessus de ce contexte (`20`) |
| `AGENT_GUARD_DORMANT_SECONDS` | Temps d'inactivité au bout duquel le cache d'une session lourde est considéré comme expiré (`3600`) |
| `AGENT_GUARD_DORMANT_CONTEXT` | Contexte dans lequel une session inactive est considérée comme lourde (`150000`) |
| `AGENT_GUARD_DORMANT_MAX` | De lourdes reprises dormantes par fenêtre sur cette machine lorsque personne ne peut être interrogé (`1`) |
| `AGENT_GUARD_TOOL_FAILURE_MAX` | Échecs identiques avant qu'une nouvelle tentative identique ne soit refusée (`3`) |
| `AGENT_GUARD_FUSE_MAX` | Appels d'agent refusés par période de fusion qui apparaissent en pause (`5`) |
| `AGENT_GUARD_FUSE_SECONDS` | La période de fusion et la durée de la pause (`600`) |
| `AGENT_GUARD_PEER_TTL_SECONDS` | Combien de temps une autre session compte, ou un agent sans signe d'activité, compte encore (`900`) |

La valeur par défaut dormante suppose le cache d'invite d'une heure que les abonnements obtiennent dans le cadre de l'utilisation du plan. Avec une clé API ou une utilisation supplémentaire, le cache dure cinq minutes, alors définissez `AGENT_GUARD_DORMANT_SECONDS=300`.

## Au-delà de Claude Code

Les règles résident dans un noyau indépendant du harnais (`core/`) qui n'effectue aucune E/S. Le mod Claude Code est son premier adaptateur. [docs/architecture.md](docs/architecture.md) décrit le contrat qu'un adaptateur maintient et ce qu'un autre harnais d'agent doit offrir pour porter chaque règle.

## Essais

```sh
claude plugin validate . --strict
claude plugin test
```

`claude plugin test` exécute la suite dans le propre kit de test de Claude Code : tests unitaires du noyau et tests qui déclenchent de vrais événements de Claude Code via le module hooks sans session, modèle ou réseau. [TESTING.md](TESTING.md) couvre les couches et ce que chaque test prouve.

## Licence

MIT
