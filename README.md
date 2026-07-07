# TailwindCSS4 Drupal

A Vite, TailwindCSS 4 &amp; Drupal theme

![Node.js version](https://img.shields.io/badge/Node-22-407E37)
![PHP version](https://img.shields.io/badge/PHP-8.4-4E5B93)
![MariaDB](https://img.shields.io/badge/MariaDB-11-yellow)
![Drupal version](https://img.shields.io/badge/Drupal-11-blue)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-3-2496ED)
![Vite 7.3.1](https://img.shields.io/badge/Vite-7-yellow)
![Tailwind CSS 4.2](https://img.shields.io/badge/Tailwind%20CSS-4.2-00BCFF)

## Installation

This project runs on plain Docker Compose (no Lando required): PHP 8.4 + Apache, MariaDB, Node 22 (Vite), phpMyAdmin and Mailhog, fronted by a Traefik reverse proxy for HTTPS on `tailwind.localhost`.

```bash
# Copy the environment file
cp .env.example .env

# Generate a locally-trusted TLS certificate for tailwind.localhost (requires mkcert)
brew install mkcert nss
./docker/mkcert/generate-certs.sh

# Also generate the certificate used by the Vite dev server itself
cd web/themes/custom/tailwind/plugins/https_key && mkcert localhost && cd -

# Start the stack
docker compose up -d

# Install Drupal 11 dependencies
docker compose exec php composer install

# Install Node.js dependencies
docker compose run --rm node npm run package

# Build the theme assets
docker compose run --rm node npm run build

# Install the site from existing config
docker compose exec php vendor/bin/drush site:install --existing-config -y
```

Sites available at:

- https://tailwind.localhost/ — Drupal
- https://pma.tailwind.localhost/ — phpMyAdmin
- https://mail.tailwind.localhost/ — Mailhog

`*.localhost` domains resolve to `127.0.0.1` automatically in modern browsers, no `/etc/hosts` edit needed.

## Configuration Development mode

### Enable Twig debug mode

Twig debugging can be enabled via Admin > Configure > Development settings (/admin/config/development/settings).

### Enable HMR (Hot Module Replacement) for Vite

```php
$settings['hot_module_replacement'] = TRUE;
```

```bash
# Clear cache
docker compose exec php vendor/bin/drush cr
```

```bash
# Start the Vite dev server
docker compose up node
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
➜ tailwindcss4-drupal git:(master) ✗ docker compose up node

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
