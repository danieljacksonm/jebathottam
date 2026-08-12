import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Ebenezer Journal | Ideas & World News",
  description:
    "Ebenezer Journal and E> World News on .info — editorial stories plus global news desks covering world, Asia, Europe, Americas, Africa, India, tech, and climate.",
  openGraph: {
    title: "Ebenezer Journal & World News",
    description: "A cinematic journal and world newsroom from Ebenezer Digital.",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
