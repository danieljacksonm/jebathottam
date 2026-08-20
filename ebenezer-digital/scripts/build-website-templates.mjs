import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const packs = path.join(root, "public", "downloads", "packs");
const zips = path.join(root, "public", "downloads");

function writeDir(dir, files) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content);
  }
}

function zipPack(name) {
  const src = path.join(packs, name);
  const zip = path.join(zips, `${name}.zip`);
  if (fs.existsSync(zip)) fs.unlinkSync(zip);
  if (process.platform === "win32") {
    execFileSync(
      "powershell.exe",
      ["-NoProfile", "-Command", `Compress-Archive -Path '${src}\\*' -DestinationPath '${zip}' -Force`],
      { stdio: "inherit" }
    );
  } else {
    execFileSync("zip", ["-r", zip, "."], { cwd: src, stdio: "inherit" });
  }
  console.log("zipped", name);
}

const license = `Ebenezer Store License
You may use this template for one business website.
You may edit all files.
You may not resell this template as a competing digital product.
`;

function nav(brand, links, extra = "") {
  return `<header class="top">
  <div class="wrap bar">
    <a class="brand" href="index.html">${brand}</a>
    <nav>${links.map((l) => `<a href="${l.href}">${l.label}</a>`).join("")}</nav>
  </div>
</header>${extra}`;
}

function foot(brand) {
  return `<footer class="foot"><div class="wrap"><p>${brand} · HTML template from Ebenezer Store</p><p><a href="https://ebenezerdigital.store/products">More templates</a></p></div></footer>
<script src="script.js"></script>`;
}

const sharedJs = `document.querySelectorAll("[data-wa]").forEach(function (el) {
  el.addEventListener("click", function (e) {
    var text = el.getAttribute("data-wa") || "Hello, I have an enquiry.";
    var phone = el.getAttribute("data-phone") || "919894496560";
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(text), "_blank");
  });
});
`;

/* ── Restaurant ─────────────────────────────────────────── */
const restCss = `:root{--bg:#14110e;--paper:#f4efe6;--ink:#1c1712;--muted:#6b5e52;--accent:#8a6a3b;--line:rgba(28,23,18,.12)}
*{box-sizing:border-box}html,body{margin:0;background:var(--paper);color:var(--ink);font-family:"Georgia","Times New Roman",serif}
a{color:inherit;text-decoration:none}.wrap{max-width:1040px;margin:0 auto;padding:0 1.25rem}
.top{position:sticky;top:0;background:rgba(244,239,230,.94);border-bottom:1px solid var(--line);z-index:5}
.bar{display:flex;justify-content:space-between;align-items:center;height:64px;gap:1rem}
.brand{font-weight:700;letter-spacing:.04em}nav{display:flex;gap:1.1rem;font-size:.92rem}
.hero{min-height:78vh;display:grid;place-items:center;background:linear-gradient(180deg,rgba(20,17,14,.35),rgba(20,17,14,.55)),url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80") center/cover;color:#f7f1e6;text-align:center}
.hero h1{font-size:clamp(2.4rem,6vw,4.4rem);margin:.2rem 0}.hero p{max-width:36rem;margin:0 auto 1.4rem;opacity:.9}
.btn{display:inline-block;background:var(--accent);color:#fff;padding:.8rem 1.2rem;border-radius:2px}
section{padding:4.5rem 0}h2{font-size:2rem;margin:0 0 1rem}
.grid{display:grid;gap:1.2rem}.menu-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.card{background:#fff;padding:1.2rem;border:1px solid var(--line)}
.foot{background:var(--bg);color:#efe8dc;padding:2rem 0;font-size:.9rem}
form{display:grid;gap:.7rem;max-width:28rem}input,textarea{padding:.7rem;border:1px solid var(--line);font:inherit}
@media(max-width:700px){nav{display:none}}
`;

writeDir(path.join(packs, "restaurant-website-template"), {
  "styles.css": restCss,
  "script.js": sharedJs,
  "LICENSE.txt": license,
  "README.md": `# Restaurant Website Template

Open index.html in a browser.

## Edit
- Change restaurant name in every HTML file
- Replace photos (search Unsplash URLs in HTML)
- Set WhatsApp number in data-phone attributes

## Host
Upload this folder to Netlify, GitHub Pages, or any cPanel public_html folder.
`,
  "index.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cedar Table</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Cedar Table", [{ href: "index.html", label: "Home" }, { href: "menu.html", label: "Menu" }, { href: "about.html", label: "About" }, { href: "contact.html", label: "Contact" }])}
