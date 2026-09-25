import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { BlogEditor } from "@/components/admin/BlogEditor";

export default async function AdminNewBlogPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const destinations = await prisma.destination.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    select: { id: true, slug: true, nameEn: true },
  });
  return (
    <BlogEditor
      mode="create"
      destinations={destinations}
      initial={null}
    />
  );
}
