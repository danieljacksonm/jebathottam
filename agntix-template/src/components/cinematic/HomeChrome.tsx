"use client";

import dynamic from "next/dynamic";
import { DeferredMount } from "./DeferredMount";

const JourneyAtmosphere = dynamic(
  () => import("@/components/cinematic/JourneyAtmosphere").then((m) => m.JourneyAtmosphere),
  { ssr: false },
);
const CinematicCursor = dynamic(
  () => import("@/components/cinematic/CinematicCursor").then((m) => m.CinematicCursor),
  { ssr: false },
);
const JourneyProgress = dynamic(
  () => import("@/components/cinematic/JourneyProgress").then((m) => m.JourneyProgress),
  { ssr: false },
);

/** Homepage cinematic chrome — deferred so hero can win LCP. */
export function HomeChrome() {
  return (
    <DeferredMount delayMs={600} skipOnMobile>
      <JourneyAtmosphere />
      <CinematicCursor />
      <JourneyProgress />
    </DeferredMount>
  );
}
