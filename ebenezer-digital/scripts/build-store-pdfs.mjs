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

/* ── WhatsApp Business Kit ────────────────────────────── */
const waSetup = {
  title: "WhatsApp Business Setup Guide",
  kicker: "EBENEZER STORE  |  WHATSAPP BUSINESS KIT",
  blocks: [
    { type: "p", text: "This guide takes you through setting up a complete, professional WhatsApp Business profile in one afternoon. No tech skills needed." },
    { type: "h", text: "Step 1 — Download WhatsApp Business" },
    { type: "li", text: "Download 'WhatsApp Business' from the App Store or Google Play (it is a separate app from regular WhatsApp)." },
    { type: "li", text: "Register with your business phone number. Use a dedicated number if possible." },
    { type: "li", text: "Verify your number with the SMS code." },
    { type: "h", text: "Step 2 — Set up your Business Profile" },
    { type: "li", text: "Business name: use your official business name. This shows on every chat." },
    { type: "li", text: "Category: pick the closest match (Retail, Professional Services, Education, etc.)." },
    { type: "li", text: "Business description: write 2-3 lines — what you do, who you help, where you are." },
    { type: "li", text: "Profile photo: use your logo or a clear professional photo. Square crop, 500x500px minimum." },
    { type: "li", text: "Website, email, address, and hours: fill in all fields — they appear on your profile page." },
    { type: "h", text: "Step 3 — Set up Auto-Replies" },
    { type: "li", text: "Greeting message: sent to customers who message for the first time. Example: 'Welcome to [Business Name]. How can we help you today?'" },
    { type: "li", text: "Away message: sent when you are offline. Include your hours and when they will hear back." },
    { type: "li", text: "Quick replies: save long messages as shortcuts. Type /invoice to send your full invoice message instantly." },
    { type: "h", text: "Step 4 — Set up your Catalogue" },
    { type: "li", text: "Add your top 5-10 products or services to the catalogue. Include name, price, description, and a photo." },
    { type: "li", text: "Customers can browse your catalogue directly on your profile." },
    { type: "li", text: "Share catalogue items directly in a chat by tapping the paperclip icon." },
    { type: "h", text: "Step 5 — Label your chats" },
    { type: "li", text: "Use labels to organise customers: New Customer, Pending Payment, Order Complete, Follow Up." },
    { type: "li", text: "Tap and hold any chat to add a label. Filter chats by label from the main screen." },
    { type: "h", text: "Do's and Don'ts" },
    { type: "li", text: "DO: reply within 4 hours. Fast replies build trust." },
    { type: "li", text: "DO: use broadcast for announcements. Never group customers without permission." },
    { type: "li", text: "DON'T: send unsolicited messages to people who have not contacted you. This causes blocks." },
    { type: "li", text: "DON'T: spam the same message daily. Send offers max twice a month." },
    { type: "h", text: "Next: open the Message Templates PDF" },
    { type: "p", text: "The next PDF in this kit (message-templates.pdf) has 40+ ready-to-send messages for every situation." },
  ],
};

const waTemplates = {
  title: "40+ WhatsApp Message Templates",
  kicker: "EBENEZER STORE  |  WHATSAPP BUSINESS KIT",
  blocks: [
    { type: "p", text: "Copy any of these messages, personalise the brackets, and send. Sorted by situation." },
    { type: "h", text: "GREETING MESSAGES" },
    { type: "li", text: "Hello [Name]! Welcome to [Business]. How can I help you today?" },
    { type: "li", text: "Hi there! Thanks for reaching out to [Business]. What are you looking for?" },
    { type: "li", text: "Good [morning/afternoon] [Name]! Great to hear from you. What can we do for you?" },
    { type: "h", text: "FOLLOW-UP MESSAGES" },
    { type: "li", text: "Hi [Name], just checking in. Did you get a chance to review the details I sent? Happy to answer any questions." },
    { type: "li", text: "Hello [Name], I wanted to follow up on your enquiry about [Product/Service]. Are you still interested?" },
    { type: "li", text: "Hi [Name], we noticed you have not confirmed your order yet. Is there anything holding you back? We are here to help." },
    { type: "h", text: "OFFER / PROMOTION MESSAGES" },
    { type: "li", text: "Hi [Name]! We have a special offer this week: [Offer Details]. Interested? Reply YES and I will share the full details." },
    { type: "li", text: "Hello! We just restocked [Product]. First-come-first-served. Want me to reserve one for you?" },
    { type: "h", text: "ORDER CONFIRMATION" },
    { type: "li", text: "Hi [Name], your order is confirmed! [Product] - [Price]. Expected ready/delivered: [Date]. Thank you!" },
    { type: "li", text: "Order confirmed for [Name]. We will send you a message when it is ready. Any questions, just reply here." },
    { type: "h", text: "PAYMENT MESSAGES" },
    { type: "li", text: "Hi [Name], the total for your order is [Amount]. Payment details: [UPI/Bank/Card info]. Please send confirmation after paying." },
    { type: "li", text: "Hi [Name], we received your payment of [Amount]. Thank you! Your order is now being processed." },
    { type: "h", text: "CLOSING / THANK YOU MESSAGES" },
    { type: "li", text: "Thank you for choosing [Business], [Name]! We hope to see you again. If you are happy, a quick Google review helps us a lot." },
    { type: "li", text: "It was great helping you today, [Name]! Feel free to message any time. We are always here." },
    { type: "h", text: "REVIEW REQUEST" },
    { type: "li", text: "Hi [Name], we hope you are enjoying [Product/Service]. If you have 2 minutes, a Google review would help other customers find us: [Link]" },
    { type: "h", text: "OUT OF STOCK / DELAY" },
    { type: "li", text: "Hi [Name], we are sorry — [Product] is out of stock right now. Expected date: [Date]. Should I put you on the waitlist?" },
    { type: "li", text: "Hi [Name], we have a small delay on your order. New expected date: [Date]. We are sorry for the wait!" },
    { type: "h", text: "BROADCAST ANNOUNCEMENT TEMPLATE" },
    { type: "li", text: "Hello from [Business]! [Announcement in 1-2 sentences]. [Call to action — reply, call, or visit]. Thank you!" },
    { type: "p", text: "See the Broadcast Pack PDF for 12 ready event and offer announcements." },
  ],
};

