#!/bin/bash
# Manual deployment script for all three sites
# Run this on your VPS to deploy the latest changes

echo "=== Deploying all sites from GitHub ==="

# Deploy Ministry Platform
echo "=== Deploying Ministry Platform ==="
cd /home/dani/ministry-platform
git pull origin main
rm -rf .next
npm ci
export NEXT_PUBLIC_BUILD_TIME=$(date -Iseconds)
npm run build
pm2 restart ministry-platform || pm2 start /home/dani/ecosystem.config.js --only ministry-platform

# Deploy Ebenezer Digital
echo "=== Deploying Ebenezer Digital ==="
cd /home/dani/ebenezer-digital
git pull origin main
rm -rf .next
npm ci
export NEXT_PUBLIC_BUILD_TIME=$(date -Iseconds)
npm run build
pm2 restart ebenezer-digital || pm2 start /home/dani/ecosystem.config.js --only ebenezer-digital

# Deploy Sri Krishna Mobiles
echo "=== Deploying Sri Krishna Mobiles ==="
cd /home/dani/sri-krishna-mobiles
git pull origin main
rm -rf .next
npm ci
export NEXT_PUBLIC_BUILD_TIME=$(date -Iseconds)
npm run build
pm2 restart sri-krishna-mobiles || pm2 start /home/dani/ecosystem.config.js --only sri-krishna-mobiles

# Save PM2 configuration
cd /home/dani
pm2 save

echo "=== All deployments completed! ==="
echo "Sites should now show the new designs."
echo "Do a hard refresh in browser (Ctrl+Shift+R) to see updates."
