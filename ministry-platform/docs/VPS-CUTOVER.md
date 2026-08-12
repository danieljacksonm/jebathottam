# VPS cutover — Node replaces PHP

Keep the PHP site live until staging QA passes. Then point DNS to this VPS.

## 1. Server packages

```bash
sudo apt update
sudo apt install -y nginx mysql-server certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2
```

## 2. App + env

```bash
git clone <your-repo> /var/www/ministry-platform
cd /var/www/ministry-platform
cp env.example .env.production
# Edit .env.production — set DATABASE_URL, JWT_SECRET, SMTP_*, PRAYER_API_TOKEN, CRON_SECRET
# Leave SETUP_ADMIN_SECRET empty after first admin bootstrap
npm ci
```

## 3. Database migrations (run once)

```bash
mysql -u USER -p DB_NAME < prisma/migrations/add_blog_seo.sql
mysql -u USER -p DB_NAME < prisma/migrations/add_attendance.sql
mysql -u USER -p DB_NAME < prisma/migrations/add_carmel.sql
mysql -u USER -p DB_NAME < prisma/migrations/add_prayer_collector.sql
mysql -u USER -p DB_NAME < prisma/migrations/add_youtube_videos.sql
# Optional seed:
mysql -u USER -p DB_NAME < scripts/seed-carmel-slots.sql
npx prisma generate
```

## 4. Migrate PHP content

```bash
export PHP_DATABASE_URL='mysql://phpuser:pass@127.0.0.1/php_db'
export DATABASE_URL='mysql://nodeuser:pass@127.0.0.1/node_db'
# Optional dry run:
DRY_RUN=1 node scripts/migrate-from-php.js
node scripts/migrate-from-php.js
```

Copy stock images from PHP `images/blog-stock/` and OG images into Node `public/images/`.

## 5. Build + PM2

```bash
export NEXT_PUBLIC_BUILD_TIME=$(date -Iseconds)
npm run build
pm2 start npm --name ministry-app -- start
pm2 save
pm2 startup
```

Health check: `curl -I http://127.0.0.1:3000`

## 6. Nginx + HTTPS

Copy `docs/nginx-ministry.conf` to `/etc/nginx/sites-available/ministry`, enable it, then:

```bash
sudo ln -s /etc/nginx/sites-available/ministry /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d jesusisthewayjebathottam.com -d www.jesusisthewayjebathottam.com
```

Staging tip: use `staging.jesusisthewayjebathottam.com` first, complete QA, then switch apex/www A records.

## 7. Deploy updates

```bash
cd /var/www/ministry-platform && bash scripts/deploy-vps.sh
```

## 8. Rollback window

Keep PHP hosting + DB dump for 1–2 weeks. If Node fails, point DNS back to PHP host.
