'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { AudioWaveform } from '@/components/audio/audio-waveform';
import { audioConferences } from '@/data/audio-conference-content';

export default function AudioConferenceDetailPage({ params }: { params: { id: string } }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const conference = audioConferences.find(c => c.id === parseInt(params.id)) || audioConferences[0];
  const isLive = conference.status === 'live';

  const participants = [
    { id: 1, name: 'John Doe', isMuted: false, isSpeaking: true },
    { id: 2, name: 'Sarah Smith', isMuted: true, isSpeaking: false },
    { id: 3, name: 'Michael Chen', isMuted: false, isSpeaking: false },
    { id: 4, name: 'Emily Rodriguez', isMuted: false, isSpeaking: false },
    { id: 5, name: 'David Wilson', isMuted: true, isSpeaking: false },
  ];

  const chatMessages = [
    { id: 1, name: 'John Doe', message: 'Blessed to be here!', time: '19:05' },
    { id: 2, name: 'Sarah Smith', message: 'Amen! 🙏', time: '19:06' },
    { id: 3, name: 'Michael Chen', message: 'This is powerful', time: '19:07' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <FadeInUp>
            <div className="mb-6">
              <Link href="/audio-conference" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Conferences
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    {isLive && (
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium uppercase tracking-wide flex items-center space-x-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        <span>LIVE</span>
                      </span>
                    )}
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium uppercase tracking-wide">
                      {conference.category}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                    {conference.title}
                  </h1>
                  <p className="text-gray-600">{conference.description}</p>
                </div>
              </div>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Conference Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Speaker Section */}
              <FadeInUp delay={0.1}>
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary-100">
                      <img
                        src={conference.speaker.image}
                        alt={conference.speaker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">
                      {conference.speaker.name}
                    </h2>
                    <p className="text-gray-600">{conference.speaker.role}</p>
                  </div>

                  {/* Audio Waveform */}
                  <div className="mb-6">
                    <AudioWaveform isActive={isLive && !isMuted} />
                  </div>

                  {/* Recording Notice */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Recording in Progress</p>
                        <p className="text-xs text-yellow-700 mt-1">This conference is being recorded for archive purposes.</p>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      size="lg"
                      variant={isMuted ? 'secondary' : 'primary'}
                      onClick={() => setIsMuted(!isMuted)}
                      className="flex items-center space-x-2"
                    >
                      {isMuted ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          </svg>
                          <span>Unmute</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          <span>Mute</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant={isHandRaised ? 'primary' : 'secondary'}
                      onClick={() => setIsHandRaised(!isHandRaised)}
                      className="flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 103 0m-6-3V9m0 0v-1.5a1.5 1.5 0 013 0V9m0 0h6m-6 0h3m9 0V9m0 0v-1.5a1.5 1.5 0 00-3 0V9m0 0h-3m0 0v1.5a1.5 1.5 0 003 0V14m0-2.5h-3" />
                      </svg>
                      <span>{isHandRaised ? 'Lower Hand' : 'Raise Hand'}</span>
                    </Button>
                    {!isLive && (
                      <Button size="lg" variant="secondary" disabled>
                        Conference Ended
                      </Button>
                    )}
                  </div>
                </div>
              </FadeInUp>

              {/* Participants List */}
              <FadeInUp delay={0.2}>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Participants ({participants.length})
                  </h3>
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-semibold text-sm">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{participant.name}</p>
                            {participant.isSpeaking && (
                              <p className="text-xs text-primary-600">Speaking</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {participant.isMuted && (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                          )}
                          {participant.isSpeaking && (
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            </div>

            {/* Chat Panel */}
            <div className="lg:col-span-1">
              <FadeInUp delay={0.3}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[600px]">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900 text-sm">{msg.name}</span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <Button size="sm">Send</Button>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
