import type { Metadata } from "next";
import { pageMetadata, JOURNAL_URL, NEWS_URL } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "News feeds for Google, Microsoft & more | E> Newsroom",
  description:
    "Official RSS, news sitemap, and iCal feeds for Ebenezer World News. Use these URLs in Google Publisher Center, Bing Webmaster Tools, and Flipboard.",
  path: "/blog/newsroom/feeds",
});

const FEEDS = [
  {
    name: "News RSS",
    url: `${NEWS_URL}/api/news/rss`,
    use: "Google Publisher Center, Bing/Microsoft Start, Flipboard, Feedly",
  },
  {
    name: "Google News sitemap",
    url: `${NEWS_URL}/api/news/sitemap`,
    use: "Google Search Console + Publisher Center (recent news URLs)",
  },
  {
    name: "Journal RSS",
    url: `${JOURNAL_URL}/api/blog/rss`,
    use: "Journal discovery and newsletter tools",
  },
  {
    name: "News iCal",
    url: `${NEWS_URL}/api/news/ical`,
    use: "Calendar apps and desk planning",
  },
  {
    name: "HTML sitemap",
    url: `${NEWS_URL}/sitemap.xml`,
    use: "Google Search Console and Bing Webmaster Tools",
  },
];

export default function NewsroomFeedsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-emerald-400">E&gt; Newsroom</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Public feeds</h1>
      <p className="mt-6 text-base leading-8 text-neutral-300">
        Submit these official URLs. Do not scrape the homepage. These feeds are the source of truth for
        Google News, Microsoft Start, and other public directories.
      </p>
      <ol className="mt-10 list-decimal space-y-6 pl-5 text-neutral-300">
        <li>
          Google: Search Console → sitemaps. Then Publisher Center → add publication → paste News RSS
          and news sitemap.
        </li>
        <li>
          Microsoft: Bing Webmaster Tools → verify {NEWS_URL.replace("https://", "")} → submit
          sitemap.xml and News RSS.
        </li>
        <li>Flipboard / Feedly: add the News RSS URL as a publisher source.</li>
      </ol>
      <ul className="mt-10 space-y-6">
        {FEEDS.map((f) => (
          <li key={f.url} className="border border-white/10 p-4">
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-400">{f.name}</p>
            <a href={f.url} className="mt-2 block break-all text-white hover:underline">
              {f.url}
            </a>
            <p className="mt-2 text-sm text-neutral-400">{f.use}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
