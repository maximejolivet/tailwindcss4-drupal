#!/usr/bin/env bash
#
# Generates a locally-trusted TLS certificate for tailwind.localhost (and its
# subdomains) using mkcert, for use by the Traefik reverse proxy.
set -euo pipefail

if ! command -v mkcert &> /dev/null; then
  echo "mkcert n'est pas installé. Installez-le avec 'brew install mkcert nss' puis relancez ce script." >&2
  exit 1
fi

mkcert -install

cert_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../traefik/certs" && pwd)"

mkcert -cert-file "${cert_dir}/tailwind.localhost.pem" \
       -key-file "${cert_dir}/tailwind.localhost-key.pem" \
       "tailwind.localhost" "*.tailwind.localhost"

echo "Certificats générés dans ${cert_dir}"
