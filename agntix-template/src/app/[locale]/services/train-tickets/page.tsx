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
    path: "/services/train-tickets",
    title: t("trainsTitle"),
    description: t("trainsDescription"),
    image: SERVICE_IMAGES_REGISTRY.trains.src,
    imageAlt: SERVICE_IMAGES_REGISTRY.trains.alt,
  });
}

export default async function TrainTicketsPage({
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
      namespace="trainsPage"
      enquireKey="trains"
      crumb={nav("trains")}
    />
  );
}
