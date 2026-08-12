import blogsTable from "../../content/db/blogs.json";
import {
  pickLocalized,
  type ContentTable,
  type LocaleCode,
  type LocalizedString,
  type LocalizedStringList,
} from "@/lib/content/types";

export type BlogRow = {
  id: string;
  slug: string;
  date: string;
  readMinutes: number;
  image: string;
  tags: LocalizedStringList;
  title: LocalizedString;
  excerpt: LocalizedString;
  body: LocalizedStringList;
};

export type LocalizedBlog = {
  id: string;
  slug: string;
  date: string;
  readMinutes: number;
  image: string;
  tags: string[];
  title: string;
  excerpt: string;
  body: string[];
};

const table = blogsTable as ContentTable<BlogRow>;

export const KODAI_BLOG_IMAGE =
  table.rows[0]?.image ??
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80";

/** Raw DB rows (all languages). Same routes — locale picks fields. */
export const blogRows: BlogRow[] = table.rows;

export function getBlogRows() {
  return blogRows;
}

export function getBlogRow(slug: string) {
  return blogRows.find((row) => row.slug === slug);
}

export function localizeBlog(
  row: BlogRow,
  locale: string,
): LocalizedBlog {
  return {
    id: row.id,
    slug: row.slug,
    date: row.date,
    readMinutes: row.readMinutes,
    image: row.image,
    tags: pickLocalized(row.tags, locale),
    title: pickLocalized(row.title, locale),
    excerpt: pickLocalized(row.excerpt, locale),
    body: pickLocalized(row.body, locale),
  };
}

export function getLocalizedBlogs(locale: string): LocalizedBlog[] {
  return blogRows.map((row) => localizeBlog(row, locale));
}

export function getLocalizedBlog(slug: string, locale: string) {
  const row = getBlogRow(slug);
  if (!row) return undefined;
  return localizeBlog(row, locale);
}

export function getAllBlogSlugs() {
  return blogRows.map((row) => row.slug);
}

/** @deprecated Prefer getLocalizedBlogs — kept for any legacy imports */
export const blogPosts = blogRows.map((row) => ({
  slug: row.slug,
  date: row.date,
  readMinutes: row.readMinutes,
  image: row.image,
  tags: row.tags.en,
}));

/** @deprecated Prefer localizeBlog */
export const blogCopy = Object.fromEntries(
  blogRows.map((row) => [
    row.slug,
    {
      title: row.title,
      excerpt: row.excerpt,
      body: row.body.en,
    },
  ]),
);

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export type { LocaleCode };
