#!/usr/bin/env node
/**
 * Migrate content from PHP ministry MySQL → Node ministry-platform MySQL.
 *
 * Usage:
 *   PHP_DATABASE_URL=mysql://u:p@host/php_db \
 *   DATABASE_URL=mysql://u:p@host/node_db \
 *   node scripts/migrate-from-php.js
 *
 * Optional: DRY_RUN=1 to print counts only.
 *
 * Maps PHP blog_* fields (title_en/ta, etc.) into Node blogs table.
 * Copies youth_attendance, carmel_attendance, carmel_slots when present.
 * Does NOT copy PHP admin_users passwords (hash format differs) — create Node admin separately.
 */

const mysql = require('mysql2/promise');

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env ${name}`);
    process.exit(1);
  }
  return v;
}

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
  return rows[0].c > 0;
}

async function main() {
  const dry = process.env.DRY_RUN === '1';
  const phpUrl = requireEnv('PHP_DATABASE_URL');
  const nodeUrl = requireEnv('DATABASE_URL');

  const php = await mysql.createConnection(phpUrl);
  const node = await mysql.createConnection(nodeUrl);

  console.log('Connected. dryRun=', dry);

  // --- Blogs ---
  const blogTable = (await tableExists(php, 'blog_posts'))
    ? 'blog_posts'
    : (await tableExists(php, 'blogs'))
      ? 'blogs'
      : null;

  if (blogTable) {
    const [posts] = await php.query(`SELECT * FROM ${blogTable}`);
    console.log(`PHP ${blogTable}: ${posts.length} rows`);
    let inserted = 0;
    for (const p of posts) {
      const title = p.title_en || p.title || 'Untitled';
      const content = p.content_en || p.content || '';
      const excerpt = p.excerpt_en || p.excerpt || null;
      let slug = p.slug || slugify(title);
      if (p.published_at || p.created_at) {
        const d = new Date(p.published_at || p.created_at);
        if (!Number.isNaN(d.getTime())) {
          const y = d.toISOString().slice(0, 10);
          if (!String(slug).endsWith(y)) slug = `${slugify(title)}-${y}`;
        }
      }
      const published =
        p.status === 'published' || p.published === 1 || p.published === true ? 1 : 0;
      const publishedAt = p.published_at || (published ? p.created_at || new Date() : null);

      if (dry) {
        inserted++;
        continue;
      }

      // Ensure unique slug
      let unique = slug;
      let n = 1;
      for (;;) {
        const [ex] = await node.query('SELECT id FROM blogs WHERE slug = ? LIMIT 1', [unique]);
        if (!ex.length) break;
        unique = `${slug}-${n++}`;
      }

      await node.query(
        `INSERT INTO blogs (
          slug, title, title_ta, content, content_ta, excerpt, excerpt_ta,
          meta_title, meta_desc, og_image, featured_image, tags, views,
          author, category, featured, published, published_at, created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), title_ta=VALUES(title_ta), content=VALUES(content),
          content_ta=VALUES(content_ta), excerpt=VALUES(excerpt), excerpt_ta=VALUES(excerpt_ta),
          meta_title=VALUES(meta_title), meta_desc=VALUES(meta_desc),
          og_image=VALUES(og_image), featured_image=VALUES(featured_image),
          tags=VALUES(tags), published=VALUES(published), published_at=VALUES(published_at)`,
        [
          unique,
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
      inserted++;
    }
    console.log(`Blogs migrated: ${inserted}`);
  } else {
    console.log('No PHP blogs table found — skip blogs');
  }

  // --- Youth attendance ---
  if (await tableExists(php, 'youth_attendance')) {
    const [rows] = await php.query('SELECT * FROM youth_attendance');
    console.log(`PHP youth_attendance: ${rows.length}`);
    if (!dry && rows.length) {
      for (const r of rows) {
        await node.query(
          `INSERT INTO youth_attendance (name, date, time, streak, ip_hash, device, marked_at)
           VALUES (?,?,?,?,?,?,?)`,
          [
            r.name,
            r.date,
            r.time || null,
            r.streak || 0,
            r.ip_hash || null,
            r.device || null,
            r.marked_at || new Date(),
          ]
        );
      }
    }
  }

  // --- Carmel slots ---
  if (await tableExists(php, 'carmel_slots')) {
    const [rows] = await php.query('SELECT * FROM carmel_slots');
    console.log(`PHP carmel_slots: ${rows.length}`);
    if (!dry) {
      for (const r of rows) {
        await node.query(
          `INSERT INTO carmel_slots (slot_time, member_name, session, active)
           VALUES (?,?,?,?)
           ON DUPLICATE KEY UPDATE member_name=VALUES(member_name), session=VALUES(session), active=VALUES(active)`,
          [
            r.slot_time || r.time || '00:00',
            r.member_name || r.name || null,
            r.session || null,
            r.active === undefined ? 1 : r.active ? 1 : 0,
          ]
        ).catch(async () => {
          // Fallback if unique key differs
          await node.query(
            `INSERT INTO carmel_slots (slot_time, member_name, session, active) VALUES (?,?,?,?)`,
            [
              r.slot_time || r.time || '00:00',
              r.member_name || r.name || null,
              r.session || null,
              1,
            ]
          );
        });
      }
    }
  }

  // --- Carmel attendance ---
  if (await tableExists(php, 'carmel_attendance')) {
    const [rows] = await php.query('SELECT * FROM carmel_attendance');
    console.log(`PHP carmel_attendance: ${rows.length}`);
    if (!dry && rows.length) {
      for (const r of rows) {
        await node.query(
          `INSERT INTO carmel_attendance
            (name, date, slot_time, session, duration_mins, streak, ip_hash, device, marked_at)
           VALUES (?,?,?,?,?,?,?,?,?)`,
          [
            r.name,
            r.date,
            r.slot_time || null,
            r.session || null,
            r.duration_mins || 30,
            r.streak || 0,
            r.ip_hash || null,
            r.device || null,
            r.marked_at || new Date(),
          ]
        );
      }
    }
  }

  await php.end();
  await node.end();
  console.log('Done. Also copy public images (blog-stock, og-*) into Node public/ manually.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
