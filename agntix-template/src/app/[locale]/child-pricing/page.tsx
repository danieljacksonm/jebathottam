import {
  PolicyDocumentPage,
  policyMetadata,
} from "@/components/PolicyDocumentPage";
import { childPricingDoc } from "@/data/policies";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return policyMetadata(
    locale,
    childPricingDoc.path,
    "Child & Infant Pricing Policy | Canaan Travel Hub",
    "How Canaan Travel Hub applies child and infant pricing for flights, hotels and tour packages, subject to supplier rules.",
  );
}

export default async function ChildPricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <PolicyDocumentPage locale={locale} doc={childPricingDoc} />
  );
}
