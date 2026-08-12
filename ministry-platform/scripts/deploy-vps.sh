#!/bin/bash
# Run ON THE VPS from the app directory.
# Usage: cd /var/www/ministry-platform && bash scripts/deploy-vps.sh

set -euo pipefail
APP_NAME="ministry-app"

if [ ! -f "package.json" ]; then
  if command -v pm2 &>/dev/null; then
    PM2_CWD=$(pm2 show "$APP_NAME" 2>/dev/null | grep "exec cwd" | awk '{print $NF}' || true)
    if [ -n "${PM2_CWD:-}" ] && [ -d "$PM2_CWD" ]; then
      echo "Using app path from PM2: $PM2_CWD"
      cd "$PM2_CWD"
    fi
  fi
fi

if [ ! -f "package.json" ]; then
  echo "ERROR: Run from Next.js app directory (package.json missing)."
  exit 1
fi

if [ ! -f ".env.production" ] && [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
  echo "ERROR: No .env / .env.local / .env.production found. Aborting."
  exit 1
fi

if [ -z "${JWT_SECRET:-}" ]; then
  # shellcheck disable=SC1091
  set -a
  [ -f .env.production ] && . ./.env.production
  [ -f .env.local ] && . ./.env.local
  [ -f .env ] && . ./.env
  set +a
fi

if [ -z "${JWT_SECRET:-}" ]; then
  echo "WARNING: JWT_SECRET not set in environment. Production auth will fail."
fi

echo "=== Deploy path: $(pwd) ==="
BACKUP_SHA=$(git rev-parse HEAD)
git fetch origin main
git reset --hard origin/main
COMMIT=$(git rev-parse --short HEAD)
echo "=== Commit: $COMMIT (previous $BACKUP_SHA) ==="

rm -rf .next
npm ci
export NEXT_PUBLIC_BUILD_TIME
NEXT_PUBLIC_BUILD_TIME=$(date -Iseconds)
npm run build

pm2 restart "$APP_NAME" || pm2 start npm --name "$APP_NAME" -- start
pm2 save

sleep 2
if curl -fsS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ | grep -Eq '200|301|302|308'; then
  echo "=== Health OK. Deployed $COMMIT ==="
else
  echo "=== Health check failed. Consider: git reset --hard $BACKUP_SHA && npm ci && npm run build && pm2 restart $APP_NAME ==="
  exit 1
fi
