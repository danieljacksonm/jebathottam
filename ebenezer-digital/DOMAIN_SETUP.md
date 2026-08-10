# Ebenezer Digital — connect ebenezerdigital.com
# Run these on the VPS after DNS A records point to this server.

## 1) DNS at IONOS (or your registrar)
# Type  Host   Value
# A     @      <YOUR_VPS_IP>
# A     www    <YOUR_VPS_IP>
# Wait 5–30 minutes (sometimes up to a few hours).

## 2) Update Nginx
# From your PC, push repo changes, then on VPS:

cd /home/dani
# If nginx config lives in repo:
# sudo cp /path/to/nginx-all-sites.conf /etc/nginx/sites-available/all-sites

# Or edit live nginx and add server_name:
#   ebenezerdigital.com www.ebenezerdigital.com ebenezar.yegova.store
# proxy_pass http://127.0.0.1:3000;

sudo nginx -t && sudo systemctl reload nginx

## 3) Set site URL env
cd /home/dani/ebenezer-digital
# Add or edit in .env:
# NEXT_PUBLIC_SITE_URL=https://ebenezerdigital.com

npm run build
pm2 restart ebenezer-digital

## 4) Free SSL
sudo certbot --nginx -d ebenezerdigital.com -d www.ebenezerdigital.com

## 5) Test
# https://ebenezerdigital.com
# https://www.ebenezerdigital.com
# https://ebenezerdigital.com/admin/login

## Optional later: redirect old subdomain
# server {
#   listen 80;
#   listen 443 ssl;
#   server_name ebenezar.yegova.store;
#   return 301 https://ebenezerdigital.com$request_uri;
# }
