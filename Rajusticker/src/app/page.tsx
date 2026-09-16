import Link from "next/link";
import { getBestSellers, getFeaturedProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/home/Hero";
import { BrandStatement } from "@/components/home/BrandStatement";
import { FeaturedDrop } from "@/components/home/FeaturedDrop";
import { VibeMosaic } from "@/components/home/VibeMosaic";
import { LifestyleBanner } from "@/components/home/LifestyleBanner";
import { CustomExperience } from "@/components/home/CustomExperience";
import { TrustSection } from "@/components/home/TrustSection";
import { FinalCta } from "@/components/home/FinalCta";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Media } from "@/components/media/Media";
import { FAQ } from "@/components/ui/FAQ";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Premium Car Stickers & Wraps",
  description:
    "Raju Stickers — premium chrome, metallic, matte, and carbon fiber car wraps. Shop stickers, create custom vinyl, and drive different.",
  path: "/",
  image: "/products/chrome-gold.jpg",
});

const HOME_FAQ = [
  {
    question: "Are these full wrap rolls or small stickers?",
    answer:
      "Our catalogue focuses on premium PVC wrapping films in 1.52m × 18m rolls, plus sample and half-roll sizes. Use Custom Stickers for text-based vinyl pieces.",
  },
  {
    question: "Can I install the wrap myself?",
    answer:
      "Flat panels and accents are DIY-friendly with patience. Full chrome or complex colour-change installs are best done by a professional wrapper.",
  },
  {
    question: "Do you ship across India?",
    answer:
      "Yes. Standard delivery typically takes 3–7 business days. Orders above ₹15,000 qualify for free shipping.",
  },
  {
    question: "What material do you use?",
    answer:
      "High-quality ~150 micron PVC with high-tack air-release adhesive for smoother, bubble-resistant application.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts(8);
  const drop =
    featured.find((p) => p.slug.includes("holographic")) ||
    featured.find((p) => p.newArrival) ||
    featured[0];
  const best = await getBestSellers(4);
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <JsonLd data={faqJsonLd(HOME_FAQ)} />

      {/* 01 Impact */}
      <Hero />

      {/* 02 Brand attitude */}
      <BrandStatement />

      {/* 03 Featured drop — editorial */}
      {drop && <FeaturedDrop product={drop} />}

      {/* 04 Shop by vibe — mosaic */}
      <VibeMosaic />

      {/* 05 Best sellers — clean catalogue grid */}
      <section className="section border-b border-[var(--line)]">
        <div className="container-x">
          <div className="section-head">
            <div>
              <p className="section-kicker">Catalogue</p>
              <h2 className="section-title">Best Sellers</h2>
              <p className="section-sub">Compare finishes. Pick yours.</p>
            </div>
            <Link href="/shop" className="btn btn-secondary hidden sm:inline-flex">
              Shop all →
            </Link>
          </div>
          <ProductGrid products={best} />
        </div>
      </section>

      {/* 06 Large automotive visual */}
      <LifestyleBanner />

      {/* 07 Custom experience */}
      <CustomExperience />

      {/* 08 Trust */}
      <TrustSection />

      {/* Journal — light SEO content */}
      <section className="section border-b border-[var(--line)]">
        <div className="container-x">
          <div className="section-head">
            <div>
              <p className="section-kicker">Guides</p>
              <h2 className="section-title">From the Journal</h2>
            </div>
            <Link href="/blog" className="btn btn-ghost hidden sm:inline-flex">
              All articles →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-[16/10] border border-[var(--line)] overflow-hidden"
                >
                  <Media
                    src={post.image}
                    alt={post.imageAlt}
                    kind="banner"
                    zoom
                    crop="frame"
                    cropScale={1.15}
                    className="absolute inset-0 !aspect-auto !min-h-0 !max-h-none h-full"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <p className="mt-4 text-[10px] tracking-[0.14em] uppercase text-[var(--ink-3)]">
                  {post.readingTime}
                </p>
                <h3 className="font-display text-xl mt-1 leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[var(--accent)]">
                    {post.title}
                  </Link>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-x max-w-3xl">
          <FAQ items={HOME_FAQ} />
        </div>
      </section>

      {/* 09 Final visual CTA */}
      <FinalCta />
    </>
  );
}
