# Pre-Deployment Checklist

Use this checklist before deploying to Vercel.

## Code Preparation

- [ ] All code is committed to Git
- [ ] Build passes locally: `npm run build`
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] All environment variables documented

## Database Setup

- [ ] Database created and hosted (PlanetScale/Railway/etc.)
- [ ] Schema imported: `database/schema.sql`
- [ ] Database connection tested
- [ ] Default admin user created
- [ ] Database backups configured (if available)

## Environment Variables

- [ ] `DB_HOST` - Database hostname
- [ ] `DB_USER` - Database username
- [ ] `DB_PASSWORD` - Database password
- [ ] `DB_NAME` - Database name (ministry_platform)
- [ ] `JWT_SECRET` - Strong random string (32+ chars)
- [ ] `NEXT_PUBLIC_API_URL` - Your Vercel domain + /api

## Security

- [ ] Default admin password changed
- [ ] JWT_SECRET is strong and random
- [ ] No secrets in code (all in environment variables)
- [ ] Database credentials are secure
- [ ] HTTPS enabled (automatic on Vercel)

## Testing

- [ ] Public pages load correctly
- [ ] Authentication works (login/register)
- [ ] Admin dashboard accessible
- [ ] CRUD operations work (followers, prayer points, etc.)
- [ ] API endpoints respond correctly
- [ ] Mobile responsive design works
- [ ] Forms submit successfully

## Vercel Configuration

- [ ] Project connected to Git repository
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled (optional)

## Documentation

- [ ] README updated with deployment info
- [ ] Team members have access
- [ ] Admin credentials documented securely
- [ ] Database connection details saved securely

## Post-Deployment

- [ ] Site loads at Vercel URL
- [ ] Can login with admin account
- [ ] Test creating a follower
- [ ] Test adding prayer point
- [ ] Test creating blog post
- [ ] Verify database connections work
- [ ] Check Vercel logs for errors
- [ ] Monitor performance

## Quick Deploy Commands

```bash
# 1. Build locally to check for errors
npm run build

# 2. Push to Git
git add .
git commit -m "Ready for deployment"
git push

# 3. Deploy to Vercel (if using CLI)
vercel --prod
```

## Emergency Rollback

If something goes wrong:

1. Go to Vercel dashboard
2. Navigate to Deployments
3. Find last working deployment
4. Click "..." menu → "Promote to Production"
