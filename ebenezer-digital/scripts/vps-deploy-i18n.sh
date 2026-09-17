#!/usr/bin/env bash
# Deploy multilingual + indexing updates on VPS. Run from ~/ebenezer-digital
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Pull latest"
git pull

echo "==> Install & build"
npm ci
npx prisma db push
npm run build

echo "==> Seed editorial content (optional — needs DATABASE_URL)"
npm run seed:journal-pillars || true
npm run seed:cross-site-blogs || true

echo "==> Restart app only"
pm2 restart ebenezer-digital

echo "Done. Verify:"
echo "  curl -sI https://ebenezerdigital.com/sitemap.xml | head -5"
echo "  curl -sI https://journal.ebenezerdigital.info/blog/learn-dns-how-it-works | grep -i robots"
