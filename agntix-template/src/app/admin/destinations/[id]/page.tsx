import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { DestinationEditor } from "@/components/admin/DestinationEditor";

export default async function AdminEditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const destination = await prisma.destination.findUnique({ where: { id } });
  if (!destination) notFound();
  return <DestinationEditor mode="edit" initial={destination} />;
}
