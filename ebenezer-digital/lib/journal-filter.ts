/** Hide auto-generated edu-style posts from the public journal homepage. */
export function isEditorialJournalPost(post: {
  category?: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
}): boolean {
  const cat = (post.category || "").trim();
  const excerpt = (post.excerpt || "").toLowerCase();
  const author = (post.author || "").toLowerCase();

  if (cat.startsWith("Learn ·")) return false;
  if (author.includes("learn desk")) return false;
  if (excerpt.includes("class 5 student")) return false;
  if (excerpt.includes("written in simple english")) return false;
  return true;
}

export function filterEditorialPosts<T extends {
  category?: string;
  excerpt?: string;
  author?: string;
}>(posts: T[]): T[] {
  const editorial = posts.filter(isEditorialJournalPost);
  return editorial.length > 0 ? editorial : posts.slice(0, 12);
}
