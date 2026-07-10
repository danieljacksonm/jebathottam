#!/bin/bash
# Run on VPS: bash scripts/vps-restore-homepage.sh
# Restores a working homepage so Ministry can build and start.
set -e
cd "$(dirname "$0")/.."

echo "Removing broken homepage files..."
rm -f app/home-page-client.tsx

echo "Writing simple working homepage..."
cat > app/page.tsx << 'EOF'
export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Digital Ministry Platform
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Spreading faith through technology. Site is online.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/blog"
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Blog
          </Link>
          <Link
            href="/events"
            className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50"
          >
            Events
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-50"
          >
            Admin login
          </Link>
        </div>
      </div>
    </main>
  );
}
EOF

echo "Cleaning .next and building..."
rm -rf .next
npm run build

echo ""
echo "Build OK. Start with:"
echo "  pm2 restart ministry-platform"
echo "  curl -s -o /dev/null -w '3001: %{http_code}\\n' http://127.0.0.1:3001"