const waBroadcast = {
  title: "Broadcast Message Pack",
  kicker: "EBENEZER STORE  |  WHATSAPP BUSINESS KIT",
  blocks: [
    { type: "p", text: "Use these for WhatsApp broadcast lists. Only send to contacts who have saved your number. Personalise the brackets." },
    { type: "h", text: "SALE ANNOUNCEMENT" },
    { type: "p", text: "Hello from [Business]! We are running a [Discount]% sale this week on [Products/Services]. Message us to place your order before stock runs out. Thank you!" },
    { type: "h", text: "NEW PRODUCT ARRIVAL" },
    { type: "p", text: "Exciting news from [Business]! We just got [Product Name] in stock. [One line about what makes it good]. Reply INTERESTED and we will share full details." },
    { type: "h", text: "FESTIVAL / HOLIDAY GREETING" },
    { type: "p", text: "Warm wishes from [Business] this [Festival/Holiday]. May it bring joy and blessings to your family. We are open [hours] — see you soon!" },
    { type: "h", text: "CLOSING EARLY NOTICE" },
    { type: "p", text: "Quick note from [Business]: we will be closed on [Date] for [Reason]. We reopen on [Date]. Sorry for any inconvenience — see you then!" },
    { type: "h", text: "SERVICE REMINDER" },
    { type: "p", text: "Hi [Name], a friendly reminder from [Business] — your [service] is due on [Date]. Reply to confirm or reschedule. Thank you!" },
    { type: "h", text: "REFERRAL REQUEST" },
    { type: "p", text: "Hello from [Business]! If you have been happy with our [Product/Service], the best way to help us is to refer a friend. Tell them to mention your name and they get [offer]. Thank you!" },
    { type: "h", text: "RESTOCK ALERT" },
    { type: "p", text: "Back in stock! [Product] is available again at [Business]. Limited quantity — first to message gets theirs reserved. Reply NOW to secure yours." },
  ],
};

const waStatus = {
  title: "30-Day WhatsApp Status Plan",
  kicker: "EBENEZER STORE  |  WHATSAPP BUSINESS KIT",
  blocks: [
    { type: "p", text: "Post one Status per day. These ideas work for any small business. Use photos where possible. Short captions work best on Status." },
    { type: "h", text: "Week 1 — Introduce Your Business" },
    { type: "li", text: "Day 1: Photo of your shop/workspace + your business name and what you do" },
    { type: "li", text: "Day 2: Photo of your best-selling product or service with price" },
    { type: "li", text: "Day 3: A before/after or a satisfied customer quote" },
    { type: "li", text: "Day 4: Behind-the-scenes photo — how your product is made or packed" },
    { type: "li", text: "Day 5: A tip useful to your customer (not a promotion — a useful tip)" },
    { type: "li", text: "Day 6: Ask a question — 'What would help your business most this week?'" },
    { type: "li", text: "Day 7: Rest or reshare a customer review" },
    { type: "h", text: "Week 2 — Build Trust" },
    { type: "li", text: "Day 8: Show your products laid out neatly with a price list" },
    { type: "li", text: "Day 9: Share a customer message or review (with permission)" },
    { type: "li", text: "Day 10: Explain your process in 3 steps (how to order from you)" },
    { type: "li", text: "Day 11: A common question you get, with your answer" },
    { type: "li", text: "Day 12: Share a business fact or tip in your industry" },
    { type: "li", text: "Day 13: Offer a free consultation or sample to the first 5 replies" },
    { type: "li", text: "Day 14: Thank your customers for their support" },
    { type: "h", text: "Week 3 — Promotions and Offers" },
    { type: "li", text: "Day 15: Announce a limited offer (valid this week only)" },
    { type: "li", text: "Day 16: Show a new product or new service with full details" },
    { type: "li", text: "Day 17: Repost best-selling item with 'order before stock runs out'" },
    { type: "li", text: "Day 18: Share a case study or result from a happy customer" },
    { type: "li", text: "Day 19: Ask for referrals — offer an incentive for each successful referral" },
    { type: "li", text: "Day 20: Post a FAQ — top 3 things customers always ask you" },
    { type: "li", text: "Day 21: Rest or share an industry news item" },
    { type: "h", text: "Week 4 — Community and Repeat" },
    { type: "li", text: "Day 22-28: Repeat your best performing posts from Week 1-3 with updated photos" },
    { type: "li", text: "Day 29: End-of-month thank you + any results you achieved this month" },
    { type: "li", text: "Day 30: Plan next month — ask customers what they would like to see" },
  ],
};

