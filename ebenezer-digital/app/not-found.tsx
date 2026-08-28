import Link from "next/link";
import { headers } from "next/headers";
import { notFoundSurfaceForKind } from "@/lib/not-found-surface";
import { siteKindFromHost } from "@/lib/site-url";

export default function NotFound() {
  const kind = siteKindFromHost(headers().get("host"));
  const surface = notFoundSurfaceForKind(kind);
  const isNetwork = surface.theme === "network";

  return (
    <div
      className={
        isNetwork
          ? "nx-page min-h-[80vh] py-20 px-4 text-center max-w-xl mx-auto"
          : "min-h-[80vh] bg-[#070708] px-4 py-20 text-white"
      }
    >
      <div className={isNetwork ? "" : "mx-auto max-w-xl text-center"}>
        <p
          className={
            isNetwork
              ? "text-xs font-bold uppercase tracking-[0.18em] text-[var(--nx-brand)]"
              : "text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400"
          }
        >
          404 · {surface.brand}
        </p>
        <h1
          className={
            isNetwork
              ? "mt-3 text-3xl font-bold tracking-tight"
              : "mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl"
          }
        >
          {surface.headline}
        </h1>
        <p
          className={
            isNetwork ? "mt-3 text-[var(--nx-muted)]" : "mt-4 text-sm leading-relaxed text-white/60"
          }
        >
          {surface.hint}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {surface.home.href.startsWith("/") ? (
            <Link
              href={surface.home.href}
              className={
                isNetwork
                  ? "nx-btn nx-btn-primary"
                  : "rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-400"
              }
            >
              {surface.home.label}
            </Link>
          ) : (
            <a
              href={surface.home.href}
              className={
                isNetwork
                  ? "nx-btn nx-btn-primary"
                  : "rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-400"
              }
            >
              {surface.home.label}
            </a>
          )}
          {surface.links.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isNetwork
                    ? "nx-btn nx-btn-ghost"
                    : "rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-400"
                }
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={
                  isNetwork
                    ? "nx-btn nx-btn-ghost"
                    : "rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-400"
                }
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
}
