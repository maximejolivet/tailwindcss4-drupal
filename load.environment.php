<?php

/**
 * This file is included very early. See autoload.files in composer.json and
 * https://getcomposer.org/doc/04-schema.md#files
 */

use Symfony\Component\Dotenv\Dotenv;

/**
 * Load any .env file. See /.env.example.
 *
 * Drupal has no official method for loading environment variables and uses
 * getenv() in some places.
 */

(new Dotenv())->bootEnv(DRUPAL_ROOT . '/../.env');
