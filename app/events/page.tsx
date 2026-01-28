'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { motion } from 'framer-motion';
import { events } from '@/data/demo-content';

export default function EventsPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      month: date.toLocaleDateString('en-US', { month: 'long' }),
      day: date.getDate(),
      year: date.getFullYear(),
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Events</span>
          </nav>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">
              Upcoming Events
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join us for worship, fellowship, and spiritual growth
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer>
          <div className="max-w-4xl mx-auto space-y-6">
            {events.map((event) => {
              const dateInfo = formatDate(event.date);
              return (
                <StaggerItem key={event.id}>
                  <Link href={`/events/${event.id}`}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start gap-6">
                            <div className="flex-shrink-0">
                              <div className="bg-primary-600 text-white rounded-lg p-4 text-center min-w-[100px]">
                                <div className="text-3xl font-bold">{dateInfo.day}</div>
                                <div className="text-sm uppercase tracking-wide">
                                  {dateInfo.month.substring(0, 3)}
                                </div>
                                <div className="text-xs mt-1">{dateInfo.year}</div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wide">
                                    {event.type}
                                  </div>
                                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 font-serif">
                                    {event.title}
                                  </h3>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-4 leading-relaxed">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {event.time}
                                </span>
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {event.location}
                                </span>
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {dateInfo.weekday}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>

        <FadeInUp delay={0.4}>
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <div className="bg-primary-50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Have Questions?
              </h2>
              <p className="text-gray-700 mb-6">
                If you have questions about any of our events or would like more
                information, please don't hesitate to contact us.
              </p>
              <Link href="/contact">
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </FadeInUp>
      </main>

      <Footer />
    </div>
  );
}