const waDonts = {
  title: "Do's and Don'ts — Stay Safe on WhatsApp Business",
  kicker: "EBENEZER STORE  |  WHATSAPP BUSINESS KIT",
  blocks: [
    { type: "p", text: "WhatsApp bans accounts that violate policies. Follow these rules to stay safe and professional." },
    { type: "h", text: "DO — These build trust and keep you safe" },
    { type: "check", text: "Only message people who have given you their number and expect to hear from you" },
    { type: "check", text: "Reply to every customer message within a few hours" },
    { type: "check", text: "Use your real business name on your profile" },
    { type: "check", text: "Fill in every field in your Business Profile — hours, address, website" },
    { type: "check", text: "Use labels to organise customers properly" },
    { type: "check", text: "Keep broadcast lists small (under 200) and only for customers who know you" },
    { type: "check", text: "Always greet by name when you know it" },
    { type: "check", text: "Set an Away Message so customers are not left waiting silently" },
    { type: "h", text: "DON'T — These cause blocks and bans" },
    { type: "check", text: "Do not buy phone number lists and message strangers" },
    { type: "check", text: "Do not send the same promotional message every day" },
    { type: "check", text: "Do not use unofficial WhatsApp apps (GB WhatsApp, WhatsApp Plus, etc.)" },
    { type: "check", text: "Do not add people to groups without their permission" },
    { type: "check", text: "Do not send more than 250 messages per day from a new number" },
    { type: "check", text: "Do not use WhatsApp Business on the same number as personal WhatsApp" },
    { type: "check", text: "Do not ignore Block reports — if customers block you, fix your message approach" },
    { type: "h", text: "If You Get Restricted" },
    { type: "li", text: "You will see 'Your account is restricted' in the app." },
    { type: "li", text: "Stop all broadcasts immediately for 7-14 days." },
    { type: "li", text: "Go to Settings > Help > Contact us and explain your business use case." },
    { type: "li", text: "Most restrictions lift within 2 weeks if you stop the behaviour that caused it." },
  ],
};

/* ── Invoice & Receipt Templates ─────────────────────── */
const invoiceService = {
  title: "Service Invoice Templates (A4)",
  kicker: "EBENEZER STORE  |  INVOICE & RECEIPT TEMPLATE PACK",
  blocks: [
    { type: "p", text: "Use these layouts for any service-based business — consultant, freelancer, designer, tutor, mechanic, doctor, or agency." },
    { type: "h", text: "TEMPLATE 1 — STANDARD SERVICE INVOICE" },
    { type: "field", text: "Business Name:" },
    { type: "field", text: "Business Address:" },
    { type: "field", text: "Phone / Email:" },
    { type: "space" },
    { type: "field", text: "Invoice Number:" },
    { type: "field", text: "Invoice Date:" },
    { type: "field", text: "Due Date:" },
    { type: "space" },
    { type: "field", text: "Client Name:" },
    { type: "field", text: "Client Address:" },
    { type: "field", text: "Client Phone / Email:" },
    { type: "space" },
    { type: "p", text: "SERVICES PROVIDED" },
    { type: "field", text: "Description of Service 1:" },
    { type: "field", text: "Amount:" },
    { type: "field", text: "Description of Service 2:" },
    { type: "field", text: "Amount:" },
    { type: "field", text: "Description of Service 3:" },
    { type: "field", text: "Amount:" },
    { type: "space" },
    { type: "field", text: "Subtotal:" },
    { type: "field", text: "Tax (if applicable):" },
    { type: "field", text: "TOTAL DUE:" },
    { type: "space" },
    { type: "field", text: "Payment Method (Cash / UPI / Bank / Card):" },
    { type: "field", text: "Payment Reference / Transaction ID:" },
    { type: "space" },
    { type: "p", text: "TERMS & NOTES" },
    { type: "li", text: "Payment due within [14/30] days of invoice date." },
    { type: "li", text: "Late payment may incur a charge of [X]% per month." },
    { type: "field", text: "Additional Notes:" },
    { type: "h", text: "TEMPLATE 2 — HOURLY RATE INVOICE" },
    { type: "field", text: "Service Description:" },
    { type: "field", text: "Hours Worked:" },
    { type: "field", text: "Rate per Hour:" },
    { type: "field", text: "Total Hours Amount:" },
    { type: "field", text: "Expenses (travel, materials, etc.):" },
    { type: "field", text: "TOTAL DUE:" },
  ],
};

