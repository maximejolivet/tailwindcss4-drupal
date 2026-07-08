# TailwindCSS4 Drupal

A Vite, TailwindCSS 4 &amp; Drupal theme

![Node.js version](https://img.shields.io/badge/Node-22-407E37)
![PHP version](https://img.shields.io/badge/PHP-8.4-4E5B93)
![MariaDB](https://img.shields.io/badge/MariaDB-10-yellow)
![Drupal version](https://img.shields.io/badge/Drupal-11-blue)
![Vite 7.3.1](https://img.shields.io/badge/Vite-7-yellow)
![Tailwind CSS 4.2](https://img.shields.io/badge/Tailwind%20CSS-4.2-00BCFF)

## Installation

This project runs in a Docker Compose environment (Traefik, PHP/Apache, MariaDB, Node) to serve your Drupal 11 site with TailwindCSS 4.

```bash
# Start the containers for site tailwind.localhost
docker compose up -d
# Install Drupal 11
docker compose exec php composer install
# Install Node.js dependencies
docker compose exec node npm run package
# Create Certificat SSL local, read to README.md
# Install "mkcert"
cd web/themes/custom/tailwind/plugins/https_key && mkcert localhost
# Install Vite Build
docker compose exec node npm run build
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
docker compose exec php drush cr
```

```bash
# Install Vite Dev
docker compose exec node npm run dev
```

Go to https://tailwind.localhost/

Inspect the site. In the console, you should see this :

```js
[vite] connecting...
client:912 // [vite] connected.
theme.js:20 // 🚀 Theme Libraries loaded
```

In your IDE, you should see this when you edit the /src/css files

```js
➜ tailwindcss4-drupal git:(master) ✗ docker compose exec node npm run dev

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

The page needs to reload with the HMR changes
