.PHONY: start stop restart restart-traefik status logs dockhand-register

start:
	docker compose up -d

stop:
	docker compose stop

restart:
	docker compose restart

restart-traefik:
	docker compose restart traefik

status:
	docker compose ps

logs:
	docker compose logs -f

dockhand-register:
	./docker/dockhand-register.sh
