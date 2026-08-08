import { ServicePageView } from "@/components/ServicePageView";

export default async function FlightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <ServicePageView locale={locale} namespace="flightsPage" enquireKey="flights" />
  );
}
