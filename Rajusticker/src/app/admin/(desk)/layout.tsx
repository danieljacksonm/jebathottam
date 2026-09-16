import { redirect } from "next/navigation";
import { isStaff } from "@/lib/admin-auth";
import { DeskShell } from "@/components/desk/DeskShell";

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  if (!(await isStaff())) redirect("/admin/login");
  return <DeskShell>{children}</DeskShell>;
}
