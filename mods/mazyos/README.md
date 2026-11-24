# MazyOS : le système d'exploitation de votre entreprise dans Claude Code

> Plugin Claude Code, en français. Mémoire de votre entreprise, identité
> visuelle et 17 skills de marketing, SEO, Google Ads et prospection clients.
> Vous pilotez, Claude travaille.

Vous l'installez une fois. Ensuite, dans n'importe quel dossier qui correspond à votre entreprise,
Claude démarre la conversation en sachant qui vous êtes, comment vous parlez et ce qui
compte cette semaine. Demandez un carrousel, il sort avec votre identité. Demandez
des prospects, il cherche sur Google Maps et prépare un site de prévisualisation. Demandez
le rapport des annonces, il lit le CSV et vous montre où l'argent fuit.

C'est parti.

---

## Qu'est-ce que MazyOS

Claude Code est l'outil d'Anthropic qui exécute Claude sur votre
ordinateur, dans un de vos dossiers. MazyOS est un plugin pour lui : un ensemble de
skills (des scénarios que Claude suit) et un mod (un morceau de code qui
modifie Claude Code lui-même pendant que vous travaillez).

Ensemble, ils transforment Claude en agent IA qui connaît votre
entreprise. Concrètement :

**Il se souvient.** Trois fichiers texte dans `_memoria/` conservent l'identité de
l'entreprise, le ton et les priorités actuelles. Chaque session commence avec eux dans
le contexte. Quand vous corrigez quelque chose (« n'écris pas comme ça », « ce client
est parti »), Claude demande s'il doit enregistrer, puis le range au bon endroit.

**Il a votre visage.** `identidade/design-guide.md` conserve couleurs, polices et
logo. Carrousel, proposition, diaporama : tout sort avec la marque.

**Il fait le travail répétitif.** 17 skills prêtes à l'emploi, et une façon d'en créer
des vôtres : vous dites ce que vous répétez chaque semaine et Claude le transforme en skill.

Pas besoin de savoir programmer. Il faut savoir répondre aux questions sur votre
entreprise.

---

## Comment installer MazyOS dans Claude Code

Ouvrez Claude Code dans n'importe quel dossier et collez :

```
/plugin install mazyos --marketplace mazzeoia/MazyOS
```

Il demande s'il peut ajouter le marketplace (`y`) et dans quel périmètre.
Choisissez `user`, valable pour tous vos dossiers. Trois options
apparaissent ensuite (panneau, ligne de statut, frein sur git). Vous pouvez tout laisser
activé ; vous pourrez changer plus tard dans `/config`.

Vous préférez le terminal ? C'est la même chose :

```bash
claude plugin install mazyos --marketplace mazzeoia/MazyOS
```

Dans l'application Claude pour bureau, où `/plugin` n'existe pas : cliquez sur le `+`
à côté de la zone de texte, puis sur Plugins, Add marketplace avec
`mazzeoia/MazyOS`, puis Add plugin.

