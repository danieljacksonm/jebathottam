# Yegova Billing — VPS Deployment Guide

This guide explains how to run the `yegova-saas` billing app on your Ubuntu VPS
alongside the main `ebenezer-digital` website.

---

## 1. Upload the project to your VPS

From your Windows machine, push to GitHub first (or use `scp`):

```bash
# On Windows (PowerShell) — push yegova-saas to its own GitHub repo
cd D:\Daniel\testing\data\traders\yegova-saas
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USERNAME/yegova-saas.git
git push -u origin main
```

Then on your VPS:

```bash
cd /home/dani
git clone https://github.com/YOUR_USERNAME/yegova-saas.git
cd yegova-saas
npm install
```

---

## 2. Set up the database

```bash
cd apps/api
npx prisma db push
npx prisma generate
cd ../..
```

This creates a `dev.db` SQLite file in `apps/api/prisma/`.

---

## 3. Configure environment

Create `apps/api/.env`:

```env
PORT=4000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=change-this-to-a-long-random-string
```

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://billing.ebenezerdigital.com/api
```

---

## 4. Build the web app

```bash
cd apps/web
npm run build
cd ../..
```

---

## 5. Start with PM2

```bash
# Start the NestJS API on port 4000
pm2 start "npm run start:prod -w @yegova/api" --name yegova-api --cwd /home/dani/yegova-saas

# Start the Next.js web on port 3001 (main site uses 3000)
pm2 start "npm run start -w @yegova/web -- -p 3001" --name yegova-web --cwd /home/dani/yegova-saas

pm2 save
pm2 startup
```

---

## 6. Nginx — subdomain setup

Add a new Nginx config for `billing.ebenezerdigital.com`:

```nginx
# /etc/nginx/sites-available/billing.ebenezerdigital.com
server {
    listen 80;
    server_name billing.ebenezerdigital.com;

    # Next.js web
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # NestJS API
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and get SSL:

```bash
sudo ln -s /etc/nginx/sites-available/billing.ebenezerdigital.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d billing.ebenezerdigital.com
```

---

## 7. DNS

In your domain registrar (or Cloudflare), add an **A record**:

| Name      | Type | Value          |
|-----------|------|----------------|
| billing   | A    | YOUR_VPS_IP    |

---

## 8. Update main site env

In `/home/dani/ebenezer-digital/.env.local`, add:

```env
NEXT_PUBLIC_BILLING_URL=https://billing.ebenezerdigital.com
```

Then restart:

```bash
pm2 restart ebenezer-digital --update-env
```

---

## Done

Your Yegova Billing app will be live at `https://billing.ebenezerdigital.com`.
The `/saas` page on the main site now links to it automatically.
