import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import KodaikanalPage from "../../kodaikanal/page";

export function generateStaticParams() {
  return [{ slug: "kodaikanal" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (slug !== "kodaikanal") notFound();
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/kodaikanal",
    title: t("kodaiTitle"),
    description: t("kodaiDescription"),
    image:
      "/images/kodai/hero.webp",
    imageAlt: "Kodaikanal mist and pine-covered hills",
  });
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolved = await params;
  if (resolved.slug !== "kodaikanal") notFound();
  return KodaikanalPage({ params: Promise.resolve({ locale: resolved.locale }) });
}
