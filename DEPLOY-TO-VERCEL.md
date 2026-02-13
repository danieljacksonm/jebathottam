# Deploy to Vercel – Step-by-step checklist

Follow these steps **in order** to move your app to Vercel.

---

## Before you start

- [ ] Code is in a **Git** repo (GitHub, GitLab, or Bitbucket).
- [ ] You have a **Vercel** account: [vercel.com/signup](https://vercel.com/signup).
- [ ] You have (or will create) a **hosted MySQL** database (Vercel does not host MySQL).

---

## Step 1: Host your database (choose one)

Vercel is serverless and does not run MySQL. You need an external **MySQL 8.0** or **MariaDB 10.x** compatible host.

### Option A: PlanetScale (recommended, free tier)

1. Go to [planetscale.com](https://planetscale.com) and sign up.
2. **Create a database**: Dashboard → Create database → name it (e.g. `ministry-platform`).
3. **Run your schema**:
   - Open the database → **Console** tab.
   - Copy the full contents of your project’s `database/schema.sql`.
   - Paste and run it in the Console.
4. **Get connection details**:
   - **Connect** → **Connect with** → **General** (or “Application”).
   - Note: **Host**, **Username**, **Password**, **Database** (often same as DB name).
5. PlanetScale uses SSL: you will set `DB_SSL=true` in Vercel (Step 4).

### Option B: Railway

1. Go to [railway.app](https://railway.app) and sign up.
2. **New Project** → **Add MySQL**.
3. After it’s created, open the MySQL service and get **Host**, **User**, **Password**, **Database** from Variables / Connect.
4. Run your schema: use Railway’s MySQL shell or a GUI (e.g. TablePlus, DBeaver) and run `database/schema.sql`.

### Option C: Other (AWS RDS, DigitalOcean, etc.)

1. Create a MySQL instance and a database (e.g. `ministry_platform`).
2. Run `database/schema.sql` against that database.
3. Get host, user, password, and database name.
4. If the provider requires SSL, set `DB_SSL=true` in Vercel.

---

## Step 2: Push code to Git

If the project is not in a Git repo yet:

```bash
git init
git add .
git commit -m "Prepare for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If it’s already in a repo, make sure your latest changes are pushed:

```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

---

## Step 3: Create the Vercel project

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New…** → **Project**.
3. **Import** your Git repository (GitHub/GitLab/Bitbucket).
4. **Configure**:
   - **Framework Preset**: Next.js (should be auto-detected).
   - **Root Directory**: leave as `.` (root).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `.next` (default).
   - **Install Command**: `npm install` (default).
5. Do **not** click Deploy yet. Go to **Environment Variables** first (Step 4).

---

## Step 4: Set environment variables in Vercel

In the same “new project” screen (or later: Project → **Settings** → **Environment Variables**), add:

| Name | Value | Notes |
|------|--------|--------|
| `DB_HOST` | Your DB host | e.g. `xxx.psdb.cloud` (PlanetScale) or Railway host |
| `DB_USER` | Your DB user | From your DB provider |
| `DB_PASSWORD` | Your DB password | From your DB provider |
| `DB_NAME` | Your DB name | e.g. `ministry_platform` |
| `DB_SSL` | `true` | **Required for PlanetScale**; use `true` if your host needs SSL |
| `JWT_SECRET` | Long random string | At least 32 characters; e.g. generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_API_URL` | `https://YOUR_PROJECT.vercel.app/api` | Replace with your actual Vercel URL (you can fix this after first deploy) |

- Apply to: **Production**, and optionally **Preview** if you use preview deployments.
- Then click **Deploy** (or **Save** and deploy from the project page).

---

## Step 5: Deploy and wait for build

1. Trigger **Deploy** (from the import screen or the **Deployments** tab).
2. Wait for the build to finish. If it fails, open the build logs and fix the reported errors (often env or TypeScript).
3. When it succeeds, your app will be at:  
   `https://YOUR_PROJECT.vercel.app`

---

## Step 6: Point API URL to your live app (if needed)

1. In Vercel: **Project** → **Settings** → **Environment Variables**.
2. Set **NEXT_PUBLIC_API_URL** to:  
   `https://YOUR_PROJECT.vercel.app/api`  
   (use your real Vercel URL).
3. **Redeploy** so the new value is applied: **Deployments** → latest deployment → **⋯** → **Redeploy**.

---

## Step 7: Security and admin

1. **Change default admin password**
   - Log in at `https://YOUR_PROJECT.vercel.app/login` with your current admin account.
   - Change the password in your app’s settings, or update the user in the database (e.g. set a new bcrypt hash for the admin user).
2. **Confirm**
   - [ ] You are not using default credentials in production.
   - [ ] `JWT_SECRET` is long, random, and only in Vercel env (not in code).
   - [ ] DB credentials are only in Vercel env (not in code).

---

## Step 8: Verify the deployment

- [ ] Homepage loads: `https://YOUR_PROJECT.vercel.app`
- [ ] Login: `https://YOUR_PROJECT.vercel.app/login`
- [ ] Admin: `https://YOUR_PROJECT.vercel.app/admin`
- [ ] Public pages (blog, events, gallery, social feed, etc.) work.
- [ ] Create/edit one item (e.g. blog or event) to confirm the database is used.

If anything fails, check **Vercel** → **Project** → **Deployments** → **Functions** / **Logs** and your DB host’s connection/SSL settings.

---

## Quick reference: env vars for Vercel

```env
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=ministry_platform
DB_SSL=true
JWT_SECRET=your-long-random-secret-at-least-32-chars
NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
```

---

## Optional: Deploy from your machine (CLI)

```bash
npm i -g vercel
vercel login
vercel
```

Add env vars:

```bash
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
vercel env add DB_SSL
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_API_URL
```

Production deploy:

```bash
vercel --prod
```

---

## Troubleshooting

| Problem | What to do |
|--------|------------|
| Build fails | Run `npm run build` locally; fix TypeScript/ESLint errors. Check Vercel build logs. |
| “Database connection” / “ECONNREFUSED” | Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`. Ensure DB allows connections from the internet (and Vercel IPs if required). |
| PlanetScale: SSL error | Set `DB_SSL=true` in Vercel and redeploy. |
| Login / auth not working | Ensure `JWT_SECRET` is set in Vercel and you redeployed after adding it. |
| 404 on API routes | Confirm `NEXT_PUBLIC_API_URL` is `https://YOUR_PROJECT.vercel.app/api` and that you redeployed. |

For more detail, see **VERCEL-DEPLOYMENT.md** in this repo.
