import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { QuoteEditor } from "@/components/admin/QuoteEditor";

export const dynamic = "force-dynamic";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } }, invoice: true },
  });
  if (!quote) notFound();
  return (
    <div>
      <p className="admin-muted">
        <Link href="/admin/quotes">Quotes</Link> · {quote.number}
      </p>
      <h1>{quote.number}</h1>
      {quote.invoice ? (
        <p>
          Invoice{" "}
          <Link href={`/admin/invoices/${quote.invoice.id}`}>{quote.invoice.number}</Link>
        </p>
      ) : null}
      <QuoteEditor
        id={quote.id}
        initial={{
          customerName: quote.customerName,
          email: quote.email,
          phone: quote.phone,
          destination: quote.destination,
          packageSlug: quote.packageSlug,
          travelStart: quote.travelStart,
          travelEnd: quote.travelEnd,
          travellers: quote.travellers,
          itinerary: quote.itinerary,
          currency: quote.currency,
          discountMinor: quote.discountMinor,
          paymentTerms: quote.paymentTerms,
          cancellationNotes: quote.cancellationNotes,
          validityDate: quote.validityDate,
          notes: quote.notes,
          status: quote.status,
          items: quote.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitMinor: item.unitMinor,
            discountMinor: item.discountMinor,
            taxMinor: item.taxMinor,
          })),
        }}
      />
    </div>
  );
}