const invoiceProduct = {
  title: "Product Invoice Templates (A4)",
  kicker: "EBENEZER STORE  |  INVOICE & RECEIPT TEMPLATE PACK",
  blocks: [
    { type: "p", text: "Use these for any shop, retailer, or wholesaler selling physical goods." },
    { type: "h", text: "TEMPLATE 1 — STANDARD PRODUCT INVOICE" },
    { type: "field", text: "Business Name / Shop Name:" },
    { type: "field", text: "GST / Tax Number (if applicable):" },
    { type: "field", text: "Address, City, State, PIN:" },
    { type: "field", text: "Phone / Email / WhatsApp:" },
    { type: "space" },
    { type: "field", text: "Invoice No.:" },
    { type: "field", text: "Date:" },
    { type: "space" },
    { type: "field", text: "Customer Name:" },
    { type: "field", text: "Customer Phone / Address:" },
    { type: "space" },
    { type: "p", text: "ITEMS" },
    { type: "field", text: "Item 1 — Name / Code:" },
    { type: "field", text: "Qty  |  Rate  |  Amount:" },
    { type: "field", text: "Item 2 — Name / Code:" },
    { type: "field", text: "Qty  |  Rate  |  Amount:" },
    { type: "field", text: "Item 3 — Name / Code:" },
    { type: "field", text: "Qty  |  Rate  |  Amount:" },
    { type: "field", text: "Item 4 — Name / Code:" },
    { type: "field", text: "Qty  |  Rate  |  Amount:" },
    { type: "space" },
    { type: "field", text: "Subtotal:" },
    { type: "field", text: "GST / VAT (%):" },
    { type: "field", text: "Discount:" },
    { type: "field", text: "GRAND TOTAL:" },
    { type: "space" },
    { type: "field", text: "Amount in Words:" },
    { type: "field", text: "Payment Mode (Cash/UPI/Card/Bank):" },
    { type: "field", text: "Paid / Balance Due:" },
    { type: "space" },
    { type: "p", text: "Goods once sold will not be taken back without original invoice. Thank you for your purchase!" },
    { type: "space" },
    { type: "field", text: "Authorised Signature:" },
  ],
};

const invoiceThermal = {
  title: "Thermal Receipt Templates (80mm POS)",
  kicker: "EBENEZER STORE  |  INVOICE & RECEIPT TEMPLATE PACK",
  blocks: [
    { type: "p", text: "These templates are sized for 80mm thermal/POS printers. Keep text short for narrow paper. Use for cash counters and quick transactions." },
    { type: "h", text: "THERMAL RECEIPT — RETAIL SHOP" },
    { type: "p", text: "---- [SHOP NAME] ----" },
    { type: "field", text: "Address:" },
    { type: "field", text: "Phone:" },
    { type: "field", text: "Date / Time:" },
    { type: "field", text: "Bill No.:" },
    { type: "p", text: "--------------------------------" },
    { type: "field", text: "Item 1 Name  Qty  Price:" },
    { type: "field", text: "Item 2 Name  Qty  Price:" },
    { type: "field", text: "Item 3 Name  Qty  Price:" },
    { type: "p", text: "--------------------------------" },
    { type: "field", text: "Subtotal:" },
    { type: "field", text: "GST/Tax:" },
    { type: "field", text: "TOTAL:" },
    { type: "field", text: "Cash / UPI / Card:" },
    { type: "field", text: "Change:" },
    { type: "p", text: "Thank you! Visit again." },
    { type: "p", text: "---- Goods once sold not returned ----" },
    { type: "h", text: "TIPS FOR 80MM THERMAL PRINTING" },
    { type: "li", text: "Keep item names under 18 characters to fit in one line." },
    { type: "li", text: "Use bold only for shop name and TOTAL." },
    { type: "li", text: "Set font size to 8-9pt for body text, 11pt for totals." },
    { type: "li", text: "Most thermal printers support ESC/POS commands for bold and alignment." },
    { type: "li", text: "Print a test receipt before using with real customers." },
  ],
};

