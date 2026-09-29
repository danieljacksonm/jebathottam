import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const q = (await searchParams).q?.trim() || "";
  const rows = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        }
      : {},
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { _count: { select: { enquiries: true, quotes: true, invoices: true } } },
  });
  return (
    <div className="admin-card">
      <h1>Customers</h1>
      <form method="get" className="admin-toolbar">
        <input name="q" defaultValue={q} placeholder="Name, email, phone" />
        <button className="admin-btn">Search</button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Enquiries</th>
            <th>Quotes</th>
            <th>Invoices</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Link href={`/admin/customers/${row.id}`}>{row.name}</Link>
              </td>
              <td>
                {row.email}
                <div className="admin-muted">{row.phone}</div>
              </td>
              <td>{row._count.enquiries}</td>
              <td>{row._count.quotes}</td>
              <td>{row._count.invoices}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
