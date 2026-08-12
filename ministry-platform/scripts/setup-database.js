#!/usr/bin/env node
/**
 * Create/upgrade Node tables on the live MySQL database, then copy PHP content.
 *
 * Usage (from ministry-platform folder):
 *   node scripts/setup-database.js
 *
 * Env:
 *   DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME
 *   DB_SSL=true   (IONOS usually needs this)
 *   ADMIN_EMAIL / ADMIN_PASSWORD  (optional; default admin@ministry.com)
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

function slugify(input) {
  const base = String(input || 'post')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'post';
}

async function tableExists(conn, name) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS c FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [name]
  );
  return Number(rows[0].c) > 0;
}

async function columnExists(conn, table, column) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS c FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [table, column]
  );
  return Number(rows[0].c) > 0;
}

async function addColumnIfMissing(conn, table, column, ddl) {
  if (!(await tableExists(conn, table))) return;
  if (await columnExists(conn, table, column)) return;
  await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN ${ddl}`);
  console.log(`  + ${table}.${column}`);
}

async function runSqlFile(conn, filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skip missing file: ${filePath}`);
    return;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const statements = raw
    .replace(/^\s*--.*$/gm, '')
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  for (const sql of statements) {
    try {
      await conn.query(sql);
    } catch (err) {
      const msg = String(err.message || err);
      const ignorable =
        /already exists|Duplicate column|Duplicate key|Duplicate entry|Multiple primary key|check that column\/key exists/i.test(
          msg
        );
      if (ignorable) {
        console.log(`  (ok skip) ${msg.split('\n')[0]}`);
      } else {
        console.log(`  WARN: ${msg.split('\n')[0]}`);
      }
    }
  }
}

async function migrateBlogs(conn) {
  if (!(await tableExists(conn, 'blog_posts'))) {
    console.log('No blog_posts table — skip blog copy');
    return;
  }
  if (!(await tableExists(conn, 'blogs'))) {
    console.log('blogs table missing — cannot copy posts');
    return;
  }

  const [posts] = await conn.query('SELECT * FROM blog_posts');
  console.log(`PHP blog_posts: ${posts.length}`);
  let copied = 0;

  for (const p of posts) {
    const title = p.title_en || p.title || 'Untitled';
    const content = p.content_en || p.content || '';
    const excerpt = p.excerpt_en || p.excerpt || null;
    let slug = p.slug || slugify(title);
    const published =
      p.status === 'published' || p.published === 1 || p.published === true ? 1 : 0;
    const publishedAt = p.published_at || (published ? p.created_at || new Date() : null);

    const [existing] = await conn.query('SELECT id FROM blogs WHERE slug = ? LIMIT 1', [slug]);
    if (existing.length) {
      let n = 1;
      let unique = `${slug}-${n}`;
      while (true) {
        const [ex] = await conn.query('SELECT id FROM blogs WHERE slug = ? LIMIT 1', [unique]);
        if (!ex.length) {
          slug = unique;
          break;
        }
        unique = `${slug}-${++n}`;
      }
    }

    await conn.query(
      `INSERT INTO blogs (
        slug, title, title_ta, content, content_ta, excerpt, excerpt_ta,
        meta_title, meta_desc, og_image, featured_image, tags, views,
        author, category, featured, published, published_at, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        title=VALUES(title), title_ta=VALUES(title_ta), content=VALUES(content),
        content_ta=VALUES(content_ta), excerpt=VALUES(excerpt), excerpt_ta=VALUES(excerpt_ta),
        published=VALUES(published)`,
      [
        slug,
        title,
        p.title_ta || null,
        content,
        p.content_ta || null,
        excerpt,
        p.excerpt_ta || null,
        p.meta_title || null,
        p.meta_desc || null,
        p.og_image || null,
        p.featured_image || p.og_image || null,
        p.tags || null,
        p.views || 0,
        p.author || 'Ministry',
        p.category || null,
        p.featured ? 1 : 0,
        published,
        publishedAt,
        p.created_at || new Date(),
        p.updated_at || new Date(),
      ]
    );
    copied++;
  }
  console.log(`Blogs copied into Node blogs table: ${copied}`);
}

async function ensureAdmin(conn) {
  if (!(await tableExists(conn, 'users'))) return;
  const email = process.env.ADMIN_EMAIL || 'admin@ministry.com';
  const password = process.env.ADMIN_PASSWORD || 'JebaAdmin@2026';
  const hash = await bcrypt.hash(password, 10);
  const [rows] = await conn.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  if (rows.length) {
    await conn.query(
      'UPDATE users SET password = ?, role = ?, status = ? WHERE email = ?',
      [hash, 'super_admin', 'active', email]
    );
    console.log(`Admin password updated for ${email}`);
  } else {
    await conn.query(
      `INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'super_admin', 'active')`,
      ['Super Admin', email, hash]
    );
    console.log(`Admin user created: ${email}`);
  }
  return { email, password };
}

async function main() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  if (!host || !user || !password || !database) {
    console.error('Missing DB_HOST / DB_USER / DB_PASSWORD / DB_NAME');
    process.exit(1);
  }

  const useSsl = process.env.DB_SSL !== 'false';
  console.log(`Connecting to ${host}:${port} / ${database} ssl=${useSsl}`);

  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    connectTimeout: 20000,
  });

  const [dbRow] = await conn.query('SELECT DATABASE() AS db');
  console.log('Connected to', dbRow[0].db);

  const root = path.join(__dirname, '..');
  console.log('\n1) Creating Node tables...');
  await runSqlFile(conn, path.join(root, 'database', 'schema.sql'));
  await runSqlFile(conn, path.join(root, 'prisma', 'migrations', 'add_attendance.sql'));
  await runSqlFile(conn, path.join(root, 'prisma', 'migrations', 'add_carmel.sql'));
  await runSqlFile(conn, path.join(root, 'prisma', 'migrations', 'add_prayer_collector.sql'));
  await runSqlFile(conn, path.join(root, 'prisma', 'migrations', 'add_youtube_videos.sql'));

  console.log('\n2) Adding missing columns for Node APIs (keep PHP tables)...');
  await addColumnIfMissing(conn, 'youth_attendance', 'time', 'time VARCHAR(20) NULL');
  await addColumnIfMissing(conn, 'youth_attendance', 'device', 'device VARCHAR(20) NULL');
  await addColumnIfMissing(conn, 'youth_attendance', 'added_by', "added_by VARCHAR(20) NOT NULL DEFAULT 'self'");
  await addColumnIfMissing(conn, 'carmel_attendance', 'session_name', 'session_name VARCHAR(50) NULL');
  await addColumnIfMissing(conn, 'carmel_attendance', 'device_type', 'device_type VARCHAR(20) NULL');
  await addColumnIfMissing(conn, 'carmel_attendance', 'duration_mins', 'duration_mins INT NOT NULL DEFAULT 30');
  await addColumnIfMissing(conn, 'carmel_attendance', 'added_by', "added_by VARCHAR(20) NOT NULL DEFAULT 'self'");

  if (await tableExists(conn, 'blogs')) {
    await addColumnIfMissing(conn, 'blogs', 'slug', 'slug VARCHAR(255) NULL');
    await addColumnIfMissing(conn, 'blogs', 'title_ta', 'title_ta VARCHAR(500) NULL');
    await addColumnIfMissing(conn, 'blogs', 'content_ta', 'content_ta LONGTEXT NULL');
    await addColumnIfMissing(conn, 'blogs', 'excerpt_ta', 'excerpt_ta TEXT NULL');
    await addColumnIfMissing(conn, 'blogs', 'meta_title', 'meta_title VARCHAR(255) NULL');
    await addColumnIfMissing(conn, 'blogs', 'meta_desc', 'meta_desc VARCHAR(500) NULL');
    await addColumnIfMissing(conn, 'blogs', 'og_image', 'og_image VARCHAR(500) NULL');
    await addColumnIfMissing(conn, 'blogs', 'featured_image', 'featured_image VARCHAR(500) NULL');
    await addColumnIfMissing(conn, 'blogs', 'tags', 'tags VARCHAR(500) NULL');
    await addColumnIfMissing(conn, 'blogs', 'views', 'views INT NOT NULL DEFAULT 0');
  }

  console.log('\n3) Copying PHP blog posts into Node blogs table...');
  await migrateBlogs(conn);

  console.log('\n4) Ensuring admin login...');
  const admin = await ensureAdmin(conn);

  const [tables] = await conn.query('SHOW TABLES');
  console.log('\nTables now:', tables.length);
  const [blogCount] = await conn.query('SELECT COUNT(*) AS c FROM blogs').catch(() => [[{ c: 0 }]]);
  const [youthCount] = await conn.query('SELECT COUNT(*) AS c FROM youth_attendance').catch(() => [[{ c: 0 }]]);
  const [carmelCount] = await conn.query('SELECT COUNT(*) AS c FROM carmel_attendance').catch(() => [[{ c: 0 }]]);
  console.log('blogs:', blogCount[0].c, '| youth_attendance:', youthCount[0].c, '| carmel_attendance:', carmelCount[0].c);

  await conn.end();
  console.log('\nDatabase setup finished.');
  if (admin) {
    console.log(`Admin login: ${admin.email}`);
    console.log(`Admin password: ${admin.password}`);
  }
}

main().catch((err) => {
  console.error('SETUP FAILED:', err.message || err);
  process.exit(1);
});
