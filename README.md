# TailwindCSS 4 + Drupal 11

A modern Drupal 11 theme built with Vite, TailwindCSS 4, and Docker Compose.

![Node.js](https://img.shields.io/badge/Node-24-407E37) ![PHP](https://img.shields.io/badge/PHP-8.4-4E5B93) ![MariaDB](https://img.shields.io/badge/MariaDB-11-yellow) ![Drupal](https://img.shields.io/badge/Drupal-11.4.8-blue) ![Vite](https://img.shields.io/badge/Vite-8.1-yellow) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3-00BCFF) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED) ![Traefik](https://img.shields.io/badge/Traefik-3.5-24A1C1)

## Quick Start

### Prerequisites

- **macOS**: [Colima](https://github.com/abiosoft/colima) (lightweight Docker alternative), [mkcert](https://github.com/FiloSottile/mkcert)
- **Linux/Windows**: Docker Desktop or Docker Engine

### Installation & Setup

```bash
# Start Docker containers
make start

# Install PHP/Drupal dependencies
make composer-install

# Install Node.js dependencies
make package

# Generate SSL certificates (macOS with mkcert)
make certs

# Build theme assets
make build

# Start development server with HMR
make dev
```

### Access the Site

```bash
# Show URLs and system status
make help

# Drupal site
https://tailwind.localhost

# Vite Dev Server (HMR)
https://localhost:3009

# PHPMyAdmin
http://localhost (user: drupal11)

# MailHog (email testing)
http://localhost:8025

# Dockhand (Docker admin)
http://localhost:3000
```

## Development Workflow

### Vite Dev Server (Hot Module Replacement)

```bash
# Start Vite dev server with live reload
make dev
```

The dev server watches for changes in `/web/themes/custom/tailwind/src/` and HMR automatically updates your browser. Check the console:

```js
[vite] connecting...
[vite] connected.
🚀 Theme Libraries loaded
```

Edit CSS/JS and see changes instantly without page reload.

### Drupal Configuration

Enable Twig debug mode:
- Admin > Configuration > Development settings (`/admin/config/development/settings`)
- Or in `settings.local.php`: `$settings['twig.config']['debug'] = TRUE;`

Enable HMR in `settings.local.php`:
```php
$settings['hot_module_replacement'] = TRUE;
```

Then clear cache:
```bash
make drush cr
```

### Build for Production

```bash
# Build minified theme assets
make build
```

Assets are compiled to `/web/themes/custom/tailwind/dist/` with optimal performance.

## Available Commands

```bash
make help        # Show all available commands and URLs
make system      # Display system status and version info

# Docker
make start       # Start all containers
make stop        # Stop containers
make restart     # Restart containers
make status      # Show container status
make logs        # Follow container logs

# PHP / Drupal
make composer <cmd>      # Run Composer command
make composer-install    # Install PHP dependencies
make composer-update     # Update dependencies
make install             # Install Drupal from config
make drush <cmd>         # Run Drush command

# Frontend / Node.js
make package     # Install Node.js dependencies
make dev         # Start Vite dev server with HMR
make build       # Build theme assets for production

# System
make certs       # Generate SSL certificates
make system      # Show full system status
```

## Project Structure

```
tailwindcss4-drupal/
├── web/                          # Drupal webroot
│   ├── themes/custom/tailwind/   # Custom theme
│   │   ├── src/                  # Source files (CSS, JS)
│   │   ├── dist/                 # Compiled assets
│   │   ├── components/           # Reusable components
│   │   ├── layouts/              # Twig layouts
│   │   ├── templates/            # Twig templates
│   │   ├── package.json
│   │   └── vite.config.mjs
│   └── ...
├── docker/                       # Docker Compose setup
│   ├── docker-compose.yml
│   ├── apache/                   # PHP/Apache Dockerfile
│   └── traefik/                  # Reverse proxy config
├── docs/                         # Documentation
├── Makefile                      # Development commands
└── composer.json
```

## Documentation

- **[Docker Setup](docs/README.md)** — Docker Compose services, Traefik, SSL certificates
- **[Frontend Architecture](docs/architecture-frontend.md)** — Vite, TailwindCSS, component structure
- **[Drupal Prompts](docs/prompts/DRUPAL.md)** — Claude Code guidance for Drupal development

## Requirements

- **Drupal 11.4.8** LTS (supported until November 2026)
- **PHP 8.4** (8.3+ required)
- **Node.js 24**
- **MariaDB 11**
- **Vite 8.1** (dev server & build tool)
- **TailwindCSS 4.3** (utility-first CSS framework)
- **Docker Compose** (containerization)

## Key Features

- ✅ **Modern Frontend Stack** — Vite + TailwindCSS 4 + HMR
- ✅ **Drupal 11 LTS** — Latest stable with 3 years support
- ✅ **Docker Compose** — Isolated, reproducible development environment
- ✅ **SSL/HTTPS** — Local certificates via mkcert & Traefik
- ✅ **Email Testing** — MailHog captures outgoing emails
- ✅ **Database Admin** — PHPMyAdmin included
- ✅ **Fast Rebuilds** — Semantic git commits with proper formatting
- ✅ **Claude Code Ready** — Drupal-specific Claude guidance included

## Configuration

See `.env` and `settings.local.php` for environment variables and Drupal configuration.

**Note:** `.env` files are Git-ignored for security (no credentials in version control).

## Support

- **Drupal Docs**: https://www.drupal.org/docs/11
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **Docker Compose**: https://docs.docker.com/compose/

---

Last updated: Drupal 11.4.8, TailwindCSS 4.3, Vite 8.1
