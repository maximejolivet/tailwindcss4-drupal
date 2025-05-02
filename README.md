# TailwindCSS4 Drupal
A Vite, TailwindCSS 4 &amp; Drupal theme

![Node.js version](https://img.shields.io/badge/Node-22-407E37)
![PHP version](https://img.shields.io/badge/PHP-8.4-4E5B93)
![MariaDB](https://img.shields.io/badge/MariaDB-10-yellow)
![Drupal version](https://img.shields.io/badge/Drupal-11-blue)
![Lando](https://img.shields.io/badge/Lando-3-DD3F8F)
![Vite 6](https://img.shields.io/badge/Vite-6-yellow)
![Tailwind CSS 4.1](https://img.shields.io/badge/Tailwind%20CSS-4.1-00BCFF)

## Installation

[Lando.dev](https://lando.dev) is a local development environment tool that allows you to run your Drupal site in a containerized environment. This guide will help you set up Lando for your Drupal 11 site with TailwindCSS 4.

```bash
# Install Lando to site tailwind.lndo.site
lando start
# Install Drupal 11
lando composer install
# Install Node.js dependencies
lando package
# Install Vite Build
lando build
# Install Vite Dev
lando dev
```

## Configuration Development mode

### Enable Twig debug mode
Twig debugging can be enabled via Admin > Configure > Development settings (/admin/config/development/settings).

### Enable HMR (Hot Module Replacement) for Vite
```php
$settings['hot_module_replacement'] = TRUE;
```
