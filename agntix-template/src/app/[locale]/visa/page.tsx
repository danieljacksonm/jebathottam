import { ServicePageView } from "@/components/ServicePageView";

export default async function VisaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ServicePageView locale={locale} namespace="visaPage" enquireKey="visa" />;
}
