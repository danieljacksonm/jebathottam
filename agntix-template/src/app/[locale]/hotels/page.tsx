import { getTranslations } from "next-intl/server";
import { ServicePageView } from "@/components/ServicePageView";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/hotels",
    title: t("hotelsTitle"),
    description: t("hotelsDescription"),
  });
}

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations("nav");
  return (
    <ServicePageView
      locale={locale}
      namespace="hotelsPage"
      enquireKey="hotels"
      crumb={nav("hotels")}
    />
  );
}
