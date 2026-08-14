"use client";

import dynamic from "next/dynamic";
import { DeferredMount } from "./DeferredMount";

const ScrollProgress = dynamic(
  () => import("@/components/ScrollProgress").then((m) => m.ScrollProgress),
  { ssr: false },
);
const AmbientToggle = dynamic(
  () => import("@/components/film/AmbientToggle").then((m) => m.AmbientToggle),
  { ssr: false },
);

/** Non-critical chrome loaded after first paint. */
export function DeferredChrome() {
  return (
    <DeferredMount delayMs={900}>
      <ScrollProgress />
      <AmbientToggle />
    </DeferredMount>
  );
}
