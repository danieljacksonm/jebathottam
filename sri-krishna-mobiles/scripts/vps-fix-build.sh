#!/bin/bash
# Run on VPS inside sri-krishna-mobiles folder:
#   cd /home/dani/sri-krishna-mobiles && bash scripts/vps-fix-build.sh
set -e
cd "$(dirname "$0")/.."

echo "Fixing payment status: completed -> captured"
sed -i 's/order\.payment\.status = "completed"/order.payment.status = "captured"/g' src/app/api/payment/verify/route.ts
sed -i 's/orderDoc\.payment\.status = "completed"/orderDoc.payment.status = "captured"/g' src/app/api/payment/webhook/route.ts
sed -i 's/!== "completed"/!== "captured"/g' src/app/api/payment/webhook/route.ts

echo "Removing deprecated webhook config export"
sed -i '/^\/\/ Disable body parsing for webhook/,/^};$/d' src/app/api/payment/webhook/route.ts

echo "Building..."
npm run build

echo "Done. Start with: cd /home/dani && pm2 start ecosystem.config.js --only sri-krishna-mobiles"
