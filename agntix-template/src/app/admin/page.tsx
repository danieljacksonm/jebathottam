import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  if (!isAdminConfigured()) {
    return (
      <div className="admin-card">
        <h1>Admin not configured</h1>
        <p className="admin-muted">
          Set <code>ADMIN_PASSWORD</code> in the server environment, then visit{" "}
          <Link href="/admin/login">/admin/login</Link>.
        </p>
      </div>
    );
  }

  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const [
    newEnquiries,
    todayEnquiries,
    followUps,
    quotes,
    invoices,
    outstanding,
    blogs,
    destinations,
    packages,
    scheduled,
    recentEnquiries,
    recentInvoices,
  ] = await Promise.all([
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.count({ where: { createdAt: { gte: start } } }),
    prisma.enquiry.count({ where: { status: "FOLLOW_UP" } }),
    prisma.quote.count(),
    prisma.invoice.count(),
    prisma.invoice.count({
      where: { status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] } },
    }),
    prisma.blogPost.count({ where: { status: "published" } }),
    prisma.destination.count(),
    prisma.travelPackage.count(),
    prisma.socialPost.count({ where: { status: "SCHEDULED" } }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const cards = [
    ["New enquiries", newEnquiries, "/admin/enquiries"],
    ["Today", todayEnquiries, "/admin/enquiries"],
    ["Follow-ups", followUps, "/admin/enquiries"],
    ["Quotes", quotes, "/admin/quotes"],
    ["Invoices", invoices, "/admin/invoices"],
    ["Open balances", outstanding, "/admin/invoices"],
    ["Published blogs", blogs, "/admin/blogs"],
    ["Destinations", destinations, "/admin/destinations"],
    ["Packages", packages, "/admin/packages"],
    ["Scheduled posts", scheduled, "/admin/social"],
  ] as const;

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="admin-muted">
        Enquiries, quotes, invoices, content, and social drafts in one place.
      </p>
      <div className="admin-stats">
        {cards.map(([label, value, href]) => (
          <Link key={label} href={href} className="admin-stat">
            <strong>{value}</strong>
            <span className="admin-muted">{label}</span>
          </Link>
        ))}
      </div>
      <div className="admin-grid-2">
        <section className="admin-card">
          <h2>Recent enquiries</h2>
          <ul className="admin-muted">
            {recentEnquiries.length === 0 ? <li>No enquiries yet.</li> : null}
            {recentEnquiries.map((item) => (
              <li key={item.id}>
                <Link href={`/admin/enquiries/${item.id}`}>
                  {item.referenceNumber}
                </Link>{" "}
                — {item.customerName} · {item.status}
              </li>
            ))}
          </ul>
        </section>
        <section className="admin-card">
          <h2>Recent invoices</h2>
          <ul className="admin-muted">
            {recentInvoices.length === 0 ? <li>No invoices yet.</li> : null}
            {recentInvoices.map((item) => (
              <li key={item.id}>
                <Link href={`/admin/invoices/${item.id}`}>{item.number}</Link> —{" "}
                {item.customerName} · {item.status}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
