import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Buying guides — Ebenezer Tools",
  description: "Practical guides to choose AI tools, CRM, SEO and SaaS — then compare on Ebenezer Tools.",
};

const GUIDES = [
  {
    slug: "best-ai-coding-tools",
    title: "Best AI coding tools",
    excerpt: "When to pick Copilot, Cursor, or a chat assistant for programming work.",
    href: "/tools/compare?ids=github-copilot,cursor,chatgpt",
  },
  {
    slug: "best-ai-tools-for-youtube",
    title: "Best AI tools for YouTube",
    excerpt: "Writing, thumbnails, and short-form video — grounded in our catalog.",
    href: "/tools/compare?ids=chatgpt,runway,canva",
  },
  {
    slug: "best-crm-for-small-business",
    title: "Best CRM for small business",
    excerpt: "HubSpot vs Zoho for Indian and global SMBs starting a pipeline.",
    href: "/tools/compare?ids=hubspot,zoho-crm",
  },
  {
    slug: "best-ai-writing-tools",
    title: "Best AI writing tools",
    excerpt: "ChatGPT, Claude, and Gemini for drafts, research, and rewrites.",
    href: "/tools/compare?ids=chatgpt,claude,gemini",
  },
];

export default function ToolsGuidesPage() {
  return (
    <div className="aff-page py-10">
      <p className="text-sm text-[var(--aff-muted)]">
        <Link href="/tools" className="hover:text-[var(--aff-brand)]">
          Tools
        </Link>{" "}
        / Guides
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Buying guides</h1>
      <p className="mt-2 max-w-2xl text-[var(--aff-muted)]">
        Genuine comparison value — not rewritten merchant blurbs. Each guide links into live comparison pages.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={g.href} className="aff-card p-5 hover:border-teal-300">
            <h2 className="font-semibold text-lg">{g.title}</h2>
            <p className="mt-2 text-sm text-[var(--aff-muted)]">{g.excerpt}</p>
            <p className="mt-3 text-sm font-semibold text-[var(--aff-brand-dk)]">Open comparison →</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-sm text-[var(--aff-muted)]">
        Prefer a conversation?{" "}
        <Link href={`${SITE_URL}/ai?mode=tools`} className="text-[var(--aff-brand-dk)] font-semibold hover:underline">
          Ask Ebenezer AI
        </Link>
        .
      </p>
    </div>
  );
}
