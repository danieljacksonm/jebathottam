import Link from "next/link";
import { pageMetadata, JOURNAL_URL, NEWS_URL } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Media | Ebenezer Digital",
  description:
    "Ebenezer Digital media: E> News for current events and E> Journal for evergreen knowledge.",
  path: "/media",
});

export default function MediaPage() {
  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">Media</p>
      <h1 className="studio-display mt-4 max-w-4xl text-5xl sm:text-7xl">NEWS &amp; JOURNAL.</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">
        Two publications, two jobs. News covers current events. Journal covers evergreen learning.
      </p>
      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        <a href={NEWS_URL} className="border border-[var(--st-line)] p-8 hover:border-emerald-500/40">
          <h2 className="studio-display text-3xl">E&gt; News</h2>
          <p className="mt-4 text-[var(--st-muted)]">
            Current events with source-based reporting. Lives on news.ebenezerdigital.info.
          </p>
        </a>
        <a href={JOURNAL_URL} className="border border-[var(--st-line)] p-8 hover:border-emerald-500/40">
          <h2 className="studio-display text-3xl">E&gt; Journal</h2>
          <p className="mt-4 text-[var(--st-muted)]">
            Guides, tutorials, and practical digital insights. Lives on journal.ebenezerdigital.info.
          </p>
        </a>
      </div>
      <p className="mt-10 text-sm text-[var(--st-muted)]">
        Company story:{" "}
        <Link href="/why" className="underline hover:text-white">
          Why Ebenezer Digital
        </Link>
      </p>
    </main>
  );
}
