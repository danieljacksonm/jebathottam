'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/animations/page-transition';
import { Phone, Copy, Check, ExternalLink } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const JITSI_BASE = 'https://meet.jit.si';
const ROOM_PREFIX = 'Ministry';

export default function JoinConferencePage() {
  const searchParams = useSearchParams();
  const [meetingId, setMeetingId] = useState(() => {
    const id = searchParams.get('meetingId');
    return id && /^\d{6}$/.test(id) ? id : '';
  });
  const [copied, setCopied] = useState(false);

  const createMeeting = useCallback(() => {
    const newId = String(Math.floor(100000 + Math.random() * 900000));
    setMeetingId(newId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/audio-conference/join?meetingId=${newId}`);
    }
  }, []);

  const meetingUrl = meetingId.length === 6 ? `${JITSI_BASE}/${ROOM_PREFIX}-${meetingId}` : '';

  const copyMeetingId = () => {
    if (meetingId && navigator.clipboard) {
      navigator.clipboard.writeText(meetingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyMeetingLink = () => {
    if (meetingUrl && navigator.clipboard) {
      navigator.clipboard.writeText(meetingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FadeInUp>
          <div className="max-w-xl mx-auto">
            <Link
              href="/audio-conference"
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium mb-6 inline-flex items-center"
            >
              ← Back to Audio Conferences
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Join audio conference
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Free meetings powered by <strong>Jitsi Meet</strong>. One room for everyone — join in the browser or add phone participants via the phone icon inside the meeting.
            </p>

            {/* Meeting ID */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting ID (6 digits)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-lg tracking-widest text-center font-mono"
                />
                <Button type="button" variant="secondary" onClick={createMeeting}>
                  New
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={copyMeetingId}
                  disabled={meetingId.length !== 6}
                  title="Copy meeting ID"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Join meeting (Jitsi) */}
            <div className="mb-8 rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Join meeting
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Opens in a new tab. Everyone with this link or meeting ID is in the same room. Mute, video, and host controls are in Jitsi.
              </p>
              {meetingUrl ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium"
                  >
                    Open meeting (Jitsi) <ExternalLink className="w-4 h-4" />
                  </a>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={copyMeetingLink}
                    className="inline-flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy link
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-amber-700 dark:text-amber-400">Enter a 6-digit meeting ID above first.</p>
              )}
            </div>

            {/* Dial-in (via Jitsi) */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Add people by phone (no internet)
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                After you open the meeting in Jitsi, click the <strong>phone icon</strong> in the left toolbar. Jitsi will show dial-in numbers and a PIN. Share those with people who want to call in — they will join the same meeting.
              </p>
            </div>
          </div>
        </FadeInUp>
      </main>

      <Footer />
    </div>
  );
}