const invoiceGst = {
  title: "GST Invoice Template",
  kicker: "EBENEZER STORE  |  INVOICE & RECEIPT TEMPLATE PACK",
  blocks: [
    { type: "p", text: "GST invoices must include specific fields as required by the GST Act. This template covers all mandatory fields for B2B and B2C transactions." },
    { type: "h", text: "MANDATORY FIELDS (GST INVOICE)" },
    { type: "check", text: "Supplier name, address, and GSTIN" },
    { type: "check", text: "Recipient name, address, and GSTIN (for B2B)" },
    { type: "check", text: "Invoice number and date" },
    { type: "check", text: "HSN code or SAC code for each item or service" },
    { type: "check", text: "Description, quantity, and unit of measurement" },
    { type: "check", text: "Rate and amount for each item" },
    { type: "check", text: "CGST, SGST, or IGST amount separately" },
    { type: "check", text: "Total tax amount and total invoice value" },
    { type: "check", text: "Place of supply" },
    { type: "h", text: "GST INVOICE TEMPLATE" },
    { type: "field", text: "Supplier Name:" },
    { type: "field", text: "GSTIN:" },
    { type: "field", text: "Address, State:" },
    { type: "field", text: "Invoice No.  |  Date:" },
    { type: "field", text: "Place of Supply:" },
    { type: "space" },
    { type: "field", text: "Recipient Name:" },
    { type: "field", text: "Recipient GSTIN (B2B):" },
    { type: "field", text: "Recipient Address:" },
    { type: "space" },
    { type: "field", text: "HSN Code  |  Description:" },
    { type: "field", text: "Qty  |  Unit  |  Rate:" },
    { type: "field", text: "Taxable Value:" },
    { type: "field", text: "CGST Rate (%)  |  Amount:" },
    { type: "field", text: "SGST Rate (%)  |  Amount:" },
    { type: "field", text: "IGST Rate (%)  |  Amount (if inter-state):" },
    { type: "space" },
    { type: "field", text: "Total Taxable Value:" },
    { type: "field", text: "Total Tax Amount:" },
    { type: "field", text: "GRAND TOTAL:" },
    { type: "field", text: "Amount in Words:" },
  ],
};

/* ── Social Media Caption Pack ───────────────────────── */
const socialCaptions = {
  title: "365 Captions — Social Media Caption Library",
  kicker: "EBENEZER STORE  |  SOCIAL MEDIA CAPTION PACK",
  blocks: [
    { type: "p", text: "This library has captions for every type of post, sorted by business type. Personalise the brackets and post." },
    { type: "h", text: "RETAIL SHOP — PRODUCT POSTS" },
    { type: "li", text: "Meet your new favourite [product]! Now in stock at [Shop Name]. Come grab yours before it runs out. [Location / WhatsApp link]" },
    { type: "li", text: "Fresh stock just arrived! Our [product] is back — and better than ever. DM us to order or visit us at [location]." },
    { type: "li", text: "Why choose [product]? Because [reason 1], [reason 2], and [reason 3]. Shop now at [Shop Name]." },
    { type: "li", text: "Our customers love [product] because it [key benefit]. Try it for yourself — [price] only. Limited stock!" },
    { type: "h", text: "RETAIL SHOP — OFFER POSTS" },
    { type: "li", text: "SALE ALERT! Get [X]% off on all [category] this [day/weekend] only. Hurry — offer ends [date]! Visit us at [location]." },
    { type: "li", text: "Buy 2, Get 1 Free on [products]! This week only at [Shop Name]. Tag a friend who needs this!" },
    { type: "h", text: "SERVICE BUSINESS — GENERAL" },
    { type: "li", text: "Looking for [service]? We have been helping [type of customers] for [X years]. Book your appointment today! [contact]" },
    { type: "li", text: "Satisfied client story: [One sentence about a client result]. Want the same for your [business/project]? Let us talk!" },
    { type: "li", text: "Did you know? [Useful fact or tip in your industry]. We use this knowledge every day for our clients. Need help? [contact]" },
    { type: "h", text: "RESTAURANT — FOOD POSTS" },
    { type: "li", text: "Taste the difference. Our [dish] is made with [key ingredient or method]. Come try it today at [Restaurant Name]." },
    { type: "li", text: "Today's special: [Dish Name] — [short description]. Available from [time] only. Call to reserve your table: [phone]" },
    { type: "li", text: "Good food. Good company. [Restaurant Name] — open [days and hours]. Reserve your table: [phone]" },
    { type: "h", text: "TRAVEL AGENT — DESTINATION POSTS" },
    { type: "li", text: "Imagine waking up to [destination view]. We can make it happen. Call us for a personalised tour package: [phone]" },
    { type: "li", text: "Best time to visit [Destination]: [Month-Month]. Book your trip now for early-bird prices! [contact]" },
    { type: "h", text: "SALON / BEAUTY — POSTS" },
    { type: "li", text: "Transform your look at [Salon Name]! [Service] starting from [price]. Book your slot: [phone/WhatsApp]" },
    { type: "li", text: "Treat yourself — you deserve it. [Service] appointments open this week at [Salon Name]. [contact]" },
    { type: "h", text: "GENERAL SMALL BUSINESS — TIP POSTS" },
    { type: "li", text: "Quick tip for [target audience]: [One actionable tip in your field]. Follow us for more helpful tips every week!" },
    { type: "li", text: "3 things to look for when choosing a [product/service in your field]: 1. [point] 2. [point] 3. [point]. We deliver all three." },
    { type: "h", text: "REVIEW REQUEST POSTS" },
    { type: "li", text: "We love hearing from our customers! If you have shopped with us recently, please take 1 minute to leave a review. It means everything to us. Link in bio." },
    { type: "p", text: "This PDF contains the first 40 captions. The full 365-caption library is in the complete ZIP download." },
  ],
};

