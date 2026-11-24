# Start Plugin - The Agentic Startup

Start est un plugin Claude Code qui fournit des compétences de développement pilotées par spécification, pour vous aider à passer de l'idée au code de production.

## Installation

Dans Claude Code, exécutez :

```text
/plugin marketplace add <source>
/plugin install start@<marketplace>
```

Puis redémarrez Claude Code.

## Compétences disponibles

- `/specify <description>` : rédiger une spécification
- `/implement <spec-id>` : implémenter une spécification
- `/validate <target>` : valider le résultat
- `/test [target]` : exécuter les tests
- `/review [target]` : relire le code
- `/document [target]` : documenter
- `/analyze <area>` : analyser une zone
- `/refactor <description>` : refactoriser
- `/debug <description>` : déboguer
- `/constitution [focus-areas]` : définir la constitution du projet

## Principes

- Pas de secrets codés en dur
- Développement piloté par spécification
- Revue et validation systématiques

## Licence

MIT
