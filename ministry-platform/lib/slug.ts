/**
 * URL slug helpers for blog posts.
 */

export function slugify(title: string): string {
  const base = String(title || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);

  return base || 'post';
}

/**
 * Return a unique slug. Pass excludeId when updating an existing post.
 */
export async function ensureUniqueSlug(
  checkExists: (slug: string) => Promise<boolean>,
  title: string,
  preferred?: string | null
): Promise<string> {
  const base = slugify(preferred?.trim() || title);
  let candidate = base;
  let n = 2;

  while (await checkExists(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
    if (n > 500) {
      candidate = `${base}-${Date.now()}`;
      break;
    }
  }

  return candidate;
}
