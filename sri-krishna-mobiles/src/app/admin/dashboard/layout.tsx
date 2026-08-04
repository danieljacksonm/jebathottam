"use client";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto max-w-3xl">{children}</div>;
}
