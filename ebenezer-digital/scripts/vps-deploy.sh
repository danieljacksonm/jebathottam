#!/usr/bin/env bash
# Safe VPS deploy — preserves CMS data + env; rebuilds CSS/JS chunks atomically.
set -euo pipefail

APP=/home/dani/ebenezer-digital
REPO=~/jebathottam
BRANCH=main

echo "==> Pull latest"
cd "$REPO" && git pull origin "$BRANCH"

echo "==> Backup CMS + env"
cp "$APP/data/store.json" /tmp/store.json.bak
cp "$APP/.env.local" /tmp/ebenezer.env.local.bak 2>/dev/null || true

echo "==> Sync source (keep store.json, env, node_modules until npm ci)"
rsync -a --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude data/store.json \
  --exclude .env \
  --exclude .env.local \
  "$REPO/ebenezer-digital/" "$APP/"

cp /tmp/store.json.bak "$APP/data/store.json"
cp /tmp/ebenezer.env.local.bak "$APP/.env.local" 2>/dev/null || true

echo "==> Build (with memory cap)"
cd "$APP"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=768}"
npm ci
npm run build

echo "==> Restart"
pm2 restart ebenezer-digital --update-env
pm2 save

echo "==> Smoke"
curl -sI "https://ebenezerdigital.com" | head -n 3
curl -sI "https://tools.ebenezerdigital.com/" | head -n 3
echo "Done. Hard-refresh browser (Ctrl+Shift+R) if CSS still looks wrong."
