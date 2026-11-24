<p align="center">
  <img src="docs/homepage.jpg" alt="Un enregistrement de la page d'accueil de Tern joué dans Claude Code, avec la liste des changements à côté" width="100%">
</p>

<h1 align="center">claude-show-your-work</h1>

<p align="center">Voyez, examinez et itérez sur le travail de votre agent sans quitter le terminal.<br>Images, vidéos et contrôle visuel pour Claude Code.</p>

<p align="center">
  <a href="https://github.com/iamumeransari/claude-show-your-work/stargazers"><img src="https://img.shields.io/github/stars/iamumeransari/claude-show-your-work?style=flat&logo=github&label=Stars&color=E3B341" alt="Étoiles GitHub"></a>
  <a href="#install"><img src="https://img.shields.io/badge/Claude_Code-plugin-D97757?logo=claude&logoColor=white" alt="Plugin Claude Code"></a>
  <a href="#install"><img src="https://img.shields.io/badge/macOS_%7C_Linux-555555" alt="macOS et Linux"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/iamumeransari/claude-show-your-work?color=22C55E" alt="Licence MIT"></a>
</p>

## Installer

Exécutez ces deux commandes dans Claude Code :

```
/plugin marketplace add https://github.com/iamumeransari/claude-show-your-work.git#releases
/plugin install show-your-work@iamumeransari
```

Il prend en charge Ghostty et kitty, sur macOS et Linux, avec Claude Code 2.1.286 ou version ultérieure. Les vidéos et l'audio nécessitent aussi ffmpeg : installez-le avec votre gestionnaire de paquets (`brew install ffmpeg` sur macOS), ou demandez à Claude de l'installer. Les pages HTML nécessitent Chrome, Chromium ou le navigateur de Playwright, et les PDF nécessitent poppler (`brew install poppler`).

Lorsque l'installation se termine, une courte présentation vous fait visiter les fonctionnalités. Exécutez `/show-your-work` à tout moment pour modifier vos réglages.

## Utilisation

Claude montre son travail dans le chat dès qu'il construit ou modifie quelque chose de visuel. Vous pouvez aussi le demander directement :

- « Donne-moi quatre pistes pour le hero de la page d'accueil et montre-les côte à côte. »
- « Construis le formulaire d'inscription, teste-le et montre-moi l'enregistrement. »
- « Corrige le bouton de facturation et montre-moi avant et après. »

### Contrôle visuel avec enregistrements avant/après

<p align="center"><img src="docs/qa-product.jpg" alt="Un enregistrement d'un formulaire de nouveau trajet en cours de test, avec les changements et les vérifications à côté" width="100%"></p>

Lorsque Claude construit une fonctionnalité ou corrige un bug, il teste la modification avec Playwright, enregistre l'exécution et joue l'enregistrement dans le chat, avec tout ce qu'il faut pour examiner le travail au même endroit :

- **Avant et après :** pour toute modification, d'une nouvelle fonctionnalité à une correction de bug, Claude enregistre les mêmes étapes sur l'ancienne et la nouvelle version. Compare joue ensuite les deux en parallèle, de façon synchrone.
- **Marqueurs de changement :** chaque modification faite par Claude est listée à côté de la vidéo avec son horodatage, et un clic amène directement à l'instant où elle apparaît.
- **Vérifications en direct :** chaque contrôle de test passe au vert ou au rouge lorsque la vidéo l'atteint, pour voir exactement où la correction fonctionne et où quelque chose échoue encore.
- **Un seul endroit pour examiner :** pas besoin d'ouvrir un navigateur, de relancer les tests ou de parcourir des journaux, car l'enregistrement et ses résultats sont là, dans le chat.

### Images

<p align="center">
  <img src="docs/concepts.jpg" alt="Quatre concepts de page d'atterrissage pour Tern affichés dans le chat" width="49%">
  <img src="docs/breakpoints.jpg" alt="La page d'accueil de Tern en tailles ordinateur, tablette et téléphone affichée dans le chat" width="49%">
</p>

Tout ce que Claude conçoit apparaît directement dans le chat : pages d'atterrissage, écrans d'application, composants, concepts de design, diapositives, graphiques et images générées. Demandez plusieurs pistes et elles apparaissent côte à côte, puis continuez à itérer sur celle qui vous plaît.

