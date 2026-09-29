import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const rows = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { invoice: true },
  });
  return (
    <div className="admin-card">
      <h1>Quotes</h1>
      <p>
        <Link className="admin-btn" href="/admin/quotes/new">
          New quote
        </Link>
      </p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Customer</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Link href={`/admin/quotes/${row.id}`}>{row.number}</Link>
              </td>
              <td>{row.customerName}</td>
              <td>{row.destination || "—"}</td>
              <td>{row.status}</td>
              <td>
                {row.invoice ? (
                  <Link href={`/admin/invoices/${row.invoice.id}`}>{row.invoice.number}</Link>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
