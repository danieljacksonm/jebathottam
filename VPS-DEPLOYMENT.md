# Deploy to Your Linux VPS (Ubuntu 22.04)

This guide walks you through hosting your ministry platform on your own VPS (4 vCores, 8 GB RAM, 240 GB NVMe — **more than enough** for this site).

---

## Is This Server OK for Our Site?

**Yes.** Your stack is:

- **Next.js** (Node.js) – runs fine on 1–2 GB RAM
- **MySQL** – runs fine on 1–2 GB RAM
- **Nginx** – very light

With **4 vCores and 8 GB RAM** you have plenty of headroom for traffic growth and future features. You can also host the database on the same server (no need for a separate DB host like with Vercel).

---

## What We’ll Install

| Component   | Purpose                    |
|------------|----------------------------|
| Ubuntu 22.04 | Already on your VPS       |
| Node.js 20 LTS | Run Next.js              |
| MySQL 8 or MariaDB 10 | Database (on same server) |
| PM2        | Keep Next.js running & restart on reboot |
| Nginx      | Reverse proxy, SSL, static assets |
| Certbot    | Free SSL (HTTPS)          |
| Git        | Deploy from your repo     |

**Your own domains, SSL, and cPanel?** Yes – see **[VPS-DOMAINS-SSL-CPANEL.md](./VPS-DOMAINS-SSL-CPANEL.md)** for domains, SSL options, and cPanel (or free alternatives like Webmin).

---

## Step 1: Connect to Your VPS

From your computer:

```bash
ssh root@YOUR_SERVER_IP
```

(Replace `YOUR_SERVER_IP` with the IP from your host. Use the password or SSH key they gave you.)

---

## Step 2: Create a Non-Root User (Recommended)

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

Use this user for the rest of the guide (and daily use). Only use `root` when the guide says so.

---

## Step 3: Update System & Install Basics

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw
```

---

## Step 4: Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # should show v20.x
npm -v
```

---

## Step 5: Install MySQL (or MariaDB)

**Option A – MySQL 8:**

```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

- Set a strong root password and answer the prompts (e.g. no anonymous user, no remote root).

**Option B – MariaDB 10 (MySQL-compatible):**

```bash
sudo apt install -y mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo mysql_secure_installation
```

Create a database and user for the app:

```bash
sudo mysql -u root -p
```

In the MySQL shell:

```sql
CREATE DATABASE ministry_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ministry_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON ministry_platform.* TO 'ministry_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Replace `YOUR_STRONG_PASSWORD` with a real password. Save it somewhere safe; you’ll use it in the app’s env file.

Import your schema:

```bash
# If you have the schema file on the server (e.g. after cloning the repo):
mysql -u ministry_user -p ministry_platform < /home/deploy/ministry-platform/database/schema.sql
```

(Adjust path if your repo is cloned elsewhere.)

---

## Step 6: Clone Your Project on the Server

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ministry-platform
cd ministry-platform
```

If the repo is private, use a deploy key or personal access token in the URL, or copy the project via `scp`/rsync from your machine.

---

## Step 7: Environment Variables on the VPS

Create a production env file (never commit this file):

```bash
nano .env.production
```

Add (adjust values to match your DB user/password and domain):

```env
NODE_ENV=production

# Database (localhost – same server)
DB_HOST=localhost
DB_USER=ministry_user
DB_PASSWORD=YOUR_STRONG_PASSWORD
DB_NAME=ministry_platform
DB_SSL=false

# JWT – use a long random string (e.g. openssl rand -base64 32)
JWT_SECRET=your-long-random-secret-at-least-32-characters

# Public URL of your site (no trailing slash)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

Save and exit (`Ctrl+O`, Enter, `Ctrl+X`).

---

## Step 8: Build and Run with PM2

Install PM2 and build the app:

```bash
cd ~/ministry-platform
npm install
npm run build
```

Run Next.js with PM2 and save the process list so it restarts on reboot:

```bash
sudo npm install -g pm2
pm2 start npm --name "ministry-app" -- start
pm2 save
pm2 startup
```

