import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { BlogEditor } from "@/components/admin/BlogEditor";

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const [post, destinations] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.destination.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
      select: { id: true, slug: true, nameEn: true },
    }),
  ]);
  if (!post) notFound();

  return (
    <BlogEditor
      mode="edit"
      destinations={destinations}
      initial={post}
    />
  );
}
