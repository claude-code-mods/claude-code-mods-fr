<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/banner-dark.svg">
    <img src="docs/assets/banner-light.svg" width="900" alt="ctx-handoff : la boîte à outils des longues sessions pour Claude Code">
  </picture>
</p>

<p align="center">
  <b>Faites en sorte que Claude se souvienne de ce que vous lui avez appris, repère ses erreurs habituelles<br>et reprenne les longues sessions quand vous revenez.</b>
</p>

<p align="center">
  <a href="https://github.com/cablate/ctx-handoff-mod/releases"><img src="https://img.shields.io/github/v/release/cablate/ctx-handoff-mod?include_prereleases&display_name=release&label=release&color=7dd3fc" alt="Latest release"></a>
  <a href="https://github.com/cablate/ctx-handoff-mod/actions/workflows/check.yml"><img src="https://github.com/cablate/ctx-handoff-mod/actions/workflows/check.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/Claude_Code-2.1.287%2B-a78bfa" alt="Claude Code 2.1.287 ou ultérieur">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"></a>
</p>

<p align="center">
  <b>Anglais</b> · <a href="README.zh-TW.md">Chinois traditionnel</a> · <a href="#install">Installation</a> · <a href="#whats-inside">Fonctionnalités</a> · <a href="docs/guide.md">Guide</a> · <a href="CHANGELOG.md">Journal des modifications</a>
</p>

<p align="center">
  <img src="docs/assets/handoff.svg" width="900" alt="Animation : une longue session remplit son contexte jusqu'au seuil ; ctx-handoff rédige un résumé du travail vérifié, des tentatives échouées, de vos limites et de la prochaine étape, efface la conversation, et une nouvelle session reprend à partir de ce résumé">
</p>

## Pourquoi

Les longues sessions Claude Code se heurtent toujours aux mêmes corvées. ctx-handoff s'en occupe en arrière-plan, donc en usage normal vous ne tapez aucune commande.

| Quand… | Sans | Avec ctx-handoff |
|---|---|---|
| la conversation est presque pleine | Vous écrivez un résumé, `/clear`, vous le recollez | Un résumé est écrit, la conversation est effacée et une nouvelle continue |
| vous vous absentez une heure | Votre message suivant relit tout au prix fort | Le cache est gardé au chaud jusqu'à environ 4 heures |
| vous répétez une consigne | La conversation suivante l'oublie | Elle devient une note de projet, et après 3 fois une ligne dans votre dépôt |
| vous `/clear` ou rouvrez Claude Code | La nouvelle conversation démarre aveugle | Elle est informée de l'endroit où la précédente s'est arrêtée |
| Claude réessaie une commande qui échoue, ou dit « terminé » sans test | Vous l'apprenez plus tard | Claude reçoit un nudge d'une ligne tout de suite |

## Installation

Nécessite Claude Code 2.1.287 ou une version ultérieure. Testé jusqu'à 2.1.302.

```sh
claude plugin marketplace add cablate/ctx-handoff-mod
claude plugin install ctx-handoff@ctx-handoff-mod
```

Démarrez une nouvelle session et tapez `/handoff`. Vous devriez voir :

```
context 12034 / threshold 600000 (window 1000000)
Cache refresh on, refreshed 0/3 this idle period, timer not started
```

C'est tout. Mettez à jour avec `claude plugin update ctx-handoff@ctx-handoff-mod`, ou activez la mise à jour automatique sous **Marketplaces** dans `/plugin`.

> [!NOTE]
> Conçu pour les abonnements Claude et les longues sessions (par exemple sur un modèle à contexte de 1 M). Sur une clé API, Bedrock ou Vertex le cache ne dure que 5 minutes, donc lancez `/handoff refresh off` ; tout le reste fonctionne. ctx-handoff est expérimental, car les mods Claude Code sont encore en accès anticipé.

## Ce qu'il contient

ctx-handoff est une boîte à outils croissante pour les longues sessions : les nouvelles fonctionnalités pour travailler avec Claude pendant des heures arrivent ici.

### Passer la main avant que le contexte ne se remplisse (facultatif)

Désactivé par défaut, pour que la compaction propre de Claude Code prenne le relais. Activez `auto_handoff` dans l'onglet Settings du panneau : à 600 k jetons, il attend que Claude et ses sous-agents aient fini, écrit un résumé qui sépare le travail vérifié des modifications non vérifiées, liste ce qui a échoué, les limites que vous avez fixées dans vos propres mots et ce qui a déjà été découvert, se termine par une prochaine étape, efface et continue dans une nouvelle conversation. Tout ce que vous tapez entre-temps est conservé.

### Garde le cache au chaud pendant votre absence

Après environ 50 minutes d'inactivité, il envoie une minuscule requête pour que le cache de conversation n'expire pas (et devance la compaction par inactivité de 54 minutes de Claude Code sur les grosses conversations), jusqu'à 3 fois (environ 3,5 heures) ; après cela il enregistre un résumé de passage de main sans effacer, pour qu'à votre retour vous choisissiez de repartir de zéro à partir de lui (`/handoff resume`) ou de rester où vous étiez (`continue`).

