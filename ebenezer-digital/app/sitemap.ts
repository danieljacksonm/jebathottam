import type { MetadataRoute } from 'next';
import { STORE_PRODUCTS } from './products/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://ebenezerdigital.com';
  const routes = ['', '/services', '/work', '/blog', '/contact', '/products', '/testimonials', '/privacy', '/terms', '/completed-projects'];
  const staticPages = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.7,
  }));
  const productPages = STORE_PRODUCTS.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  return [...staticPages, ...productPages];
}
