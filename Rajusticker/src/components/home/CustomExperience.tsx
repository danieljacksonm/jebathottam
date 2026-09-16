import Link from "next/link";
import { Media } from "@/components/media/Media";
import { CUSTOM_IMAGE } from "@/lib/image-art";

/**
 * Custom experience — interactive-feeling composition with process steps,
 * car-cropped imagery as atmosphere (not generic illustration).
 */
export function CustomExperience() {
  const steps = [
    { n: "01", label: "Your Idea" },
    { n: "02", label: "Your Design" },
    { n: "03", label: "Your Sticker" },
  ];

  return (
    <section className="border-b border-[var(--line)] overflow-hidden">
      <div className="grid lg:grid-cols-12 min-h-0">
        <div className="lg:col-span-5 relative min-h-[320px] sm:min-h-[400px] lg:min-h-[560px] order-1">
          <Media
            src={CUSTOM_IMAGE}
            alt="Iridescent wrap — custom sticker inspiration"
            kind="editorial"
            crop="frame"
            cropScale={1.2}
            focal="55% 22%"
            className="absolute inset-0 !min-h-0 !max-h-none !aspect-auto h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black/50" />
        </div>

        <div className="lg:col-span-7 order-2 flex flex-col justify-center px-[var(--gutter)] py-14 sm:py-16 lg:pl-14 xl:pl-20 border-t lg:border-t-0 lg:border-l border-[var(--line)] bg-[var(--bg)]">
          <p className="section-kicker">Custom</p>
          <h2 className="statement text-[clamp(2.4rem,5.5vw,4.2rem)] mt-3">
            <span className="statement-line">Not Off</span>
            <span className="statement-line text-[var(--accent)]">The Shelf.</span>
          </h2>
          <p className="mt-6 text-[var(--ink-2)] max-w-md leading-relaxed">
            Text, colour, size — a simple custom vinyl flow. Your concept, cut and ready.
          </p>

          <ol className="mt-10 space-y-0 max-w-sm">
            {steps.map((step, i) => (
              <li key={step.n} className="flex gap-5 items-stretch">
                <div className="flex flex-col items-center w-8">
                  <span className="font-display text-sm tracking-[0.12em] text-[var(--accent)]">
                    {step.n}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="flex-1 w-px bg-[var(--line-strong)] my-2 min-h-[1.5rem]" />
                  )}
                </div>
                <p className="font-display text-xl sm:text-2xl tracking-[0.04em] pb-6">
                  {step.label}
                </p>
              </li>
            ))}
          </ol>

          <Link href="/custom-stickers" className="btn btn-primary mt-4 inline-flex w-fit">
            Create Yours →
          </Link>
        </div>
      </div>
    </section>
  );
}