Pour mettre en pause les rafraîchissements et résumés d'absence pour cette seule conversation, cliquez sur le bouton en haut du panneau ou lancez `/handoff away pause` (`resume` redémarre le minuteur). Les mises à jour de notes continuent et les autres conversations ne sont pas affectées. Le panneau et `/handoff` affichent aussi l'activité d'arrière-plan en direct et l'usage de jetons d'arrière-plan rapporté par la session depuis cette mise à jour (pas une facture ; les requêtes déjà envoyées ne peuvent pas être annulées).

<img src="docs/assets/cache.svg" width="900" alt="Animation : après votre départ, le cache est rafraîchi à 55, 110 et 165 minutes ; ensuite un résumé est enregistré, et à votre retour vous choisissez de reprendre ou de continuer">

### Apprend votre projet, puis le transmet à votre dépôt

<img src="docs/assets/memory.svg" width="900" alt="Animation : la même instruction sur trois jours devient une règle de projet, puis une ligne dans CLAUDE.md à revoir">

Les préférences, corrections et faits deviennent un fichier de notes Markdown par projet, chargé dans chaque nouvelle conversation. Les routines répétées deviennent des compétences de projet. Seule la partie nouvelle de la conversation est lue, par Sonnet 5.5 à effort faible.

Si une mise à jour de notes échoue ou donne une sortie inutilisable, ce morceau de conversation est conservé pour la prochaine tentative, sans compter la même règle ou procédure deux fois. Les mémoires que vous supprimez ne reviennent que si vous les évoquez à nouveau dans un nouveau morceau de conversation.

### Se souvient de l'endroit où vous vous êtes arrêté

<img src="docs/assets/resume.svg" width="900" alt="Animation : après /clear, la conversation suivante reçoit la dernière tâche, son état et la prochaine étape">

### Repère les erreurs habituelles

<img src="docs/assets/nudges.svg" width="900" alt="Animation : rappels après deux échecs identiques, après avoir dit « terminé » sans vérifier, et après avoir quitté votre langue">

### Les gardes que vous approuvez, un panneau pour tout

Quand une règle est déjà écrite mais continue d'être enfreinte, ctx-handoff rédige un garde : une vérification sur les appels d'outil qui rappelle ou bloque Claude. Claude vous en parle dans la conversation suivante et rien ne s'applique avant que vous disiez oui. `/handoff panel` ouvre un panneau au-dessus du prompt pour les gardes, les mémoires, les règles, la dernière mise à jour de notes et tous les paramètres.

<img src="docs/assets/guard.svg" width="900" alt="Animation : une règle de CLAUDE.md régulièrement enfreinte devient un brouillon de garde ; Claude demande si vous voulez l'activer, vous dites oui, et le prochain git push reçoit un rappel. À côté, le panneau au-dessus de l'invite parcourt ses onglets : gardes, mémoire, règles, dernière mise à jour et paramètres">

## Paramètres

Tout est dans l'onglet Settings du panneau (`/handoff panel`, puis <kbd>5</kbd>), avec l'origine de chaque valeur et un bouton de réinitialisation. Les valeurs par défaut sont faites pour être laissées telles quelles. Le [guide](docs/guide.md#settings) liste tous les paramètres.

## Coût et confidentialité

- **Pas de serveurs propres.** Il tourne sur votre connexion Claude Code et n'envoie rien ailleurs qu'Anthropic, comme la conversation elle-même.
- **Coûts faibles et prévisibles.** Un passage de main est une requête ; un rafraîchissement du cache se lit depuis le cache à environ un dixième du prix d'entrée ; une mise à jour de notes n'envoie que la partie nouvelle de la conversation. Les nudges ne coûtent rien.
- **Fichiers en clair que vous possédez.** Les notes sont du Markdown dans `~/.claude/projects/`. Vérifiez ce que le mod peut faire avec `claude plugin validate` ; le [guide](docs/guide.md#cost-privacy-and-permissions) explique chaque entrée.

## Documentation

- [Guide](docs/guide.md) : chaque fonctionnalité en détail, les paramètres, les commandes, les permissions, les environnements pris en charge, les limitations, le dépannage et la désinstallation.
- [Changelog](CHANGELOG.md) : ce qui a changé dans chaque version et pourquoi ça vaut la peine de mettre à jour.
- [Contributing](CONTRIBUTING.md) : comment l'exécuter depuis les sources et envoyer des modifications. Les rapports de bug et les idées vont dans [issues](https://github.com/cablate/ctx-handoff-mod/issues/new/choose).
- [Security](SECURITY.md) : comment signaler une vulnérabilité de façon privée.

## Historique des étoiles

<a href="https://star-history.com/#cablate/ctx-handoff-mod&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=cablate/ctx-handoff-mod&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=cablate/ctx-handoff-mod&type=Date" />
    <img alt="Star history chart" src="https://api.star-history.com/svg?repos=cablate/ctx-handoff-mod&type=Date" />
  </picture>
</a>

## Licence

[MIT](LICENSE)
