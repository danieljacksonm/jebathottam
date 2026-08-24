import Link from "next/link";
import {
  AlignLeft,
  BadgePercent,
  BarChart3,
  Binary,
  Bot,
  Braces,
  Cake,
  CaseSensitive,
  Clock,
  Code2,
  Eraser,
  FileCode,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  Hash,
  ImageDown,
  Images,
  KeyRound,
  Landmark,
  Link as LinkIcon,
  Link2,
  ListFilter,
  ListOrdered,
  ListTree,
  Map,
  MessageSquareText,
  Paintbrush,
  Palette,
  Percent,
  QrCode,
  Receipt,
  Regex,
  Ruler,
  Scaling,
  Share2,
  ShieldCheck,
  Sparkles,
  Tags,
  Target,
  Timer,
  TrendingUp,
  Wallet,
  Wand2,
  WholeWord,
  type LucideIcon,
} from "lucide-react";
import type { NetworkToolMeta } from "@/lib/network/types";
import { categoryLabel } from "@/lib/network/registry";

const ICONS: Record<string, LucideIcon> = {
  Braces,
  ShieldCheck,
  Binary,
  Link: LinkIcon,
  Fingerprint,
  KeyRound,
  Regex,
  Hash,
  Clock,
  Palette,
  FileText,
  Code2,
  Paintbrush,
  FileCode,
  Tags,
  Bot,
  Map,
  Wand2,
  Share2,
  Link2,
  BarChart3,
  WholeWord,
  CaseSensitive,
  Eraser,
  AlignLeft,
  ListFilter,
  Percent,
  Receipt,
  Landmark,
  BadgePercent,
  Cake,
  Wallet,
  Timer,
  Ruler,
  FileSpreadsheet,
  TrendingUp,
  QrCode,
  ImageDown,
  Scaling,
  Images,
  Sparkles,
  ListOrdered,
  MessageSquareText,
  ListTree,
  Target,
};

export function ToolCard({ tool }: { tool: NetworkToolMeta }) {
  const Icon = ICONS[tool.icon] || WrenchFallback;
  return (
    <Link href={`/network/tools/${tool.slug}`} className="nx-card block p-4 no-underline text-inherit">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--nx-line)] bg-[var(--nx-brand-soft)] text-[var(--nx-brand)]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold">{tool.name}</p>
          <p className="mt-1 text-sm text-[var(--nx-muted)] line-clamp-2">{tool.description}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--nx-brand)]">
            {categoryLabel(tool.category)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function WrenchFallback(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
