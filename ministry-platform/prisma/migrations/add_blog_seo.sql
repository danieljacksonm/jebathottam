-- Phase 2A: Blog SEO + bilingual fields (MySQL)
-- Run once on the VPS if you cannot use `prisma migrate`.
-- If a column/index already exists, skip that statement and continue.

ALTER TABLE blogs ADD COLUMN slug VARCHAR(255) NULL AFTER id;
ALTER TABLE blogs ADD COLUMN title_ta VARCHAR(500) NULL AFTER title;
ALTER TABLE blogs MODIFY COLUMN content LONGTEXT NOT NULL;
ALTER TABLE blogs ADD COLUMN content_ta LONGTEXT NULL AFTER content;
ALTER TABLE blogs ADD COLUMN excerpt_ta TEXT NULL AFTER excerpt;
ALTER TABLE blogs ADD COLUMN meta_title VARCHAR(255) NULL AFTER excerpt_ta;
ALTER TABLE blogs ADD COLUMN meta_desc VARCHAR(500) NULL AFTER meta_title;
ALTER TABLE blogs ADD COLUMN og_image VARCHAR(500) NULL AFTER meta_desc;
ALTER TABLE blogs ADD COLUMN featured_image VARCHAR(500) NULL AFTER og_image;
ALTER TABLE blogs ADD COLUMN tags VARCHAR(500) NULL AFTER featured_image;
ALTER TABLE blogs ADD COLUMN views INT NOT NULL DEFAULT 0 AFTER tags;

-- Backfill missing slugs (unique per row)
UPDATE blogs
SET slug = CONCAT('post-', id)
WHERE slug IS NULL OR slug = '';

ALTER TABLE blogs MODIFY COLUMN slug VARCHAR(255) NOT NULL;

CREATE UNIQUE INDEX uk_blogs_slug ON blogs (slug);
