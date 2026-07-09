.PHONY: start stop restart restart-traefik status logs dockhand-register composer composer-install composer-update install certs package dev build drush

# Base docker compose invocation: compose file lives in docker/, but the
# project directory stays the repo root so bind mounts (e.g. .:/var/www/html)
# resolve correctly.
COMPOSE = docker compose -f docker/docker-compose.yml --project-directory .

# Start all containers in the background.
start:
	colima start && $(COMPOSE) up -d

# Stop all containers without removing them.
stop:
	colima stop && $(COMPOSE) stop

# Restart all containers.
restart:
	colima start && $(COMPOSE) restart

# Restart only Traefik (e.g. after editing dynamic config or certs).
restart-traefik:
	$(COMPOSE) restart traefik

# Show container status.
status:
	$(COMPOSE) ps

# Follow logs for all containers.
logs:
	$(COMPOSE) logs -f

# Register this stack in Dockhand.
dockhand-register:
	./docker/dockhand-register.sh

# Run Composer commands (php service). Usage: `make composer install`.
composer:
	$(COMPOSE) exec php composer $(filter-out $@,$(MAKECMDGOALS))

# Install Composer dependencies (php service).
composer-install:
	$(COMPOSE) exec php composer install

# Update Composer dependencies (php service).
composer-update:
	$(COMPOSE) exec php composer update

# Install Drupal from existing configuration (php service).
install:
	$(COMPOSE) exec php vendor/bin/drush site:install --existing-config -y

# Generate a local SSL certificate with mkcert (host, not a container).
certs:
	cd web/themes/custom/tailwind/plugins/https_key && mkcert localhost

# Install Node.js dependencies for the theme (node service).
package:
	$(COMPOSE) exec node npm run package

# Start the Vite dev server with HMR (node service).
dev:
	$(COMPOSE) exec node npm run dev

# Build the theme assets for production (node service).
build:
	$(COMPOSE) exec node npm run build

# Run Drush commands (php service). Usage: `make drush <command>`.
drush:
	$(COMPOSE) exec php vendor/bin/drush $(filter-out $@,$(MAKECMDGOALS))

# Swallow extra arguments passed to `make drush ...` so make doesn't try
# to treat them as targets of their own.
%:
	@:
