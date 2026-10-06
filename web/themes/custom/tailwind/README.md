# Thème Tailwind

Thème Drupal 11 basé sur Single Directory Components (SDC) + Tailwind CSS v4,
consommé par un page builder éditorial Paragraphs / Layout Paragraphs.
Architecture complète : [`docs/architecture-frontend.md`](../../../../docs/architecture-frontend.md)
à la racine du dépôt.

## Démarrer

```bash
npm install
npm run dev      # watch + HMR (nécessite hot_module_replacement=true dans settings.local.php)
npm run build    # build de prod, minifié, dans dist/
```

## Qualité

```bash
npm run lint:components   # valide les *.component.yml (name/status/props/slots, README présent)
npm run lint:js           # ESLint sur components/**/*.js
npm run prettier:check    # vérifie l'ordre des classes Tailwind (prettier-plugin-tailwindcss)
npm run prettier          # applique le formatage
```

La CI (`.github/workflows/theme-frontend.yml`) lance ces quatre étapes puis
échoue si `dist/css/main.css` dépasse 50 Ko gzippé.

## Storybook

Galerie de composants isolés, rendus avec le **vrai** moteur Twig (via
[`storybook-addon-sdc`](https://github.com/iberdinsky-skilld/sdc-addon) +
[Twing](https://twing.nightlycommit.com/)) — pas une réimplémentation en
JS/React, donc ce qui se voit dans Storybook est ce qui se rend dans
Drupal.

```bash
npm run build       # requis avant storybook: sert les assets (sprite d'icônes...) depuis dist/
npm run storybook          # serveur de dev, http://localhost:6006
npm run build-storybook    # export statique dans storybook-static/
```

- Chaque composant est auto-découvert depuis son `*.component.yml` (props
  en contrôles interactifs). Le contenu des slots vient du fichier
  `<composant>.story.yml` à côté (voir `components/03-organisms/hero/hero.story.yml`
  pour un exemple avec composants imbriqués).
- Nos composants consomment leurs slots via `{% block nom %}{% endblock %}`
  (seule syntaxe qui fonctionne dans le vrai Drupal — voir
  `docs/prompts/DRUPAL-PROCESS.md`). L'addon Storybook, lui, injecte les
  slots comme de simples variables de contexte. Chaque bloc a donc un corps
  par défaut `{{ nom|default('') }}` : ignoré par le mécanisme d'override
  de Drupal, utilisé par Storybook. Un seul template sert aux deux.
- `templates/includes/*.html.twig` (partiels internes utilisés par
  `hero`/`card`/`cta-banner` pour contourner un bug du validateur SDC de
  Drupal — voir le même fichier de process) sont mirorés vers
  `components/includes/` à chaque lancement de Storybook
  (`.storybook/main.js`), pour matcher l'espace de noms `@tailwind` que
  l'addon résout vers `components/`. Ne pas éditer `components/includes/`
  directement, c'est un dossier généré (ignoré par git).

## Structure

```
components/
  01-atoms/       button, heading, badge, tag, icon
  02-molecules/   card, accordion-item
  03-organisms/   hero, cards-grid, cta-banner, accordion, embed
layouts/          Layouts Drupal du paragraph type "section" (1/2/3 col)
templates/
  content/        Overrides node/page/champ (mapping pur, pas de logique)
  paragraph/      Un template par paragraph type — mapping pur vers un SDC
src/css/main.css  Entrée unique : @theme (tokens), imports, exception .prose
```

Chaque composant a son `README.md` avec un exemple d'usage réel — commencez
par lire celui du composant le plus proche de votre besoin avant d'en créer
un nouveau.
