# TavernWeaveX无限月读

> **Publication officielle 2.4.0** : ajout de l'**adaptation native Antigravity (AGY)** — modèle de plugin hôte AGY, fichiers d'instruction et persistance des quatre niveaux de préférence de guidage — et alignement des manifests Codex, Claude et des descriptions du marketplace sur le manifeste d'installation principal, pour retrouver une cohérence de version. Les noms et le nombre des 23 Skills restent inchangés. Les artefacts de publication et les fichiers de vérification sont sur la [page de publication v2.4.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0). Une installation depuis les sources vérifie les 23 Skills d'après le manifeste local ; la portée complète de la validation est décrite dans le CHANGELOG et le contrat DSH.

> Cette version s'appuie sur la **2.3.6** et conserve les 23 Skills. Le plugin Claude Code introduit en 2.2.0 continue d'offrir l'injection automatique du Host Front Door, l'agent `tavernweave` et le changement de mode Soul au-dessus du champ de saisie ; le paquet de plugins **TavernWeave X DSH** intègre désormais le panneau client de la Main Divine (molette, fenêtre complète, worldbook, base de design et d'animations front-end, gestion des projets/cartes) en une seule installation ; les points d'entrée de conception et d'écriture du worldbook restent disponibles. Paquet complet, paquet de plugins et fichiers de vérification figurent sur la [page de publication v2.4.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0) ; provenance et historique de fusion dans les [notes de mise à niveau](docs/dual-task-upgrade.md).

<p align="center">
  <img src="docs/assets/tavernweave-v1-cover.png" alt="Un métier à tisser numérique dans une taverne fantastique, qui tisse fiches de personnage, worldbook, documents de design et modules d'ingénierie en un seul flux de travail" width="100%">
</p>

<p align="center"><strong>Tissez inspiration, documentation, code et validation en une fiche de personnage réellement maintenable.</strong></p>

TavernWeaveX无限月读 (TW en abrégé) vous aide à transformer une idée en fiche de personnage, page web ou petit outil utilisable et modifiable. Vous pouvez dire ce que vous voulez faire ou ce qui ne va pas ; TW précise le besoin, propose une approche, fabrique et vérifie, puis explique comment essayer le résultat. Il organise ce travail avec des Skills chargés selon la tâche (capacités de travail invoquées à la demande), prend en charge Codex, Claude Code et, via le paquet **TavernWeave X DSH**, DeepSeek Harness ; le paquet DSH contient aussi le panneau client de la Main Divine.

Le code source actuel correspond à la **publication officielle TavernWeaveX无限月读 2.4.0**, avec adaptation native Antigravity (AGY), persistance des quatre préférences de guidage et correction de la cohérence de version entre hôtes ; 23 Skills natifs, dont les noms et le nombre sont inchangés. Le plugin Claude Code introduit en 2.2.0 continue d'offrir l'injection automatique du Host Front Door, l'agent `tavernweave` et la bascule de mode Soul (voir [Plugin Claude Code](#claude-code-插件)) ; le paquet **TavernWeave X DSH** intègre le panneau client de la Main Divine, et les points d'entrée de conception/écriture du worldbook restent disponibles. L'identifiant d'installation `tavernweave-agent-skills`, les noms des Skills et l'adresse du dépôt sont conservés pour faciliter la vérification des mises à jour. Paquet complet et fichiers de vérification sur la [page de publication v2.4.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0) ; les pages historiques [v2.2.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.2.0), [v2.1.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.1.0), [v1.9.1](https://github.com/LiarMTTT/TavernWeave/releases/tag/v1.9.1) et [v1.9.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v1.9.0) restent accessibles.

**L'objectif principal du plugin unifié est de permettre aux utilisateurs autorisés d'invoquer TW dans les tâches longues du cloud dots.** Codex et dots partagent `TavernWeave-Codex-v2.4.0.zip`, sans version cloud distincte. TW fournit les Skills et les documents de référence ; l'exécution, la reprise, le stockage persistant et les outils viennent de l'hôte réel. Une installation locale ne se synchronise pas automatiquement avec le compte dots. Mode d'emploi et accès au compte dans le **[guide du plugin unifié](docs/plugin-guide.md)**.

TW peut concevoir ou réécrire un worldbook de façon autonome : il clarifie d'abord les limites de la connaissance, le texte et les conditions de déclenchement, puis choisit entre entrées natives, sortie conditionnelle, lecture explicite ou mélange partiel. Le contenu du worldbook est transmis séparément de la fiche entière, de la construction du monde, des variables et du débogage à l'exécution. L'optimisation du budget exige des mesures réelles, et l'effet sur le modèle doit être observé dans l'hôte correspondant. Les tâches logicielles et de création de fiches partagent la même méthode de clarification des besoins et de spécification des prompts ; les décisions déjà prises sont réutilisables.

La méthode de création 墨月 confirmée en 1.9.1 reste en vigueur : une fiche complète s'articule autour du texte d'ouverture et du worldbook, organisés en texte pur, MVU Zod ou hybride, avec des méthodes complémentaires pour l'univers, les variables et les personnages. Le front-end commence par étudier le besoin et les designs connexes, en se référant par défaut aux exigences d'Awwwards ; l'interface reste épurée et le texte évite les formules toutes faites selon l'usage.

Vous pouvez aussi demander une seule règle de prompt pour fiche de personnage : l'Agent conserve le sens et la force des contraintes, et livre le texte ou l'entrée de worldbook demandée. L'outil de liaison de champs renvoie un diagnostic explicite en cas d'erreur de type `bindings`, au lieu de lever une exception de méthode de tableau. La 1.9.0 a corrigé le problème de fichiers à moitié exportés sous Windows après un échec ; les fichiers impossibles à nettoyer sont listés explicitement. Voir le [journal des modifications](CHANGELOG.md).

Le tableau de progression des projets continue d'être généré par `orchestrate-project-blueprint` dans chaque projet : barres d'avancement globales et par module, points de contrôle et preuves dépliables, idées, bugs et paroles de relecture conservés. Le tableau lit le périmètre et les critères d'acceptation dans le design global du projet, et l'état actuel, les preuves et la prochaine porte dans NEXT ; la synchronisation prévisualise d'abord les différences et revérifie après tout changement de source, de retour ou de preuve. Une nouvelle idée n'étend pas automatiquement un périmètre confirmé, et un pourcentage ne remplace pas l'acceptation par le pilote ou l'hôte réel. Mode d'emploi : [tableau de progression des projets](docs/project-progress-board.md).

La bibliothèque d'œuvres prend toujours en charge les romans, les documents source/fanworks et les références textuelles ou visuelles en ligne ; elle livre par défaut un Markdown modifiable et un index JSONL, avec export SQLite possible, et permet la recherche par source, version adaptée et stade de connaissance. Voir [mode d'emploi de la bibliothèque d'œuvres](docs/work-library.md).

Toutes les capacités respectent le langage clair et l'explication des termes ; le choix entre débutant, initiation, pratique et expert revient à l'utilisateur. Affinage de texte, revue complète et architecturale, brainstorming, Library de design intégrée, Soul et accompagnement de reprise de fiches anciennes restent disponibles. La vérification d'installation s'appuie sur la liste réellement obtenue sur la machine ; le chargement effectif par le client et les mesures de qualité ou de jetons par œuvre font l'objet de contrôles distincts.

> Le contenu original de TavernWeave est sous [PolyForm Noncommercial License 1.0.0](LICENSE). Utilisation, modification et redistribution non commerciales autorisées ; sans autorisation supplémentaire du titulaire, ni la version originale, ni les versions modifiées ou redistribuées ne peuvent servir à des fins commerciales. La licence et les avis de droits d'auteur doivent être conservés lors de la redistribution. Le contenu tiers reste soumis à ses [licences propres](THIRD_PARTY_NOTICES.md).

## Pour commencer en une phrase

Création de fiche ordinaire ou Vibe Code :

```text
我想用 TavernWeave 做一个【描述你想要的作品】。
先看看已有文件，帮我整理成一个能亲手试用的小成果；用大白话说明推荐理由和我需要决定的事情。
```

Si vous avez déjà des fichiers de fiche :

```text
我接手了这张角色卡，想【沿原作继续更新 / 做二创】。
先帮我看懂原卡，说明有哪些材料、哪些内容需要保留，再一起选第一次改动。
```

## Collaborez à votre rythme

| Niveau de guidage | Ce que vous obtenez |
| --- | --- |
| Débutant | une petite étape à la fois, avec explication détaillée de l'emplacement, des raisons, des termes et du résultat attendu |
| Initiation | une petite phase à la fois, avec les mêmes explications sur la méthode, les liens entre les étapes, les choix et les vérifications |
| Pratique | étapes courantes regroupées, décisions clés, raisons et résultats de vérification indiqués |
| Expert | conclusions, modifications, différences et preuves directement, sans répétition des bases |

Vous pouvez dire « à l'avenir, utilisez le niveau initiation » ou « passez mon niveau à expert ». L'emplacement et la portée réels sont indiqués avant l'enregistrement ; un choix existant est conservé lors des mises à jour ; sans choix, aucun niveau n'est attribué automatiquement. « Plus court cette fois » ne concerne que cette réponse. **Tous les niveaux restent détaillés en cas de besoin ou de correction de bug, sauf indication contraire explicite de votre part.**

Les termes nécessaires sont expliqués à leur première apparition, avec un rapprochement « terme original / langage clair / signification concrète » lié à la tâche en cours. Le langage clair et le niveau de guidage sont indépendants de la personnalité Soul et de l'affinage de texte ; quitter l'un n'efface pas votre choix. Règles et exemples complets : [communication et guidage partagés](skills/consult-tavernweave-library/references/communication-and-guidance.md).

## Façons d'exprimer et de collaborer (facultatives)

Version accompagnement doux :

```text
阿瞳助我！
```

Version apprentissage strict :

```text
MTTT.sir，拷打我！
```

Version œuf de Pâques de revue front-end :

```text
灵魂杀手！
```

Pour transformer un souhait en design global et première version :

```text
脑暴模式
```

Pour faire participer les trois objectifs Soul au brainstorming :

```text
脑暴模式，Soul 联席
```

Pour exécuter une première version figée après validation du design :

```text
按蓝图开跑第一版
```

Pour revérifier tout le parcours Vibe Code à partir des preuves actuelles :

```text
照镜子
```

Pour ne produire qu'une feuille d'évaluation textuelle complète, copiable et enregistrable :

```text
照镜子，只要文字评估表单，不要画板
```

Pour quitter la couche de personnalité :

```text
Soul 归位
```

Soul reste une surcouche Portable au niveau de la tâche en cours. 阿瞳 et MTTT.sir sont deux projections pédagogiques publiques de la méthode MTTT ; 灵魂杀手 est un œuf de Pâques non officiel (Johnny Silverhand fanwork) qui examine le front-end : il peut être caustique, mais doit apporter des preuves et des corrections. Les trois sièges réunis sont trois lentilles d'un même Agent, qui partagent les faits, les permissions, une à deux décisions nécessaires par tour (quatre au maximum au total) et le même registre de conclusion — ce ne sont pas trois modèles indépendants. Il n'obtient pas automatiquement l'historique ChatGPT ni un RAG privé, ne persiste pas au-delà d'une nouvelle tâche et n'étend pas les permissions sur les fichiers, Git, le réseau, la publication ou la production.

## Affinage de texte et revue complète / architecturale · v1.4.0

Dites « réécrivez ce passage », « retirez le ton IA » ou « retirez le style scolaire » et vous obtenez une version affinée qui préserve le sens. Par défaut, légère retouche ; vous pouvez demander une restructuration ou une réécriture en profondeur ; les contenus techniques (paramètres de personnage, nombres, code, macros et variables) gardent leurs contraintes d'origine.

| Usage | Activation | Désactivation |
| --- | --- | --- |
| Ponctuel | réécrivez ce passage…… | terminé après livraison |
| Permanent pour la tâche | activez le mode d'affinage continu | quittez le mode d'affinage |
| Permanent pour l'espace de travail | activez le mode d'affinage dans cet espace | désactivez le mode d'affinage de l'espace |
| Permanent pour le client | activez le mode d'affinage global pour ce client | désactivez le mode d'affinage global du client |

Le mode continu couvre la rédaction, les textes externes, les explications courantes, les plans et les rapports de revue ; il conserve citations, code, modèles obligatoires et preuves. Les modes persistants affichent d'abord les fichiers de règles réels et les différences, puis n'écrivent qu'après accord du pilote, dans un bloc séparé. L'installation ou la mise à jour de TW ne l'active pas. La sortie de tâche ne concerne que la tâche en cours ; « afficher l'état du mode d'affinage » distingue les portées et les preuves de chargement par l'hôte.

La « revue complète » examine tout le périmètre convenu ; la « revue architecturale » suit responsabilités, dépendances, états et chaînes critiques ; la « revue architecturale complète » combine les deux. Logiciels et fiches de personnage sont concernés. Le rapport distingue ce qui a été vérifié, partiellement vérifié, non lu et exclu, et livre toutes les constatations étayées. Vous pouvez aussi dire « 灵魂杀手，全量架构审查 » pour garder le style Soul ; le résumé ne dépasse pas trois points et le rapport complet n'est pas tronqué. La revue livre d'abord des résultats en lecture seule.
## Les cinq niveaux d'entrée

```text
Host Front Door（可选本地入口）
  -> Soul（阿瞳 / MTTT.sir / 灵魂杀手 / 三席，可选）
    -> 脑暴编排（总设计案 + First Playable + 蓝图/蓝图集，可选）
      -> Library（A0 + ST 指南 + 设计/动效 + 来源 Wiki + 挑选页）
        -> 按机器清单分发的工程 Skill（创作、组件、API、UI、调试、成长核验、构建、验收等）
```

- **Host Front Door (entrée locale facultative)** connecte le langage clair persistant, le routage des tâches et les règles de collaboration au client local ; lors de l'installation du plugin Claude Code, il est injecté automatiquement par le hook SessionStart, en alternative au bloc `CLAUDE.md` (voir [Plugin Claude Code](#claude-code-插件)). Le niveau de l'utilisateur est enregistré séparément et conservé lors des mises à jour de l'entrée ; correspondance des fichiers et chargement réel par le client sont vérifiés séparément.
- **Soul (personnalité facultative)** modifie le ton et la manière d'enseigner dans le niveau de guidage choisi, sans changer les faits, les permissions ni les résultats de validation.
- **L'orchestration du brainstorming** contrôle le nombre de tours d'orientation, les décisions à quatre états, les limites de la première version et le volume des蓝prints ; aucune étape active ne peut se propager récursivement sans fondement. Un vrai problème peut être temporairement détaillé, mais une fois résolu ou confirmé, la branche doit être close et le flux ramené à l'étape parente.
- **La Library** est distribuée en un seul tenant et lue à la demande ; une installation unique ne signifie pas charger toute la bibliothèque à chaque tour.
- **Les Skills d'ingénierie** accomplissent le travail réel. La personnalité et les documents ne remplacent pas l'autorité du runtime cible.

## Tableau des Skills

| Skill | Responsabilité principale |
| --- | --- |
| `activate-tavernweave-soul` | activer, faire basculer ou désactiver les modes 阿瞳 / MTTT.sir / 灵魂杀手 pour la tâche courante ; Johnny est une personnalité d'œuf de Pâques de revue front-end, sans RAG privé conservé |
| `build-work-library` | organiser romans, documents source et fanworks, références textuelles et visuelles en ligne ; retour aux sources, filtrage par version/stade, édition manuelle, reprise par lots, Markdown＋JSONL et export SQLite |
| `consult-tavernweave-library` | routage obligatoire vers A0, les 31 guides ST officiels et le guide expérimental C8, puis consultation à la demande de 462 designs, 194 animations, 86 concepts, 1 609 entrées de registre distillé et des pages de sélection hors ligne |
| `orchestrate-project-blueprint` | transformer le souhait d'une fiche ou d'un Vibe Code ordinaire en design global, First Playable, ensembles de蓝prints hiérarchisés, NEXT et portes d'exécution anti-récursion ; peut réunir les trois sièges Soul ; tableau de progression, pourcentages, enregistrement des retours et synchronisation design global／NEXT |
| `reflect-on-vibe-code-growth` | réévaluer tout le réseau de compétences Vibe Code depuis les preuves Codex/Chat/projet et livraison actuelles, produire une feuille d'évaluation textuelle complète copiable et un rapport interactif en sept chapitres, comparer à des jalons historiques non modifiables sur une échelle comparable, et conserver un historique local append-only anonymisé |
| `worldbook-design-and-writing` | planifier, diviser, assembler, relire et affiner le worldbook ; choisir ensemble la voie native, modèle ou hybride partielle, en préservant sémantique et limites de connaissance ; API précise et validation à l'exécution relèvent des capacités dédiées |
| `tavern-card-builder` | identifier le type de fiche et ses dépendances ; maintenir l'autorité de création, la chaîne des sources, le worldbook, MVU, CoT, l'ouverture et les limites de l'architecture de mémoire |
| `sillytavern-card-components` | démontage sans perte, limites des composants, registry/recipe et cohérence des allers-retours |
| `sillytavern-component-update` | mise à jour par composant, artefacts de test importables et transmission au pipeline de fiche entière, blocage du réempaquetage silencieux |
| `sillytavern-render-regex-pipeline` | vérifier par fixtures la sémantique des regex, le placement, l'affichage/le prompt, la profondeur et les phases |
| `sillytavern-rolecard-security` | analyse en lecture seule des injections, exécution dynamique, formes d'identifiants, chargement distant et risques de permissions inter-images |
| `sillytavern-database-rolecards` | schémas de tables, étages de messages, liaisons et migrations idempotentes ; la compatibilité C8 de même niveau reste une voie expérimentale |
| `sillytavern-extension-dev` | échafaudage minimal d'extension UI, manifest, cycle de vie, instantané des capacités et porte de version |
| `sillytavern-rolecard-performance` | budgets anonymisés, régressions et échantillonnages nommés sur le runtime réel |
| `sillytavern-media-live2d-runtime` | médias, audio, Live2D, préchargement, fournisseurs, repli et nettoyage |
| `sillytavern-card-pipeline` | précontrôle des dépendances, adaptation au développement en direct, assemblage, JSON/PNG, synchronisation du worldbook et porte de publication |
| `sillytavern-api-reference` | vérification des API sensibles à la version de ST, Tavern Helper, STScript, EJS, macros et MVU |
| `sillytavern-runtime-debug` | suivi des iframes, console, DOM, styles, données et cycle de vie dans un SillyTavern réel |
| `sillytavern-embedded-ui` | pages d'ouverture, barres d'état, centre de contrôle, tiroirs, fenêtres flottantes et interactions mobiles ; normes de construction bac à sable par œuvre, simulations conjointes, comparaison d'états et réglage par curseurs |
| `code-quality-workflow` | revue complète/architecturale, registre de couverture, constatations intégrales, portes, corrections minimales, régressions et Finish Mode |
| `rewrite-natural-prose` | affinage préservant le sens et la structure technique, en mode ponctuel, continu pour la tâche, ou persistant pour l'espace de travail et le client avec autorisations séparées |
| `shadcn-tailwind-ui` | interfaces produit accessibles avec React, shadcn/ui, Radix et Tailwind |
| `rolecard-workshop-ops` | diagnostic et opérations d'une chaîne de publication configurable, avec protection des coordonnées et identifiants de production |

## Frontières publiques de la Library

Une seule installation contient :

- la check-list A0 de pilotage général, prérequis permanent des tâches d'écriture ;
- les 31 guides officiels STDB et le guide C8 explicitement marqué expérimental ;
- 462 fiches de design, 194 d'animation, 86 index de concepts et 1 609 entrées de registre distillé, après filtrage complet 243/243 par AFV ;
- 86 fiches concept/Wiki locales directement liées, 89 bacs à sable techniques locaux propres et une page de sélection hors ligne unifiée ;
- une liste par fichier des sources, licences, nombre d'anonymisations et empreintes SHA-256.

Ne sont pas distribués : le modèle pilote A1, l'ancien B1 impératif, les archives de processus, les preuves locales, les données AFV raw/inbox, les 243 fichiers JSON de filtrage source, le RAG privé, les journaux, les identifiants et les domaines de connaissance sans rapport ; seuls les reçus agrégés du filtrage, sans texte privé, sont conservés. « Ajouter aux candidats » dans la page de sélection signifie seulement `proposed`, et non adoption, installation, validation de licence ou acceptation réelle en taverne.

La page de sélection hors ligne se trouve dans le répertoire d'installation :

```text
skills/consult-tavernweave-library/assets/picker/index.html
```

## Création, reprise et validation

Les projets longs utilisent Markdown + front matter YAML + blocs structurés contraints pour conserver une autorité de création unique. Confirmations, candidatures, points en attente, refus, implémentation, preuves automatiques, preuves de l'hôte réel et acceptation du pilote ne doivent pas être mélangés. Quand l'utilisateur dit « continuez », on restaure d'abord l'autorité, Git/l'arbre de travail, les artefacts et la prochaine porte, sans revisiter les paramètres figés.

Les preuves sont enregistrées par niveaux :

```text
源码 -> 自动测试 -> 离线制品 -> 浏览器/桌面 -> 真实 SillyTavern -> 人工验收 -> 发布授权
```

Aucun niveau ne peut se faire passer pour le suivant ; l'automatisation ne peut jamais écrire `driver-accepted` d'elle-même.

## Tutoriel pas à pas

Si vous découvrez TavernWeave, ou souhaitez savoir comment diriger l'Agent pour créer une fiche, déboguer et valider : [Tutoriel TavernWeave · initiation au Vibe Code pour fiches](https://liarmttt.github.io/TavernWeave/).

## Installation et mise à jour

Les utilisateurs Codex peuvent consulter d'abord [utilisation et installation Codex](docs/codex-skills.md) : distinction entre l'emplacement des plugins et celui des Skills autonomes, et point d'entrée Python d'installation/vérification sans PowerShell (aperçu en lecture seule par défaut, écriture seulement après application explicite).

Les étapes ci-dessous concernent l'**installation locale** pour Codex ou Claude Code. L'activation et l'usage du plugin dans un compte dots sont décrits dans le [guide du plugin unifié](docs/plugin-guide.md) ; une installation locale ne se synchronise pas avec le cloud. L'installateur doit prendre pour source la liste complète de `skills/` du dépôt, créer les répertoires manquants, et ne pas se contenter d'écraser les Skills déjà présents sur la machine. Le Host Front Door est un renforcement local facultatif ; avant l'installation, examinez le fichier de règles cible et le diff :

```text
请完整安装并启用这个 Skill 仓库：
https://github.com/LiarMTTT/TavernWeave

不要只覆盖本机已经存在的 Skill。请以仓库 skills/ 的完整目录为准；安装后按机器清单核对完整数量（2.3.0 为 23/23；已发布的 1.9.1 为 22/22），并单独确认 worldbook-design-and-writing、build-work-library、activate-tavernweave-soul、consult-tavernweave-library、orchestrate-project-blueprint、reflect-on-vibe-code-growth、rewrite-natural-prose 和 Library 离线挑选页存在。

请检测我使用的是 Codex 还是 Claude Code，说明 TavernWeave Host Front Door 是可选本地增强；先展示目标路径、受控区块和 diff，得到我确认后再安装。不要改写受控区块以外的用户规则。
```

Mise à jour :

```text
请把已安装的 TavernWeave 完整更新到这个仓库的最新版本：
https://github.com/LiarMTTT/TavernWeave

更新必须比较“仓库应有目录”和“实际安装目录”，创建新增 Skill，不能只修改旧目录；同时检查 Host Front Door 是否缺失、过期或漂移，明文给出“更新前门/先看 diff/仅更新 Skills”三种选择。完成后返回两份回执，再新建任务验证本地宿主发现。dots 账户导入另按插件指南验证。
```

Si l'hôte ou l'Agent utilise une installation portable qui copie chaque Skill dans un répertoire de projet, lancez à la racine du dépôt :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tavernweave.ps1 -TargetSkillRoot '<racine réelle des Skills>'
```

Pour traiter la porte globale pendant l'installation, choisissez explicitement l'hôte et laissez le script demander :

```powershell
# Codex : cible par défaut $CODEX_HOME\AGENTS.md ; sinon ~/.codex/AGENTS.md
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tavernweave.ps1 -TargetSkillRoot '<racine réelle des Skills>' -AgentHost Codex -HostFrontDoorAction Prompt

# Claude Code : cible par défaut ~/.claude/CLAUDE.md
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-tavernweave.ps1 -TargetSkillRoot '<racine réelle des Skills>' -AgentHost Claude -HostFrontDoorAction Prompt
```

L'installation ne gère que le bloc de commentaires versionné `tavernweave-host-front-door` ; les fichiers existants sont d'abord sauvegardés, les installations répétées sont idempotentes, et les marqueurs erronés ou dupliqués ainsi que les chemins de lien sont refusés. Pour un aperçu ou une installation séparée :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\manage-host-front-door.ps1 -AgentHost Codex -Action Preview
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\manage-host-front-door.ps1 -AgentHost Codex -Action Install
```

La modification globale des règles constitue une porte d'exécution distincte ; l'Agent ne doit jamais écrire silencieusement sous prétexte que c'est « recommandé ». Codex/Claude doivent créer une nouvelle tâche ou redémarrer pour redécouvrir les Skills ; un reçu de porte ne prouve pas que le Skill Soul a été réellement invoqué.

Après installation ou mise à jour, la vérification doit porter sur les **emplacements réellement analysés**, pas seulement sur le dépôt source. Le vérificateur refuse par défaut de traiter le répertoire source de TavernWeave comme cible d'installation :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-install.ps1 -TargetRoot '<racine réelle du plugin ou des Skills>'
```

Le nombre de Skills du reçu doit correspondre à la liste d'installation de la version source utilisée. Exemple avec les 23 Skills de la 2.3.0 ; le paquet publié 1.9.1 reste à 22/22 :

```text
INSTALLATION VERIFIED: 23/23
Library: present-and-matched
Library picker: present
Soul: present-and-matched
Host rediscovery: required-new-task
```

Si vous indiquez aussi l'hôte et le fichier de règles lors de la vérification, le reçu affiche en plus `Host Front Door: current|missing-block|outdated|drifted` ; c'est un état recommandé, qui ne change pas le jugement sur l'intégrité des fichiers des Skills d'après la liste de la machine.

Les Skills personnels sans rapport présents dans le répertoire cible sont conservés ; les répertoires officiels TavernWeave de la liste doivent correspondre fichier par fichier au code source actuel. Le dernier niveau du chemin cible doit porter explicitement le nom `skills` ; le script refuse les racines de lecteur, les racines de répertoire utilisateur, les cibles à l'intérieur du dépôt source et les liens de répertoire, et annule les Skills officiels remplacés si le remplacement échoue.

Après une vérification complète de la version correspondante, créez une nouvelle tâche ou redémarrez la session pour que l'hôte local redécouvre les Skills. Dans la nouvelle tâche, il faut tout de même invoquer réellement la conception/écriture du worldbook, Soul, l'orchestration du brainstorming, 照镜子 et la Library ; un reçu d'installation ne remplace pas la découverte par l'hôte. Le paquet v2.4.0, `TavernWeave-DSH-v2.4.0.tgz` (DeepSeek Harness) et les fichiers de hachage SHA-256 figurent sur la [page de publication officielle](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0).

Un mainteneur qui vérifie seulement l'arbre source avant publication peut utiliser explicitement `-AllowSourceTree` ; cette option ne peut pas servir aux reçus d'installation des utilisateurs ordinaires.

## Plugin Antigravity / AGY

Les utilisateurs Antigravity / AGY doivent d'abord lire [construction, installation et vérification du plugin natif](host-adapters/antigravity/README.md). Ce paquet réutilise les 23 Skills, charge la porte par des règles persistantes et fournit un agent AGY avec adaptation de la sauvegarde des paramètres ; la validation stricte et les essais sur client sont enregistrés séparément. La conversion d'import du plugin Claude Code à la racine du dépôt n'est pas la voie d'installation du paquet natif AGY.

## Plugin Claude Code

Depuis 2.2.0, le dépôt lui-même est un marketplace de plugins Claude Code (`.claude-plugin/`). Dans Claude Code :

```text
/plugin marketplace add LiarMTTT/TavernWeave
/plugin install tavernweave-agent-skills@tavernweave
```

Le plugin comprend quatre parties, les trois premières correspondant une à une au paquet DSH :

| Composant | Fichiers | Équivalent DSH |
| --- | --- | --- |
| 23 Skills, avec préfixe `tavernweave-agent-skills:` | `skills/` | fournisseur de Skills |
| Injection automatique du Host Front Door : ajout de la porte au contexte de session au début de chaque session (`node` requis dans le PATH) | [`hooks/hooks.json`](hooks/hooks.json), [`hooks/session-start-front-door.mjs`](hooks/session-start-front-door.mjs) | section system prompt |
| agent `tavernweave` : persona dédiée à TW, avec un jeu d'outils réduit (sans réseau ni sous-agents) | [`agents/tavernweave.md`](agents/tavernweave.md) | preset `TavernWeave X DSH` |
| Bascule de mode Soul : une ligne `Soul 阿瞳 ▸` au-dessus du champ de saisie ; le choix remplit le champ avec l'instruction correspondante, à vous de l'envoyer | [`hooks/soul-switch.tsx`](hooks/soul-switch.tsx) (`modules` dans `hooks/hooks.json`) | petite fenêtre flottante Soul de la Main Divine (CC ne garde que cet élément d'interface) |

L'agent `tavernweave` peut servir de session principale : `claude --agent tavernweave-agent-skills:tavernweave` ; vous pouvez aussi demander à Claude, dans une session ordinaire, de lui confier les tâches TW. Si vous avez auparavant copié les Skills dans `~/.claude/skills`, vous pouvez supprimer cette copie après passage au plugin, pour éviter les doublons de noms.

La bascule Soul utilise l'interface des hooks de fonction des plugins Claude Code (officiellement en accès anticipé). Elle figure dans le même `hooks/hooks.json` que le hook de porte ; sur Claude Code 2.1.299, le chargement des deux a été confirmé. Le comportement sur les versions antérieures, qui pourraient ignorer le champ `modules`, n'est pas vérifié. La bascule n'enregistre que l'instruction Soul que vous envoyez réellement ; elle ne prouve pas l'activation de Soul et n'envoie jamais de message à votre place. Les tests d'interface s'exécutent avec `claude plugin test .`.

### Déduplication avec le bloc CLAUDE.md

Une seule porte suffit. Au démarrage, le hook examine les fichiers d'instructions qui seront chargés dans la session : `$CLAUDE_CONFIG_DIR/CLAUDE.md` (sinon `~/.claude/CLAUDE.md`) et, du répertoire courant à la racine, les fichiers `CLAUDE.md`, `.claude/CLAUDE.md` et `CLAUDE.local.md`. Le bloc contrôlé dans ces fichiers est prioritaire :

| Situation | Comportement du hook |
| --- | --- |
| Aucun bloc `tavernweave-host-front-door` dans ces fichiers | injection de la porte fournie par le plugin |
| Bloc de même version déjà présent | aucune injection ; le bloc du fichier s'applique |
| Bloc d'une autre version déjà présent | pas d'injection de porte, seulement une note d'incohérence de version ; le bloc du fichier s'applique |
| Variable d'environnement `TAVERNWEAVE_FRONT_DOOR=off` | aucune injection |

- Les utilisateurs installés via le marketplace n'ont pas besoin d'écrire dans `CLAUDE.md` avec `manage-host-front-door.ps1`. Si vous l'avez déjà fait et préférez que la porte soit mise à jour avec le plugin, lancez `manage-host-front-door.ps1 -AgentHost Claude -Action Remove` (le script fait d'abord une sauvegarde).
- Les utilisateurs installés par ZIP ou copie de `skills/` n'ont pas ce hook et doivent toujours écrire dans `CLAUDE.md` comme indiqué plus haut.
- Le niveau de guidage (bloc `tavernweave-guidance-preference`) n'est pas concerné et reste enregistré séparément dans `CLAUDE.md`.

État de validation : la structure des hooks, de l'agent et de la bascule Soul, les règles de déduplication, les formats de sortie et la cohérence des instructions sont contrôlés hors ligne par [`tests/claude-plugin.test.mjs`](tests/claude-plugin.test.mjs) ; le comportement d'interface de la bascule Soul est contrôlé par [`hooks/soul-switch.test.tsx`](hooks/soul-switch.test.tsx) sur deux surfaces (terminal et Desktop). L'injection réelle dans une nouvelle session Claude Code, le démarrage avec `--agent` et l'invocation par sous-agent ne sont pas encore validés sur machine réelle (voir `claudePlugin.hostLoading` dans la liste d'installation).

## DeepSeek Harness

Depuis 2.1.0, DSH s'installe avec un paquet de plugins distinct : ne **copiez pas** `skills/` dans `.agents/skills`, et n'écrivez pas `AGENTS.md` :

1. Téléchargez `TavernWeave-DSH-v2.4.0.tgz` depuis la [page de publication v2.4.0](https://github.com/LiarMTTT/TavernWeave/releases/tag/v2.4.0), ou régénérez le paquet local avec `node scripts/build-dsh-plugin.mjs` depuis l'arbre source ;
2. Sur le Desktop DSH : barre latérale **插件 → 添加插件 → 安装第三方插件 → 本地路径/tarball**, puis activez le bundle après installation ;
3. Créez une nouvelle tâche et choisissez le preset **TavernWeave X DSH**.

Les profils CLI/Web utilisent `dsh plugin --profile <profile> add <chemin local|tarball|adresse git|nom de paquet>` ; le profil `desktop` est géré par le shell Desktop, ne l'invoquez pas directement en CLI.

Le paquet contient directement les 23 Skills et le Host Front Door (injecté comme section system prompt) ; installation, mise à jour et désinstallation passent par le mécanisme de plugins DSH. Composition détaillée, contrat machine et portes d'exécution : [host-adapters/dsh/README.md](host-adapters/dsh/README.md). DSH est encore en Developer Preview. La 2.1.0 a été validée sur machine réelle avec DSH Desktop `0.2.1-rc.2` : page des plugins, choix du preset, répertoire des 23 Skills, Front Door, Soul et terminal en autorisation complète. L'effet du modèle, Linux/WSL et la taverne réelle restent des points de validation distincts. Les espaces de travail avec point de réanalyse OneDrive doivent passer en autorisation complète ou utiliser un répertoire ordinaire sous workspace-write (voir `knownEnvironmentIssues` dans le contrat).
