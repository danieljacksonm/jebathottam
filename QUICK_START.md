# 🚀 Quick Start Guide - Social Media Management System

## ⚡ Get Started in 5 Minutes

### Step 1: Database Migration (2 minutes)

```bash
# Backup your current database first!
mysqldump -u root -p ministry_platform > backup_$(date +%Y%m%d).sql

# Run the updated schema
mysql -u root -p ministry_platform < database/schema.sql
```

### Step 2: Verify Installation (1 minute)

```bash
# Check new tables exist
mysql -u root -p ministry_platform -e "SHOW TABLES LIKE 'social_media%';"

# Should show:
# - social_media_accounts
# - social_media_analytics
# - social_media_post_platforms
# - social_media_posts
```

### Step 3: Start Application (1 minute)

```bash
# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### Step 4: Login and Test (1 minute)

1. **Login as Admin**:
   - Email: `admin@ministry.com`
   - Password: `admin123` (change this!)

2. **Navigate to Social Media**:
   - Go to: `/admin/social-media`
   - You should see the Social Media Manager dashboard

3. **Check Public Feed**:
   - Go to: `/social-feed`
   - You should see the public social feed page

## ✅ You're Done!

Your social media management system is now live!

## 🎯 Next Steps

### For Administrators

1. **Create Media Team User**:
```sql
INSERT INTO users (name, email, password, role, status) 
VALUES (
  'Media Team',
  'media@ministry.com',
  -- Use bcrypt to hash: 'mediateam123'
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'media_team',
  'active'
);
```

2. **Change Default Password**:
   - Login as admin
   - Change password immediately
   - Update JWT_SECRET in `.env`

### For Media Team

1. **Connect First Social Account**:
   - Click **Social Media** in admin menu
   - Go to **Connected Accounts** tab
   - Click **+ Connect Account**
   - Select platform (e.g., Facebook)
   - Enter account details
   - Save

2. **Create First Post**:
   - Click **✨ Create Post**
   - Write your content
   - Select connected platforms
   - Click **🚀 Publish Now**
   - Check `/social-feed` to see your post!

## 🔧 Configuration

### Update Environment Variables

Create or update `.env`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ministry_platform

# Security
JWT_SECRET=change-this-to-a-random-string-in-production
NODE_ENV=development

# Optional: Platform API Keys (for production)
# FACEBOOK_APP_ID=your_app_id
# FACEBOOK_APP_SECRET=your_app_secret
# INSTAGRAM_CLIENT_ID=your_client_id
# TWITTER_API_KEY=your_api_key
# etc...
```

## 🎨 Customize

### Update Branding

1. **Logo**: Update in `components/ui/logo.tsx`
2. **Colors**: Update Tailwind config
3. **Name**: Update site metadata in `app/layout.tsx`

## 📱 Access URLs

| Feature | URL | Access |
|---------|-----|--------|
| Admin Dashboard | `/admin` | All admin roles |
| Social Media Manager | `/admin/social-media` | Media team, Super admin |
| Create Post | `/admin/social-media/create` | Media team |
| Analytics | `/admin/social-media/analytics` | Media team |
| Public Feed | `/social-feed` | Everyone |

## 👥 Default Users

| Email | Password | Role |
|-------|----------|------|
| `admin@ministry.com` | `admin123` | super_admin |

**⚠️ IMPORTANT**: Change these passwords immediately in production!

## 🔑 Generate Password Hash

Use this Node.js script to generate password hashes:

```javascript
const bcrypt = require('bcryptjs');

const password = 'your_password_here';
const hash = bcrypt.hashSync(password, 10);
console.log('Password hash:', hash);
```

Or use this one-liner:
```bash
node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"
```

## 🧪 Test the System

### Test 1: Create a Post

```bash
curl -X POST http://localhost:3000/api/social-media/posts \
  -H "Content-Type: application/json" \
  -b "auth_token=YOUR_TOKEN" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post #test",
    "status": "draft",
    "platforms": []
  }'
```

### Test 2: Connect an Account

1. Login as media team user
2. Go to `/admin/social-media`
3. Click **Connected Accounts** → **+ Connect Account**
4. Fill in test data
5. Save

### Test 3: View Public Feed

1. Open `/social-feed` in incognito mode
2. Should load without authentication
3. Should show published posts (when available)

## ❓ Troubleshooting

### Issue: "Table doesn't exist"
**Solution**: Run the database migration again
```bash
mysql -u root -p ministry_platform < database/schema.sql
```

### Issue: "Unauthorized"
**Solution**: Clear cookies and login again
```javascript
// In browser console:
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

### Issue: "Forbidden - Insufficient permissions"
**Solution**: Check user role in database
```sql
SELECT id, email, role FROM users WHERE email = 'your@email.com';
```

Update role if needed:
```sql
UPDATE users SET role = 'media_team' WHERE email = 'your@email.com';
```

### Issue: Database connection error
**Solution**: Check `.env` file and database status
```bash
# Test database connection
mysql -u root -p -e "SELECT 1"

# Check if database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'ministry_platform'"
```

## 📞 Support

### Quick Reference

- **Documentation**: See `SOCIAL-MEDIA-FEATURE.md`
- **API Docs**: See `API_DOCUMENTATION.md`
- **Migration**: See `database/MIGRATION_GUIDE.md`
- **Feature Summary**: See `FEATURE_SUMMARY.md`

### Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Backup database
mysqldump -u root -p ministry_platform > backup.sql

# Restore database
mysql -u root -p ministry_platform < backup.sql
```

## 🎉 Success Checklist

- [ ] Database migrated successfully
- [ ] Application starts without errors
- [ ] Can login as admin
- [ ] Can access `/admin/social-media`
- [ ] Can access `/social-feed`
- [ ] Changed default passwords
- [ ] Updated JWT_SECRET
- [ ] Created media team user
- [ ] Tested post creation
- [ ] Verified permissions work

## 🚀 Go Live Checklist

### Before Production

- [ ] Backup database
- [ ] Change all default passwords
- [ ] Update JWT_SECRET with strong random string
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure real social media API credentials
- [ ] Test all features in staging
- [ ] Train media team users
- [ ] Document custom configurations
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy

### After Production

- [ ] Monitor error logs
- [ ] Check analytics are working
- [ ] Verify public feed loads
- [ ] Test post publishing
- [ ] Review activity logs
- [ ] Get user feedback
- [ ] Schedule regular backups

## 💡 Pro Tips

1. **Use Staging**: Always test in staging environment first
2. **Backup Regularly**: Set up automated daily backups
3. **Monitor Logs**: Check `activity_logs` table regularly
4. **Update Tokens**: Refresh social media tokens before they expire
5. **Review Permissions**: Audit user permissions quarterly
6. **Test Features**: Verify each feature after updates
7. **Document Changes**: Keep internal wiki updated

## 🎓 Training Resources

### For Media Team (15 min)
1. Watch system demo
2. Practice creating posts
3. Learn to connect accounts
4. Understand analytics

### For Admins (10 min)
1. Review role system
2. Learn user management
3. Understand activity logs
4. Know troubleshooting steps

---

## ✅ You're All Set!

Your social media management system is ready to use.

**Next**: Read `SOCIAL-MEDIA-FEATURE.md` for complete feature documentation.

**Questions?**: Check `API_DOCUMENTATION.md` for technical details.

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready ✅
