"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[1.5px] origin-left bg-gradient-to-r from-transparent via-gold to-transparent"
      style={{ scaleX }}
    />
  );
}
