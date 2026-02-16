# Deploy to Vercel First, Then Move to VPS (Same Database)

Use **one cloud database** for both. Deploy to **Vercel** first (fast), then when your VPS is ready deploy the app there using the **same database**. No data migration — just switch traffic from Vercel to VPS when you’re ready.

---

## Overview

| Step | What you do |
|------|-------------|
| 1 | Create **one** cloud MySQL database (PlanetScale or Railway). |
| 2 | Deploy the app to **Vercel** and connect it to that database. |
| 3 | Use the site on Vercel; VPS can wait. |
| 4 | When ready: deploy the **same app** on the **VPS** using the **same** DB credentials. |
| 5 | Point your domain to the VPS (DNS) and, if you want, stop using Vercel. |

The database stays in the cloud the whole time. Both Vercel and VPS connect to it with the same host, user, password, and database name.

---

## Phase 1: One Database + Vercel (Do This First)

### Step 1.1 – Create the cloud database (once)

Pick **one** host. This DB will be used by **Vercel now** and **VPS later**.

**Option A: PlanetScale (free tier, good for this)**

1. Sign up at [planetscale.com](https://planetscale.com).
2. **Create database** → name e.g. `ministry-platform` → Create.
3. Open the database → **Console** → paste and run the full content of your project’s **`database/schema.sql`**.
4. **Connect** → **Connect with** → **General** (or “Application”).
5. Copy and save:
   - **Host** (e.g. `xxx.psdb.cloud`)
   - **Username**
   - **Password** (generate and save it)
   - **Database** (often same as the DB name)
6. PlanetScale needs SSL → you’ll set **`DB_SSL=true`** everywhere (Vercel and VPS).

**Option B: Railway**

1. Sign up at [railway.app](https://railway.app).
2. **New Project** → **Add MySQL**.
3. Open the MySQL service → **Variables** or **Connect** → note **Host**, **User**, **Password**, **Database**.
4. Use Railway’s MySQL shell or a GUI to run **`database/schema.sql`**.
5. If Railway says SSL required, set **`DB_SSL=true`**; otherwise **`DB_SSL=false`**.

**Option C: IONOS database**

1. In IONOS: **Contracts** → **Products** → your **MySQL database** (or the one included with your package).
2. In the database product, open **Connection data** / **Access data** and note: **Host**, **User**, **Password**, **Database name**.
3. Run **`database/schema.sql`** using IONOS’s phpMyAdmin, HeidiSQL, or any MySQL client connected to that host.
4. For IONOS MySQL, use **`DB_SSL=false`** unless IONOS explicitly says “SSL” or “secure connection” is required (then set **`DB_SSL=true`**).

Save these somewhere safe: **DB_HOST**, **DB_USER**, **DB_PASSWORD**, **DB_NAME**, and **DB_SSL** (true or false).

---

### Step 1.2 – Push code to Git

On your computer, in the project folder:

```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

(Use your real branch name if it’s not `main`.)

---

### Step 1.3 – Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. **Import** your Git repo.
3. Before deploying, open **Environment Variables** and add:

   - **DB_HOST** = (from Step 1.1)
   - **DB_USER** = (from Step 1.1)
   - **DB_PASSWORD** = (from Step 1.1)
   - **DB_NAME** = (from Step 1.1)
   - **DB_SSL** = `true` for PlanetScale, or `false` if your host doesn’t need it
   - **JWT_SECRET** = long random string (e.g. run `openssl rand -base64 32` and paste the result)
   - **NEXT_PUBLIC_API_URL** = leave empty for now (you’ll set it after the first deploy)

4. Click **Deploy**.
5. When the deploy finishes, copy your app URL (e.g. `https://your-project.vercel.app`).
6. In Vercel → **Settings** → **Environment Variables** set:
   - **NEXT_PUBLIC_API_URL** = `https://your-project.vercel.app/api`
7. **Redeploy** (Deployments → … → Redeploy) so the new value is used.

Your app is now live on Vercel using the **cloud database**. You can use it and keep updating it here while the VPS is not ready.

---

### Step 1.4 – Change default admin password

1. Open `https://your-project.vercel.app/login`.
2. Log in with the default admin (e.g. from your schema/docs).
3. Change the password in the app or in the database.

---

## Phase 2: Later — Deploy on VPS Using the Same Database

When you’re ready to move to the VPS (or run both in parallel), deploy the app on the VPS but **keep using the same cloud database**. Do **not** install MySQL on the VPS for this app.

### Step 2.1 – Prepare the VPS (app only, no MySQL)

Follow your main VPS guide ([VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md)) **except**:

- **Skip** “Step 5: Install MySQL” (and any “create database” steps).
- Install: Node.js, Git, PM2, Nginx, Certbot (and optional Webmin). No local MySQL.

---

### Step 2.2 – Clone repo and set env on VPS

On the VPS (SSH):

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ministry-platform
cd ministry-platform
nano .env.production
```

In **`.env.production`** use the **same** database as Vercel:

```env
NODE_ENV=production

# Same cloud database as Vercel (from Phase 1)
DB_HOST=your-db-host-from-step-1.1
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=ministry_platform
DB_SSL=true

JWT_SECRET=same-as-vercel-or-new-long-random-string

# After you have a domain for the VPS:
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

Save and exit (e.g. Ctrl+O, Enter, Ctrl+X).

---

### Step 2.3 – Build and run on VPS

```bash
npm install
npm run build
sudo npm install -g pm2
pm2 start npm --name "ministry-app" -- start
pm2 save
pm2 startup
```

(If you use a different start command in your project, use that with PM2.)

---

### Step 2.4 – Nginx and SSL (optional but recommended)

- Configure Nginx to proxy to your Node app (e.g. port 3000) as in [VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md).
- Point your domain’s **A record** to the VPS IP.
- Run Certbot for SSL:  
  `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`
- Update **NEXT_PUBLIC_API_URL** in `.env.production` to `https://yourdomain.com/api`, then:

```bash
npm run build
pm2 restart ministry-app
```

---

## Phase 3: Switch Traffic from Vercel to VPS

When you want the live site to be on the VPS:

1. At your **domain registrar** (or DNS provider), change the **A record** for your domain (and `www` if used) to point to your **VPS IP** instead of Vercel.
2. Wait for DNS to propagate (minutes to a few hours).
3. Visitors will hit the VPS; the app there still uses the **same** cloud database, so all data is unchanged.
4. You can leave the Vercel project as-is (for rollback or staging) or remove the domain from Vercel and use it only for previews.

---

## Summary: Same Database for Both

| Where app runs | Database |
|----------------|----------|
| Vercel (Phase 1) | Cloud MySQL (PlanetScale / Railway) |
| VPS (Phase 2) | **Same** cloud MySQL (same DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) |

- One schema, one set of data.
- No export/import when moving from Vercel to VPS; only DNS and env (e.g. NEXT_PUBLIC_API_URL) change.
- You can run Vercel and VPS at the same time (e.g. different domains or one as staging) — both can use the same DB if you’re careful with writes (normally only one “production” URL is used for the main app).

---

## Quick checklist

**Phase 1 – Vercel first**

- [ ] Create cloud DB (PlanetScale or Railway), run `database/schema.sql`.
- [ ] Save DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL.
- [ ] Push code to Git, deploy on Vercel.
- [ ] Set env vars on Vercel (DB_*, JWT_SECRET, NEXT_PUBLIC_API_URL).
- [ ] Redeploy, test site, change default admin password.

**Phase 2 – VPS when ready**

- [ ] Prepare VPS (Node, Git, PM2, Nginx; no local MySQL).
- [ ] Clone repo, create `.env.production` with **same** DB credentials as Vercel.
- [ ] Build, PM2 start, Nginx, SSL, set NEXT_PUBLIC_API_URL to VPS domain.

**Phase 3 – Go live on VPS**

- [ ] Point domain A record to VPS IP.
- [ ] After DNS propagates, site runs on VPS with same database.

For more detail on Vercel-only steps, see [DEPLOY-TO-VERCEL.md](./DEPLOY-TO-VERCEL.md). For full VPS setup (when you add it), see [VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md).
