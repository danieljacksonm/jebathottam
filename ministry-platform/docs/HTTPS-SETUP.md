# HTTPS for site, Webmin, and phpMyAdmin

This guide puts everything behind HTTPS on your VPS: the main app, Webmin, and phpMyAdmin, using **Nginx** as the SSL terminator and **Let's Encrypt** for free certificates.

---

## Prerequisites

- **A domain name** pointing to your VPS IP (A records). Let's Encrypt does not issue certs for raw IPs.
  - Example: `app.example.com` → your VPS IP  
  - Optional: `webmin.example.com`, `pma.example.com` (or one domain with different paths; subdomains are simpler).
- **Nginx** installed and your main site already proxied (e.g. port 80 → Node 3000).
- **Webmin** on port 10000, **phpMyAdmin** on port 8080 (or your current setup).

---

## 1. Install Certbot and get certificates

On the VPS:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

Get one certificate covering all hostnames you will use (replace with your domain and subdomains):

```bash
sudo certbot certonly --nginx -d app.example.com -d webmin.example.com -d pma.example.com
```

Or one cert per service:

```bash
sudo certbot certonly --nginx -d app.example.com
sudo certbot certonly --nginx -d webmin.example.com
sudo certbot certonly --nginx -d pma.example.com
```

Certificates and keys will be under `/etc/letsencrypt/live/<domain>/`.

---

## 2. Nginx: HTTPS for main site

Use one Nginx config per service (sites-available/sites-enabled style) or one file with multiple `server` blocks.

**Main site (Next.js)** – create or edit e.g. `/etc/nginx/sites-available/app`:

```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name app.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and reload:

```bash
sudo ln -sf /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Your app will see `X-Forwarded-Proto: https`, so the login cookie can use `Secure` correctly.

---

## 3. Nginx: HTTPS for Webmin

Webmin runs on port 10000 (usually with its own self-signed HTTPS). Put Nginx in front so users only talk to Nginx over HTTPS.

Create `/etc/nginx/sites-available/webmin`:

```nginx
server {
    listen 80;
    server_name webmin.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name webmin.example.com;

    ssl_certificate     /etc/letsencrypt/live/webmin.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/webmin.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass https://127.0.0.1:10000;
        proxy_ssl_verify off;
        proxy_ssl_server_name on;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        proxy_buffering off;
    }
}
```

Enable and reload:

```bash
sudo ln -sf /etc/nginx/sites-available/webmin /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

- **Optional:** Restrict Webmin to localhost so it’s only reachable via Nginx (in Webmin: Webmin → Webmin Configuration → Networking → “Only allow connections from” → `127.0.0.1`). Then in firewall allow only 80/443, not 10000.

---

## 4. Nginx: HTTPS for phpMyAdmin

If phpMyAdmin is served by Nginx on port 8080, add an HTTPS server block and proxy to the same backend (or to the existing listen socket).

Example `/etc/nginx/sites-available/phpmyadmin`:

```nginx
server {
    listen 80;
    server_name pma.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pma.example.com;

    ssl_certificate     /etc/letsencrypt/live/pma.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pma.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /usr/share/phpmyadmin;
    index index.php;

    location / {
        try_files $uri $uri/ =404;
    }
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;   # or php8.1-fpm.sock
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

If phpMyAdmin is currently on port 8080 via Nginx, you can instead add a second `server` block in that file listening on 443 with SSL and the same `location` blocks, and keep 8080 only for localhost or remove it. Enable and reload:

```bash
sudo ln -sf /etc/nginx/sites-available/phpmyadmin /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. Firewall

Allow HTTPS and (optionally) HTTP for redirects and Certbot:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

If you locked Webmin to localhost and everything is behind Nginx, you can stop allowing 10000 and 8080 from the internet:

```bash
sudo ufw delete allow 10000/tcp   # if you had it
sudo ufw delete allow 8080/tcp    # if you had it
```

Reload UFW and re-check:

```bash
sudo ufw status
```

---

## 6. Auto-renewal (Let's Encrypt)

Certbot installs a timer. Test and ensure it runs:

```bash
sudo certbot renew --dry-run
```

Renewal will reload Nginx if you use the `certbot` + `nginx` plugin (e.g. `certbot renew --nginx` in a cron or the default certbot timer).

---

## 7. If you don’t have a domain (self-signed HTTPS)

Let's Encrypt cannot issue for an IP. You can still use HTTPS with a **self-signed** certificate; browsers will show a warning you must accept.

Generate a self-signed cert:

```bash
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/selfsigned.key \
  -out /etc/nginx/ssl/selfsigned.crt \
  -subj "/CN=YOUR_VPS_IP"
```

In your Nginx `server` blocks for 443, use:

```nginx
ssl_certificate     /etc/nginx/ssl/selfsigned.crt;
ssl_certificate_key /etc/nginx/ssl/selfsigned.key;
```

You can use the same self-signed cert for the main site, Webmin (via Nginx proxy), and phpMyAdmin. Access with `https://YOUR_IP` (and optionally `https://YOUR_IP:443` for Webmin/phpMyAdmin if you use different server blocks or ports). For Webmin’s own port 10000, you can either keep its built-in self-signed cert or point it to this file in Webmin → Webmin Configuration → SSL.

---

## Summary

| Service      | Before              | After                        |
|-------------|---------------------|------------------------------|
| Main site   | http://IP or :80    | https://app.example.com      |
| Webmin      | https://IP:10000    | https://webmin.example.com   |
| phpMyAdmin  | http://IP:8080      | https://pma.example.com      |

- Use **one domain + subdomains** (e.g. app / webmin / pma) and one Certbot cert with multiple `-d` options, or one cert per subdomain.
- **Nginx** terminates SSL and proxies to Node (3000), Webmin (10000), and phpMyAdmin (PHP-FPM or 8080).
- With this, the main app sees `X-Forwarded-Proto: https`, so the auth cookie can be set with `Secure` and login will persist over HTTPS.
