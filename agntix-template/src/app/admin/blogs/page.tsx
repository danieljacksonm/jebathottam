import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const query = await searchParams;
  const q = query.q?.trim() || "";
  const status = query.status?.trim() || "";
  const pageSize = 40;
  const page = Math.max(1, Number(query.page) || 1);
  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [{ titleEn: { contains: q } }, { slug: { contains: q } }],
        }
      : {}),
  };

  const [total, posts] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    skip: (page - 1) * pageSize,
    select: {
      id: true,
      slug: true,
      titleEn: true,
      status: true,
      date: true,
      readMinutes: true,
      destination: { select: { nameEn: true } },
    },
    take: pageSize,
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / pageSize));

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
            Showing {(page - 1) * pageSize + (posts.length ? 1 : 0)}–
            {(page - 1) * pageSize + posts.length} of {total}
          </p>
        </div>
        <Link className="admin-btn" href="/admin/blogs/new">
          New article
        </Link>
      </div>
      <form className="admin-toolbar" method="get">
        <input name="q" defaultValue={q} placeholder="Search title or slug" />
        <select name="status" defaultValue={status}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button className="admin-btn" type="submit">
          Search
        </button>
      </form>
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
      <div className="admin-actions">
        {page > 1 ? (
          <Link
            className="admin-btn secondary"
            href={`/admin/blogs?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page - 1}`}
          >
            Previous
          </Link>
        ) : null}
        {page < pages ? (
          <Link
            className="admin-btn secondary"
            href={`/admin/blogs?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page + 1}`}
          >
            Next
          </Link>
        ) : null}
      </div>
    </div>
  );
}
