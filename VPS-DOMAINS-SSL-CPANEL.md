# Your Own Domains, SSL, and cPanel on Your VPS

**Yes – you can have all of these on your VPS.**

---

## Your own domains

You can use **any domain you own** with your VPS.

1. **At your domain registrar** (IONOS, Namecheap, GoDaddy, Cloudflare, etc.):
   - Open DNS settings for the domain.
   - Add an **A record**:
     - **Name/host:** `@` (for root, e.g. `yourdomain.com`) and/or `www` (for `www.yourdomain.com`).
     - **Value / points to:** your VPS IPv4 address (e.g. `123.45.67.89`).
     - **TTL:** 300 or 3600 is fine.
   - Optional: add **AAAA** with your VPS IPv6 if you have one.

2. **On the VPS:** In Nginx you already use `server_name yourdomain.com www.yourdomain.com;` (see [VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md)). Once the A record points to your server, the domain will open your site.

**Multiple domains:** Add more A records (different domains or subdomains) pointing to the same IP, then add more Nginx server blocks (and SSL) for each. One VPS can serve many sites.

---

## SSL (HTTPS)

You can have **valid SSL certificates** on your VPS.

| Option | Cost | Notes |
|--------|------|--------|
| **Let's Encrypt (Certbot)** | Free | Recommended. Auto-renewal. See **Step 11** in [VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md). |
| **Cloudflare** | Free (or paid) | Put your site behind Cloudflare; they provide SSL to visitors. You can use “Full (strict)” and a free origin cert or Let's Encrypt on the VPS. |
| **Paid cert from registrar** | Paid | Buy from IONOS, Namecheap, etc., then install the cert in Nginx (or use a panel that supports it). |

For most cases, **Let's Encrypt + Certbot** is enough and is already covered in the main deployment guide.

---

## cPanel (and alternatives)

**cPanel** is a commercial control panel (websites, emails, DB, files via a web UI). You **can** use it on your VPS if you buy a license.

| Option | Cost | Notes |
|--------|------|--------|
| **cPanel** | ~\$15–\$20/month (license) | Full-featured; familiar to many hosts. Install on Ubuntu after purchasing a license from cPanel. |
| **Plesk** | Paid | Similar to cPanel; some hosts bundle it. |
| **Webmin** | Free | Web-based server admin (users, packages, firewall, files). See [WEBMIN-IONOS.md](./WEBMIN-IONOS.md). |
| **HestiaCP** | Free | Modern control panel (Apache/Nginx, PHP, mail, DB). Good free alternative to cPanel. |
| **CyberPanel** | Free | Uses LiteSpeed; includes email and DNS. |
| **VestaCP** | Free | Older but still used; similar idea to HestiaCP. |

So: **yes, you can have cPanel on the VPS** – just budget for the license. If you prefer no extra cost, use **Webmin** for server admin and keep managing the app (Nginx, PM2, Node) as in the deployment guide; or try **HestiaCP** for a more “hosting panel” feel.

---

## Summary

| Item | On your VPS? |
|------|----------------|
| **Your own domains** | Yes – point A (and AAAA) records to your VPS IP. |
| **SSL** | Yes – free with Let's Encrypt (Certbot) or Cloudflare; paid certs optional. |
| **cPanel** | Yes – with a paid cPanel license; or use free Webmin / HestiaCP / CyberPanel. |

All of this runs on the same Ubuntu VPS (e.g. IONOS). The main guide [VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md) covers Nginx, Certbot, and the app; this doc only clarifies domains, SSL, and panels.
