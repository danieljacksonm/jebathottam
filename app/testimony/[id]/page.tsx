'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { testimonies } from '@/data/testimonies-content';

export default function TestimonyDetailPage({ params }: { params: { id: string } }) {
  const testimony = testimonies.find(t => t.id === parseInt(params.id)) || testimonies[0];
  const relatedTestimonies = testimonies.filter(t => t.id !== testimony.id && t.category === testimony.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/testimony" className="hover:text-primary-600 transition-colors">
              Testimonies
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{testimony.name}</span>
          </nav>
        </FadeInUp>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <FadeInUp delay={0.1}>
            <div className="text-center mb-12">
              <div className="relative inline-block mb-8">
                <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-primary-100 shadow-xl">
                  <img
                    src={testimony.image}
                    alt={testimony.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                {testimony.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                <p className="text-xl text-gray-600 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {testimony.location}
                </p>
                <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium uppercase tracking-wide">
                  {testimony.category}
                </span>
              </div>
            </div>
          </FadeInUp>

          {/* Testimony Content */}
          <FadeInUp delay={0.2}>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 mb-12 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-block text-5xl mb-4">💬</div>
                <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-6">Their Story</h2>
              </div>
              <div className="prose prose-lg prose-xl max-w-none">
                <p className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-relaxed text-center">
                  "{testimony.testimony}"
                </p>
              </div>
            </div>
          </FadeInUp>

          {/* Scripture */}
          <FadeInUp delay={0.3}>
            <div className="bg-gradient-to-r from-primary-50 via-primary-100/50 to-primary-50 border-l-4 border-primary-600 p-8 md:p-10 rounded-xl mb-12 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="text-3xl flex-shrink-0">📖</div>
                <div>
                  <p className="text-xl md:text-2xl font-serif italic text-gray-800 leading-relaxed mb-3">
                    "{testimony.scripture}"
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Scripture that inspired this testimony</p>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Call to Action */}
          <FadeInUp delay={0.4}>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-10 text-center mb-12 shadow-lg border-2 border-primary-200">
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mb-4">
                Share Your Story
              </h3>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                God is working in amazing ways! If you have a testimony to share, we'd love to hear how God has moved in your life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md">
                    Share Your Testimony
                  </button>
                </Link>
                <Link href="/prayer">
                  <button className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                    Submit Prayer Request
                  </button>
                </Link>
              </div>
            </div>
          </FadeInUp>

          {/* Related Testimonies */}
          {relatedTestimonies.length > 0 && (
            <FadeInUp delay={0.5}>
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-8">
                  More Testimonies
                </h3>
                <StaggerContainer>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedTestimonies.map((related) => (
                      <StaggerItem key={related.id}>
                        <Link href={`/testimony/${related.id}`}>
                          <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 cursor-pointer">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary-100 flex-shrink-0">
                                <img
                                  src={related.image}
                                  alt={related.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                                  {related.name}
                                </h4>
                                <p className="text-sm text-gray-600">{related.location}</p>
                              </div>
                            </div>
                            <p className="text-gray-700 line-clamp-3 leading-relaxed mb-3">
                              "{related.testimony}"
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                {related.category}
                              </span>
                              <span className="text-primary-600 text-sm font-medium group-hover:underline">
                                Read more →
                              </span>
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

          {/* Footer Navigation */}
          <FadeInUp delay={0.6}>
            <footer className="mt-16 pt-8 border-t border-gray-200">
              <Link
                href="/testimony"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
