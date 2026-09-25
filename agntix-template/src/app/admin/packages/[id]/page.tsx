import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { PackageEditor } from "@/components/admin/PackageEditor";

export default async function AdminEditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const [pkg, destinations] = await Promise.all([
    prisma.travelPackage.findUnique({ where: { id } }),
    prisma.destination.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
      select: { id: true, slug: true, nameEn: true },
    }),
  ]);
  if (!pkg) notFound();
  return (
    <PackageEditor mode="edit" destinations={destinations} initial={pkg} />
  );
}
