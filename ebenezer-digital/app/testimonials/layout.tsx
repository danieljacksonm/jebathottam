import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Testimonials | Ebenezer Digital Services",
  description: "What clients say about working with Ebenezer Digital on websites, data work, and support.",
  path: "/testimonials",
});

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
