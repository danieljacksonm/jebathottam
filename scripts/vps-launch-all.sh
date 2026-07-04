#!/bin/bash
# Run on VPS as user 'dani' to recover all 3 sites after a collapse.
# Usage: bash scripts/vps-launch-all.sh
# Or from repo root on VPS: bash /home/dani/test/scripts/vps-launch-all.sh

set -e

DANI_HOME="/home/dani"
LOG_DIR="$DANI_HOME/logs"
ECOSYSTEM="$DANI_HOME/ecosystem.config.js"
NGINX_SRC="$(dirname "$0")/../nginx-all-sites.conf"
NGINX_DEST="/etc/nginx/sites-available/all-sites"

# Domains (must point A records to this VPS IP in your DNS panel)
EBENEZER_DOMAIN="ebenezar.yegova.store"
MINISTRY_DOMAIN="demo.jesusisthewayjebathottam.com"
MOBILES_DOMAIN="krishna.yegova.store"

echo "=============================================="
echo "  VPS Launch — 3 websites"
echo "=============================================="
echo ""
echo "DNS A records required (point to this server IP):"
echo "  $EBENEZER_DOMAIN"
echo "  $MINISTRY_DOMAIN"
echo "  $MOBILES_DOMAIN"
echo ""

mkdir -p "$LOG_DIR"

# --- 1. PM2 ecosystem ---
echo "=== Step 1: PM2 ecosystem config ==="
if [ -f "$(dirname "$0")/../ecosystem.config.js" ]; then
  cp "$(dirname "$0")/../ecosystem.config.js" "$ECOSYSTEM"
elif [ -f "$DANI_HOME/test/ecosystem.config.js" ]; then
  cp "$DANI_HOME/test/ecosystem.config.js" "$ECOSYSTEM"
fi

if [ ! -f "$ECOSYSTEM" ]; then
  echo "ERROR: ecosystem.config.js not found. Copy it to $ECOSYSTEM"
  exit 1
fi
echo "OK: $ECOSYSTEM"

# --- 2. Build & restart each app ---
deploy_app() {
  local name="$1"
  local dir="$2"
  local port="$3"

  echo ""
  echo "=== Deploying $name (port $port) ==="
  if [ ! -d "$dir" ]; then
    echo "ERROR: Directory missing: $dir"
    echo "Clone your repo there first, e.g.:"
    echo "  git clone <your-repo-url> $dir"
    return 1
  fi

  cd "$dir"

  if [ -d .git ]; then
    git fetch origin main 2>/dev/null || git fetch origin master 2>/dev/null || true
    git reset --hard origin/main 2>/dev/null || git reset --hard origin/master 2>/dev/null || true
  fi

  if [ ! -f .env ] && [ ! -f .env.local ] && [ ! -f .env.production ]; then
    echo "WARNING: No .env file in $dir — app may fail to start!"
    echo "  Copy env.example to .env and fill in database secrets."
  fi

  rm -rf .next
  npm install --legacy-peer-deps
  export NEXT_PUBLIC_BUILD_TIME=$(date -Iseconds)
  export PORT="$port"
  npm run build

  echo "Build OK: $name"
}

deploy_app "ebenezer-digital" "$DANI_HOME/ebenezer-digital" 3000
deploy_app "ministry-platform" "$DANI_HOME/ministry-platform" 3001
deploy_app "sri-krishna-mobiles" "$DANI_HOME/sri-krishna-mobiles" 3002

# --- 3. Start PM2 ---
echo ""
echo "=== Step 3: Start PM2 ==="
pm2 delete all 2>/dev/null || true
pm2 start "$ECOSYSTEM"
pm2 save
pm2 startup 2>/dev/null || true

sleep 3
pm2 list

# --- 4. Health check local ports ---
echo ""
echo "=== Step 4: Local health check ==="
for port in 3000 3001 3002; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$port" || echo "000")
  if [ "$code" = "000" ] || [ "$code" = "502" ]; then
    echo "FAIL: port $port returned HTTP $code"
    echo "  Check: pm2 logs (see app name above)"
  else
    echo "OK: port $port → HTTP $code"
  fi
done

# --- 5. Nginx ---
echo ""
echo "=== Step 5: Nginx reverse proxy ==="
if ! command -v nginx &>/dev/null; then
  echo "Installing nginx..."
  sudo apt-get update -qq
  sudo apt-get install -y nginx
fi

NGINX_FILE=""
for candidate in \
  "$(dirname "$0")/../nginx-all-sites.conf" \
  "$DANI_HOME/test/nginx-all-sites.conf" \
  "$DANI_HOME/nginx-all-sites.conf"; do
  if [ -f "$candidate" ]; then
    NGINX_FILE="$candidate"
    break
  fi
done

if [ -z "$NGINX_FILE" ]; then
  echo "WARNING: nginx-all-sites.conf not found — configure nginx manually."
else
  sudo cp "$NGINX_FILE" "$NGINX_DEST"
  sudo ln -sf "$NGINX_DEST" /etc/nginx/sites-enabled/all-sites
  sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
  sudo nginx -t
  sudo systemctl reload nginx
  echo "OK: Nginx config installed from $NGINX_FILE"
fi

# --- 6. HTTPS (optional) ---
echo ""
echo "=== Step 6: HTTPS (Let's Encrypt) ==="
if command -v certbot &>/dev/null; then
  echo "Run this manually if HTTP works but HTTPS does not:"
  echo "  sudo certbot --nginx -d $EBENEZER_DOMAIN -d $MINISTRY_DOMAIN -d $MOBILES_DOMAIN"
else
  echo "Install certbot: sudo apt install -y certbot python3-certbot-nginx"
  echo "Then: sudo certbot --nginx -d $EBENEZER_DOMAIN -d $MINISTRY_DOMAIN -d $MOBILES_DOMAIN"
fi

echo ""
echo "=============================================="
echo "  Launch complete"
echo "=============================================="
echo "  Ebenezer:  http://$EBENEZER_DOMAIN  (port 3000)"
echo "  Ministry:  http://$MINISTRY_DOMAIN  (port 3001)"
echo "  Mobiles:   http://$MOBILES_DOMAIN  (port 3002)"
echo ""
echo "If a site still fails:"
echo "  pm2 logs ebenezer-digital --lines 50"
echo "  pm2 logs ministry-platform --lines 50"
echo "  pm2 logs sri-krishna-mobiles --lines 50"
echo "=============================================="
