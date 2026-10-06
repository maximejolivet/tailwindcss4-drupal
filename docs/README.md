# Docker & Environment Setup

Complete guide for the Docker Compose development environment.

## Quick Commands

Use the `Makefile` for quick access to common commands:

```bash
make start           # Start all containers (docker compose up -d)
make stop            # Stop containers (docker compose stop)
make restart         # Restart all containers
make status          # Show container status (docker compose ps)
make logs            # Follow all container logs
make help            # Show available commands and URLs
make system          # Display Drupal version and system status
```

## Docker Compose Services

The environment runs 7 services defined in `docker/docker-compose.yml`:

| Service | Image | Port(s) | Purpose |
|---------|-------|---------|---------|
| **traefik** | traefik:v3.5 | 80, 443 | Reverse proxy, SSL termination, routing |
| **php** | Custom (docker/apache/Dockerfile) | 80 | Apache + PHP-FPM for Drupal |
| **database** | mariadb:11 | 3306 | MySQL/MariaDB database |
| **node** | node:24 | 3009, 6006 | Node.js runtime (Vite dev server) |
| **phpmyadmin** | phpmyadmin:5 | 80 | MySQL/MariaDB web admin interface |
| **mailhog** | mailhog/mailhog:v1.0.1 | 1025, 8025 | SMTP server + web UI for email testing |
| **dockhand** | fnsys/dockhand:latest | 3000 | Docker Compose web admin interface |

⚠️ **Security Note**: The `dockhand` service mounts `/var/run/docker.sock`, giving it full access to your host's Docker daemon (all containers, not just this project).

## URLs (via Traefik)

Access these URLs in your browser:

| URL | Service | User/Password |
|-----|---------|---------------|
| https://tailwind.localhost | Drupal site | — |
| https://pma.tailwind.localhost | PHPMyAdmin | drupal11 / drupal11 |
| https://mail.tailwind.localhost | MailHog | — |
| https://localhost:3009 | Vite Dev Server (HMR) | — |
| http://localhost:3000 | Dockhand Docker Admin | — |

**Note**: For HTTPS, install the local CA with `mkcert -install` once per machine.

## Managing Containers

### Start / Stop / Restart

```bash
# Start all containers in background
docker compose up -d

# Stop containers (preserve volumes like database)
docker compose stop

# Stop and remove containers (volumes remain)
docker compose down

# Restart all containers
docker compose restart

# Restart a specific container
docker compose restart php
```

### View Status & Logs

```bash
# List all containers and their status
docker compose ps

# Follow logs from all services
docker compose logs -f

# Follow logs from specific service
docker compose logs -f php

# View last 50 lines of PHP logs
docker compose logs -n 50 php
```

### Rebuild Images

```bash
# Rebuild PHP image (after editing docker/apache/Dockerfile)
docker compose build php

# Rebuild and restart
docker compose up -d --build

# Rebuild without cache
docker compose build --no-cache php
```

## Accessing Services

### PHP Container (Drupal)

```bash
# Open shell in PHP container
docker compose exec php bash

# Run Drush commands
docker compose exec php vendor/bin/drush status
docker compose exec php vendor/bin/drush cache:rebuild

# Run Composer commands
docker compose exec php composer install
docker compose exec php composer update

# Clear Drupal cache
docker compose exec php vendor/bin/drush cr
```

### Database

```bash
# Connect to MariaDB (interactive)
docker compose exec database mariadb -udrupal11 -pdrupal11 drupal11

# Backup database
docker compose exec database mysqldump -udrupal11 -pdrupal11 drupal11 > backup.sql

# Restore database
docker compose exec -T database mysql -udrupal11 -pdrupal11 drupal11 < backup.sql
```

### Node Container

```bash
# Run npm commands
docker compose exec node npm run dev
docker compose exec node npm run build
docker compose exec node npm install

# Open shell
docker compose exec node sh
```

## Traefik Configuration

Traefik acts as the reverse proxy, routing requests by hostname to the correct container.

### Static Configuration

