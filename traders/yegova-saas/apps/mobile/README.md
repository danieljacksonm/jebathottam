# Ebenezer Mobile (Android + iOS)

**Website is free.** You only pay for the phone app.

| What | Price | Notes |
| --- | --- | --- |
| Website | **Free** | Full GST billing in the browser. Forever. |
| Online phone app | **$1 / month** | **One** 14-day trial only. Then pay, or the app **locks** (no bills). |
| Offline phone app | **$5 once** | Full shop on this phone. After download it **never** talks to the website. |

### Strict trial rules

- Trial starts once per phone
- Signing out / clearing login does **not** give a new trial
- When trial ends, shop screens stay locked until $1/month or $5 offline
- All save actions (bills, items, stock…) are blocked if unpaid
- Website remains free forever

Same tools on website and both apps: GST bills, quotes, returns, stock, udhaar, expenses, reports, share/print.

## Run (Windows)

1. API: `npm run dev:api` from `yegova-saas`
2. Mobile: `cd apps/mobile && npm start`
3. Real phone: `EXPO_PUBLIC_API_URL=http://YOUR_PC_LAN_IP:4000/api`

Store products (for EAS / Play / App Store later):

- `ebenezer_offline_lifetime` → $5
- `ebenezer_online_monthly` → $1 / month

Expo Go cannot take real card payment. In development the pay buttons unlock the app so you can test.
