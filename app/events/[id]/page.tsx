'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { events } from '@/data/demo-content';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = events.find(e => e.id === parseInt(params.id)) || events[0];
  const relatedEvents = events.filter(e => e.id !== event.id).slice(0, 3);
  const isUpcoming = new Date(event.date) >= new Date();

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
            <Link href="/events" className="hover:text-primary-600 transition-colors">
              Events
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{event.title}</span>
          </nav>
        </FadeInUp>

        <article className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <FadeInUp delay={0.1}>
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white rounded-2xl p-8 md:p-12 mb-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center min-w-[100px] border-2 border-white/30">
                      <div className="text-5xl font-bold mb-1">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm uppercase tracking-wide font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-xs mt-1 opacity-90">
                        {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <div className="mb-3">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium uppercase tracking-wide border border-white/30">
                          {event.type}
                        </span>
                      </div>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
                        {event.title}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Event Details Card */}
          <FadeInUp delay={0.2}>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-12 border border-gray-100">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Time</h3>
                    <p className="text-2xl text-gray-900 font-semibold flex items-center">
                      <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Location</h3>
                    <p className="text-xl text-gray-900 font-semibold flex items-start">
                      <svg className="w-6 h-6 mr-3 text-primary-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="leading-relaxed">{event.location}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  {isUpcoming ? (
                    <div className="w-full bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Upcoming Event</h4>
                          <p className="text-sm text-gray-600">Join us for this special gathering</p>
                        </div>
                      </div>
                      <Button size="lg" className="w-full shadow-md">
                        Register Now
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Past Event</h4>
                          <p className="text-sm text-gray-600">This event has concluded</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Event Description */}
          <FadeInUp delay={0.3}>
            <div className="prose prose-lg prose-xl max-w-none mb-12">
              <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-6">About This Event</h2>
              <div className="text-xl text-gray-700 leading-relaxed space-y-6">
                <p>{event.description}</p>
                <p className="text-lg">
                  We invite you to join us for this special time of fellowship, worship, and spiritual growth. 
                  Come with an open heart and expectant spirit as we gather together in His name.
                </p>
              </div>
            </div>
          </FadeInUp>

          {/* Scripture */}
          <FadeInUp delay={0.4}>
            <div className="bg-gradient-to-r from-primary-50 via-primary-100/50 to-primary-50 border-l-4 border-primary-600 p-8 rounded-xl mb-12 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="text-3xl flex-shrink-0">📖</div>
                <div>
                  <p className="text-xl md:text-2xl font-serif italic text-gray-800 leading-relaxed mb-3">
                    "For where two or three gather in my name, there am I with them."
                  </p>
                  <p className="text-sm text-gray-600 font-medium">- Matthew 18:20 (NIV)</p>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <FadeInUp delay={0.5}>
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h3 className="text-3xl font-serif font-semibold text-gray-900 mb-8">
                  Other Events
                </h3>
                <StaggerContainer>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedEvents.map((relatedEvent) => (
                      <StaggerItem key={relatedEvent.id}>
                        <Link href={`/events/${relatedEvent.id}`}>
                          <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 cursor-pointer">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="bg-primary-600 text-white rounded-lg p-4 text-center min-w-[80px] flex-shrink-0">
                                <div className="text-2xl font-bold">
                                  {new Date(relatedEvent.date).getDate()}
                                </div>
                                <div className="text-xs uppercase">
                                  {new Date(relatedEvent.date).toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1 leading-tight">
                                  {relatedEvent.title}
                                </h4>
                                <p className="text-sm text-gray-600">{relatedEvent.time}</p>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed mb-3">
                              {relatedEvent.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                {relatedEvent.type}
                              </span>
                              <span className="text-primary-600 text-sm font-medium group-hover:underline">
                                Learn more →
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
                href="/events"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Events
              </Link>
            </footer>
          </FadeInUp>
        </article>
      </main>

      <Footer />
    </div>
  );
}
