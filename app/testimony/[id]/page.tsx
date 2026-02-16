'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Loader2, Quote } from 'lucide-react';

type TestimonyItem = {
  id: number;
  name: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

const placeholderImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Crect fill="%23e5e7eb" width="160" height="160"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="16"%3E?%3C/text%3E%3C/svg%3E';

export default function TestimonyDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [testimony, setTestimony] = useState<TestimonyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    fetch(`/api/testimonies/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (data?.data) setTestimony(data.data);
        else if (!notFound) setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, notFound]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !testimony) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Testimony not found</h1>
          <Link href="/testimony" className="text-primary-600 hover:underline">
            ← Back to Testimonies
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <FadeInUp>
          <nav className="mb-6 sm:mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/testimony" className="hover:text-primary-600 transition-colors">
              Testimonies
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[180px] sm:max-w-none inline-block align-bottom">
              {testimony.name}
            </span>
          </nav>
        </FadeInUp>

        <article className="max-w-4xl mx-auto">
          <FadeInUp delay={0.1}>
            <div className="text-center mb-8 sm:mb-12">
              <div className="relative inline-block mb-6 sm:mb-8">
                <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-primary-100 dark:ring-primary-900/30 shadow-xl mx-auto">
                  <img
                    src={testimony.image_url || placeholderImg}
                    alt={testimony.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholderImg;
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight px-2">
                {testimony.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {new Date(testimony.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-6">
                  Their Story
                </h2>
              </div>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-gray-800 dark:text-gray-200 leading-relaxed text-center whitespace-pre-wrap">
                  &ldquo;{testimony.content}&rdquo;
                </p>
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 rounded-2xl p-6 sm:p-8 md:p-10 text-center mb-8 sm:mb-12 shadow-lg border-2 border-primary-200 dark:border-primary-800">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Share Your Story
              </h3>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                God is working in amazing ways! If you have a testimony to share, we&apos;d love to hear how God has moved in your life.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                <Link href="/contact">
                  <span className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md min-h-[44px] flex items-center justify-center">
                    Share Your Testimony
                  </span>
                </Link>
                <Link href="/prayer">
                  <span className="inline-block px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors font-medium min-h-[44px] flex items-center justify-center">
                    Submit Prayer Request
                  </span>
                </Link>
              </div>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <footer className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/testimony"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium flex items-center gap-2 transition-colors min-h-[44px] items-center"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Testimonies
              </Link>
            </footer>
          </FadeInUp>
        </article>
      </main>

      <Footer />
    </div>
  );
}
