import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Account",
  description: "Raju Stickers customer account area.",
  path: "/account",
  noIndex: true,
});

export default function AccountPage() {
  return (
    <div className="container-x py-12 max-w-xl">
      <h1 className="section-title mb-4">Account</h1>
      <div className="card-surface p-6 space-y-3 text-[var(--text-muted)]">
        <p>
          Customer accounts are not connected yet. You can still shop, checkout, and track orders via email confirmation once
          payments are enabled.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
