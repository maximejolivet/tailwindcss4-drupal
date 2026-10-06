# Architecture front — SDC, Tailwind v4, page builder Paragraphs

Ce document est le point d'entrée pour comprendre comment le thème `tailwind`
(`web/themes/custom/tailwind`) est construit et comment l'étendre sans casser
les garanties qui le rendent industrialisable sur plusieurs projets d'agence.

## 1. Vue d'ensemble

```
Vite + Tailwind v4 (CSS-first)
  └─ src/css/main.css        tokens (@theme), imports, exception .prose
  └─ components/              SDC : atoms → molecules → organisms
       *.component.yml        props/slots en JSON Schema, enforce_prop_schemas: true
       *.twig                 markup + classes Tailwind, mapping variants → objet Twig
       README.md               contrat du composant + exemple d'usage réel
  └─ templates/paragraph/     1 template par paragraph type = mapping pur vers un SDC
  └─ layouts/                 layouts Drupal du paragraph "section" (grilles Tailwind)
```

Le pipeline, les tokens et les 7 composants de départ (button, card, heading,
badge, tag, icon, hero) + les composants dérivés nécessaires au page builder
(cards-grid, cta-banner, accordion, accordion-item, embed) sont dans
`web/themes/custom/tailwind`. La configuration Paragraphs/traduction/langue
est dans `config/sync/`.

## 2. Quand créer un composant SDC vs un template Drupal classique

**Composant SDC** (`components/`) quand le morceau d'UI :
- a une identité visuelle propre, réutilisable en dehors d'un contexte de
  page précis (un bouton, une carte, un badge) ;
- doit pouvoir se rendre isolément, sans entité Drupal ni contexte de page
  (testable au Storybook-like/preview interne, migrable vers Canvas) ;
- a des variantes énumérables (couleur, taille) qu'on veut pouvoir garantir
  par un schéma plutôt que par convention.

**Template Drupal classique** (`templates/content/`, `templates/paragraph/`)
quand le fichier ne fait que du **mapping** : traduire des variables Drupal
(champs, entité, view mode) vers les props/slots d'un ou plusieurs
composants. Un template paragraph ne doit jamais contenir de balise HTML de
structure — s'il en contient, c'est que le composant SDC visé est incomplet
et doit être corrigé, pas contourné (voir `templates/paragraph/*.twig`, tous
strictement des `{% embed %}`).

**Règle pratique** : si vous êtes en train d'écrire une classe Tailwind
directement dans un template paragraph ou node, arrêtez-vous — c'est le
signal qu'un prop ou un slot manque au composant SDC correspondant. Les deux
seules exceptions du projet sont documentées et volontaires :
`field--body.html.twig` (classe `.prose`, contenu WYSIWYG non structurable en
props) et les templates de layout (`layouts/*.twig`, qui *sont* de la
structure de mise en page par définition — pas du contenu).

## 3. Stratégie de tokens inter-projets

Tout le vocabulaire de design vit dans le bloc `@theme` de `src/css/main.css`
— couleurs sémantiques (`--color-primary`, `--color-surface`,
`--color-text`...), spacing, fonts, radius. Deux règles le rendent portable
d'un projet d'agence à l'autre :

1. **Aucune valeur arbitraire (`[...]`) dans un composant.** Une classe comme
   `bg-[#1a2b3c]` fige une couleur au projet ; `bg-primary` reste correcte
   après un reskin qui ne touche que `@theme`. Les rares exceptions (aucune à
   ce jour) devraient être justifiées en commentaire au-dessus de la classe.
2. **Nommage sémantique, jamais littéral** (`primary`, pas `blue-600` ;
   `surface-alt`, pas `gray-100`) — le nom décrit le *rôle*, pas la valeur,
   donc il reste vrai même quand la valeur change entre deux projets.

Pour démarrer un nouveau projet à partir de ce thème : copier le thème,
réécrire uniquement le bloc `@theme` (et éventuellement `src/icons/sprite.svg`
et `src/fonts/`), ne toucher à aucun `*.twig` de composant. Si un projet a
besoin d'une variante de composant que le socle n'a pas, l'ajouter dans
`props.*.enum` en amont dans le composant partagé plutôt que de forker le
composant — sinon la maintenance multi-projets diverge dès le premier écart.

## 4. Traduction symétrique (Paragraphs)

`field_sections` (node) et les champs `entity_reference_revisions` internes
aux paragraphes (`field_cards`, `field_items`) sont **non traduisibles**. Les
paragraphes eux-mêmes sont traduisibles, champ par champ : les champs de
contenu (texte, média, lien) sont traduisibles, les champs de configuration
(`field_variant`, `field_position`) ne le sont jamais.

Pourquoi : si `field_sections` était traduisible, chaque langue aurait sa
propre liste de références de paragraphes — en pratique cela produit des
listes qui divergent silencieusement (un paragraphe ajouté en FR n'apparaît
pas en EN, widgets de traduction qui créent des paragraphes vides côté
cible), et un contenu qui se désynchronise à chaque publication. En gardant
la liste de paragraphes identique dans toutes les langues et en ne
traduisant que leur contenu interne, traduire FR→EN propose la traduction de
chaque paragraphe existant — jamais des paragraphes vides. C'est le test de
non-régression à exécuter après toute modification touchant ces champs.

Le champ `field_variant` partagé (list_string, valeurs synchronisées avec le
`props.*.enum` du composant SDC correspondant via le callback
`tailwind_components_variant_allowed_values()` dans
`web/modules/custom/tailwind_components`) est le mécanisme qui garde le
schéma SDC comme source de vérité unique des variantes, plutôt que de
dupliquer l'énumération dans la configuration de champ.

## 5. Points à vérifier avant mise en production

Deux fichiers de configuration contiennent des réglages spécifiques au
module contrib Layout Paragraphs reconstruits de mémoire (pas vérifiés contre
une installation réelle, faute de Drupal core disponible dans cet
environnement) :

- `config/sync/paragraphs.paragraphs_type.section.yml`
  (`behavior_plugins.layout_paragraphs`)
- `config/sync/core.entity_form_display.node.page.default.yml`
  (widget `layout_paragraphs` du champ `field_sections`)
- `web/modules/custom/tailwind_components/tailwind_components.module`
  (`tailwind_components_max_one_hero_validate()` suppose la forme de valeur
  du widget classique Paragraphs ; à vérifier contre la structure réelle
  exposée par le widget Layout Paragraphs 2.x)

Suivre le processus déjà documenté dans `.claude/CLAUDE.md` : configurer une
fois via l'UI, puis `drush config:export --diff` pour réconcilier avant tout
déploiement réel.

## 6. Stratégie Drupal Canvas

Les SDC sont conçus comme le socle commun avant une bascule vers Drupal
Canvas : props/slots typés, zéro logique de rendu dans les templates
paragraph, composants rendables isolément. La bascule n'est cependant pas
automatique tant que la traduction symétrique des paragraphes n'est pas
supportée nativement par Canvas.

**Suivi** : on suit la meta-issue multilingue du core Drupal Canvas,
réévaluée à chaque version mineure de Drupal.

**Critère de bascule** : traduction symétrique supportée dans le core, sans
dépendre d'un module contrib en version beta. Tant que ce critère n'est pas
rempli, l'architecture Paragraphs + Layout Paragraphs décrite ici reste la
solution de production ; le travail de bascule se limitera alors à
remplacer la couche "paragraph type + template de mapping" par son
équivalent Canvas, les composants SDC eux-mêmes ne changeant pas.
