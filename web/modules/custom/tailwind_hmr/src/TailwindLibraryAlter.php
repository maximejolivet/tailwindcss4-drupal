<?php

declare(strict_types=1);

namespace Drupal\tailwind_hmr;

use Drupal\Core\Site\Settings;

/**
 * Service to alter Tailwind's libraries.
 */
final class TailwindLibraryAlter {

  /**
   * Alters the libraries if required.
   *
   * @param array $libraries
   *   Reference to the libraries array.
   * @param string $extension
   *   The extension name.
   */
  public function alter(array &$libraries, string $extension): void {
    if ($extension !== 'tailwind') {
      return;
    }

    if (Settings::get('hot_module_replacement')) {
      foreach ($libraries as &$settings) {
        if (isset($settings['js']) && is_array($settings['js'])) {
          foreach ($settings['js'] as $path => $options) {
            $this->replaceAsset($settings['js'], $path, $options);
          }
        }
      }
      unset($settings);
    }
    else {
      unset($libraries['hot-module-replacement']);
    }
  }

  /**
   * Replaces an asset path with a Vite-compatible one.
   *
   * @param array $library
   *   The library being altered.
   * @param string $path
   *   The asset path.
   * @param array $options
   *   Additional asset options.
   */
  private function replaceAsset(array &$library, string $path, array $options): void {
    if (preg_match('/^(http|:\/\/)/', $path)) {
      return;
    }

    $local = Settings::get('hot_module_replacement');
    $dir = 'dist';

    unset($library[$path]);

    if ($local) {
      $dir = 'http://localhost:3009';
      $options['type'] = 'external';
      if (preg_match('/\.m?js$/', $path)) {
        $options['crossorigin'] = true;
      }
    }

    $newPath = "{$dir}/{$path}";
    $library[$newPath] = $options;
  }

}