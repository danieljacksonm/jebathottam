# Extra Ebenezer domains

## DNS (all point to same VPS IP)

| Domain | Type | Host | Value |
|--------|------|------|--------|
| ebenezerdigital.info | A | @ | VPS_IP |
| ebenezerdigital.info | A | www | VPS_IP |
| ebenezerdigital.store | A | @ | VPS_IP |
| ebenezerdigital.store | A | www | VPS_IP |
| ebenezerdigital.net | A | @ | VPS_IP |
| ebenezerdigital.net | A | www | VPS_IP |

## Purpose

| Domain | Purpose |
|--------|---------|
| ebenezerdigital.com | Main business site |
| ebenezerdigital.info | Blog (opens /blog) |
| ebenezerdigital.store | Redirect → /products (digital products later) |
| ebenezerdigital.net | Redirect → main site (client portal later) |

## VPS Nginx + SSL

Copy updated `nginx-all-sites.conf`, then issue HTTPS for `.info` and `.store`:

```bash
sudo cp /home/dani/test/nginx-all-sites.conf /etc/nginx/sites-available/all-sites
sudo nginx -t && sudo systemctl reload nginx

# Or one script:
bash /home/dani/test/scripts/enable-ssl-info-store.sh

# Manual certbot (same result):
sudo certbot --nginx -d ebenezerdigital.info -d www.ebenezerdigital.info --redirect
sudo certbot --nginx -d ebenezerdigital.store -d www.ebenezerdigital.store --redirect
```

`.store` must proxy to the app (not 301 to `.com`) or Let's Encrypt will fail.

## Deploy app updates (blog + portfolio images)

```bash
cd ~/ebenezer-digital
git pull
# if store.json old:
curl -L "https://raw.githubusercontent.com/danieljacksonm/jebathottam/main/ebenezer-digital/data/store.json" -o data/store.json
# sync images + blog pages from repo if needed
npm run build
pm2 restart ebenezer-digital --update-env
```

Test:
- https://ebenezerdigital.com/blog
- https://ebenezerdigital.info  (should open blog)
- https://ebenezerdigital.store (should go to products)
- https://ebenezerdigital.net (should go to main site)
