import Image from "next/image";
import { AtmosphereLayer } from "@/components/film/AtmosphereLayer";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  tone?: "gold" | "mist" | "forest" | "lake" | "night" | "falls";
  compact?: boolean;
  priority?: boolean;
};

export function CinematicPageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  tone = "mist",
  compact = false,
  priority = true,
}: Props) {
  return (
    <section
      className={`relative overflow-hidden ${compact ? "min-h-[52svh]" : "min-h-[72svh]"}`}
    >
      <div className="absolute inset-0 scale-110 motion-safe:animate-[hero-drift_28s_ease-in-out_infinite_alternate]">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          priority={priority}
          quality={70}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1600px"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/25" />
      <div className="absolute inset-0">
        <AtmosphereLayer tone={tone} />
      </div>
      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] max-w-7xl items-end px-5 pb-16 pt-28 md:px-8 md:pb-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="animate-[fade-up_0.9s_ease_forwards] text-[0.7rem] uppercase tracking-[0.32em] text-gold-bright opacity-0 motion-reduce:animate-none motion-reduce:opacity-100">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-4 animate-[fade-up_0.9s_ease_0.12s_forwards] font-display text-4xl leading-[1.05] text-white opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 sm:text-5xl md:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-xl animate-[fade-up_0.9s_ease_0.22s_forwards] text-base text-soft-gray opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 md:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
