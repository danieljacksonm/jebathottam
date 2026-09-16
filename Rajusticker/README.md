# Raju Stickers

Premium car wrap and vinyl sticker e-commerce storefront built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain for SEO (sitemap, robots, Open Graph) |
| `AI_API_KEY` / `AI_API_URL` / `AI_MODEL` | Optional AI recommendations (falls back to catalogue matching) |
| `RAZORPAY_*` / `STRIPE_*` | Optional payment gateways |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | Optional analytics |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint

## Product images

Original promotional assets live in `public/products/`. Source WhatsApp exports are kept in `_assets_temp/` for reference.
