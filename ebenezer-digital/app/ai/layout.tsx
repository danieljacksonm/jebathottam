import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./ai.css";

export const metadata: Metadata = {
  title: "Ebenezer AI | Chat",
  description:
    "Talk with Ebenezer AI — open-source assistant hosted by Ebenezer Digital. Writing help, ideas, and digital work support.",
  openGraph: {
    title: "Ebenezer AI",
    description: "Open-source AI chat by Ebenezer Digital.",
    type: "website",
  },
};

export default function AiLayout({ children }: { children: ReactNode }) {
  return <div className="ai-shell">{children}</div>;
}
