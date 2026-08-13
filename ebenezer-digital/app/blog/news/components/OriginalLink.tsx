import type { NewsArticle } from "../data";

export function OriginalLink({
  story,
  className = "",
}: {
  story: Pick<NewsArticle, "originalUrl" | "sourceLabel">;
  className?: string;
}) {
  if (!story.originalUrl) return null;
  return (
    <a
      href={story.originalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--n-live)] hover:underline ${className}`}
      data-cursor="OPEN"
    >
      Read on {story.sourceLabel} →
    </a>
  );
}
