import { setRequestLocale, getTranslations } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { LegalPageContent } from "@/components/LegalPageContent";
import { pageMetadata } from "@/lib/seo";
import { REAL_KODAI } from "@/lib/media";
import type { PolicyDoc } from "@/data/policies";

type Props = {
  locale: string;
  doc: PolicyDoc;
};

export async function PolicyDocumentPage({ locale, doc }: Props) {
  setRequestLocale(locale);
  const nav = await getTranslations("nav");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={doc.eyebrow}
        title={doc.title}
        subtitle={doc.intro.slice(0, 140) + (doc.intro.length > 140 ? "…" : "")}
        image={REAL_KODAI.seaOfClouds}
        imageAlt="Misty Kodaikanal hills"
        tone="mist"
        compact
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: doc.title },
        ]}
      />
      <LegalPageContent
        title={doc.title}
        updated={`Effective date: ${doc.effectiveDate}`}
        intro={doc.intro}
        sections={doc.sections}
        closing={doc.closing}
      />
    </PageAtmosphere>
  );
}

export function policyMetadata(
  locale: string,
  path: string,
  title: string,
  description: string,
) {
  return pageMetadata({ locale, path, title, description });
}
