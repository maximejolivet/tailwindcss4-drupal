# Guide Claude pour les Projets Drupal / Claude Guidance for Drupal Projects

## Commandes de Build/Lint/Test / Build/Lint/Test Commands

- **Build** : `composer install`
- **Installation / Install** : `drush site:install --existing-config`
- **Lint** :
  - Si le projet contient un / If the project has a `/phpcs.xml` ou/or `/phpcs.xml.dist` : `phpcs`
  - Sinon / Otherwise : `phpcs --standard=Drupal path/to/test`
- **Analyse statique / Static Analysis** :
  - Si le projet contient un / If the project has a `/phpstan.neon` ou/or `phpstan.neon.dist` : `phpstan`
  - Sinon / Otherwise : `phpstan analyse --level 6 path/to/test`
- **Lancer un test / Run Single Test** :
  - Si le projet contient un / If the project has a `/phpunit.xml` ou/or `/phpunit.xml.dist` : `phpunit --filter Test path/to/test`
  - Sinon / Otherwise : `phpunit -c [web-root]/core/phpunit.xml.dist --filter Test path/to/test`

## Gestion de la Configuration / Configuration Management

- **Exporter la configuration / Export configuration** : `drush config:export -y`
- **Importer la configuration / Import configuration** : `drush config:import -y`
- **Importer une configuration partielle / Import partial configuration** : Par ex. pour réinitialiser à la config d'installation d'un module / E.g. to reset to a module's install config `drush config:import --partial --source=[path-to-module/config/install`
- **Vérifier la configuration / Verify configuration** : `drush config:export --diff`
- **Voir les détails d'une config / View config details** : `drush config:get [config.name]`
- **Modifier une valeur de config / Change config value** : `drush config:set [config.name] [key] [value]`
- **Installer depuis la config / Install from config** : `drush site:install --existing-config`
- **Obtenir le répertoire de synchronisation / Get the config sync directory** : `ddev drush status --field=config-sync`

## Commandes de Développement / Development Commands

- **Lister les modules disponibles / List available modules** : `drush pm:list [--filter=FILTER]`
- **Lister les modules activés / List enabled modules** : `drush pm:list --status=enabled [--filter=FILTER]`
- **Télécharger un module Drupal / Download a Drupal module** : `composer require drupal/[module_name]`
- **Installer un module Drupal / Install a Drupal module** : `drush en [module_name]`
- **Vider le cache / Clear cache** : `drush cache:rebuild`
- **Consulter les logs / Inspect logs** : `drush watchdog:show --count=20`
- **Supprimer les logs / Delete logs** : `drush watchdog:delete all`
- **Lancer le cron / Run cron** : `drush cron`
- **Afficher le statut / Show status** : `drush status`

## Gestion des Entités / Entity Management

- **Voir les champs d'une entité / View fields on entity** : `drush field:info [entity_type] [bundle]`

## Bonnes Pratiques / Best Practices

- Si des modifications de configuration sont apportées à `config/install` d'un module, elles doivent également être appliquées à la configuration active / If making configuration changes to a module's config/install, these should also be applied to active configuration
- Toujours exporter la configuration après des modifications / Always export configuration after making changes
- Vérifier les différences de configuration avant d'importer / Check configuration diffs before importing
- Si un module fournit une configuration d'installation, celle-ci doit passer par `config/install` et non par `hook_install` / If a module provides install configuration, this should be done via `config/install` not `hook_install`
- Privilégier les modules contrib pour les fonctionnalités plutôt que de les reproduire dans un module personnalisé / Attempt to use contrib modules for functionality, rather than replicating in a custom module
- Si phpcs/phpstan/phpunit ne sont pas disponibles, les installer via / If phpcs/phpstan/phpunit are not available, they should be installed by `composer require --dev drupal/core-dev`

## Conventions de Code / Code Style Guidelines

- **Version PHP / PHP Version** : Compatibilité PHP 8.3+ requise / PHP 8.3+ compatibility required
- **Standard de codage / Coding Standard** : Standards de codage Drupal / Drupal coding standards
- **Indentation** : 2 espaces, pas de tabulations / 2 spaces, no tabs
- **Longueur de ligne / Line Length** : 120 caractères maximum / 120 characters maximum
- **Commentaires / Comment** : 80 caractères maximum par ligne, toujours terminés par un point / 80 characters maximum line length, always finishing with a full stop
- **Namespaces** : Standard PSR-4 / PSR-4 standard, `Drupal\{module_name}`
- **Types** : Typage strict avec les fonctionnalités PHP 8, types union si nécessaire / Strict typing with PHP 8 features, union types when needed
- **Documentation** : PHPDoc obligatoire pour les classes et méthodes / Required for classes and methods with PHPDoc
- **Structure des classes / Class Structure** : Propriétés avant les méthodes, injection de dépendances via le constructeur / Properties before methods, dependency injection via constructor
- **Nommage / Naming** : CamelCase pour les classes/méthodes/propriétés, snake_case pour les variables, MAJUSCULES pour les constantes / CamelCase for classes/methods/properties, snake_case for variables, ALL_CAPS for constants
- **Gestion des erreurs / Error Handling** : Types d'exceptions spécifiques avec annotations `@throws`, messages explicites / Specific exception types with `@throws` annotations, meaningful messages
- **Plugins** : Suivre les conventions de plugins Drupal avec des attributs pour la définition / Follow Drupal plugin conventions with attributes for definition

Lors du travail dans ce projet, privilégier le respect des patterns et conventions Drupal. / When working in this codebase, prioritize adherence to Drupal patterns and conventions.
