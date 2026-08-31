import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { SiteContactLinks } from "@/components/SiteContactLinks";
import { SITE_EMAIL } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Privacy Policy | Ebenezer Digital Services",
  description: "How Ebenezer Digital Services collects, uses, and protects your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <StudioPageShell kicker="Legal" title="Privacy Policy">
      <p>
        We respect your privacy. Information submitted through our contact forms is used only to respond to your
        inquiry and improve our services.
      </p>
      <p>
        We do not sell your personal data. You may request deletion of your contact information by emailing{" "}
        <a href={`mailto:${SITE_EMAIL}`} className="text-emerald-400 hover:underline">
          {SITE_EMAIL}
        </a>
        , or by phone / WhatsApp.
      </p>
      <SiteContactLinks className="text-sm text-white/60" linkClassName="hover:text-white" />
      <p className="text-sm text-white/40">Last updated: July 2026</p>
    </StudioPageShell>
  );
}
