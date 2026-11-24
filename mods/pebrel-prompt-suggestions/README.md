# Prédictions de prompt natives de Claude Code

Cet adaptateur géré utilise les hooks de fonction natifs de Claude Code. Il a été vérifié avec Claude Code 2.1.310 ; aucune compatibilité n'est revendiquée pour les versions antérieures. Il est chargé pour un nouveau processus avec `--plugin-dir <absolute-adapter-directory>` et
`CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1`. Charger un adaptateur ne l'installe pas dans la configuration globale de Claude
Code de l'utilisateur.

Le lanceur doit fournir `PEBREL_PREDICTION_ENDPOINT` (une adresse de bouclage HTTP IPv4
avec un port), `PEBREL_PREDICTION_TOKEN` et
`CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false`. Cette dernière variable désactive l'inférence de prédiction intégrée de Claude
Code pour ce processus. Sans elle, l'adaptateur ne fait rien, ce qui évite deux
demandes d'inférence pour le même tour terminé. Aucun paramètre global ni paramètre
du modèle principal n'est modifié.

Seul un tour principal réussi avec un composeur de terminal vide et monté est éligible.
`$.session.messages()` fournit les textes utilisateur/assistant en mémoire ; les charges utiles des outils ne
sont pas envoyées. Le pont reçoit au maximum 24 messages, 3000 unités UTF-16 par message
et 12000 unités au total. Pebrel définit le prompt de prédiction, le fournisseur configuré,
la langue et les limites de contexte supplémentaires. L'adaptateur n'ajoute aucun prompt de
style de parole et aucune persistance.

Le `loading_text` du pont localisé apparaît dans le pied de page `PromptHint`
atténué de Claude Code, suivi de `.`, `..` et `...` toutes les 400 ms. Il n'est pas modifiable et n'est
jamais envoyé à `prompt.suggest`. Un candidat terminé utilise le `$.prompt.suggest({text})` natif, aussi le comportement natif Tab/flèche droite remplit-il le composeur
sans soumettre le texte. Le composeur reste géré par Claude Code.

Une modification, un changement de prompt, un nouveau tour, la fin de session et un délai
de dix secondes invalident le travail d'interface en attente. Chaque résultat revérifie la
révision, la session et le brouillon vide. L'API native `http.fetch` n'a pas de signal
d'annulation : l'annulation supprime ici les résultats périmés, tandis que le pont gère le
délai réseau/de requête. Aucune interrogation disque ni minuteur ne subsiste lorsque
l'interface de prédiction est inactive.

Exécutez le contrat de comportement avec `node --test tests/*.test.mjs` et le scanner Claude réel avec
`claude plugin validate --strict --json <adapter-directory>`. Les tests simulés ne prouvent ni l'acceptation visuelle dans le terminal natif ni la
compatibilité avec une version de Claude non testée.
