'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { audioConferences as fallbackConferences } from '@/data/audio-conference-content';

type Conference = {
  id: number | string;
  title: string;
  description: string;
  status: string;
  scheduledDate?: string;
  scheduled_start?: string;
  scheduledTime?: string;
  category?: string;
  participants?: number;
  maxParticipants?: number;
  max_participants?: number;
  speaker?: { name: string; role: string; image: string };
};

function mapApiStatus(status: string): string {
  if (status === 'scheduled') return 'upcoming';
  if (status === 'live') return 'live';
  if (status === 'ended') return 'ended';
  return status;
}

export default function AudioConferencePage() {
  const [conferences, setConferences] = useState<Conference[]>(fallbackConferences);

  useEffect(() => {
    fetch('/api/conferences?scope=public')
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) {
          setConferences(list.map((c: Conference) => ({
            ...c,
            status: mapApiStatus(c.status),
            scheduledDate: c.scheduled_start || c.scheduledDate,
            maxParticipants: c.max_participants || c.maxParticipants || 100,
            speaker: c.speaker || { name: 'Ministry Team', role: 'Speaker', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
          })));
        }
      })
      .catch(() => {});
  }, []);

  const upcoming = conferences.filter(c => c.status === 'upcoming');
  const live = conferences.filter(c => c.status === 'live');
  const ended = conferences.filter(c => c.status === 'ended');

  const formatDate = (conf: Conference) => {
    const d = conf.scheduledDate || conf.scheduled_start;
    if (!d) return 'TBA';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (conf: Conference) => {
    if (conf.scheduledTime) return conf.scheduledTime;
    const d = conf.scheduled_start;
    if (!d) return 'TBA';
    return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Audio Conferences
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Join our live audio conferences for prayer, teaching, and fellowship
            </p>
            <div>
              <Link
                href="/audio-conference/join"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Join conference (dial-in or online)
              </Link>
            </div>
          </div>
        </FadeInUp>

        {live.length > 0 && (
          <FadeInUp delay={0.1}>
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 dark:text-white">Live Now</h2>
              </div>
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {live.map((conference) => (
                    <StaggerItem key={conference.id}>
                      <Link href={`/conferences/${conference.id}`}>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer">
                          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium uppercase">LIVE</span>
                          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-4 mb-3">{conference.title}</h3>
                          <p className="text-gray-700 line-clamp-2">{conference.description}</p>
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>
          </FadeInUp>
        )}

        {upcoming.length > 0 && (
          <FadeInUp delay={0.2}>
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 dark:text-white mb-6">Upcoming</h2>
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((conference) => (
                    <StaggerItem key={conference.id}>
                      <Link href={`/conferences/${conference.id}`}>
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all p-6 cursor-pointer">
                          <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">{conference.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">{conference.description}</p>
                          <div className="text-sm text-gray-500">{formatDate(conference)} · {formatTime(conference)}</div>
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>
          </FadeInUp>
        )}

        {ended.length > 0 && (
          <FadeInUp delay={0.3}>
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 dark:text-white mb-6">Past Conferences</h2>
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ended.map((conference) => (
                    <StaggerItem key={conference.id}>
                      <Link href={`/conferences/${conference.id}`}>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all p-6 cursor-pointer">
                          <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">{conference.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{conference.description}</p>
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>
          </FadeInUp>
        )}

        {conferences.length === 0 && (
          <p className="text-center text-gray-500">No conferences scheduled. Check back soon.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
