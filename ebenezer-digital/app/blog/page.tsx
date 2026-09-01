import { getJournalPostsForPage } from "@/lib/journal-list";
import BlogIndexClient from "./BlogIndexClient";

export const revalidate = 300;

export default async function BlogIndexPage() {
  const { posts, categories } = await getJournalPostsForPage({ limit: 48 });
  return <BlogIndexClient initialPosts={posts} initialCategories={categories} />;
}
