import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { legalBody, legalTitle, type LegalPage } from "@/lib/legal-content";
import { pageMetadata, siteKindFromHost, type SiteKind } from "@/lib/site-url";

const PAGES = new Set<string>(["privacy", "terms", "affiliate-disclosure"]);

function internalPath(kind: SiteKind, page: string): string {
  if (kind === "info") return `/info/${page}`;
  if (kind === "journal") return `/blog/${page}`;
  if (kind === "news") return `/blog/news/${page}`;
  if (kind === "store") return `/products/${page}`;
  if (kind === "products") return `/catalog/${page}`;
  if (kind === "tools") return `/tools/${page}`;
  if (kind === "ai") return `/ai/${page}`;
  if (kind === "saas") return `/saas/${page}`;
  if (kind === "discover") return `/discover/${page}`;
  if (kind === "network") return `/network/${page}`;
  return `/${page}`;
}

export async function generateMetadata({
  params,
}: {
  params: { page: string };
}): Promise<Metadata> {
  if (!PAGES.has(params.page)) return {};
  const kind = siteKindFromHost(headers().get("host"));
  const page = params.page as LegalPage;
  return pageMetadata({
    title: legalTitle(kind, page),
    description: legalBody(kind, page)[0],
    path: internalPath(kind, params.page),
  });
}

export default function SiteLegalPage({ params }: { params: { page: string } }) {
  if (!PAGES.has(params.page)) notFound();
  const kind = siteKindFromHost(headers().get("host"));
  const page = params.page as LegalPage;
  const title = page === "privacy" ? "Privacy Policy" : page === "terms" ? "Terms of Use" : "Affiliate Disclosure";

  return (
    <StudioPageShell kicker="Legal" title={title} backHref="/" backLabel="Back to home">
      {legalBody(kind, page).map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </StudioPageShell>
  );
}
