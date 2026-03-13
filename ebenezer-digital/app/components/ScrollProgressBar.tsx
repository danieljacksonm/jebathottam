"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar at top that fills as user scrolls – addictive "completion" feel (award-site style).
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(pct);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-[var(--border)]"
      aria-hidden
    >
      <div
        className="scroll-progress-fill h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] transition-transform duration-150 ease-out origin-left"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