<section class="hero"><div class="wrap"><p>Kitchen · Coimbatore</p><h1>Cedar Table</h1><p>Seasonal plates, slow cooking, and a quiet dining room.</p><a class="btn" href="menu.html">See the menu</a></div></section>
<section><div class="wrap"><h2>This week</h2><div class="grid menu-grid"><div class="card"><h3>Millet risotto</h3><p>Roasted squash, curry leaf oil.</p></div><div class="card"><h3>Coastal fish</h3><p>Tamarind broth, steamed rice.</p></div><div class="card"><h3>Palm jaggery tart</h3><p>Coconut cream, toasted sesame.</p></div></div></div></section>
${foot("Cedar Table")}</body></html>`,
  "menu.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Menu · Cedar Table</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Cedar Table", [{ href: "index.html", label: "Home" }, { href: "menu.html", label: "Menu" }, { href: "about.html", label: "About" }, { href: "contact.html", label: "Contact" }])}
<section><div class="wrap"><h2>Menu</h2><div class="grid menu-grid"><div class="card"><h3>Starters</h3><p>Coconut rasam · 180<br>Grilled paneer · 220</p></div><div class="card"><h3>Mains</h3><p>Millet risotto · 340<br>Coastal fish · 420</p></div><div class="card"><h3>Sweets</h3><p>Palm tart · 160<br>Filter coffee · 80</p></div></div></div></section>
${foot("Cedar Table")}</body></html>`,
  "about.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>About · Cedar Table</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Cedar Table", [{ href: "index.html", label: "Home" }, { href: "menu.html", label: "Menu" }, { href: "about.html", label: "About" }, { href: "contact.html", label: "Contact" }])}
<section><div class="wrap"><h2>About</h2><p>Cedar Table is a sample restaurant website. Replace this story with your kitchen, your farmers, and your hours.</p></div></section>
${foot("Cedar Table")}</body></html>`,
  "contact.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contact · Cedar Table</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Cedar Table", [{ href: "index.html", label: "Home" }, { href: "menu.html", label: "Menu" }, { href: "about.html", label: "About" }, { href: "contact.html", label: "Contact" }])}
<section><div class="wrap"><h2>Book a table</h2><p>12, Sample Street · Open 12:00–15:00 and 18:30–22:30</p>
<form onsubmit="event.preventDefault();alert('Replace this form action with your email or WhatsApp.');">
<input required placeholder="Name"><input required placeholder="Phone"><textarea rows="4" placeholder="Date, time, guests"></textarea>
<button class="btn" type="submit">Send</button>
</form>
<p><button class="btn" type="button" data-wa="Hi, I want a table at Cedar Table." data-phone="919894496560">WhatsApp</button></p>
</div></section>
${foot("Cedar Table")}</body></html>`,
});

/* ── Travel ─────────────────────────────────────────────── */
const travelCss = `:root{--bg:#0e1c24;--paper:#f3f1eb;--ink:#12202a;--muted:#5b6b74;--accent:#2f6f7e;--line:rgba(18,32,42,.12)}
*{box-sizing:border-box}html,body{margin:0;background:var(--paper);color:var(--ink);font-family:"Segoe UI",sans-serif}
a{color:inherit;text-decoration:none}.wrap{max-width:1080px;margin:0 auto;padding:0 1.25rem}
.top{background:var(--bg);color:#f4f0e6}.bar{display:flex;justify-content:space-between;align-items:center;height:64px}
.brand{font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:.85rem}nav{display:flex;gap:1rem;font-size:.9rem}
.hero{padding:5.5rem 0 4rem;background:linear-gradient(120deg,#0e1c24 0%,#1d3d48 55%,#c4a574 160%);color:#f7f3ea}
.hero h1{font-size:clamp(2.2rem,5vw,3.8rem);max-width:16ch}.btn{display:inline-block;margin-top:1rem;background:#c4a574;color:#1a140c;padding:.75rem 1.15rem;font-weight:600}
section{padding:4rem 0}h2{font-size:1.8rem}.grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.card{background:#fff;border:1px solid var(--line);padding:1.1rem}.price{color:var(--accent);font-weight:700}
.foot{background:var(--bg);color:#d7e0e4;padding:2rem 0}form{display:grid;gap:.7rem;max-width:32rem}input,textarea,select{padding:.7rem;border:1px solid var(--line);font:inherit}
@media(max-width:700px){nav{display:none}}
`;

