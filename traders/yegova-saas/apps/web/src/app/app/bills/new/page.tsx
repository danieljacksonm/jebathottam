'use client';

import { Suspense } from 'react';
import NewBillInner from './NewBillInner';

export default function NewBillPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-[var(--muted)]">Loading studio…</div>
      }
    >
      <NewBillInner />
    </Suspense>
  );
}
