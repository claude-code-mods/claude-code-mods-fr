# Inbox

Je suis TDAH. Travailler avec un agent dans un fil de discussion est très coûteux sur le plan cognitif : le nombre de choses à garder en tête s'accumule à mesure que la session avance. Questions, bugs, idées et tâches s'empilent et se mélangent, ce qui rend difficile de tout garder aligné.

Inbox apporte un soulagement immédiat en offrant à votre agent un endroit organisé et stable pour faire remonter tout ce qui demande une décision. Inbox veille aussi à ce que votre agent propose toujours, sur chaque élément, une série proactive d'actions rapides, dont une action recommandée.

Mieux encore, Inbox donne à votre agent un lieu pour signaler les problèmes et opportunités latents qu'il aurait sinon pu négliger pour se concentrer uniquement sur la tâche en cours.

Inbox est disponible pour Claude Code dans le terminal et l'application Desktop, pour Codex dans l'application ChatGPT Desktop, et pour omp dans le terminal. Dans l'application Herdr, il peut aussi s'ouvrir dans un volet à côté du terminal. Chaque variante est conçue pour sa plateforme, mais fonctionne fondamentalement de la même façon partout.

## Comment ça marche
https://github.com/user-attachments/assets/a493119c-4d8b-46e0-a18a-bd0ecf041b6b


## Installer

Si vous êtes comme moi, collez simplement un lien vers ce dépôt GitHub à votre agent et demandez-lui de l'installer. Si vous préférez la méthode classique, continuez...

### Claude Code

Dans une session Claude Code en terminal, tapez :

```
/plugin install inbox --marketplace petekp/inbox
```

Répondez `y` pour ajouter le marketplace, puis choisissez une portée. Cela commence à fonctionner dans cette session. Une installation au niveau utilisateur couvre aussi les sessions Code de l'application Desktop Claude sur cette machine.

Pour installer depuis l'application Claude Desktop, ouvrez une session Code :

1. Cliquez sur **+** à côté du prompt, puis sur **Plugins**, puis sur **Manage plugins**.
2. Sur la page Plugins, cliquez sur **Add** en haut à droite, puis sur **Add marketplace**, puis sur **Add from a repository**.
3. Tapez `petekp/inbox`, choisissez **inbox / petekp** dans la liste, et cliquez sur **Sync**.
4. Sur Inbox, cliquez sur **Add to this computer**.
5. Retournez dans votre session et tapez `/inbox` pour ouvrir le volet.

Cela l'installe pour votre compte utilisateur, donc il fonctionne aussi dans le terminal. `/plugin` ne s'exécute pas dans l'application Desktop, et l'inbox n'atteint pas les sessions cloud de l'application.

Si votre organisation gère Claude Code, une inbox installée par vous fonctionne avec deux différences. Après `/clear` ou une reprise, elle charge la liste de cette conversation à votre premier message. Une invite de permission parvient à l'inbox environ une seconde et demie après son apparition. Pour tout recevoir, demandez à un administrateur d'ajouter l'inbox aux réglages gérés de l'organisation.

Pour mettre à jour, exécutez ces commandes, puis `/reload-plugins` dans toute session déjà ouverte :

```sh
claude plugin marketplace update inbox
claude plugin update inbox
```

- Il effectue deux appels Sonnet après chaque réponse de Claude, un pour les lignes et un pour l'onglet Status. Voir [Coût](#cost).
- Il a été construit et testé avec Claude Code 2.1.300.

### Codex

```sh
codex plugin marketplace add petekp/inbox
codex plugin add inbox@inbox
```

Si votre shell indique `command not found: codex`, utilisez la copie contenue dans l'application ChatGPT à la place de `codex` dans les deux commandes :

```sh
/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex
```

