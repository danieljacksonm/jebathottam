import Link from "next/link";
import { SafeImage } from "@/components/info/SafeImage";
import { NewsletterForm } from "./NewsletterForm";
import { DESK_PHOTOS } from "@/lib/news-photos";
import { listPublicNews } from "@/lib/news-service";
import { db } from "@/lib/db";
import { SITE_NAV, journalArticleHref, newsArticleHref, journalCategoryHref } from "@/lib/site-nav";

export const dynamic = "force-dynamic";

function readingMins(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

const CATEGORIES = [
  { label: "Technology", href: journalCategoryHref("Technology"), img: DESK_PHOTOS.tech },
  { label: "AI", href: `${SITE_NAV.journal}/blog?q=AI`, img: DESK_PHOTOS.tech },
  { label: "Business", href: journalCategoryHref("Business"), img: DESK_PHOTOS.business },
  { label: "Digital Life", href: `${SITE_NAV.journal}/blog?q=digital`, img: DESK_PHOTOS.world },
  { label: "Science", href: journalCategoryHref("Science"), img: DESK_PHOTOS.science },
  { label: "Internet", href: `${SITE_NAV.journal}/blog?q=internet`, img: DESK_PHOTOS.asia },
  { label: "People", href: `${SITE_NAV.news}/blog/news`, img: DESK_PHOTOS.politics },
  { label: "Ideas", href: `${SITE_NAV.journal}/blog?q=ideas`, img: DESK_PHOTOS.europe },
];

export default async function InfoHomePage() {
  const [newsAll, posts] = await Promise.all([
    listPublicNews().catch(() => []),
    db.getBlogPosts(true).catch(() => []),
  ]);

  const news = newsAll.slice(0, 5);
  const stories = posts.slice(0, 6);

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
            News, stories and useful ideas for the digital world — explained simply for everyone.
          </p>
          <div className="info-cta-row">
            <a className="info-btn info-btn-primary" href={SITE_NAV.news}>
              Read Today&apos;s News
            </a>
            <a className="info-btn info-btn-secondary" href={SITE_NAV.journal}>
              Explore the Journal
            </a>
            <a className="info-btn info-btn-secondary" href="/info/search">
              Search all
            </a>
            <a className="info-btn info-btn-secondary" href="#explore-more">
              Explore More
            </a>
          </div>
        </div>
      </section>

      <section className="info-section" aria-labelledby="today-heading">
        <p className="info-kicker">Today</p>
        <h2 className="info-h2" id="today-heading">
          What&apos;s happening today?
        </h2>
        <p className="info-lead">A few important stories from Ebenezer News — clear and current.</p>
        <div className="info-card-grid cols-3">
          {news.map((item) => (
            <a key={item.id} className="info-story-card" href={newsArticleHref(item.slug)}>
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
              </div>
            </a>
          ))}
        </div>
        <div className="info-cta-row" style={{ marginTop: "1.5rem" }}>
          <a className="info-btn info-btn-solid" href={SITE_NAV.news}>
            See All News
          </a>
        </div>
      </section>

      <section className="info-section" aria-labelledby="stories-heading" id="explore-more">
        <p className="info-kicker">Journal</p>
        <h2 className="info-h2" id="stories-heading">
          Stories worth your time
        </h2>
        <p className="info-lead">Deeper reading — explanations, guides and ideas from the Journal.</p>
        <div className="info-card-grid cols-3">
          {stories.map((post) => {
            const mins = readingMins(`${post.title} ${post.excerpt || ""}`);
            return (
              <a key={post.id} className="info-story-card" href={journalArticleHref(post.slug)}>
                <div className="info-story-media">
                  <SafeImage
                    src={post.coverImage || DESK_PHOTOS.world}
                    alt=""
                    fill
                  />
                </div>
                <div className="info-story-body">
                  <p className="info-meta">
                    {post.category || "Story"} · {mins} min read
                  </p>
                  <h3 className="info-story-title">{post.title}</h3>
                  <p className="info-story-dek">{post.excerpt}</p>
                  <span className="info-badge">Read Story</span>
                </div>
              </a>
            );
          })}
        </div>
        <div className="info-cta-row" style={{ marginTop: "1.5rem" }}>
          <a className="info-btn info-btn-outline" href={SITE_NAV.journal}>
            Open the Journal
          </a>
        </div>
      </section>

      <section className="info-section" aria-labelledby="cats-heading">
        <p className="info-kicker">Topics</p>
        <h2 className="info-h2" id="cats-heading">
          Explore what interests you
        </h2>
        <p className="info-lead">Pick a topic. Every link opens real stories.</p>
        <div className="info-cat-grid">
          {CATEGORIES.map((c) => (
            <a key={c.label} className="info-cat" href={c.href}>
              <SafeImage src={c.img} alt="" />
              <span>{c.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="info-section" aria-labelledby="new-heading">
        <p className="info-kicker">Start here</p>
        <h2 className="info-h2" id="new-heading">
          New here?
        </h2>
        <p className="info-lead">Not sure where to start? Choose one path.</p>
        <div className="info-split">
          <div className="info-guide">
            <h3>News</h3>
            <p>Choose News if you want to know what&apos;s happening right now in tech, AI and the digital world.</p>
            <a className="info-btn info-btn-solid" href={SITE_NAV.news}>
              Read Today&apos;s News
            </a>
          </div>
          <div className="info-guide">
            <h3>Journal</h3>
            <p>
              Choose Journal if you want to understand ideas, stories and useful knowledge — at a slower, clearer pace.
            </p>
            <a className="info-btn info-btn-outline" href={SITE_NAV.journal}>
              Read the Journal
            </a>
          </div>
        </div>
      </section>

      <section className="info-section" aria-labelledby="pause-heading">
        <h2 className="sr-only" id="pause-heading">
          Take a peaceful moment
        </h2>
        <div className="info-pause">
          <SafeImage src={DESK_PHOTOS.climate} alt="" />
          <blockquote>
            Good information should make life easier, not more complicated.
          </blockquote>
        </div>
      </section>

      <section className="info-section" aria-labelledby="eco-heading">
        <p className="info-kicker">Ecosystem</p>
        <h2 className="info-h2" id="eco-heading">
          Explore Ebenezer Digital
        </h2>
        <p className="info-lead">When you&apos;re ready, these other places may help.</p>
        <div className="info-ecosystem">
          <a href={SITE_NAV.home}>Digital Services — websites and digital work</a>
          <a href={SITE_NAV.network}>Free Tools — helpful utilities</a>
          <a href={SITE_NAV.ai}>AI — calm AI space</a>
          <a href={SITE_NAV.store}>Digital Products — ready-made kits</a>
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
