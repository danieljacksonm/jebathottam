'use client';

import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { audioConferences } from '@/data/audio-conference-content';

export default function AudioConferencePage() {
  const upcoming = audioConferences.filter(c => c.status === 'upcoming');
  const live = audioConferences.filter(c => c.status === 'live');
  const ended = audioConferences.filter(c => c.status === 'ended');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4">
              Audio Conferences
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join our live audio conferences for prayer, teaching, and fellowship
            </p>
          </div>
        </FadeInUp>

        {/* Live Conferences */}
        {live.length > 0 && (
          <FadeInUp delay={0.1}>
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900">
                  Live Now
                </h2>
              </div>
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {live.map((conference) => (
                    <StaggerItem key={conference.id}>
                      <Link href={`/audio-conference/${conference.id}`}>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium uppercase tracking-wide flex items-center space-x-2">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              <span>LIVE</span>
                            </span>
                            <span className="text-sm text-gray-600">
                              {conference.participants}/{conference.maxParticipants} participants
                            </span>
                          </div>
                          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                            {conference.title}
                          </h3>
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {conference.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-white overflow-hidden">
                                <img src={conference.speaker.image} alt={conference.speaker.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{conference.speaker.name}</p>
                                <p className="text-xs">{conference.speaker.role}</p>
                              </div>
                            </div>
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

        {/* Upcoming Conferences */}
        {upcoming.length > 0 && (
          <FadeInUp delay={0.2}>
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mb-6">
                Upcoming
              </h2>
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((conference) => (
                    <StaggerItem key={conference.id}>
                      <Link href={`/audio-conference/${conference.id}`}>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all p-6 cursor-pointer">
                          <div className="mb-4">
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium uppercase tracking-wide">
                              {conference.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                            {conference.title}
                          </h3>
                          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                            {conference.description}
                          </p>
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                              <img src={conference.speaker.image} alt={conference.speaker.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">{conference.speaker.name}</p>
                              <p className="text-xs text-gray-600">{conference.speaker.role}</p>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>
                                  {new Date(conference.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{conference.scheduledTime}</span>
                              </div>
                            </div>
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

        {/* Past Conferences */}
        {ended.length > 0 && (
          <FadeInUp delay={0.3}>
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mb-6">
                Past Conferences
              </h2>
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ended.map((conference) => (
                    <StaggerItem key={conference.id}>
                      <Link href={`/audio-conference/${conference.id}`}>
                        <div className="bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all p-6 cursor-pointer">
                          <div className="mb-4">
                            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium uppercase tracking-wide">
                              {conference.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                            {conference.title}
                          </h3>
                          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                            {conference.description}
                          </p>
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                              <img src={conference.speaker.image} alt={conference.speaker.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">{conference.speaker.name}</p>
                              <p className="text-xs text-gray-600">{conference.speaker.role}</p>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              Ended • {conference.participants} participants
                            </p>
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
      </main>

      <Footer />
    </div>
  );
}
