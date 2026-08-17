import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Completed Projects | Ebenezer Digital Services",
  description: "Finished websites and digital work delivered by Ebenezer Digital.",
  path: "/completed-projects",
});

export default function CompletedProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
