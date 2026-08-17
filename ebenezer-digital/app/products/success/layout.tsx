import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Order complete | Ebenezer Store",
  description: "Your Ebenezer Store download is ready.",
  path: "/products/success",
  index: false,
});

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
