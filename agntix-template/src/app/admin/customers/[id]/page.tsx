import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";
import { invoiceTotals } from "@/lib/crm";
import { CustomerNotes } from "@/components/admin/CustomerNotes";

export const dynamic = "force-dynamic";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      enquiries: { orderBy: { createdAt: "desc" } },
      quotes: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" }, include: { payments: true } },
    },
  });
  if (!customer) notFound();
  const totals = await Promise.all(
    customer.invoices.map((invoice) => invoiceTotals(invoice.id)),
  );

  return (
    <div>
      <h1>{customer.name}</h1>
      <p className="admin-muted">
        {customer.email || "No email"} · {customer.phone || "No phone"} ·{" "}
        {customer.country || "Country not set"}
      </p>
      <CustomerNotes id={customer.id} notes={customer.notes} />
      <section className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>Enquiries</h2>
        <ul>
          {customer.enquiries.map((item) => (
            <li key={item.id}>
              <Link href={`/admin/enquiries/${item.id}`}>{item.referenceNumber}</Link> ·{" "}
              {item.destination || "No destination"} · {item.status}
            </li>
          ))}
        </ul>
        <h2>Quotes</h2>
        <ul>
          {customer.quotes.map((item) => (
            <li key={item.id}>
              <Link href={`/admin/quotes/${item.id}`}>{item.number}</Link> · {item.status}
            </li>
          ))}
        </ul>
        <h2>Invoices and payments</h2>
        <ul>
          {customer.invoices.map((item, index) => (
            <li key={item.id}>
              <Link href={`/admin/invoices/${item.id}`}>{item.number}</Link> · {item.status} ·
              balance {formatMoney(totals[index]?.balanceMinor || 0, item.currency)} ·{" "}
              {item.payments.length} payment{item.payments.length === 1 ? "" : "s"}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
