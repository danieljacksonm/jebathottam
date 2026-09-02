# Yegova Billing on saas.ebenezerdigital.com

Full billing (Invoice Studio, GST, stock, party ledger) runs on **the same subdomain** as marketing:

| Path | Backend | PM2 process |
|------|---------|-------------|
| `/` | Ebenezer marketing (`/saas`) | `ebenezer-digital` :3000 |
| `/login`, `/register`, `/app/*` | Yegova Next app | `yegova-web` :3001 |
| `/api/*` | Yegova NestJS API | `yegova-api` :4000 |

Marketing CTAs point to `/login` and `/register` (not the old stub `/saas/login`).

---

## 1. Sync yegova-saas to VPS

From the monorepo (already at `~/jebathottam/ebenezer-digital/yegova-saas`):

```bash
rsync -a --delete --exclude node_modules --exclude apps/api/prisma/dev.db \
  ~/jebathottam/ebenezer-digital/yegova-saas/ /home/dani/yegova-saas/
cd /home/dani/yegova-saas && npm install
```

---

## 2. Database & env

```bash
cd /home/dani/yegova-saas/apps/api
npx prisma db push
npx prisma generate
```

**`/home/dani/yegova-saas/apps/api/.env`**

```env
PORT=4000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=<long-random-string>
FRONTEND_URL=https://saas.ebenezerdigital.com
```

**`/home/dani/yegova-saas/apps/web/.env.local`**

```env
NEXT_PUBLIC_API_URL=https://saas.ebenezerdigital.com/api
```

---

## 3. Build

```bash
cd /home/dani/yegova-saas
npm run build -w @yegova/api
npm run build -w @yegova/web
```

---

## 4. PM2

```bash
pm2 start "npm run start:prod -w @yegova/api" --name yegova-api --cwd /home/dani/yegova-saas
pm2 start "npm run start -w @yegova/web -- -p 3001" --name yegova-web --cwd /home/dani/yegova-saas
pm2 save
```

---

## 5. Nginx (saas host)

Update the `saas.ebenezerdigital.com` server block — see `nginx-info-store.conf` in this repo (path split for `/api/`, `/app`, `/login`, `/register` → 3001/4000; `/` → 3000).

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 6. Main site env

**`/home/dani/ebenezer-digital/.env.local`**

```env
NEXT_PUBLIC_BILLING_URL=https://saas.ebenezerdigital.com
```

Remove any line still pointing at `canaantravelhub.com` in `.env.local` (build logs show it may still be there).

Rebuild main site:

```bash
cd /home/dani/ebenezer-digital
npm ci && npm run build
pm2 restart ebenezer-digital --update-env
```

---

## 7. Fix OOM crashes (5481 restarts)

PM2 logs show **JavaScript heap out of memory**, not Redis failure.

```bash
pm2 delete ebenezer-digital
pm2 start npm --name ebenezer-digital --cwd /home/dani/ebenezer-digital \
  --node-args="--max-old-space-size=768" -- start
pm2 save
```

Or use `ecosystem.config.cjs` in this repo.

---

## Verify

1. https://saas.ebenezerdigital.com — marketing landing  
2. https://saas.ebenezerdigital.com/register — Yegova register (shop signup)  
3. https://saas.ebenezerdigital.com/login — Yegova login  
4. After login → https://saas.ebenezerdigital.com/app — dashboard with Invoice Studio  
5. Old https://saas.ebenezerdigital.com/saas/login → redirects to `/login`
