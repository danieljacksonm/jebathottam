import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site-url";
import { SITE_NAV } from "@/lib/site-nav";

export const metadata: Metadata = pageMetadata({
  title: "About | Ebenezer Digital Information",
  description:
    "What Ebenezer Digital Information is — a calm place for news, stories and useful ideas, explained simply.",
  path: "/info/about",
});

export default function InfoAboutPage() {
  return (
    <section className="info-section" style={{ paddingTop: "4rem" }}>
      <p className="info-kicker">About</p>
      <h1 className="info-h2">You are welcome here.</h1>
      <p className="info-lead">
        Ebenezer Digital Information is a peaceful place to discover useful information about technology,
        AI and digital life — without feeling confused or overwhelmed.
      </p>
      <div className="info-split">
        <div className="info-guide">
          <h2>News</h2>
          <p>What is happening now — technology, AI, business and the digital world — written clearly.</p>
          <a className="info-btn info-btn-solid" href={SITE_NAV.news}>
            Go to News
          </a>
        </div>
        <div className="info-guide">
          <h2>Journal</h2>
          <p>Stories, explanations and guides that help you understand ideas at your own pace.</p>
          <a className="info-btn info-btn-outline" href={SITE_NAV.journal}>
            Go to Journal
          </a>
        </div>
      </div>
      <p style={{ marginTop: "2rem", color: "var(--info-muted)" }}>
        Questions?{" "}
        <Link href="/contact" style={{ color: "var(--info-accent)", fontWeight: 600 }}>
          Contact us
        </Link>
        .
      </p>
    </section>
  );
}
