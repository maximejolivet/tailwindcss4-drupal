((Drupal) => {
  'use strict';

  Drupal.behaviors.theme = {
    attach(context) {
      if (context !== document) {
        return;
      }
      console.info('🚀 Theme Libraries loaded');
    },
  };
})(Drupal);
