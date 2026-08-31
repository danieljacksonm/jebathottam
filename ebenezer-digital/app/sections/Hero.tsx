"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MagneticLink } from "../studio/MagneticLink";
import { STUDIO_STATS } from "@/lib/studio-stats";

const scenes: Record<string, string> = {
  build: "Websites, systems, and operations that ship on time.",
  digital: "Clear code, reliable delivery, and interfaces people trust.",
  experiences: "Digital work for businesses that need a dependable partner.",
};

export default function Hero() {
  const reduceRef = useRef(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const gridX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const gridY = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const [intro, setIntro] = useState(true);
  const [scene, setScene] = useState<keyof typeof scenes>("experiences");

  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceRef.current) {
      setIntro(false);
      return;
    }
    const t = window.setTimeout(() => setIntro(false), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      className="relative min-h-[92dvh] overflow-hidden"
      onMouseMove={(e) => {
        if (reduceRef.current) return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <motion.div className="studio-grid" style={{ x: gridX, y: gridY }} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(16,185,129,0.12),transparent_45%)]" />

      {intro && (
        <motion.div
          className="absolute inset-0 z-20 grid place-items-center bg-[#070708]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.9, duration: 0.35 }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-6">
            <Image src="/brand/eben-mark.svg" alt="" width={48} height={48} className="rounded-xl" />
            <span className="h-px w-24 bg-emerald-400/70" />
          </div>
        </motion.div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[92dvh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-8 lg:px-10">
        <p className="studio-kicker">Ebenezer Digital Services</p>
        <motion.h1
          className="studio-display mt-6 max-w-5xl text-[16vw] sm:text-[11vw] lg:text-[7.2rem]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          WE{" "}
          <button
            type="button"
            className="underline decoration-emerald-400/40 underline-offset-8"
            onMouseEnter={() => setScene("build")}
          >
            BUILD
          </button>
          <br />
          <button
            type="button"
            className="underline decoration-emerald-400/40 underline-offset-8"
            onMouseEnter={() => setScene("digital")}
          >
            DIGITAL
          </button>
          <br />
          <button
            type="button"
            className="text-emerald-400 underline decoration-white/20 underline-offset-8"
            onMouseEnter={() => setScene("experiences")}
          >
            EXPERIENCES.
          </button>
        </motion.h1>
        <motion.p
          className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--st-muted,#8d887e)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {scenes[scene]} Web development, e-commerce, automation, and ongoing support for teams worldwide.
        </motion.p>

        <div className="mt-10 flex flex-wrap gap-3">
          <MagneticLink href="/contact" className="studio-btn" cursor="START">
            Start a project →
          </MagneticLink>
          <Link href="/work" className="studio-btn studio-btn-ghost" data-cursor="VIEW">
            View our work
          </Link>
          <Link href="/services" className="studio-btn studio-btn-ghost" data-cursor="VIEW">
            Our services
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-[var(--st-line)] pt-8 md:grid-cols-4">
          {STUDIO_STATS.map((s) => (
            <div key={s.label}>
              <p className="studio-display text-3xl sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--st-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
