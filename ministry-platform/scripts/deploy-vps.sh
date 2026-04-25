#!/bin/bash
# Run this ON THE VPS (e.g. bash deploy-vps.sh) to force-update the site from GitHub.
# Usage: cd /path/to/your/app && bash deploy-vps.sh
# Or: bash /path/to/deploy-vps.sh  (script will try to find app dir from PM2)

set -e
APP_NAME="ministry-app"

# If not already in app dir, try to get it from PM2
if [ ! -f "package.json" ] || [ ! -f "next.config.ts" ] && [ ! -f "next.config.js" ]; then
  if command -v pm2 &>/dev/null; then
    PM2_CWD=$(pm2 show "$APP_NAME" 2>/dev/null | grep "exec cwd" | awk '{print $NF}')
    if [ -n "$PM2_CWD" ] && [ -d "$PM2_CWD" ]; then
      echo "Using app path from PM2: $PM2_CWD"
      cd "$PM2_CWD"
    fi
  fi
fi

if [ ! -f "package.json" ]; then
  echo "ERROR: Run this script from your Next.js app directory (where package.json is), or set correct VPS_DEPLOY_PATH."
  echo "Example: cd /home/dani/jebathottam && bash scripts/deploy-vps.sh"
  exit 1
fi

echo "=== Deploy path: $(pwd) ==="
git fetch origin main
git reset --hard origin/main
COMMIT=$(git rev-parse --short HEAD)
echo "=== Commit now on server: $COMMIT ==="

rm -rf .next
npm ci
export NEXT_PUBLIC_BUILD_TIME=$(date -Iseconds)
npm run build

pm2 restart "$APP_NAME" || pm2 start npm --name "$APP_NAME" -- start
pm2 save

echo "=== Deploy done. Site should be running commit: $COMMIT ==="
echo "Do a hard refresh in the browser (Ctrl+Shift+R) to see the update."
