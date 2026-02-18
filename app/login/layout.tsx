// Force the login route to be dynamic so we don't serve a cached build
// after deploy (avoids "Failed to find Server Action" errors).
export const dynamic = 'force-dynamic';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
