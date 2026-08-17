import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "My products | Ebenezer Store",
  description: "Downloads and kits you claimed from Ebenezer Store.",
  path: "/products/account",
  index: false,
});

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
