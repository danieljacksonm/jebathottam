import { headers } from "next/headers";
import { getJournalPostsForPage } from "@/lib/journal-list";
import BlogIndexClient from "./BlogIndexClient";

export const revalidate = 300;

export default async function BlogIndexPage() {
  const locale = headers().get("x-eben-locale") || "en";
  const { posts, categories } = await getJournalPostsForPage({ limit: 48, locale });
  return <BlogIndexClient initialPosts={posts} initialCategories={categories} />;
}
