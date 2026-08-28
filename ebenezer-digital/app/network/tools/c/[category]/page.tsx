import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolCard } from "@/components/network/ToolCard";
import {
  CATEGORY_LABELS,
  getLiveTools,
  getToolsByCategory,
} from "@/lib/network/registry";
import { CATEGORY_PATH_ALIASES, PUBLIC_CATEGORIES } from "@/lib/network/paths";
import type { NetworkToolCategory } from "@/lib/network/types";
import { NETWORK_URL } from "@/lib/site-url";

type Props = { params: { category: string } };

const CATEGORY_INTRO: Record<string, { title: string; blurb: string; seoTitle: string; seoDescription: string }> = {
  developer: {
    title: "Developer tools",
    blurb: "Format, validate, encode and debug common developer data — entirely in your browser.",
    seoTitle: "Free Developer Tools Online — JSON, Base64, JWT & More",
    seoDescription: "Browser-based developer utilities: JSON formatter, JWT decoder, Base64, UUID, hash and more.",
  },
  seo: {
    title: "SEO tools",
    blurb: "Generate meta tags, robots.txt, sitemaps and on-page helpers without signing up.",
    seoTitle: "Free SEO Tools Online — Meta Tags, Robots.txt & Sitemap",
    seoDescription: "Create meta tags, robots.txt, sitemaps, Open Graph tags and more SEO helpers for free.",
  },
  image: {
    title: "Image tools",
    blurb: "Compress, resize and convert images locally. Your files stay on your device.",
    seoTitle: "Free Image Tools Online — Compress, Resize & Convert",
    seoDescription: "Compress JPG/PNG/WebP, resize images and convert formats in your browser. No upload required.",
  },
  text: {
    title: "Text tools",
    blurb: "Count words, clean messy text, change case and remove duplicates instantly.",
    seoTitle: "Free Text Tools Online — Word Counter, Case Converter & More",
    seoDescription: "Word counter, text cleaner, case converter and other free text utilities.",
  },
  calculators: {
    title: "Calculators",
    blurb: "GST, EMI, percentages, units and everyday math — clear results, no ads in the way.",
    seoTitle: "Free Online Calculators — GST, EMI, Units & More",
    seoDescription: "GST calculator, EMI, loan, percentage, age and unit converters that run in your browser.",
  },
  business: {
    title: "Business tools",
    blurb: "Invoice math, margins and QR codes for day-to-day business work.",
    seoTitle: "Free Business Tools Online — Invoice, Margin & QR",
    seoDescription: "Invoice calculator, profit margin and QR code tools for small business workflows.",
  },
  ai: {
    title: "AI tools",
    blurb: "Prompt helpers and content outlines that prepare you to work with any AI — no account needed.",
    seoTitle: "Free AI Helper Tools — Prompts, Outlines & SEO Briefs",
    seoDescription: "AI prompt generator, prompt formatter, content outline and SEO brief helpers.",
  },
  pdf: {
    title: "PDF tools",
    blurb: "PDF utilities are coming soon. Meanwhile explore image and text tools.",
    seoTitle: "PDF Tools — Coming Soon",
    seoDescription: "PDF tools are not live yet on Ebenezer Digital Network. Browse related image and text tools.",
  },
};

export function generateStaticParams() {
  return PUBLIC_CATEGORIES.map((category) => ({ category }));
}

export function generateMetadata({ params }: Props): Metadata {
  const key = CATEGORY_PATH_ALIASES[params.category] || params.category;
  const intro = CATEGORY_INTRO[key];
  if (!intro) return { title: "Category" };
  const url = `${NETWORK_URL}/tools/${key}`;
  return {
    title: intro.seoTitle,
    description: intro.seoDescription,
    alternates: { canonical: url },
    openGraph: { title: intro.seoTitle, description: intro.seoDescription, url },
  };
}

export default function NetworkCategoryPage({ params }: Props) {
  const key = (CATEGORY_PATH_ALIASES[params.category] || params.category) as NetworkToolCategory;
  if (!CATEGORY_LABELS[key]) notFound();
  const intro = CATEGORY_INTRO[key];
  const tools = getToolsByCategory(key);
  const relatedCats = PUBLIC_CATEGORIES.filter((c) => c !== key).slice(0, 4);

  // Empty PDF category: do not pretend tools exist
  if (key === "pdf" || tools.length === 0) {
    return (
      <div className="nx-page py-10">
        <p className="text-sm text-[var(--nx-muted)]">
          <Link href="/network" className="hover:text-[var(--nx-brand)]">
            Home
          </Link>
          {" / "}
          <Link href="/network/tools" className="hover:text-[var(--nx-brand)]">
            Tools
          </Link>
          {" / "}
          {CATEGORY_LABELS[key]}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{intro?.title || CATEGORY_LABELS[key]}</h1>
        <p className="mt-2 text-[var(--nx-muted)]">
          We haven&apos;t published tools in this category yet. Try a related area below.
        </p>
        <div className="nx-cat-grid mt-8">
          {PUBLIC_CATEGORIES.map((c) => (
            <Link key={c} href={`/network/tools/c/${c}`} className="nx-cat-tile">
              <strong>{CATEGORY_LABELS[c]}</strong>
              <span>{getToolsByCategory(c).length} tools</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="nx-page py-10">
      <p className="text-sm text-[var(--nx-muted)]">
        <Link href="/network" className="hover:text-[var(--nx-brand)]">
          Home
        </Link>
        {" / "}
        <Link href="/network/tools" className="hover:text-[var(--nx-brand)]">
          Tools
        </Link>
        {" / "}
        {CATEGORY_LABELS[key]}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{intro.title}</h1>
      <p className="mt-2 max-w-2xl text-[var(--nx-muted)]">{intro.blurb}</p>
      <p className="mt-6 text-sm text-[var(--nx-muted)]">{tools.length} tools</p>
      <div className="nx-grid-tools mt-4">
        {tools.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>

      <section className="mt-12 nx-prose max-w-3xl">
        <h2>Why use {CATEGORY_LABELS[key].toLowerCase()} tools here?</h2>
        <p>
          Every tool in this category runs in your browser when possible — so you get speed, privacy and no
          forced signup. Results stay on your device unless a tool clearly says otherwise.
        </p>
        <h3>Related categories</h3>
        <div className="not-prose flex flex-wrap gap-2 mt-3">
          {relatedCats.map((c) => (
            <Link key={c} href={`/network/tools/c/${c}`} className="nx-chip">
              {CATEGORY_LABELS[c]}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold">Explore more</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/network/tools" className="nx-btn nx-btn-primary">
            All tools
          </Link>
          <Link href="/network/finder" className="nx-btn nx-btn-ghost">
            Tool finder
          </Link>
        </div>
        <p className="mt-4 text-sm text-[var(--nx-muted)]">
          Looking for something else? We have {getLiveTools().length} live tools across the network.
        </p>
      </section>
    </div>
  );
}
