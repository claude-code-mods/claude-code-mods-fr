<h1 align="center">compact-adviser</h1>

<p align="center">
  <a href="https://github.com/kunchenguid/compact-adviser/blob/main/LICENSE"
    ><img
      alt="Licence"
      src="https://img.shields.io/badge/license-MIT-green?style=flat-square"
  /></a>
  <a
    href="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue?style=flat-square"
    ><img
      alt="Plateforme"
      src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue?style=flat-square"
  /></a>
  <a href="https://x.com/kunchenguid"
    ><img
      alt="X"
      src="https://img.shields.io/badge/X-@kunchenguid-black?style=flat-square"
  /></a>
  <a href="https://discord.gg/Wsy2NpnZDu"
    ><img
      alt="Discord"
      src="https://img.shields.io/discord/1439901831038763092?style=flat-square&label=discord"
  /></a>
</p>

**compact-adviser** est un plugin agent qui répond à une seule question : faut-il lancer /compact maintenant ?

![Compact adviser status line: "Compact adviser: work appears completed or recorded. Run /compact to save tokens." shown above a terminal prompt](https://raw.githubusercontent.com/kunchenguid/compact-adviser/main/docs/hint-status-line.png)

Il utilise [Jev](https://typesafe.ai) pour juger immédiatement si la session actuelle se trouve probablement à une frontière où la compaction est sûre.

Il peut vous suggérer de lancer `/compact` — ou, sur Pi et Claude Code, si vous l'activez, il peut le lancer automatiquement au bon moment. Codex CLI et Grok sont en mode suggestion seulement : rien hors de leur session ne peut déclencher `/compact`.

Le jugement repose sur deux questions Jev d'une phrase chacune, en une seule requête (l'unité de travail est-elle terminée ; s'agit-il de travail concret ou de coordination), combinées en code en un seul score. Le plancher de suggestion est de 0,90 quand le contexte est presque vide (jusqu'à environ 10 %) et descend vers 0,50 vers 90 % de remplissage — une mauvaise suggestion coûte le plus quand il reste encore de la place. « Plein » désigne le point où l'hôte compacte : sur Claude Code, son seuil de compaction automatique si activé, sinon la fenêtre du modèle. Si vous préférez compacter bien avant (les longs contextes coûtent plus cher à chaque tour), définissez un budget de contexte : le plancher alors s'assouplira en approchant le plus petit de votre budget et de ce point. Le mode automatique utilise la même porte, plus une confirmation à la première utilisation.

## Démarrage rapide

Prérequis : Node 22+ (22.18+ pour Codex et Grok), et l'un de [Pi](https://pi.dev) 0.82.0 ou supérieur (vérifié sur **0.85.1**), Claude Code 2.1.274 ou supérieur (vérifié sur **2.1.275**), Codex CLI 0.153.0 ou supérieur (vérifié sur **0.153.4**), ou [Grok Build](https://docs.x.ai/build/overview) 1.0.34 ou supérieur (vérifié sur **1.0.34**), ainsi qu'une [TypeSafe API key](https://console.typesafe.ai/settings/keys). Fournissez-la comme `TYPESAFE_API_KEY` dans l'environnement de lancement ou placez-la dans le `./.env` du répertoire courant ; Pi et Claude Code peuvent aussi l'enregistrer dans leurs paramètres, tandis que Codex et Grok utilisent une CLI compact-adviser externe. Jev est le modèle de décision structuré de TypeSafe ; ce paquet lui pose deux questions de classification d'une phrase et ne lui demande jamais d'écrire un résumé.

Installer le paquet revient à consentir à l'envoi du contexte de point de contrôle éligible à TypeSafe lorsqu'une clé est disponible et que les autres conditions sont réunies. Avec `TYPESAFE_BASE` défini, ce contexte et la clé partent vers cette base à la place.

### Pi

```sh
pi install npm:compact-adviser
```

Redémarrez Pi ou lancez `/reload`, puis `/compact-adviser`.
`/compact-adviser status` doit afficher `Key: env`, `Key: saved` ou `Key: .env`.

Pour installer depuis git : `pi install git:github.com/kunchenguid/compact-adviser` (ajoutez `-l` pour une installation locale au projet).

### Claude Code

Ce plugin utilise Claude Mod, une fonctionnalité expérimentale qui exige `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` dans votre environnement.

```sh
claude plugin marketplace add kunchenguid/compact-adviser
claude plugin install compact-adviser@compact-adviser
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude
```

Puis `/compact-adviser`.

### Codex CLI

La prise en charge de Codex est **limitée à macOS et Linux**. Les hooks du plugin passent par POSIX `sh`, conformément au badge de plateforme de ce dépôt ; Windows n'est pas pris en charge dans cette version.

```sh
codex plugin marketplace add kunchenguid/compact-adviser
codex plugin add compact-adviser@compact-adviser
```

Redémarrez Codex et examinez une fois le hook dans `/hooks` pour l'approuver. Après un point de contrôle terminé, le conseil apparaît comme une ligne `↳ Hook · Compact adviser: ...` sous la réponse.

Codex est en **mode suggestion** : aucune surface ne permet à un autre processus de lancer `/compact`, donc pas de mode automatique. Les paramètres passent par une petite CLI au lieu d'une commande slash ; demandez à Codex « compact-adviser status » et la compétence fournie l'exécutera, ou lancez-la vous-même :

```sh
node "$(ls -d "${CODEX_HOME:-$HOME/.codex}"/plugins/cache/*/compact-adviser/*/ | tail -1)src/cli.ts" status
```

### Grok Build

Grok est en **mode suggestion** : rien hors d'une session active ne peut déclencher `/compact`, donc pas de mode automatique ici. La suggestion est affichée sur la ligne d'état et n'entre jamais dans le contexte du modèle.

```sh
grok plugin install kunchenguid/compact-adviser#packages/grok-plugin --trust
```

(Installez depuis le sous-répertoire, et non depuis la racine du dépôt : Grok lit aussi l'index du marketplace Claude de ce dépôt, donc un `grok plugin marketplace add` simple propose deux plugins du même nom et refuse une installation sans qualification.)

Puis deux étapes uniques, car Grok ne laisse pas un plugin les faire à votre place. Démarrez Grok et lancez :

```
/compact-adviser-install
```

Cela écrit `${GROK_HOME:-~/.grok}/hooks/compact-adviser.json`, car **Grok 1.0.34 répertorie le `hooks/hooks.json` d'un plugin mais ne le charge jamais dans une session**. Les hooks de votre propre répertoire Grok sont toujours approuvés ; rien d'autre n'est nécessaire. Supprimez ce fichier pour les retirer. Depuis un shell, c'est `node "$(node -e 'const l=JSON.parse(require("child_process").execFileSync("grok",["plugin","list","--json"],{encoding:"utf8"})); const p=(Array.isArray(l)?l:[]).find(x=>x&&x.name==="compact-adviser"); if(!p||typeof p.path!=="string") throw new Error("compact-adviser is not installed"); process.stdout.write(p.path)')/bin/adviser.ts" install`. Après `install`, `${GROK_HOME:-~/.grok}/compact-adviser/adviser.sh` résout le plugin actuellement installé de la même façon.

Puis collez le bloc `[ui.status_line]` affiché par `install` dans le chemin config.toml qu'il a indiqué et redémarrez Grok. La ligne d'état est désactivée par défaut ; seul votre propre configuration peut l'activer — ni un plugin ni un dépôt ne le peuvent. Grok n'a qu'une ligne d'état, donc ce script affiche aussi les segments intégrés (`cwd`, `model`, `context`). En mode de rendu minimal, il n'y a pas du tout de ligne d'état.

Sur Grok, enregistrez la clé TypeSafe comme `TYPESAFE_API_KEY` ou dans un `.env` du répertoire courant, ou avec la commande CLI `key` depuis un shell hors de Grok. Ne tapez pas de secrets après une commande slash Grok : Grok ajoute ces mots au modèle.

## Si rien ne se passe

| Symptôme | Cause |
| --- | --- |
| TypeSafe exige un paiement (HTTP 402) | Vérifiez la facturation et les crédits du compte TypeSafe ; attendre ne lèvera pas une exigence de paiement. Le contexte reste inchangé. |
| `Key: missing` dans `/compact-adviser status` (Pi, Claude Code) ou `/compact-adviser` (Grok) | Aucune `TYPESAFE_API_KEY` dans l'environnement de lancement, les paramètres enregistrés ou le `./.env` du répertoire courant |
| Aucune commande `/compact-adviser` dans Claude Code | `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` n'est pas exactement `1` |
| Commande présente, aucune suggestion | Le contexte est sous le minimum fixe de 40 000 jetons, la session n'est pas inactive, ou le dernier tour n'était pas une réponse finale arrêtée |
| Claude Code : « trafic non essentiel » | `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` bloque les requêtes réseau du plugin |
| Aucune suggestion dans Codex | Le hook n'est pas approuvé (à revoir dans `/hooks`), Node est antérieur à 22.18, ou le hook ne trouve pas Node — Codex reconstruit son PATH, donc définissez `COMPACT_ADVISER_NODE` comme chemin `node` absolu |
| Grok : aucune ligne de suggestion | `[ui.status_line]` n'est pas défini dans le `config.toml` `install` indiqué, ou Grok est en mode de rendu minimal |
| Grok : aucune suggestion après un tour terminé | `/compact-adviser-install` n'a pas été exécuté, donc aucun hook Stop ne juge |
| Sortie Pi / RPC / JSON, `-p` Claude ou `codex exec` | Le conseiller reste inerte dans les sessions non interactives détectées de façon fiable |
| Rien du tout, quel que soit l'hôte | `COMPACT_ADVISER_DISABLE` est défini à une valeur vraie |

## Variables d'environnement

| Variable | Effet |
| --- | --- |
| `TYPESAFE_API_KEY` | La clé Jev ; une clé enregistrée ou le `./.env` du répertoire courant est utilisée si elle n'est pas définie |
| `TYPESAFE_BASE` | Remplace l'URL de base de l'API TypeSafe, `https://api.typesafe.ai` par défaut ; la requête part vers `<base>/v1/systemone` avec le slash final supprimé. Lu uniquement dans l'environnement de lancement, jamais dans un paramètre enregistré ni dans `./.env`. Ce doit être une URL `https` ; `http` simple n'est accepté que pour un hôte de bouclage (`127.0.0.1`, `[::1]`, `localhost`). Toute autre valeur, ou une valeur contenant des identifiants, une requête ou un fragment, est une erreur de configuration : aucune requête et aucun conseil |
| `COMPACT_ADVISER_DISABLE` | `1`, `true`, `yes` ou `on` (quelle que soit la casse) rend la session inerte : aucune requête TypeSafe, aucune suggestion, aucune compaction automatique, aucune commande. Cela prévaut sur un `hint` ou un mode `auto` enregistré |
| `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` | Claude Code uniquement ; doit être exactement `1` pour que le mod se charge |
| `COMPACT_ADVISER_NODE` | Codex uniquement ; chemin absolu vers un exécutable Node 22.18 ou supérieur quand le hook ne peut pas en trouver un sur son PATH reconstruit |

Définissez `COMPACT_ADVISER_DISABLE=1` pour les sessions d'agent sans surveillance, où personne ne lira les conseils.

## Ce qui est envoyé à TypeSafe

| Inclus | Non envoyé |
| --- | --- |
| Contraintes utilisateur bornées, jusqu'aux 64 dernières réponses et résultats d'outils visibles (rognés), courts extraits de résultats d'outils, résumé existant, noms d'artefacts enregistrés, marqueurs d'omission | Prompts système, raisonnement caché, images, variables d'environnement, clé API dans le contexte du modèle et le corps de requête, transcriptions complètes |
| Masquage au mieux des motifs de clé connus et des résultats évidents de fichiers sensibles | Une garantie. Désinstallez ou passez en mode Off pour tout contenu qui ne doit pas quitter la machine |

Les requêtes vont vers `https://api.typesafe.ai/v1/systemone`, ou `<TYPESAFE_BASE>/v1/systemone` si défini, sont plafonnées à 32 000 octets UTF-8 sérialisés, et ne considèrent jamais une erreur comme un jugement positif.
La clé API TypeSafe n'entre jamais dans le contexte du modèle ni dans le corps de la requête ; elle est envoyée comme en-tête Authorization pour authentifier l'appel.
Détails : [SECURITY.md](https://github.com/kunchenguid/compact-adviser/blob/main/SECURITY.md).

## Fonctionnement

```
settled turn
      │
      ▼
┌───────────────────┐
│ cheap local gates │  mode, 40k minimum, idle session, key, cooldowns
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ TypeSafe Jev      │  done × shape score, floor slides 0.90→0.50 with usage
└─────────┬─────────┘
          ▼
 hint: run /compact     or, with explicit auto, native compaction
```

La compaction automatique est disponible sur Pi et Claude Code. Sur Codex, le même jugement ne produit que la suggestion, sous forme d'une ligne `↳ Hook ·` dans l'historique. Sur Grok, les deux moitiés sont des processus distincts : un hook `Stop` juge et enregistre un verdict, et le script `[ui.status_line]` lit ce verdict et affiche la suggestion. Le hook Grok autorise toujours l'arrêt et n'imprime rien, donc une suggestion ne peut jamais être réinjectée dans le modèle.

Sur Claude Code, un réglage `beforeCompactPrompt` facultatif (vide par défaut ; à définir dans `/config`) s'exécute un tour avant cette compaction automatique, et seulement après confirmation du mode auto. Définissez-le sur `/stow` pour exécuter d'abord la commande `stow` Claude Code ne développe pas les commandes slash ni les mentions `@file` dans un prompt soumis par un plugin, et refuse un prompt de plugin commençant par `/` : une valeur commençant par `/` est donc exécutée comme commande au lieu d'être envoyée au modèle comme texte. Si vous envoyez votre propre prompt ou lancez une commande entre-temps, ou si ce tour est interrompu, erreur, ou ne se termine pas dans les 5 minutes, rien n'est compacté. Le mode suggestion, le mode désactivé et un réglage vide restent inchangés. Pi, Codex et Grok n'ont pas ce réglage.

## Utilisation

| Commande | Effet |
| --- | --- |
| `/compact-adviser` (Pi et Claude Code) | Paramètres (mode, minimum, journal des requêtes, clé API TypeSafe) |
| `/compact-adviser auto` / `hint` / `off` (Pi et Claude Code) | Enregistre ce mode ; auto demande confirmation à la première utilisation |
| `/compact-adviser status` (Pi et Claude Code) | Mode, minimum, budget, contexte, source de clé (`env` / `saved` / `.env` / `missing`), délai de grâce |
| `/compact-adviser threshold 60000` (Pi et Claude Code) | Enregistre un minimum absolu de jetons |
| `/compact-adviser budget 450000` / `budget off` (Pi et Claude Code) | Enregistre un budget de contexte : le plancher de suggestion est totalement assoupli à ce nombre de jetons, ou au point de compaction de l'hôte s'il est plus petit (désactivé par défaut) |
| `/compact-adviser snooze` / `dismiss` (Pi et Claude Code) | Ignore les trois prochains échanges, ou efface la suggestion courante |
| `beforeCompactPrompt` dans `/config` (Claude Code) | Texte facultatif exécuté avant la compaction automatique. Vide par défaut. `/stow` exécute cette commande |
| `/compact-adviser` (Grok) | Affiche le statut ; n'ajoutez pas d'arguments, Grok les enverrait au modèle |
| `/compact-adviser-hint` / `/compact-adviser-off` (Grok) | Enregistre le mode suggestion seule, ou désactive le conseiller |
| `/compact-adviser-snooze` / `/compact-adviser-dismiss` (Grok) | Ignore les trois prochains échanges, ou efface la suggestion courante |
| `/compact-adviser-install` (Grok) | Enregistre les hooks et affiche le bloc de ligne d'état à coller dans le `config.toml` indiqué |
| `${GROK_HOME:-$HOME/.grok}/compact-adviser/adviser.sh threshold 60000` (coque Grok) | Enregistre un minimum absolu de jetons ; `budget <tokens\|off>` enregistre un budget de contexte ; `help` liste les autres paramètres propres à la coque |

Sur Codex, les mêmes commandes sont des arguments de la `src/cli.ts` du plugin (`status`, `hint`, `off`, `threshold`, `budget <tokens|off>`, `log on|off`, `key set|clear|status`) plutôt qu'une commande slash, car les plugins Codex ne peuvent pas enregistrer de commande avec du code derrière. Codex n'a ni report ni fermeture : la CLI ne peut pas savoir quelle session est courante.

## Profils de jugement

Un [judge profile](https://github.com/kunchenguid/compact-adviser/blob/main/docs/judge-profiles.md) facultatif modifie les deux questions, le poids du score ou la courbe du plancher sans toucher aux valeurs par défaut. Les quatre hôtes acceptent la même chaîne JSON bornée dans le paramètre `profile`. Gardez le mode suggestion pendant l'évaluation d'un profil. Un profil invalide désactive les conseils, et charger un profil n'accorde jamais le consentement au mode automatique.

## Évaluation

L'évaluation locale du jugement utilise de vrais points de contrôle de session pour noter quand le conseiller devrait suggérer `/compact`. La courbe ci-dessous vient d'un jeu de référence tenant compte des suites (96 points de contrôle, 40 sessions) : à mesure que la fenêtre de contexte se remplit, le seuil passe de **0,90** (≤10 % utilisés) à **0,50** (≥90 % utilisés), pour faire **monter le rappel** tout en gardant une précision élevée — on privilégie l'économie de jetons quand la compaction va de toute façon être forcée.

![Use Jev to answer "should I /compact now?" — precision stays high while recall rises as context used goes from ≤10% to ≥90%](https://raw.githubusercontent.com/kunchenguid/compact-adviser/main/docs/eval-usage-floor-curve.png)

Le harnais d'évaluation du jugement se trouve dans [packages/pi-extension/eval/](https://github.com/kunchenguid/compact-adviser/blob/main/packages/pi-extension/eval/README.md). Ce n'est pas un jeu de données publié : pointez-le vers vos propres sessions et gardez les transcriptions localement.