- **Comparer les pistes :** plusieurs concepts s'affichent ensemble, pour choisir d'un coup d'œil plutôt que d'ouvrir les fichiers les uns après les autres.
- **Chaque version conservée :** chaque nouvelle version arrive dans le même lecteur, et l'historique permet de revenir à tous les brouillons précédents.
- **Avant et après :** basculez entre l'ancien et le nouveau design, ou placez-les côte à côte, pour voir exactement ce qui a changé.

### Vidéo

<p align="center">
  <img src="docs/persona.jpg" alt="Un personnage publicitaire dans le chat" width="49%">
  <img src="docs/reel.jpg" alt="La publicité réalisée à partir de ce personnage, jouée dans le chat" width="49%">
</p>

Au-delà du contrôle produit, Claude peut vous montrer une vidéo de presque tout ce sur quoi il travaille. Vous construisez un site et voulez voir ce que donne un défilement de haut en bas ? Demandez-le, et l'enregistrement se joue dans le chat, animations comprises.

Vous créez une publicité, une animation ou une vidéo de lancement ? Chaque montage se joue directement dans le chat, dans un lecteur vidéo complet :

- **Contrôles vidéo :** lecture, pause, déplacement sur la chronologie, et saut en avant ou en arrière jusqu'à l'instant voulu. Une vidéo avec du son se joue avec son son ; Mute coupe le son pour la session.
- **Horodatages :** la barre latérale vous guide étape par étape dans la vidéo. Chaque étape est horodatée, donc un clic vous mène directement à ce moment.
- **Comparer les versions :** lorsque Claude crée une nouvelle version d'une vidéo, elle s'ouvre dans le même lecteur. Vous pouvez passer d'un brouillon à l'autre dans l'historique, ou jouer l'ancienne et la nouvelle version côte à côte, de façon synchrone.
- **Fonctions rapides :** ouvrez la vidéo dans QuickTime Player pour la voir en grand, ou enregistrez-la directement dans votre dossier Téléchargements en un clic.

## Terminaux

show-your-work prend en charge Ghostty et kitty, sur macOS et Linux. Les images y fonctionnent immédiatement.

