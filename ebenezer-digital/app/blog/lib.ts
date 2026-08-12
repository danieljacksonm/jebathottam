export type JournalPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  category: string;
  publishedAt?: string;
  author: string;
  tags?: string[];
};

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatDate(value?: string): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function splitHeadline(title: string): string[] {
  const words = title.trim().split(/\s+/);
  if (words.length <= 3) return [title];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export function isNewsCategory(category?: string): boolean {
  const value = (category || "").toLowerCase().trim();
  return (
    value.includes("news") ||
    value.includes("update") ||
    value.includes("announcement") ||
    value.includes("press")
  );
}
