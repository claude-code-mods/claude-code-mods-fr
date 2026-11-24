# agentctl — Plan de contrôle des agents pour une session Claude Code

Testé avec **Claude Code 2.1.288** (headless) et **2.1.289** (interactif, après mise à jour automatique de l'hôte) (`claude plugin validate .`, `claude plugin test .` : 203 tests) ; la 0.2.x a été revérifiée en direct sur 2.1.289 (§ Vérifié en direct, 0.2.x).
L'API des mods est marquée comme changeable entre les versions ; les déclarations de types que l'hôte écrit dans
`.claude-plugin/types/` font autorité pour la version installée. Exécutez `claude plugin validate .`
après chaque mise à jour de Claude Code.

Conception : `docs/features/agent-control-plane-mod/` dans ce dépôt (exigences, étude de faisabilité,
spécification technique, tickets de demande). Ce répertoire ne fait pas partie du plugin sd0x-dev-flow : installer le
plugin n'installe pas le mod. Pour l'installer, exécutez `/agentctl-setup` (il vérifie l'hôte, installe
`agentctl@sd0xdev-marketplace` après votre accord, et construit votre première ligne de tâche ; `/agentctl-setup --task`
et les compétences de workflow rédigent une proposition à accepter à la place), ou chargez-le pour une
session avec `claude --plugin-dir mods/agentctl`.

## Premier démarrage

Tapez ce que vous faites — vous n'avez besoin d'aucune autre commande :

```text
/agentctl 測試一下這個新功能
```

1. Le mod met une demande pour Claude dans votre boîte de prompt (il ne l'envoie jamais). Appuyez sur **Entrée**.
2. Claude lit le projet et rédige une portée — ce qu'il peut modifier, quelles vérifications comptent comme preuve,
   ce que « terminé » signifie — et l'écrit avec l'aide fournie dans le mod (`bin/propose.mjs`). Si
   quelque chose n'est pas clair, il vous pose la question au lieu d'inventer des permissions.
3. À la fin de cette réponse, le mod affiche la portée et propose `/agentctl accept <digest>` dans la boîte :
   **Tab**, puis **Entrée**. Accepter lie la portée ; cela ne démarre aucun travail.
4. Demandez à Claude de commencer. `/agentctl` indique où en sont les choses et quoi faire ensuite — exécuter les vérifications,
   puis `/agentctl handoff` — et `/agentctl help` liste le reste.

Un testeur n'ayant pas lu la conception a parcouru les étapes 1–4 et la passation sans aide (§ Parcours sans coaching).

Envoyer la demande est un tour Claude ordinaire ; le mod lui-même n'appelle aucun modèle. Les réponses utilisent le chinois
traditionnel lorsque votre objectif est écrit en chinois, l'anglais sinon — une heuristique simple, pas de détection
de locale.

## Ce qu'il fait

| Fonction | Comment |
|---|---|
| Portée de tâche | Claude rédige une proposition (`/agentctl-setup --task`, ou `/feature-dev`, `/bug-fix`, `/refactor` lorsque le mod est installé) ; le mod la prévisualise et `/agentctl accept` tapé dans votre propre prompt lie exactement ce qui a été prévisualisé — voir § Propositions. `/agentctl task set <json>` tapé dans votre prompt lie aussi une tâche au worktree. La sortie des outils, les fichiers et les messages ne peuvent pas la modifier — seulement une commande que vous tapez. La liaison est par worktree, donc votre propre `task set` / `task clear` dans une autre session sur le même worktree remplace ou efface bien. Les enregistrements de tâche et les passations sont conservés par worktree, donc le même identifiant de tâche dans deux worktrees désigne deux tâches distinctes. Une erreur de stockage est signalée comme telle, et la tâche précédente continue de s'appliquer ; une liaison dont l'enregistrement est manquant refuse tout sauf les lectures dans le worktree |
| Refus | Une liste de refus. Les écritures directes reconnues en production et les écritures git distantes sont refusées **avec ou sans tâche** ; lorsqu'une tâche est liée, ses propres entrées `forbid` et les modifications en dehors de ses racines sont aussi refusées. Les racines d'édition lient les outils d'édition (Write, Edit, NotebookEdit) ; un fichier écrit via une redirection shell est une commande Bash que le mod ne peut pas classifier, donc il passe à l'hôte — le refus indique à Claude de ne pas parvenir au même résultat d'une autre manière, mais les racines ne sont pas un bac à sable. Tout ce que le mod ne peut pas classifier — scripts, shell composé, outils inconnus — passe à l'invite de permission propre de Claude Code ou au mode automatique, enregistré comme `delegated`. Un refus en aval n'est jamais affaibli et une autorisation n'est jamais créée. **Au mieux** : le mod lit chaque appel d'outil, jamais le contenu d'un script ni les commandes qu'il lance, donc un push à l'intérieur d'un script relève de l'hôte et du workflow pour l'autoriser |
| Preuve | Une exécution compte lorsqu'elle correspond à un exécuteur `check` déclaré — ses mots d'abord, donc des arguments ajoutés comptent encore et peuvent vérifier moins que déclaré, tandis qu'un pipe, une redirection ou un wrapper (`npm test \| grep pass`) ne compte pas ; la réponse d'acceptation et `/agentctl` nomment chaque vérification comme une ligne qui la correspond, ou — lorsque le formateur ne peut pas citer un mot en un seul morceau — sous forme de ses mots JSON, qui ne correspondent pas si copiés tels quels (une orthographe correctement citée des mêmes mots si). Un appel correspondant est encadré par des lectures d'arborescence dérivées de Git (les exécuteurs sont assortis d'abord, donc une vérification `git status` déclarée est une vérification) ; une modification ultérieure rend le résultat périmé sous 30 s ; une vérification en arrière-plan reste « achèvement non observé » jusqu'à ce qu'un résultat terminal soit vu. La preuve appartient à la tâche et à la version de politique sous lesquelles elle a été observée, et une lecture à couverture partielle n'est jamais listée comme vérifiée |
| Panneau | La bande au-dessus du prompt est compacte : tâche, exécution et sa durée, ce qui vous attend, la lecture de la porte avec son âge (et `stale` au-delà de 30 s), l'heure de la dernière passation. `/agentctl` est une réponse de statut compacte — l'étape suivante, la tâche, ce qui vous attend, la porte et la preuve ; `/agentctl status --details` ajoute la santé du stockage, l'exécution, le contexte et la fenêtre de 5 h. Les lignes de porte, de contexte et de fenêtre nomment leur source et leur âge, ou indiquent `missing` / `unavailable`, et chaque ligne de preuve son résultat, sa fraîcheur, sa couverture et son âge |
| Passation | `/agentctl handoff` — huit réponses depuis les enregistrements, sans modèle, sans réseau, sans processus ; journalisé en entier à la réouverture (transcription uniquement) ; un `/agentctl` seul pointe dessus, `/agentctl last` l'imprime |
| Arrêt | `/agentctl stop` — enregistre la passation, demande l'annulation du tour en cours, liste les opérations suivies ; jamais « tout arrêté » |

## Propositions

Claude écrit `~/.claude/agentctl/proposals/<URI-encoded worktree>.json` (hors du worktree) via
l'aide fournie `bin/propose.mjs` du mod (le chemin `/agentctl <goal>`) ou `agentctl-setup.js propose` de sd0x-dev-flow
(installation et compétences de workflow) ; tous deux appliquent d'abord la validation propre du mod. Au démarrage de session et à la
fin de chaque tour principal, le mod le lit une fois, le valide à nouveau, et conserve l'objet **effectif** :
le worktree vient de la session, une proposition nommant un autre worktree, rédigée contre une tâche qui
n'est plus liée, ou chevauchant une classe intégrée est refusée (la raison est journalisée). La prévisualisation
liste chaque permission acceptée avec un condensé SHA-256 (24 hex) dans la transcription et la bande.
Chaque entrée est affichée jusqu'à 160 caractères ; une entrée plus longue se termine par `…`, et le condensé — et ce qu'accepter
lie — couvre toujours tout, donc écartez un brouillon dont vous ne pouvez pas voir les entrées en entier.

| Commande | Qui | Fait |
|---|---|---|
| `/agentctl proposal` | tout le monde | Imprime la prévisualisation en attente |
| `/agentctl accept [préfixe du condensé]` | **votre prompt uniquement** | Lie l'objet conservé — jamais le fichier relu — si la tâche liée n'a pas changé depuis la prévisualisation |
| `/agentctl discard` | tout le monde | Abandonne la proposition en attente ; la tâche liée reste |

Modifier le fichier plus tard produit une nouvelle prévisualisation et un nouveau condensé ; un ancien condensé ne correspond plus.
Les sessions concurrentes sur un worktree partagent une liaison et un stockage, qui n'est pas atomique entre
les sessions : acceptez dans la session qui a affiché la prévisualisation.

## JSON de tâche

```json
{
  "goal": "investigate the quiz service timeout",
  "allow": ["edit"],
  "editRoots": ["src", "tests"],
  "forbid": ["terraform apply"],
  "executors": [{ "argv": ["npm", "test"], "check": true }],
  "needsUser": [["npm", "publish"]],
  "tools": ["mcp__docs__search"],
  "acceptance": ["unit tests pass on the final tree"]
}
```

Les classes interdites intégrées s'appliquent avec ou sans tâche, en plus de celles de la tâche : écritures en production (`kubectl apply|delete|patch|rollout|scale|edit|replace`,
`helm install|upgrade|uninstall|rollback`, `gcloud … deploy|delete|update`) et écritures git distantes
(`git push`, `gh pr merge`). Les secrets n'ont jamais leur place dans une tâche : une valeur ressemblant à un identifiant dans un champ de politique
est refusée.

