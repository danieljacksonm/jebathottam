# Pre-launch checklist – Ebenezer Digital Services

Use this list before moving the site to production.

---

## 1. Content & copy

- [ ] **Replace placeholder contact details**
  - Contact email: `info@ebenezerdigital.com`
  - Phone / WhatsApp: `+91 98944 96560`
- [ ] **Review all copy** for accuracy (services, process, work samples)
- [ ] **Work / portfolio** – Replace example projects with real projects and real images (or keep as placeholders and label as examples)
- [ ] **Legal pages** – Add links in footer to Privacy Policy and Terms of Service (create those pages if required in your region)

---

## 2. SEO & discovery

- [ ] **Set production URL** – In your host (e.g. Vercel), set env var `NEXT_PUBLIC_SITE_URL` to your live URL (e.g. `https://www.ebenezerdigitalservices.com`)
- [ ] **Open Graph image** – Create an image (e.g. 1200×630) for social sharing, save as `public/og-image.png`, then in `app/layout.tsx` uncomment the `images` line in `openGraph` and point to `/og-image.png`
- [ ] **Google Search Console** – Add the site, then in `layout.tsx` add `verification: { google: "your-code" }` to metadata when you have the code
- [ ] **Sitemap** – Next.js can auto-generate; add `app/sitemap.ts` if you want a custom sitemap (optional)
- [ ] **robots.txt** – Ensure you’re not blocking important pages (default Next.js is fine for a single-page site)

---

## 3. Technical

- [ ] **Build** – Run `npm run build` and fix any errors
- [ ] **Environment** – No secrets in client code; use `NEXT_PUBLIC_*` only for public values
- [ ] **Images** – `next.config.js` already allows Unsplash; if you switch to your own CDN/domain, add it to `images.remotePatterns`
- [ ] **Forms** – If the contact form submits to an API or email service, wire it up and test (see `ContactForm.tsx`)
- [ ] **Viewer counter** – Footer shows a session-based viewer count. The count is in-memory and resets on server cold start (e.g. after idle on Vercel). For a persistent count, replace the logic in `app/api/counter/route.ts` with Redis (e.g. Upstash) or a database.
- [ ] **Links** – Check all `#services`, `#process`, `#contact`, etc. work with your fixed header

---

## 4. Performance & accessibility

- [ ] **Lighthouse** – Run in Chrome DevTools (Performance, Accessibility, Best Practices, SEO) and fix critical issues
- [ ] **Core Web Vitals** – Check LCP, FID, CLS; hero image uses `priority` and is optimized via Next/Image
- [ ] **Reduced motion** – Site respects `prefers-reduced-motion`; test with “Reduce motion” enabled in OS
- [ ] **Focus states** – Buttons and nav links have visible focus styles for keyboard users

---

## 5. Analytics & monitoring (optional)

- [ ] Add Google Analytics (GA4) or similar – e.g. via script in layout or a provider component
- [ ] Optional: error tracking (e.g. Sentry) for production errors

---

## 6. Deployment

- [ ] **Hosting** – Deploy to Vercel, Netlify, or your chosen host; connect repo and set env vars
- [ ] **Domain** – Point your domain to the host and (if needed) set up SSL (usually automatic on Vercel/Netlify)
- [ ] **HTTPS** – Ensure the site is served over HTTPS in production
- [ ] **Final test** – Open the live URL, test contact form, all sections, and mobile layout

---

## Quick reference

| Item              | Where to change it                          |
|-------------------|---------------------------------------------|
| Site URL for SEO  | Env: `NEXT_PUBLIC_SITE_URL`                 |
| WhatsApp number   | `app/page.tsx` – Contact section           |
| Email             | `app/page.tsx` + `layout.tsx` (JSON-LD)     |
| OG image          | `public/og-image.png` + `app/layout.tsx`    |
| Google verify     | `app/layout.tsx` → metadata.verification     |

Once these are done, you’re ready to go live.