writeDir(path.join(packs, "travel-agency-website-template"), {
  "styles.css": travelCss,
  "script.js": sharedJs,
  "LICENSE.txt": license,
  "README.md": `# Travel Agency Website Template

Open index.html. Duplicate a package card in packages.html to add tours.
Set data-phone to your WhatsApp number.
Upload the folder to any static host.
`,
  "index.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Northwind Tours</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Northwind Tours", [{ href: "index.html", label: "Home" }, { href: "packages.html", label: "Packages" }, { href: "about.html", label: "About" }, { href: "enquiry.html", label: "Enquiry" }])}
<div class="hero"><div class="wrap"><p>Private tours · India &amp; nearby</p><h1>Trips planned with calm, clear numbers.</h1><a class="btn" href="packages.html">View packages</a></div></div>
<section><div class="wrap"><h2>Why agents use this layout</h2><div class="grid"><div class="card"><h3>Clear packages</h3><p>One card per tour. Price visible.</p></div><div class="card"><h3>Enquiry path</h3><p>Form + WhatsApp in one click.</p></div><div class="card"><h3>Easy edit</h3><p>Change names and prices in HTML.</p></div></div></div></section>
${foot("Northwind Tours")}</body></html>`,
  "packages.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Packages</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Northwind Tours", [{ href: "index.html", label: "Home" }, { href: "packages.html", label: "Packages" }, { href: "about.html", label: "About" }, { href: "enquiry.html", label: "Enquiry" }])}
<section><div class="wrap"><h2>Packages</h2><div class="grid"><div class="card"><h3>Ooty 3N</h3><p>Stay, transfers, two viewpoints.</p><p class="price">USD 180 / person</p></div><div class="card"><h3>Kerala 5N</h3><p>Backwaters + hill station.</p><p class="price">USD 320 / person</p></div><div class="card"><h3>Golden Triangle 6N</h3><p>Delhi, Agra, Jaipur.</p><p class="price">USD 410 / person</p></div></div></div></section>
${foot("Northwind Tours")}</body></html>`,
  "about.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>About</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Northwind Tours", [{ href: "index.html", label: "Home" }, { href: "packages.html", label: "Packages" }, { href: "about.html", label: "About" }, { href: "enquiry.html", label: "Enquiry" }])}
<section><div class="wrap"><h2>About</h2><p>Replace this with your agency story, licence number, and years in the trade.</p></div></section>
${foot("Northwind Tours")}</body></html>`,
  "enquiry.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Enquiry</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Northwind Tours", [{ href: "index.html", label: "Home" }, { href: "packages.html", label: "Packages" }, { href: "about.html", label: "About" }, { href: "enquiry.html", label: "Enquiry" }])}
<section><div class="wrap"><h2>Plan a trip</h2>
<form onsubmit="event.preventDefault();alert('Connect this form to your email or WhatsApp.');">
<input required placeholder="Name"><input required placeholder="Phone / WhatsApp"><input placeholder="Destination"><input placeholder="Travel dates"><textarea rows="4" placeholder="Adults, children, budget"></textarea>
<button class="btn" type="submit">Send enquiry</button>
</form>
<p><button class="btn" type="button" data-wa="Hi, I want a tour quotation." data-phone="919894496560">WhatsApp now</button></p>
</div></section>
${foot("Northwind Tours")}</body></html>`,
});

