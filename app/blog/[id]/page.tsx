'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';

type BlogPost = {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  author: string | null;
  category: string | null;
  created_at: string;
};

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`/api/blogs/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/blogs').then((r) => (r.ok ? r.json() : { data: [] })),
    ]).then(([single, list]) => {
      if (cancelled) return;
      const data = single?.data;
      const all = Array.isArray(list?.data) ? list.data : [];
      setPost(data || null);
      if (data) {
        const relatedList = all.filter((p: BlogPost) => p.id !== data.id && (p.category === data.category || !data.category)).slice(0, 3);
        setRelated(relatedList);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      if (documentHeight <= 0) return;
      const progress = (window.scrollY / documentHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  if (loading || !post) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
          {loading ? <p className="text-center text-gray-500">Loading…</p> : <p className="text-center text-gray-500">Post not found.</p>}
          <Link href="/blog" className="text-primary-600 hover:underline mt-4 inline-block">← Back to Blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{post.title}</span>
          </nav>
        </FadeInUp>

        <article className="max-w-4xl mx-auto">
          <FadeInUp delay={0.1}>
            <div className="relative h-64 md:h-80 mb-12 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-end">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="relative z-10 p-8 text-white w-full">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium uppercase tracking-wide mb-2">
                  {post.category || 'Article'}
                </span>
                <p className="text-sm opacity-90">{readingTime} min read</p>
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                {post.author && (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">
                        {post.author.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author}</p>
                      <time dateTime={post.created_at} className="text-sm">
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>
                )}
                {!post.author && (
                  <time dateTime={post.created_at} className="text-sm">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
              </div>
            </header>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-primary-600 prose-blockquote:italic prose-blockquote:text-gray-700
                prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <div className="mt-16 p-8 sm:p-10 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800 text-center">
              <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-4">Continue Your Journey</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Take time to meditate on these words. Let them sink deep into your heart and transform your walk with God.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/blog"><Button size="lg">Explore More Articles</Button></Link>
                <Link href="/prayer"><Button variant="secondary" size="lg">Submit Prayer Request</Button></Link>
              </div>
            </div>
          </FadeInUp>

          {related.length > 0 && (
            <FadeInUp delay={0.5}>
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-8">Related Articles</h3>
                <StaggerContainer>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {related.map((p) => (
                      <StaggerItem key={p.id}>
                        <Link href={`/blog/${p.id}`}>
                          <div className="group cursor-pointer">
                            <div className="h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 group-hover:opacity-90 transition-opacity" />
                            <div className="text-xs text-primary-600 font-medium uppercase tracking-wide mb-2">{p.category || 'Article'}</div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                              {p.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {p.excerpt?.replace(/<[^>]+>/g, ' ').trim() || p.content.replace(/<[^>]+>/g, ' ').trim().slice(0, 100)}…
                            </p>
                            <span className="mt-2 inline-block text-sm text-primary-600 font-medium group-hover:underline">Read more →</span>
                          </div>
                        </Link>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>
              </div>
            </FadeInUp>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
