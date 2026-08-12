# Cutover QA checklist (PHP → Node on VPS)

Use staging subdomain first. Keep PHP live until every box passes.

## Auth & security
- [ ] Public `/api/auth/register` returns 403 without admin session
- [ ] Forged/unsigned JWT cannot open `/admin`
- [ ] Login sets httpOnly cookie; admin works without localStorage token
- [ ] `SETUP_ADMIN_SECRET` is empty in production after bootstrap
- [ ] Security headers present (X-Frame-Options, nosniff, HSTS on HTTPS)

## Brand & pages
- [ ] Contact shows anselmajohn2020@gmail.com, +91 phones, Keelamudiman address
- [ ] Footer / nav: About, Services, Gallery, Team, Videos, Blog, Attendance, Carmel, Contact
- [ ] No `ministryplatform` or US placeholder text
- [ ] Homepage does not show demo blogs when DB is empty (production)
- [ ] `/privacy-policy` and custom 404 work

## Blog & SEO
- [ ] Posts use `/blog/{slug}` (numeric id still resolves)
- [ ] Tamil content with `?lang=ta` + hreflang
- [ ] `/sitemap.xml` and `/robots.txt` return 200
- [ ] Homepage / blog OG titles mention Jesus is the Way Jebathottam

## Attendance & Carmel
- [ ] `/attendance` mark once per name/day; captcha; leaderboard
- [ ] Rate limit ~3 marks/hour across youth+carmel
- [ ] `/carmel-attendance` slots + coverage % + mark
- [ ] Admin `/admin/attendance` and `/admin/carmel` list + CSV export

## Contact mail
- [ ] Valid form emails arrive at CONTACT_TO / anselmajohn2020@gmail.com
- [ ] Honeypot `website` filled → fake success, no mail

## Prayer Collector
- [ ] `GET /api/prayer/settings` with Bearer `PRAYER_API_TOKEN` works
- [ ] Session start/update/end + attendance smoke test from app or curl

## Videos
- [ ] `/videos` lists DB rows (empty OK before first sync)
- [ ] `POST /api/videos/sync` with `X-Cron-Secret` upserts (not on every page load)

## Cutover
- [ ] Staging QA complete
- [ ] DNS apex/www → VPS
- [ ] PHP backup retained 1–2 weeks for rollback
- [ ] Search Console sitemap resubmitted after go-live
