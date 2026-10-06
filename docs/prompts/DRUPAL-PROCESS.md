# Journal d'exécution — Front SDC / Tailwind v4 / Paragraphs

Ce document retrace, en français, tout le processus exécuté pour réaliser
la mission décrite dans [`DRUPAL.md`](./DRUPAL.md) : pipeline Vite/Tailwind
v4, composants Single Directory Components (SDC), page builder Paragraphs /
Layout Paragraphs multilingue. Il ne remplace pas `DRUPAL.md` (la
commande d'origine) mais documente comment elle a été réalisée, y compris
les bugs réels trouvés en cours de route et comment ils ont été corrigés.

## 0. État de départ

Le thème `web/themes/custom/tailwind` existait déjà (Vite, Tailwind v4,
HMR via un module custom `tailwind_hmr`), mais sans SDC, avec des tokens
non sémantiques (`--color-black`, `--color-dark-grey`...), du `@apply`
hors contexte prose, et une dépendance jQuery inutilisée. `config/sync`
ne contenait qu'un type de contenu `page` minimal, sans Paragraphs, sans
multilingue.

## 1. Pipeline de build

- Renommage de l'entrée CSS `src/css/tailwind.css` → `src/css/main.css`.
- Ajout de `enforce_prop_schemas: true` dans `tailwind.info.yml`.
- `@source` explicites dans `main.css` pour `components/`, `layouts/` et
  `templates/` (le scan automatique de Tailwind v4 ne couvre pas
  `components/` qui vit hors de `src/`).
- `vite.config.mjs` : point d'entrée `rollupOptions.input` basculé sur
  `main.css`.
- Suppression de jQuery : `theme.js` réécrit en vanilla JS
  (`Drupal.behaviors`), dépendances `core/jquery`, `core/js-cookie`,
  `core/drupal.ajax` retirées de `tailwind.libraries.yml`.
- Ajout de `@tailwindcss/typography`, `eslint`, `ajv`, `js-yaml` en
  devDependencies ; scripts `lint:components`, `lint:js`,
  `prettier:check`.
- Script maison `plugins/validate-components.mjs` : valide chaque
  `*.component.yml` (présence de `name`/`status`/`props.properties`,
  cohérence `enum`/`default`, présence du `.twig` et du `README.md`
  associés).

## 2. Design tokens

Bloc `@theme` de `main.css` entièrement réécrit en tokens sémantiques :
`--color-primary(-hover)`, `--color-secondary(-hover)`,
`--color-surface(-alt/-inverse)`, `--color-text(-muted/-inverse)`,
`--color-border(-strong)`, `--color-success/warning/danger/info(-surface)`,
plus `--radius-*` et `--spacing-section`. Ancien fichier
`components.css` (utilitaires `@apply` type `btn-primary`, `h1-title`)
supprimé — remplacé par les composants `button` et `heading`.
Preflight documenté dans `src/css/base/base.css` (stratégie de restylage
des modules contrib).

## 3. Composants SDC livrés (12)

| Composant | Type | Rôle |
|---|---|---|
| `button` | atom | `<a>`/`<button>`, variants primary/secondary/ghost |
| `heading` | atom | niveau sémantique (1-6) découplé de la taille visuelle |
| `badge` | atom | indicateur statique |
| `tag` | atom | chip interactif, optionnellement supprimable |
| `icon` | atom | sprite SVG (`src/icons/sprite.svg`) |
| `card` | molecule | slots image/title/content/footer, horizontal/vertical |
| `accordion-item` | molecule | `<details>/<summary>` natif, sans JS |
| `hero` | organism | bannière page (titre/sous-titre/média/CTA) |
| `cards-grid` | organism | grille 2/3/4 colonnes |
| `cta-banner` | organism | bloc CTA |
| `accordion` | organism | wrapper divide-y d'accordion-item |
| `embed` | organism | contenu tiers (vidéo, réseau social) |

Chaque composant a son `component.yml` (JSON Schema complet) et son
`README.md` avec exemple d'usage réel. `templates/content/page-title.html.twig`
et `templates/content/node--article--teaser.html.twig` consomment ces
composants comme exemples d'intégration.

## 4. Paragraphs — page builder multilingue

9 types de paragraphe créés, chacun mappé 1:1 sur un composant :
`hero`, `text_media`, `card`, `cards_grid`, `cta_banner`, `accordion`,
`accordion_item`, `embed`, `section` (layouts 1/2/3 colonnes déclarés
dans `tailwind.layouts.yml` + templates `layouts/*/layout--*.html.twig`).

**Architecture de traduction symétrique** (non négociable, cf. mission
7a) : `field_sections` sur le node ET les champs
`entity_reference_revisions` internes aux paragraphes (`field_cards`,
`field_items`) sont `translatable: false` au niveau du *storage* (pas
seulement de l'instance) pour verrouiller la règle définitivement. Les
champs de contenu (texte, média, lien) sont traduisibles ; les champs de
configuration (`field_variant`, `field_position`) ne le sont jamais.

**Synchronisation SDC ↔ config** : un seul champ `field_variant`
(list_string) est partagé entre `hero`, `cta_banner` et `cards_grid`,
avec un callback `allowed_values_function` (module custom
`tailwind_components`) qui retourne les valeurs selon le bundle — la
source de vérité reste le `props.*.enum` du `component.yml`
correspondant, jamais dupliquée en dur dans la config de champ.

**Garde-fou éditorial** : maximum 1 hero par page, implémenté en
validateur de formulaire (`tailwind_components_max_one_hero_validate()`)
plutôt qu'en cardinalité de champ (impossible de limiter par *bundle*
avec une cardinalité classique).

## 5. Multilingue

`language.entity.fr.yml` / `.en.yml`, `language.negotiation.yml` (URL
uniquement, préfixes `/fr` `/en`, pas de négociation navigateur),
`language.types.yml` (seule la méthode `language-url` activée),
`content_translation` activé sur `node.page`, `node.article`,
`media.image` et les 9 bundles de paragraphe via des entités
`language.content_settings.*.yml`.

## 6. Qualité / CI

`.github/workflows/theme-frontend.yml` : `npm ci`, validation des
schémas de composants, ESLint, Prettier, build, puis échec si
`dist/css/main.css` dépasse 50 Ko gzippé (mesuré à l'exécution, pas une
valeur en dur).

## 7. Vérification réelle — `composer install` + `drush site:install`

À la demande explicite de l'utilisateur, la théorie a été confrontée à
un vrai Drupal 11 démarré via `make start` (Colima + Docker Compose) :
`.env` recréé depuis `.env.example` (absent du disque), lock file
composer mis à jour (`composer update drupal/layout_paragraphs
--with-all-dependencies --no-blocking` — nécessaire car le lock d'origine
était bloqué par le nouveau policy d'audit de sécurité de Composer sur
des versions déjà vulnérables de `drupal/admin_toolbar`/`drupal/core`),
puis `drush site:install --existing-config -y`.

Cinq bugs réels ont été trouvés et corrigés grâce à cette vérification
(aucun n'aurait été détecté par une simple relecture du code) :

1. **Module `options` non activé** — les champs `list_string`
   (`field_variant`, `field_position`) échouaient à l'import (514
   erreurs "Unable to determine class for field type"). Corrigé en
   ajoutant `options` à `core.extension.yml`.
2. **Format YAML de `allowed_values` incorrect** — Drupal attend une
   *séquence* `[{value, label}, ...]`, pas un mapping `{value: label}`.
   Provoquait un `TypeError` fatal dans
   `ListItemBase::simplifyAllowedValues()`.
3. **Un `{% embed %}` imbriqué dans le propre template d'un composant
   casse la validation de slots** — le validateur SDC de Drupal
   (`ComponentNodeVisitor`) recense *tous* les `{% block %}` présents
   dans le fichier compilé d'un composant, y compris ceux d'un embed
   imbriqué d'un *autre* composant, et les vérifie contre les slots
   déclarés du composant englobant. `hero.twig` embedait `heading` avec
   un bloc `content`, alors que `hero` n'a pas de slot `content` → échec
   de compilation Twig. Corrigé en extrayant ces embeds imbriqués dans
   des fichiers séparés (`templates/includes/heading.html.twig`,
   `templates/includes/cta-button.html.twig`).
4. **Mauvaise syntaxe de slot dans les 12 composants** — tous les
   composants utilisaient `{{ nom_du_slot }}` (interpolation de
   variable) au lieu de `{% block nom_du_slot %}{% endblock %}`
   (mécanisme natif de blocs Twig, seul qui fonctionne réellement pour
   les slots SDC — confirmé en comparant avec les composants d'exemple
   du core, `demo_umami`). Corrigé partout ; les slots optionnels
   utilisent désormais un `{% set %}...{% endset %}` pour capturer le
   bloc et tester sa présence (`|trim`).
5. **Aucun affichage (view/form display) généré pour les 9 bundles de
   paragraphe** — contrairement à un champ créé via l'UI, un champ créé
   par import de configuration n'est pas ajouté automatiquement à un
   affichage. Corrigé en générant les 18 affichages (vue + formulaire)
   programmatiquement via `drush php:eval`, en utilisant le
   `default_formatter`/`default_widget` réel de chaque type de champ
   (puis correction manuelle de `field_media` : `entity_reference_label`
   par défaut remplacé par `media_thumbnail`).

Un warning PHP résiduel, non lié à ce projet, subsiste dans les logs :
`LanguageBlock::getDerivativeDefinitions()` accède à une clé `name`
absente pour le type `language_url` dans les valeurs par défaut du
*core* Drupal lui-même (confirmé en lisant
`LanguageManager::getDefinedLanguageTypesInfo()`) — un vrai bug upstream,
sans impact fonctionnel, qui apparaît dès qu'on active la négociation
URL (ce que la mission demande).

Après ces corrections : import de configuration propre (0 erreur),
rendu d'une page réelle (hero + cards_grid + cta_banner) en `/fr/`,
0 exception/warning Twig, taille CSS compilée 30,30 Ko (5,90 Ko gzippé,
budget 50 Ko).

## 8. Limites connues / à vérifier avant mise en production

- `paragraphs.paragraphs_type.section.yml`
  (`behavior_plugins.layout_paragraphs`) et
  `core.entity_form_display.node.page.default.yml` (widget
  `layout_paragraphs` de `field_sections`) sont des reconstitutions au
  mieux des réglages spécifiques au module contrib Layout Paragraphs —
  à reconcilier via `drush config:export --diff` après configuration une
  fois via l'UI, comme le prescrit déjà `.claude/CLAUDE.md`.
- Aucun format de texte riche (`basic_html`, `full_html`) n'est
  configuré (le profil `minimal` ne fournit que `plain_text`) : les
  champs `text_long`/`text_with_summary` et le paragraphe `embed`
  n'ont donc rien à afficher tant qu'un format n'est pas ajouté à
  `config/sync`.
- `tailwind_components_max_one_hero_validate()` suppose la forme de
  valeur du widget Paragraphs classique ; à vérifier contre la structure
  réellement exposée par le widget Layout Paragraphs 2.x.

## 9. Storybook (galerie de composants isolés)

Installé sur demande, avec [`storybook-addon-sdc`](https://github.com/iberdinsky-skilld/sdc-addon) :
auto-découvre les `*.component.yml`, génère un contrôle par prop, et
rend le composant avec un **vrai moteur Twig** (pas une réécriture en
JS/React) — le but étant que ce qui se voit dans Storybook soit ce qui
se rend dans Drupal.

Trois problèmes réels rencontrés en le branchant sur nos composants,
tous confirmés en lisant le code source installé (la doc de l'addon ne
suffisait pas) :

1. **Deux tables de namespaces indépendantes** — la résolution `tailwind:nom`
   (découverte SDC propre à l'addon) et l'alias brut `@tailwind` (utilisé par
   le compilateur Twig sous-jacent pour nos `templates/includes/*.html.twig`,
   voir section 7 point 3) pointent toutes les deux par défaut vers
   `components/`, et rien dans la config exposée par l'addon ne permet de
   changer la seconde indépendamment. Plutôt que dépendre d'un
   comportement non documenté, `.storybook/main.js` miroir ces deux
   fichiers vers `components/includes/` à chaque lancement ;
   `templates/includes/` reste la source de vérité que Drupal lit.
2. **Moteur Twig.js incompatible avec nos slots** — en lisant le code
   source de l'addon (`renderStory` dans `dist/preset.js`), les slots
   sont injectés comme de simples variables de contexte
   (`ctx[nomDuSlot] = valeur; env.render(id, ctx)`), jamais via un
   override de bloc Twig. Nos composants, eux, consomment leurs slots
   via `{% block nom %}{% endblock %}` (seule syntaxe qui fonctionne
   dans le vrai Drupal, cf. section 7 point 4) — un bloc vide ignore
   totalement cette variable de contexte. Solution : donner à chaque
   bloc un corps par défaut `{{ nom|default('') }}`. Le mécanisme
   d'override de Drupal ne l'exécute jamais (remplacé entièrement) ;
   Storybook, qui ne fait justement *pas* d'override, l'exécute et
   récupère la variable injectée. Un seul template sert donc aux deux
   moteurs. (Twing a aussi été testé à la place de Twig.js en espérant
   un meilleur support d'`{% embed %}`/`{% block %}` — même résultat :
   le mécanisme de rendu de l'addon est la cause, pas le moteur Twig.)
3. **`active_theme_path()` intégré à l'addon, non substituable** —
   l'addon embarque son propre polyfill (`@christianwiedemann/drupal-twig-extensions`)
   qui préfixe en dur `core/themes/stark/...`, sans option exposée pour
   le remplacer côté Twing dans cette version. Contourné en servant
   aussi `dist/` à ce chemin (`staticDirs` dans `.storybook/main.js`)
   plutôt qu'en cherchant à gagner la course d'enregistrement des
   fonctions Twig.

Bonus découvert en cours de route (pas lié à Storybook, un vrai bug de
composant) : `tag.twig` et `accordion-item.twig` incluaient
`tailwind:icon` sans `only`, donc l'objet `attributes` du composant
parent fuitait dans l'icône (et inversement) dès que Twig respecte
fidèlement l'héritage de contexte des `{% include %}` — ce que Twing
fait plus strictement que ce qu'on avait vérifié en Drupal réel. Corrigé
sur les deux fichiers.

## 10. Commandes utiles pour rejouer la vérification

```bash
cp .env.example .env   # si absent
make start              # colima + docker compose up -d
make composer-install
make install             # drush site:install --existing-config -y
docker compose -f docker/docker-compose.yml --project-directory . exec php vendor/bin/drush cache:rebuild
```

Front du thème seul (sans Drupal) :

```bash
cd web/themes/custom/tailwind
npm install
npm run lint:components && npm run lint:js && npm run prettier:check
npm run build
```
