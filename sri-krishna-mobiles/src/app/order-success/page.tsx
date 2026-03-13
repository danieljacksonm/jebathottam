import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Thank you for your order</h1>
      <p className="text-[var(--muted)] mb-6">
        Your payment was successful. {orderId && `Order #${orderId}`}
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] text-white px-6 py-3 font-medium hover:bg-[var(--accent-dark)] transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  );
}
