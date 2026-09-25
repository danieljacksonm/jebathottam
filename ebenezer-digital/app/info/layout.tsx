import type { Metadata } from "next";
import type { ReactNode } from "react";
import { InfoShell } from "@/components/info/InfoShell";
import { HostWebSiteJsonLd } from "@/components/HostWebSiteJsonLd";
import { pageMetadata } from "@/lib/site-url";
import "./info.css";

export const metadata: Metadata = pageMetadata({
  title: "Ebenezer Digital Information | News & Journal",
  description:
    "Discover news, stories and useful ideas for the digital world — explained simply for everyone.",
  path: "/info",
});

export default function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HostWebSiteJsonLd kind="info" />
      <InfoShell>{children}</InfoShell>
    </>
  );
}
