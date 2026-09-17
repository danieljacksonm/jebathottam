/**
 * Editorial articles linking each ecosystem property — store, tools, network, SaaS, services.
 * Seeded to Prisma via scripts/seed-cross-site-blogs.ts
 */
export type CrossSiteBlog = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string[];
  relatedSlugs?: string[];
};

export const CROSS_SITE_BLOGS: CrossSiteBlog[] = [
  {
    slug: "best-digital-products-for-small-shops",
    title: "Best digital products for small shops in 2026",
    category: "Ebenezer Store",
    excerpt: "Invoice templates, WhatsApp kits, and billing tools that help retail shops go digital without heavy software.",
    tags: ["store", "retail", "digital products", "pillar"],
    content: `## Why digital kits matter\n\nSmall shops often start on paper and WhatsApp. Digital products — templates, checklists, and lightweight apps — bridge that gap without a big IT project.\n\n## What to look for\n\n- **Instant download** — no waiting for shipping\n- **Print-ready formats** — A4 and thermal where needed\n- **Clear license** — know what you can reuse\n\n## Ebenezer Store picks\n\n- [Invoice & receipt templates](https://ebenezerdigital.store/products/invoice-receipt-templates)\n- [WhatsApp Business kit](https://ebenezerdigital.store/products/whatsapp-business-kit)\n- [Ebenezer SaaS](https://ebenezerdigital.store/products/ebenezer-saas) for cloud billing\n\n## Related tools\n\nTry our free [invoice generator](https://tools.ebenezerdigital.com/tools/invoice-generator) on tools.ebenezerdigital.com.\n\n## FAQ\n\n### Are these products physical?\nNo — instant digital delivery worldwide.\n\n### Do I need GST billing?\nIf you sell in India with tax invoices, pair templates with [Yegova Billing](https://saas.ebenezerdigital.com).`,
    relatedSlugs: ["what-is-gst-billing", "shop-inventory-guide"],
  },
  {
    slug: "whatsapp-business-kit-guide",
    title: "WhatsApp Business kit: what you get and how to use it",
    category: "Ebenezer Store",
    excerpt: "Catalog messages, quick replies, and customer scripts for shops selling on WhatsApp.",
    tags: ["store", "whatsapp", "retail"],
    content: `## Overview\n\nThe WhatsApp Business kit bundles scripts and templates so shop owners can answer faster and look professional.\n\n## Inside the kit\n\n- Product catalog message templates\n- Payment reminder scripts\n- FAQ blocks for delivery and returns\n\n## Buy on Ebenezer Store\n\n[WhatsApp Business kit →](https://ebenezerdigital.store/products/whatsapp-business-kit)\n\n## Also explore\n\n- [Ebenezer Journal Learn posts](/blog) for simple tech explainers\n- [Yegova SaaS](https://saas.ebenezerdigital.com) when you outgrow spreadsheets`,
  },
  {
    slug: "website-templates-for-local-business",
    title: "Website templates for local business owners",
    category: "Ebenezer Store",
    excerpt: "Static and Next.js templates you can host anywhere — built for speed and clarity.",
    tags: ["store", "web design", "templates"],
    content: `## When a template beats custom code\n\nLocal businesses need a credible site quickly. A well-built template launches in days, not months.\n\n## Store categories\n\nBrowse [website templates](https://ebenezerdigital.store/products/category/website-templates) and [Next.js templates](https://ebenezerdigital.store/products/category/nextjs-templates).\n\n## Need custom work?\n\nSee our [web development services](https://ebenezerdigital.com/services/web-development).`,
  },
  {
    slug: "best-ai-tools-for-business-2026",
    title: "Best AI tools for business in 2026",
    category: "Ebenezer Tools",
    excerpt: "Honest comparison of ChatGPT, Claude, Gemini, and CRM picks for small teams.",
    tags: ["tools", "ai", "affiliate", "pillar"],
    content: `## How we review tools\n\nWe document pricing verification dates and editorial ratings — not fake user scores.\n\n## Top picks\n\n- **Writing & research:** ChatGPT, Claude, Gemini\n- **CRM:** HubSpot, Zoho CRM\n- **Design:** Canva\n\n## Compare on tools.ebenezerdigital.com\n\n- [ChatGPT vs Claude](https://tools.ebenezerdigital.com/tools/compare/chatgpt-vs-claude)\n- [Best AI coding tools guide](https://tools.ebenezerdigital.com/tools/guides/best-ai-coding-tools)\n\n## Disclosure\n\nSome links are affiliate links. See our [affiliate disclosure](https://tools.ebenezerdigital.com/affiliate-disclosure).`,
    relatedSlugs: ["best-crm-tools-for-indian-smbs"],
  },
  {
    slug: "best-crm-tools-for-indian-smbs",
    title: "Best CRM tools for Indian small businesses",
    category: "Ebenezer Tools",
    excerpt: "Zoho, HubSpot, and Razorpay-adjacent workflows for shops moving beyond notebooks.",
    tags: ["tools", "crm", "india"],
    content: `## Why CRM matters for SMBs\n\nTrack leads, follow-ups, and repeat customers in one place.\n\n## Compare\n\n[HubSpot vs Zoho on Ebenezer Tools →](https://tools.ebenezerdigital.com/tools/compare?ids=hubspot,zoho-crm)\n\n## Free generators\n\nPair CRM with our [quotation generator](https://tools.ebenezerdigital.com/tools/quotation-generator) and [invoice generator](https://tools.ebenezerdigital.com/tools/invoice-generator).`,
  },
  {
    slug: "free-online-tools-for-developers",
    title: "Free online tools for developers (.net)",
    category: "Ebenezer Network",
    excerpt: "JSON, Base64, regex, and SEO utilities that run in your browser — no upload.",
    tags: ["network", "developer tools", "pillar"],
    content: `## Privacy-first tools\n\nAll processing on ebenezerdigital.net runs locally in your browser when possible.\n\n## Popular tools\n\n- [JSON Formatter](https://ebenezerdigital.net/network/tools/json-formatter)\n- [Base64 encoder](https://ebenezerdigital.net/network/tools/base64-encoder)\n- [Meta tag checker](https://ebenezerdigital.net/network/tools/meta-tag-generator)\n\n## Guides\n\nRead [What is JSON?](https://ebenezerdigital.net/network/guides/what-is-json) on the network hub.`,
    relatedSlugs: ["what-is-dns", "what-is-seo"],
  },
  {
    slug: "json-formatter-guide",
    title: "How to format and validate JSON online",
    category: "Ebenezer Network",
    excerpt: "Step-by-step guide to the JSON Formatter tool on ebenezerdigital.net.",
    tags: ["network", "json", "developer"],
    content: `## Why format JSON?\n\nAPI responses and config files are easier to debug when indented and validated.\n\n## Use the tool\n\n[JSON Formatter →](https://ebenezerdigital.net/network/tools/json-formatter)\n\n## Related\n\n- [JSON Validator](https://ebenezerdigital.net/network/tools/json-validator)\n- [Learn: JSON basics](/blog) on the Journal`,
  },
  {
    slug: "what-is-gst-billing",
    title: "What is GST billing software?",
    category: "Yegova SaaS",
    excerpt: "How Indian shops create tax invoices, track stock, and print on thermal paper.",
    tags: ["saas", "gst", "billing", "pillar"],
    content: `## Definition\n\nGST billing software helps retailers create tax-compliant invoices with HSN codes, CGST/SGST splits, and customer ledgers.\n\n## Yegova Billing\n\nEbenezer's product [Yegova Billing](https://saas.ebenezerdigital.com) offers a free start for small shops.\n\n## Learn more\n\n- [GST billing capability page](https://saas.ebenezerdigital.com/saas/gst-billing)\n- [Shop inventory software](https://saas.ebenezerdigital.com/saas/shop-inventory)\n- [Invoice templates on the Store](https://ebenezerdigital.store/products/invoice-receipt-templates)`,
    relatedSlugs: ["shop-inventory-guide"],
  },
  {
    slug: "shop-inventory-guide",
    title: "Shop inventory tracking for retail stores",
    category: "Yegova SaaS",
    excerpt: "Stock in, stock out, and billing in one cloud dashboard.",
    tags: ["saas", "inventory", "retail"],
    content: `## The problem\n\nMany shops track stock in a notebook while billing in another app.\n\n## The solution\n\nConnect inventory movements to invoices so quantities stay accurate.\n\n## Try Yegova\n\n[Shop inventory software →](https://saas.ebenezerdigital.com/saas/shop-inventory)\n\n## Templates\n\nDownload [POS UI templates](https://ebenezerdigital.store/products/pos-ui-templates) from the Store for design reference.`,
  },
  {
    slug: "seo-services-for-multilingual-sites",
    title: "SEO for multilingual websites",
    category: "Ebenezer Services",
    excerpt: "hreflang, sitemaps, and canonical URLs when you publish in many languages.",
    tags: ["services", "seo", "i18n", "pillar"],
    content: `## One language = one URL\n\nWe use prefix locales (/hi/, /ta/) with reciprocal hreflang — not Google Translate widgets.\n\n## Our SEO services\n\n[Technical SEO services →](https://ebenezerdigital.com/services/seo-services)\n\n## Tools\n\nAudit URLs with the [canonical URL checker](https://ebenezerdigital.net/network/tools/canonical-url-checker) on .net.`,
    relatedSlugs: ["what-is-seo"],
  },
  {
    slug: "nextjs-for-business-websites",
    title: "Why Next.js for business websites",
    category: "Ebenezer Services",
    excerpt: "Speed, SEO, and multilingual routing for modern company sites.",
    tags: ["services", "nextjs", "web development"],
    content: `## Benefits\n\n- Server rendering for SEO\n- App Router metadata API\n- Easy i18n URL prefixes\n\n## Hire Ebenezer\n\n[Next.js development →](https://ebenezerdigital.com/services/nextjs-development)\n\n## Store\n\nBrowse [Next.js templates](https://ebenezerdigital.store/products/category/nextjs-templates) to start faster.`,
  },
  {
    slug: "business-automation-with-store-kits",
    title: "Business automation with digital store kits",
    category: "Ebenezer Digital",
    excerpt: "Combine templates, free tools, and SaaS to remove repetitive shop work.",
    tags: ["automation", "store", "tools"],
    content: `## Start small\n\nAutomation does not require a six-month ERP project.\n\n## Stack example\n\n1. [Quotation generator](https://tools.ebenezerdigital.com/tools/quotation-generator)\n2. [Invoice templates](https://ebenezerdigital.store/products/invoice-receipt-templates)\n3. [Yegova Billing](https://saas.ebenezerdigital.com) when volume grows\n\n## Services\n\n[Business automation services →](https://ebenezerdigital.com/services/business-automation)`,
  },
];
