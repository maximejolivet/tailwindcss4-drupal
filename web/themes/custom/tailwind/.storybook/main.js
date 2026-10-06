import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cpSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';

const themeRoot = fileURLToPath(new URL('..', import.meta.url));

// storybook-addon-sdc's own `tailwind:name` (SDC namespace) resolution and
// the underlying vite-plugin-twig-drupal's raw `@tailwind/path` alias are
// two separate, independently-derived namespace tables — both default to
// `components/`, and overriding just the second one via
// sdcStorybookOptions.vitePluginTwigDrupalOptions.namespaces was not
// honoured. Rather than depend on undocumented internals, mirror the two
// tiny include partials (templates/includes/*.html.twig — see
// components/03-organisms/hero/hero.twig for why they're separate files)
// into components/includes/ on every Storybook start, so the *existing*
// `@tailwind` → components/ alias finds them. templates/includes/ stays
// the single source of truth Drupal itself reads from.
cpSync(
  join(themeRoot, 'templates/includes'),
  join(themeRoot, 'components/includes'),
  { recursive: true }
);

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../components/**/*.component.yml'],
  addons: [
    {
      name: 'storybook-addon-sdc',
      options: {
        sdcStorybookOptions: {
          // Twing (not Twig.js): it implements {% embed %}/{% block %} slot
          // overrides faithfully, matching Drupal core's real Twig engine —
          // required since our components consume slots via
          // {% block name %}{% endblock %}, not plain variables.
          twigLib: 'twing',
          vitePluginTwingDrupalOptions: {
            hooks: join(themeRoot, '.storybook/twing-hooks.js'),
          },
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  // Serve the built theme assets (fonts, icons sprite, images) at /dist,
  // matching real Drupal. storybook-addon-sdc also bundles its own
  // active_theme_path() (from @christianwiedemann/drupal-twig-extensions)
  // which hardcodes a "core/themes/stark" prefix with no exposed way to
  // override it for the Twing path in this addon version — our own
  // active_theme_path() override in .storybook/twing-hooks.js is
  // registered too early and gets overwritten by the addon's core
  // registration. Rather than fight that, also serve dist/ at the path
  // the addon's default already resolves to.
  staticDirs: [
    { from: '../dist', to: '/dist' },
    { from: '../dist', to: '/core/themes/stark/dist' },
  ],

  async viteFinal(viteConfig) {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(tailwindcss());
    // Vite 8 resolves drupal-attribute's CJS entry (index.cjs) instead of
    // its clean ESM entry (index.mjs), and its CJS-export analysis fails to
    // see `exports.default = DrupalAttribute` — breaking
    // `new DrupalAttribute()` in every compiled Twig component. Alias the
    // bare specifier straight to the package's own ESM file to sidestep
    // that resolution/analysis entirely.
    viteConfig.resolve ??= {};
    // vite-plugin-twing-drupal manages resolve.alias as an array of
    // { find, replacement } entries (not a plain object) — preserve that
    // shape or its own alias-rewriting code breaks.
    const existingAlias = viteConfig.resolve.alias;
    const aliasEntries = Array.isArray(existingAlias)
      ? existingAlias
      : Object.entries(existingAlias ?? {}).map(([find, replacement]) => ({
          find,
          replacement,
        }));
    aliasEntries.push({
      find: 'drupal-attribute',
      replacement: fileURLToPath(import.meta.resolve('drupal-attribute')),
    });
    viteConfig.resolve.alias = aliasEntries;
    return viteConfig;
  },
};
export default config;
