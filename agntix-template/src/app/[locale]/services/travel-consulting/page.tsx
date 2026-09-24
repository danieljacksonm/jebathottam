import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicePageView } from "@/components/ServicePageView";
import { pageMetadata } from "@/lib/seo";
import { SERVICE_IMAGES_REGISTRY } from "@/data/image-registry";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/services/travel-consulting",
    title: t("consultingTitle"),
    description: t("consultingDescription"),
    image: SERVICE_IMAGES_REGISTRY.consulting.src,
    imageAlt: SERVICE_IMAGES_REGISTRY.consulting.alt,
  });
}

export default async function TravelConsultingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  return (
    <ServicePageView
      locale={locale}
      namespace="consultingPage"
      enquireKey="consulting"
      crumb={nav("consulting")}
    />
  );
}
