import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const [shortGuides, draftBlogs, unpublishedPackages, openEnquiries] =
    await Promise.all([
      prisma.blogPost.count({
        where: { featured: true, status: "published", readMinutes: { lt: 8 } },
      }),
      prisma.blogPost.count({ where: { status: "draft" } }),
      prisma.travelPackage.count({ where: { published: false } }),
      prisma.enquiry.count({
        where: { status: { in: ["NEW", "FOLLOW_UP", "QUOTE_SENT"] } },
      }),
    ]);

  return (
    <div className="admin-card">
      <h1>Quality report</h1>
      <ul>
        <li>Featured guides under 8 minutes: {shortGuides}</li>
        <li>Draft blogs: {draftBlogs}</li>
        <li>Unpublished packages: {unpublishedPackages}</li>
        <li>Open enquiries (new, follow-up, quote sent): {openEnquiries}</li>
      </ul>
      <p className="admin-muted">
        Image duplicates and broken files are checked with `npm run images:audit`. This page does not invent missing image scores.
      </p>
    </div>
  );
}
