// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';

export default [js.configs.recommended, {
  files: ['components/**/*.js', 'src/js/**/*.js'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
    globals: {
      Drupal: 'readonly',
      drupalSettings: 'readonly',
      once: 'readonly',
      window: 'readonly',
      document: 'readonly',
      console: 'readonly',
    },
  },
  rules: {
    'no-unused-vars': 'warn',
  },
}, ...storybook.configs["flat/recommended"]];
