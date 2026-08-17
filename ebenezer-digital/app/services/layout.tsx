import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Services | Web, Data Entry, Travel & VA",
  description:
    "Web development, data entry, travel booking support, and virtual assistance from Ebenezer Digital. Clear quotes, on-time delivery.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
