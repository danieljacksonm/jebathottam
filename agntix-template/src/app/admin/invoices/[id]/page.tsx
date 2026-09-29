import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { invoiceTotals } from "@/lib/crm";
import { formatMoney } from "@/lib/money";
import { InvoiceEditor } from "@/components/admin/InvoiceEditor";

export const dynamic = "force-dynamic";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const totals = await invoiceTotals(id);
  if (!totals) notFound();
  const invoice = totals.invoice;
  return (
    <div>
      <p className="admin-muted">
        <Link href="/admin/invoices">Invoices</Link> · {invoice.number}
      </p>
      <h1>{invoice.number}</h1>
      {invoice.customerId ? (
        <p>
          <Link href={`/admin/customers/${invoice.customerId}`}>Customer history</Link>
        </p>
      ) : null}
      <InvoiceEditor
        id={invoice.id}
        paidMinor={totals.paidMinor}
        balanceMinor={totals.balanceMinor}
        initial={{
          customerName: invoice.customerName,
          email: invoice.email,
          phone: invoice.phone,
          customerAddress: invoice.customerAddress,
          destination: invoice.destination,
          reference: invoice.reference,
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
          travelStart: invoice.travelStart,
          travelEnd: invoice.travelEnd,
          currency: invoice.currency,
          discountMinor: invoice.discountMinor,
          companyGst: invoice.companyGst,
          paymentTerms: invoice.paymentTerms,
          cancellationNotes: invoice.cancellationNotes,
          notes: invoice.notes,
          status: invoice.status,
          items: invoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitMinor: item.unitMinor,
            discountMinor: item.discountMinor,
            taxMinor: item.taxMinor,
          })),
        }}
      />
      <section className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>Payments</h2>
        {invoice.payments.length === 0 ? <p className="admin-muted">No payments recorded.</p> : null}
        <ul>
          {invoice.payments.map((payment) => (
            <li key={payment.id}>
              {payment.paidOn} · {formatMoney(payment.amountMinor, invoice.currency)} ·{" "}
              {payment.method || "method not set"} · {payment.reference}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
