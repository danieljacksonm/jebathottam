#!/bin/bash
# Run on VPS as: bash scripts/vps-start-all.sh
# Starts all 3 Next.js sites behind Nginx (ports 3000, 3001, 3002)

set -e
HOME_DIR="${HOME:-/home/dani}"
REPO_DIR="$HOME_DIR/newjebathottam"

echo "=== 1. Logs folder ==="
mkdir -p "$HOME_DIR/logs"

echo "=== 2. Nginx config ==="
if [ -f "$REPO_DIR/nginx-all-sites.conf" ]; then
  sudo cp "$REPO_DIR/nginx-all-sites.conf" /etc/nginx/sites-available/all-sites
  sudo ln -sf /etc/nginx/sites-available/all-sites /etc/nginx/sites-enabled/all-sites
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t
  sudo systemctl enable nginx
  sudo systemctl restart nginx
else
  echo "WARN: $REPO_DIR/nginx-all-sites.conf not found — configure Nginx manually"
fi

echo "=== 3. Build Ebenezer (3000) ==="
cd "$HOME_DIR/ebenezer-digital"
npm install --legacy-peer-deps
npm run build

echo "=== 4. Build Ministry (3001) ==="
cd "$HOME_DIR/ministry-platform"
npm install --legacy-peer-deps
npm run build

echo "=== 5. Build Sri Krishna (3002) ==="
cd "$HOME_DIR/sri-krishna-mobiles"
npm install --legacy-peer-deps
npm run build

echo "=== 6. PM2 start all ==="
cd "$HOME_DIR"
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup 2>/dev/null || true

echo "=== 7. Health check ==="
sleep 3
pm2 list
for port in 3000 3001 3002; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$port" || echo "000")
  echo "  localhost:$port => HTTP $code"
done

echo ""
echo "Done. Open in browser:"
echo "  http://ebenezar.yegova.store"
echo "  http://demo.jesusisthewayjebathottam.com"
echo "  http://krishna.yegova.store"
echo ""
echo "HTTPS (after HTTP works):"
echo "  sudo certbot --nginx -d ebenezar.yegova.store -d demo.jesusisthewayjebathottam.com -d krishna.yegova.store"
