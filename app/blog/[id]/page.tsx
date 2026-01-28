'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { ViewCounter } from '@/components/ui/view-counter';
import { blogPosts } from '@/data/demo-content';

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const post = blogPosts.find(p => p.id === parseInt(params.id)) || blogPosts[0];
  const readingTime = calculateReadingTime(post.content);
  const relatedPosts = blogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / documentHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Breadcrumb */}
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-primary-600 transition-colors">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{post.title}</span>
          </nav>
        </FadeInUp>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          {/* Header Image */}
          <FadeInUp delay={0.1}>
            <div className="relative h-64 md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary-600/90 backdrop-blur-sm rounded-full text-sm font-medium uppercase tracking-wide">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-4 text-sm bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{readingTime} min read</span>
                    </div>
                    <ViewCounter count={Math.floor(Math.random() * 5000) + 500} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Header */}
          <FadeInUp delay={0.2}>
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight tracking-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <time dateTime={post.date} className="text-sm">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </div>
              
              {/* Scripture Highlight */}
              <div className="bg-gradient-to-r from-primary-50 via-primary-100/50 to-primary-50 border-l-4 border-primary-600 p-8 rounded-xl mb-8 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">📖</div>
                  <div className="flex-1">
                    <p className="text-xl md:text-2xl font-serif italic text-gray-800 leading-relaxed mb-3">
                      "For the word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit, of joints and of marrow, and discerning the thoughts and intentions of the heart."
                    </p>
                    <p className="text-sm text-gray-600 font-medium">- Hebrews 4:12 (ESV)</p>
                  </div>
                </div>
              </div>
            </header>
          </FadeInUp>

          {/* Content */}
          <FadeInUp delay={0.3}>
            <div
              className="prose prose-lg prose-xl max-w-none 
                prose-headings:font-serif prose-headings:text-gray-900 prose-headings:font-bold
                prose-headings:leading-tight prose-headings:tracking-tight
                prose-h1:text-5xl prose-h1:mt-16 prose-h1:mb-8
                prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:font-semibold
                prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:font-semibold
                prose-p:text-gray-800 prose-p:leading-relaxed prose-p:text-xl prose-p:mb-6
                prose-ul:text-gray-800 prose-ol:text-gray-800 
                prose-li:leading-relaxed prose-li:text-xl prose-li:mb-3
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-blockquote:border-l-4 prose-blockquote:border-primary-600 
                prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary-50 prose-blockquote:to-transparent
                prose-blockquote:pl-8 prose-blockquote:py-6 prose-blockquote:pr-6
                prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:text-xl
                prose-blockquote:font-serif prose-blockquote:my-8
                prose-img:rounded-xl prose-img:shadow-xl prose-img:my-8
                prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </FadeInUp>

          {/* Continue Reading Encouragement */}
          <FadeInUp delay={0.4}>
            <div className="mt-16 p-10 bg-gradient-to-br from-primary-50 via-primary-100/50 to-primary-50 rounded-2xl border-2 border-primary-200 text-center shadow-lg">
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-4">
                Continue Your Journey
              </h3>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                Take time to meditate on these words. Let them sink deep into your heart and transform your walk with God. His word is a lamp to your feet and a light to your path.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/blog">
                  <Button size="lg" className="shadow-md">
                    Explore More Articles
                  </Button>
                </Link>
                <Link href="/prayer">
                  <Button variant="secondary" size="lg">
                    Submit Prayer Request
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInUp>

          {/* Social Share */}
          <FadeInUp delay={0.5}>
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Share this article</p>
                  <div className="flex space-x-3">
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <Link
                  href="/blog"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Blog
                </Link>
              </div>
            </div>
          </FadeInUp>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <FadeInUp delay={0.6}>
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-8">
                  Related Articles
                </h3>
                <StaggerContainer>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedPosts.map((relatedPost) => (
                      <StaggerItem key={relatedPost.id}>
                        <Link href={`/blog/${relatedPost.id}`}>
                          <div className="group cursor-pointer">
                            <div className="relative h-48 mb-4 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                              <img
                                src={relatedPost.image}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="text-xs text-primary-600 font-medium uppercase tracking-wide mb-2">
                              {relatedPost.category}
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 leading-tight">
                              {relatedPost.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {relatedPost.excerpt}
                            </p>
                            <div className="mt-3 text-sm text-primary-600 font-medium group-hover:underline">
                              Read more →
                            </div>
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
