#!/usr/bin/env sh
set -eu

DOCKHAND_URL="${DOCKHAND_URL:-http://localhost:3000}"
STACK_NAME="${STACK_NAME:-$(basename "$(pwd)")}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"

session=$(curl -s "$DOCKHAND_URL/api/auth/session")
auth_enabled=$(echo "$session" | jq -r '.authEnabled')

cookie_jar=""
if [ "$auth_enabled" = "true" ]; then
  : "${DOCKHAND_USER:?DOCKHAND_USER is required when Dockhand authentication is enabled}"
  : "${DOCKHAND_PASSWORD:?DOCKHAND_PASSWORD is required when Dockhand authentication is enabled}"
  cookie_jar=$(mktemp)
  trap 'rm -f "$cookie_jar"' EXIT
  curl -s -c "$cookie_jar" -X POST "$DOCKHAND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg u "$DOCKHAND_USER" --arg p "$DOCKHAND_PASSWORD" '{username:$u,password:$p}')" \
    > /dev/null
fi

curl_auth_opts=""
if [ -n "$cookie_jar" ]; then
  curl_auth_opts="-b $cookie_jar"
fi

# Fetch the first existing Docker environment, or create a default local one.
env_id=$(curl -s $curl_auth_opts "$DOCKHAND_URL/api/environments" | jq -r '.[0].id // empty')

if [ -z "$env_id" ]; then
  env_id=$(curl -s $curl_auth_opts -X POST "$DOCKHAND_URL/api/environments" \
    -H "Content-Type: application/json" \
    -d '{"name":"local","connectionType":"socket","socketPath":"/var/run/docker.sock"}' \
    | jq -r '.id')
  echo "Dockhand 'local' environment created (id=$env_id)"
fi

payload=$(jq -n --arg name "$STACK_NAME" --rawfile compose "$COMPOSE_FILE" '{name:$name, compose:$compose, start:false}')

response=$(curl -s $curl_auth_opts -X POST "$DOCKHAND_URL/api/stacks?env=$env_id" \
  -H "Content-Type: application/json" \
  -d "$payload")

echo "$response" | jq .

ok=$(echo "$response" | jq -r '.success // empty')
if [ "$ok" != "true" ]; then
  echo "Failed to register the stack in Dockhand" >&2
  exit 1
fi

echo "Stack '$STACK_NAME' registered in Dockhand (env=$env_id)."
