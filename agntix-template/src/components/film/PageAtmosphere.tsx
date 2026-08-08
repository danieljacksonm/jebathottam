"use client";

/** Visual wrapper only — ambient lives once in the layout. */
export function PageAtmosphere({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
