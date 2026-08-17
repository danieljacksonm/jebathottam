import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Checkout | Ebenezer Store",
  description: "Complete your Ebenezer Store order.",
  path: "/products/checkout",
  index: false,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
