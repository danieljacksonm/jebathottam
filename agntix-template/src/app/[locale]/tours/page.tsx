import { ServicePageView } from "@/components/ServicePageView";

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ServicePageView locale={locale} namespace="toursPage" enquireKey="tours" />;
}
