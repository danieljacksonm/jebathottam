import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NetworkShell } from "@/components/network/NetworkShell";
import { NETWORK_URL } from "@/lib/site-url";
import "./network.css";

export const metadata: Metadata = {
  title: {
    default: "Ebenezer Digital Network — Free tools for the digital world",
    template: "%s | Ebenezer Digital Network",
  },
  description:
    "Powerful free online tools for developers, creators, businesses and everyday digital work.",
  metadataBase: new URL(NETWORK_URL),
  openGraph: {
    title: "Ebenezer Digital Network",
    description: "Free tools. Smart technology. Better digital work.",
    url: NETWORK_URL,
    siteName: "Ebenezer Digital Network",
    type: "website",
  },
  alternates: { canonical: NETWORK_URL },
};

export default function NetworkLayout({ children }: { children: ReactNode }) {
  return <NetworkShell>{children}</NetworkShell>;
}
