# Using Prisma in this project

The app is set up to use **Prisma** as the main ORM so you can use typed queries instead of raw SQL.

## Setup

**On the server (e.g. VPS):** Ensure the `prisma` folder and `prisma/schema.prisma` file are present in the project root. If you get “Could not find Prisma Schema”, run `git pull` (or re-deploy) so the repo includes the `prisma/` directory.

1. **Install dependencies** (includes `prisma` and `@prisma/client`):
   ```bash
   npm install
   ```

2. **Set `DATABASE_URL`** in `.env` (same as before). Example for MySQL:
   ```
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
   ```
   Or keep using separate vars; the existing `lib/db.ts` (mysql2) can still build a URL if needed for other tools.

3. **Generate the Prisma client** (no DB needed for this step):
   ```bash
   npx prisma generate
   ```
   This reads `prisma/schema.prisma` and generates the client under `node_modules/.prisma/client`.

4. **Existing database**: The schema in `prisma/schema.prisma` is aligned with `database/schema.sql`. You do **not** need to run `prisma migrate` if the tables already exist. Just run `prisma generate` and use the client.

## What uses Prisma today

- **Auth** (`lib/auth.ts`) – user lookup by id
- **Settings** (`app/api/settings/route.ts`) – get/update settings
- **Audio** (`app/api/audio/route.ts`, `app/api/audio/[id]/route.ts`) – 24-hour audio tracks CRUD
- **SIP dial-in info** (`app/api/sip/dial-in-info/route.ts`) – public settings for the bridge

All other API routes still use the legacy `query()` from `lib/db` (mysql2). You can migrate them step by step to Prisma.

## Migrating a route from `query()` to Prisma

1. In the route file, replace:
   ```ts
   import { query } from '@/lib/db';
   ```
   with:
   ```ts
   import { prisma } from '@/lib/prisma';
   ```

2. Replace raw SQL with Prisma calls. Examples:

   - **Select by id**
     - Before: `const rows = await query('SELECT * FROM gallery WHERE id = ?', [id]);`
     - After: `const item = await prisma.galleryItem.findUnique({ where: { id } });`

   - **Select many**
     - Before: `const rows = await query('SELECT * FROM audio_tracks ORDER BY order_index');`
     - After: `const rows = await prisma.audioTrack.findMany({ orderBy: { order_index: 'asc' } });`

   - **Insert**
     - Before: `await query('INSERT INTO audio_tracks (...) VALUES (?)', [...]);`
     - After: `await prisma.audioTrack.create({ data: { title, url, ... } });`

   - **Update**
     - Before: `await query('UPDATE audio_tracks SET ... WHERE id = ?', [...]);`
     - After: `await prisma.audioTrack.update({ where: { id }, data: { ... } });`

   - **Delete**
     - Before: `await query('DELETE FROM audio_tracks WHERE id = ?', [id]);`
     - After: `await prisma.audioTrack.delete({ where: { id } });`

3. Handle Prisma errors (e.g. `P2025` for “record not found”) and return the same HTTP status/body your API expects.

## Schema and table names

Model names in `prisma/schema.prisma` are PascalCase (e.g. `AudioTrack`, `GalleryItem`). Table names are kept as in the existing DB via `@@map("audio_tracks")`, `@@map("gallery")`, etc., so no database changes are required.

## Build

`npm run build` runs `prisma generate` before `next build`, so the client is always up to date.

## Optional: Prisma Studio

To inspect or edit data in the browser:

```bash
npx prisma studio
```

Requires a valid `DATABASE_URL` and the database to be running.
