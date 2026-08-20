import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";
import { QrMenuClient } from "./QrMenuClient";

export const metadata: Metadata = pageMetadata({
  title: "QR Menu Generator | Ebenezer Store",
  description: "Build a restaurant digital menu, print it, and create a QR code for tables. Free. No install.",
  path: "/tools/qr-menu-generator",
});

export default function QrMenuGeneratorPage() {
  return <QrMenuClient />;
}