`needsUser` ne demande qu'aux endroits où une personne a été vue répondre : le terminal interactif sous les
modes de permission `default` (manuel), `acceptEdits` et `auto` (`lib/verdict.js`). Le mode est lu
depuis les entrées classiques de hook à chaque prompt et fin d'outil ; tant qu'aucune n'a été vue, et sur toute autre
surface ou mode — `-p`, `dontAsk`, `plan`, `bypassPermissions`, Desktop, VS Code, mobile — un
appel `needsUser` est refusé. Un mode changé au milieu d'un tour est vu à la fin du prochain outil.

## Ce que ce n'est pas

- **Pas une frontière d'isolation.** Il s'exécute avec vos permissions. La production en lecture seule est l'affaire de
  vos identifiants et de l'IAM/RBAC de la cible.
- **Pas la seule ligne.** Si l'hôte ignore son hook (mod désactivé, crash du worker), rien ici ne refuse.
  Gardez les commandes dangereuses nommées dans votre propre `permissions.deny`, par exemple :

  ```json
  { "permissions": { "deny": ["Bash(kubectl delete:*)", "Bash(kubectl rollout:*)", "Bash(helm upgrade:*)"] } }
  ```

  Ces règles correspondent au texte de la commande, pas aux programmes (`git -C . push` est un texte différent), ce qui explique
  pourquoi les deux couches existent. `Bash(git push:*)` est laissé de côté exprès : `/push-ci` de sd0x-dev-flow l'exécute.
