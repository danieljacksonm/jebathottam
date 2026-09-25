import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { DestinationEditor } from "@/components/admin/DestinationEditor";

export default async function AdminNewDestinationPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return <DestinationEditor mode="create" initial={null} />;
}
