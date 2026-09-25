import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDestinationsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const destinations = await prisma.destination.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    select: {
      id: true,
      slug: true,
      nameEn: true,
      country: true,
      status: true,
      featured: true,
      image: true,
      _count: { select: { packages: true, blogs: true } },
    },
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
          <h1 style={{ margin: 0 }}>Destinations</h1>
          <p className="admin-muted">{destinations.length} destinations</p>
        </div>
        <Link className="admin-btn" href="/admin/destinations/new">
          New destination
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Packages</th>
            <th>Blogs</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {destinations.map((d) => (
            <tr key={d.id}>
              <td>
                <strong>{d.nameEn}</strong>
                <div className="admin-muted">
                  {d.slug} · {d.country}
                  {d.featured ? " · featured" : ""}
                </div>
              </td>
              <td>
                <span className={`admin-badge ${d.status === "published" ? "published" : "draft"}`}>
                  {d.status}
                </span>
              </td>
              <td>{d._count.packages}</td>
              <td>{d._count.blogs}</td>
              <td>
                <Link href={`/admin/destinations/${d.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
