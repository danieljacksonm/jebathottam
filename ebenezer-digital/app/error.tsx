"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary:", error.digest || error.message);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#070708] px-6 py-24 text-center text-white">
      <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/80">Something went wrong</p>
      <h1 className="mt-4 max-w-xl text-3xl font-semibold sm:text-4xl">Please try again</h1>
      <p className="mt-4 max-w-md text-sm text-white/55">
        We hit an unexpected error. Your data is safe — refresh or head home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="border border-emerald-500/50 px-5 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/10"
        >
          Try again
        </button>
        <Link href="/" className="border border-white/20 px-5 py-2.5 text-sm text-white/80 hover:border-white/40">
          Home
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-8 text-xs text-white/30">Reference: {error.digest}</p>
      ) : null}
    </main>
  );
}
