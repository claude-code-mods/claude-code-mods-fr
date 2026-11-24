# Les meilleurs mods Claude Code

[English](https://github.com/claude-code-mods/best-claude-code-mods) · [简体中文](https://github.com/claude-code-mods/claude-code-mods-zh) · [繁體中文](https://github.com/claude-code-mods/claude-code-mods-zh-tw) · [日本語](https://github.com/claude-code-mods/claude-code-mods-ja) · [한국어](https://github.com/claude-code-mods/claude-code-mods-ko) · [Español](https://github.com/claude-code-mods/claude-code-mods-es) · **Français** · [Deutsch](https://github.com/claude-code-mods/claude-code-mods-de) · [Português (Brasil)](https://github.com/claude-code-mods/claude-code-mods-pt-br) · [Русский](https://github.com/claude-code-mods/claude-code-mods-ru)

**Choisis à la main, validés, épinglés. Un seul ajout, 40 mods.**

Les mods sont des plugins Claude Code faits de hooks de fonctions : ils observent, modifient ou prennent en charge ce que fait Claude Code, et dessinent leur propre interface. Ce marketplace rassemble les meilleurs mods de la communauté. Chacun est vérifié avec `claude plugin validate` et épinglé au commit vérifié : les modifications ultérieures de son auteur ne vous parviennent jamais sans relecture.

Nécessite Claude Code 2.1.287 ou plus récent.

> **Les 40 mods sont entièrement localisés en français.** Chaque libellé, commande, panneau, invite et README a été traduit ; les sources des plugins sont incluses dans ce dépôt, donc l'interface est déjà en français après l'installation, sans configuration supplémentaire. Seuls les identifiants de code, les noms d'événements de hook, les skills et les instructions destinées au modèle restent en anglais, afin que le comportement ne change pas.

## Installation

Dans une session Claude Code au terminal :

```
/plugin marketplace add claude-code-mods/claude-code-mods-fr
/plugin install <mod>@claude-code-mods-fr
```

Par exemple `/plugin install terminal-browser@claude-code-mods-fr`. Lancez `/plugin marketplace update claude-code-mods-fr` pour recevoir les nouveaux mods et les mises à jour.

## Catalogue

Le champ **Accès** de chaque carte indique ce que, selon le validateur, le code du mod peut faire en plus de dessiner son interface. Lisez le code d'un mod avant de l'installer : la validation le lit sans l'exécuter et ne constitue pas un audit de sécurité.

### Tableaux de bord et utilisation

[![token-optimizer](https://raw.githubusercontent.com/alexgreensh/token-optimizer/main/docs-site/public/media/token-optimizer-desktop-status-bar.gif)](https://github.com/alexgreensh/token-optimizer/tree/e3f1a2dcad8d8999096b8a881c4d98cdba4ef1a5/desktop/token-optimizer-desktop)

#### [`token-optimizer`](https://github.com/alexgreensh/token-optimizer/tree/e3f1a2dcad8d8999096b8a881c4d98cdba4ef1a5/desktop/token-optimizer-desktop)

*par alexgreensh* · Une barre d'état qui montre où vont les tokens et comment en dépenser moins.

**Accès:** exécute des commandes, appels au modèle, fichiers

`/plugin install token-optimizer@claude-code-mods-fr`

---

[![council](https://github.com/hex/claude-council/raw/main/assets/desktop-code-tab.png)](https://github.com/hex/claude-council/tree/f2f7f42122b288599cef8cea97dcc490acea98a5)

#### [`council`](https://github.com/hex/claude-council/tree/f2f7f42122b288599cef8cea97dcc490acea98a5)

*par hex* · Consultez plusieurs agents IA à la fois pour des perspectives variées, avec un panneau en flux continu et une vérification latérale facultative.

**Accès:** exécute des commandes, appels au modèle, fichiers

`/plugin install council@claude-code-mods-fr`

---

[![codex-attachment-manager](https://github.com/chipfighter/context-attachment-manager/raw/main/docs/images/hero.gif)](https://github.com/chipfighter/context-attachment-manager/tree/d68a721b7432059c9056d546ff2a26b11b3c0e0c)

#### [`codex-attachment-manager`](https://github.com/chipfighter/context-attachment-manager/tree/d68a721b7432059c9056d546ff2a26b11b3c0e0c)

*par chipfighter* · Envoie les images précédentes sous forme de courtes alternatives et récupère les originaux par identifiant, pour préserver le cache de prompt lors des longues sessions d'images.

**Accès:** réseau, MCP

`/plugin install codex-attachment-manager@claude-code-mods-fr`

---

[![cache-tax](https://github.com/karanb192/cache-tax/raw/main/site/assets/refusal.gif)](https://github.com/karanb192/cache-tax/tree/535ff33225e666e605e731d78f5ac5efe243c7c3)

#### [`cache-tax`](https://github.com/karanb192/cache-tax/tree/535ff33225e666e605e731d78f5ac5efe243c7c3)

*par karanb192* · Maintient le cache de prompt d'une heure au chaud pendant les pauses, demande avant un envoi à froid et affiche le coût de réécriture.

**Accès:** appels au modèle

`/plugin install cache-tax@claude-code-mods-fr`

---

[![agent-standup-band](https://atoll92.github.io/agent-standup/media/banner.png)](https://github.com/Atoll92/agent-standup/tree/846d5324f7c00f06d598c86e87ed8b51d774b3ac/plugin-band)

#### [`agent-standup-band`](https://github.com/Atoll92/agent-standup/tree/846d5324f7c00f06d598c86e87ed8b51d774b3ac/plugin-band)

*par Atoll92* · Une ligne au-dessus du champ de saisie lorsqu'une autre session locale a besoin de vous, et une notification lorsqu'elle se termine.

**Accès:** exécute des commandes, fichiers

`/plugin install agent-standup-band@claude-code-mods-fr`

---

[![shunt](docs/assets/shunt.png)](https://github.com/pleaseai/shunt/tree/57182b328e92d3c70bc9ca5a1fd1ee9104cfbabb/plugins/shunt)

#### [`shunt`](https://github.com/pleaseai/shunt/tree/57182b328e92d3c70bc9ca5a1fd1ee9104cfbabb/plugins/shunt)

*par pleaseai* · Une bande d'utilisation pour la passerelle shunt : dépenses et heure de réinitialisation de chaque fenêtre, avec un détail complet via /shunt:usage.

**Accès:** réseau, exécute des commandes

`/plugin install shunt@claude-code-mods-fr`

---

[![tokendoctor](https://github.com/localixai/tokendoctor/raw/main/docs/demo.gif)](https://github.com/localixai/tokendoctor/tree/051fa9598f0a50ed30974b618f2911381b7dcf90)

#### [`tokendoctor`](https://github.com/localixai/tokendoctor/tree/051fa9598f0a50ed30974b618f2911381b7dcf90)

*par localixai* · Rejoue vos sessions passées pour montrer ce que chaque modification aurait économisé, puis n'applique que celles que vous choisissez.

**Accès:** exécute des commandes, appels au modèle

`/plugin install tokendoctor@claude-code-mods-fr`

---

[![skins](https://github.com/hellosverre/claude-skins/raw/main/docs/demo.gif)](https://github.com/hellosverre/claude-skins/tree/cf0d39f3785d5c5a4b6189ecc487b1ac479efea0)

#### [`skins`](https://github.com/hellosverre/claude-skins/tree/cf0d39f3785d5c5a4b6189ecc487b1ac479efea0)

*par hellosverre* · Habillages et quinze thèmes pour la transcription, avec cartes riches et bande d'utilisation ; /skin les change à chaud.

**Accès:** réseau, exécute des commandes, appels au modèle, fichiers

`/plugin install skins@claude-code-mods-fr`

---

[![ctx-handoff](docs/assets/ctx-handoff-mod.png)](https://github.com/cablate/ctx-handoff-mod/tree/a416713a0495be799a31f3650e18458e242270c7)

#### [`ctx-handoff`](https://github.com/cablate/ctx-handoff-mod/tree/a416713a0495be799a31f3650e18458e242270c7)

*par cablate* · Transforme ce que vous apprenez à Claude en notes de projet, repère les erreurs courantes, maintient le cache au chaud et reprend les longues sessions.

**Accès:** appels au modèle, fichiers

`/plugin install ctx-handoff@claude-code-mods-fr`

---

[![ripple](https://github.com/PBJ-2/clauderipple/raw/main/docs/media/demo.webp)](https://github.com/PBJ-2/clauderipple/tree/c1c6b76a9e4e7a51df2ec5907d6e41d6bf8591e3/packages/mod)

#### [`ripple`](https://github.com/PBJ-2/clauderipple/tree/c1c6b76a9e4e7a51df2ec5907d6e41d6bf8591e3/packages/mod)

*par PBJ-2* · Choix du niveau de raisonnement par prompt et d'un travailleur par tâche déléguée, maintien du cache au chaud et suivi de la destination de chaque requête.

**Accès:** réseau, exécute des commandes, appels au modèle, MCP, fichiers

`/plugin install ripple@claude-code-mods-fr`

---

[![tavernweave-agent-skills](https://github.com/LiarMTTT/TavernWeave/raw/main/docs/assets/tavernweave-v1-cover.png)](https://github.com/LiarMTTT/TavernWeave/tree/f9863d2b05305457fe9ed8b0c5688d52aca400a5)

#### [`tavernweave-agent-skills`](https://github.com/LiarMTTT/TavernWeave/tree/f9863d2b05305457fe9ed8b0c5688d52aca400a5)

*par LiarMTTT* · 23 skills partagés pour les rolecards, le travail logiciel et les tâches cloud bornées, avec un interrupteur Soul au-dessus du champ de saisie.

**Accès:** —

`/plugin install tavernweave-agent-skills@claude-code-mods-fr`

---

[![agent-usage-guard](https://github.com/rbartoli/agent-usage-guard/releases/download/agent-usage-guard--v1.0.0/agent-usage-guard.gif)](https://github.com/rbartoli/agent-usage-guard/tree/02594c2620be9eb60c32e2f77d9d512d9f61b205)

#### [`agent-usage-guard`](https://github.com/rbartoli/agent-usage-guard/tree/02594c2620be9eb60c32e2f77d9d512d9f61b205)

*par rbartoli* · Retient les fan-outs de sous-agents, les prompts à contexte lourd et les boucles de nouvelles tentatives avant qu'ils ne consomment votre fenêtre d'utilisation.

**Accès:** appels au modèle, fichiers

`/plugin install agent-usage-guard@claude-code-mods-fr`


### Agents et sous-agents

[![shared-session](https://github.com/Paradigm-Study/claude-share/raw/main/docs/assets/invitation-demo.png)](https://github.com/Paradigm-Study/claude-share/tree/9d88f996ac4245c756a89b34e98cfde375028950/plugin)

#### [`shared-session`](https://github.com/Paradigm-Study/claude-share/tree/9d88f996ac4245c756a89b34e98cfde375028950/plugin)

*par Paradigm-Study* · Partagez une session par lien ou avec votre équipe ; vos collègues rejoignent depuis leur propre Claude Code et suivent chaque tour en direct.

**Accès:** —

`/plugin install shared-session@claude-code-mods-fr`

---

[![flightdeck](https://github.com/scasella/claude-flightdeck/raw/main/docs/media/demo.gif)](https://github.com/scasella/claude-flightdeck/tree/626cc0b46d417f81bbff9f5ba3b49abaf8912a85)

#### [`flightdeck`](https://github.com/scasella/claude-flightdeck/tree/626cc0b46d417f81bbff9f5ba3b49abaf8912a85)

*par scasella* · Un tableau de bord d'agent en direct : constantes du modèle, architecte de garde, vérifications des permissions, cartes de sous-agents et journal de session.

**Accès:** —

`/plugin install flightdeck@claude-code-mods-fr`

---

[![start](https://github.com/rsmdt/the-startup/raw/main/logo.png)](https://github.com/rsmdt/the-startup/tree/e803d51fdb423271d3dde189f5416f3ec51386a9/plugins/start)

#### [`start`](https://github.com/rsmdt/the-startup/tree/e803d51fdb423271d3dde189f5416f3ec51386a9/plugins/start)

*par rsmdt* · Commandes d'orchestration de flux de travail pour le développement logiciel agentique.

**Accès:** fichiers

`/plugin install start@claude-code-mods-fr`

---

[![lane-stack](docs/assets/claude-lane-stack.png)](https://github.com/VKirill/claude-lane-stack/tree/8bac2b876b72053aa445bb9d1c7c6079bfc4ba8c/plugins/lane-stack)

#### [`lane-stack`](https://github.com/VKirill/claude-lane-stack/tree/8bac2b876b72053aa445bb9d1c7c6079bfc4ba8c/plugins/lane-stack)

*par VKirill* · Un convoyeur de chef de projet en solo : agents orchestrateurs, règles de voie, commandes d'accueil et de reprise.

**Accès:** réseau, appels au modèle

`/plugin install lane-stack@claude-code-mods-fr`


### Productivité et contexte

[![pebrel-prompt-suggestions](https://github.com/Kuddev/pebrel/raw/main/docs/screenshots/nebula-claude-session.png)](https://github.com/Kuddev/pebrel/tree/ed9b2331340877ba3d775e38c4df6bd1a2abb1fe/pebrel_app/res/prompt-suggestions/claude)

#### [`pebrel-prompt-suggestions`](https://github.com/Kuddev/pebrel/tree/ed9b2331340877ba3d775e38c4df6bd1a2abb1fe/pebrel_app/res/prompt-suggestions/claude)

*par Kuddev* · Prédictions natives de prompt dans le champ vide, via le pont de session Pebrel.

**Accès:** réseau

`/plugin install pebrel-prompt-suggestions@claude-code-mods-fr`

---

[![fast-jev-compaction](docs/assets/fast-jev-compaction.png)](https://github.com/tamaratran/fast-jev-compaction/tree/e3f262a7f4d42bd8dd32ced30d26176f7cb545b0)

#### [`fast-jev-compaction`](https://github.com/tamaratran/fast-jev-compaction/tree/e3f262a7f4d42bd8dd32ced30d26176f7cb545b0)

*par tamaratran* · Compaction mot pour mot guidée par Jev pour les sessions Claude Code.

**Accès:** réseau, appels au modèle

`/plugin install fast-jev-compaction@claude-code-mods-fr`

---

[![lot-map](https://github.com/alexeyw/lot-map/raw/main/docs/demo.gif)](https://github.com/alexeyw/lot-map/tree/ad60f057902765d778eedde770d337be45fac3af)

#### [`lot-map`](https://github.com/alexeyw/lot-map/tree/ad60f057902765d778eedde770d337be45fac3af)

*par alexeyw* · Une carte en direct à côté du chat : mémoire, fichiers, shell, web, modèle, agents, skills et hooks s'illuminent lorsqu'ils sont utilisés.

**Accès:** —

`/plugin install lot-map@claude-code-mods-fr`

---

[![storybloq](https://raw.githubusercontent.com/Storybloq/storybloq/main/assets/board.png)](https://github.com/Storybloq/storybloq/tree/f0b4c08e3a15ffb9841e5a3058c6b1ca57607154/plugins/storybloq)

#### [`storybloq`](https://github.com/Storybloq/storybloq/tree/f0b4c08e3a15ffb9841e5a3058c6b1ca57607154/plugins/storybloq)

*par Storybloq* · Mémoire de projet : tickets, issues, passations et leçons conservés dans un dossier .story/ de votre dépôt.

**Accès:** fichiers

`/plugin install storybloq@claude-code-mods-fr`

---

[![just-do-it](docs/assets/claude-ops.png)](https://github.com/Lifecycle-Innovations-Limited/claude-ops/tree/e434ef7e612f2ff5769def6101fc9d984888d377/claude-ops/skills/ops-jdi/plugin)

#### [`just-do-it`](https://github.com/Lifecycle-Innovations-Limited/claude-ops/tree/e434ef7e612f2ff5769def6101fc9d984888d377/claude-ops/skills/ops-jdi/plugin)

*par Lifecycle-Innovations-Limited* · Poursuit le travail autorisé jusqu'à la vérification et la livraison, et signale les problèmes de configuration à corriger.

**Accès:** exécute des commandes, appels au modèle

`/plugin install just-do-it@claude-code-mods-fr`

---

[![filetree](https://github.com/data-goblin/claude-code-filetree/raw/main/media/filetree-shimmer.gif)](https://github.com/data-goblin/claude-code-filetree/tree/1fdc3a963f2dc22a939f661ff0ff5a76646c9112)

#### [`filetree`](https://github.com/data-goblin/claude-code-filetree/tree/1fdc3a963f2dc22a939f661ff0ff5a76646c9112)

*par data-goblin* · Un arborescence de fichiers façon IDE qui montre ce que fait Claude et où il se trouve dans vos fichiers.

**Accès:** exécute des commandes, appels au modèle, fichiers

`/plugin install filetree@claude-code-mods-fr`

---

[![jev-auto-compact](https://github.com/notque/vexjoy-agent/raw/main/docs/repo-hero.png)](https://github.com/notque/vexjoy-agent/tree/c68ac1fea2a03e437ccc95112d1e56e467a9bd00/plugins/jev-auto-compact)

#### [`jev-auto-compact`](https://github.com/notque/vexjoy-agent/tree/c68ac1fea2a03e437ccc95112d1e56e467a9bd00/plugins/jev-auto-compact)

*par notque* · À 60 % du contexte, élagage des appels d'outils obsolètes sans génération ; évite le repli vers un résumé LLM.

**Accès:** réseau, appels au modèle

`/plugin install jev-auto-compact@claude-code-mods-fr`

---

[![caliber-jev-compaction](https://github.com/caliber-ai-org/ai-setup/raw/master/assets/readme/pillars.png)](https://github.com/caliber-ai-org/ai-setup/tree/f5dbc002022a8a10acad25c1cce23ddefdc19d0d/plugin/caliber-jev-compaction)

#### [`caliber-jev-compaction`](https://github.com/caliber-ai-org/ai-setup/tree/f5dbc002022a8a10acad25c1cce23ddefdc19d0d/plugin/caliber-jev-compaction)

*par caliber-ai-org* · Compaction mot pour mot guidée par Jev pour les sessions Claude Code.

**Accès:** réseau, appels au modèle

`/plugin install caliber-jev-compaction@claude-code-mods-fr`

---

[![operator](https://github.com/aerovato/operator-memory/raw/main/docs/assets/change-the-loop.png)](https://github.com/aerovato/operator-memory/tree/93c3fce64f0a72adeb89fa868600eb418548ec07/packages/claude-code)

#### [`operator`](https://github.com/aerovato/operator-memory/tree/93c3fce64f0a72adeb89fa868600eb418548ec07/packages/claude-code)

*par aerovato* · Mémoire durable du projet et de l'utilisateur pour un développement piloté par des agents.

**Accès:** —

`/plugin install operator@claude-code-mods-fr`

---

[![carbon](https://github.com/gwittebolle/claude-carbon/raw/main/docs/desktop-pane.png)](https://github.com/gwittebolle/claude-carbon/tree/9ad53f1dd07fb0e11fcdb94d294ed794d660cf4b)

#### [`carbon`](https://github.com/gwittebolle/claude-carbon/tree/9ad53f1dd07fb0e11fcdb94d294ed794d660cf4b)

*par gwittebolle* · Suivez l'empreinte carbone de vos sessions Claude Code dans le terminal et l'application de bureau.

**Accès:** fichiers

`/plugin install carbon@claude-code-mods-fr`

---

[![work-mode](https://github.com/danyuchn/claude-work-mode/raw/main/promo/demo-poster-en.png)](https://github.com/danyuchn/claude-work-mode/tree/e19eda1e8465308bd79a74fad295cf9b6d9cdf71/plugins/work-mode)

#### [`work-mode`](https://github.com/danyuchn/claude-work-mode/tree/e19eda1e8465308bd79a74fad295cf9b6d9cdf71/plugins/work-mode)

*par danyuchn* · Modes de session : auto (sans questions en cours de tâche), out (délégation de travaux par lots) et wrap (converger et terminer).

**Accès:** exécute des commandes, fichiers

`/plugin install work-mode@claude-code-mods-fr`

---

[![show-your-work](https://github.com/iamumeransari/claude-show-your-work/raw/main/docs/homepage.jpg)](https://github.com/iamumeransari/claude-show-your-work/tree/71e546044e3ba61b98a6938a03270da791f9ca2e)

#### [`show-your-work`](https://github.com/iamumeransari/claude-show-your-work/tree/71e546044e3ba61b98a6938a03270da791f9ca2e)

*par iamumeransari* · Présente le travail terminé dans le terminal : captures d'écran, vidéos de navigation et comparaisons avant/après synchronisées.

**Accès:** réseau, exécute des commandes, appels au modèle, fichiers

`/plugin install show-your-work@claude-code-mods-fr`

---

[![inbox](docs/assets/inbox.png)](https://github.com/petekp/inbox/tree/02e441cd447edf86fc30fbd03e9117a8ead9da7a)

#### [`inbox`](https://github.com/petekp/inbox/tree/02e441cd447edf86fc30fbd03e9117a8ead9da7a)

*par petekp* · Rassemble les questions, tâches, découvertes et PR qui vous attendent dans une session.

**Accès:** —

`/plugin install inbox@claude-code-mods-fr`

---

[![compact-adviser](https://github.com/kunchenguid/compact-adviser/raw/main/docs/hint-status-line.png)](https://github.com/kunchenguid/compact-adviser/tree/37fa1a665b8933de68c90014312060e862cf121a/packages/claude-mod)

#### [`compact-adviser`](https://github.com/kunchenguid/compact-adviser/tree/37fa1a665b8933de68c90014312060e862cf121a/packages/claude-mod)

*par kunchenguid* · Suggère ou lance /compact à un point d'arrêt achevé, selon le jugement de TypeSafe Jev.

**Accès:** réseau, appels au modèle, fichiers

`/plugin install compact-adviser@claude-code-mods-fr`


### Rendu et aperçus

[![terminal-browser](docs/assets/terminal-browser.webp)](https://github.com/zenbu-labs/terminal-browser/tree/fa9e5eb053d2a1da11f7ccba720a0d3d389c05a6/claude-code-plugin)

#### [`terminal-browser`](https://github.com/zenbu-labs/terminal-browser/tree/fa9e5eb053d2a1da11f7ccba720a0d3d389c05a6/claude-code-plugin)

*par zenbu-labs* · Un navigateur dans Claude Code : prévisualisez sites et HTML et laissez l'agent piloter le navigateur intégré.

**Accès:** réseau, exécute des commandes, appels au modèle, fichiers

`/plugin install terminal-browser@claude-code-mods-fr`

---

[![prismantis](https://github.com/NahumLitvin/prismantis/raw/main/docs/tour.gif)](https://github.com/NahumLitvin/prismantis/tree/3718a40abc57b836108a65bd9f01d06d3237e52d/plugin)

#### [`prismantis`](https://github.com/NahumLitvin/prismantis/tree/3718a40abc57b836108a65bd9f01d06d3237e52d/plugin)

*par NahumLitvin* · Rendu coloré et personnalisable des réponses : tableaux, titres, code, nombres, chemins et liens.

**Accès:** exécute des commandes, fichiers

`/plugin install prismantis@claude-code-mods-fr`


### Sécurité et garde-fous

[![lcu-approve](https://github.com/amontlabs/lcu/raw/main/docs/assets/approval-demo.gif)](https://github.com/amontlabs/lcu/tree/1bd45b304295c7665b559fcc32f7b3a8f1b1d859/adapters/claude-mod/lcu-approve)

#### [`lcu-approve`](https://github.com/amontlabs/lcu/tree/1bd45b304295c7665b559fcc32f7b3a8f1b1d859/adapters/claude-mod/lcu-approve)

*par amontlabs* · Validation par application pour le contrôle de l'ordinateur : autoriser cette conversation, toujours autoriser ou refuser, avec un panneau des applications approuvées.

**Accès:** exécute des commandes, MCP, fichiers

`/plugin install lcu-approve@claude-code-mods-fr`

---

[![agentctl](https://raw.githubusercontent.com/sd0xdev/sd0x-harness/main/banner.jpg)](https://github.com/sd0xdev/sd0x-harness/tree/b0206637edd2e44c993da12b6b30858f96bc3cdc/mods/agentctl)

#### [`agentctl`](https://github.com/sd0xdev/sd0x-harness/tree/b0206637edd2e44c993da12b6b30858f96bc3cdc/mods/agentctl)

*par sd0xdev* · Un plan de contrôle d'agent pour une session : périmètre des tâches, preuves et passation.

**Accès:** exécute des commandes, appels au modèle, fichiers

`/plugin install agentctl@claude-code-mods-fr`

---

[![multi-core](docs/assets/cc-multi-cli-plugin.png)](https://github.com/greenpolo/cc-multi-cli-plugin/tree/66d9b0a6b06b25fd648ecd53311a647bb57e2fb4/plugins/multi-core)

#### [`multi-core`](https://github.com/greenpolo/cc-multi-cli-plugin/tree/66d9b0a6b06b25fd648ecd53311a647bb57e2fb4/plugins/multi-core)

*par greenpolo* · Utilisez les modèles ChatGPT, Cursor, OpenCode et Antigravity dans une même session, avec bascule via /model.

**Accès:** réseau, appels au modèle

`/plugin install multi-core@claude-code-mods-fr`

---

[![jevmem-pane](docs/assets/jevmem.png)](https://github.com/Avinash-jetwani/jevmem/tree/c29753ccb2c9706e417fda25efa422682358955b/pane)

#### [`jevmem-pane`](https://github.com/Avinash-jetwani/jevmem/tree/c29753ccb2c9706e417fda25efa422682358955b/pane)

*par Avinash-jetwani* · Un panneau latéral montrant ce que jevmem a rappelé, ce que son garde-fou a décidé et ce que le dernier tour a enregistré.

**Accès:** exécute des commandes, fichiers

`/plugin install jevmem-pane@claude-code-mods-fr`


### Git, PR et déploiements

[![fm](https://github.com/kunchenguid/firstmate/raw/main/assets/banner.png)](https://github.com/kunchenguid/firstmate/tree/427056c4181c41074ad24f051f79919330df0fa5/.claude/mods/firstmate-calm)

#### [`fm`](https://github.com/kunchenguid/firstmate/tree/427056c4181c41074ad24f051f79919330df0fa5/.claude/mods/firstmate-calm)

*par kunchenguid* · Animation du voilier au travail et transcription réservée à la conversation, avec une préférence de mode calme partagée entre les sessions.

**Accès:** fichiers

`/plugin install fm@claude-code-mods-fr`

---

[![turbo](https://github.com/tobihagemann/turbo/raw/main/assets/logo/thunderbolt-icon-256.png)](https://github.com/tobihagemann/turbo/tree/3bc6b4436d96be22497109e16e68fe4dfa323531/claude)

#### [`turbo`](https://github.com/tobihagemann/turbo/tree/3bc6b4436d96be22497109e16e68fe4dfa323531/claude)

*par tobihagemann* · Une usine logicielle agentique sous contrôle humain : vous décidez quoi construire et jugez le résultat, les skills construisent et livrent.

**Accès:** appels au modèle, fichiers

`/plugin install turbo@claude-code-mods-fr`

---

[![mazyos](docs/assets/MazyOS.png)](https://github.com/Mazzeo-Marketing/MazyOS/tree/d2b65b392f1ee230afb088d155fc734def5f105d)

#### [`mazyos`](https://github.com/Mazzeo-Marketing/MazyOS/tree/d2b65b392f1ee230afb088d155fc734def5f105d)

*par Mazzeo-Marketing* · Un plugin de gestion d'entreprise en portugais : la mémoire de votre société dans chaque session, l'identité visuelle sur les productions et 17 skills marketing/SEO.

**Accès:** fichiers

`/plugin install mazyos@claude-code-mods-fr`

---

[![engineer](docs/assets/engineer.png)](https://github.com/swingerman/engineer/tree/ae4cb5fe32007dd6a3d717c9998dcfb12b1f348e/engineer)

#### [`engineer`](https://github.com/swingerman/engineer/tree/ae4cb5fe32007dd6a3d717c9998dcfb12b1f348e/engineer)

*par swingerman* · Une méthodologie disciplinée d'ingénierie agentique : cadrage, découverte des critères d'acceptation, spécification, planification, implémentation, vérification et durcissement.

**Accès:** exécute des commandes, appels au modèle

`/plugin install engineer@claude-code-mods-fr`

## Proposer un mod

Ouvrez une issue avec le lien vers le dépôt du mod. Pour l'ajouter vous-même, ajoutez une entrée dans `community.json` (dépôt, dossier, commit relu, catégorie, licence), écrivez ses résumés d'une ligne dans `readme/summaries.json`, lancez `python3 scripts/build-catalog.py` et ouvrez une pull request.

## Remerciements et localisation

Chaque mod appartient à son auteur original et conserve sa propre licence. Au-delà de cette collecte, ce dépôt fournit une **localisation française** : les plugins sont regroupés sous `mods/`, leurs libellés, descriptions de commandes, panneaux et invites sont traduits, et la documentation de chaque mod est également traduite (l'original est conservé sous `README.en.md`). L'auteur original et la licence sont crédités à la fin de chaque document. Si vous souhaitez retirer une copie localisée ou modifier son attribution, veuillez ouvrir une issue.

Projet non officiel ; ce n'est pas un produit Anthropic.
