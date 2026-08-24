export type NetworkGuide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  relatedToolSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
};

export const NETWORK_GUIDES: NetworkGuide[] = [
  {
    slug: "how-to-compress-images-without-losing-quality",
    title: "How to compress images without losing quality",
    excerpt: "Practical steps to shrink web images while keeping them sharp enough for real sites.",
    category: "Images",
    relatedToolSlugs: ["image-compressor", "image-resizer", "image-converter"],
    seoTitle: "How to Compress Images Without Losing Quality",
    seoDescription: "A practical guide to compressing website images with quality control and format choices.",
    updatedAt: "2026-08-24",
    content: `## Why image size matters
Large photos slow first paint and hurt Core Web Vitals. Smaller files load faster on mobile networks.

## A simple workflow
1. Start from the highest-quality original you have.
2. Resize to the display size you actually need (hero vs thumbnail).
3. Compress with a quality setting around 70–85 for JPEG/WebP.
4. Prefer WebP when your audience browsers support it; keep PNG for sharp UI graphics with transparency.

## What “quality” really means
Compression removes detail. The goal is not perfect pixel fidelity — it is “good enough at the size users see.” Zoomed 400% comparisons are misleading.

## Try it here
Use the Image Resizer first, then the Image Compressor. Keep a backup of the original file.`,
  },
  {
    slug: "how-to-create-a-robots-txt-file",
    title: "How to create a robots.txt file",
    excerpt: "What robots.txt does, common mistakes, and a safe starter pattern.",
    category: "SEO",
    relatedToolSlugs: ["robots-txt-generator", "sitemap-generator"],
    seoTitle: "How to Create a robots.txt File",
    seoDescription: "Learn what robots.txt controls, how to add a sitemap line, and mistakes to avoid.",
    updatedAt: "2026-08-24",
    content: `## What robots.txt is for
It gives crawlers hints about which paths they may fetch. It is not a security boundary.

## Minimal useful example
Allow public pages, block private admin areas, and point to your sitemap.

## Common mistakes
- Blocking CSS/JS needed to render the page
- Using robots.txt to “hide” confidential URLs (use authentication instead)
- Forgetting HTTPS sitemap URLs

## Generate yours
Use the Robots.txt Generator, then host the file at your domain root.`,
  },
  {
    slug: "what-is-json",
    title: "What is JSON?",
    excerpt: "A plain-English explanation of JSON for APIs, configs, and debugging.",
    category: "Development",
    relatedToolSlugs: ["json-formatter", "json-validator"],
    seoTitle: "What is JSON? Simple Explanation",
    seoDescription: "Understand JSON objects, arrays, and common syntax errors — with free formatter tools.",
    updatedAt: "2026-08-24",
    content: `## The short answer
JSON is a text format for structured data. APIs and config files use it because both humans and programs can read it.

## Building blocks
- Objects: \`{ "name": "Ada" }\`
- Arrays: \`[1, 2, 3]\`
- Strings, numbers, booleans, null

## Why formatting helps
Minified JSON is hard to debug. Beautifying reveals missing commas and braces quickly.

## Practice
Paste a payload into the JSON Formatter or JSON Validator on this site.`,
  },
  {
    slug: "improve-website-core-web-vitals",
    title: "How to improve website Core Web Vitals",
    excerpt: "Focus on LCP, INP, and CLS with practical front-end actions.",
    category: "Performance",
    relatedToolSlugs: ["image-compressor", "image-resizer", "meta-tag-generator"],
    seoTitle: "How to Improve Core Web Vitals",
    seoDescription: "Practical steps for better LCP, INP, and CLS without chasing vanity Lighthouse scores.",
    updatedAt: "2026-08-24",
    content: `## The three metrics that matter most
- **LCP**: largest contentful paint — optimize hero images and server response.
- **INP**: interaction responsiveness — reduce long tasks and heavy JS.
- **CLS**: layout shift — reserve space for images and ads.

## High-impact actions
1. Compress and correctly size images.
2. Avoid layout jumps from late-loading fonts and embeds.
3. Split rarely used JavaScript.
4. Cache static assets.

## Measure honestly
Lab scores help, but field data from real users is the truth.`,
  },
  {
    slug: "best-free-developer-tools",
    title: "Best free developer tools (on this network)",
    excerpt: "A curated shortlist of free utilities developers actually open daily.",
    category: "Development",
    relatedToolSlugs: ["json-formatter", "jwt-decoder", "regex-tester", "hash-generator", "uuid-generator"],
    seoTitle: "Best Free Developer Tools",
    seoDescription: "A practical shortlist of free browser developer tools for JSON, JWT, regex, and more.",
    updatedAt: "2026-08-24",
    content: `## Daily drivers
- JSON Formatter for API payloads
- JWT Decoder for inspecting tokens (never trust without verification)
- Regex Tester for quick pattern checks
- Hash Generator for checksums
- UUID Generator for IDs

## Why browser-local tools
Your data stays on the device. That is faster and safer for drafts and secrets-adjacent debugging — still never paste production secrets into random websites.`,
  },
];

export function getGuide(slug: string) {
  return NETWORK_GUIDES.find((g) => g.slug === slug);
}
