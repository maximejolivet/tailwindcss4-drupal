# Docker environment

The development stack runs entirely through Docker Compose
(`docker/docker-compose.yml`, driven by the `Makefile` at the repo root:
`make start`, `make stop`, `make restart`, `make status`, `make logs`).

## Colima

[Colima](https://github.com/abiosoft/colima) provides the Docker daemon on
macOS (a lightweight alternative to Docker Desktop, no license and no GUI).

### Start / stop

```bash
colima start   # start the VM and the Docker daemon
colima stop    # stop the VM
colima status  # current state (running/stopped)
colima list    # profile, arch, allocated CPU/memory/disk
```

`make start` (i.e. `docker compose up -d`) fails with
`no configuration file provided` or a Docker socket connection error if
Colima isn't running: run `colima start` before any `make`/`docker compose`
command.

### Allocated resources

By default Colima starts with 2 CPU / 2 GiB RAM / 100 GiB disk. To adjust:

```bash
colima start --cpu 4 --memory 4 --disk 60
```

(requires `colima stop` then a fresh `colima start` if the VM already
exists with different values).

### Architecture (Apple Silicon)

On Apple Silicon Macs, Colima runs natively in `aarch64`. All images used in
`docker-compose.yml` (mariadb, node, phpmyadmin, mailhog, traefik, the `php`
image built from `docker/apache/Dockerfile`) are multi-arch and require no
emulation.

## Traefik

[Traefik](https://doc.traefik.io/traefik/) acts as a reverse proxy in front
of the stack's services: it terminates TLS (HTTPS) and routes requests to
the right container based on hostname.

### Configuration

- **Static config**: passed as `command:` arguments on the `traefik` service
  in `docker/docker-compose.yml` (entrypoints `web` (:80, redirected to
  HTTPS) and `websecure` (:443), file provider for dynamic config).
- **Dynamic config**: `docker/traefik/dynamic/routes.yml` (routers and
  services) and `docker/traefik/dynamic/tls.yml` (certificates). These files
  are watched (`--providers.file.watch=true`): any change is picked up
  without restarting the container.

### Current routes

| Host                          | Service      | Internal target        |
|-------------------------------|--------------|--------------------------|
| `tailwind.localhost`          | Drupal       | `http://php:80`         |
| `pma.tailwind.localhost`      | phpMyAdmin   | `http://phpmyadmin:80`  |
| `mail.tailwind.localhost`     | Mailhog      | `http://mailhog:8025`   |

To add a route, add a router + service in `docker/traefik/dynamic/routes.yml`
following the same pattern.

### Local certificates (mkcert)

The certificates served by Traefik (`docker/traefik/certs/`) are generated
with [mkcert](https://github.com/FiloSottile/mkcert) and cover
`tailwind.localhost` and `*.tailwind.localhost`.

Install the local CA (once per machine):

```bash
mkcert -install
```

Regenerate the certificates if needed:

```bash
mkcert -cert-file docker/traefik/certs/tailwind.localhost.pem \
       -key-file docker/traefik/certs/tailwind.localhost-key.pem \
       tailwind.localhost "*.tailwind.localhost"
```

Without `mkcert -install`, the browser will show an untrusted certificate
warning even if the certificate itself is correctly generated.

## Node on macOS (Apple Silicon)

The `node` service in `docker-compose.yml` uses the official `node:24` image
(multi-arch, no special configuration needed on Apple Silicon).
