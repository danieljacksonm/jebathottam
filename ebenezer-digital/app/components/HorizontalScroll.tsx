"use client";

import { type ReactNode } from "react";

/**
 * Horizontal scroll strip with snap (Poppr-style). Use for a row of cards or items.
 */
export default function HorizontalScroll({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`horizontal-scroll overflow-x-auto overflow-y-hidden flex gap-6 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ${className}`.trim()}
      style={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
    </div>
  );
}

export function HorizontalScrollItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-[380px] ${className}`.trim()}
      style={{ scrollSnapAlign: "start" }}
    >
      {children}
    </div>
  );
}
