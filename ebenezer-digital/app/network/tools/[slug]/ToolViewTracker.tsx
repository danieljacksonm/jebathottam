"use client";

import { useEffect } from "react";
import { trackNetworkEvent } from "@/lib/network/analytics";

export function ToolViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackNetworkEvent("tool_view", { slug });
  }, [slug]);
  return null;
}
