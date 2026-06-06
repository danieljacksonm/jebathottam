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
pm2 restart ministry-platform || pm2 start npm --name "ministry-platform" -- start

# Deploy Ebenezar Digital
echo "=== Deploying Ebenezar Digital ==="
cd /home/dani/ebenezer-digital
git pull origin main
rm -rf .next
npm ci
export NEXT_PUBLIC_BUILD_TIME=$(date -Iseconds)
npm run build
pm2 restart ebenezar || pm2 start npm --name "ebenezar" -- start

# Deploy Sri Krishna Mobiles
echo "=== Deploying Sri Krishna Mobiles ==="
cd /home/dani/sri-krishna-mobiles
git pull origin main
rm -rf .next
npm ci
export NEXT_PUBLIC_BUILD_TIME=$(date -Iseconds)
npm run build
pm2 restart mobiles || pm2 start npm --name "mobiles" -- start

# Save PM2 configuration
pm2 save

echo "=== All deployments completed! ==="
echo "Sites should now show the new designs."
echo "Do a hard refresh in browser (Ctrl+Shift+R) to see updates."
