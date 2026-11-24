<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo.svg">
    <img src="docs/logo-light.svg" width="72" height="72" alt="tokendoctor">
  </picture>
</p>

<h1 align="center">tokendoctor</h1>

<p align="center">
  <strong>Le même Claude Code, jusqu'à 38 % en moins</strong>
  <br>
  Rejoue vos propres sessions passées pour montrer ce que chaque changement aurait économisé, puis ne modifie que ce que vous choisissez.
</p>

<p align="center">
  <a href="https://github.com/localixai/tokendoctor/actions/workflows/ci.yml"><img src="https://github.com/localixai/tokendoctor/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/github/v/tag/localixai/tokendoctor?label=version" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="#install">Installation</a> &bull;
  <a href="https://tokendoctor.localix.ai/docs">Documentation</a> &bull;
  <a href="https://tokendoctor.localix.ai">Site web</a> &bull;
  <a href="CHANGELOG.md">Journal des modifications</a>
</p>

<p align="center">
  <img src="docs/demo.gif" alt="tokendoctor dans une vraie session Claude Code : /tokendoctor:sessions, puis la tendance quotidienne" width="880">
</p>

**Ce sont vos sessions passées qui décident, pas le benchmark de quelqu'un d'autre.** Ce qu'un paramètre économise dépend de votre façon de
travailler : de la durée de vos sessions, des modèles que vous utilisez et de la nature du travail. Un chiffre issu des sessions d'une autre personne, y compris les miennes, en dit peu sur les vôtres. C'est pourquoi tokendoctor commence par regarder vos propres sessions.

**① Regardez vos 30 derniers jours.** `/tokendoctor:sessions` rejoue chacune de vos sessions,
requête par requête, avec des fenêtres de compactage de 200 K, 300 K, 400 K et 600 K, et montre ce que chacune aurait coûté. Il ne lit que vos transcriptions, n'effectue aucun appel de modèle et ne change rien. Le chiffre est une borne supérieure : un rejeu ne peut pas voir le travail que le modèle aurait refait après un résumé.

**② Ne changez que ce que vos sessions montrent comme rentable, et annulez-le.** `/tokendoctor:optimize` propose
des changements à partir de ces chiffres et vérifie vos paramètres par rapport à la documentation de Claude Code ; il n'applique que ceux que vous choisissez, chacun étant d'abord présenté sous forme de diff. `/tokendoctor undo` permet de revenir sur l'un d'eux.

**③ Facultatif : glisser au lieu de résumer.** Lorsque Claude Code s'arrêterait pour résumer la
conversation, tokendoctor supprime plutôt les anciennes sorties d'outils et conserve tous les messages. Il n'y a aucun appel de modèle : cela prend donc des millisecondes, et non une minute.

## Installation

```bash
claude plugin marketplace add localixai/tokendoctor
claude plugin install tokendoctor@tokendoctor
```

Redémarrez Claude Code et exécutez `/tokendoctor:sessions` pour voir ce que vos 30 derniers jours auraient coûté
pour chaque fenêtre. Rien ne change avant que vous choisissiez.

## Ce que j'ai trouvé dans mes sessions

Chaque requête envoie toute la conversation au modèle. Sur les modèles à fenêtre de 1 M, Claude Code
ne compacte qu'aux alentours de 967 K jetons : la fin d'une longue session est donc la partie coûteuse. Pour moi, deux tiers du coût du fil principal venaient de requêtes avec plus de 400 K de contexte.

J'ai donc choisi une fenêtre de 400 K et Sonnet pour les sous-agents. En comparant le mois précédent avec la semaine suivante,
soit environ 23 K et 19 K requêtes sur le fil principal, le contexte par requête est passé de 412 K à 219 K et le coût par
requête a chuté de 38 % aux tarifs publics de l'API. C'est un avant/après pour une seule personne, pas une expérience contrôlée.

Le revers est un plus grand nombre de résumés, chacun entraînant une pause : 79 secondes en moyenne dans mes sessions. C'est précisément ce que le glissement vise. Vos sessions peuvent montrer tout autre chose, et c'est justement l'intérêt de les examiner d'abord.

## Ce que montre le benchmark

Sur le [benchmark](bench/README.md), Claude Code construit un projet TypeScript face à des tests qu'il ne peut pas
modifier : une exécution ne compte donc que si les tests passent. Le coût est indiqué par tâche, sur Haiku 5.5 :

| Comparaison | Coût | Temps |
| --- | --- | --- |
| Glissement contre résumé, une journée de travail | −19 % | −33 % |
| Glissement contre résumé, un banc d'évaluation | −35 % | −28 % |
| Glissement contre résumé, une courte tâche | +6 % | −17 % |
| Les seuls conseils de paramètres, face à Claude Code dans sa configuration d'origine | plus cher dans 3 exécutions sur 4 | |
| Les conseils et le glissement, une semaine de travail | −11 % à −21 % | |

Tous les tests ont réussi à chaque exécution. Les conseils seuls n'ont pas été rentables ici, car ces tâches dépassent rarement 400 K, seuil à partir duquel la fenêtre commence à compter. Si vos sessions ne le dépassent pas non plus, votre rejeu le montrera et vous devriez laisser votre fenêtre telle quelle. Toutes les exécutions, y compris celles qui ont perdu, sont dans
[bench/HISTORY.md](bench/HISTORY.md).

<p align="center">
  <img src="docs/dashboard.png" alt="Le tableau de bord tokendoctor de l'auteur : 57 % de la dépense venait de Claude relisant la conversation" width="880"><br>
  <sub><code>/tokendoctor:dashboard</code> : où sont passés tous les jetons, par jour, modèle, sous-agent et projet. Un seul fichier local ; celui-ci est le mien.</sub>
</p>

## Commandes

| Commande | Ce qu'elle fait |
| --- | --- |
| `/tokendoctor:sessions [days]` | Rejoue vos sessions passées (30 jours, ou `days`) avec des fenêtres plus petites : ce que chacune aurait économisé, puis où vos jetons sont passés. Lecture seule. |
| `/tokendoctor:audit` | Vérifie vos paramètres, votre mémoire et vos fichiers CLAUDE.md par rapport à la documentation, par niveau de gravité. Lecture seule. |
| `/tokendoctor:dashboard [days]` | Ouvre un tableau de bord local de toutes les sessions de cette machine. |
| `/tokendoctor:optimize [focus]` | Propose jusqu'à cinq changements à partir de vos chiffres et applique ceux que vous choisissez. |
| `/tokendoctor [name] [value]` | Affiche, explique ou modifie un paramètre, sans appel de modèle. |
| `/tokendoctor undo [n]` | Liste tous les changements effectués par tokendoctor et en annule un. |

Rien ne quitte votre machine : le seul appel réseau concerne deux pages publiques de la documentation de Claude Code, une fois par jour. Il ne change jamais vos modèles de son propre chef.

## Documentation

**[tokendoctor.localix.ai/docs](https://tokendoctor.localix.ai/docs)** contient le reste : les
[38 checks](https://tokendoctor.localix.ai/docs/audit), tous les
[setting](https://tokendoctor.localix.ai/docs/settings),
[how the slide works](https://tokendoctor.localix.ai/docs/slide) (et les connexions Team et Enterprise
), les commandes depuis un shell, les [measurements](https://tokendoctor.localix.ai/docs/proof)
et les [limits](https://tokendoctor.localix.ai/docs/limits). Pour contribuer à tokendoctor, consultez
[CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

MIT
