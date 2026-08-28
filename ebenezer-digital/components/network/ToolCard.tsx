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

export function ToolCard({
  tool,
  signal,
}: {
  tool: NetworkToolMeta;
  signal?: string;
}) {
  const Icon = ICONS[tool.icon] || WrenchFallback;
  return (
    <Link href={`/network/tools/${tool.slug}`} className="nx-card nx-tool-card">
      <span className="nx-tool-icon" aria-hidden>
        <Icon className="h-5 w-5" />
      </span>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <div className="nx-tool-meta">
        <span>{categoryLabel(tool.category)}</span>
        {signal ? <span>{signal}</span> : null}
      </div>
      <span className="nx-tool-cta">Use Tool →</span>
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
