import { redirect } from "next/navigation";
import { isStaff } from "@/lib/admin-auth";
import { BillingDesk } from "@/components/billing/BillingDesk";
import { DeskShell } from "@/components/desk/DeskShell";

export const metadata = {
  title: "Billing",
  robots: { index: false, follow: false },
};

export default async function BillingPage() {
  if (!(await isStaff())) redirect("/admin/login?next=/billing");
  return (
    <DeskShell>
      <BillingDesk />
    </DeskShell>
  );
}
