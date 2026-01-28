'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { ViewCounter } from '@/components/ui/view-counter';
import { mediaItems } from '@/data/media-content';

export default function MediaDetailPage({ params }: { params: { id: string } }) {
  const media = mediaItems.find(m => m.id === parseInt(params.id)) || mediaItems[0];
  const relatedMedia = mediaItems.filter(m => m.id !== media.id && m.type === media.type).slice(0, 3);

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
            <Link href="/media" className="hover:text-primary-600 transition-colors">
              Media
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{media.title}</span>
          </nav>
        </FadeInUp>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <FadeInUp delay={0.1}>
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide ${
                  media.type === 'poster' 
                    ? 'bg-primary-100 text-primary-700' 
                    : media.type === 'youtube-shorts'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {media.type === 'poster' ? '📄 Poster' : media.type === 'youtube-shorts' ? '🎬 Shorts' : '🎥 Video'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                {media.title}
              </h1>
              {media.description && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
                  {media.description}
                </p>
              )}
              <div className="flex justify-center">
                <ViewCounter count={Math.floor(Math.random() * 4000) + 300} />
              </div>
            </div>
          </FadeInUp>

          {/* Poster Content */}
          {media.type === 'poster' && (
            <>
              <FadeInUp delay={0.2}>
                <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                  <img
                    src={media.image}
                    alt={media.title}
                    className="w-full h-auto"
                  />
                </div>
              </FadeInUp>

              <FadeInUp delay={0.3}>
                <div className="bg-gradient-to-r from-primary-50 via-primary-100/50 to-primary-50 border-l-4 border-primary-600 p-8 md:p-10 rounded-xl mb-12 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl flex-shrink-0">💬</div>
                    <div className="flex-1">
                      <p className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-relaxed mb-4">
                        "{media.message}"
                      </p>
                      <p className="text-lg text-primary-600 font-semibold">
                        - {media.scripture}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </>
          )}

          {/* Video Content */}
          {(media.type === 'youtube' || media.type === 'youtube-shorts') && (
            <>
              <FadeInUp delay={0.2}>
                <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                  <div className={`${media.type === 'youtube-shorts' ? 'aspect-[9/16]' : 'aspect-video'} bg-gray-900`}>
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${media.videoId}${media.type === 'youtube-shorts' ? '?modestbranding=1' : ''}`}
                      title={media.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </FadeInUp>

              {media.description && (
                <FadeInUp delay={0.3}>
                  <div className="prose prose-lg prose-xl max-w-none mb-12">
                    <div className="text-xl text-gray-700 leading-relaxed">
                      <p>{media.description}</p>
                    </div>
                  </div>
                </FadeInUp>
              )}

              {/* Video Actions */}
              <FadeInUp delay={0.4}>
                <div className="bg-gray-50 rounded-xl p-6 mb-12 border border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Share this video</h3>
                      <p className="text-sm text-gray-600">Spread the message with others</p>
                    </div>
                    <div className="flex space-x-3">
                      <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </button>
                      <a
                        href={`https://www.youtube.com/watch?v=${media.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </>
          )}

          {/* Related Media */}
          {relatedMedia.length > 0 && (
            <FadeInUp delay={0.5}>
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-8">
                  More {media.type === 'poster' ? 'Posters' : media.type === 'youtube-shorts' ? 'Shorts' : 'Videos'}
                </h3>
                <StaggerContainer>
                  <div className={`grid gap-6 ${media.type === 'poster' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {relatedMedia.map((related) => (
                      <StaggerItem key={related.id}>
                        <Link href={`/media/${related.id}`}>
                          <div className="group cursor-pointer">
                            {related.type === 'poster' ? (
                              <div className="relative mb-4 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                                <img
                                  src={related.image}
                                  alt={related.title}
                                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            ) : (
                              <div className={`relative mb-4 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow bg-gray-900 ${related.type === 'youtube-shorts' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                                <img
                                  src={related.thumbnail}
                                  alt={related.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-black/80 transition-colors">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            )}
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                              {related.title}
                            </h4>
                            {related.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {related.description}
                              </p>
                            )}
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
                href="/media"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Media
              </Link>
            </footer>
          </FadeInUp>
        </div>
      </main>

      <Footer />
    </div>
  );
}
