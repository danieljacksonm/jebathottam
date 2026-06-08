import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar user={payload} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader user={payload} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
