import { redirect } from "next/navigation";

/** Old dashboard URL → real products list */
export default function AdminDashboardRedirect() {
  redirect("/admin/products");
}
