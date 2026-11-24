# claude-carbon

claude-carbon est un plugin open source pour Claude Code qui suit l'empreinte carbone de vos sessions : une estimation de CO2 en direct, calculée localement à partir de votre utilisation de jetons, dans la ligne d'état du terminal et dans l'onglet Code de l'application Claude Desktop, à côté du coût équivalent API de la session. Dans l'application Desktop, `/carbon-panel` ouvre un volet avec une molécule de pixels colorée selon le CO2 de cette session par rapport à la médiane de vos sessions passées, votre utilisation sur la période choisie, ses bandes de réchauffement, et un bouton pour votre carte annuelle.

## Ce que fait claude-carbon

- `/carbon-panel` : un volet dans l'application Claude Desktop avec la molécule de CO2, votre utilisation et les bandes de réchauffement de vos sessions (dans un terminal, la session dans la bande au-dessus du prompt). Voir [le mod](#the-mod-carbon-panel-and-the-co2-of-each-answer)
- Ajoute une estimation de CO2 en direct à la ligne d'état de Claude Code, et le CO2 de la session sous le prompt dans l'application Desktop, chacun à côté du coût équivalent API de la session
- Persiste chaque session dans une base SQLite locale, pour que l'historique survive à la purge des transcriptions de 30 jours
- Récupère les données historiques depuis les transcriptions `~/.claude` existantes
- Commandes slash : `/carbon-report` (texte), `/carbon-card` (PNG), `/carbon-pr` (empreinte d'une pull request)
- Un badge README avec votre total toutes périodes, et une méthodologie publique avec chaque facteur sourcé

> **À propos du chiffre `$`.** C'est un équivalent API : ce que votre session coûterait aux prix publics pay-as-you-go d'Anthropic. Sur un abonnement Pro, Max ou Ultra vous ne le payez pas ; il montre la valeur de ce que vous avez utilisé, à côté de son CO2. Voir [Comment ça marche](#how-it-works).

## Installer

Dans Claude Code, tapez :

```
/plugin install claude-carbon --marketplace gwittebolle/claude-carbon
```

Claude Code vous demande de confirmer le marketplace, montre ce que le plugin installe, puis demande où l'installer : choisissez **Installer pour vous**. La même ligne fonctionne sur macOS, Linux et Windows. Dans l'onglet **Code** de l'application Claude Desktop, si la ligne n'est pas prise, collez plutôt ce message et acceptez quand Claude le demande :

```
Install the claude-carbon plugin for me: claude plugin install claude-carbon --marketplace gwittebolle/claude-carbon
```

Puis quittez Claude Code complètement, rouvrez-le et démarrez une nouvelle session. Votre CO2 s'affiche maintenant à côté du coût de la session :

- dans un terminal, dans la ligne d'état : `$0.50 · 65gCO₂`
- dans l'application Desktop, sous le prompt : `Cette session : 3.6 gCO₂ · $0.12`

Le plugin définit cette ligne d'état une fois, au premier démarrage de session, et seulement si vous n'en avez pas : la ligne d'état d'un autre outil est laissée telle quelle. `/carbon-report` donne vos totaux, et `/carbon-panel` ouvre le volet dans l'application Desktop. Le `$` est un coût équivalent API, pas ce que facture votre abonnement. Pour mettre à jour plus tard, exécutez `/carbon-update`.

## Licence

claude-carbon est libre et open source sous [licence MIT](LICENSE). Contributions bienvenues.