Vous n'avez pas encore Claude Code ? Il vient d'Anthropic, s'installe depuis le site
([code.claude.com](https://code.claude.com)), fonctionne sur Mac, Windows et
Linux, et nécessite un abonnement Claude payant (Pro, Max, Team) ou une
clé API.

---

## Mettre le système en place dans votre entreprise

Créez un dossier au nom de votre entreprise (ou utilisez-en un existant), ouvrez
Claude Code dedans et lancez :

```
/mazyos:instalar
```

Il crée la structure (`_memoria/`, `identidade/`, `marketing/`,
`saidas/`, `dados/`, `scripts/`) et mène un entretien d'environ cinq
minutes : ce que vous vendez, à qui, comment vous écrivez, votre goulot d'étranglement
actuel, les couleurs de la marque. Vous répondez simplement. À la fin, la mémoire est
remplie et le système vous connaît.

À lancer une seule fois. Ensuite, ouvrez Claude dans le dossier et demandez ce dont vous avez besoin.

---

## Ce qui change dans Claude Code avec MazyOS

C'est la partie « mod ». Dans un dossier MazyOS :

- **La mémoire s'injecte toute seule.** Entreprise, préférences et stratégie partent dans
  le contexte comme instructions de projet, aux côtés de `CLAUDE.md`. Si le fichier change,
  Claude reçoit la nouvelle version. Personne n'a besoin de demander une lecture.
- **Les règles viennent avec.** Lire la mémoire avant de répondre, demander avant d'enregistrer
  une correction, signaler un changement de contexte, proposer une skill pour une tâche répétée.
  Tout cela entre dans chaque session, directement depuis le plugin, sans dépendre d'un fichier
  que vous pourriez effacer par accident.
- **Panneau à côté de la conversation.** Il affiche l'entreprise, les priorités, le ton, quels
  fichiers de mémoire sont remplis et quand ils ont été mis à jour, avec des boutons raccourcis :
  ouvrir une session, actualiser la mémoire, enregistrer sur GitHub.
  Il s'ouvre seul dans un terminal large. `/mazyos` l'ouvre à tout moment.
- **Ligne de statut.** `MazyOS · Acme · foco: fechar 3 clientes` s'affiche
  sous le prompt pour ne rien perdre du fil.
- **Alerte quand la mémoire change.** Claude a modifié `estrategia.md` ? Le
  panneau et le statut se mettent à jour immédiatement et une notification apparaît.
- **Frein sur git.** `git push --force`, `git reset --hard` et compagnie ne
s'exécutent qu'après votre confirmation. S'il n'est pas possible de demander, rien ne s'exécute.

En dehors d'un dossier MazyOS, le plugin reste silencieux. Il signale simplement une fois,
par dossier, que `/mazyos:instalar` existe.

---

## MazyOS dans VS Code et Antigravity

Le même système existe aussi comme extension d'éditeur, dans le dossier [vscode/](vscode/). Elle lit la
même mémoire, propose les mêmes 17 skills et vous laisse choisir qui exécute le travail : Claude Code
(votre compte Claude), Codex (votre compte ChatGPT) ou Antigravity (votre compte Google). Chacun se
connecte via le login officiel de son propre CLI, et l'extension ne fait que préparer la demande et
montrer ce qui se passe dans une console à côté de l'éditeur. Fonctionne dans VS Code, Antigravity IDE et Cursor.

Tant qu'elle n'est pas sur le marketplace, installez-la depuis le fichier `.vsix` généré dans `vscode/` :

```
cd vscode && npm install && npm run empacotar
code --install-extension mazyos-0.1.0.vsix
```

Le reste est dans [README da extensão](vscode/README.md).

## Les skills

Ce sont 17 skills Claude Code, prêtes à l'emploi. Tapez `/mazyos:` et la
liste apparaît.

### Pour le quotidien

- `/mazyos:abrir` résume le contexte en cinq lignes et demande ce qu'on fait ensuite.
- `/mazyos:salvar` fait le commit et le push sur GitHub, même pour quelqu'un qui n'a jamais utilisé git.
- `/mazyos:atualizar` compare la mémoire avec le contenu du dossier et propose les mises à jour.
- `/mazyos:novo-projeto` crée un dossier isolé pour chaque client ou projet, avec son propre contexte.
- `/mazyos:mapear-rotinas` demande ce que vous répétez chaque semaine et crée une skill pour chaque tâche.
- `/mazyos:criacao-canonica-de-skills` crée, refactorise et audite des skills avec une méthode plus approfondie.

### Contenu et SEO

- `/mazyos:carrossel` crée un carrousel Instagram (1080×1350) à l'identité de la marque, avec ou sans image générée par IA, et prépare déjà la légende.
- `/mazyos:publicar-tema` prend un thème et livre un article de blog, un carrousel et trois légendes (Instagram, Facebook, LinkedIn), le tout cohérent.
- `/mazyos:seo` exécute le parcours SEO en 8 étapes : demande, concurrence, Google My Business, on-page, contenu, Google Ads, suivi et GEO (apparaître dans ChatGPT, Gemini et Perplexity).
- `/mazyos:responder-avaliacoes` rédige des réponses humaines aux avis Google.
- `/mazyos:aprovar-post` publie sur le blog, Instagram et Facebook en une seule commande.

### Google Ads et Meta Ads

- `/mazyos:anuncio-google` prépare toute la campagne dans un CSV prêt à importer dans Google Ads Editor.
- `/mazyos:relatorio-ads` lit les exports Google Ads et Meta Ads et rend le rapport de la semaine, avec alertes et actions à mener.

### Prospection clients

- `/mazyos:prospecta-maps` part d'une niche et d'une ville, cherche les entreprises sur Google Maps, vérifie le numéro d'entreprise auprès de l'administration fiscale, prépare un site de prévisualisation pour chaque prospect et rédige le premier message ainsi que les relances. La proposition en PDF est générée sur demande. Aucune clé API requise.

### Production

- `/mazyos:analisar-dados` lit un CSV, un tableur ou un PDF et restitue une note de synthèse.
- `/mazyos:email-profissional` rédige un e-mail à partir de ce que vous racontez.

Les skills que vous créez pour votre entreprise se trouvent dans `.claude/skills/` de votre
dossier, hors du plugin, et se lancent comme `/<nome>`.

---

## Questions fréquentes

**MazyOS est-il gratuit ?** Le plugin est ouvert et gratuit. Ce que vous payez, c'est
Claude Code : un abonnement Claude Pro, Max ou Team, ou l'API d'Anthropic.

**Faut-il savoir programmer ?** Non. Vous parlez en français et répondez
à des questions sur votre entreprise. Les commandes sont un slash et un nom.

**Fonctionne-t-il sur Windows ?** Oui. Mac, Windows et Linux, dans le terminal, dans VS
Code ou dans l'application Claude.

**Où sont mes données ?** Dans votre dossier, sur votre ordinateur. Mémoire,
identité et tout ce que le système produit sont des fichiers texte vous appartenant, que vous
pouvez ouvrir, modifier et versionner sur GitHub. Le plugin est en lecture seule et se
met à jour via `/plugin`.

**Qu'est-ce qu'un plugin Claude Code ?** Un paquet qui ajoute des skills,
des commandes et des comportements à Claude Code, installé en une ligne. MazyOS
est l'un d'eux.

**Puis-je voir ce que le plugin fait dans mon Claude ?** Oui, tout est open source
ici. `hooks/sistema.ts` contient les règles injectées dans le contexte ;
`hooks/register.tsx` contient le mod.

**J'utilisais MazyOS en clonant ce dépôt. Et maintenant ?** Installez le plugin
puis, dans le dossier de l'entreprise : supprimez `.claude/skills/` (les skills viennent du plugin ;
celles que vous avez créées peuvent rester), retirez de `CLAUDE.md` les règles générales de
MazyOS (le plugin les injecte toutes) et remplacez `/abrir` par `/mazyos:abrir` dans
vos habitudes. Mémoire, identité et productions restent telles quelles.

---

## La thèse

L'IA n'est pas un outil que votre entreprise utilise. C'est le système d'exploitation sur
lequel elle tourne.

La différence n'est pas la vitesse. C'est une capacité nouvelle : une personne avec l'IA construit
ce qui demandait autrefois toute une équipe. Chaque processus qui fonctionne aujourd'hui en boucle
ouverte (décider, exécuter, ne pas mesurer, répéter à l'aveugle) devient une boucle fermée dans
MazyOS (décider, exécuter, capturer, réinjecter, s'ajuster tout seul).

Le système ne vous remplace pas. Il devient une partie de votre entreprise.

---

## Pour ceux qui veulent toucher au code

Ce dépôt est à la fois le plugin et le marketplace.

```
.claude-plugin/   plugin.json e marketplace.json
hooks/            register.tsx (o mod), memoria.ts (lê o workspace), sistema.ts (as regras)
types/            contrato do estado do mod
tests/            testes do mod
skills/           as 17 skills
templates/        perfis de CLAUDE.md, catálogos e o esqueleto do workspace
```

```bash
claude plugin validate .     # manifesto, marketplace e hooks
claude plugin test .         # testes do mod
claude --plugin-dir .        # numa pasta de negócio, carrega este checkout
```

---

[mazyos.com.br](https://mazyos.com.br)