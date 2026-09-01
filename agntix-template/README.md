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

## Production

- **Primary domain:** [https://canaantravelhub.com](https://canaantravelhub.com)
- **Redirects:** `www.canaantravelhub.com` → primary domain
- **Contact:** +91 70927 71754 · [managingdirector@canaantravelhub.com](mailto:managingdirector@canaantravelhub.com)
- **Facebook:** [Canaan Travel Hub](https://www.facebook.com/share/14mvJi3ZWV8/)

Set before build:

```bash
export NEXT_PUBLIC_SITE_URL=https://canaantravelhub.com
```

### Enquiry email alerts

Create `/home/dani/agntix-template/.env.production.local` on the VPS:

```bash
ENQUIRY_NOTIFY_EMAIL=managingdirector@canaantravelhub.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-app-password
SMTP_FROM=Canaan Travel Hub <managingdirector@canaantravelhub.com>
```

Enquiries are still saved to `data/enquiries.jsonl` even if SMTP is not configured.

## Brand

Logo: `public/brand/canaan-logo.jpeg`  
Slogan: *Cross Borders. Discover Blessings.*  
Palette: deep navy + metallic gold
