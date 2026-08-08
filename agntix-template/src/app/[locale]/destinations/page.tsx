import { redirect } from "@/i18n/navigation";

/** Tourism packages are Kodaikanal-only — send users to the Kodai hub. */
export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/kodaikanal", locale });
}
