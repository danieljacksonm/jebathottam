export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pass-through only. Login must NOT share the dashboard chrome/auth layout.
  return <>{children}</>;
}