- Un autre mod peut changer un verdict à `tool.check` ; ce mod le divulgue dans `/agentctl policy`.
- Les exécuteurs autorisés (ex. `npm test`) s'exécutent avec leurs effets non classifiés.

## Développement

```bash
cd mods/agentctl            # depuis la racine du dépôt
claude plugin validate .   # hooks et appels $ : pas de $.model.*, $.http.*, $.tool.register, $.prompt.submit (remplir/suggérer/lire autorisé)
claude plugin test .       # tous les *.test.ts sous tests/
```

## Publication

Le mod est versionné seul et publié sous les étiquettes `agentctl-v<version>`
(`.github/workflows/release-agentctl.yml`), séparément des publications de sd0x-dev-flow. Claude Code met en cache un
plugin installé par version, donc une modification de tout sauf ce README ou `tests/` nécessite un incrément de version :
augmentez `"version"` dans `.claude-plugin/plugin.json`, puis exécutez `node .github/scripts/agentctl-version.js update`
depuis la racine du dépôt (ou `/bump-version agentctl`). Le verrou de version de la CI échoue jusqu'à ce que les deux soient faits, et
la CI exécute aussi `claude plugin validate` et `claude plugin test` ici.

## Vérifié en direct (2026-10-04, dépôt scratch : headless `claude -p --plugin-dir` sur 2.1.288, tmux interactif sur 2.1.289)

