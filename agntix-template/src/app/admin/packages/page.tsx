import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPackagesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const packages = await prisma.travelPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
  });

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Packages</h1>
          <p className="admin-muted">{packages.length} packages</p>
        </div>
        <Link className="admin-btn" href="/admin/packages/new">
          New package
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Package</th>
            <th>Pricing</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => {
            let title = pkg.slug;
            try {
              title = JSON.parse(pkg.titleJson)?.en || pkg.slug;
            } catch {
              /* ignore */
            }
            return (
              <tr key={pkg.id}>
                <td>
                  <strong>{title}</strong>
                  <div className="admin-muted">
                    {pkg.slug} · {pkg.destinationSlug} · {pkg.days}D/{pkg.nights}N
                  </div>
                </td>
                <td>
                  {pkg.pricingMode === "confirmed"
                    ? `₹${pkg.priceFrom}`
                    : "Enquiry"}
                </td>
                <td>
                  <span
                    className={`admin-badge ${pkg.published ? "published" : "draft"}`}
                  >
                    {pkg.published ? "published" : "unpublished"}
                  </span>
                </td>
                <td>
                  <Link href={`/admin/packages/${pkg.id}`}>Edit</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
