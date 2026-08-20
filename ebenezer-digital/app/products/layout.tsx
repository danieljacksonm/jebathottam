import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StoreProvider } from "./components/StoreProvider";
import { StoreI18nProvider } from "./i18n";
import { EbenDock } from "@/components/EbenDock";
import { pageMetadata } from "@/lib/site-url";
import "./store.css";

export const metadata: Metadata = pageMetadata({
  title: "Ebenezer Store | Ready-to-Use Digital Products",
  description:
    "Website templates with real source code, invoice tools, and billing software. Build, create, automate, grow. PDFs are docs only — not the product.",
  path: "/products",
});

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <StoreI18nProvider>
      <StoreProvider>
        {children}
        <EbenDock />
      </StoreProvider>
    </StoreI18nProvider>
  );
}
