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

## VPS deploy

Pages read destinations and blogs from SQLite at runtime. That file is not in git, so a pull alone does not update the catalogue. After the new code is on the server (`/home/dani/agntix-template`):

```bash
cd /home/dani/agntix-template
bash scripts/vps-deploy.sh
```

The script installs dependencies, writes `DATABASE_URL` into `.env` if missing, seeds `prisma/data/content.db`, builds standalone, and copies `public` plus `.next/static`. It does not overwrite `.env.production.local` (SMTP).

Start from the app root so enquiries still append to `data/enquiries.jsonl`:

```bash
NODE_ENV=production PORT=3000 node .next/standalone/server.js
```

Optional systemd unit: `scripts/canaan-travel-hub.service` (install with `sudo cp` into `/etc/systemd/system/`, then `sudo systemctl enable --now canaan-travel-hub`). If that unit is already active, the deploy script restarts it.

Serve on port 3000 behind Nginx/Caddy.

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
