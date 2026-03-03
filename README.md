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
# Create Certificat SSL local, read to README.md
# Install "mkcert"
cd web/themes/custom/tailwind/plugins/https_key && mkcert localhost
# Install Vite Build
lando build
```

## Configuration Development mode

### Enable Twig debug mode

Twig debugging can be enabled via Admin > Configure > Development settings (/admin/config/development/settings).

### Enable HMR (Hot Module Replacement) for Vite

```php
$settings['hot_module_replacement'] = TRUE;
```

```bash
# Clear cache
lando drush cr
```

```bash
# Install Vite Dev
lando dev
```

Go to https://tailwind.lndo.site/

Inspect the site. In the console, you should see this :

```js
[vite] connecting...
client:912 // [vite] connected.
theme.js:20 // 🚀 Theme Libraries loaded
```

```js
➜ tailwindcss4-drupal git:(master) ✗ lando dev

> drupal@0.0.1 dev
> npm --prefix ./web/themes/custom/tailwind run dev

> tailwind@0.0.1 dev
> vite

VITE v6.3.2 ready in 1176 ms

➜ Local: https://localhost:3009/
➜ Network: https://172.20.0.3:3009/
➜ Network: https://172.18.0.6:3009/
➜ press h + enter to show help
Files in the public directory are served at the root path.
Instead of /src/css/tailwind.css, use /css/tailwind.css.
6:56:15 PM [vite] (client) hmr update /src/css/tailwind.css
Files in the public directory are served at the root path.
Instead of /src/css/tailwind.css, use /css/tailwind.css.
```
