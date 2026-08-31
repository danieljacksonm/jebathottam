import Link from "next/link";
import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Website Showcase | Ebenezer Digital Services",
  description: "Example website layouts and page types we build for consulting, services, and small businesses.",
  path: "/website-showcase",
});

export default function WebsiteShowcasePage() {
  return (
    <StudioPageShell
      kicker="Portfolio"
      title="Website showcase"
      lead="Examples of the layouts, page types, and structures we build for clients."
    >
      <p>
        Our live portfolio lives on the Work page — real projects with outcomes, tech stack, and delivery context.
      </p>
      <Link href="/work" className="studio-btn inline-flex">
        View our work →
      </Link>
    </StudioPageShell>
  );
}
