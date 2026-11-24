

![Agent Standup](.claude-plugin/icon.png)

Une ligne au-dessus de votre invite Claude Code lorsqu'une autre session Claude Code sur cet ordinateur a besoin de vous :

✋ la boutique en ligne (VS Code) a besoin d'une approbation Agent Standup · /agent-standup:open les montre tous Masquer

et un petit toast quand on commence à vous attendre, ou qu'on finit son tour. Vous restez dans la session dans laquelle vous travaillez et savez toujours quand un autre est bloqué sur une question ou une approbation.

C'est un mod : un plugin des fonctions hooks de Claude Code. Il dessine dans le terminal et dans l'onglet Code de l'application de bureau Claude. Dans VS Code, l'[extension Agent Standup](https://marketplace.visualstudio.com/items?itemName=DoubleGeste.agent-standup) affiche la même chose dans sa barre d'état.



Dans Claude Code 2.1.294 ou version ultérieure :

/plugin install agent-standup-band --marketplace Atoll92/agent-standup

Avec une version antérieure, il charge et ne fait rien : ces versions n'exécutent pas de mods (et avant 2.1.221 dans le terminal, 2.1.269 ailleurs, elles n'écrivent pas non plus le statut qu'il lit).

Pour voir chaque session comme un appel d'équipe en direct, installez également le plugin principal : `/plugin install agent-standup --marketplace Atoll92/agent-standup`, puis `/agent-standup:open`.



- Toutes les 4 secondes, le fichier d'état que Claude Code conserve pour chaque session ouverte, dans `~/.claude/sessions/<pid>.json` (ou sous `CLAUDE_CONFIG_DIR`) : quelle session, son dossier, et si elle est occupée, inactive ou en attente pour vous. Pas les conversations. Une session démarrée par un programme avec `claude -p` est laissée de côté : ses questions vont à ce programme. Une application Agent SDK (Zed, une application maison) est conservée, car elle peut montrer ses menus à une personne. - `ps`, pour vérifier qu'une session dite en attente fonctionne toujours : une session qui a planté laisse son fichier derrière elle.

Il n’écrit rien et n’envoie rien nulle part.



Source et problèmes : https://github.com/Atoll92/agent-standup. Non officiel : non affilié ou approuvé par Anthropic. Licence MIT.

## Source et licence

- Dépôt original : https://github.com/Atoll92/agent-standup
- Licence : MIT
- Traduction française et localisation de l’interface : projet claude-code-mods-fr
