# Plugin terminal-browser pour Claude Code

> Ce plugin est expérimental et présente des [limitations connues](#limitations)




https://github.com/user-attachments/assets/a79e7667-6fcb-49a4-9967-44d0f942102c



## Installation

Installer terminal-browser
```
curl -fsSL https://terminal-browser.sh/install | bash # or brew install terminal-browser
```

Vérifiez que vous utilisez la dernière version de Claude Code
```
claude update
```

Activez les plugins d'interface de Claude Code en ajoutant ceci à `~/.claude/settings.json` :
```json
{
  "env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1" }
}
```




Installer le plugin terminal-browser
```
# set the marketplace
claude plugin marketplace add zenbu-labs/terminal-browser

# install the plugin
claude plugin install terminal-browser@terminal-browser
```

Vous pouvez désormais exécuter « /browser » dans Claude Code pour ouvrir le navigateur

### Mise à jour

Mettre à jour le plugin Claude Code
```
claude plugin update terminal-browser@terminal-browser
```

Mettre à jour terminal-browser
```
terminal-browser upgrade
```

### Configuration

Vous pouvez configurer le plugin terminal-browser pour ajouter un outil que Claude utilisera pour ouvrir le navigateur. Cet outil est désactivé par défaut, car Claude peut déjà utiliser la CLI `terminal-browser` pour ouvrir le navigateur dans le terminal via un panneau fractionné. Pour l'activer, ajoutez ce qui suit à votre ` ~/.claude/settings.json` :

```json
{
  "pluginConfigs": {
    "terminal-browser@terminal-browser": {
      "options": {
        "agentTool": true
      }
    }
  }
}
```


## API du plugin terminal-browser

Le plugin terminal-browser fournit une API utilisable dans un autre plugin Claude Code pour ouvrir le navigateur et charger une URL de façon programmatique. Voici quelques exemples de plugins utiles que vous pouvez construire ainsi :
- commande slash `/tldraw` qui ouvre tldraw dans le panneau fractionné de Claude Code
- commande slash `/open-pr` qui ouvre la PR associée à la branche sur laquelle vous travaillez

```typescript
export type BrowserOpenInput = { url?: string }

export type BrowserOpenResult =
  | { ok: true; url: string }
  | { ok: false; error: string }

export type Browser = {
  open: (input: BrowserOpenInput) => Promise<BrowserOpenResult>
  close: (input?: Record<string, never>) => Promise<boolean>
}

// usage: in your plugin's hooks module
on('command.run', { command: 'tldraw' }, async ($) => {
  const result = await $.browser.open({ url: 'https://www.tldraw.com/' })
  return { text: result.ok ? 'Opened tldraw' : result.error }
})
```

## Comment cela fonctionne-t-il ?

terminal-browser utilise le [protocole graphique kitty] pour afficher, dans le terminal, les pixels générés par un vrai navigateur. Pour afficher le navigateur dans Claude Code, nous utilisons la nouvelle [function hooks API](https://github.com/anthropics/claude-code/issues/91870) de Claude Code.

Le cœur de terminal-browser a été extrait dans une bibliothèque JavaScript — https://github.com/zenbu-labs/terminal-browser/tree/main/pixel — si vous souhaitez construire votre propre application graphique dans Claude Code/le terminal


## Terminaux pris en charge

Le plugin Claude Code de terminal-browser ne fonctionne que dans les terminaux qui prennent en charge le [protocole graphique kitty] et implémentent [kitty unicode placeholders](https://sw.kovidgoyal.net/kitty/graphics-protocol/#unicode-placeholders). Les terminaux les plus populaires prenant en charge cette fonctionnalité sont :
- [ghostty](https://ghostty.org)
- [kitty](https://sw.kovidgoyal.net/kitty/)

Si votre terminal ne prend pas en charge les fonctionnalités requises, tenter d'ouvrir le navigateur dans Claude Code peut corrompre l'affichage TUI

En outre, tous les terminaux basés sur libghostty prendront en charge cette fonctionnalité ; par exemple :
- [cmux](https://cmux.com/)
- [supacode](https://supacode.sh/)

Vous trouverez d'autres terminaux basés sur libghostty ici : [awesome-libghostty](https://github.com/Uzaaft/awesome-libghostty)

Même si votre terminal prend en charge la fonctionnalité graphique requise, le plugin peut ne pas fonctionner si vous utilisez un multiplexeur. En effet, les multiplexeurs réécrivent la sortie des programmes de terminal et cassent les commandes graphiques du terminal. La prise en charge de tmux arrivera bientôt (terminal-browser fonctionne actuellement dans tmux, mais pas encore via le plugin Claude Code) ; avec herdr, les performances sont très mauvaises lors du passage par le plugin Claude Code, mais elles devraient bientôt s'améliorer. Je n'ai pas testé les autres multiplexeurs : si cela ne fonctionne pas, merci d'ouvrir une issue et je verrai si nous pouvons assurer la prise en charge.




## Limitations
- dépend de la prise en charge du [protocole graphique kitty] par votre terminal
- la position de la souris sera parfois légèrement décalée, car Claude Code n'active pas le rapport de coordonnées pixel de la souris
- le plugin doit effectuer des requêtes fetch vers un serveur HTTP local pour communiquer avec la CLI terminal-browser ; votre système d'exploitation peut afficher une invite indiquant que votre terminal souhaite accéder au réseau local
- Claude Code impose une largeur minimale très élevée à la zone de discussion : il est donc parfois impossible de redimensionner le navigateur à la taille souhaitée
- le plugin dépend de l'API expérimentale des hooks de fonction de Claude Code, qui est instable : le plugin peut donc casser entre deux versions

[protocole graphique kitty]: https://sw.kovidgoyal.net/kitty/graphics-protocol/
