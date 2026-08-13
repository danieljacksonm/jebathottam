"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CoreState } from "./types";

export function AiCore({
  state,
  size = "lg",
}: {
  state: CoreState;
  size?: "sm" | "md" | "lg";
}) {
  const reduce = useReducedMotion();
  const dim = size === "lg" ? 168 : size === "md" ? 72 : 28;
  const busy = state === "thinking" || state === "responding" || state === "listening";
  const err = state === "error";
  const glow =
    state === "typing"
      ? 0.55
      : state === "thinking"
        ? 0.8
        : state === "responding"
          ? 0.7
          : state === "success"
            ? 0.5
            : state === "error"
              ? 0.35
              : 0.28;

  return (
    <div
      className="ai-core"
      data-state={state}
      style={{ width: dim, height: dim }}
      aria-hidden
    >
      {!reduce && (
        <>
          <motion.span
            className="ai-core-halo"
            animate={{
              scale: busy ? [1, 1.18, 1] : [1, 1.06, 1],
              opacity: [glow * 0.45, glow, glow * 0.45],
            }}
            transition={{
              duration: busy ? 1.8 : 6.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.span
            className="ai-core-ring"
            animate={{ rotate: reduce ? 0 : 360 }}
            transition={{ duration: err ? 18 : 42, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}
      <motion.span
        className="ai-core-body"
        animate={
          reduce
            ? { opacity: 1 }
            : {
                scale: state === "typing" ? 1.04 : busy ? [0.96, 1.05, 0.96] : [0.98, 1.02, 0.98],
              }
        }
        transition={{ duration: busy ? 1.4 : 5.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="ai-core-speck" />
    </div>
  );
}
