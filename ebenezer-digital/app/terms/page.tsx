import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { SiteContactLinks } from "@/components/SiteContactLinks";
import { SITE_EMAIL } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Terms of Service | Ebenezer Digital Services",
  description: "Terms of service for Ebenezer Digital websites, products, and client work.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <StudioPageShell kicker="Legal" title="Terms of Service">
      <p>
        By using this website and our services, you agree to communicate respectfully and provide accurate
        information in inquiries and project requests.
      </p>
      <p>
        Service timelines and deliverables are agreed in writing before work begins. Payment terms are defined per
        project.
      </p>
      <p>
        Questions about these terms: email{" "}
        <a href={`mailto:${SITE_EMAIL}`} className="text-emerald-400 hover:underline">
          {SITE_EMAIL}
        </a>
        , call, or WhatsApp.
      </p>
      <SiteContactLinks className="text-sm text-white/60" linkClassName="hover:text-white" />
      <p className="text-sm text-white/40">Last updated: July 2026</p>
    </StudioPageShell>
  );
}
