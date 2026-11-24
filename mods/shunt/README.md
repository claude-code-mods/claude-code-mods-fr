# shunt

Un **Claude Mod** — plugin Claude Code dont le comportement est un module [function hooks](https://github.com/anthropics/claude-code/issues/91870) — qui affiche l'usage dans une bande au-dessus du prompt (le pool de comptes partagé de la passerelle [shunt](https://github.com/pleaseai/shunt) sur shunt, sinon les limites de débit propres à la session) et répond à `/shunt:usage` avec le détail complet du pool.

```
shunt · 5H 5% ↻1h 41m · WK 46% ↻1d 7h · Fable 31% ↻1d 7h ⚠ anthropic degraded
```

```
> /shunt:usage

shunt: pool — degraded   http://127.0.0.1:3001

  5h    ▓▓▓▓▓▓░░░░  62% left   resets 04:11
  7d    ▓▓▓▓▓▓▓▓░░  81% left   resets Sun 01:11
  fable ▓▓░░░░░░░░  19% left   resets Sun 01:11

  claude  ok         5h  71%  7d  84%  fable  19%
  codex   exhausted  5h   0%  7d  40%  fable    —

  headroom left, averaged over the pool's accounts; a shared figure, not a promise about your next request
```

Le mod lit le point d'accès [`GET /usage`](https://shunt.sh/reference/endpoints/) de la passerelle et l'affiche. Il répond lui-même à la commande — le hook revient sans appeler `next`, donc rien n'est envoyé au modèle et la réponse ne coûte aucun jeton.

## La bande d'usage

Sur une passerelle shunt, la bande affiche le pool, marqué `shunt ·`. Chaque chiffre indique la part de la fenêtre **utilisée** — `1 - remaining`, la même moyenne à l'échelle du pool que la commande rapporte comme marge — suivi du délai avant la plus proche réinitialisation. L'usage plutôt que le restant, pour lire comme la propre `/usage` de Claude Code et comme la bande hors shunt. Un chiffre passe ambre à 70 % et rouge à 90 %. Chaque fournisseur mutualisé dont l'état n'est pas `ok` est signalé en fin de ligne (`⚠ anthropic degraded` : ambre pour `degraded`, rouge pour `exhausted` ou `capped`), ou le pool lui-même si aucun fournisseur n'est listé. Une fenêtre qu'aucun compte ne rapporte est omise.

Hors shunt — pas de passerelle, passerelle qui répond `GET /usage` avec 404, réponse réussie qui n'est pas un rapport de pool, ou pool sans fournisseur — la bande affiche les limites de débit propres à la session, sans marqueur, telles que `$.session.usage()` et `session.measure` les rapportent :

```
5H 5% ↻1h 41m · WK 46% ↻1d 7h
```

Sur shunt, il lit `GET /usage` au démarrage de la session, chaque minute ensuite, et après chaque tour — juste après que le pool a été consommé — et ignore les limites propres à la session, qui viennent du compte du pool ayant répondu en dernier. Un jeton refusé (401 ou 403), passerelle injoignable, autre statut d'erreur ou utilitaire `shunt gateway token` en échec constitue un défaut sur shunt : il est signalé plutôt que remplacé — `shunt · ⚠ credential refused`, ou `shunt · ⚠ gateway login unavailable` pour l'utilitaire. Sans passerelle ni limites de débit (clé API envoyée directement à Anthropic), la bande ne dessine rien. Ce qu'un autre plugin dessine dans la bande reste à sa gauche.

Repliez la bande pour la session avec son `[-]` (ctrl+x ctrl+a), ou désactivez-la avec l'option `usageBand` ci-dessous.

## Lire les chiffres

`remaining` est la fraction de la capacité combinée du pool encore **utilisable** : `62%` signifie qu'il reste 62 % de marge, et non que 62 % ont été consommés. C'est `mean(clamp(cap - utilization, 0, 1))` sur les comptes non désactivés qui rapportent la fenêtre, où `cap` est le plafond strict `max_utilization` du compte pour cette fenêtre (`100%` si aucun n'est défini) : neuf comptes épuisés plus un compte neuf sans plafond donnent `10%`, pas `100%`, et un compte à 44 % sous un plafond de 50 % ne compte que `6%`. Un compte déjà exclu par un plafond des requêtes de la fenêtre compte zéro ; un plafond 5 h ou 7 j l'exclut de toute requête, y compris Fable.

C'est un **agrégat à l'échelle du pool, pas une prédiction** — le routage pèse aussi la disponibilité, le modèle, l'affinité de session et la priorité ; un chiffre sain ne garantit pas que votre prochaine requête sera admise. Pour le pire cas tenant compte du routage, utilisez plutôt `GET /api/oauth/usage`.

| Fenêtre | Ce qu'elle couvre |
| ------- | ----------------- |
| `5h` | La fenêtre de session glissante de 5 heures |
| `7d` | La fenêtre hebdomadaire partagée |
| `fable` | La fenêtre hebdomadaire limitée à Fable (`7d_oi`) |

Une fenêtre affiche `—` quand aucun compte non désactivé ne la rapporte. Les comptes ChatGPT/Codex remplissent `5h` et `7d` à partir des en-têtes de réponse `x-codex-*` et n'ont pas de signal propre limité à Fable.

`pool` est l'agrégat sur tous les fournisseurs mutualisés ; les lignes dessous sont le même agrégat par fournisseur, donc une session routée vers l'un peut afficher sa marge plutôt que le chiffre mélangé. Le point d'accès ne transporte jamais noms de comptes, effectifs, priorités ni chiffres par compte — ces détails restent derrière `GET /admin/api/pool` réservé aux administrateurs.

## Prérequis

1. **Pointez Claude Code vers votre passerelle**, comme vous le faites déjà pour le routage :

```bash
   export ANTHROPIC_BASE_URL=http://127.0.0.1:3001
   export ANTHROPIC_AUTH_TOKEN=<your client token>
   ```

2. **Activez le point d'accès** sur la passerelle. `GET /usage` est opt-in et exige `[server.auth]` (jetons client) ou `[server.gateway]` (connexion passerelle), à côté de la table `[server.usage]` dans `shunt.toml` :

```toml
   [server.auth]

# La seule présence active l'option ; la table ne prend aucune clé.
   [server.usage]
   ```

Avec `[server.gateway]` au lieu de `[server.auth]`, voir [`shunt gateway claude` sessions](#shunt-gateway-claude-sessions) ci-dessous.
   `[server.auth]` prend ses jetons dans l'environnement plutôt que dans le TOML —
   par défaut `SHUNT_CLIENT_TOKENS`, comme l'apparie `name:token` — et la passerelle ne démarre pas si la variable est absente. Exportez-la là où tourne la passerelle, avec le même jeton que `ANTHROPIC_AUTH_TOKEN` ci-dessus :

```bash
   export SHUNT_CLIENT_TOKENS="claude-code:<your client token>"
   ```

3. **Lancez Claude Code avec les hooks de fonction activés** — la fonctionnalité est en accès anticipé :

```bash
   CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude
   ```

Sans l'étape 3, aucune bande ; la commande existe toujours mais retombe sur `commands/usage.md`, qui demande au modèle de lire le point d'accès avec un appel d'outil.

## Installation

```
/plugin marketplace add pleaseai/shunt
/plugin install shunt@shunt
```

## Configuration

Une option, une ligne dans `/config` (enregistrée dans settings.json sous `pluginConfigs`) :

| Option | Par défaut | Rôle |
| ------ | ---------- | ---- |
| `usageBand` | `true` | Afficher la bande au-dessus du prompt. Désactivé, le mod n'enregistre aucune bande et n'interroge rien ; `/shunt:usage` répond toujours |

Le mod lit cinq variables d'environnement et n'en écrit aucune. Par défaut il envoie l'identifiant propre à la session à la passerelle vers laquelle la session envoie déjà chaque message : il n'atteint donc aucun hôte que la session n'utiliserait pas déjà ; `SHUNT_BASE_URL` est la seule exception délibérée, qui le pointe vers une passerelle que vous nommez. Sans URL de base définie, il ne demande rien plutôt que d'envoyer l'identifiant à l'API d'Anthropic.

| Variable | Rôle |
| -------- | ---- |
| `SHUNT_BASE_URL` | URL de base de la passerelle ; remplace `ANTHROPIC_BASE_URL` |
| `ANTHROPIC_BASE_URL` | La passerelle par laquelle cette session route déjà |
| `SHUNT_TOKEN` | Le jeton client ; remplace les deux ci-dessous, envoyé comme `Authorization: Bearer` |
| `ANTHROPIC_AUTH_TOKEN` | Envoyé comme `Authorization: Bearer`, comme Claude Code l'envoie |
| `ANTHROPIC_API_KEY` | Envoyé comme `x-api-key`, comme Claude Code l'envoie |

`SHUNT_BASE_URL` permet de lire le pool d'une passerelle tout en routant le trafic par une autre.

### Sessions `shunt gateway claude`

`shunt gateway claude` retire `ANTHROPIC_AUTH_TOKEN` et `ANTHROPIC_API_KEY` de l'environnement transmis à Claude Code et branche `apiKeyHelper` sur `shunt gateway token` ; Claude Code consomme lui-même la sortie de l'utilitaire et ne la réexporte jamais. Quand aucune des variables ci-dessus ne contient d'identifiant, le mod lit donc les paramètres fusionnés (`--settings` compris) et, si `apiKeyHelper` est bien l'utilitaire de shunt — `shunt gateway token`, par nom nu ou par chemin, tel que le lanceur l'écrit — il l'exécute directement, sans coque, et envoie le jeton de connexion affiché comme `Authorization: Bearer`. Comme il n'y a pas de coque, un `~/` en tête d'un chemin d'utilitaire non cité est développé vers le répertoire personnel (`HOME`, sinon `USERPROFILE`) par le mod lui-même ; un `'~/…'` cité reste littéral, comme dans une coque. La connexion appartient à la passerelle avec laquelle la session parle (`ANTHROPIC_BASE_URL`), donc elle n'est envoyée que si `SHUNT_BASE_URL` n'est pas défini ou indique la même URL de base — comparée comme chaîne après suppression des espaces et des slashes finals, donc `localhost` et `127.0.0.1` comptent comme différents — et l'utilitaire n'est même pas exécuté autrement ; pour lire le pool d'une autre passerelle, exportez `SHUNT_TOKEN` pour elle. Si cet utilitaire échoue — code non nul, aucune sortie, ou impossibilité de démarrer — la bande signale `shunt · ⚠ gateway login unavailable` et `/shunt:usage` conseille de lancer `shunt gateway login`, plutôt que d'afficher silencieusement les limites de la session.

Le jeton est réutilisé pendant cinq minutes, donc une interrogation par minute ne relance pas l'utilitaire chaque minute. Un jeton réutilisé refusé par la passerelle est supprimé et l'utilitaire appelé une fois de plus, car un rafraîchissement a pu le faire tourner. Tout autre `apiKeyHelper` — gestionnaire de mots de passe, script interactif — n'est jamais exécuté : le mod le lancerait sinon toutes les quelques minutes pour un chiffre d'usage. Dans une telle session, exportez plutôt `SHUNT_TOKEN` avec un jeton client `[server.auth]`, sinon la bande retombe sur les limites propres à la session.

La passerelle doit accepter une connexion passerelle sur `GET /usage`, ce qui exige une version de shunt qui authentifie les connexions `[server.gateway]` à cet endroit ; `[server.usage]` avec seulement `[server.gateway]` configuré suffit.

## Pourquoi `/shunt:usage` et non `/usage`

`/usage` est la commande intégrée de Claude Code, et le moteur refuse qu'un plugin prenne le nom d'une commande intégrée :

```
$.command.register: "/usage" refused: it is the built-in /usage
```

`$.command.register` prend un nom global nu. Une commande **markdown** de plugin est préfixée par le plugin : ainsi `commands/usage.md` dans un plugin nommé `shunt` figure comme `shunt:usage` et ne heurte rien. Le module de hooks intercepte alors `command.run` pour ce nom et y répond directement.

## Structure

| Chemin | Ce que c'est |
| ------ | ------------ |
| `hooks/register.tsx` | Les hooks : `command.run` sur `shunt:usage`, et `session.start`, `session.measure`, `turn.complete` et `ui.render` de la bande sur `AbovePrompt` |
| `hooks/endpoint.ts` | Résout l'URL de la passerelle et l'en-tête d'identifiant |
| `hooks/report.ts` | Lit un corps `GET /usage` de façon défensive |
| `hooks/reading.ts` | Convertit un aller-retour en rapport ou problème, complet et bref |
| `hooks/views.ts` | Affiche les barres, pourcentages et délais de réinitialisation de la commande |
| `hooks/band.ts` | Les cellules, alertes, niveaux et comptes à rebours de la bande, depuis le pool ou les limites de la session |
| `hooks/names.ts` | Le nom de la commande et les textes fixes |
| `types/index.d.ts` | Le contrat `$.state` : instantané du pool, limites de la session et horloge utilisée par la bande |
| `commands/usage.md` | La commande, et le repli sans hooks de fonction |
| `tests/*.spec.ts` | Suite Vitest sur les modules purs |
| `tests/mod/*.test.tsx` | Suite moteur sur les hooks, lancée par `claude plugin test` |

## Développement

```bash
# The static side-effect analysis: which events it hooks, which $ calls and
# environment variables it makes and reads.
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude plugin validate plugins/shunt

# The pure modules' suite and typecheck (both CI gates).
cd plugins/shunt && npm ci && npm run typecheck && npm test

# The hooks against the engine itself: the band and the command, with the
# gateway, clock and environment mocked. Needs a Claude Code binary, so CI
# does not run it.
claude plugin test plugins/shunt

# Run it from source against a live gateway.
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir plugins/shunt
```

`hooks/register.tsx` est le seul fichier de hooks qui importe `claude-code`. Sa vérification de types exige le `claude-code.d.ts` du moteur, que Claude Code écrit dans le projet d'un auteur de plugin via `/plugin-types` ; les autres modules n'importent rien du moteur, ce qui explique que la suite les couvre sans lui. Pour la même raison `tsconfig.json` exclut `hooks/register.tsx` de `npm run typecheck`, avec `tests/mod`, la suite moteur — cette exclusion est délibérée, pas un oubli, et vérifier ce seul fichier suppose de lancer d'abord `/plugin-types`.

> Les hooks de fonction sont en accès anticipé. Les modules de hooks ne se chargent que là où ils sont activés, et l'API sur laquelle ce mod est écrit peut changer entre versions de Claude Code sans préavis.

## Licence

MIT OR Apache-2.0, comme le projet shunt.
