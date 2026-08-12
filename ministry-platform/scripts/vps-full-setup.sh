#!/bin/bash
# One-command VPS setup for ministry-platform
# Usage:
#   cd /var/www/ministry-platform
#   bash scripts/vps-full-setup.sh
#
# Optional env before run:
#   APP_NAME=ministry-app
#   PULL_LATEST=1
#   PHP_DATABASE_URL=mysql://user:pass@host/php_db
#   PHP_SITE_PATH=/var/www/php-site
#
# Required DB env for SQL migration step:
#   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

set -euo pipefail

APP_NAME="${APP_NAME:-ministry-app}"
PULL_LATEST="${PULL_LATEST:-0}"

echo "=== VPS Full Setup Start ==="

if [ ! -f "package.json" ]; then
  echo "ERROR: Run this inside the Node app folder (package.json missing)."
  exit 1
fi

# Load env files if vars are not exported already
set -a
[ -f .env.production ] && . ./.env.production
[ -f .env.local ] && . ./.env.local
[ -f .env ] && . ./.env
set +a

if [ "$PULL_LATEST" = "1" ]; then
  echo "Pulling latest code from origin/main..."
  git fetch origin main
  git reset --hard origin/main
fi

echo "Installing dependencies..."
npm ci
npx prisma generate

echo "Running SQL migration files..."
: "${DB_HOST:?Missing DB_HOST}"
: "${DB_PORT:?Missing DB_PORT}"
: "${DB_USER:?Missing DB_USER}"
: "${DB_PASSWORD:?Missing DB_PASSWORD}"
: "${DB_NAME:?Missing DB_NAME}"

MYSQL_CMD=(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "-p$DB_PASSWORD" "$DB_NAME")

for sql in \
  prisma/migrations/add_blog_seo.sql \
  prisma/migrations/add_attendance.sql \
  prisma/migrations/add_carmel.sql \
  prisma/migrations/add_prayer_collector.sql \
  prisma/migrations/add_youtube_videos.sql
do
  if [ -f "$sql" ]; then
    echo "Applying $sql"
    "${MYSQL_CMD[@]}" < "$sql"
  else
    echo "WARNING: $sql not found (skip)"
  fi
done

if [ -f "scripts/seed-carmel-slots.sql" ]; then
  echo "Applying scripts/seed-carmel-slots.sql"
  "${MYSQL_CMD[@]}" < scripts/seed-carmel-slots.sql
fi

if [ -n "${PHP_DATABASE_URL:-}" ]; then
  echo "Running PHP -> Node data migration script..."
  node scripts/migrate-from-php.js
else
  echo "PHP_DATABASE_URL not set. Skipping DB content migration."
fi

if [ -n "${PHP_SITE_PATH:-}" ] && [ -d "${PHP_SITE_PATH}" ]; then
  echo "Copying image assets from PHP site path..."
  mkdir -p public/images/blog-stock
  if [ -d "${PHP_SITE_PATH}/images/blog-stock" ]; then
    cp -r "${PHP_SITE_PATH}/images/blog-stock/." public/images/blog-stock/
  fi
  mkdir -p public/images
  for f in og-youth.jpg og-youth.png og-youth.webp og-carmel.jpg og-carmel.png og-carmel.webp; do
    if [ -f "${PHP_SITE_PATH}/images/$f" ]; then
      cp "${PHP_SITE_PATH}/images/$f" public/images/
    fi
  done
else
  echo "PHP_SITE_PATH not set/found. Skipping image copy."
fi

echo "Building Next.js app..."
export NEXT_PUBLIC_BUILD_TIME
NEXT_PUBLIC_BUILD_TIME="$(date -Iseconds)"
npm run build

echo "Restarting PM2 app: $APP_NAME"
pm2 restart "$APP_NAME" || pm2 start npm --name "$APP_NAME" -- start
pm2 save

echo "Running health check..."
sleep 2
if curl -fsS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ | grep -Eq '200|301|302|308'; then
  echo "=== Setup complete. App is healthy. ==="
else
  echo "ERROR: Health check failed on http://127.0.0.1:3000/"
  exit 1
fi
