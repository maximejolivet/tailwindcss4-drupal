import { createSynchronousFunction, createSynchronousFilter } from 'twing';

/**
 * Drupal-ish Twig polyfills for the Twing environment used by
 * storybook-addon-sdc. See .storybook/main.js for why Twing (not Twig.js)
 * is used: it implements {% embed %}/{% block %} slot overrides faithfully,
 * matching Drupal core's real Twig engine — required by our components,
 * which consume slots via {% block name %}{% endblock %} (see
 * docs/prompts/DRUPAL-PROCESS.md, "syntaxe de slot" for why).
 */
export function initEnvironment(twingEnvironment) {
  twingEnvironment.addFunction(
    createSynchronousFunction(
      'active_theme_path',
      // icon.twig prefixes the sprite URL with this; the real asset is
      // served by staticDirs in main.js.
      () => '',
      []
    )
  );

  twingEnvironment.addFilter(
    createSynchronousFilter(
      't',
      // Storybook has no interface translation; |t is a passthrough.
      (context, value) => value,
      [{ name: 'value' }]
    )
  );
}
