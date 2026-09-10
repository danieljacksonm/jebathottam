import {
  PolicyDocumentPage,
  policyMetadata,
} from "@/components/PolicyDocumentPage";
import { cancellationDoc } from "@/data/policies";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return policyMetadata(
    locale,
    cancellationDoc.path,
    "Cancellation & Refund Policy | Canaan Travel Hub",
    "Clear cancellation and refund terms for Canaan Travel Hub bookings, including supplier rules, no-shows and refund processing.",
  );
}

export default async function CancellationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <PolicyDocumentPage locale={locale} doc={cancellationDoc} />
  );
}
