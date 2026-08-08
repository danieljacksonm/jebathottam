"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Slow drifting mist — Kodaikanal atmosphere, not playful UI motion. */
export function KodaiMist({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{
          background:
            "linear-gradient(180deg, rgba(180,198,214,0.12) 0%, transparent 40%, rgba(5,11,22,0.55) 100%)",
        }}
      />
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="kodai-mist-layer absolute -inset-[20%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 30% 40%, rgba(210,222,232,0.45), transparent 60%)",
        }}
        animate={{ x: ["-4%", "6%", "-4%"], y: ["0%", "3%", "0%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="kodai-mist-layer absolute -inset-[25%] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 55%, rgba(190,205,220,0.4), transparent 55%)",
        }}
        animate={{ x: ["5%", "-7%", "5%"], y: ["2%", "-2%", "2%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(184,196,212,0.12) 40%, rgba(5,11,22,0.75))",
        }}
        animate={{ opacity: [0.75, 0.95, 0.75] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