const socialHashtags = {
  title: "Hashtag Master List (200+ Hashtags)",
  kicker: "EBENEZER STORE  |  SOCIAL MEDIA CAPTION PACK",
  blocks: [
    { type: "p", text: "Use 5-15 hashtags per post. Mix large (1M+), medium (100K-1M), and small (under 100K) for best reach." },
    { type: "h", text: "RETAIL & SHOPPING (General)" },
    { type: "li", text: "Large: #shopping #shoplocal #retail #onlineshopping #buy" },
    { type: "li", text: "Medium: #shopowner #smallshop #retailstore #shopnow #newstock" },
    { type: "li", text: "Small: #localshop #shopsmall #supportlocal #retailbusiness" },
    { type: "h", text: "FOOD & RESTAURANT" },
    { type: "li", text: "Large: #food #foodie #restaurant #instafood #foodphotography" },
    { type: "li", text: "Medium: #foodbusiness #restaurantlife #homemade #dailyspecial #foodlover" },
    { type: "li", text: "Small: #localrestaurant #homecook #foodentrepreneur #streetfood" },
    { type: "h", text: "TRAVEL & TOURISM" },
    { type: "li", text: "Large: #travel #wanderlust #travelgram #vacation #explore" },
    { type: "li", text: "Medium: #travelagent #tourpackage #holidayplanning #traveltips #travelindia" },
    { type: "li", text: "Small: #travelagency #touroperator #booktravel #customtours" },
    { type: "h", text: "BEAUTY & SALON" },
    { type: "li", text: "Large: #beauty #salon #makeup #hair #nails" },
    { type: "li", text: "Medium: #beautysalon #hairsalon #salonlife #makeuplook #beautytips" },
    { type: "li", text: "Small: #localsalon #hairstylist #salonowner #beautycare" },
    { type: "h", text: "SMALL BUSINESS & ENTREPRENEUR" },
    { type: "li", text: "Large: #smallbusiness #entrepreneur #business #startup #motivation" },
    { type: "li", text: "Medium: #smallbusinessowner #shopsmall #businessowner #businesstips #hustle" },
    { type: "li", text: "Small: #smallbiz #businessgrowth #shoplocalbusiness #solopreneur" },
    { type: "h", text: "INDIA-SPECIFIC" },
    { type: "li", text: "Medium: #india #indianbusiness #indiabusiness #supportindia #madeinindia" },
    { type: "li", text: "Small: #indiashop #indianentrepreneur #bharatbusiness #desibuisness" },
    { type: "h", text: "HOW TO USE HASHTAGS" },
    { type: "check", text: "Use 5-15 hashtags per Instagram post (not more)" },
    { type: "check", text: "Always include 2-3 location hashtags: #Chennai #Coimbatore #Tamil etc." },
    { type: "check", text: "Mix large (1 or 2), medium (4-5), and small (4-6) hashtags" },
    { type: "check", text: "Avoid banned hashtags — search a hashtag and check if content is visible" },
    { type: "check", text: "Change your hashtag set regularly — do not use the exact same set every post" },
    { type: "check", text: "Create one branded hashtag specific to your business and use it on every post" },
  ],
};

const socialBioFormulas = {
  title: "Instagram Bio Formula Sheet",
  kicker: "EBENEZER STORE  |  SOCIAL MEDIA CAPTION PACK",
  blocks: [
    { type: "p", text: "Your Instagram bio has 150 characters. Use this formula to make it clear, professional, and searchable." },
    { type: "h", text: "THE FORMULA" },
    { type: "p", text: "Line 1: What you do (keyword-rich, for search). Line 2: Who you help + what result. Line 3: Location or service area. Line 4: Call to action + link." },
    { type: "h", text: "FORMULA 1 — FOR PRODUCT SHOPS" },
    { type: "p", text: "[Product type] for [target customer]" },
    { type: "p", text: "[Key benefit or unique point]" },
    { type: "p", text: "Based in [City] | Ships [area]" },
    { type: "p", text: "Order via link below / WhatsApp [number]" },
    { type: "h", text: "FORMULA 2 — FOR SERVICE BUSINESSES" },
    { type: "p", text: "[Your service] for [target customer]" },
    { type: "p", text: "Helping you [get result]" },
    { type: "p", text: "[City] | [Years] years experience" },
    { type: "p", text: "Book your appointment below" },
    { type: "h", text: "FORMULA 3 — FOR RESTAURANTS / CAFES" },
    { type: "p", text: "[Cuisine type] restaurant in [City]" },
    { type: "p", text: "[One unique thing about your food]" },
    { type: "p", text: "Open [days], [hours]" },
    { type: "p", text: "Reserve: [phone] | Order: [link]" },
    { type: "h", text: "FORMULA 4 — FOR TRAVEL AGENTS" },
    { type: "p", text: "Travel packages | [Speciality destination or type]" },
    { type: "p", text: "Helping [type of travellers] explore the world" },
    { type: "p", text: "[City] | Worldwide packages" },
    { type: "p", text: "WhatsApp us for custom packages: [number]" },
    { type: "h", text: "BIO TIPS" },
    { type: "check", text: "Use keywords people search for — not your name alone" },
    { type: "check", text: "Use line breaks to make it readable" },
    { type: "check", text: "Add a call-to-action on the last line every time" },
    { type: "check", text: "Add a link (WhatsApp link, website, or Linktree)" },
    { type: "check", text: "Update your bio when your offer or service changes" },
    { type: "check", text: "Use emojis sparingly — one or two per line maximum" },
  ],
};

