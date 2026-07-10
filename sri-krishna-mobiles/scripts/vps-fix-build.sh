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

echo "Fixing webhook: statusHistory -> timeline"
sed -i 's/\.statusHistory/.timeline/g' src/app/api/payment/webhook/route.ts
sed -i 's/note:/description:/g' src/app/api/payment/webhook/route.ts

echo "Adding missing Razorpay fields to Order.ts (if not already present)"
if ! grep -q 'razorpayPaymentId' src/models/Order.ts; then
  sed -i '/paymentId?: string;/a\
  razorpayOrderId?: string;\
  razorpayPaymentId?: string;\
  razorpaySignature?: string;\
  paidAt?: Date;\
  amountPaid?: number;\
  failureReason?: string;' src/models/Order.ts
  sed -i '/paymentId: String,/a\
  razorpayOrderId: String,\
  razorpayPaymentId: String,\
  razorpaySignature: String,\
  paidAt: Date,\
  amountPaid: Number,\
  failureReason: String,' src/models/Order.ts
fi

# Fix RazorpayButton missing options (if build fails on RazorpayOptions)
if [ -f src/components/RazorpayButton.tsx ] && ! grep -q 'currency: "INR"' src/components/RazorpayButton.tsx; then
  sed -i '/order_id: razorpayOrderId,/a\
        currency: "INR",\
        prefill: { email, name: name || undefined },\
        notes: {},\
        theme: { color: "#4F46E5" },' src/components/RazorpayButton.tsx
fi

# Fix auth.ts: user.password may be undefined (OAuth users)
if [ -f src/lib/auth.ts ] && ! grep -q 'if (!user.password)' src/lib/auth.ts; then
  sed -i '/const isPasswordValid = await bcrypt.compare/i\
        if (!user.password) {\
          throw new Error("Invalid email or password");\
        }\
' src/lib/auth.ts
fi

echo "Building..."
npm run build

echo "Done. Start with: cd /home/dani && pm2 start ecosystem.config.js --only sri-krishna-mobiles"
