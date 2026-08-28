import Link from "next/link";

export default function NetworkNotFound() {
  return (
    <div className="nx-page py-20 text-center max-w-xl mx-auto">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--nx-brand)]">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        That page doesn&apos;t exist — but we probably have a tool for that.
      </h1>
      <p className="mt-3 text-[var(--nx-muted)]">
        Search the catalog, browse tools, or head home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/network/tools" className="nx-btn nx-btn-primary">
          Search Tools
        </Link>
        <Link href="/network/tools" className="nx-btn nx-btn-ghost">
          Browse Tools
        </Link>
        <Link href="/network" className="nx-btn nx-btn-ghost">
          Home
        </Link>
      </div>
    </div>
  );
}
