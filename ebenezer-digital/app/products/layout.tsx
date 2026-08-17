import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StoreProvider } from "./components/StoreProvider";
import { StoreI18nProvider } from "./i18n";
import { EbenDock } from "@/components/EbenDock";
import { pageMetadata } from "@/lib/site-url";
import "./store.css";

export const metadata: Metadata = pageMetadata({
  title: "Ebenezer Store | Premium Digital Products",
  description:
    "Worldwide digital kits and software — templates, UI kits, ebooks, and creator tools. Instant download. Prices in USD.",
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
