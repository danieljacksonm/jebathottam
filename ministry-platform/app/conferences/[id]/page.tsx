'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { apiGet, apiPost } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/api-client';

interface Conference {
  id: number;
  title: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  jitsi_room_id: string;
  meeting_link: string;
  dial_in_pin: string;
  creator_id: number;
  is_public: boolean;
}

interface Participant {
  id: number;
  participant_name: string;
  participant_phone?: string;
  join_method: 'browser' | 'phone' | 'app';
  join_time: string;
  leave_time?: string;
  duration_seconds: number;
  is_admin: boolean;
}

export default function ConferenceRoomPage() {
  const params = useParams();
  const conferenceId = parseInt(params.id as string);
  const { user } = useAuth();

  const [conference, setConference] = useState<Conference | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const jitsiContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConferenceDetails();
    const interval = setInterval(fetchConferenceDetails, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [conferenceId]);

  async function fetchConferenceDetails() {
    try {
      const data = await apiGet<{
        success: boolean;
        data: {
          conference: Conference;
          participants: Participant[];
        };
      }>(`/conferences/${conferenceId}`);

      if (data.success) {
        setConference(data.data.conference);
        setParticipants(data.data.participants || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinConference(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await apiPost<{
        success: boolean;
        data: { jitsi_room_id: string; meeting_link: string };
      }>(`/conferences/${conferenceId}/join`, {
        participant_name: participantName || user?.name || 'Guest',
        join_method: 'browser',
      });

      if (response.success) {
        setJoined(true);
        setParticipantName('');
        setTimeout(() => loadJitsiIframe(response.data.jitsi_room_id), 500);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  function loadJitsiIframe(roomId: string) {
    if (jitsiContainer.current) {
      // Clear previous iframe
      jitsiContainer.current.innerHTML = '';

      // Create Jitsi iframe
      const jitsiDomain = 'meet.jit.si';
      const iframeElement = document.createElement('iframe');
      iframeElement.src = `https://${jitsiDomain}/${roomId}?userInfo.displayName="${participantName || user?.name || 'Participant'}"`;
      iframeElement.allow = 'camera; microphone; fullscreen; display-capture';
      iframeElement.allowFullscreen = true;
      iframeElement.className = 'w-full h-full rounded-lg';
      iframeElement.onload = () => setIframeLoaded(true);

      jitsiContainer.current.appendChild(iframeElement);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading conference...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
            Conference not found
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            {conference.title}
          </h1>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${
                conference.status === 'live'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {conference.status}
            </span>
            {participants.length > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                👥 {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Area */}
          <div className="lg:col-span-2">
            {!joined ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border-2 border-dashed border-blue-300 dark:border-gray-700 text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">📹</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ready to Join?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Enter your name to join this video conference
                  </p>
                </div>

                <form onSubmit={handleJoinConference} className="space-y-4 max-w-sm mx-auto">
                  <div>
                    <input
                      type="text"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      placeholder={user?.name || 'Your Name'}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
                  >
                    Join Video Conference
                  </Button>
                </form>
              </div>
            ) : (
              <div ref={jitsiContainer} className="bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: '500px' }}>
                {!iframeLoaded && (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <p className="text-white">Loading video conference...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Dial-in Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-xl p-6 border border-green-200 dark:border-green-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">📞 Dial-in (No Internet?)</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-1">
                    Conference PIN
                  </p>
                  <p className="text-2xl font-mono font-bold text-green-700 dark:text-green-300">
                    {conference.dial_in_pin}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    📍 India Free Dial-In
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Self-hosted Asterisk
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ℹ️ See setup docs
                  </p>
                </div>
              </div>
            </div>

            {/* Conference Info */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">ℹ️ Conference Info</h3>
              <div className="space-y-3 text-sm">
                {conference.description && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">{conference.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 uppercase font-semibold">Status</p>
                  <p className="text-gray-900 dark:text-white font-semibold capitalize">
                    {conference.status}
                  </p>
                </div>
              </div>

              {joined && (
                <Button
                  onClick={() => setJoined(false)}
                  className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                >
                  Leave Conference
                </Button>
              )}
            </div>

            {/* Participants List */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                👥 Participants ({participants.length})
              </h3>
              <div className="space-y-3">
                {participants.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No participants yet</p>
                ) : (
                  participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          participant.join_method === 'phone'
                            ? 'bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : 'bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {participant.join_method === 'phone' ? '☎️' : '💻'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {participant.participant_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {participant.join_method} • {formatDuration(participant.duration_seconds)}
                        </p>
                      </div>
                      {participant.is_admin && (
                        <span className="text-xs bg-yellow-200 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
}
