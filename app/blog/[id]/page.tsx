'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/demo-content';

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find(p => p.id === parseInt(params.id)) || blogPosts[0];
  const readingTime = calculateReadingTime(post.content);
  const relatedPosts = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Breadcrumb */}
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-primary-600">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </FadeInUp>

        {/* Article */}
        <article className="max-w-5xl mx-auto">
          {/* Header Image */}
          <FadeInUp delay={0.1}>
            <div className="relative h-64 md:h-96 mb-12 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </FadeInUp>

          {/* Header */}
          <FadeInUp delay={0.2}>
            <header className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-primary-600 font-medium uppercase tracking-wide">
                  {post.category}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {readingTime} min read
                  </span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-600 space-x-4 text-lg mb-6">
                <span className="font-medium">{post.author}</span>
                <span>•</span>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              
              {/* Scripture Highlight */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-l-4 border-primary-600 p-6 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">📖</div>
                  <div>
                    <p className="text-lg font-serif italic text-gray-800 leading-relaxed">
                      "For the word of God is living and active, sharper than any two-edged sword."
                    </p>
                    <p className="text-sm text-gray-600 mt-2">- Hebrews 4:12</p>
                  </div>
                </div>
              </div>
            </header>
          </FadeInUp>

          {/* Content */}
          <FadeInUp delay={0.3}>
            <div
              className="prose prose-lg prose-xl max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-800 prose-p:leading-relaxed prose-p:text-xl prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:leading-relaxed prose-strong:text-gray-900 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-h2:text-4xl prose-h2:font-semibold prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-3xl prose-h3:font-semibold prose-h3:mt-12 prose-h3:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-primary-600 prose-blockquote:bg-primary-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </FadeInUp>

          {/* Continue Reading Encouragement */}
          <FadeInUp delay={0.4}>
            <div className="mt-16 p-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200 text-center">
              <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-3">
                Continue Your Journey
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Take time to meditate on these words. Let them sink deep into your heart and transform your walk with God.
              </p>
              <Link href="/blog">
                <Button size="lg">
                  Explore More Articles
                </Button>
              </Link>
            </div>
          </FadeInUp>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <FadeInUp delay={0.5}>
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-8">
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeInUp>
          )}

          {/* Footer */}
          <FadeInUp delay={0.6}>
            <footer className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Link
                  href="/blog"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Blog
                </Link>
                <div className="text-sm text-gray-600">
                  Share this article
                </div>
              </div>
            </footer>
          </FadeInUp>
        </article>
      </main>

      <Footer />
    </div>
  );
}
