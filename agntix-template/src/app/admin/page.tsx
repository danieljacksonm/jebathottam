import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

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

  const [blogCount, published, drafts, destinations, packages, featuredGuides] =
    await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: "published" } }),
      prisma.blogPost.count({ where: { status: "draft" } }),
      prisma.destination.count(),
      prisma.travelPackage.count(),
      prisma.blogPost.count({ where: { featured: true, status: "published" } }),
    ]);

  return (
    <div className="admin-card">
      <h1>Dashboard</h1>
      <p className="admin-muted">
        Manage destinations, packages, guides, and media without editing source
        files.
      </p>
      <ul className="admin-muted" style={{ lineHeight: 1.8 }}>
        <li>Destinations: {destinations}</li>
        <li>Packages: {packages}</li>
        <li>
          Blog posts: {blogCount} ({published} published · {drafts} drafts ·{" "}
          {featuredGuides} featured guides)
        </li>
      </ul>
      <div className="admin-actions">
        <Link className="admin-btn" href="/admin/destinations">
          Destinations
        </Link>
        <Link className="admin-btn" href="/admin/packages">
          Packages
        </Link>
        <Link className="admin-btn" href="/admin/blogs">
          Blogs
        </Link>
        <Link className="admin-btn secondary" href="/admin/media">
          Media
        </Link>
        <Link className="admin-btn secondary" href="/admin/blogs/new">
          New article
        </Link>
      </div>
    </div>
  );
}