Ces lignes enregistrent la version 0.1.0. Depuis la 0.2.0, un appel non classifié est délégué à l'hôte au lieu
d'être refusé, et les commandes de proposition existent ; les lignes 0.2.x suivent le tableau.

| Vérification | Résultat |
|---|---|
| Chargement et `/agentctl` sous `-p` | Charge pour la session uniquement ; répond en ~3.7 s sans tour de modèle |
| `task set` depuis un prompt `-p` | Refusé : un prompt `-p` n'est pas estampillé `composer`. Les exécutions headless ne peuvent pas définir de tâche ; définissez-la depuis un prompt interactif |
| Appels Bash interdits et non classifiés | Refusés avant exécution, règle nommée (`task-forbid: …`, `unclassified: python3 has no adapter`) |
| Une lecture autorisée (`git status`) | A suivi le chemin de permission propre de l'hôte et s'est exécutée |
| Une vérification sortant en erreur (`sh check.sh` → sortie 1) | Enregistrée comme `error` : une sortie Bash non nulle parvient au mod comme `isError` |
| Encadrement de preuve | Lectures avant/après enregistrées, couverture `git-hybrid` |
| Deux sessions concurrentes | Les deux enregistrements de session écrits ; l'enregistrement de tâche conservé |
| Processus restants après sortie | Aucun |
| Coût de lecture de l'arborescence | ~90 ms avec 500 fichiers modifiés/non suivis ; ~75 ms sur un dépôt propre de 974 fichiers |
| Fenêtre de 5 h après un tour de modèle (V7) | `1% (resets …)` lu depuis l'hôte, avec sa source et son âge |
| Vérification en arrière-plan (V5, moitié arrière-plan) | Fermée depuis la notification de tâche de l'hôte (`<task-id>`, `<status>`) comme `error` — pas de polling nécessaire. `TaskGet` est l'outil de liste de tâches ; `GetTask` lit les tâches en arrière-plan |
| Appels d'outils de sous-agent (V4) | Un `danger-cmd` de sous-agent a été refusé par la même règle |
| `ask` sous `-p` (V3, `-p` uniquement) | Avec une copie de sonde répondant `ask`, aucune des configurations headless testées (avec et sans règle d'autorisation pour Bash) n'a exécuté la commande sur 2.1.288 — le `ask` de la sonde n'a pas été auto-approuvé |
| `/agentctl stop` sous `-p` en entrée de flux (V6) | L'entrée a été traitée après la fin du tour, donc `immediate` ne s'applique pas là ; la réponse a dit qu'aucun tour en cours n'a été observé — jamais « arrêté » |
| Appels d'outils MCP (V4) | Un outil MCP de sonde a été refusé comme non classifié jusqu'à ce que la tâche le nomme, puis il s'est exécuté |
| Terminal interactif dans tmux (V10) | La bande affiche correctement le texte d'objectif en CJC à 80 et 50 colonnes, avec retour à la ligne sur deux et trois lignes |
| `/agentctl stop` pendant un outil de premier plan en cours, interactif (V6) | S'est exécuté immédiatement (`immediate`) ; le tour a été annulé ; l'hôte a déplacé la commande en cours en arrière-plan, où elle a continué à s'exécuter — la réponse l'a listée comme en cours et n'a jamais dit « arrêté » ; lorsqu'elle s'est terminée, la notification de l'hôte a clos sa preuve |
| `ask` sur le terminal interactif en mode manuel (V3) | Avec une copie de sonde répondant `ask`, l'hôte a affiché sa propre boîte de dialogue d'approbation avec la raison du mod (Oui / Non, pas de « ne plus demander ») ; refuser a interrompu l'appel ; réexécuté avec le code livré (manuel : boîte de dialogue ; `dontAsk` : refusé par le mod), et avec une copie de sonde sous `acceptEdits` et `auto` (boîte de dialogue) et `dontAsk` (refusé). Les chaînes que l'hôte envoie ont été lues depuis un hook classique `UserPromptSubmit` (2.1.289) : `default`, `acceptEdits`, `auto`, `plan` et `dontAsk` arrivent verbatim ; sur un modèle sans mode automatique (Haiku) `--permission-mode auto` revient à `default` |
| Démarrage interactif (trouvé en direct) | `session.start` et le premier rendu de la bande arrivent ensemble ; deux constructions de contexte concurrentes ont laissé la bande sur un contexte orphelin (`gates missing`). Corrigé : une construction partagée |
| Installation, désactivation, désinstallation (Signal 12) | Installé depuis un marketplace local, s'est exécuté, désactivé (`/agentctl` disparu), désinstallé : aucun processus du mod restant, les réglages `permissions` byte-identiques. L'hôte lui-même a laissé une clé vide `extraKnownMarketplaces`, un répertoire de cache de plugin et un `installed_plugins.json` vide ; le mod ne laisse que son propre fichier de stockage. Tout a été restauré et vérifié byte-identique ensuite |

Suppression : les installations `--plugin-dir` n'installent rien et ne changent aucun réglage. Les données propres du mod restent dans
`~/.claude/plugins/store/agentctl_*.json` (sessions, tâches, points de contrôle), et les propositions rédigées dans
`~/.claude/agentctl/proposals/` ; supprimez-les pour le retirer.

## Vérifié en direct, 0.2.x (2026-10-05, clone scratch avec un remote bare scratch, 2.1.289, Haiku)

| Vérification | Résultat |
|---|---|
| `git push` direct sans tâche liée (`-p`) | Refusé `remote-git-write` avant exécution ; le remote est resté vide |
| `python3 -c …` non classifié et un script qui pousse (`/bin/bash -p push.sh`, `-p`) | Les deux ont passé à l'hôte et se sont exécutés ; le push du script a atteint git (rejeté par le remote scratch lui-même, pas par le mod) — l'aveuglement aux scripts divulgué |
| Proposition écrite par `agentctl-setup.js propose`, démarrage interactif | La prévisualisation a été journalisée au démarrage de session avec le condensé de l'aide, et la bande a nommé la proposition en attente |
| `/agentctl accept <condensé>` tapé au prompt | A lié la portée prévisualisée comme nouvelle tâche ; sans `base`, l'aide n'a imprimé aucun condensé, le mod a complété la tâche liée et son propre condensé a été accepté |
| Une vérification déclarée, un appel non classifié, une modification hors racines, un push direct (tâche liée) | Vérification enregistrée comme preuve `current` ; `python3` délégué et listé comme tel par `/agentctl events` ; la modification refusée `edit outside the allowed roots` ; le push refusé `remote-git-write` |
| Un fichier non suivi ajouté de l'extérieur | La vérification a indiqué `stale (tree changed since)` sous 32 s |
| `/agentctl handoff`, réouverture, `/agentctl`, `/agentctl last` | La passation indique quand l'arborescence a été lue et liste la vérification périmée sous Non vérifié ; à la réouverture la transcription la montre, un `/agentctl` seul imprime une ligne de pointeur, `/agentctl last` l'intégralité |
| Trouvé en direct et corrigé en 0.2.1 | Un fichier de proposition accepté a été relu par la session suivante comme brouillon périmé (désormais mémorisé par worktree) ; le refus intégré disait « la portée de la tâche », et Claude a alors proposé d'élargir la tâche (désormais : « une classe intégrée qu'aucune tâche ne peut lever ») ; les lignes de transcription lisaient `agentctl: agentctl:` |
| Coût des deux sondes `-p` | 2–3 tours chacune, ≈ 0,06 $ chacune sur Haiku ; les réponses propres du mod, les prévisualisations et la bande n'appellent aucun modèle |
| Test adversarial indépendant (Codex, 2026-10-05), corrigé en 0.2.2 | Un chemin de programme absolu ou en majuscules (`/usr/bin/git push`, `GIT push`) contournait les classes intégrées ; une racine d'édition telle que `../other` autorisait des écritures hors du worktree ; le plafond de proposition comptait les caractères, pas les octets UTF-8 ; sans tâche liée, les appels délégués n'étaient pas enregistrés dans `/agentctl events`. L'accord de condensé, les clés de prototype, le refus d'autre worktree, le partitionnement de la preuve et la couverture partielle ont tenu |