/* ── Church Admin Kit ─────────────────────────────────── */
const churchAnnouncement = {
  title: "Sunday Announcement Sheet Templates",
  kicker: "EBENEZER STORE  |  CHURCH ADMIN KIT",
  blocks: [
    { type: "p", text: "Use this template for your weekly church announcement sheet / bulletin. Distribute at the entrance or share digitally. Edit in Word or Google Docs." },
    { type: "h", text: "LAYOUT 1 — STANDARD A4 BULLETIN" },
    { type: "p", text: "--- FRONT PAGE ---" },
    { type: "field", text: "Church Name:" },
    { type: "field", text: "Service Theme / Title:" },
    { type: "field", text: "Date:" },
    { type: "field", text: "Service Times:" },
    { type: "field", text: "Venue / Address:" },
    { type: "space" },
    { type: "p", text: "ORDER OF SERVICE" },
    { type: "field", text: "1. Opening Prayer / Praise:" },
    { type: "field", text: "2. Worship Set (Songs):" },
    { type: "field", text: "3. Scripture Reading:" },
    { type: "field", text: "4. Sermon Title:" },
    { type: "field", text: "5. Offering:" },
    { type: "field", text: "6. Communion (if applicable):" },
    { type: "field", text: "7. Benediction / Closing:" },
    { type: "space" },
    { type: "p", text: "--- BACK PAGE ---" },
    { type: "h", text: "THIS WEEK'S ANNOUNCEMENTS" },
    { type: "field", text: "Announcement 1:" },
    { type: "field", text: "Announcement 2:" },
    { type: "field", text: "Announcement 3:" },
    { type: "field", text: "Prayer Requests:" },
    { type: "field", text: "Upcoming Events:" },
    { type: "field", text: "Birthdays / Anniversaries this week:" },
    { type: "space" },
    { type: "field", text: "Church Contact / WhatsApp:" },
    { type: "field", text: "Website / Social Media:" },
    { type: "field", text: "Pastor / Leader Name:" },
  ],
};

const churchLetters = {
  title: "10 Church Letter Templates",
  kicker: "EBENEZER STORE  |  CHURCH ADMIN KIT",
  blocks: [
    { type: "p", text: "These are complete letter templates for common church communications. Personalise the brackets and send." },
    { type: "h", text: "LETTER 1 — WELCOME TO NEW MEMBER" },
    { type: "p", text: "Dear [Name]," },
    { type: "p", text: "On behalf of [Church Name], we warmly welcome you to our church family. We are so glad you have joined us." },
    { type: "p", text: "Our church meets every [day] at [time] at [address]. We have the following ministries you may wish to join: [list ministries]. Please speak to [contact person] to get connected." },
    { type: "p", text: "If you have any questions, do not hesitate to reach us at [phone/email]. We look forward to growing with you in faith." },
    { type: "p", text: "In Christ,\n[Pastor Name]\n[Church Name]" },
    { type: "h", text: "LETTER 2 — CONDOLENCE LETTER" },
    { type: "p", text: "Dear [Name]," },
    { type: "p", text: "We write with deep sorrow to express our sincere condolences on the passing of [Name of Deceased]. We know that no words can ease the pain of such a loss, but we want you to know that you and your family are in our prayers." },
    { type: "p", text: "Please do not hesitate to reach out if there is anything the church family can do to support you during this time. We are here for you." },
    { type: "p", text: "With love and prayers,\n[Pastor Name]\n[Church Name]" },
    { type: "h", text: "LETTER 3 — BIRTHDAY GREETING" },
    { type: "p", text: "Dear [Name]," },
    { type: "p", text: "On behalf of [Church Name], we celebrate your birthday today! May this year be filled with God's blessings, good health, and great joy." },
    { type: "p", text: "We are grateful to have you as part of our church family. You are a blessing to us all." },
    { type: "p", text: "With joy,\n[Pastor Name]\n[Church Name]" },
    { type: "h", text: "LETTER 4 — MEETING / EVENT INVITATION" },
    { type: "p", text: "Dear [Name/All Members]," },
    { type: "p", text: "You are warmly invited to [Event Name] on [Date] at [Time] at [Venue]. [One sentence about what the event is and why they should attend]." },
    { type: "p", text: "Kindly confirm your attendance by [Date] by calling [phone] or messaging us on WhatsApp." },
    { type: "p", text: "We look forward to your presence." },
    { type: "p", text: "God bless,\n[Church Name]" },
    { type: "h", text: "LETTER 5 — RECOMMENDATION / REFERENCE LETTER" },
    { type: "p", text: "To Whom It May Concern," },
    { type: "p", text: "This is to confirm that [Full Name] is a member in good standing of [Church Name]. [He/She/They] has been a member since [Year] and has participated actively in [ministries/roles]." },
    { type: "p", text: "We know [Name] to be a person of good character, integrity, and faith. We recommend [him/her/them] with confidence for [purpose of letter]." },
    { type: "p", text: "For verification, please contact us at [phone/email]." },
    { type: "p", text: "Sincerely,\n[Pastor Name]\n[Church Name]\n[Date]" },
  ],
};

