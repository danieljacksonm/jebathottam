import { ServicePageView } from "@/components/ServicePageView";

export default async function HotelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <ServicePageView locale={locale} namespace="hotelsPage" enquireKey="hotels" />
  );
}
