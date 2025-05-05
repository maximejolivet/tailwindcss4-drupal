<?php
namespace Drupal\tailwind_hmr\Hook;

use Drupal\Core\Hook\Attribute\Hook;
use Drupal\Core\Site\Settings;

/**
 * Provides hook implementations for library alterations.
 */
class LibraryHooks {

  /**
   * Alters the libraries defined by an extension.
   *
   * @param array $libraries
   *   The libraries provided by the extension, keyed by internal library name.
   * @param string $extension
   *   The name of the extension that owns the libraries.
   */
  #[Hook('library_info_alter')]
  public static function libraryInfoAlter(array &$libraries, string $extension): void {
    if ($extension === 'tailwind') {
      if (Settings::get('hot_module_replacement')) {
        foreach ($libraries as &$settings) {
          if (isset($settings['js']) && is_array($settings['js'])) {
            foreach ($settings['js'] as $path => $options) {
              (new LibraryHooks)->replaceAsset($settings['js'], $path, $options);
            }
          }
        }
        unset($settings);
      }
      else {
        unset($libraries['hot-module-replacement']);
      }
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