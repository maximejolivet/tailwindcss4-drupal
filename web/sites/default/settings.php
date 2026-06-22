<?php

(new Symfony\Component\Dotenv\Dotenv())->bootEnv(DRUPAL_ROOT . '/../.env');

$env = $_ENV['APP_ENV'] ?? 'local';

$settings['hash_salt'] = '6npPERfc7vxwmsWaqHrcJa5noyBX7CG9dKsRaZVtKiErX772iWFMP2belpPjOrDTDknDWwgutLB';

$settings['state_cache'] = TRUE;

$databases['default']['default'] = [
  'database' => $_ENV['MYSQL_DATABASE'] ?? 'drupal11',
  'username' => $_ENV['MYSQL_USER'] ?? 'drupal11',
  'password' => $_ENV['MYSQL_PASSWORD'] ?? 'drupal11',
  'prefix' => '',
  'host' => $_ENV['MYSQL_HOSTNAME'] ?? 'database',
  'port' => $_ENV['MYSQL_PORT'] ?? '3306',
  'isolation_level' => 'READ COMMITTED',
  'driver' => 'mysql',
  'namespace' => 'Drupal\\mysql\\Driver\\Database\\mysql',
  'autoload' => 'core/modules/mysql/src/Driver/Database/mysql/',
];

$settings['config_sync_directory'] = '../config/sync';

if ($env === 'local') {
  $settings['hot_module_replacement'] = TRUE;
}

if ($env === 'production') {
  $settings['trusted_host_patterns'] = ['^drupal\.jolivetmaxime\.fr$'];
  $config['system.logging']['error_level'] = 'hide';
  $settings['file_private_path'] = DRUPAL_ROOT . '/../private';
}