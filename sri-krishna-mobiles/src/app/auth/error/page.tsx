'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'unknown';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md space-y-6 p-8 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] text-center">
        <h1 className="text-2xl font-bold">Authentication error</h1>
        <p className="text-sm text-[var(--foreground-muted)]">Error code: {error}</p>
        <Link href="/auth/login" className="inline-flex w-full items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-white font-medium hover:opacity-90">
          Try again
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
