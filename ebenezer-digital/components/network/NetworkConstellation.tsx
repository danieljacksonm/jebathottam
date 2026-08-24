"use client";

const NODES = [
  { label: "SEO", top: "12%", left: "8%", delay: "0s" },
  { label: "AI", top: "18%", left: "55%", delay: "0.4s" },
  { label: "Code", top: "38%", left: "22%", delay: "0.8s" },
  { label: "PDF", top: "58%", left: "70%", delay: "0.2s" },
  { label: "Images", top: "68%", left: "18%", delay: "1s" },
  { label: "Business", top: "28%", left: "78%", delay: "0.6s" },
  { label: "Developer", top: "74%", left: "48%", delay: "1.2s" },
  { label: "Security", top: "46%", left: "42%", delay: "0.3s" },
  { label: "Utilities", top: "10%", left: "34%", delay: "0.9s" },
];

/** Lightweight CSS constellation — no canvas/WebGL cost. */
export function NetworkConstellation() {
  return (
    <div className="nx-constellation" aria-hidden>
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="nxLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d="M40 40 L140 70 L90 140 L220 120 L280 60 L340 160 L200 220 L80 200 Z"
          fill="none"
          stroke="url(#nxLine)"
          strokeWidth="1.2"
        />
        {[
          [40, 40],
          [140, 70],
          [90, 140],
          [220, 120],
          [280, 60],
          [340, 160],
          [200, 220],
          [80, 200],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="currentColor" opacity="0.35" />
        ))}
      </svg>
      {NODES.map((n) => (
        <span key={n.label} className="nx-node" style={{ top: n.top, left: n.left, animationDelay: n.delay }}>
          {n.label}
        </span>
      ))}
    </div>
  );
}
