# 🔄 Database Migration Guide

## Overview

This guide will help you migrate your existing database to support the new role-based access control system and social media management features.

## ⚠️ Important Notes

1. **Backup First**: Always backup your database before running migrations
2. **Downtime**: Plan for brief downtime during migration
3. **Test Environment**: Test migration in development first
4. **Data Loss**: Existing role values will need to be mapped to new roles

## 📋 Pre-Migration Checklist

- [ ] Backup current database
- [ ] Note down all existing users and their roles
- [ ] Test migration in development environment
- [ ] Inform users about brief downtime
- [ ] Have rollback plan ready

## 🔧 Step 1: Backup Database

### MySQL Backup
```bash
mysqldump -u your_user -p your_database > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Verify Backup
```bash
mysql -u your_user -p your_database < backup_YYYYMMDD_HHMMSS.sql
```

## 🗄️ Step 2: Update Users Table

### Existing Role Mapping

| Old Role | New Role | Access Level |
|----------|----------|--------------|
| `master_admin` | `super_admin` | Full access (except social media) |
| `pastor` | `super_admin` | Full access (except social media) |
| `member` | `ministry_member` | Blogs, Notes only |
| `visitor` | `visitor` | Read-only |

### Migration SQL

```sql
-- Step 1: Add new columns temporarily
ALTER TABLE users 
ADD COLUMN new_role ENUM('super_admin', 'media_team', 'ministry_member', 'visitor') DEFAULT 'visitor',
ADD COLUMN avatar_url VARCHAR(500),
ADD COLUMN bio TEXT,
ADD COLUMN phone VARCHAR(50),
ADD COLUMN status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
ADD COLUMN last_login TIMESTAMP NULL;

-- Step 2: Migrate existing data
UPDATE users SET new_role = 'super_admin' WHERE role IN ('master_admin', 'pastor');
UPDATE users SET new_role = 'ministry_member' WHERE role = 'member';
UPDATE users SET new_role = 'visitor' WHERE role = 'visitor';

-- Step 3: Drop old column and rename
ALTER TABLE users DROP COLUMN role;
ALTER TABLE users CHANGE COLUMN new_role role ENUM('super_admin', 'media_team', 'ministry_member', 'visitor') DEFAULT 'visitor';

-- Step 4: Add indexes
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_status ON users(status);
```

## 🆕 Step 3: Create New Tables

```sql
-- Social Media Accounts
CREATE TABLE IF NOT EXISTS social_media_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  platform ENUM('facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'telegram', 'whatsapp') NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_username VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP NULL,
  page_id VARCHAR(255),
  account_id VARCHAR(255),
  status ENUM('active', 'inactive', 'expired', 'error') DEFAULT 'active',
  last_posted_at TIMESTAMP NULL,
  metadata JSON,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_platform (platform),
  INDEX idx_status (status),
  UNIQUE KEY unique_platform_account (platform, account_id)
);

-- Social Media Posts
CREATE TABLE IF NOT EXISTS social_media_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  content TEXT NOT NULL,
  media_type ENUM('text', 'image', 'video', 'carousel', 'story', 'reel') DEFAULT 'text',
  media_urls JSON,
  hashtags TEXT,
  status ENUM('draft', 'scheduled', 'publishing', 'published', 'failed', 'archived') DEFAULT 'draft',
  scheduled_at TIMESTAMP NULL,
  published_at TIMESTAMP NULL,
  publish_to_website BOOLEAN DEFAULT TRUE,
  website_category VARCHAR(100),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_scheduled_at (scheduled_at),
  INDEX idx_website (publish_to_website)
);

-- Social Media Post Platforms
CREATE TABLE IF NOT EXISTS social_media_post_platforms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  account_id INT NOT NULL,
  platform_post_id VARCHAR(255),
  platform_post_url VARCHAR(500),
  status ENUM('pending', 'publishing', 'published', 'failed') DEFAULT 'pending',
  error_message TEXT,
  engagement_stats JSON,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES social_media_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES social_media_accounts(id) ON DELETE CASCADE,
  INDEX idx_post (post_id),
  INDEX idx_account (account_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_post_account (post_id, account_id)
);

-- Social Media Analytics
CREATE TABLE IF NOT EXISTS social_media_analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  account_id INT NOT NULL,
  platform ENUM('facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'telegram', 'whatsapp') NOT NULL,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  views INT DEFAULT 0,
  clicks INT DEFAULT 0,
  reach INT DEFAULT 0,
  impressions INT DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES social_media_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES social_media_accounts(id) ON DELETE CASCADE,
  INDEX idx_post (post_id),
  INDEX idx_platform (platform),
  INDEX idx_synced_at (synced_at),
  UNIQUE KEY unique_post_account_analytics (post_id, account_id)
);

-- Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('super_admin', 'media_team', 'ministry_member', 'visitor') NOT NULL,
  resource VARCHAR(100) NOT NULL,
  can_create BOOLEAN DEFAULT FALSE,
  can_read BOOLEAN DEFAULT FALSE,
  can_update BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_role_resource (role, resource),
  INDEX idx_role (role)
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id INT,
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);
```

## 🔐 Step 4: Insert Default Permissions

```sql
-- Super Admin permissions
INSERT INTO role_permissions (role, resource, can_create, can_read, can_update, can_delete) VALUES
('super_admin', 'users', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'blogs', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'events', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'gallery', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'team', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'followers', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'notes', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'prophecy', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'media', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'settings', TRUE, TRUE, TRUE, TRUE),
('super_admin', 'social_media_posts', FALSE, TRUE, FALSE, FALSE),

