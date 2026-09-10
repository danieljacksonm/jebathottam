import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow="Lost in the mist?"
        title="Let’s get you back to Kodaikanal."
        subtitle="Explore packages, or plan your next step with Canaan."
        image="/images/kodai/hero.webp"
        imageAlt="Kodaikanal mist and pine-covered hills"
        tone="night"
        compact
        priority={false}
      />

      <section className="mx-auto max-w-3xl px-5 pb-16 pt-10 md:px-8">
        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-gold text-center">
            Back Home
          </Link>
          <Link href="/kodaikanal" className="btn-ghost text-center">
            Explore Kodaikanal
          </Link>
          <Link href="/packages" className="btn-ghost text-center">
            View Packages
          </Link>
        </div>
      </section>
    </PageAtmosphere>
  );
}

