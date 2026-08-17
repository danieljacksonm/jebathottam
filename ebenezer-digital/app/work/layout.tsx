import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Our Work | Ebenezer Digital Services",
  description:
    "Selected projects and website work from Ebenezer Digital — practical design and development for real businesses.",
  path: "/work",
});

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
