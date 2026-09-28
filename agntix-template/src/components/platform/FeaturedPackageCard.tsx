"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { TiltCard } from "@/components/cinematic/TiltCard";

type Props = {
  id: string;
  title: string;
  image: string;
  destination: string;
  days: number;
  nights: number;
  blurb: string;
  priceLabel: string;
  priceNote: string | null;
  enquireLabel: string;
};

export function FeaturedPackageCard({
  id,
  title,
  image,
  destination,
  days,
  nights,
  blurb,
  priceLabel,
  priceNote,
  enquireLabel,
}: Props) {
  return (
    <TiltCard>
      <article data-reveal className="lux-card group flex h-full flex-col" data-cursor="view">
        <Link
          href={`/packages/${id}`}
          className="relative block aspect-[16/11] overflow-hidden"
        >
          <Image
            src={image}
            alt={title}
            fill
            quality={80}
            className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-lux)] group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
        </Link>
        <div className="flex flex-1 flex-col p-6">
          <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold/80">
            {destination} · {days}D / {nights}N
          </p>
          <h3 className="mt-2 font-display text-2xl text-cream md:text-3xl">
            {title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-soft-gray">
            {blurb}
          </p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-[var(--line)] pt-5 mt-6">
            <div>
              <p className="font-display text-2xl text-gold-bright">{priceLabel}</p>
              {priceNote ? (
                <p className="text-xs text-mist/70">{priceNote}</p>
              ) : null}
            </div>
            <Link
              href={`/enquire?package=${id}`}
              className="btn-ghost !px-4 !py-2.5 text-[0.65rem]"
              data-cursor="book"
            >
              {enquireLabel}
            </Link>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