/* ── Church ─────────────────────────────────────────────── */
const churchCss = `:root{--bg:#1b2420;--paper:#f6f4ef;--ink:#1d241f;--muted:#5f6a64;--accent:#3d5c4a;--line:rgba(29,36,31,.12)}
*{box-sizing:border-box}html,body{margin:0;background:var(--paper);color:var(--ink);font-family:"Palatino Linotype","Book Antiqua",serif}
a{color:inherit;text-decoration:none}.wrap{max-width:980px;margin:0 auto;padding:0 1.25rem}
.top{border-bottom:1px solid var(--line)}.bar{display:flex;justify-content:space-between;align-items:center;height:70px}
.brand{font-weight:700}nav{display:flex;gap:1.1rem;font-size:.95rem}
.hero{padding:5rem 0 3.5rem;text-align:center}.hero h1{font-size:clamp(2.2rem,5vw,3.6rem);margin:.4rem 0}
.times{display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;margin-top:1.5rem}
section{padding:3.5rem 0}h2{text-align:center}.grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.card{background:#fff;border:1px solid var(--line);padding:1.2rem;text-align:center}
.btn{display:inline-block;background:var(--accent);color:#fff;padding:.7rem 1.1rem}
.foot{background:var(--bg);color:#e7eee9;padding:2rem 0;text-align:center}form{display:grid;gap:.7rem;max-width:28rem;margin:1rem auto}input,textarea{padding:.7rem;border:1px solid var(--line);font:inherit}
@media(max-width:700px){nav{display:none}}
`;

writeDir(path.join(packs, "church-website-template"), {
  "styles.css": churchCss,
  "script.js": sharedJs,
  "LICENSE.txt": license,
  "README.md": `# Church Website Template

Open index.html. Edit service times on the home page.
Replace address and WhatsApp number on contact.html.
Upload the folder to any static host.
`,
  "index.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Grace Assembly</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Grace Assembly", [{ href: "index.html", label: "Home" }, { href: "about.html", label: "About" }, { href: "ministries.html", label: "Ministries" }, { href: "contact.html", label: "Contact" }])}
<div class="hero wrap"><p>A sample church website</p><h1>Grace Assembly</h1><p>Sunday worship, prayer, and a quiet welcome.</p>
<div class="times"><div><strong>Sunday</strong><p>9:30 AM · 6:00 PM</p></div><div><strong>Wednesday</strong><p>Prayer 7:00 PM</p></div></div>
</div>
<section><div class="wrap"><h2>This week</h2><div class="grid"><div class="card"><h3>Sunday service</h3><p>Bring a friend. Stay for tea.</p></div><div class="card"><h3>Youth</h3><p>Saturday 4:00 PM.</p></div><div class="card"><h3>Outreach</h3><p>Visit notes on the ministries page.</p></div></div></div></section>
${foot("Grace Assembly")}</body></html>`,
  "about.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>About</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Grace Assembly", [{ href: "index.html", label: "Home" }, { href: "about.html", label: "About" }, { href: "ministries.html", label: "Ministries" }, { href: "contact.html", label: "Contact" }])}
<section><div class="wrap"><h2>About</h2><p>Replace this with your church history, pastor name, and statement of faith. Keep it short and clear.</p></div></section>
${foot("Grace Assembly")}</body></html>`,
  "ministries.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ministries</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Grace Assembly", [{ href: "index.html", label: "Home" }, { href: "about.html", label: "About" }, { href: "ministries.html", label: "Ministries" }, { href: "contact.html", label: "Contact" }])}
<section><div class="wrap"><h2>Ministries</h2><div class="grid"><div class="card"><h3>Children</h3><p>Sunday during first service.</p></div><div class="card"><h3>Women</h3><p>First Saturday of the month.</p></div><div class="card"><h3>Prayer</h3><p>Wednesday 7:00 PM.</p></div></div></div></section>
${foot("Grace Assembly")}</body></html>`,
  "contact.html": `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contact</title><link rel="stylesheet" href="styles.css"></head><body>
${nav("Grace Assembly", [{ href: "index.html", label: "Home" }, { href: "about.html", label: "About" }, { href: "ministries.html", label: "Ministries" }, { href: "contact.html", label: "Contact" }])}
<section><div class="wrap"><h2>Visit</h2><p>12 Sample Road, Your Town</p>
<form onsubmit="event.preventDefault();alert('Connect this form to church email.');">
<input required placeholder="Name"><input required placeholder="Phone"><textarea rows="4" placeholder="Prayer request or visit question"></textarea>
<button class="btn" type="submit">Send</button>
</form>
<p><button class="btn" type="button" data-wa="Hello, I would like church information." data-phone="919894496560">WhatsApp the office</button></p>
</div></section>
${foot("Grace Assembly")}</body></html>`,
});

zipPack("restaurant-website-template");
zipPack("travel-agency-website-template");
zipPack("church-website-template");
console.log("website templates ready");
