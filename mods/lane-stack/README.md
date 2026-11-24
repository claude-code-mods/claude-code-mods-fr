# lane-stack (plugin Claude Code)

La moitié « côté Claude » de Claude Lane Stack : agents PM, commandes slash et compétences de playbook.

Installez à partir du marketplace du dépôt (et non en copiant dans `~/.claude/agents` / `~/.claude/skills`) :

```bash
claude plugin marketplace add VKirill/claude-lane-stack
claude plugin install lane-stack@claude-lane-stack -y
```

`./install.sh` enregistre ce marketplace GitHub avec `autoUpdate: true` et synchronise tout de même le runtime hôte (`bin/`, le board, les profils d'écrivain) vers `~/.agents`. Les fichiers hôtes ne se mettent pas à jour automatiquement : relancez `./install.sh`. Installation depuis un checkout local : `LANE_INSTALL_LOCAL_MARKETPLACE=1 ./install.sh`.

Les compétences sont préfixées `/lane-stack:<skill>`. Aide-mémoire de travail : `/lane-stack:info` ou `/info`. Pour parler d'une nouvelle application ou d'un nouveau service : `/lane-stack:app-architect`. Documentation vivante : `/lane-stack:docs-maintain`. Corpus de faits : `/lane-stack:lane-memory`. Les playbooks PM (`orchestrator-lanes`, `orchestrator-workflow`, `info`, `app-architect`) existent uniquement dans ce plugin et dans `~/.agents/pm-skills` — ils ne sont pas copiés dans le catalogue partagé des écrivains.
