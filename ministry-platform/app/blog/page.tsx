'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';

type BlogPost = {
  id: number;
  slug?: string | null;
  title: string;
  content: string;
  excerpt: string | null;
  author: string | null;
  category: string | null;
  featured: boolean | number;
  published: boolean | number;
  created_at: string;
  featured_image?: string | null;
};

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function excerptText(html: string | null, fallback: string, maxLen: number): string {
  if (!html) return fallback;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '…';
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.ok ? res.json() : { data: [] })
      .then((data) => setPosts(Array.isArray(data?.data) ? data.data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Blog</span>
          </nav>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Insights, teachings, and reflections from our ministry
            </p>
          </div>
        </FadeInUp>

        {loading ? (
          <div className="max-w-7xl mx-auto py-12 text-center text-gray-500">Loading…</div>
        ) : posts.length === 0 ? (
          <FadeInUp>
            <div className="max-w-2xl mx-auto text-center py-12 text-gray-600">
              <p>No blog posts yet. Check back soon.</p>
            </div>
          </FadeInUp>
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {posts.map((post) => (
                <StaggerItem key={post.id}>
                  <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                          {post.category || 'Article'}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {calculateReadingTime(post.content)} min
                        </div>
                      </div>
                      <CardTitle className="text-xl font-serif">{post.title}</CardTitle>
                      <CardDescription>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {post.author ? ` • ${post.author}` : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                        {excerptText(post.excerpt, post.content.replace(/<[^>]+>/g, ' ').trim(), 160)}
                      </p>
                      <Link href={`/blog/${post.slug || post.id}`}>
                        <span className="w-full inline-block px-4 py-2 text-primary-600 hover:text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors text-left">
                          Read More →
                        </span>
                      </Link>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}

        {!loading && posts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-12 text-center">
            <p className="text-gray-600">Showing {posts.length} post{posts.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
