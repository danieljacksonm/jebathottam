"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  BRAND_FILM_SCENES,
  BRAND_VIDEO_POSTER,
  getBrandVideoEmbed,
} from "@/lib/brand-video";

function KodaiBrandFilm() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % BRAND_FILM_SCENES.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  const src = BRAND_FILM_SCENES[index] ?? BRAND_FILM_SCENES[0];

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt="Kodaikanal cinematic scene"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04162b]/80 via-transparent to-[#04162b]/25" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay [background-image:radial-gradient(circle_at_20%_20%,#fff_0.6px,transparent_0.7px)] [background-size:3px_3px]" />
    </div>
  );
}

function BrandVideoPlayer() {
  const embed = getBrandVideoEmbed();

  if (embed?.kind === "file") {
    return (
      <video
        className="aspect-video w-full bg-black"
        controls
        autoPlay
        playsInline
        poster={BRAND_VIDEO_POSTER}
      >
        <source src={embed.src} />
      </video>
    );
  }

  if (embed) {
    return (
      <iframe
        title="Canaan Travel Hub brand film"
        src={embed.src}
        className="aspect-video w-full bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return <KodaiBrandFilm />;
}

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
};

export function BrandFilmModal({ open, onClose, title, closeLabel }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="glass-panel relative w-full max-w-4xl overflow-hidden rounded-3xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <p className="text-sm text-white">{title}</p>
              <button
                type="button"
                className="rounded-full border border-[var(--line)] p-2 text-white transition hover:border-gold"
                onClick={onClose}
                aria-label={closeLabel}
              >
                <X size={16} />
              </button>
            </div>
            <BrandVideoPlayer />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
