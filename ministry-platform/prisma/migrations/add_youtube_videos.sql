-- YouTube video cache (parity with PHP youtube_videos)
-- Run manually if needed: mysql ... < prisma/migrations/add_youtube_videos.sql
-- Synced via POST /api/videos/sync (cron or super_admin) — not on public page load.

CREATE TABLE IF NOT EXISTS youtube_videos (
  video_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  published_at DATETIME NOT NULL,
  thumbnail_url VARCHAR(500) NULL,
  blog_post_created TINYINT(1) NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (video_id),
  INDEX idx_youtube_videos_published_at (published_at),
  INDEX idx_youtube_videos_published (published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
