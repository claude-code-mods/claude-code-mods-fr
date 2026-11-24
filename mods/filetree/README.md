<h1 align="center">Arborescence de fichiers Claude Code</h1>

<p align="center">
  Une arborescence de fichiers de style IDE pour Claude Code qui montre ce que Claude fait et où dans les fichiers
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-%E2%89%A5_2.1.306-D97757?logo=claude&logoColor=fff" alt="Claude Code 2.1.306 or newer">
  <img src="https://img.shields.io/badge/version-0.8.5-blue" alt="Version">
  <img src="https://img.shields.io/badge/type-mod-6f42c1" alt="Claude Code mod">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

<details open>
<summary><b>CLI Claude Code</b></summary>

<p align="center">
  <img src="media/filetree-shimmer.gif" alt="filetree shimmering the file Claude is editing" width="900">
</p>

</details>

<details>
<summary><b>Claude Code dans l'application de bureau</b></summary>

<p align="center">
  <img src="media/0.8.2/desktop-light.png" alt="The file tree in the Desktop app in light mode, with the header buttons including the Clawd shimmer button, the branch row, search row and folders" width="600">
</p>

</details>

**Fonctionnalités clés :**

* Afficher/parcourir tous les fichiers d'un dossier (avec prise en charge du statut Git et des raccourcis nvim)
* Des animations montrent où Claude lit/travaille
* Raccourcis clavier :
   * Parcourir les dossiers avec `z` (type zoxide)
   * Rechercher avec `s` ou `i` (dans le dossier en surbrillance) ou `q` (dans le contenu des fichiers)
   * Comparer des fichiers avec `d` ou tous les fichiers modifiés d'un dossier
* Fonctionnalités orientées terminal : aperçus de fichiers, treemap de la taille des dossiers, et plus encore

---

## Installation

Le dépôt est lui-même son marketplace de plugin. Exécutez ceci dans le terminal :

```bash
claude plugin marketplace add data-goblin/claude-code-filetree
claude plugin install filetree@claude-code-filetree
```

Ou dans une session Claude Code :

```text
/plugin marketplace add data-goblin/claude-code-filetree
/plugin install filetree@claude-code-filetree
```

Sur Claude Code antérieur à 2.1.287, l'installation échoue avec `Unrecognized key: "options"` : lancez `claude update`, puis réessayez l'installation.

## Fonctionnalités

- Arborescence du répertoire courant ou d'un dossier épinglé, avec colonnes Git, taille, nombre de lignes et date ([tree](docs/tree.md))
- Tout replier, et tout déplier jusqu'à trois niveaux ([tree](docs/tree.md))
- Flèches pour les liens symboliques, un cerveau sur les fichiers d'instructions d'agent, et glyphes Nerd Font, simples ou textuels ([tree](docs/tree.md))
- Recherche par nom dans les dossiers non ouverts, sensible à la casse ou par expression régulière, limitée à un dossier ([search](docs/search.md))
- Recherche dans les fichiers avec `git grep` ou `grep -r`, et ouverture d'une correspondance à sa ligne ([search](docs/search.md))
- Saut vers n'importe quel dossier à la façon zoxide avec `z` ([search](docs/search.md))
- Statut Git par fichier et dossier, nombres de lignes sur les fichiers modifiés, et branche avec avance et retard ([git](docs/git.md))
- Les commandes Git et GitHub exécutées par Claude s'affichent comme ligne de statut ([git](docs/git.md))
- Les lectures, écritures et commits de Claude scintillent dans l'arborescence, et le repli automatique referme les dossiers ouverts ([activity](docs/activity.md))
- Le réglage Activity shimmer désactive le scintillement dans toutes les sessions ; le bouton Clawd dans l'en-tête de l'application de bureau l'inverse ([activity](docs/activity.md))
- Les références de fichiers avec numéro de ligne dans les réponses de Claude deviennent des liens vers cette ligne ([activity](docs/activity.md))
- Follow work déplace la session vers le dépôt sur lequel Claude travaille ([activity](docs/activity.md))
- Multi-sélection de style IDE ; les lignes ombrées sont transmises à Claude comme contexte : la ligne sélectionnée, ou jusqu'à 100 lignes marquées ([context](docs/context.md)) :
  - un clic sélectionne une ligne et efface les marques
  - avec des lignes marquées, j / k déplacent seulement le curseur, et `v` marque ou démarque la ligne sous le curseur
  - maj+clic marque la plage depuis le dernier clic ou déplacement j / k, dans l'ordre de l'arborescence
  - ctrl+clic marque ou démarque une ligne sans l'ouvrir ; alt+clic sur macOS
  - double-clic ou Entrée ouvre un fichier
  - le bouton d'effacement de sélection efface toutes les lignes marquées et sélectionnées
  - les lignes marquées affichent un fond de sélection ; `y`, `Y` et `u` copient les lignes ombrées
  - avec des lignes marquées, la ligne sous le curseur prend une teinte d'accent dans l'application de bureau et le marqueur de curseur d'accent dans le terminal
