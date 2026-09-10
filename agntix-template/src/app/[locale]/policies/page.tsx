import {
  PolicyDocumentPage,
  policyMetadata,
} from "@/components/PolicyDocumentPage";
import { policiesDoc } from "@/data/policies";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return policyMetadata(
    locale,
    policiesDoc.path,
    "Policies & Regulations | Canaan Travel Hub",
    "Booking, payment, cancellation, accommodation, flights, packages, visas and customer responsibilities for Canaan Travel Hub.",
  );
}

export default async function PoliciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <PolicyDocumentPage locale={locale} doc={policiesDoc} />
  );
}
