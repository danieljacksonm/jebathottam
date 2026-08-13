import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StoreProvider } from "./components/StoreProvider";
import { StoreI18nProvider } from "./i18n";
import { EbenDock } from "@/components/EbenDock";
import "./store.css";

export const metadata: Metadata = {
  title: "Ebenezer Store | Premium Digital Products",
  description:
    "Digital products designed to move ideas forward — templates, UI kits, ebooks, and creator tools from Ebenezer Digital.",
  openGraph: {
    title: "Ebenezer Store",
    description: "A premium digital product marketplace by Ebenezer Digital.",
    type: "website",
  },
};

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
