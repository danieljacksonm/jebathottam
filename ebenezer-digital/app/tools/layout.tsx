import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/site-url";
import "../affiliate/premium.css";

const base = pageMetadata({
  title: "Ebenezer Tools — Find the right tool for the job",
  description:
    "Discover, compare and choose AI tools, SaaS and software — with honest pros, cons, pricing notes and a clear review methodology.",
  path: "/tools",
});

export const metadata: Metadata = {
  ...base,
  title: {
    default: "Ebenezer Tools — Find the right tool for the job",
    template: "%s | Ebenezer Tools",
  },
};

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <div className="aff-root tools-pro">{children}</div>;
}
