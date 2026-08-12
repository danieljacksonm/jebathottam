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

## VPS Nginx

Copy updated `nginx-all-sites.conf` blocks for `.info`, `.store`, `.net`, then:

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d ebenezerdigital.info -d www.ebenezerdigital.info
sudo certbot --nginx -d ebenezerdigital.store -d www.ebenezerdigital.store
sudo certbot --nginx -d ebenezerdigital.net -d www.ebenezerdigital.net
```

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
