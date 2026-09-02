import Link from "next/link";

type Props = {
  className?: string;
  linkClassName?: string;
  separator?: string;
};

/** Shared Privacy / Terms / Sitemap links for native site footers (middleware serves /privacy, /terms, /sitemap). */
export function SiteLegalLinks({
  className = "",
  linkClassName = "hover:opacity-100 transition-opacity",
  separator = " · ",
}: Props) {
  return (
    <p className={className}>
      <Link href="/privacy" className={linkClassName}>
        Privacy
      </Link>
      {separator}
      <Link href="/terms" className={linkClassName}>
        Terms
      </Link>
      {separator}
      <Link href="/sitemap" className={linkClassName}>
        Sitemap
      </Link>
    </p>
  );
}
