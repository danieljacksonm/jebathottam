import type { ReactNode } from "react";

/** Visual wrapper only — ambient lives once in the layout. */
export function PageAtmosphere({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
