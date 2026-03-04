'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { apiGet, apiPost } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Conference {
  id: number;
  title: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  scheduled_start?: string;
  scheduled_end?: string;
  actual_start?: string;
  actual_end?: string;
  jitsi_room_id: string;
  meeting_link: string;
  dial_in_pin: string;
  is_public: boolean;
  max_participants: number;
  creator_id: number;
}

export default function ConferencesPage() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_start: '',
    scheduled_end: '',
    is_public: false,
  });

  useEffect(() => {
    fetchConferences();
  }, []);

  async function fetchConferences() {
    try {
      setLoading(true);
      const data = await apiGet<{ success: boolean; data: Conference[] }>(
        '/conferences?limit=50'
      );
      if (data.success) {
        setConferences(data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateConference(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await apiPost<{
        success: boolean;
        data: Conference;
      }>('/conferences', {
        title: formData.title,
        description: formData.description,
        scheduled_start: formData.scheduled_start || null,
        scheduled_end: formData.scheduled_end || null,
        is_public: formData.is_public,
      });

      if (response.success) {
        setConferences([response.data, ...conferences]);
        setFormData({
          title: '',
          description: '',
          scheduled_start: '',
          scheduled_end: '',
          is_public: false,
        });
        setShowCreateForm(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  const live = conferences.filter((c) => c.status === 'live');
  const upcoming = conferences.filter((c) => c.status === 'scheduled');
  const ended = conferences.filter((c) => c.status === 'ended');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <FadeInUp>
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Video Conferences
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              India's Free Platform for <strong>Browser Calls</strong> + <strong>Phone Dial-in</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold"
              >
                {showCreateForm ? 'Cancel' : 'Start New Conference'}
              </Button>
              <Link href="/conferences/join">
                <Button className="px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold w-full">
                  Join Existing Conference
                </Button>
              </Link>
            </div>
          </div>
        </FadeInUp>

        {/* Create Form */}
        {showCreateForm && (
          <FadeInUp delay={0.1}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 mb-12 border border-blue-200 dark:border-gray-700">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                Create New Conference
              </h2>
              <form onSubmit={handleCreateConference} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Conference Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
                    placeholder="e.g., Weekly Prayer Meeting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
                    placeholder="Enter conference details..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Start Time (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_start}
                      onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      End Time (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_end}
                      onChange={(e) => setFormData({ ...formData, scheduled_end: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                  />
                  <label htmlFor="is_public" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Make public (anyone can join)
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
                >
                  Create Conference
                </Button>
              </form>
            </div>
          </FadeInUp>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading conferences...</p>
          </div>
        ) : (
          <>
            {/* Live Conferences */}
            {live.length > 0 && (
              <FadeInUp delay={0.2}>
                <div className="mb-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 dark:text-white">
                      Live Now
                    </h2>
                  </div>
                  <StaggerContainer>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {live.map((conference) => (
                        <StaggerItem key={conference.id}>
                          <ConferenceCard conference={conference} isLive />
                        </StaggerItem>
                      ))}
                    </div>
                  </StaggerContainer>
                </div>
              </FadeInUp>
            )}

            {/* Upcoming Conferences */}
            {upcoming.length > 0 && (
              <FadeInUp delay={0.3}>
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 dark:text-white mb-6">
                    Upcoming
                  </h2>
                  <StaggerContainer>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcoming.map((conference) => (
                        <StaggerItem key={conference.id}>
                          <ConferenceCard conference={conference} />
                        </StaggerItem>
                      ))}
                    </div>
                  </StaggerContainer>
                </div>
              </FadeInUp>
            )}

            {/* Past Conferences */}
            {ended.length > 0 && (
              <FadeInUp delay={0.4}>
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 dark:text-white mb-6">
                    Past Conferences
                  </h2>
                  <div className="space-y-4">
                    {ended.map((conference) => (
                      <ConferenceListItem key={conference.id} conference={conference} />
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {conferences.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No conferences yet. Click "Start New Conference" to create one!
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ConferenceCard({
  conference,
  isLive = false,
}: {
  conference: Conference;
  isLive?: boolean;
}) {
  return (
    <Link href={`/conferences/${conference.id}`}>
      <div
        className={`rounded-xl p-6 border-2 transition-all hover:shadow-xl cursor-pointer ${
          isLive
            ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-red-300 dark:border-red-600'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {conference.title}
            </h3>
            {conference.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {conference.description}
              </p>
            )}
          </div>
          {isLive && (
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold uppercase flex items-center space-x-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span>LIVE</span>
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4 text-sm">
          {conference.scheduled_start && (
            <p className="text-gray-600 dark:text-gray-400">
              📅 {new Date(conference.scheduled_start).toLocaleString()}
            </p>
          )}
          <p className="text-gray-700 dark:text-gray-300 font-semibold">
            Pin: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">{conference.dial_in_pin}</code>
          </p>
        </div>

        <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2 font-semibold">
          {isLive ? 'Join Now' : 'View Details'}
        </Button>
      </div>
    </Link>
  );
}

function ConferenceListItem({ conference }: { conference: Conference }) {
  return (
    <Link href={`/conferences/${conference.id}`}>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{conference.title}</h3>
            {conference.actual_end && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ended: {new Date(conference.actual_end).toLocaleString()}
              </p>
            )}
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            {conference.status}
          </span>
        </div>
      </div>
    </Link>
  );
}
