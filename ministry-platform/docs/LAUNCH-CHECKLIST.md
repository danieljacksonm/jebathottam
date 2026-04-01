# Launch checklist – admin editability & uploads

Use this to confirm the site is fully editable from admin and that image, song (audio), and video flows work before launch.

---

## 1. Full site editable in admin

| Section | Admin path | What you can edit |
|--------|------------|-------------------|
| **General** | Settings → General | Ministry name, tagline, scripture, email, phone, address |
| **About** | Settings → About Us | Heading, main text, secondary text |
| **Mission & Vision** | Settings → Mission & Vision | Titles and descriptions |
| **Logo & brand** | Settings → Logo & Brand | Logo URL, primary color |
| **Dial-in** | Settings → Dial-in | Dial-in numbers, PIN, conference URL, Jitsi room name |
| **Hero slider** | Admin → Hero Slider | Slides (image, title, description, order) |
| **Blogs** | Admin → Blogs | Create, edit, delete; publish/draft; categories |
| **Gallery** | Admin → Gallery | Add/edit/delete images (upload or URL) |
| **Events** | Admin → Events | Add/edit/delete events |
| **Testimonies** | Admin → Testimonies | Add/edit/delete (text + optional image) |
| **Team** | Admin → Team | Add/edit/delete team members (photo + details) |
| **Media library** | Admin → Media Library | Posters (image), YouTube videos (video ID + thumbnail) |
| **24-Hour Audio** | Admin → 24-Hour Audio | Add/edit/delete tracks (title, artist, audio URL, cover image) |
| **Notes & sermons** | Admin → Notes & Sermons | Content |
| **Prophecy** | Admin → Prophecy | Content |
| **Settings** | Admin → Settings | All keys above |

Ensure you are logged in as a user with the right role (e.g. `super_admin` for uploads and most edits).

---

## 2. Image upload

- **Used in:** Gallery, Testimonies, Team, Hero Slider, Media Library (poster/thumbnail), 24-Hour Audio (cover).
- **API:** `POST /api/upload` with `file` (image) and `type` (`gallery` | `testimony` | `team` | `slider` | `media` | `general`).
- **Auth:** Request must include auth (e.g. cookie + `Authorization: Bearer <token>`). Upload is restricted to `super_admin`.
- **Check:**
  - [ ] Gallery: upload image → URL appears in form → save → image shows on site.
  - [ ] Testimonies: upload image → URL appears → save → testimony shows image.
  - [ ] Team: upload photo → URL appears → save → team member shows photo.
  - [ ] Hero Slider: choose image → URL fills → save → slide shows on homepage.
  - [ ] Media Library: add poster/thumbnail via upload → URL fills → save.
  - [ ] 24-Hour Audio: upload cover image → URL fills → save.

If the URL field clears after upload, ensure the input is `type="text"` (not `type="url"`) so relative URLs like `/api/uploads/...` are accepted.

---

## 3. Song / audio (24-Hour Audio)

- **Admin:** Admin → **24-Hour Audio**.
- **Behaviour:** Tracks are stored in the database. Homepage player loads from `GET /api/audio`; if no tracks exist, it falls back to static data.
- **Fields:** Title, artist, duration, **audio URL** (required), cover image (upload or URL), scripture.
- **Audio “upload”:** The app does not upload audio files to your server. You provide an **audio URL** (e.g. MP3 hosted elsewhere, or a link to your own file). For true “song upload” you would host MP3s (e.g. in `public/` or a CDN) and paste the URL in the admin.
- **Check:**
  - [ ] Add a track with a working audio URL and optional cover (upload or URL).
  - [ ] Save and confirm it appears in the list.
  - [ ] Open homepage → 24-Hour Audio section → track appears and plays.
  - [ ] Edit/delete from admin and confirm homepage updates (or falls back correctly).

**Optional:** To support “song upload” (file stored on server), you’d extend `POST /api/upload` to accept `audio/*` and a type like `audio`, then use the returned URL as the track’s audio URL.

---

## 4. Video (Media Library)

- **Admin:** Admin → **Media Library**.
- **Behaviour:** “Video” items use a **YouTube video ID** (or similar), not raw video file upload. You set type (e.g. `youtube` or `youtube-shorts`), paste the video ID, and optionally set a thumbnail (image upload or URL).
- **Check:**
  - [ ] Add a media item with type YouTube, video ID, and optional thumbnail (upload or URL).
  - [ ] Save and confirm it appears in Media Library and on the site (e.g. Media section).
  - [ ] Thumbnail upload works and URL is saved correctly.

---

## 5. Quick verification list

- [ ] **Settings** – Change a visible setting (e.g. ministry name) → save → confirm on frontend.
- [ ] **Image upload** – At least one test upload each for Gallery, Testimonies, Team, Slider, Media, 24-Hour Audio; URL persists and content displays.
- [ ] **Song/audio** – At least one 24-Hour Audio track with audio URL (and optional image); plays on homepage.
- [ ] **Video** – At least one Media item with YouTube ID (and optional thumbnail); displays on site.
- [ ] **Auth** – Admin requests (including uploads) send auth (cookie + Bearer token where used); 401/403 if not logged in or insufficient role.

---

## 6. Database: `audio_tracks` table

If you already have the app running and add the new 24-Hour Audio feature, ensure the table exists:

```sql
CREATE TABLE IF NOT EXISTS audio_tracks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  duration VARCHAR(50),
  image_url VARCHAR(500),
  url VARCHAR(1000) NOT NULL,
  scripture TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order (order_index)
);
```

Run this (e.g. in MySQL/MariaDB) if the table is missing. The schema is also in `database/schema.sql`.

---

After completing the checklist, the site should be fully editable from admin with image upload, song (audio URL) and video (YouTube + thumbnail) working as designed for launch.
