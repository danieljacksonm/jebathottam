import Link from "next/link";
import { SafeImage } from "@/components/info/SafeImage";
import { NewsletterForm } from "./NewsletterForm";
import { DESK_PHOTOS } from "@/lib/news-photos";
import { listPublicNewsPreview, latestNewsPublishedAt } from "@/lib/news-service";
import { db } from "@/lib/db";
import { loadArticles } from "@/lib/content-engine";
import { SITE_NAV, journalArticleHref, newsArticleHref, journalCategoryHref } from "@/lib/site-nav";

export const revalidate = 300;

function readingMins(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

const TOPICS = [
  { label: "Technology", href: journalCategoryHref("Technology"), img: DESK_PHOTOS.tech },
  { label: "AI", href: `${SITE_NAV.journal}?q=AI`, img: DESK_PHOTOS.tech },
  { label: "Business", href: journalCategoryHref("Business"), img: DESK_PHOTOS.business },
  { label: "Websites", href: `${SITE_NAV.journal}?q=website`, img: DESK_PHOTOS.world },
  { label: "Digital Tools", href: SITE_NAV.network, img: DESK_PHOTOS.tech },
  { label: "Digital Life", href: `${SITE_NAV.journal}?q=digital`, img: DESK_PHOTOS.asia },
  { label: "Travel", href: `${SITE_NAV.journal}?q=travel`, img: DESK_PHOTOS.europe },
  { label: "How-To Guides", href: "/guides", img: DESK_PHOTOS.science },
];

export default async function InfoHomePage() {
  const news = listPublicNewsPreview(5);
  const newsLatest = latestNewsPublishedAt(news);
  const posts = await db.getBlogPosts(true).catch(() => []);
  const blog = posts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt || 0).getTime() -
        new Date(a.publishedAt || a.createdAt || 0).getTime()
    )
    .slice(0, 6);
  const picks = blog.slice(0, 3);
  const guides = loadArticles("info-guides").filter((g) => g.indexable !== false).slice(0, 4);

  return (
    <>
      <section className="info-hero" aria-label="Welcome">
        <div className="info-hero-media" aria-hidden>
          <SafeImage src={DESK_PHOTOS.default} alt="" priority />
          <div className="info-hero-shade" />
        </div>
        <div className="info-hero-content">
          <p className="info-kicker" style={{ color: "#9fe0c8" }}>
            Ebenezer Digital Information
          </p>
          <h1>Discover. Understand. Explore.</h1>
          <p className="info-hero-sub">
            Original articles, guides and a clear window into Ebenezer News — explained simply.
          </p>
          <div className="info-cta-row">
            <a className="info-btn info-btn-primary" href="/blog">
              Read the Blog
            </a>
            <a className="info-btn info-btn-secondary" href={SITE_NAV.news}>
              Open Ebenezer News
            </a>
            <a className="info-btn info-btn-secondary" href="/guides">
              Guides
            </a>
            <a className="info-btn info-btn-secondary" href="/search">
              Search
            </a>
          </div>
        </div>
      </section>

      <section className="info-section info-section-featured" aria-labelledby="news-heading">
        <p className="info-kicker">News — live desk</p>
        <h2 className="info-h2" id="news-heading">
          Latest headlines
        </h2>
        <p className="info-lead">
          Breaking and developing stories from the canonical Ebenezer News desk
          {newsLatest
            ? ` · updated ${new Date(newsLatest).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}`
            : ""}
          . Cards link to news.ebenezerdigital.info — we do not duplicate full articles here.
        </p>
        <div className="info-card-grid cols-3">
          {news.map((item) => (
            <a key={item.id} className="info-story-card" href={newsArticleHref(item.slug, item.region)}>
              <div className="info-story-media">
                <SafeImage src={item.coverImage} alt="" fill />
              </div>
              <div className="info-story-body">
                <p className="info-meta">
                  {item.topic || item.region}
                  {item.publishedAt
                    ? ` · ${new Date(item.publishedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}`
                    : ""}
                </p>
                <h3 className="info-story-title">{item.title}</h3>
                <p className="info-story-dek">{item.dek}</p>
                <span className="info-badge">Read on Ebenezer News →</span>
              </div>
            </a>
          ))}
        </div>
        <div className="info-cta-row" style={{ marginTop: "1.5rem" }}>
          <a className="info-btn info-btn-solid" href={SITE_NAV.news}>
            Open Ebenezer News
          </a>
        </div>
      </section>

      <section className="info-section" aria-labelledby="blog-heading">
        <p className="info-kicker">Journal</p>
        <h2 className="info-h2" id="blog-heading">
          Original articles &amp; explainers
        </h2>
        <p className="info-lead">
          Deep digital knowledge from the Ebenezer Journal — technology, AI, business and how the web works.
        </p>
        <div className="info-card-grid cols-3">
          {blog.map((post) => {
            const mins = readingMins(`${post.title} ${post.excerpt || ""}`);
            const published = post.publishedAt || post.createdAt;
            return (
              <a key={post.id} className="info-story-card" href={journalArticleHref(post.slug)}>
                <div className="info-story-media">
                  <SafeImage src={post.coverImage || DESK_PHOTOS.world} alt="" fill />
                </div>
                <div className="info-story-body">
                  <p className="info-meta">
                    {post.category || "Article"} · {mins} min read
                    {published
                      ? ` · ${new Date(published).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}`
                      : ""}
                  </p>
                  <h3 className="info-story-title">{post.title}</h3>
                  <p className="info-story-dek">{post.excerpt}</p>
                  <span className="info-badge">Read on Journal</span>
                </div>
              </a>
            );
          })}
        </div>
        <div className="info-cta-row" style={{ marginTop: "1.5rem" }}>
          <a className="info-btn info-btn-outline" href={SITE_NAV.journal}>
            All journal articles
          </a>
        </div>
      </section>

      {picks.length > 0 ? (
        <section className="info-section" aria-labelledby="picks-heading">
          <p className="info-kicker">Editor&apos;s picks</p>
          <h2 className="info-h2" id="picks-heading">
            Worth your time
          </h2>
          <div className="info-card-grid cols-3">
            {picks.map((post) => (
              <a key={post.id} className="info-story-card" href={journalArticleHref(post.slug)}>
                <div className="info-story-body">
                  <p className="info-meta">{post.category || "Pick"}</p>
                  <h3 className="info-story-title">{post.title}</h3>
                  <p className="info-story-dek">{post.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="info-section" aria-labelledby="guides-heading">
        <p className="info-kicker">Guides</p>
        <h2 className="info-h2" id="guides-heading">
          Explainers &amp; digital knowledge
        </h2>
        <p className="info-lead">Practical guides hosted on this information hub.</p>
        <div className="info-card-grid cols-3">
          {guides.length ? (
            guides.map((g) => (
              <Link key={g.slug} className="info-story-card" href={`/guides/${g.slug}`}>
                <div className="info-story-body">
                  <p className="info-meta">Guide</p>
                  <h3 className="info-story-title">{g.title}</h3>
                  <p className="info-story-dek">{g.excerpt}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="info-lead">Guides are being prepared. Check back soon.</p>
          )}
        </div>
        <div className="info-cta-row" style={{ marginTop: "1.5rem" }}>
          <a className="info-btn info-btn-outline" href="/guides">
            Browse guides
          </a>
        </div>
      </section>

      <section className="info-section" aria-labelledby="cats-heading">
        <p className="info-kicker">Topics</p>
        <h2 className="info-h2" id="cats-heading">
          Explore what interests you
        </h2>
        <div className="info-cat-grid">
          {TOPICS.map((c) => (
            <a key={c.label} className="info-cat" href={c.href}>
              <SafeImage src={c.img} alt="" />
              <span>{c.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="info-section" aria-labelledby="mail-heading">
        <p className="info-kicker">Newsletter</p>
        <h2 className="info-h2" id="mail-heading">
          Get the important stories, without the noise.
        </h2>
        <NewsletterForm />
      </section>
    </>
  );
}