- **Rex et l'application Herdr :** les images et vidéos s'affichent, mais Claude Code ne les active là que s'il démarre avec `CLAUDE_CODE_FORCE_TERMINAL_IMAGES=1`. Le bouton Activer les images de l'avis ajoute une ligne à votre profil shell qui la définit uniquement dans ce terminal, et copie une commande pour rouvrir le chat.
- **Warp, WezTerm et Konsole :** ces terminaux prennent en charge le protocole graphique kitty, mais pas les espaces réservés Unicode avec lesquels Claude Code dessine les images, donc les images ne peuvent pas encore s'y afficher.
- **Autres terminaux basés sur Ghostty ou kitty :** Claude Code ne les reconnaît pas et laisse les images désactivées. Démarrez-le avec `CLAUDE_CODE_FORCE_TERMINAL_IMAGES=1` (l'avis copie une commande qui fait cela), ou ajoutez `export CLAUDE_CODE_FORCE_TERMINAL_IMAGES=1` à votre profil shell.
- **tmux :** fonctionne à l'intérieur de Ghostty ou kitty. Claude Code laisse les images désactivées dans tmux sauf s'il démarre avec `CLAUDE_CODE_FORCE_TERMINAL_IMAGES=1`, donc la première fois, le plugin active ce réglage pour les nouveaux volets tmux et l'avis copie une commande qui rouvre le chat avec lui. Le plugin active aussi `allow-passthrough` pour son propre volet et laisse passer les images. Rien n'est modifié dans votre configuration tmux.

Les versions 0.6.7 à 0.6.9 proposaient un bouton Activer les images dans Warp, WezTerm et Konsole, qui ajoutait une ligne à votre profil shell. Cela faisait dessiner les images sous forme de grille de cases, donc le plugin supprime désormais cette ligne de lui-même.

## FAQ

<details>
<summary><b>Claude Code peut-il afficher des images dans le terminal ?</b></summary>

Oui, Claude Code peut afficher des images dans le terminal avec le plugin show-your-work. Une fois installé, Claude montre captures d'écran, maquettes, graphiques et autres images directement dans le chat. Cela fonctionne dans Ghostty et kitty.

</details>

<details>
<summary><b>Claude Code peut-il jouer des vidéos dans le terminal ?</b></summary>

Oui, Claude Code peut jouer des vidéos dans le terminal avec le plugin show-your-work. Il joue enregistrements d'écran, animations, publicités et vidéos de lancement dans le chat Claude Code. Il est fourni avec un lecteur vidéo riche en fonctionnalités, avec déplacement sur la chronologie, commandes de saut, horodatages cliquables et comparaisons côte à côte.

</details>

<details>
<summary><b>Comment voir ce que Claude Code a construit sans ouvrir de navigateur ?</b></summary>

Vous pouvez voir ce que Claude Code a construit en installant le plugin show-your-work. Dès que Claude construit ou modifie quelque chose de visuel, il prend une capture d'écran ou l'enregistre et vous montre le résultat dans le chat. Pas besoin de passer à un navigateur et de trouver la page vous-même.

</details>

<details>
<summary><b>Claude Code peut-il tester mon application et me montrer un enregistrement ?</b></summary>

Oui, Claude Code peut tester votre application et vous montrer un enregistrement avec le plugin show-your-work. Claude teste avec Playwright les fonctionnalités qu'il construit, enregistre chaque exécution et joue l'enregistrement dans le chat. Les étapes sont listées à côté de la vidéo avec des horodatages. Chaque contrôle passe au vert ou au rouge lorsque la vidéo l'atteint.

</details>

<details>
<summary><b>Claude Code peut-il me montrer un avant et après d'une modification ou d'une correction de bug ?</b></summary>

Oui, Claude Code peut vous montrer un avant et après d'une modification ou d'une correction de bug avec le plugin show-your-work. Claude enregistre les mêmes étapes Playwright sur l'ancienne et la nouvelle version. Compare joue les deux enregistrements côte à côte, de façon synchrone. Chaque contrôle passe au vert ou au rouge lorsque la vidéo l'atteint.

</details>

<details>
<summary><b>Existe-t-il un plugin Claude Code pour le contrôle visuel ?</b></summary>

Oui, show-your-work est un plugin Claude Code de contrôle visuel. Il enregistre les exécutions de tests Playwright de Claude et les joue dans le chat. Chaque enregistrement comporte des marqueurs de changement cliquables et des contrôles qui passent au vert ou au rouge pendant la lecture. Pour une modification ou une correction, il joue l'avant et l'après côte à côte, de façon synchrone.

</details>

<details>
<summary><b>Comment vérifier que Claude Code a vraiment corrigé un bug ?</b></summary>

Le moyen le plus simple de vérifier que Claude Code a vraiment corrigé un bug est de lui faire enregistrer la correction avec show-your-work. Demandez à Claude de corriger le bug et de vous montrer avant et après. Les ancienne et nouvelle versions se jouent côte à côte, de façon synchrone, avec les contrôles désormais réussis marqués en vert.

</details>

<details>
<summary><b>En quoi show-your-work diffère-t-il du simple affichage d'images dans le terminal ?</b></summary>

show-your-work va au-delà de l'affichage d'images dans le terminal. Sa principale force est le contrôle visuel. Il joue des enregistrements Playwright avant/après synchronisés, liste les changements que vous pouvez cliquer pour y accéder, et fait passer chaque contrôle au vert ou au rouge pendant la lecture. Vous pouvez examiner une fonctionnalité ou une correction sans quitter Claude Code.

</details>

<details>
<summary><b>Afficher des images et des vidéos consomme-t-il des jetons ?</b></summary>

Non, show-your-work consomme à peine des jetons supplémentaires, car il a été conçu dès le départ pour être économe en jetons et en mémoire. Les images et vidéos sont dessinées directement dans votre terminal avec le protocole graphique kitty, sans consommer de jetons. Les vidéos sont aussi décodées et diffusées efficacement, donc très peu de mémoire est utilisée.

</details>

<details>
<summary><b>Dans quels terminaux cela fonctionne-t-il ?</b></summary>

Le plugin show-your-work prend en charge Ghostty et kitty, sur macOS et Linux.

</details>

<details>
<summary><b>Est-ce gratuit ?</b></summary>

Oui, show-your-work est gratuit et open source sous licence MIT.

</details>

<details>
<summary><b>Dois-je mettre le plugin à jour moi-même lorsque de nouvelles fonctionnalités et corrections sortent ?</b></summary>

Non, vous n'avez pas à le mettre à jour vous-même. Le plugin se met à jour tout seul, donc vous n'êtes jamais en retard. Vous pouvez choisir entre les versions Stable et Latest pendant la présentation, ou à tout moment avec `/show-your-work`.

</details>

<details>
<summary><b>Comment revoir la présentation ?</b></summary>

Vous pouvez revoir la présentation en exécutant `/show-your-work tour`. Elle couvre les enregistrements, l'avant et l'après, l'historique des versions et les réglages.

</details>

<details>
<summary><b>Cela prend-il beaucoup de place ?</b></summary>

Non, cela ne prend pas beaucoup de place. Il conserve les images et vidéos récentes pour que vous puissiez les parcourir, et supprime les plus anciennes lorsqu'elles atteignent environ 1 Go au total.

</details>

<details>
<summary><b>Collecte-t-il des données ?</b></summary>

Vous choisissez de partager ou non des données d'utilisation anonymes. Vous pouvez faire ce choix pendant la présentation, ou le modifier à tout moment avec `/show-your-work`. Il ne collecte jamais la moindre donnée sensible. Les détails figurent dans la [politique de confidentialité](PRIVACY.md).

</details>

<details>
<summary><b>Qu'est-ce qu'il exécute, conserve et rejoint sur mon ordinateur ?</b></summary>

Voici tout ce que le plugin fait sur votre ordinateur, pour que vous sachiez exactement ce que vous installez. Vos images et vidéos ne quittent jamais votre machine.

Pour préparer les images et vidéos, il utilise `ffmpeg` et `ffprobe` (découper une vidéo en images et lire sa durée) et, sur macOS, `sips` (convertir une image en PNG). Lorsque vous jouez une vidéo avec du son, `ffplay` (fourni avec ffmpeg) joue le son, et sur macOS `osascript` lit le temps que mettent vos haut-parleurs ou écouteurs à la jouer, afin que l'image attende le son. Lorsque vous appuyez sur View, Show in Finder ou Save to Downloads, il ouvre le fichier avec `open` sur macOS ou `xdg-open` sur Linux. Sur macOS, `mdfind` aide `/img` à trouver une image que vous avez collée. Pour afficher une page HTML ou un document Markdown ou Mermaid, il le rend dans un Chrome ou Chromium caché avec un profil jetable (jamais vos connexions) ; pour les PDF, il utilise `pdftoppm` et `pdfinfo` de poppler.

Quelques courts scripts s'exécutent avec `sh` et `perl`. Ils trouvent `ffmpeg` et votre dossier personnel, lisent la taille des cellules du terminal pour que les images s'y adaptent, nettoient le dossier temporaire du plugin, ouvrent une visionneuse sur Linux, et basculent entre les canaux Stable et Latest. Il utilise aussi `cp`, `mkdir`, `rm`, `cat` et `touch` pour ses propres fichiers temporaires, et `claude plugin` pour installer ses propres mises à jour depuis ce dépôt, au plus une fois par jour. Vous pouvez désactiver les mises à jour. Le programme de mise à jour sera désactivé après le déplacement du plugin vers le répertoire des plugins Claude Code, qui s'en charge alors.

Il conserve ces fichiers :

- Les images vidéo et les images converties vont dans un dossier temporaire (`$TMPDIR/claude-show-your-work-<votre identifiant>`), et tout ce qui a plus d'une semaine est nettoyé.
- Une copie de chaque fichier que Claude vous montre va dans `.show-your-work/` dans votre projet, pour que vous puissiez parcourir les versions.
- Save to Downloads place une copie dans `~/Downloads`.
- Si votre profil shell contient la ligne ajoutée par le bouton Activer les images d'une ancienne version (voir [Terminaux](#terminals)), il supprime cette seule ligne.
- Avec `SHOW_YOUR_WORK_DEBUG=1`, il écrit un `debug.log` dans le dossier temporaire.

Une fois par jour, il lit le dernier numéro de version du plugin depuis `raw.githubusercontent.com`.

Si les données d'utilisation sont configurées pour être partagées dans `/show-your-work`, il envoie des comptages d'utilisation anonymes à `us.i.posthog.com`. Ce sont des noms d'événements et des comptes, ainsi que les versions du plugin et de Claude Code, votre terminal, votre système d'exploitation et la présence de ffmpeg, sous un identifiant d'installation aléatoire. Ils ne contiennent jamais de noms de fichiers, de chemins, de prompts, quoi que vous tapiez ni votre adresse IP. La clé dans le code est la clé publique de PostHog, qui ne peut qu'envoyer des événements.

Dans Claude Code, il utilise ces hooks :

- `prompt.submit` envoie une courte ligne avec votre message, indiquant à Claude que ce terminal peut afficher des images (ou pourquoi il ne peut pas). Il l'envoie une fois par session, de nouveau après une compaction, et lorsque cela change.
- `prompt.submit` ferme les réglages lorsque vous envoyez un message et mémorise les noms des images que vous collez, pour que `/img` puisse les trouver. Votre message n'est pas modifié.
- `tool.call` gère les propres outils `show_image`, `show_video`, `show_html`, `show_audio` et `show_document` du plugin. Il ne touche jamais aux autres outils.
- `command.run` exécute `/img`, `/page`, `/audio`, `/doc` et `/show-your-work`. Juste après l'installation, il exécute une fois `/show-your-work tour` pour vous faire visiter.
- `ui.render` dessine le lecteur, les avis, les réglages et la présentation du plugin.
- `session.start` et `session.end` configurent le dossier temporaire et le terminal au début, et envoient les comptages d'utilisation en attente à la fin. Dans tmux, ils démarrent et arrêtent aussi le passage des images pour le volet du plugin (voir [Terminaux](#terminals)).

</details>

## Retour d'information

Pour signaler un bug ou proposer une modification, [ouvrez un ticket](https://github.com/iamumeransari/claude-show-your-work/issues).

## Pour les développeurs

<details>
<summary>Outils, réglages et développement local</summary>

Le plugin fournit cinq outils à Claude : `show_image`, `show_video`, `show_html` (un instantané de page HTML), `show_audio` (MP3 et WAV, avec une forme d'onde) et `show_document` (PDF, Markdown et Mermaid, page par page). Un appel simple ne nécessite qu'un chemin. Pour un avant et après, Claude passe aussi l'ancien fichier et les résultats des tests :

```jsonc
{
  "path": "qa/after.webm",          // l'exécution sur la version corrigée
  "compare": "qa/before.webm",      // les mêmes étapes sur l'ancienne version
  "title": "Pricing page",
  "url": "http://localhost:3000/pricing",
  "changes": [                      // ce qui a changé, et la seconde où cela apparaît
    { "title": "Annual toggle sets prices", "at": 3.2 },
    { "title": "Plan buttons line up", "at": 5.4 }
  ],
  "summary": [                      // les résultats des tests, trois lignes maximum
    { "label": "Billing: toggle works", "ok": true, "passed": 1, "total": 1 },
    { "label": "Layout: plans, buttons", "ok": true, "passed": 3, "total": 3 }
  ]
}
```

Les vidéos sont découpées en images jusqu'à 12 par seconde, à la largeur à laquelle la fenêtre les affiche (2400 px maximum), avec une limite de 3 600 images (cinq minutes au plein débit). Pour ouvrir un fichier vous-même, exécutez `/img path/to/file.png`.

Pour travailler sur le plugin, modifiez les modules dans `hooks/` (`register.tsx` est le point d'entrée) et exécutez `/reload-plugins` pour charger vos modifications. Avant d'envoyer une modification, exécutez `claude plugin validate .` et `claude plugin test .`.

</details>

## Statut

show-your-work est activement maintenu. C'est le premier plugin à apporter les images, les vidéos et le contrôle visuel automatisé avec enregistrements Playwright dans le terminal Claude Code. Sa vidéo de lancement a été vue plus de 275 000 fois. Il est depuis devenu le choix populaire des développeurs qui veulent voir ce que Claude construit sans quitter le terminal. Il figure dans certains des plus grands catalogues de plugins Claude Code et se classe actuellement parmi les plugins Claude Code les plus en tendance.

Si vous voulez que Claude Code vous montre captures d'écran, enregistrements d'écran ou comparaisons avant/après de son travail sans quitter le terminal, ce plugin a été fait exactement pour cela.

## Licence

[MIT](LICENSE). La photographie dans les exemples provient d'[Unsplash](https://unsplash.com), utilisée sous licence Unsplash. [Confidentialité](PRIVACY.md).

<p align="center"><a href="#install"><img src="docs/end-card.jpg" alt="show-your-work, avec les commandes d'installation" width="100%"></a></p>
