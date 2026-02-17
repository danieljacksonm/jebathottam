# Start Your VPS Now – Checklist

Use this as your **first-time setup** order. Full details are in **[VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md)**.

---

## Before You Begin

- [ ] You have a **VPS** (e.g. IONOS) with **Ubuntu 22.04** and its **IP address**.
- [ ] You can open a terminal (PowerShell on Windows, Terminal on Mac/Linux).

---

## Step 1 – Connect via SSH

From your computer:

```bash
ssh root@YOUR_SERVER_IP
```

(Replace `YOUR_SERVER_IP` with the VPS IP, e.g. `123.45.67.89`. Use the password from your host.)

---

## Step 2 – Create Deploy User (recommended)

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

Use `deploy` for the rest of the steps.

---

## Step 3 – Update System & Install Node, Git, UFW

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

---

## Step 4 – Install MySQL and Create DB

```bash
sudo apt install -y mysql-server
sudo systemctl start mysql && sudo systemctl enable mysql
sudo mysql_secure_installation
```

Then create database and user:

```bash
sudo mysql -u root -p
```

In the MySQL prompt, run (use a **strong password** instead of `YOUR_STRONG_PASSWORD`):

```sql
CREATE DATABASE ministry_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ministry_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON ministry_platform.* TO 'ministry_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Step 5 – Clone Repo and Add Env

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ministry-platform
cd ministry-platform
```

If the repo is **private**, use a token in the URL or upload the project another way.

Create env file:

```bash
nano .env.production
```

Paste (replace values with yours):

```env
NODE_ENV=production
DB_HOST=localhost
DB_USER=ministry_user
DB_PASSWORD=YOUR_STRONG_PASSWORD
DB_NAME=ministry_platform
DB_SSL=false
JWT_SECRET=REPLACE_WITH_OPENSSL_RAND_BASE64_32
NEXT_PUBLIC_API_URL=https://YOUR_DOMAIN_OR_IP
```

Generate JWT secret on the server: `openssl rand -base64 32` and paste the output as `JWT_SECRET`.  
Save: `Ctrl+O`, Enter, `Ctrl+X`.

---

## Step 6 – Import Schema and Build App

```bash
mysql -u ministry_user -p ministry_platform < database/schema.sql
npm install
npm run build
```

---

## Step 7 – Run App with PM2

```bash
sudo npm install -g pm2
pm2 start npm --name "ministry-app" -- start
pm2 save
pm2 startup
```

Run the command that `pm2 startup` prints (the `sudo env PATH=...` line).  
Check: `pm2 status` and `curl -I http://localhost:3000`.

---

## Step 8 – Install Nginx and Proxy to Next.js

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/ministry
```

Paste (use your domain or server IP for `server_name`):

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

If you don’t have a domain yet, use: `server_name YOUR_SERVER_IP;`

Enable and reload:

```bash
sudo ln -sf /etc/nginx/sites-available/ministry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 9 – Open Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Step 10 – Test Your Site

- In the browser open: **http://YOUR_SERVER_IP** (or http://yourdomain.com if DNS already points to the IP).
- You should see the ministry site. Open **/login** and sign in with **admin@ministry.com** / **admin123**, then change the password.

---

## Step 11 – Add SSL (when domain points to this server)

Point your domain’s **A record** to the VPS IP, then:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Update `.env.production`: set `NEXT_PUBLIC_API_URL=https://yourdomain.com/api`, then:

```bash
cd ~/ministry-platform
npm run build
pm2 restart ministry-app
```

---

## After Setup – Deploy Updates

When you push new code, on the VPS:

```bash
cd ~/ministry-platform
./scripts/deploy-vps.sh
```

Or manually: `git pull && npm install && npm run build && pm2 restart ministry-app`.

---

## Quick Reference

| Task            | Command |
|-----------------|--------|
| Connect SSH     | `ssh deploy@YOUR_SERVER_IP` |
| App status      | `pm2 status` |
| App logs        | `pm2 logs ministry-app` |
| Restart app     | `pm2 restart ministry-app` |
| Nginx reload    | `sudo systemctl reload nginx` |

For more detail, domains, SSL options, and troubleshooting, see **[VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md)** and **[VPS-DOMAINS-SSL-CPANEL.md](./VPS-DOMAINS-SSL-CPANEL.md)**.
