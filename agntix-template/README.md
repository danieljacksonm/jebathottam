# Canaan Travel Hub

Premium travel website for **Canaan Travel Hub** — starting with Kodaikanal packages and enquiry booking. Built with Next.js for VPS deployment.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- `next-intl` — English / Tamil / Hindi
- Framer Motion — subtle brand motion
- Standalone output — ready for Node on a VPS

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/en`).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

## VPS deploy (simple)

```bash
npm ci
npm run build
NODE_ENV=production node .next/standalone/server.js
```

Also copy static assets next to standalone (Next docs):

```bash
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
```

Serve on port 3000 behind Nginx/Caddy. Enquiries are appended to `data/enquiries.jsonl` on the server.

## Brand

Logo: `public/brand/canaan-logo.jpeg`  
Slogan: *Cross Borders. Discover Blessings.*  
Palette: deep navy + metallic gold