## Vérifié en direct, 0.3.0 (2026-10-07, clone scratch avec un remote scratch, tmux interactif, Haiku)

Signal 13, parcouru sur 2.1.289 (étapes 1–3) et de nouveau depuis le début sur 2.1.292 :

| Étape | Résultat |
|---|---|
| `/agentctl 幫 …/README 加一行測試說明` | La demande a rempli la boîte vide en chinois traditionnel avec le chemin de l'aide depuis `$.plugin.root` ; rien n'a été envoyé ni lié |
| Entrée | Claude a exécuté le `--help` de l'aide, lu le projet, constaté le fichier manquant et a **demandé** au lieu d'inventer une portée ; après la réponse il a écrit la proposition via l'aide |
| Prévisualisation | Affichée à la fin du tour avec son condensé et « lie la portée uniquement ; ne démarre aucun travail » ; la bande a nommé la proposition en attente |
| Tab + Entrée | Accepté depuis la suggestion ; la réponse a nommé l'étape suivante |
| « start the work » | La modification dans la racine acceptée est passée à l'invite de permission propre de l'hôte ; la vérification déclarée a été enregistrée comme preuve courante |
| `/agentctl`, `handoff`, réouverture, `last` | Le statut a commencé par l'étape suivante ; la passation a listé la vérification comme vérifiée avec son heure de lecture ; la réouverture y a pointé, `last` l'a imprimée |
| Un second objectif avec la tâche liée | L'aide a livré sous la tâche liée ; la prévisualisation a dit « Remplace : tâche … » ; Tab + Entrée l'a remplacée |

