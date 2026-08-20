#!/bin/bash
# Safe one-shot deploy for Ebenezer Digital on the VPS.
# Usage (on VPS): bash /home/dani/test/scripts/deploy-ebenezer-now.sh
# Or:            bash /path/to/repo/scripts/deploy-ebenezer-now.sh
set -euo pipefail

echo "=== START $(date) ==="

# Prefer monorepo layouts used on this VPS, then standalone clone.
APP=""
MONOREPO=""
for root in /home/dani/test /home/dani/newjebathottam /home/dani/jebathottam; do
  if [ -d "$root/ebenezer-digital" ] && [ -d "$root/.git" ]; then
    MONOREPO="$root"
    APP="$root/ebenezer-digital"
    break
  fi
done

if [ -z "$APP" ] && [ -d /home/dani/ebenezer-digital/.git ]; then
  APP=/home/dani/ebenezer-digital
fi

if [ -z "$APP" ]; then
  echo "ERROR: Could not find ebenezer-digital app directory"
  exit 1
fi

echo "APP=$APP"
if [ -n "$MONOREPO" ]; then
  echo "MONOREPO=$MONOREPO"
  cd "$MONOREPO"
else
  cd "$APP"
fi

# Preserve runtime CMS file if present (admin edits live here).
STORE_BAK=""
if [ -f "$APP/data/store.json" ]; then
  STORE_BAK="/tmp/eben-store-$(date +%s).json"
  cp "$APP/data/store.json" "$STORE_BAK"
  echo "Backed up store.json -> $STORE_BAK"
fi

# Avoid "local changes would be overwritten by merge"
git fetch origin main
git reset --hard origin/main
git clean -fd -e data/store.json -e data/catalog.json -e .env -e .env.local || true
echo "COMMIT: $(git log -1 --oneline)"

# Ensure we are inside the Next app before any npm command
cd "$APP"
if [ ! -f package.json ]; then
  echo "ERROR: package.json missing in $APP"
  exit 1
fi

# Restore CMS data after hard reset (keep server-side content)
if [ -n "$STORE_BAK" ] && [ -f "$STORE_BAK" ]; then
  mkdir -p data
  cp "$STORE_BAK" data/store.json
  echo "Restored store.json from backup"
fi

mkdir -p /home/dani/logs
npm install --legacy-peer-deps

# Optional store kit build — do not fail whole deploy if script missing
if npm run | grep -q "build:store-kits"; then
  npm run build:store-kits || echo "WARN: build:store-kits failed (continuing)"
fi

export NEXT_PUBLIC_BUILD_TIME
NEXT_PUBLIC_BUILD_TIME="$(date -Iseconds)"
npm run build

if [ -f /home/dani/ecosystem.config.js ]; then
  ECO=/home/dani/ecosystem.config.js
elif [ -n "$MONOREPO" ] && [ -f "$MONOREPO/ecosystem.config.js" ]; then
  ECO="$MONOREPO/ecosystem.config.js"
  cp "$ECO" /home/dani/ecosystem.config.js
else
  ECO=""
fi

if pm2 describe ebenezer-digital >/dev/null 2>&1; then
  pm2 restart ebenezer-digital --update-env
else
  if [ -n "$ECO" ]; then
    pm2 start "$ECO" --only ebenezer-digital
  else
    echo "ERROR: no ecosystem.config.js found to start PM2 app"
    exit 1
  fi
fi

pm2 save
echo "DEPLOY_OK $(date)" > "$APP/.deploy-timestamp"
echo "=== COMMIT ==="
git -C "${MONOREPO:-$APP}" log -1 --oneline
echo "=== PM2 ==="
pm2 list
echo "=== DONE ==="
