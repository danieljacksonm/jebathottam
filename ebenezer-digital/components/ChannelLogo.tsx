import Image from "next/image";
import Link from "next/link";
import { E_MARKS } from "@/lib/brand-marks";

type Channel =
  | "studio"
  | "store"
  | "journal"
  | "tools"
  | "discover"
  | "catalog"
  | "network"
  | "ai"
  | "news"
  | "info";

const LABELS: Record<Channel, { primary: string; accent?: string }> = {
  studio: { primary: "EBENEZER" },
  store: { primary: "Ebenezer", accent: "Store" },
  journal: { primary: "Ebenezer", accent: "Journal" },
  tools: { primary: "Ebenezer", accent: "Tools" },
  discover: { primary: "Ebenezer", accent: "Discover" },
  catalog: { primary: "Ebenezer", accent: "Products" },
  network: { primary: "Ebenezer", accent: "Network" },
  ai: { primary: "Ebenezer", accent: "AI" },
  news: { primary: "Ebenezer", accent: "News" },
  info: { primary: "Ebenezer", accent: "Info" },
};

const MARKS: Record<Channel, string> = {
  studio: E_MARKS.studio,
  store: E_MARKS.store,
  journal: E_MARKS.journal,
  tools: E_MARKS.tools,
  discover: E_MARKS.discover,
  catalog: E_MARKS.catalog,
  network: E_MARKS.network,
  ai: E_MARKS.ai,
  news: E_MARKS.news,
  info: E_MARKS.info,
};

type Props = {
  channel: Channel;
  href?: string;
  className?: string;
  variant?: "dark" | "light";
  showWordmark?: boolean;
};

export function ChannelLogo({
  channel,
  href,
  className = "",
  variant = "dark",
  showWordmark = true,
}: Props) {
  const label = LABELS[channel];
  const mark = MARKS[channel];
  const ink = variant === "light" ? "text-[var(--aff-ink,#111)]" : "text-white";
  const muted = variant === "light" ? "text-[var(--aff-brand,#0d9488)]" : "text-emerald-400";

  const inner = (
    <>
      <Image
        src={mark}
        alt={`Ebenezer ${label.accent || label.primary}`}
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-lg"
        priority
      />
      {showWordmark ? (
        <div className={`leading-none ${ink}`}>
          <p className="text-sm font-bold">{label.primary}</p>
          {label.accent ? <p className={`text-[10px] font-semibold ${muted}`}>{label.accent}</p> : null}
        </div>
      ) : null}
    </>
  );

  const cls = `flex items-center gap-2.5 ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={`Ebenezer ${label.accent || label.primary} home`}>
        {inner}
      </Link>
    );
  }

  return <div className={cls}>{inner}</div>;
}
