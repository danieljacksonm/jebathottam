import type { MetadataRoute } from 'next';
import { query } from '@/lib/db';

const SITE_URL = 'https://jesusisthewayjebathottam.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/services',
    '/single-service',
    '/gallery',
    '/team',
    '/videos',
    '/blog',
    '/contact',
    '/privacy-policy',
    '/prayer',
    '/attendance',
    '/carmel-attendance',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/blog' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/blog' ? 0.9 : 0.7,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await query<Array<{ slug: string | null; id: number; updated_at: Date | string; published_at: Date | string | null }>>(
      `SELECT id, slug, updated_at, published_at FROM blogs WHERE published = 1 ORDER BY created_at DESC`
    );
    blogRoutes = blogs.map((b) => ({
      url: `${SITE_URL}/blog/${b.slug || b.id}`,
      lastModified: new Date(b.updated_at || b.published_at || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error('sitemap blogs error:', err);
  }

  return [...staticRoutes, ...blogRoutes];
}