Follow the command PM2 prints (usually run the `sudo env PATH=...` line).  
Your app is now running on **port 3000** (default for `next start`).

Check:

```bash
pm2 status
curl -I http://localhost:3000
```

---

## Step 9: Nginx as Reverse Proxy

Install Nginx and create a site config:

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/ministry
```

Paste (replace `yourdomain.com` with your real domain or server IP for testing):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/ministry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

If you don’t have a domain yet, use your server IP as `server_name` (e.g. `server_name 123.45.67.89;`). You can add a domain later and get SSL in Step 10.

---

## Step 10: Firewall

Allow SSH, HTTP, and HTTPS; enable UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Step 11: Free SSL (HTTPS) with Let’s Encrypt

Do this only when your domain already points to this server’s IP (A record).

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will adjust Nginx and renew certs automatically.

After SSL is active, set in `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

Then rebuild and restart:

```bash
cd ~/ministry-platform
npm run build
pm2 restart ministry-app
```

---

## Step 12: Deploy Updates (Simple Flow)

When you push new code, on the VPS run:

```bash
cd ~/ministry-platform
git pull
npm install
npm run build
pm2 restart ministry-app
```

Or use the included script (from the project root on the server):

```bash
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
```

---

## Webmin (Optional – Web Admin for Your Server)

To manage the server from a browser (users, packages, firewall, files), you can install **Webmin**. See **[WEBMIN-IONOS.md](./WEBMIN-IONOS.md)** for:

- Installing Webmin on Ubuntu 22.04  
- Opening port 10000 (UFW + IONOS firewall)  
- Accessing it at `https://YOUR_SERVER_IP:10000`  
- Logging in with your Linux user (e.g. `root`) and SSH password  

---

## Quick Reference: Paths & Commands

| Item            | Path / Command                    |
|-----------------|-----------------------------------|
| App directory   | `~/ministry-platform` (or your repo path) |
| Env file        | `~/ministry-platform/.env.production`     |
| PM2 list        | `pm2 status`                      |
| Restart app     | `pm2 restart ministry-app`       |
| Logs            | `pm2 logs ministry-app`          |
| Nginx config    | `/etc/nginx/sites-available/ministry`     |
| Nginx reload    | `sudo systemctl reload nginx`    |

---

## VPS vs Vercel (Short Comparison)

| Aspect        | VPS (your server)     | Vercel                |
|---------------|------------------------|------------------------|
| Cost          | $0 then $15/mo (your plan) | Free tier / paid plans |
| Database      | MySQL on same server  | Needs external DB      |
| Control       | Full (OS, Node, DB)   | Limited to app layer   |
| Maintenance   | You (or your dev)     | Handled by Vercel      |
| Scaling       | Manual / resize VPS   | Automatic              |
| SSL           | Certbot (free)        | Built-in               |

Your 4 vCores + 8 GB RAM are enough to run this site and MySQL on the same box. Moving from Vercel to this VPS is a valid and common choice.

---

## Troubleshooting

**Site not loading**

- `pm2 status` – app must be “online”.
- `curl http://localhost:3000` – if this works, the issue is Nginx or firewall.
- `sudo nginx -t` and `sudo systemctl status nginx`.

**502 Bad Gateway**

- Next.js not running or not on port 3000: `pm2 restart ministry-app` and check `pm2 logs ministry-app`.

**Database connection error**

- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `.env.production`.
- From the server: `mysql -u ministry_user -p ministry_platform -e "SELECT 1"`.

**Changes not showing**

- Rebuild and restart: `npm run build && pm2 restart ministry-app`.

---

## Security Checklist

- [ ] Strong password for DB user and for `deploy` (or SSH key only).
- [ ] `JWT_SECRET` long and random (e.g. `openssl rand -base64 32`).
- [ ] SSH: consider disabling password login and using keys only.
- [ ] Firewall (UFW) enabled, only needed ports open.
- [ ] Keep OS and packages updated: `sudo apt update && sudo apt upgrade`.
- [ ] Change default admin password in the app after first login.

---

You can use this VPS as your main hosting instead of Vercel; the server you described is suitable for your site.
