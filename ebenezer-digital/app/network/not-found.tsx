import Link from "next/link";

export default function NetworkNotFound() {
  return (
    <div className="nx-page py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight">That page doesn&apos;t exist — but we probably have a tool for it.</h1>
      <p className="mt-3 text-[var(--nx-muted)]">Try the homepage, tool directory, or search.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/network" className="nx-btn nx-btn-primary">
          Home
        </Link>
        <Link href="/network/tools" className="nx-btn nx-btn-ghost">
          Explore Tools
        </Link>
        <Link href="/network/finder" className="nx-btn nx-btn-ghost">
          Search / Finder
        </Link>
      </div>
    </div>
  );
}
