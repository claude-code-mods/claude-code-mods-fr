# Les meilleurs mods Claude Code

{{languages}}

**Choisis à la main, validés, épinglés. Un seul ajout, {{count}} mods.**

Les mods sont des plugins Claude Code faits de hooks de fonctions : ils observent, modifient ou prennent en charge ce que fait Claude Code, et dessinent leur propre interface. Ce marketplace rassemble les meilleurs mods de la communauté. Chacun est vérifié avec `claude plugin validate` et épinglé au commit vérifié : les modifications ultérieures de son auteur ne vous parviennent jamais sans relecture.

Nécessite Claude Code 2.1.287 ou plus récent.

> **Les {{count}} mods sont entièrement localisés en français.** Chaque libellé, commande, panneau, invite et README a été traduit ; les sources des plugins sont incluses dans ce dépôt, donc l'interface est déjà en français après l'installation, sans configuration supplémentaire. Seuls les identifiants de code, les noms d'événements de hook, les skills et les instructions destinées au modèle restent en anglais, afin que le comportement ne change pas.

## Installation

Dans une session Claude Code au terminal :

```
/plugin marketplace add claude-code-mods/claude-code-mods-fr
/plugin install <mod>@claude-code-mods-fr
```

Par exemple `/plugin install terminal-browser@claude-code-mods-fr`. Lancez `/plugin marketplace update claude-code-mods-fr` pour recevoir les nouveaux mods et les mises à jour.

## Catalogue

Le champ **Accès** de chaque carte indique ce que, selon le validateur, le code du mod peut faire en plus de dessiner son interface. Lisez le code d'un mod avant de l'installer : la validation le lit sans l'exécuter et ne constitue pas un audit de sécurité.

{{catalog}}

## Proposer un mod

Ouvrez une issue avec le lien vers le dépôt du mod. Pour l'ajouter vous-même, ajoutez une entrée dans `community.json` (dépôt, dossier, commit relu, catégorie, licence), écrivez ses résumés d'une ligne dans `readme/summaries.json`, lancez `python3 scripts/build-catalog.py` et ouvrez une pull request.

## Remerciements et localisation

Chaque mod appartient à son auteur original et conserve sa propre licence. Au-delà de cette collecte, ce dépôt fournit une **localisation française** : les plugins sont regroupés sous `mods/`, leurs libellés, descriptions de commandes, panneaux et invites sont traduits, et la documentation de chaque mod est également traduite (l'original est conservé sous `README.en.md`). L'auteur original et la licence sont crédités à la fin de chaque document. Si vous souhaitez retirer une copie localisée ou modifier son attribution, veuillez ouvrir une issue.

Projet non officiel ; ce n'est pas un produit Anthropic.