Trouvé et corrigé pendant le parcours : sur 2.1.292, la propre suggestion de prochaine prompt de l'hôte (« 確認 ») a pris la boîte, donc
Tab + Entrée aurait envoyé ce mot à Claude — le mod remplace désormais la suggestion de l'hôte par la ligne
d'acceptation tant qu'une proposition attend, et la propose à nouveau à la fin de chaque tour ; la dernière ligne de la réponse d'acceptation restait
en anglais dans une session chinoise ; avec une tâche liée, la réponse de remplissage disait « rien n'est lié ». Hésitations
enregistrées : Claude a une fois essayé de lire les propres fichiers du mod hors du worktree (refusé à l'invite de
l'hôte) ; la langue de copie se réinitialise à chaque nouvelle session.

## Parcours sans coaching, 0.3.0 (2026-10-07, Codex comme utilisateur débutant, tmux interactif, un clone jetable)

Le testeur n'a reçu que `/agentctl <ce que vous faites>` et n'a lu ni `docs/` ni le code de ce mod.
Décrire → Entrée → prévisualisation (≈ 72 s, portée README uniquement, trois vérifications) → Tab + Entrée → « start the
work » → `/agentctl` → `/agentctl handoff` terminés en six étapes sans aide extérieure. Corrigé en 0.3.1
d'après ce qu'il a trouvé :

| Trouvé | 0.3.1 |
|---|---|
| La passation lisait « Modifications observées : 0 » à côté d'un README modifié (Claude avait modifié via Bash) | La ligne compte les appels d'outils d'édition et indique que les changements Bash sont dans la ligne d'arborescence |
| Claude a exécuté les tests redirigés par `grep` ; la passation a appelé la vérification périmée pendant que Claude l'appelait réussie | La réponse d'acceptation nomme les vérifications à exécuter verbatim ; `/agentctl` les redemande par nom |
| Avec le travail fait, `/agentctl` disait encore « demander à Claude de démarrer le travail » | L'étape suivante suit les vérifications déclarées : travailler et les exécuter, réexécuter ce qui n'est pas courant, ou passer la main |
| Une écriture hors des racines a été refusée, puis le même fichier a été écrit avec un heredoc Bash | Le refus indique à Claude de ne pas parvenir au résultat d'une autre manière ; cette section et § Ce qu'il fait précisent que les racines lient uniquement les outils d'édition |
| Claude a posé une question et écrit une proposition dans le même tour | La demande de rédaction dit d'attendre la réponse avant d'écrire |

Laissés tels quels : le parcours a pris des minutes parce que le `CLAUDE.md` propre du clone exige deux tours de revue
pour un changement de documentation, pas à cause du mod.

## Non vérifié

V3 sur Desktop, VS Code et mobile, et sous `plan` et `bypassPermissions` (accepter l'avertissement
du mode bypass est la décision propre de l'opérateur, donc non exercé) : `needsUser` reste
refusé là. La bande a été vérifiée dans tmux, pas en SSH.