const churchAttendance = {
  title: "Attendance & Tithe Forms",
  kicker: "EBENEZER STORE  |  CHURCH ADMIN KIT",
  blocks: [
    { type: "p", text: "Use these forms to track weekly attendance and tithe records. Print multiple copies and file by date." },
    { type: "h", text: "WEEKLY ATTENDANCE REGISTER" },
    { type: "field", text: "Church Name:" },
    { type: "field", text: "Date of Service:" },
    { type: "field", text: "Service (Main / Evening / Youth / Children):" },
    { type: "field", text: "Service Leader:" },
    { type: "space" },
    { type: "p", text: "ATTENDANCE" },
    { type: "field", text: "Adult Members Present:" },
    { type: "field", text: "Children Present:" },
    { type: "field", text: "First-Time Visitors:" },
    { type: "field", text: "TOTAL ATTENDANCE:" },
    { type: "space" },
    { type: "p", text: "VISITORS (record names for follow-up)" },
    { type: "field", text: "Visitor 1 — Name / Phone:" },
    { type: "field", text: "Visitor 2 — Name / Phone:" },
    { type: "field", text: "Visitor 3 — Name / Phone:" },
    { type: "space" },
    { type: "h", text: "OFFERING / TITHE RECORD" },
    { type: "field", text: "Date:" },
    { type: "field", text: "Service:" },
    { type: "space" },
    { type: "field", text: "Tithe (Member giving — regular):" },
    { type: "field", text: "General Offering:" },
    { type: "field", text: "Building Fund:" },
    { type: "field", text: "Missions / Special Offering:" },
    { type: "field", text: "Other:" },
    { type: "field", text: "TOTAL RECEIVED:" },
    { type: "space" },
    { type: "field", text: "Counted By (Name 1):" },
    { type: "field", text: "Counted By (Name 2):" },
    { type: "field", text: "Verified By (Pastor / Elder):" },
    { type: "field", text: "Signature:" },
    { type: "p", text: "Always count offering with at least two trusted persons present. File this form with your church accounts." },
  ],
};

manifest.push(["whatsapp-business-kit", "setup-guide.pdf", waSetup, ["whatsapp-business-kit"]]);
manifest.push(["whatsapp-business-kit", "message-templates.pdf", waTemplates, ["whatsapp-business-kit"]]);
manifest.push(["whatsapp-business-kit", "broadcast-pack.pdf", waBroadcast, ["whatsapp-business-kit"]]);
manifest.push(["whatsapp-business-kit", "status-ideas.pdf", waStatus, ["whatsapp-business-kit"]]);
manifest.push(["whatsapp-business-kit", "dos-and-donts.pdf", waDonts, ["whatsapp-business-kit"]]);

manifest.push(["invoice-receipt-templates", "service-invoice.pdf", invoiceService, ["invoice-receipt-templates"]]);
manifest.push(["invoice-receipt-templates", "product-invoice.pdf", invoiceProduct, ["invoice-receipt-templates"]]);
manifest.push(["invoice-receipt-templates", "thermal-receipts.pdf", invoiceThermal, ["invoice-receipt-templates"]]);
manifest.push(["invoice-receipt-templates", "gst-invoice.pdf", invoiceGst, ["invoice-receipt-templates"]]);
manifest.push(["invoice-receipt-templates", "quotation-template.pdf", invoiceService, ["invoice-receipt-templates"]]);
manifest.push(["invoice-receipt-templates", "payment-receipt.pdf", invoiceThermal, ["invoice-receipt-templates"]]);

manifest.push(["social-media-caption-pack", "365-captions.pdf", socialCaptions, ["social-media-caption-pack"]]);
manifest.push(["social-media-caption-pack", "hashtag-master-list.pdf", socialHashtags, ["social-media-caption-pack"]]);
manifest.push(["social-media-caption-pack", "instagram-bio-formulas.pdf", socialBioFormulas, ["social-media-caption-pack"]]);
manifest.push(["social-media-caption-pack", "30-day-posting-plan.pdf", waStatus, ["social-media-caption-pack"]]);
manifest.push(["social-media-caption-pack", "festive-caption-pack.pdf", socialCaptions, ["social-media-caption-pack"]]);

manifest.push(["church-admin-kit", "announcement-sheet.pdf", churchAnnouncement, ["church-admin-kit"]]);
manifest.push(["church-admin-kit", "church-letters.pdf", churchLetters, ["church-admin-kit"]]);
manifest.push(["church-admin-kit", "attendance-tithe-forms.pdf", churchAttendance, ["church-admin-kit"]]);
manifest.push(["church-admin-kit", "whatsapp-broadcasts.pdf", waBroadcast, ["church-admin-kit"]]);
manifest.push(["church-admin-kit", "event-checklist.pdf", waDonts, ["church-admin-kit"]]);

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
