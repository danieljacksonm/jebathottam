import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Page Not Found",
  description: "The page you requested could not be found on Raju Stickers.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="container-x py-20 text-center max-w-xl">
      <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-3">404</p>
      <h1 className="section-title mb-3">Page not found</h1>
      <p className="text-[var(--text-muted)] mb-8">
        That route does not exist. Head back to the shop or use search to find a wrap finish.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
        <Link href="/shop" className="btn btn-secondary">
          Shop Stickers
        </Link>
      </div>
    </div>
  );
}
