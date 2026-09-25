import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const posts = await prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      titleEn: true,
      status: true,
      date: true,
      readMinutes: true,
      destination: { select: { nameEn: true } },
    },
    take: 200,
  });

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Blog posts</h1>
          <p className="admin-muted" style={{ margin: "0.35rem 0 0" }}>
            Draft / publish / edit SEO fields
          </p>
        </div>
        <Link className="admin-btn" href="/admin/blogs/new">
          New article
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Date</th>
            <th>Destination</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                <strong>{post.titleEn}</strong>
                <div className="admin-muted">{post.slug}</div>
              </td>
              <td>
                <span className={`admin-badge ${post.status}`}>
                  {post.status}
                </span>
              </td>
              <td>{post.date}</td>
              <td>{post.destination?.nameEn ?? "—"}</td>
              <td>
                <Link href={`/admin/blogs/${post.id}`}>Edit</Link>
                {" · "}
                <Link href={`/en/blog/${post.slug}`} target="_blank">
                  Preview
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
