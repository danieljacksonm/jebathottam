/**
 * Build real PDF files for Ebenezer Store kits.
 * Run: node scripts/build-store-pdfs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const packs = path.join(root, "public", "downloads", "packs");
const pdfPublic = path.join(root, "public", "downloads", "pdfs");

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

function pdfEscape(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrap(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function buildPdf({ title, kicker, blocks }) {
  const pages = [];
  let current = [];
  let y = 742;

  const flush = () => {
    if (current.length) pages.push(current);
    current = [];
    y = 742;
  };

  const need = (h) => {
    if (y - h < 72) flush();
  };

  const addText = (font, size, text, leading, maxChars) => {
    for (const line of wrap(text, maxChars)) {
      need(leading);
      current.push({ type: "text", font, size, text: line, x: MARGIN, y });
      y -= leading;
    }
  };

  current.push({ type: "header", title, kicker });
  y = 742;

  for (const block of blocks) {
    if (block.type === "h") {
      y -= 10;
      addText("F2", 14, block.text, 20, 62);
      y -= 4;
    } else if (block.type === "p") {
      addText("F1", 11, block.text, 16, 86);
      y -= 6;
    } else if (block.type === "li") {
      need(16);
      current.push({ type: "text", font: "F1", size: 11, text: `  - ${block.text}`, x: MARGIN, y });
      const extra = wrap(block.text, 80).slice(1);
      y -= 16;
      for (const line of extra) {
        need(16);
        current.push({ type: "text", font: "F1", size: 11, text: `    ${line}`, x: MARGIN, y });
        y -= 16;
      }
    } else if (block.type === "check") {
      need(18);
      current.push({ type: "text", font: "F1", size: 11, text: `[ ]  ${block.text}`, x: MARGIN, y });
      y -= 18;
    } else if (block.type === "field") {
      need(28);
      current.push({ type: "field", label: block.text, y });
      y -= 28;
    } else if (block.type === "space") {
      y -= block.h || 12;
    }
  }

  flush();
  if (!pages.length) pages.push([]);

  const objects = [];
  const addObj = (body) => {
    objects.push(body);
    return objects.length;
  };

  const font1 = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const font2 = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const n = pages.length;
  const contentStart = objects.length + 1;
  const pageStart = contentStart + n;
  const pagesObjId = pageStart + n;
  const catalogId = pagesObjId + 1;

  for (let i = 0; i < pages.length; i++) {
    const ops = [];
    ops.push("0.063 0.725 0.506 rg");
    ops.push("0 790 595 52 re f");
    ops.push("1 1 1 rg");
    ops.push("BT");
    ops.push("/F2 10 Tf");
    ops.push("1 0 0 1 48 810 Tm");
    ops.push(`(${pdfEscape(kicker || "EBENEZER STORE")}) Tj`);
    ops.push("/F2 16 Tf");
    ops.push("1 0 0 1 48 792 Tm");
    ops.push(`(${pdfEscape(title)}) Tj`);
    ops.push("ET");

    ops.push("0.07 0.11 0.16 rg");
    ops.push("0 0 595 40 re f");
    ops.push("0.85 0.87 0.89 rg");
    ops.push("BT");
    ops.push("/F1 8 Tf");
    ops.push("1 0 0 1 48 16 Tm");
    ops.push(`(${pdfEscape(`Ebenezer Store  |  Page ${i + 1} of ${pages.length}  |  Instant digital download worldwide`)}) Tj`);
    ops.push("ET");

    for (const item of pages[i]) {
      if (item.type === "header") continue;
      if (item.type === "text") {
        ops.push("0.07 0.11 0.16 rg");
        ops.push("BT");
        ops.push(`/${item.font} ${item.size} Tf`);
        ops.push(`1 0 0 1 ${item.x.toFixed(1)} ${item.y.toFixed(1)} Tm`);
        ops.push(`(${pdfEscape(item.text)}) Tj`);
        ops.push("ET");
      }
      if (item.type === "field") {
        ops.push("0.07 0.11 0.16 rg");
        ops.push("BT");
        ops.push("/F1 10 Tf");
        ops.push(`1 0 0 1 ${MARGIN} ${item.y.toFixed(1)} Tm`);
        ops.push(`(${pdfEscape(item.label)}) Tj`);
        ops.push("ET");
        ops.push("0.85 0.87 0.89 RG");
        ops.push("0.6 w");
        ops.push(`${MARGIN} ${item.y - 8} m ${MARGIN + CONTENT_W} ${item.y - 8} l S`);
      }
    }

    const stream = ops.join("\n");
    addObj(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`);
  }

  const pageIds = [];
  for (let i = 0; i < pages.length; i++) {
    const contentId = contentStart + i;
    pageIds.push(
      addObj(
        `<< /Type /Page /Parent ${pagesObjId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> >>`
      )
    );
  }

  addObj(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  addObj(`<< /Type /Catalog /Pages ${pagesObjId} 0 R >>`);

  let out = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(out, "utf8"));
    out += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref = Buffer.byteLength(out, "utf8");
  let xrefTable = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xrefTable += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  out += xrefTable;
  out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "utf8");
}

function writePdf(filePath, spec) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buildPdf(spec));
}

function publish(slug, fileName, spec, packFolders = [slug]) {
  const publicFile = path.join(pdfPublic, slug, fileName);
  writePdf(publicFile, spec);
  for (const folder of packFolders) {
    const dest = path.join(packs, folder, fileName);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(publicFile, dest);
  }
  return `/downloads/pdfs/${slug}/${fileName}`;
}

const saasGettingStarted = {
  title: "Ebenezer SaaS  -  Getting started",
  kicker: "EBENEZER STORE  |  FREE SOFTWARE GUIDE",
  blocks: [
    { type: "p", text: "This PDF is your setup guide for Ebenezer SaaS, the free cloud billing app for shops worldwide. No ZIP install. You use it in any modern browser." },
    { type: "h", text: "1. What this software does" },
    { type: "p", text: "Create invoices, quotations, and credit notes. Track stock and customers. Record expenses. Print on A4, A5, or thermal printers." },
    { type: "h", text: "2. Start in 10 minutes" },
    { type: "li", text: "Open the SaaS product page and choose Get started free." },
    { type: "li", text: "Create your shop name and currency (USD or your local currency)." },
    { type: "li", text: "Add 5 products you sell every day." },
    { type: "li", text: "Add one customer and make a test invoice." },
    { type: "li", text: "Print or save the invoice as PDF." },
    { type: "h", text: "3. Daily shop flow" },
    { type: "p", text: "Morning: check stock alerts. During the day: bill each sale. Evening: close the day and note cash vs system total." },
    { type: "h", text: "4. Who it is for" },
    { type: "p", text: "Retail stores, traders, and small shops in any country who still bill on paper, Excel, or a basic app." },
    { type: "h", text: "5. Support" },
    { type: "p", text: "Ask Eben AI on the store, or email support from ebenezerdigital.com/contact." },
  ],
};

const saasFeatureSheet = {
  title: "Ebenezer SaaS  -  Feature sheet",
  kicker: "EBENEZER STORE  |  ONE-PAGE FEATURES",
  blocks: [
    { type: "p", text: "Current free plan. Paid Starter plan will come later. Prices on the store are in USD." },
    { type: "h", text: "Billing" },
    { type: "li", text: "Invoices, quotations, credit notes" },
    { type: "li", text: "A4, A5, and thermal print layouts" },
    { type: "li", text: "Cash, card, and other payment notes" },
    { type: "h", text: "Stock and people" },
    { type: "li", text: "Stock in / stock out" },
    { type: "li", text: "Customer list with purchase history" },
    { type: "li", text: "Expense tracking" },
    { type: "h", text: "Reports" },
    { type: "li", text: "Daily sales" },
    { type: "li", text: "Top items" },
    { type: "li", text: "Simple profit snapshot" },
    { type: "h", text: "Works on" },
    { type: "p", text: "Chrome, Edge, Safari, Firefox. Desktop, laptop, and tablet. No app store install." },
  ],
};

const saasInvoice = {
  title: "Sample invoice  -  Ebenezer SaaS",
  kicker: "EBENEZER STORE  |  SAMPLE PDF",
  blocks: [
    { type: "p", text: "Use this as a reference for fields your shop invoice should show. Replace sample text with your shop details." },
    { type: "field", text: "Shop name:  Green Field Retail" },
    { type: "field", text: "Address:  14 Market Street, Your City" },
    { type: "field", text: "Invoice no:  INV-1042" },
    { type: "field", text: "Date:  13 August 2026" },
    { type: "field", text: "Customer:  A. Rahman  |  +00 000 000 0000" },
    { type: "h", text: "Items" },
    { type: "li", text: "Cotton shirt  x2  |  $18  |  $36" },
    { type: "li", text: "Canvas bag   x1  |  $12  |  $12" },
    { type: "li", text: "Subtotal $48   Tax $0   Total $48" },
    { type: "p", text: "Payment: Cash. Thank you for your purchase. Returns within 7 days with receipt." },
  ],
};

const landingLayout = {
  title: "Creator Landing Kit  -  Layout guide",
  kicker: "EBENEZER STORE  |  PDF GUIDE",
  blocks: [
    { type: "p", text: "This PDF shows how to assemble a landing page from the kit. Use it with the copy templates and mobile checklist in the same download." },
    { type: "h", text: "Section order" },
    { type: "li", text: "Hero - one promise + one button" },
    { type: "li", text: "Problem - the pain you solve" },
    { type: "li", text: "Solution - your method" },
    { type: "li", text: "Proof - quotes or results" },
    { type: "li", text: "Pricing - 2 or 3 plans only" },
    { type: "li", text: "FAQ - remove buying fear" },
    { type: "li", text: "Final CTA - repeat the offer" },
    { type: "h", text: "Layout rules" },
    { type: "li", text: "Reading width about 720 to 880px" },
    { type: "li", text: "Bigger gaps between sections than inside cards" },
    { type: "li", text: "One serif for headlines, one sans for UI" },
    { type: "li", text: "One accent color only (brand emerald #10B981 is a good default)" },
    { type: "h", text: "First screen" },
    { type: "p", text: "Show brand name, headline, one sentence, and one main button. Do not put a long form above the fold." },
  ],
};

const landingCopy = {
  title: "Creator Landing Kit  -  Copy templates",
  kicker: "EBENEZER STORE  |  PDF TEMPLATES",
  blocks: [
    { type: "h", text: "Hero" },
    { type: "p", text: "Headline: Get [result] without [pain]." },
    { type: "p", text: "Subtext: We help [audience] achieve [result] through [method]." },
    { type: "p", text: "Primary button: Book a free call. Secondary: See work." },
    { type: "h", text: "Pricing block" },
    { type: "li", text: "Plan name" },
    { type: "li", text: "Best for" },
    { type: "li", text: "Includes (3 to 5 lines)" },
    { type: "li", text: "Price in USD" },
    { type: "li", text: "Button label" },
    { type: "h", text: "Testimonial" },
    { type: "p", text: "\"[Quote in one or two sentences.]\"" },
    { type: "p", text: "- Name, Role / City" },
    { type: "h", text: "FAQ starters" },
    { type: "li", text: "How long does it take?" },
    { type: "li", text: "Can I use this for client work?" },
    { type: "li", text: "What do I get after I buy?" },
  ],
};

const landingMobile = {
  title: "Creator Landing Kit  -  Mobile checklist",
  kicker: "EBENEZER STORE  |  PDF CHECKLIST",
  blocks: [
    { type: "p", text: "Check every box on a real phone before you launch." },
    { type: "check", text: "Headline fits in about 2 lines" },
    { type: "check", text: "Main button is visible without zoom" },
    { type: "check", text: "Form has 5 fields or fewer" },
    { type: "check", text: "Phone and WhatsApp links are easy to tap" },
    { type: "check", text: "Images are compressed and load fast" },
    { type: "check", text: "No overlapping text on small screens" },
    { type: "check", text: "Footer links are readable" },
    { type: "check", text: "Price and currency (USD) are clear" },
  ],
};

const posBlueprint = {
  title: "Shop + POS  -  UI blueprint",
  kicker: "EBENEZER STORE  |  PDF BLUEPRINT",
  blocks: [
    { type: "p", text: "This is a planning pack, not runnable POS software. Use it before you buy or build a system." },
    { type: "h", text: "Core screens" },
    { type: "li", text: "Login / PIN" },
    { type: "li", text: "Billing / cart" },
    { type: "li", text: "Product search and quick add" },
    { type: "li", text: "Customer select / create" },
    { type: "li", text: "Payment (cash / card / credit)" },
    { type: "li", text: "Receipt print / share" },
    { type: "li", text: "Stock list + stock in / stock out" },
    { type: "li", text: "Day close / sales reports" },
    { type: "li", text: "Settings (tax, printers, users)" },
    { type: "h", text: "Staff roles" },
    { type: "li", text: "Owner: all permissions" },
    { type: "li", text: "Cashier: billing + customers (no delete products)" },
    { type: "li", text: "Store manager: stock + reports + PIN reset" },
    { type: "li", text: "Accountant: report export only" },
  ],
};

const posInvoice = {
  title: "Shop + POS  -  Invoice samples",
  kicker: "EBENEZER STORE  |  PDF SAMPLES",
  blocks: [
    { type: "h", text: "A4 invoice fields" },
    { type: "li", text: "Business name, address, tax ID" },
    { type: "li", text: "Invoice number and date" },
    { type: "li", text: "Customer name and phone" },
    { type: "li", text: "Item table: name, qty, rate, tax, amount" },
    { type: "li", text: "Subtotal, tax total, grand total" },
    { type: "li", text: "Payment mode and notes" },
    { type: "h", text: "Thermal receipt (58/80mm)" },
    { type: "li", text: "Header: shop name" },
    { type: "li", text: "Items: qty x rate" },
    { type: "li", text: "Totals" },
    { type: "li", text: "Footer: thanks + short return line" },
    { type: "h", text: "Sample line" },
    { type: "p", text: "INV-0881  |  13 Aug 2026  |  3 items  |  Total $27  |  Paid cash" },
  ],
};

const posChecklist = {
  title: "Shop + POS  -  Buy vs build checklist",
  kicker: "EBENEZER STORE  |  PDF CHECKLIST",
  blocks: [
    { type: "p", text: "Tick what you need before you spend money." },
    { type: "check", text: "Works if the internet drops (offline mode)" },
    { type: "check", text: "Thermal printer support" },
    { type: "check", text: "Multi-store" },
    { type: "check", text: "Tax rules for your country" },
    { type: "check", text: "Barcode scanner" },
    { type: "check", text: "Backup / export" },
    { type: "check", text: "Usable on phone or tablet" },
    { type: "check", text: "Staff can learn it in one afternoon" },
    { type: "h", text: "Stock flow" },
    { type: "p", text: "Purchase or opening stock = stock in. Sale, damage, or return-out = stock out. Set a low-stock alert per item. Reconcile cash and stock every day." },
  ],
};

const travelForm = {
  title: "Travel Enquiry Pack  -  Enquiry form",
  kicker: "EBENEZER STORE  |  PRINTABLE PDF",
  blocks: [
    { type: "p", text: "Print this page or copy the fields into Google Forms. Fill one form per guest enquiry." },
    { type: "field", text: "Date" },
    { type: "field", text: "Guest name" },
    { type: "field", text: "Phone / WhatsApp" },
    { type: "field", text: "Email" },
    { type: "field", text: "Destination" },
    { type: "field", text: "Travel dates" },
    { type: "field", text: "Adults / kids" },
    { type: "field", text: "Budget range (USD)" },
    { type: "field", text: "Hotel preference" },
    { type: "field", text: "Special requests" },
    { type: "field", text: "Follow-up date" },
    { type: "field", text: "Status: New / Quoted / Booked / Lost" },
  ],
};

const travelScripts = {
  title: "Travel Enquiry Pack  -  WhatsApp scripts",
  kicker: "EBENEZER STORE  |  PDF SCRIPTS",
  blocks: [
    { type: "h", text: "Script A  -  First reply" },
    { type: "p", text: "Hi {name}, thanks for your enquiry about {destination}. I can share 2-3 options today. Preferred dates and budget?" },
    { type: "h", text: "Script B  -  Quote sent" },
    { type: "p", text: "Hi {name}, quotation for {dates} is ready. Shall I hold rooms for 24 hours?" },
    { type: "h", text: "Script C  -  Soft follow-up" },
    { type: "p", text: "Hi {name}, checking in on the {destination} trip. Want me to adjust hotels or budget?" },
    { type: "h", text: "Script D  -  Booked" },
    { type: "p", text: "Hi {name}, you are confirmed. I will send tickets and hotel voucher by email today." },
  ],
};

const travelQuote = {
  title: "Travel Enquiry Pack  -  Quotation template",
  kicker: "EBENEZER STORE  |  PDF TEMPLATE",
  blocks: [
    { type: "field", text: "Client" },
    { type: "field", text: "Tour / destination" },
    { type: "field", text: "Dates" },
    { type: "field", text: "Pax" },
    { type: "field", text: "Inclusions" },
    { type: "field", text: "Exclusions" },
    { type: "field", text: "Hotel options" },
    { type: "field", text: "Transport" },
    { type: "field", text: "Price per person / total (USD)" },
    { type: "field", text: "Validity" },
    { type: "field", text: "Payment terms" },
    { type: "p", text: "This quotation is a planning template. Replace sample lines with your live rates." },
  ],
};

const playbook = {
  title: "Digital Business Playbook",
  kicker: "EBENEZER STORE  |  EBOOK PDF",
  blocks: [
    { type: "p", text: "A short, practical ebook for small business owners anywhere in the world who want to sell or promote online without jargon." },
    { type: "h", text: "Chapter 1  -  Decide what you sell" },
    { type: "p", text: "Write one sentence: I help [who] get [result] with [product or service]. If you cannot say it in one sentence, you are not ready to advertise yet." },
    { type: "h", text: "Chapter 2  -  Pick one main channel" },
    { type: "p", text: "Choose website, WhatsApp Business, or one marketplace. Do not open five apps in week one. One channel done well beats five half-used tools." },
    { type: "h", text: "Chapter 3  -  Set clear offers and prices" },
    { type: "p", text: "Show price in USD (or local currency) with what is included. Hidden prices reduce trust. Offer one starter and one full option." },
    { type: "h", text: "Chapter 4  -  WhatsApp Business setup" },
    { type: "p", text: "Add shop name, photo, hours, catalog, and a greeting message. Save quick replies for price, location, and booking." },
    { type: "h", text: "Chapter 5  -  Collect enquiries" },
    { type: "p", text: "Use a form or a fixed chat script. Capture name, need, budget, and follow-up date. Never leave a lead only in your memory." },
    { type: "h", text: "Chapter 6  -  Post weekly" },
    { type: "p", text: "Three posts a week is enough: one tip, one proof, one offer. Same fonts and colors every time." },
    { type: "h", text: "Chapter 7  -  Measure" },
    { type: "p", text: "Count enquiries, quotes, and sales. If enquiries are high but sales are low, fix the offer or the follow-up, not the logo." },
    { type: "h", text: "Chapter 8  -  Avoid these mistakes" },
    { type: "li", text: "Too many tools" },
    { type: "li", text: "Random discounts" },
    { type: "li", text: "No follow-up" },
    { type: "li", text: "Copying a competitor word for word" },
  ],
};

const playbookChecklist = {
  title: "Digital Business Playbook  -  7-day checklist",
  kicker: "EBENEZER STORE  |  PDF CHECKLIST",
  blocks: [
    { type: "check", text: "Day 1: Write your offer in one sentence" },
    { type: "check", text: "Day 2: Fix WhatsApp Business profile + catalog" },
    { type: "check", text: "Day 3: Create enquiry form / message template" },
    { type: "check", text: "Day 4: Publish one landing page or pinned post" },
    { type: "check", text: "Day 5: Ask 3 happy customers for testimonials" },
    { type: "check", text: "Day 6: Post 3 useful tips for your audience" },
    { type: "check", text: "Day 7: Review leads and follow up all open chats" },
    { type: "p", text: "Print this page and tick boxes with a pen. Repeat the week until the habit sticks." },
  ],
};

const brandGuide = {
  title: "Brand Kit Essentials  -  Brand guide",
  kicker: "EBENEZER STORE  |  PDF GUIDE",
  blocks: [
    { type: "h", text: "Starter palette (edit to your brand)" },
    { type: "li", text: "Ink / text: #111111" },
    { type: "li", text: "Paper / background: #F7F5F2" },
    { type: "li", text: "Accent: #10B981" },
    { type: "li", text: "Muted: #6B7280" },
    { type: "li", text: "Line: #E5E7EB" },
    { type: "p", text: "Rule: one accent only. Do not add a new bright color on every post." },
    { type: "h", text: "Type" },
    { type: "p", text: "Headlines: one distinctive serif or strong display face. Body: one clean sans. H1 large, H2 medium, body 16-18px." },
    { type: "h", text: "Logo rules" },
    { type: "li", text: "Clear space around the mark = height of the mark" },
    { type: "li", text: "Dark logo on light background, light logo on photos" },
    { type: "li", text: "Do not stretch, rotate, or add drop shadows" },
    { type: "li", text: "One primary lockup for the website header" },
  ],
};

const brandSocial = {
  title: "Brand Kit Essentials  -  Social templates",
  kicker: "EBENEZER STORE  |  PDF TEMPLATES",
  blocks: [
    { type: "h", text: "Post framework" },
    { type: "li", text: "Hook line (problem or result)" },
    { type: "li", text: "One tip, story, or offer" },
    { type: "li", text: "Soft call to action (message / link / call)" },
    { type: "p", text: "Visual: full-bleed photo or clean type on brand background." },
    { type: "h", text: "Consistency checklist" },
    { type: "check", text: "Same logo file everywhere" },
    { type: "check", text: "Same 1-2 fonts" },
    { type: "check", text: "Same accent color" },
    { type: "check", text: "Bio / about text matches your tone" },
    { type: "check", text: "Reuse templates instead of redesigning daily" },
  ],
};

const freeForm = {
  title: "Free Enquiry Form Kit  -  Printable form",
  kicker: "EBENEZER STORE  |  FREE PDF",
  blocks: [
    { type: "p", text: "Print this form or copy it into Word / Google Docs. Use it for any small business enquiry." },
    { type: "field", text: "Date" },
    { type: "field", text: "Name" },
    { type: "field", text: "Phone / WhatsApp" },
    { type: "field", text: "Email" },
    { type: "field", text: "What do you need?" },
    { type: "field", text: "" },
    { type: "field", text: "Preferred budget / timeline" },
    { type: "field", text: "Follow-up date" },
    { type: "field", text: "Staff notes" },
  ],
};

const freeFields = {
  title: "Free Enquiry Form Kit  -  Digital fields",
  kicker: "EBENEZER STORE  |  FREE PDF",
  blocks: [
    { type: "p", text: "Copy these fields into Google Forms, Typeform, or your website form." },
    { type: "li", text: "Full name (required)" },
    { type: "li", text: "Phone / WhatsApp (required)" },
    { type: "li", text: "Email (optional)" },
    { type: "li", text: "Requirement (long text)" },
    { type: "li", text: "Preferred date / deadline" },
    { type: "li", text: "How did you find us?" },
    { type: "p", text: "Keep the form short. Long forms lose people." },
  ],
};

const bundleReadme = {
  title: "Creator Bundle  -  What is inside",
  kicker: "EBENEZER STORE  |  BUNDLE PDF",
  blocks: [
    { type: "p", text: "This ZIP has three kits. Open the PDFs first. Then edit the templates for your brand." },
    { type: "h", text: "1. Creator Landing Kit" },
    { type: "li", text: "layout-guide.pdf" },
    { type: "li", text: "copy-templates.pdf" },
    { type: "li", text: "mobile-checklist.pdf" },
    { type: "h", text: "2. Brand Kit Essentials" },
    { type: "li", text: "brand-guide.pdf" },
    { type: "li", text: "social-templates.pdf" },
    { type: "h", text: "3. Digital Business Playbook" },
    { type: "li", text: "digital-business-playbook.pdf" },
    { type: "li", text: "7-day-checklist.pdf" },
    { type: "p", text: "License: personal or commercial use on your projects. Do not resell this pack as your own product." },
  ],
};

const manifest = [];

manifest.push(["ebenezer-saas", "getting-started.pdf", saasGettingStarted, []]);
manifest.push(["ebenezer-saas", "feature-sheet.pdf", saasFeatureSheet, []]);
manifest.push(["ebenezer-saas", "sample-invoice.pdf", saasInvoice, []]);

manifest.push(["creator-landing-kit", "layout-guide.pdf", landingLayout, ["creator-landing-kit", "creator-bundle/landing-kit"]]);
manifest.push(["creator-landing-kit", "copy-templates.pdf", landingCopy, ["creator-landing-kit", "creator-bundle/landing-kit"]]);
manifest.push(["creator-landing-kit", "mobile-checklist.pdf", landingMobile, ["creator-landing-kit", "creator-bundle/landing-kit"]]);

manifest.push(["shop-pos-starter-pack", "ui-blueprint.pdf", posBlueprint, ["shop-pos-starter-pack"]]);
manifest.push(["shop-pos-starter-pack", "invoice-samples.pdf", posInvoice, ["shop-pos-starter-pack"]]);
manifest.push(["shop-pos-starter-pack", "pos-selection-checklist.pdf", posChecklist, ["shop-pos-starter-pack"]]);

manifest.push(["travel-enquiry-pack", "enquiry-form.pdf", travelForm, ["travel-enquiry-pack"]]);
manifest.push(["travel-enquiry-pack", "whatsapp-scripts.pdf", travelScripts, ["travel-enquiry-pack"]]);
manifest.push(["travel-enquiry-pack", "quotation-template.pdf", travelQuote, ["travel-enquiry-pack"]]);

manifest.push(["digital-business-playbook", "digital-business-playbook.pdf", playbook, ["digital-business-playbook", "creator-bundle/business-playbook"]]);
manifest.push(["digital-business-playbook", "7-day-checklist.pdf", playbookChecklist, ["digital-business-playbook", "creator-bundle/business-playbook"]]);

manifest.push(["brand-kit-essentials", "brand-guide.pdf", brandGuide, ["brand-kit-essentials", "creator-bundle/brand-kit"]]);
manifest.push(["brand-kit-essentials", "social-templates.pdf", brandSocial, ["brand-kit-essentials", "creator-bundle/brand-kit"]]);

manifest.push(["free-enquiry-form-kit", "enquiry-form.pdf", freeForm, ["free-enquiry-form-kit"]]);
manifest.push(["free-enquiry-form-kit", "digital-fields.pdf", freeFields, ["free-enquiry-form-kit"]]);

manifest.push(["creator-bundle", "bundle-contents.pdf", bundleReadme, ["creator-bundle"]]);

const urls = {};
for (const [slug, fileName, spec, packFolders] of manifest) {
  const url = publish(slug, fileName, spec, packFolders);
  if (!urls[slug]) urls[slug] = [];
  urls[slug].push({ label: fileName.replace(".pdf", "").replace(/-/g, " "), file: url });
  console.log("pdf", url);
}

fs.writeFileSync(
  path.join(pdfPublic, "manifest.json"),
  JSON.stringify(urls, null, 2)
);
console.log("done", Object.values(urls).reduce((n, a) => n + a.length, 0), "pdfs");
