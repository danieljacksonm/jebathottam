import type { Metadata } from "next";
import { AdminChrome } from "@/components/admin/AdminChrome";
import "./admin.css";

export const metadata: Metadata = {
  title: "Canaan Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="admin-body">
        <AdminChrome>{children}</AdminChrome>
      </body>
    </html>
  );
}
