import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HeroSection,
  CategoriesGrid,
  TrendingProducts,
  BrandShowcase,
  FlashDeals,
  FeaturesSection,
  TestimonialsSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroSection />

      {/* Features Bar */}
      <FeaturesSection />

      {/* Categories Grid */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-[var(--foreground)]">
              Shop by Category
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)]">
              Find exactly what you need for your mobile repair
            </p>
          </div>
          <CategoriesGrid />
        </div>
      </section>

      {/* Flash Deals */}
      <FlashDeals />

      {/* Trending Products */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[var(--foreground)]">
                Trending Products
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Most popular items this week
              </p>
            </div>
            <Link href="/shop">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <TrendingProducts />
        </div>
      </section>

      {/* Brand Showcase */}
      <BrandShowcase />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-16 bg-[var(--primary)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help Finding the Right Part?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Our experts can help you identify the correct spare part for your mobile.
            Contact us for free consultation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Contact Support
            </Button>
            <Link href="/shop">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[var(--primary)]"
              >
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