- Aperçu fractionné de code, Markdown, images, images vidéo, pages PDF et Word ([preview and treemap](docs/preview-treemap.md))
- Treemap d'un dossier par octets ou lignes, avec l'activité de Claude mise en évidence ([preview and treemap](docs/preview-treemap.md))
- Comparaison d'un fichier ou de tous les fichiers modifiés d'un dossier, dans le panneau ou votre outil de diff ([diff](docs/diff.md))
- Ouverture des fichiers dans leur application par défaut, d'un éditeur dans un panneau tmux ou herdr, ou de toute commande ([open](docs/open.md))
- Protection des fichiers et dossiers contre les modifications de Claude, et visualisation des fichiers écrits hors du dépôt ([guards](docs/guards.md))
- Pilotage au clavier : déplacements style vim, superposition des raccourcis, et alt+l / alt+h dans le terminal ([keys](docs/keys.md))
- Commandes `/filetree` et emplacement du panneau dans le terminal et l'application de bureau ([sidebar](docs/sidebar.md))

<img src="media/filetree-git.gif" alt="A committed file shimmers green and the footer shows the commit" width="800">

<img src="docs/media/preview-media.gif" alt="An image, a video, a PDF turned to page 2 and a Word document in the preview" width="800">

## Paramètres

Tous les paramètres sont dans `/config` sous filetree, chacun avec sa propre description à cet endroit.

```yaml
Claude activity:  reads and writes | writes | reads | none
Activity shimmer: on | off
Follow Claude:    on | off
Jump moves Claude: tree and Claude | tree
Right-click copies: relative | absolute
Follow work:      on | off
Open at start:    on | off
Focus on open:    on | off
Right column:     date | age | size | loc | files
Date format:      year-month-day | day-month | month-day
Clock:            24h | 12h
Long file:        500 | a line count | off
Remote branch:    off | on
Hints:            on | off
Search spacing:   on | off
Column headers:   on | off
Auto-collapse:    off | on
Shortcuts:        auto | always | off
Open with:        empty | editor | preview | a command with {path} and {dir}
Binary files:     Open with | default app
Edit with:        empty | a command with {path} and {line}
Diff with:        empty | a command such as "hunk diff --" or "lazygit -f"
Diff groups:      folder | kind | off
Terminal target:  auto | pane right | pane below | tab | workspace
Ignore:           names to hide, such as ".cache .tmp"
Preview pane:     bottom | top
Treemap:          auto | image | cells | off
Palette:          key=#hex pairs over the terminal colors
Glyphs:           auto | nerd | plain | text
```

Dans le terminal, la couleur d'accent colore les dossiers, la racine, le curseur, les correspondances de recherche et les boîtes de premier niveau de la treemap de cellules. C'est le bleu vif du terminal avec un thème Claude sombre et son bleu avec un thème clair. `accent=#hex` dans Palette définit une autre couleur pour tout cela.

Follow work est décrit dans [Claude activity](docs/activity.md).

Open at start s'applique à chaque nouvelle session, `/clear` compris. Quand vous ouvrez ou fermez l'arborescence avec `/filetree`, ce choix dure jusqu'au prochain `/clear`. Après `/clear`, l'arborescence est ouverte ou fermée selon Open at start.

## Prérequis

```yaml
required:  Claude Code 2.1.306 or newer, git
optional:
  inotifywait:            live updates on Linux (inotify-tools)
  magick or ffmpeg:       images other than PNG, video frames
  pdftoppm or gs:         PDF pages
  soffice:                Word and office pages
  pandoc, pdftotext:      document text in tmux, herdr and other terminals
  tmux or herdr:          an editor or diff tool in a new pane
  Nerd Fonts 3.2+:        icons for Glyphs auto, which draws plain Unicode without one or with an older one
pictures:  Ghostty or kitty, outside tmux and herdr, on Linux and macOS
```

## Points à considérer

- L'application de bureau n'a pas d'aperçu fractionné ni de treemap
- L'application de bureau fait scintiller au plus quatre lignes à la fois ; les lignes supplémentaires allumées s'affichent dans leur couleur sans scintillement, tandis que le terminal les fait toutes scintiller. Si le panneau déborde encore, le bouton Clawd dans l'en-tête ou le réglage Activity shimmer désactive le scintillement
- L'application de bureau dessine au plus 150 lignes autour du curseur, et moins quand les lignes sont profondes, ont de longs chemins ou affichent des changements git ; une note indique les lignes omises
- Les GIF et vidéos affichent une image fixe
- Windows dimensionne les dossiers via les listes de fichiers, et la treemap ne dessine qu'un niveau
- Les clics sur les lignes nécessitent herdr 0.9.1 ou une version ultérieure ; lancez `herdr update`

## Contribuer

Ouvrez les pull requests vers une branche de release, pas vers `main` :

- Correctifs : la branche patch, par exemple `release/0.8.2`
- Fonctionnalités : la branche mineure, par exemple `release/0.9.0`

Conservez la version de cette branche.

Activez les hooks git une fois par clone. Le hook pre-commit exécute les vérifications rapides en quelques secondes : règles grep, types, oxlint et `claude plugin validate` quand les manifestes changent. Le hook pre-push vérifie la version par rapport à la branche de release et exécute les tests du plugin :

```bash
git config core.hooksPath .githooks
```

Les mêmes vérifications s'exécutent sur macOS, Windows et Linux en CI à chaque push touchant le plugin.

## Licence

[MIT](LICENSE). Les étiquettes de la treemap utilisent des glyphes de [Terminus Font](https://terminus-font.sourceforge.net/) par Dimitar Zhekov (Lat2-Terminus16, SIL Open Font License 1.1).

*Ce projet s'inspire de mon application Omarchy [FileBlade](https://github.com/data-goblin/fileblade)*