Puis, dans l'application ChatGPT Desktop, faites confiance aux hooks du plugin : cliquez sur l'icône de hook à côté du réglage d'approbation du prompt, puis sur Allow all. Si l'icône n'est pas là, ouvrez Settings, puis Hooks, puis Inbox, puis Trust all. Codex n'exécute les hooks d'un plugin qu'après votre accord. Sur Codex 0.164.0 et versions ultérieures, une mise à jour arrête les hooks ; faites-leur de nouveau confiance après chaque mise à jour. Pour ouvrir l'inbox, ouvrez le panneau latéral et choisissez le menu ⋯ à côté de New, puis Inbox. Cela a été vérifié le 14 novembre 2026 dans l'application ChatGPT avec Codex 0.169.

[codex/README.md](codex/README.md) couvre la mise à jour et l'exécution de la commande `codex` depuis l'application.

### omp

```sh
omp plugin marketplace add petekp/inbox
omp plugin install inbox@inbox-omp
```

L'inbox commence à fonctionner dans la session omp suivante. `omp plugin list` l'affiche comme `inbox@inbox-omp`. Il lit `.omp-plugin/marketplace.json`, qu'omp cherche avant le dossier `.claude-plugin/` utilisé par Claude Code.

Pour mettre à jour, exécutez ces commandes, puis redémarrez omp :

```sh
omp plugin marketplace update inbox-omp
omp plugin upgrade inbox@inbox-omp
```

Après chaque réponse, l'inbox effectue deux appels de modèle, un pour mettre à jour les lignes et un pour écrire l'onglet Status. Il utilise le premier de ces choix que votre omp peut exécuter :

1. Le modèle nommé par votre rôle `@inbox`.
2. Le Sonnet le plus récent de vos fournisseurs, `anthropic` en premier.
3. Votre rôle `@smol`.

Pour définir `@inbox`, ajoutez-le sous `modelRoles` dans le `config.yml` d'omp, puis redémarrez omp :

```yaml
modelRoles:
  inbox: anthropic/claude-sonnet-5-5
```

Seul Sonnet a été testé. Un autre modèle pourrait fonctionner, mais personne n'a vérifié ses performances. Votre fournisseur facture chaque appel au tarif de ce modèle.

