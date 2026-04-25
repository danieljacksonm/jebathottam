'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { motion } from 'framer-motion';

type EventItem = {
  id: number;
  title: string;
  description: string | null;
  type: string | null;
  date: string;
  time: string | null;
  location: string | null;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.ok ? res.json() : { data: [] })
      .then((data) => setEvents(Array.isArray(data?.data) ? data.data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      month: date.toLocaleDateString('en-US', { month: 'long' }),
      day: date.getDate(),
      year: date.getFullYear(),
    };
  };

  const stripHtml = (html: string | null) => (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
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

        {loading ? (
          <div className="max-w-4xl mx-auto py-12 text-center text-gray-500">Loading…</div>
        ) : events.length === 0 ? (
          <FadeInUp>
            <div className="max-w-2xl mx-auto text-center py-12 text-gray-600">
              <p>No upcoming events at the moment. Check back soon.</p>
            </div>
          </FadeInUp>
        ) : (
          <StaggerContainer>
            <div className="max-w-4xl mx-auto space-y-6">
              {events.map((event) => {
                const dateInfo = formatDate(event.date);
                return (
                  <StaggerItem key={event.id}>
                    <Link href={`/events/${event.id}`}>
                      <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.3 }}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                              <div className="flex-shrink-0">
                                <div className="bg-primary-600 text-white rounded-lg p-4 text-center min-w-[100px]">
                                  <div className="text-3xl font-bold">{dateInfo.day}</div>
                                  <div className="text-sm uppercase tracking-wide">{dateInfo.month.substring(0, 3)}</div>
                                  <div className="text-xs mt-1">{dateInfo.year}</div>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wide">
                                      {event.type || 'Event'}
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2 font-serif">{event.title}</h3>
                                  </div>
                                </div>
                                {event.description && (
                                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">{stripHtml(event.description)}</p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  {event.time && (
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {String(event.time).slice(0, 5)}
                                    </span>
                                  )}
                                  {event.location && (
                                    <span className="flex items-center">
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      {event.location}
                                    </span>
                                  )}
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
        )}
      </main>

      <Footer />
    </div>
  );
}
