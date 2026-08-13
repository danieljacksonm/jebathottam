#!/bin/bash
# Run on VPS: bash scripts/enable-ssl-info-store.sh
# Adds free HTTPS (Let's Encrypt) for .info and .store

set -euo pipefail

echo "=== 1) Copy latest nginx (HTTP first, so certbot can pass) ==="
REPO_NGINX=""
for p in /home/dani/test/nginx-all-sites.conf /home/dani/ebenezer-digital/../nginx-all-sites.conf /home/dani/newjebathottam/nginx-all-sites.conf; do
  if [ -f "$p" ]; then REPO_NGINX="$p"; break; fi
done

if [ -n "$REPO_NGINX" ]; then
  sudo cp "$REPO_NGINX" /etc/nginx/sites-available/all-sites
  sudo ln -sf /etc/nginx/sites-available/all-sites /etc/nginx/sites-enabled/all-sites
  sudo nginx -t
  sudo systemctl reload nginx
  echo "Nginx reloaded from $REPO_NGINX"
else
  echo "WARN: nginx-all-sites.conf not found in common paths. Continuing with live nginx."
fi

echo "=== 2) Issue / expand certificates ==="
sudo certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email --redirect \
  -d ebenezerdigital.info -d www.ebenezerdigital.info

sudo certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email --redirect \
  -d ebenezerdigital.store -d www.ebenezerdigital.store

echo "=== 3) Reload ==="
sudo nginx -t
sudo systemctl reload nginx

echo "Done. Test:"
echo "  https://ebenezerdigital.info"
echo "  https://ebenezerdigital.store"
