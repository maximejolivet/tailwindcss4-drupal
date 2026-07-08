# Commandes Docker

Environnement de développement local basé sur `docker-compose.yml` (services : `traefik`, `php`, `database`, `node`, `phpmyadmin`, `mailhog`, `dockhand`).

## Démarrer / arrêter

```bash
# Démarrer tous les services en arrière-plan
docker compose up -d

# Arrêter et supprimer les conteneurs (les volumes, ex. db-data, sont conservés)
docker compose down

# Arrêter les conteneurs sans les supprimer
docker compose stop

# Redémarrer tous les services
docker compose restart

# Redémarrer un seul service
docker compose restart php
```

Raccourcis équivalents via `Makefile` :

```bash
make start     # docker compose up -d
make stop      # docker compose stop
make restart   # docker compose restart
make status    # docker compose ps
make logs      # docker compose logs -f
```

## Suivi

```bash
# État des conteneurs
docker compose ps

# Logs de tous les services
docker compose logs -f

# Logs d'un service précis
docker compose logs -f php
```

## Build

```bash
# Reconstruire l'image PHP après modification de docker/apache/Dockerfile
docker compose build php

# Rebuild puis redémarrage si nécessaire
docker compose up -d --build
```

## Accès aux conteneurs

```bash
# Shell dans le conteneur PHP
docker compose exec php bash

# Commande Drush
docker compose exec php drush cr

# Accès direct à la base de données
docker compose exec database mariadb -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"
```

## URLs locales (via Traefik)

| URL | Service |
|---|---|
| https://tailwind.localhost | Site Drupal |
| https://pma.tailwind.localhost | phpMyAdmin |
| https://mail.tailwind.localhost | Mailhog |
| https://localhost:3009 | Serveur de dev Vite (HMR) |
| http://localhost:3000 | Dockhand (admin Docker) |

## Services

| Service | Image | Rôle |
|---|---|---|
| traefik | traefik:v3.5 | Reverse proxy HTTPS local |
| php | build `docker/apache` | Apache + PHP-FPM pour Drupal |
| database | mariadb:11 | Base de données |
| node | node:22 | Serveur de dev Vite |
| phpmyadmin | phpmyadmin:5 | Interface d'admin MySQL |
| mailhog | mailhog/mailhog:v1.0.1 | Capture des emails sortants |
| dockhand | fnsys/dockhand:latest | Interface web de gestion Docker ([dockhand.pro](https://dockhand.pro/)) |

⚠️ Le service `dockhand` monte `/var/run/docker.sock` : il a un accès complet au démon Docker de la machine hôte (tous les conteneurs, pas seulement ceux de ce projet).

## Enregistrer le stack dans Dockhand

```bash
make dockhand-register
```

Exécute `docker/dockhand-register.sh`, qui appelle l'API Dockhand pour :
1. créer un environnement Docker local (`socket:/var/run/docker.sock`) s'il n'en existe pas encore ;
2. enregistrer `docker-compose.yml` comme stack `tailwindcss4-drupal` (sans redémarrer les conteneurs déjà lancés).

Si l'authentification Dockhand est activée, définir `DOCKHAND_USER` et `DOCKHAND_PASSWORD` (ex. dans `.env`, non commité) avant de lancer la commande.
