#!/bin/bash
set -euo pipefail
cd /home/dani/ebenezer-digital
echo "=== START $(date) ==="
git fetch origin main
git reset --hard origin/main
git log -1 --oneline
npm install --legacy-peer-deps
export NEXT_PUBLIC_BUILD_TIME
NEXT_PUBLIC_BUILD_TIME="$(date -Iseconds)"
npm run build
if pm2 describe ebenezer-digital >/dev/null 2>&1; then
  pm2 restart ebenezer-digital
else
  pm2 start /home/dani/ecosystem.config.js --only ebenezer-digital
fi
pm2 save
echo "DEPLOY_OK $(date)"
echo "=== COMMIT ==="
git log -1 --oneline
echo "=== PM2 ==="
pm2 list
