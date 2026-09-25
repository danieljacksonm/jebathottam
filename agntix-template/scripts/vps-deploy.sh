#!/usr/bin/env bash
# Run on the VPS from the app directory after the new code is on the server.
# Does not touch SMTP secrets in .env.production.local.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

DB_FILE="$APP_DIR/prisma/data/content.db"
export DATABASE_URL="file:${DB_FILE}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://canaantravelhub.com}"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}"

mkdir -p "$APP_DIR/prisma/data" "$APP_DIR/data"

if [[ ! -f "$APP_DIR/.env" ]] || ! grep -q '^DATABASE_URL=' "$APP_DIR/.env"; then
  printf '\nDATABASE_URL="%s"\n' "$DATABASE_URL" >> "$APP_DIR/.env"
  echo "Wrote DATABASE_URL to .env"
fi

echo "Installing dependencies (includes Prisma 6 CLI)…"
# Do not use bare `npx prisma` — that downloads Prisma 7, which rejects this schema.
if ! npm ci --include=dev; then
  echo "Lockfile out of sync; falling back to npm install"
  npm install --include=dev
fi

echo "Seeding catalogue (skips blogs that already exist)…"
./node_modules/.bin/prisma generate
./node_modules/.bin/prisma db push
node prisma/seed.mjs

echo "Syncing travel packages + featured editorial guides…"
npx --yes tsx prisma/sync-packages.ts || true
node prisma/seed-editorial-guides.mjs || true
node prisma/translate-editorial-guides.mjs || true

if [[ -f "$APP_DIR/.env" ]] && ! grep -q '^ADMIN_PASSWORD=' "$APP_DIR/.env"; then
  echo "WARNING: ADMIN_PASSWORD is not set — /admin login will be unavailable until you add it to .env"
fi

echo "Building standalone server…"
./node_modules/.bin/next build --webpack

echo "Copying static assets into standalone…"
rm -rf .next/standalone/public .next/standalone/.next/static
cp -a public .next/standalone/public
mkdir -p .next/standalone/.next
cp -a .next/static .next/standalone/.next/static

echo
echo "Ready. Start from the app root so enquiries stay in data/:"
echo "  cd $APP_DIR"
echo "  DATABASE_URL=\"$DATABASE_URL\" NODE_ENV=production PORT=3000 node .next/standalone/server.js"
echo
if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet canaan-travel-hub; then
  echo "Restarting canaan-travel-hub…"
  sudo systemctl restart canaan-travel-hub
elif command -v pm2 >/dev/null 2>&1 && pm2 describe canaan-travel-hub >/dev/null 2>&1; then
  echo "Restarting pm2 process canaan-travel-hub…"
  pm2 restart canaan-travel-hub
else
  echo "No running canaan-travel-hub service found. Restart Node yourself after the build."
fi
