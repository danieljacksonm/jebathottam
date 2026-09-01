import type { Metadata } from "next";

import type { ReactNode } from "react";

import { pageMetadata } from "@/lib/site-url";

import { BlogShell } from "./BlogShell";



const base = pageMetadata({

  title: "Ebenezer Journal | Deep guides and digital insight",

  description:

    "Deep guides, technology analysis, and practical tutorials from Ebenezer Digital — written for professionals.",

  path: "/blog",

});



export const metadata: Metadata = {

  ...base,

  other: {

    google: "notranslate",

  },

  openGraph: {

    ...base.openGraph,

    title: "Ebenezer Journal",

    description: "Deep guides and digital insight for professionals.",

  },

  alternates: {

    ...base.alternates,

    types: {

      "application/rss+xml": [{ url: "/api/blog/rss", title: "Ebenezer Journal RSS" }],

    },

  },

};



export default function BlogLayout({ children }: { children: ReactNode }) {

  return <BlogShell>{children}</BlogShell>;

}

