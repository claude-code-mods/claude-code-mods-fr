# Operator Memory pour Claude Code

Operator Memory fournit à Claude Code un contexte durable sur le projet et l'utilisateur, entretenu par des agents sous forme de Markdown lisible.

## Installation

Nécessite Claude Code `v2.1.287` ou une version plus récente, ainsi qu'Operator Helper sur `PATH`.

```sh
operator-helper install claude-code
```

Démarrez un nouveau processus Claude Code après l'installation. Exécutez `claude plugin list` pour confirmer que `operator@operator-memory` est activé, puis demandez à l'agent si les instructions d'Operator Memory sont disponibles.

Le plugin injecte le préambule dans le prompt système principal et dans les prompts des tâches des sous-agents. La mémoire est affichée une fois par processus ; redémarrez Claude Code pour la recharger. `/clear` ne régénère pas le préambule mis en cache.

## Commandes

- `/operator:user-init` — Configure la partition utilisateur.
- `/operator:project-init` — Configure le « cerveau du projet ».
- `/operator:index` — Construit ou actualise l'index du projet.

## Mise à jour

Le helper active la mise à jour automatique du marketplace Operator pendant l'installation, y compris lors d'une réinstallation. Vous pouvez la désactiver ensuite dans `/plugin` → Marketplaces.

Relancez `operator-helper install claude-code` ou utilisez `claude plugin update operator@operator-memory`, puis redémarrez Claude Code.

Consultez [Claude Code guide](https://github.com/aerovato/operator-memory/blob/main/docs/harnesses/claude-code.md) pour la vérification, les mises à jour et le dépannage. Pour le développement local, exécutez `bun run preview:claude-code` depuis la racine de l'espace de travail.
