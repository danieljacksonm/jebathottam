import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { SiteContactLinks } from "@/components/SiteContactLinks";
import { SITE_EMAIL } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Careers | Ebenezer Digital Services",
  description:
    "Join Ebenezer Digital. We look for people who care about quality, clear communication, data work, web development, and travel support.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <StudioPageShell
      kicker="Careers"
      title="Join our team"
      lead="We look for people who care about quality and clear communication — in data work, web development, and travel support."
    >
      <p>
        We hire selectively. If you excel at reliable delivery and professional client communication, send your
        portfolio and availability.
      </p>
      <a href={`mailto:${SITE_EMAIL}?subject=Careers%20at%20Ebenezer%20Digital`} className="studio-btn inline-flex">
        Email us about roles
      </a>
      <SiteContactLinks className="text-sm text-white/60" linkClassName="hover:text-white" />
    </StudioPageShell>
  );
}
