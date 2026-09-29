import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { invoiceTotals } from "@/lib/crm";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const query = await searchParams;
  const q = query.q?.trim() || "";
  const status = query.status?.trim() || "";
  const rows = await prisma.invoice.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { number: { contains: q } },
              { customerName: { contains: q } },
              { email: { contains: q } },
              { phone: { contains: q } },
              { destination: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const totals = await Promise.all(rows.map((row) => invoiceTotals(row.id)));

  return (
    <div className="admin-card">
      <h1>Invoices</h1>
      <form className="admin-actions" method="get">
        <input name="q" defaultValue={q} placeholder="Number, customer, phone, destination" />
        <select name="status" defaultValue={status}>
          <option value="">All</option>
          {["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button className="admin-btn">Filter</button>
        <Link className="admin-btn secondary" href="/admin/invoices/new">
          New invoice
        </Link>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>
                <Link href={`/admin/invoices/${row.id}`}>{row.number}</Link>
              </td>
              <td>
                {row.customerName}
                <div className="admin-muted">{row.destination}</div>
              </td>
              <td>{totals[index]?.invoice.status || row.status}</td>
              <td>
                {formatMoney(totals[index]?.balanceMinor || 0, row.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