Located in `docker-compose.yml` `traefik` service `command:` section:
- Entrypoints: `web` (port 80, redirects to HTTPS) and `websecure` (port 443)
- Providers: File provider for dynamic config with file watching enabled

### Dynamic Configuration

Located in `docker/traefik/`:

**routes.yml** — Routers and services:
```yaml
http:
  routers:
    drupal:
      rule: "Host(`tailwind.localhost`)"
      service: drupal
  services:
    drupal:
      loadBalancer:
        servers:
          - url: "http://php"
```

**tls.yml** — SSL certificates and TLS configuration

Changes to these files are picked up automatically (watched by Traefik).

### Adding a New Route

1. Edit `docker/traefik/dynamic/routes.yml`
2. Add a router and service following the existing pattern
3. Traefik will apply it automatically (no restart needed)

Example: Route to a new service
```yaml
http:
  routers:
    myservice:
      rule: "Host(`myservice.tailwind.localhost`)"
      service: myservice
  services:
    myservice:
      loadBalancer:
        servers:
          - url: "http://my-container:8080"
```

## SSL Certificates (mkcert)

Local HTTPS certificates are generated with [mkcert](https://github.com/FiloSottile/mkcert).

### Install Local CA (one time)

```bash
# Install the local certificate authority
mkcert -install
```

This allows your browser to trust local certificates without warnings.

### Generate / Regenerate Certificates

```bash
make certs
```

Or manually:

```bash
mkcert -cert-file docker/traefik/certs/tailwind.localhost.pem \
       -key-file docker/traefik/certs/tailwind.localhost-key.pem \
       tailwind.localhost "*.tailwind.localhost"
```

## Dockhand Integration

[Dockhand](https://dockhand.pro) is a web UI for Docker Compose management.

### Register This Stack

```bash
make dockhand-register
```

This runs `docker/dockhand-register.sh` to:
1. Create a Docker environment (`socket:/var/run/docker.sock`)
2. Register `docker-compose.yml` as stack `tailwindcss4-drupal`

Then access Dockhand at http://localhost:3000 to manage containers visually.

### Authentication

If Dockhand requires authentication, set environment variables:

```bash
# In .env (not committed)
DOCKHAND_USER=myusername
DOCKHAND_PASSWORD=mypassword
```

Then run `make dockhand-register`.

## Environment File (.env)

Docker Compose loads environment variables from `docker/.env` if present.

**Example:**
```bash
MYSQL_DATABASE=drupal11
MYSQL_USER=drupal11
MYSQL_PASSWORD=drupal11
MYSQL_ROOT_PASSWORD=drupal11
DRUPAL_HASH_SALT=your-salt-here
DOCKHAND_USER=
DOCKHAND_PASSWORD=
```

**Security**: This file is Git-ignored. Never commit credentials.

## Troubleshooting

### "no configuration file provided" or socket error

Make sure Colima (macOS) or Docker is running:
```bash
colima start    # macOS
docker version  # Verify Docker is running
```

### Container won't start

Check logs:
```bash
docker compose logs -f php
```

Common issues:
- Port already in use (change port in docker-compose.yml)
- Volume mount issue (verify paths in docker-compose.yml)
- Image build failure (run `docker compose build --no-cache php`)

### Database connection issues

Verify database is running:
```bash
docker compose ps database
docker compose logs database
```

Check credentials in `.env` and Drupal's `settings.php`:
```php
$databases['default']['default'] = [
  'driver' => 'mysql',
  'database' => 'drupal11',
  'username' => 'drupal11',
  'password' => 'drupal11',
  'host' => 'database',
  'port' => 3306,
];
```

### Slow performance on macOS

Colima resource allocation might be too low. Increase:
```bash
colima stop
colima start --cpu 4 --memory 4 --disk 60
```

## Reference

- **Docker Compose Docs**: https://docs.docker.com/compose/
- **Traefik Docs**: https://doc.traefik.io/traefik/
- **mkcert**: https://github.com/FiloSottile/mkcert
- **Colima (macOS)**: https://github.com/abiosoft/colima
