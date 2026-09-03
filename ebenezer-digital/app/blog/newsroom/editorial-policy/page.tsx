import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Editorial Policy | E> Newsroom",
  description:
    "Editorial standards, corrections, source rules, and AI usage policy for Ebenezer World News.",
  path: "/blog/newsroom/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-emerald-400">E&gt; Newsroom</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Editorial policy</h1>

      <div className="mt-8 space-y-6 text-base leading-8 text-neutral-300">
        <p>
          We publish factual, clearly dated stories. Every article must show a headline, summary, publish time,
          and source context.
        </p>
        <p>
          If a mistake is found, we correct it quickly and update the article timestamp.
        </p>
        <p>
          AI tools may support drafting and summarization, but final publication is reviewed by human editors.
        </p>
        <p>
          We avoid misleading thumbnails, fake urgency, and copied text blocks without attribution.
        </p>
        <p>
          Wire stories from partner feeds (BBC, Guardian, Reuters, and others) are summarized with clear
          source labels and links to originals. They are <strong>source-based summaries</strong>, not
          original reporting by Ebenezer journalists. Desk names label our editorial lanes — they are not
          claims that outside reporters work for Ebenezer Digital.
        </p>
        <p>
          Wire stories remain in our Google News sitemap for seven days, then roll off the index.
        </p>
        <p>
          Original CMS stories written by Ebenezer editors follow the same dating, correction, and source
          citation standards. We do not invent journalists, quotes, or statistics.
        </p>
      </div>
    </main>
  );
}
