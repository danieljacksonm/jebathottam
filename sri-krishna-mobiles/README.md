# Sri Krishna Mobiles - E-Commerce Platform

A comprehensive e-commerce and POS system for mobile accessories retail, built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features

### Storefront
- Product catalog with infinite scroll, filters, and search
- Product detail pages with multi-image gallery and compatibility checker
- Shopping cart with persistent storage
- Step-by-step checkout with address management
- Order tracking with timeline status
- User accounts with order history and wishlist
- Razorpay payment integration

### Admin Panel
- Dashboard with KPIs, charts, and activity feed
- Product management (CRUD, bulk import, inventory)
- Order management with status updates
- Customer management with profiles and purchase history
- Inventory alerts for low stock
- Coupon/discount management
- Reports (sales, GST, products, customers)

### POS System
- Offline billing with localStorage persistence
- Product search with barcode support
- Multiple payment methods (cash, UPI, card, credit)
- Split payments
- GST calculation (18%)
- Thermal invoice printing (58mm/80mm)
- Returns and refunds
- Day-end summary with cash reconciliation
- WhatsApp bill sharing
- Keyboard shortcuts

### Notifications
- Email notifications via Nodemailer
- SMS notifications via Twilio/Fast2SMS/MSG91
- Order status updates
- OTP verification

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js with JWT
- **Payment:** Razorpay
- **Email:** Nodemailer
- **SMS:** Twilio / Fast2SMS / MSG91

## Environment Variables

Create a `.env.local` file with:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sri-krishna-mobiles

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS Provider (choose one)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# OR Fast2SMS (India)
FAST2SMS_API_KEY=your-fast2sms-api-key

# OR MSG91 (India)
MSG91_AUTH_KEY=your-msg91-key
MSG91_SENDER_ID=SKMOBS
```

## Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open the app:**
- Storefront: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- POS System: http://localhost:3000/pos

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (shop)/            # Storefront routes
│   ├── admin/             # Admin panel routes
│   ├── api/               # API routes
│   ├── pos/               # POS system routes
│   └── ...
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility libraries
│   ├── models/           # Mongoose models
│   ├── notifications/    # Email & SMS services
│   ├── db.ts            # Database connection
│   └── utils.ts         # Helper functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── public/               # Static assets
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/*` | ALL | NextAuth.js authentication |
| `/api/products` | GET | List products |
| `/api/orders` | GET/POST | Order management |
| `/api/payment/create` | POST | Create Razorpay order |
| `/api/payment/verify` | POST | Verify payment |
| `/api/payment/webhook` | POST | Razorpay webhooks |
| `/api/notifications` | POST | Send notifications |
| `/api/notifications/otp` | POST/PUT | OTP operations |

## POS Keyboard Shortcuts

| Key | Action |
|-----|--------|
| F1 | Show keyboard shortcuts help |
| F2 | Focus search box |
| F3 | Clear customer info |
| F4 | Add cash payment |
| F5 | Complete sale |
| F6 | Clear cart |
| Esc | Close modals |

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Self-Hosted

```bash
npm run build
npm start
```

## License

MIT License - Sri Krishna Mobiles