Si `@inbox` n'est pas défini, ou nomme un modèle qu'omp ne peut pas utiliser (modèle inconnu ou auquel vous n'êtes pas connecté), l'inbox passe au choix suivant. Le pied du panneau indique le modèle utilisé. Un modèle qu'omp peut utiliser mais dont l'appel échoue n'entraîne pas ce repli : cette mise à jour échoue, et la réponse suivante la retente. Sans modèle utilisable, le pied indique « aucun modèle d'inbox : définissez @inbox » et l'inbox ne peut pas se mettre à jour.

### Pour tous

L'onglet PRs nécessite GitHub CLI, `gh`, connecté.

## Utilisation

Tapez `/inbox` dans Claude Code ou omp, ou ouvrez l'onglet Inbox dans l'application ChatGPT. L'inbox comporte quatre onglets : Status, Asks, Finds et PRs.

L'inbox démarre vide. Donnez une tâche à votre agent, et les premières lignes apparaissent après sa réponse : une question qu'il vous a posée, avec ses réponses sous forme de boutons, et le Status du travail. Dans Claude Code, la ligne au-dessus du prompt s'affiche dès que l'inbox a quelque chose.

Pour voir chaque partie avec des exemples, exécutez `/inbox demo` dans Claude Code ou omp. Les appuis ne modifient que les exemples. Dans Claude Code, appuyez sur Hide demo ou exécutez de nouveau la commande pour revenir en arrière. `/inbox demo recording` omet les avis qui signalent les exemples, pour une vidéo. Dans omp, ils durent jusqu'à la fermeture du panneau.

### Status

Où en est le travail de la session, pour quelqu'un qui y revient à froid. La page nomme d'abord ce sur quoi la session se concentre, puis chaque partie du travail avec son état. Une partie inactive depuis un jour indique depuis combien de temps. Les sous-agents et autres travaux en cours sous une partie s'affichent en dessous. Une partie qui attend une question ou une tâche de votre part l'indique, et View l'ouvre. Une ligne marque votre dernière consultation, pour que ce qui a changé depuis se trouve au-dessus. Le travail terminé se replie dans un compteur que vous pouvez ouvrir.

Vous pouvez définir un objectif avec une ligne d'arrivée, comme « 2.5 dans le store ». La page regroupe alors le travail sous les jalons de l'objectif, et l'inbox maintient l'objectif et ses jalons à jour. Vous pouvez modifier ou supprimer l'objectif à tout moment. Un objectif que vous avez tapé reste jusqu'à ce qu'il soit atteint. Un objectif déduit par l'inbox évolue avec le travail.

La page est un guide du travail, pas un journal. Le deuxième appel de modèle après chaque réponse l'écrit. Lorsque cet appel échoue, la page l'indique.

### Asks

Questions que l'agent vous a posées, et tâches que vous seul pouvez faire.

L'agent n'a rien à faire de particulier pour placer une question ici. Après chaque réponse, un modèle lit ce que l'agent a écrit et enregistre chaque question, avec ses réponses possibles. La réponse recommandée par l'agent vient en premier. Appuyez sur une réponse et elle parvient à l'agent comme votre message, quelques secondes plus tard, pour qu'Undo puisse annuler un appui erroné. Vous pouvez aussi taper votre propre réponse, ou appuyer sur Explain pour que l'agent en dise plus avant votre décision.

Lorsque la question est un choix de conception, comme deux mises en page ou deux façons de construire une fonctionnalité, Compare demande à l'agent d'essayer chaque réponse sur votre code et de créer une page qui les montre côte à côte, ouverte depuis la question. La page met en avant le choix de l'agent, et sa réponse donne le choix, sa raison et le chemin de la page. Lorsque l'agent peut lancer un sous-agent en arrière-plan, la comparaison s'y déroule, pour vous laisser continuer à travailler. La question indique « Comparaison en cours… » jusqu'au retour de l'agent. Après 30 minutes sans retour, elle indique « Aucune comparaison reçue » et vous pouvez appuyer de nouveau sur Compare.

Une tâche est par exemple une connexion ou l'ajout d'une clé API. Elle comporte des boutons pour ses étapes, comme copier une commande ou ouvrir un fichier. Dans Claude Code, exécuter la commande avec `!` clôt la tâche dès qu'elle réussit. Dismiss abandonne une tâche que vous ne ferez pas, sans message à l'agent.

### Finds

Bugs, risques et idées que l'agent a remarqués en dehors de la tâche sur laquelle il travaille. L'agent les enregistre et poursuit sa tâche, et vous décidez plus tard lesquels traiter. Fix sur un problème, ou Do it sur une idée, transmet la question à l'agent. File issue demande à l'agent de l'enregistrer dans votre gestionnaire de tickets, comme Linear ou GitHub, ou de lier le ticket qui couvre déjà le sujet. Reply envoie vos propres mots à ce sujet. Explain demande à l'agent de dire pourquoi c'est important et ce que demanderait une correction, sans agir. Discuss en discute, et Dismiss l'écarte.

### PRs

Pull requests de cette session et de votre branche actuelle. Chacune est marquée Blocked, Ready ou Waiting, et liste ce qui la bloque : commentaires de relecture en attente de vous, vérifications en échec et conflits de fusion. Les boutons confient le travail à l'agent : traiter un commentaire de relecture ou tous, rédiger une réponse, corriger une vérification en échec, résoudre les conflits ou fusionner. Fix et Resolve conflicts n'apparaissent que tant que GitHub montre encore le problème. Une PR fusionnée ou fermée quitte l'onglet d'elle-même, avec Undo pour la garder. Clear merged and closed, en haut de l'onglet, efface celles qui restent, sauf celle de votre branche actuelle.

Votre agent peut aussi classer les PR dans un ordre, par exemple laquelle fusionner en premier. L'onglet les liste alors en premier, numérotées, avec l'objet et la raison de cet ordre. Lorsqu'une PR classée change, l'onglet l'indique et propose de nouveau Rank.

### Il se tient à jour

Lorsque vous répondez à une question dans votre propre message, qu'une tâche est faite ou que l'agent corrige un constat, l'inbox clôt l'élément. Les éléments clos se replient sous les éléments ouverts, avec leur issue. Un élément écarté garde Reopen jusqu'à la fin de la session.

L'agent lit aussi l'inbox. À côté de chacun de vos prompts, il voit ce qui reste ouvert et ce auquel vous avez répondu, même après compaction de la conversation. Chaque appui montre immédiatement ce qu'il a fait. Discuss indique « Discussion en cours… » jusqu'à la réponse de l'agent, puis « ✓ Discuté ».

### Dans chaque application

Help liste les touches et la signification de chaque marque.

- **Terminal :** chaque action montre la lettre qui la déclenche. Les touches numériques changent d'onglet, et `j` et `k` montent et descendent. Sur Status, elles parcourent les lignes qui ont un bouton, et la lettre à côté d'un bouton l'appuie. ctrl+x tab déplace le focus du prompt vers la ligne au-dessus, puis vers le panneau, puis de nouveau vers le prompt.
- **Application Claude Desktop :** vous cliquez. Tapez `/inbox` pour ouvrir le volet. Les clics dans le volet sont vérifiés sur le moteur Claude Code 2.1.309 et versions ultérieures. Sur 2.1.295, un clic après un appui ne pouvait que redonner le focus au volet.
- **Application ChatGPT :** vous cliquez, ou appuyez sur les mêmes touches que dans le terminal. L'onglet n'affiche pas de lettres.
- **Application Herdr :** voir [Volet Herdr](#herdr-app-pane).
- **omp :** `/inbox` ouvre le panneau par-dessus la conversation, et esc le ferme. Chaque action montre la lettre qui la déclenche, et Reply est `t`. Les flèches parcourent les lignes et les boutons d'une ligne, et entrée appuie sur le bouton ciblé. Tab, ou les touches numériques, changent d'onglet. Sur Status, `j` et `k` parcourent les lignes qui ont un bouton, et les flèches haut et bas font défiler la page.

Dans Claude Code, une ligne au-dessus de votre prompt compte ce qui demande votre attention et les constats en attente, avec un bouton qui ouvre le panneau. Lorsque Claude s'arrête sur une erreur, une seconde ligne en indique la raison, avec un bouton Resume après une erreur API. L'application ChatGPT n'a pas une telle ligne. omp a une ligne avec les mêmes comptes. Elle indique que `/inbox` ouvre le panneau, et n'a pas de ligne d'arrêt.

### Volet Herdr

Dans un terminal de l'application Herdr, l'inbox peut s'ouvrir dans un volet à côté du terminal.

1. Démarrez Claude Code ou omp dans un terminal de l'application Herdr, et tapez `/inbox`. La première fois, l'inbox s'ouvre dans le terminal et demande « Installer le mod Herdr de l'inbox ? ». Appuyez sur Install. L'application ChatGPT pose la même question dans son onglet Inbox.
2. Tapez de nouveau `/inbox`. L'inbox s'ouvre dans un volet à droite du terminal. Le bouton Open inbox de Claude Code fait la même chose. Si vous avez appuyé sur Install dans une autre session ou application et que l'inbox s'ouvre encore dans le terminal, redémarrez Claude Code.
3. Le volet montre l'inbox du terminal sur lequel vous avez dernier mis le focus dans son onglet. Il comporte Asks, Finds et PRs, et vous pouvez appuyer sur tous les boutons. ← et → changent d'onglet, `j` et `k` parcourent les lignes, et esc rend les touches au terminal. Help liste le reste.

Don't install enregistre votre réponse. Exécutez `/inbox herdr` dans Claude Code ou omp pour qu'on vous redemande.

Le CLI Codex n'a pas de `/inbox`. Ouvrez le volet avec `herdr-app do pane.split '{"direction":"right","pane":"<pane id>","mod":"inbox"}'`, en prenant l'identifiant du volet depuis `herdr-app ls`.

Dans un volet Herdr, Claude Code, omp et le CLI Codex signalent aussi à la barre latérale de Herdr, sous forme de jetons de volet :

| Jeton | Contenu |
|---|---|
| `inbox` | Ce qui attend de vous, en une ligne |
| `inbox-needs-you`, `inbox-findings`, `inbox-prs` | Le compte de l'onglet seul, comme `2`. `inbox-needs-you` est celui de l'onglet Asks, et `inbox-findings` celui de Finds. Vide lorsque l'onglet n'a rien en attente. |
| `inbox-stop` | Pourquoi l'agent s'est arrêté. Les jetons de comptes restent vides jusqu'à la fin de l'arrêt, pour laisser la place dans la barre latérale. |
| `inbox-focus` | Ce sur quoi la session se concentre, d'après son Status. Une session qui a lancé celle-ci comme délégué Herdr l'affiche comme ligne du délégué. Aucune ligne de la barre latérale n'en a besoin. |

Pour distinguer les comptes par la couleur de chaque onglet, ajoutez cette ligne à `rows` sous `[ui.sidebar.agents]` dans la configuration de Herdr :

```toml
[
  { token = "$inbox-stop", fg = "#ffa3b0" },
  { token = "$inbox-needs-you", fg = "#ffae42" },
  { token = "$inbox-findings", fg = "#cab0ff" },
  { token = "$inbox-prs", fg = "#8cc8c0" },
],
```

Herdr place ` · ` entre les jetons qui ont une valeur, et omet la ligne lorsqu'aucun n'en a.

## Coût

Dans Claude Code, l'inbox ajoute deux choses :

| Ce qu'ajoute l'inbox | Jetons | Coût aux tarifs API |
|---|---|---|
| Un appel Sonnet après chaque réponse de Claude, pour mettre à jour l'inbox | 3–4k en entrée, dont environ 2k en cache. 100–250 en sortie. | Environ 0,5 ¢ par réponse, ou 1 ¢ après 5 minutes d'inactivité |
| Un second appel Sonnet, pour écrire l'onglet Status | Environ 1,2k en entrée et 14–44 en sortie sur un court échange (trois exécutions d'évaluation : 1 175–1 214 en entrée). Une reprise sur toute une conversation lit davantage : 1 358 en entrée et 100 en sortie lors de l'exécution relevée. | Moins que le premier appel, qui lit environ 3k en entrée |
| Ses instructions et outils, envoyés avec chaque requête de Claude | Environ 1 350, en cache | Moins de 0,1 ¢ par requête |

Sur un forfait Claude, ces éléments comptent dans vos limites d'utilisation.

Dans Codex, la mise à jour après chaque réponse passe par le binaire `codex` à l'intérieur de l'application Desktop, avec votre connexion Codex. Il effectue deux appels par réponse. Chacun comporte environ 12 000 jetons d'entrée d'instructions de base, inclus dans chaque appel `codex exec`, plus son propre prompt. L'ancien appel unique représentait environ 16 000 jetons. Cela compte dans l'utilisation de votre forfait.

## Ce qu'il exécute, envoie et modifie

Ceci concerne le mod Claude Code. [codex/README.md](codex/README.md) couvre le plugin Codex. L'extension omp exécute les mêmes requêtes `gh`. Sa requête de mise à jour passe par la propre connexion d'omp au fournisseur du modèle utilisé, et contient les mêmes éléments que la requête Claude Code.

**Ce qui quitte votre machine.** Trois choses, et rien d'autre :

- Après chaque réponse de Claude, l'inbox envoie deux requêtes Sonnet à Anthropic via la connexion de modèle propre de Claude Code. Toutes deux contiennent votre dernier prompt, la réponse de Claude, les éléments ouverts de l'inbox et une ligne par outil utilisé par Claude. Une ligne d'outil ressemble à `ran: npm test` ou `edited src/app.ts`. [Coût](#cost) donne la taille de la requête.
- Lorsque l'inbox a pu manquer un tour, il demande au même modèle, avec les deux mêmes appels, de se mettre à jour depuis toute la conversation. Il duplique la conversation pour cela, ou lit la transcription après une reprise.
- Pour remplir l'onglet PRs, il exécute des requêtes `gh` en lecture seule : `gh pr view` et `gh api graphql` pour les fils de relecture. Elles atteignent GitHub avec votre propre connexion `gh`. L'inbox ne lit jamais votre jeton GitHub.

**Programmes qu'il lance.**

| Programme | Quand |
|---|---|
| `gh` | Pour remplir l'onglet PRs |
| `open` | Lorsque vous appuyez sur un bouton qui ouvre un lien, un fichier ou un dossier |
| `test -x` | Avant d'ouvrir un fichier. Un fichier exécutable est montré dans Finder, non exécuté. |
| `herdr pane report-metadata` | Uniquement dans un volet Herdr, pour afficher ce qui attend de vous et le compte de chaque onglet dans la barre latérale de Herdr |

**Messages qu'il envoie à votre place.** Lorsque vous appuyez sur un bouton de réponse ou d'action, l'inbox envoie à Claude un message en votre nom. Le message est la réponse choisie, ou une demande concernant l'élément, comme demander à Claude de corriger un constat. Resume, sur un tour arrêté, envoie `Continue`. Chaque message envoyé part d'un appui. Lorsque vous marquez Done une tâche que Claude attend, l'inbox le dit à Claude quelques secondes plus tard, ou à la fin du tour en cours de Claude.

**Ce qu'il ajoute au contexte de Claude.**

- Ses instructions, environ 1 350 jetons, dans chaque requête.
- Une note à côté de votre prompt lorsque vous répondez à l'une des questions numérotées de Claude, ou lorsque l'inbox a changé depuis la dernière fois que Claude l'a vu.
- Ses éléments ouverts après compaction de la conversation, pour que Claude les garde.

**Ce que voient ses hooks.**

- Les appels d'outils. L'inbox lit chaque appel pour écrire les lignes d'outils ci-dessus, pour afficher une question pendant que la boîte de dialogue de Claude est ouverte, et pour trouver une PR ouverte par `gh pr create` dans cette session. Il transmet chaque appel sans le modifier, sauf les appels à ses deux propres outils. `record` enregistre une question, une tâche ou un constat, et `close` clôt un élément. L'inbox y répond lui-même, donc ils s'exécutent sans invite de permission.
- Les invites de permission. Pendant que Claude Code vous demande d'approuver un appel d'outil, l'inbox affiche une ligne correspondante, puis transmet la requête sans modification. Il n'approuve ni ne refuse jamais une invite de permission.
- Les descriptions d'outils. Il liste ses deux propres outils à Claude dès le départ, plutôt que derrière une recherche d'outils. Il ne touche pas aux descriptions des autres outils.
- Les commandes shell que vous exécutez avec `!`, et leur sortie. Une commande qui s'exécute sans rien sur stderr clôt une tâche vous demandant de la lancer.
- Les démarrages de session. Après `/clear`, une reprise ou un fork, l'inbox charge les éléments de cette conversation. Il transmet l'événement sans modification.
- Votre réglage de thème, pour accorder ses couleurs.

**Ce qu'il conserve.** L'inbox enregistre les éléments de chaque session, et les PR qu'il suit, dans le stockage des plugins Claude Code sur cette machine. Il garde les 40 sessions les plus récentes et supprime les plus anciennes. Un élément peut résumer une partie de la conversation, donc il peut nommer les personnes qui y participent. Rien n'est transmis à l'auteur du plugin.

Il ajoute aussi la commande `/inbox`.

## Développement

[docs/developing.md](docs/developing.md) explique comment exécuter et construire l'inbox depuis un clone.