-- Media Team permissions
('media_team', 'users', FALSE, TRUE, FALSE, FALSE),
('media_team', 'blogs', TRUE, TRUE, TRUE, TRUE),
('media_team', 'events', TRUE, TRUE, TRUE, FALSE),
('media_team', 'gallery', TRUE, TRUE, TRUE, TRUE),
('media_team', 'team', FALSE, TRUE, FALSE, FALSE),
('media_team', 'followers', FALSE, TRUE, FALSE, FALSE),
('media_team', 'notes', FALSE, TRUE, FALSE, FALSE),
('media_team', 'prophecy', FALSE, TRUE, FALSE, FALSE),
('media_team', 'media', TRUE, TRUE, TRUE, TRUE),
('media_team', 'settings', FALSE, TRUE, FALSE, FALSE),
('media_team', 'social_media_accounts', TRUE, TRUE, TRUE, TRUE),
('media_team', 'social_media_posts', TRUE, TRUE, TRUE, TRUE),
('media_team', 'social_media_analytics', FALSE, TRUE, FALSE, FALSE),

-- Ministry Member permissions
('ministry_member', 'users', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'blogs', TRUE, TRUE, TRUE, FALSE),
('ministry_member', 'events', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'gallery', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'team', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'followers', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'notes', TRUE, TRUE, TRUE, TRUE),
('ministry_member', 'prophecy', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'media', FALSE, TRUE, FALSE, FALSE),

-- Visitor permissions
('visitor', 'blogs', FALSE, TRUE, FALSE, FALSE),
('visitor', 'events', FALSE, TRUE, FALSE, FALSE),
('visitor', 'gallery', FALSE, TRUE, FALSE, FALSE),
('visitor', 'team', FALSE, TRUE, FALSE, FALSE),
('visitor', 'media', FALSE, TRUE, FALSE, FALSE)
ON DUPLICATE KEY UPDATE can_read=VALUES(can_read);
```

## 👥 Step 5: Create Media Team Users (Optional)

```sql
-- Create a media team user (password: mediateam123)
-- Password hash generated with bcrypt
INSERT INTO users (name, email, password, role, status) 
VALUES (
  'Media Team Admin',
  'media@ministry.com',
  '$2a$10$example_hash_here',
  'media_team',
  'active'
);
```

## ✅ Step 6: Verify Migration

```sql
-- Check user roles
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- Check permissions
SELECT role, COUNT(*) as permission_count 
FROM role_permissions 
GROUP BY role;

-- Verify tables exist
SHOW TABLES LIKE 'social_media%';

-- Check indexes
SHOW INDEX FROM users;
SHOW INDEX FROM social_media_accounts;
```

## 🔄 Step 7: Rollback Plan (If Needed)

```sql
-- Restore from backup
mysql -u your_user -p your_database < backup_YYYYMMDD_HHMMSS.sql

-- Or manual rollback
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS social_media_analytics;
DROP TABLE IF EXISTS social_media_post_platforms;
DROP TABLE IF EXISTS social_media_posts;
DROP TABLE IF EXISTS social_media_accounts;

-- Restore old role column
ALTER TABLE users 
ADD COLUMN old_role ENUM('master_admin', 'pastor', 'member', 'visitor') DEFAULT 'visitor';

UPDATE users SET old_role = 'master_admin' WHERE role = 'super_admin';
UPDATE users SET old_role = 'member' WHERE role = 'ministry_member';
UPDATE users SET old_role = 'visitor' WHERE role = 'visitor';

ALTER TABLE users DROP COLUMN role;
ALTER TABLE users CHANGE COLUMN old_role role ENUM('master_admin', 'pastor', 'member', 'visitor') DEFAULT 'visitor';
```

## 📊 Step 8: Post-Migration Tasks

1. **Update Environment Variables**
   ```env
   DB_NAME=ministry_platform
   JWT_SECRET=generate-new-secret-key
   ```

2. **Clear Application Cache**
   ```bash
   npm run build
   ```

3. **Restart Application**
   ```bash
   npm run start
   ```

4. **Test Each Role**
   - Login as super_admin
   - Login as media_team
   - Login as ministry_member
   - Login as visitor

5. **Monitor Logs**
   ```sql
   SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50;
   ```

## 🎯 Success Criteria

- [ ] All existing users migrated successfully
- [ ] New tables created without errors
- [ ] Permissions inserted correctly
- [ ] Application starts without errors
- [ ] Each role has appropriate access
- [ ] Social media pages load correctly
- [ ] No data loss occurred

## 📞 Support

If you encounter issues:
1. Check the error logs
2. Verify database connection
3. Review the rollback plan
4. Contact technical support

## 📝 Migration Log Template

```
Migration Date: _________________
Database: _________________
Backup Location: _________________
Migration Status: ⬜ Success ⬜ Failed
Rollback Needed: ⬜ Yes ⬜ No
Notes:
_________________________________
_________________________________
```

---

**Last Updated**: February 2026
**Version**: 1.0.0
