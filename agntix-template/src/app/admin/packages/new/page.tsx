import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { PackageEditor } from "@/components/admin/PackageEditor";

export default async function AdminNewPackagePage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const destinations = await prisma.destination.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    select: { id: true, slug: true, nameEn: true },
  });
  return (
    <PackageEditor mode="create" destinations={destinations} initial={null} />
  );
}
