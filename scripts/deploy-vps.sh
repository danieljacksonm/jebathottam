#!/bin/bash
# Run this on your VPS (e.g. in ~/ministry-platform) to deploy updates.
# Usage: ./scripts/deploy-vps.sh   or   bash scripts/deploy-vps.sh

set -e
cd "$(dirname "$0")/.."

echo ">>> Pulling latest code..."
git pull

echo ">>> Installing dependencies..."
npm install

echo ">>> Building..."
npm run build

echo ">>> Restarting app with PM2..."
pm2 restart ministry-app || pm2 start npm --name "ministry-app" -- start

echo ">>> Done. Check: pm2 status && pm2 logs ministry-app"
