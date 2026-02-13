# Vercel Deployment Guide

This guide will help you deploy your Ministry Platform to Vercel.

> **Quick path:** For a short, ordered checklist, use **[DEPLOY-TO-VERCEL.md](./DEPLOY-TO-VERCEL.md)** and follow the steps in order.

## Prerequisites

1. **GitHub/GitLab/Bitbucket Account** - Your code needs to be in a Git repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Database Hosting** - Vercel doesn't host databases. Use **MySQL 8.0** or **MariaDB 10.x** compatible hosting:
   - **PlanetScale** (MySQL compatible, free tier, SSL required)
   - **Railway** (MySQL)
   - **AWS RDS** (MySQL 8.0 or MariaDB 10.x)
   - **DigitalOcean** (Managed MySQL or MariaDB)
   - **Azure Database for MySQL**
   - **Supabase** (PostgreSQL only - would require schema/code changes)

## Step 1: Push Code to Git Repository

If you haven't already, initialize git and push to your repository:

```bash
git init
git add .
git commit -m "Initial commit - Ministry Platform"
git remote add origin https://github.com/yourusername/ministry-platform.git
git push -u origin main
```

## Step 2: Set Up Database

### Option A: PlanetScale (Recommended - Free Tier Available)

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Run the schema:
   - Go to your database dashboard
   - Click on "Console" tab
   - Copy and paste the contents of `database/schema.sql`
   - Execute the SQL

4. Get connection details:
   - Host: `your-db.psdb.cloud`
   - Username: (from connection strings)
   - Password: (generate new password)
   - Database: `ministry_platform`

### Option B: Railway

1. Sign up at [railway.app](https://railway.app)
2. Create new project → Add MySQL
3. Get connection details from the MySQL service
4. Run schema using Railway's MySQL console or CLI

### Option C: Other MySQL Hosting

Follow your provider's instructions to:
1. Create a MySQL database
2. Import `database/schema.sql`
3. Get connection credentials

## Step 3: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Click "Add New Project"**

3. **Import your Git repository**
   - Select your repository
   - Vercel will auto-detect Next.js

4. **Configure Project Settings:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```env
   # Database Configuration
   DB_HOST=your-database-host.com
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=ministry_platform

   # Set to "true" for PlanetScale or any MySQL host that requires SSL
   DB_SSL=true

   # JWT Secret (generate a strong random string)
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

   # API URL (for production)
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
   ```

   **Important:** 
   - Generate a strong JWT_SECRET (at least 32 characters)
   - Use your actual Vercel domain for NEXT_PUBLIC_API_URL initially
   - Set **DB_SSL=true** when using PlanetScale (or any SSL-required MySQL)
   - You can update NEXT_PUBLIC_API_URL after adding a custom domain

6. **Deploy!**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Method 2: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts to:
   - Link to existing project or create new
   - Set up environment variables
   - Deploy

4. **Set Environment Variables:**
   ```bash
   vercel env add DB_HOST
   vercel env add DB_USER
   vercel env add DB_PASSWORD
   vercel env add DB_NAME
   vercel env add DB_SSL
   vercel env add JWT_SECRET
   vercel env add NEXT_PUBLIC_API_URL
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## Step 4: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_API_URL` environment variable to your custom domain

## Step 5: Update Admin Password

**IMPORTANT:** Change the default admin password immediately!

1. Login to your deployed site: `https://your-domain.vercel.app/login`
2. Use default credentials:
   - Email: `admin@ministry.com`
   - Password: `admin123`
3. Go to Settings and change the password
4. Or update directly in database:
   ```sql
   UPDATE users SET password = '$2a$10$NEW_HASH_HERE' WHERE email = 'admin@ministry.com';
   ```

## Step 6: Verify Deployment

1. **Test Public Pages:**
   - Homepage loads correctly
   - Blog posts display
   - Events show up
   - Gallery works

2. **Test Authentication:**
   - Login works
   - Registration works
   - Protected routes redirect properly

3. **Test Admin Functions:**
   - Dashboard loads
   - Can create/edit followers
   - Prayer points work
   - All CRUD operations function

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database hostname | `your-db.psdb.cloud` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `your-secure-password` |
| `DB_NAME` | Database name | `ministry_platform` |
| `DB_SSL` | Use SSL for DB connection (required for PlanetScale) | `true` or `false` |
| `JWT_SECRET` | Secret for JWT tokens | `generate-strong-random-string-32-chars-min` |
| `NEXT_PUBLIC_API_URL` | Public API URL | `https://your-domain.vercel.app/api` |

See **.env.example** in the project root for a template.

## Troubleshooting

### Build Fails

1. **Check build logs** in Vercel dashboard
2. **Verify all dependencies** are in `package.json`
3. **Check TypeScript errors** locally: `npm run build`

### Database Connection Errors

1. **Verify environment variables** are set correctly (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
2. **Set DB_SSL=true** if using PlanetScale or any host that requires SSL
3. **Check database host** allows connections from the internet (Vercel serverless runs from dynamic IPs)
4. **Test connection** using a database client (e.g. from your laptop) with the same credentials
5. **Verify SSL** settings if required by your database provider

### API Routes Not Working

1. **Check `NEXT_PUBLIC_API_URL`** matches your Vercel domain
2. **Verify environment variables** are set
3. **Check API route logs** in Vercel dashboard
4. **Test endpoints** using curl or Postman

### Authentication Issues

1. **Verify JWT_SECRET** is set and consistent
2. **Check token storage** in browser localStorage
3. **Verify cookies** are being set correctly
4. **Check CORS** settings if needed

## Database Connection Strings

### PlanetScale Format
```
mysql://username:password@host:3306/database?sslaccept=strict
```

### Railway Format
```
mysql://username:password@host:3306/database
```

## Security Checklist

- [ ] Changed default admin password
- [ ] Set strong JWT_SECRET (32+ characters, random)
- [ ] Database credentials are secure
- [ ] Environment variables are set in Vercel (not in code)
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Database allows connections only from Vercel IPs (if possible)

## Monitoring & Analytics

Vercel provides:
- **Analytics** - Page views, performance metrics
- **Logs** - Serverless function logs
- **Speed Insights** - Performance monitoring

Enable these in your Vercel project settings.

## Continuous Deployment

Once connected to Git:
- Every push to `main` branch = Production deployment
- Every push to other branches = Preview deployment
- Automatic deployments on every commit

## Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **PlanetScale Docs:** [planetscale.com/docs](https://planetscale.com/docs)

## Next Steps After Deployment

1. ✅ Set up database backups
2. ✅ Configure monitoring and alerts
3. ✅ Set up custom domain
4. ✅ Enable Vercel Analytics
5. ✅ Test all features thoroughly
6. ✅ Update admin password
7. ✅ Document admin procedures for your team
