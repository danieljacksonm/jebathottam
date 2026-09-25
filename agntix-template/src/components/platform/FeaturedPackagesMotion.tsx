"use client";

import { useReveal } from "@/components/cinematic/motion";

export function FeaturedPackagesMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useReveal([]);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>{children}</div>
  );
}
