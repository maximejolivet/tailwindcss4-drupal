# Contexte
Tu interviens sur un projet Drupal 11 (thème custom basé sur Starterkit).
Objectif : industrialiser le front avec des composants réutilisables via
Single Directory Components (SDC) stylés avec Tailwind CSS v4, consommés
par un page builder éditorial Paragraphs / Layout Paragraphs, sur un site
multilingue FR/EN. Finalité agence : réduire la duplication Twig,
fiabiliser les livraisons multi-projets, préparer une migration future
vers Drupal Canvas sans réécriture (les SDC sont le socle commun).

# Mission

## 1. Pipeline de build
Configure Vite à la racine du thème :
- Tailwind v4 via `@tailwindcss/vite`
- entrée unique `src/css/main.css` avec `@import "tailwindcss";`
- sources scannées : `templates/**/*.twig`, `components/**/*.twig`,
  `components/**/*.js` (directive `@source` si la détection automatique
  est incomplète)
- scripts `npm run build` (prod, minifié) et `npm run dev` (watch)
- la library Drupal du thème pointe vers `dist/`

## 2. Design tokens
Tout dans le bloc `@theme` de `main.css` : couleurs sémantiques
(--color-primary/surface/etc.), spacing, fonts, radius. Aucune valeur
arbitraire `[...]` dans les composants sauf justification en commentaire.
Les tokens sont le seul point de personnalisation entre projets de
l'agence.

## 3. Structure SDC
`components/` avec 01-atoms, 02-molecules, 03-organisms. Chaque
composant : `*.component.yml`, `*.twig`, `README.md`. Pas de fichier CSS
par composant sauf cas irréductible (animations complexes) — le style
vit dans les classes Tailwind du Twig.

## 4. Composants de départ (props typées + slots)
- button : variants primary/secondary/ghost, sizes sm/md/lg, prop url
  (rend `<a>` ou `<button>`), prop disabled
- card : slots image/title/content/footer, variant horizontal
- heading : prop level (1-6, sémantique) découplée de prop size (visuel)
- badge, tag, icon (sprite SVG)
- hero (organism) : title, subtitle, media, cta

Chaque `.component.yml` DOIT déclarer `props` en JSON Schema complet
(type, enum pour les variants, default) et `slots` documentés. Active
`enforce_prop_schemas: true` dans le thème. Chaque composant doit être
rendable isolément (aucune dépendance au contexte de page ni aux entités
Drupal).

## 5. Pattern de variants dans le Twig
Mapping via un objet Twig, jamais de concaténation dynamique de classes
(la détection Tailwind ne verrait pas `bg-{{ color }}`) :

```twig
{% set variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-transparent border border-primary text-primary',
} %}
<button {{ attributes.addClass('inline-flex items-center rounded-md',
  variants[variant|default('primary')], sizes[size|default('md')]) }}>
```

## 6. Intégration Drupal
- consommation via `{% include 'themename:button' %}` et `{% embed %}`
- un template `node--article--teaser.html.twig` mappé sur card
- contenu WYSIWYG : `@tailwindcss/typography` avec classe `prose` sur
  les champs body (seul endroit où `@apply` est toléré, dans main.css)
- Preflight activé : documente le reset des styles injectés par les
  modules contrib et la stratégie de restylage

## 7. Page builder avec Paragraphs (multilingue)
Modules : paragraphs, layout_paragraphs, entity_reference_revisions,
content_translation, language.

### a. Architecture de traduction — SYMÉTRIQUE, non négociable
- le champ entity reference revisions `field_sections` sur le node est
  NON traduisible (décoché dans la config de traduction)
- les paragraph types sont traduisibles champ par champ : champs
  texte/media traduisibles, champs de config (variant, layout) NON
  traduisibles pour garder la même structure entre langues
- documente pourquoi : en asymétrique, chaque langue a ses propres
  paragraphes → duplication, widgets buggés, désynchronisation
  éditoriale. On ne le fait pas.
- test : traduire un node FR→EN doit proposer la traduction de chaque
  paragraphe existant, pas des paragraphes vides

### b. Paragraph types (chacun mappé sur un composant SDC)
- hero → organism hero
- text_media (body, media, position gauche/droite) → card horizontal
- cards_grid (référence des paragraphes card enfants)
- cta_banner, accordion, embed
- un champ `field_variant` (list_string, valeurs = enum du component.yml
  correspondant) sur les types qui ont des variants ; la source de
  vérité reste le schéma SDC — mentionne dans le README l'option
  d'un callback allowed_values pour synchroniser

### c. Templates paragraph = mapping pur
`paragraph--hero.html.twig` fait UNIQUEMENT le mapping champs →
props/slots du SDC via `{% embed %}`. Zéro balise HTML de structure dans
les templates paragraph. Si du HTML apparaît là, c'est que le composant
SDC est incomplet — corrige le composant. C'est la garantie de
migrabilité vers Canvas.

### d. Layout Paragraphs
Un paragraph type `section` avec 2-3 layouts (1 col, 2 cols, 3 cols)
déclarés comme layouts Drupal du thème, grilles en classes Tailwind.
Les autres types ne sont insérables QUE dans une section.

### e. Garde-fous éditoriaux
Types autorisés limités par champ, max 1 hero par page, libellés et
descriptions des champs en français, icônes/previews des paragraph
types configurés.

## 8. Multilingue — config globale
- langues FR (défaut) + EN, préfixes d'URL /fr /en
- détection : URL uniquement (pas de négociation par navigateur)
- content_translation sur node + paragraphs + media ; champ alt des
  media traduisible
- `t()`/`{% trans %}` dans les Twig des composants pour tout texte en
  dur (ex : « Lire la suite »), contexte de traduction nommé
- metatags et alias d'URL (pathauto) par langue

## 9. Qualité / CI
- Prettier + prettier-plugin-tailwindcss (ordre des classes)
- ESLint sur `components/**/*.js`
- job GitHub Actions : install, lint, build, validation des schémas
  YAML des composants, échec si le CSS généré dépasse 50 Ko gzippé
- test de non-régression : un node avec toutes les sections, traduit,
  rend le même DOM structurel dans les deux langues

# Contraintes
- Drupal 11, PHP 8.3, Tailwind v4 (config CSS-first, pas de
  tailwind.config.js legacy), pas de jQuery
- `@apply` interdit hors du bloc prose de main.css
- Accessibilité RGAA : focus-visible systématique, contrastes vérifiés
  sur les tokens, ARIA justifié
- Aucune logique de rendu dans les preprocess (mapping en Twig ;
  preprocess uniquement pour transformation de données réelle)
- Paragraph types et config de traduction = config exportée
  (config/sync), fournis les YAML complets

# Livrables
Procède étape par étape : pipeline, tokens, composants un par un avec
exemple d'usage réel, puis paragraph types et config multilingue.
Termine par un README d'architecture couvrant :
- quand créer un composant vs un template
- la stratégie de tokens inter-projets
- la stratégie Canvas : on suit la meta-issue multilingue du core
  Drupal Canvas, réévaluation à chaque version mineure ; critère de
  bascule = traduction symétrique supportée dans le core sans module
  contrib beta