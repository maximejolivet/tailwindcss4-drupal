<?php

namespace Drupal\tailwind_hmr\Hook;

use Drupal\Core\Hook\Attribute\Hook;
use Drupal\Core\Site\Settings;

/**
 * Provides hook implementations for library alterations.
 */
final class LibraryHooks {

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
    if ($extension !== 'tailwind') {
      return;
    }

    $hmr = Settings::get('hot_module_replacement');

    if (!$hmr) {
      unset($libraries['hot-module-replacement']);
      return;
    }

    foreach ($libraries as &$settings) {
      foreach ($settings['js'] ?? [] as $path => $options) {
        self::replaceAsset($settings['js'], $path, $options, $hmr);
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
  private static function replaceAsset(array &$library, string $path, array $options, bool $hmr): void {
    if (preg_match('/^(http|:\/\/)/', $path)) {
      return;
    }

    unset($library[$path]);
    $dir = $hmr ? 'http://localhost:'.$_ENV['VITE_SERVER_PORT'] ?? '3009' : 'dist';

    if ($hmr) {
      $options += ['type' => 'external'];
      if (str_ends_with($path, '.js') || str_ends_with($path, '.mjs')) {
        $options['crossorigin'] = true;
      }
    }

    $library["{$dir}{$path}"] = $options;
  }
}