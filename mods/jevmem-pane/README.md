# jevmem pane

Un panneau latéral pour Claude Code, à côté de votre conversation, qui montre ce que [jevmem](https://github.com/Avinash-jetwani/jevmem) a fait pour le prompt que vous venez d'envoyer et pour le tour qui vient de se terminer :

1. **Rappelé pour ce prompt** : chaque ligne de mémoire servie à Claude (son identifiant, son type et son texte) et combien ont été retenues.
2. **Le garde-fou** : le dernier appel sur lequel le garde-fou a posé une question ou qu'il a refusé, avec la règle et son score, associés à l'appel.
3. **Enregistré lors du dernier tour** : la ligne que jevmem a sauvegardée à partir du tour, avec son type, ou la raison pour laquelle le tour a été ignoré.

Chaque ligne comporte des boutons `why`, `wrong` et `forget`. `forget` et `wrong` modifient `JEVMEM.md` (la ligne est conservée comme `[retired]`) : une confirmation est donc demandée au préalable ; une règle n'est retirée que dans un terminal, comme le fait `jevmem trust`. Le panneau lit trois fichiers locaux sous `.jevmem/` et exécute la commande `jevmem` avec un vecteur d'arguments ; il n'envoie rien nulle part et ne lit aucune clé.

## Installation

Dans Claude Code, avec le marketplace jevmem ajouté (`claude plugin marketplace add Avinash-jetwani/jevmem`) :

```
/plugin install jevmem-pane@jevmem
```

Il faut la commande jevmem (`npm install -g jevmem`) et un projet activé (`jevmem setup`). Le panneau s'ouvre de lui-même dans un terminal d'au moins 144 colonnes ; `/jevmem` l'ouvre ou le ferme à toute largeur (ancré à côté de la conversation à partir de 110 colonnes dans le terminal plein écran, au-dessus du prompt en dessous). Claude Code uniquement : Cursor n'a pas de panneau.

La description complète, avec la signification de chaque état, se trouve dans [docs/pane.md](https://avinash-jetwani.github.io/jevmem/pane/).
