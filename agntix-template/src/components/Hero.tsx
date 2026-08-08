"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Play, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BookingBar } from "./BookingBar";
import { KodaiMist } from "./KodaiMist";

export function Hero() {
  const t = useTranslations("hero");
  const tv = useTranslations("video");
  const reduce = useReducedMotion();
  const [videoOpen, setVideoOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "10%"]);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.35]);

  return (
    <>
      <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
        {/* Soft enter: mist lifts, hills appear — Kodaikanal arrival */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[5] bg-[#d7e0e8]"
            initial={{ opacity: 1 }}
            animate={{ opacity: entered ? 0 : 1 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            onAnimationComplete={() => setEntered(true)}
          />
        )}

        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80"
            alt="Misty Kodaikanal highland hills"
            fill
            priority
            className="object-cover object-[center_35%] scale-[1.05]"
            sizes="100vw"
          />
        </motion.div>

        <motion.div style={{ opacity: mistOpacity }} className="absolute inset-0 z-[1]">
          <KodaiMist />
        </motion.div>
        <div className="hero-veil absolute inset-0 z-[2]" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-28 pt-28 md:px-8 md:pb-36">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold/90">
              {t("place")}
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.08] text-cream md:text-6xl lg:text-7xl">
              {t("headlineBefore")}{" "}
              <span className="text-gold-bright">{t("headlineAccent")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
              {t("sub")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/packages" className="btn-gold">
                {t("cta")}
              </Link>
              <Link href="/kodaikanal" className="btn-ghost">
                {t("ctaSecondary")}
              </Link>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="btn-ghost"
              >
                <Play size={14} />
                {t("ctaVideo")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative z-20 px-5 md:px-8">
        <BookingBar />
      </div>

      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-5"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--line)] bg-navy-mid"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
                <p className="text-sm text-cream">{tv("title")}</p>
                <button
                  type="button"
                  className="rounded-full border border-[var(--line)] p-1.5 text-cream"
                  onClick={() => setVideoOpen(false)}
                  aria-label={tv("close")}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex aspect-video items-center justify-center bg-black/40 p-8 text-center">
                <p className="max-w-md text-sm text-mist">{tv("note")}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
