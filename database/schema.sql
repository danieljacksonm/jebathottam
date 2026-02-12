-- Ministry Platform Database Schema

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'media_team', 'ministry_member', 'visitor') DEFAULT 'visitor',
  avatar_url VARCHAR(500),
  bio TEXT,
  phone VARCHAR(50),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
);

-- Families table
CREATE TABLE IF NOT EXISTS families (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Followers/Members table
CREATE TABLE IF NOT EXISTS followers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  family_id INT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  notes TEXT,
  join_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_family (family_id),
  INDEX idx_status (status)
);

-- Prayer Points table
CREATE TABLE IF NOT EXISTS prayer_points (
  id INT PRIMARY KEY AUTO_INCREMENT,
  follower_id INT NOT NULL,
  text TEXT NOT NULL,
  date DATE NOT NULL,
  status ENUM('pending', 'happened', 'not-happened') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (follower_id) REFERENCES followers(id) ON DELETE CASCADE,
  INDEX idx_follower (follower_id),
  INDEX idx_status (status),
  INDEX idx_date (date)
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author VARCHAR(255),
  category VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_published (published),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100),
  date DATE NOT NULL,
  time TIME,
  location VARCHAR(255),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_date (date),
  INDEX idx_type (type)
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_created_at (created_at)
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order (order_index)
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  content TEXT NOT NULL,
  type ENUM('note', 'sermon') DEFAULT 'note',
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
);

-- Prophecies table
CREATE TABLE IF NOT EXISTS prophecies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  reference VARCHAR(255),
  status ENUM('pending', 'verified', 'archived') DEFAULT 'pending',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_date (date),
  INDEX idx_status (status)
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('poster', 'youtube', 'youtube-shorts') NOT NULL,
  image_url VARCHAR(500),
  video_id VARCHAR(255),
  thumbnail_url VARCHAR(500),
  message TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
);

-- Slider images table
CREATE TABLE IF NOT EXISTS slider_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image_url VARCHAR(500) NOT NULL,
  text TEXT,
  title VARCHAR(255),
  description TEXT,
  order_index INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order (order_index),
  INDEX idx_status (status)
);

-- Testimonies table
CREATE TABLE IF NOT EXISTS testimonies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (key_name)
);

-- Social Media Accounts table (stores connected social media platforms)
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

-- Social Media Posts table (stores all posts across platforms)
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

-- Social Media Post Platforms (many-to-many relationship)
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

-- Social Media Analytics table
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

-- Permission templates for roles
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

-- Activity logs for audit trail
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

-- Insert default permissions for each role
INSERT INTO role_permissions (role, resource, can_create, can_read, can_update, can_delete) VALUES
-- Super Admin permissions (everything except social media management)
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

-- Media Team permissions (everything including social media)
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

-- Ministry Member permissions (users, blogs, notes)
('ministry_member', 'users', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'blogs', TRUE, TRUE, TRUE, FALSE),
('ministry_member', 'events', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'gallery', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'team', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'followers', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'notes', TRUE, TRUE, TRUE, TRUE),
('ministry_member', 'prophecy', FALSE, TRUE, FALSE, FALSE),
('ministry_member', 'media', FALSE, TRUE, FALSE, FALSE),

-- Visitor permissions (read only access to public content)
('visitor', 'blogs', FALSE, TRUE, FALSE, FALSE),
('visitor', 'events', FALSE, TRUE, FALSE, FALSE),
('visitor', 'gallery', FALSE, TRUE, FALSE, FALSE),
('visitor', 'team', FALSE, TRUE, FALSE, FALSE),
('visitor', 'media', FALSE, TRUE, FALSE, FALSE)
ON DUPLICATE KEY UPDATE can_read=VALUES(can_read);

-- Insert default admin user (password: admin123 - should be changed in production)
-- Run: node scripts/setup-admin.js admin123 to generate hash
-- Then update this INSERT statement with the generated hash
-- Example hash for 'admin123': $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (name, email, password, role) 
VALUES ('Super Admin', 'admin@ministry.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'super_admin')
ON DUPLICATE KEY UPDATE email=email;
