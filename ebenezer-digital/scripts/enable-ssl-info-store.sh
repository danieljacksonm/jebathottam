#!/bin/bash
# Run on VPS from:  bash ~/ebenezer-digital/scripts/enable-ssl-info-store.sh
set -euo pipefail

echo "=== Check nginx knows .info and .store ==="
sudo nginx -T 2>/dev/null | grep -E "server_name" | grep -E "ebenezerdigital\.(info|store)" || {
  echo "Nginx does not list .info/.store yet. Adding HTTP server blocks..."
  sudo tee /etc/nginx/sites-available/ebenezer-info-store >/dev/null <<'NGINX'
server {
    listen 80;
    server_name ebenezerdigital.info www.ebenezerdigital.info;
    client_max_body_size 20M;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
server {
    listen 80;
    server_name ebenezerdigital.store www.ebenezerdigital.store;
    client_max_body_size 20M;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX
  sudo ln -sf /etc/nginx/sites-available/ebenezer-info-store /etc/nginx/sites-enabled/ebenezer-info-store
  sudo nginx -t
  sudo systemctl reload nginx
}

echo "=== Issue HTTPS certificates ==="
sudo certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email --redirect \
  -d ebenezerdigital.info -d www.ebenezerdigital.info

sudo certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email --redirect \
  -d ebenezerdigital.store -d www.ebenezerdigital.store

sudo nginx -t
sudo systemctl reload nginx
echo "Done. Open https://ebenezerdigital.info and https://ebenezerdigital.store"
