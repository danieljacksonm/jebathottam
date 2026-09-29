import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const query = await searchParams;
  const q = query.q?.trim() || "";
  const status = query.status?.trim() || "";
  const rows = await prisma.enquiry.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { referenceNumber: { contains: q } },
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

  return (
    <div className="admin-card">
      <h1>Enquiries</h1>
      <form className="admin-toolbar" method="get">
        <input name="q" defaultValue={q} placeholder="Search name, phone, reference" />
        <select name="status" defaultValue={status}>
          <option value="">All statuses</option>
          {[
            "NEW",
            "CONTACTED",
            "QUALIFIED",
            "QUOTE_SENT",
            "FOLLOW_UP",
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
            "LOST",
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button className="admin-btn" type="submit">
          Filter
        </button>
      </form>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Customer</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Link href={`/admin/enquiries/${row.id}`}>{row.referenceNumber}</Link>
              </td>
              <td>
                {row.customerName}
                <div className="admin-muted">{row.phone}</div>
              </td>
              <td>{row.destination || "—"}</td>
              <td>{row.status}</td>
              <td>{row.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? <p className="admin-muted">No matching enquiries.</p> : null}
    </div>
  );
}
