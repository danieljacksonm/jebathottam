'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/animations/page-transition';
import { Phone, Copy, Check, Loader2, Video, Users, PhoneCall, PhoneIncoming } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { usePublicSettings } from '@/lib/public-settings';

const JITSI_DOMAIN = 'meet.jit.si';
const ROOM_PREFIX = 'JebathottamMinistry';

interface DialInNumber {
  country: string;
  countryCode: string;
  number: string;
  formattedNumber: string;
}


function getFlagEmoji(countryCode: string): string {
  const cc = countryCode.toUpperCase();
  return String.fromCodePoint(...[...cc].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

function JoinConferenceContent() {
  const searchParams = useSearchParams();
  const settings = usePublicSettings();
  const [meetingId, setMeetingId] = useState(() => {
    const id = searchParams.get('meetingId');
    return id && /^\d{6}$/.test(id) ? id : '';
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [inMeeting, setInMeeting] = useState(false);
  const [dialInNumbers, setDialInNumbers] = useState<DialInNumber[]>([]);
  const [dialInPin, setDialInPin] = useState('');
  const [loadingDialIn, setLoadingDialIn] = useState(false);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  const roomName = meetingId.length === 6 ? `${ROOM_PREFIX}${meetingId}` : '';

  const createMeeting = useCallback(() => {
    const newId = String(Math.floor(100000 + Math.random() * 900000));
    setMeetingId(newId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/audio-conference/join?meetingId=${newId}`);
    }
  }, []);

  const copyText = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const fetchDialInNumbers = useCallback(async (room: string) => {
    setLoadingDialIn(true);
    try {
      const res = await fetch('/api/settings?scope=public');
      const data = res.ok ? await res.json() : { data: {} };
      const s = data?.data || {};
      const pin = (s.dial_in_pin || '').trim() || room.replace(ROOM_PREFIX, '').slice(-6) || meetingId;
      setDialInPin(pin);
      const nums: DialInNumber[] = [];
      if ((s.dial_in_india || '').trim()) {
        nums.push({ country: 'India', countryCode: 'IN', number: s.dial_in_india.trim(), formattedNumber: s.dial_in_india.trim() });
      }
      if ((s.dial_in_us || '').trim()) {
        nums.push({ country: 'United States', countryCode: 'US', number: s.dial_in_us.trim(), formattedNumber: s.dial_in_us.trim() });
      }
      if ((s.dial_in_uk || '').trim()) {
        nums.push({ country: 'United Kingdom', countryCode: 'GB', number: s.dial_in_uk.trim(), formattedNumber: s.dial_in_uk.trim() });
      }
      if (nums.length > 0) {
        setDialInNumbers(nums);
      } else {
        setDialInNumbers([
          { country: 'India', countryCode: 'IN', number: '+91 22 4970 4059', formattedNumber: '+91 22 4970 4059' },
          { country: 'United States', countryCode: 'US', number: '+1 (605) 475-4000', formattedNumber: '+1 (605) 475-4000' },
          { country: 'United Kingdom', countryCode: 'GB', number: '+44 330 001 0116', formattedNumber: '+44 330 001 0116' },
        ]);
      }
    } catch {
      setDialInNumbers([
        { country: 'India', countryCode: 'IN', number: '+91 22 4970 4059', formattedNumber: '+91 22 4970 4059' },
        { country: 'United States', countryCode: 'US', number: '+1 (605) 475-4000', formattedNumber: '+1 (605) 475-4000' },
        { country: 'United Kingdom', countryCode: 'GB', number: '+44 330 001 0116', formattedNumber: '+44 330 001 0116' },
      ]);
    } finally {
      setLoadingDialIn(false);
    }
  }, [meetingId]);

  const startMeeting = useCallback(() => {
    if (!roomName || !jitsiContainerRef.current) return;

    setInMeeting(true);
    fetchDialInNumbers(roomName);

    const loadJitsi = () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }

      const options = {
        roomName,
        parentNode: jitsiContainerRef.current,
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: true,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          enableClosePage: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: '#111827',
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'chat',
            'raisehand', 'participants-pane', 'tileview',
            'select-background', 'hangup', 'invite',
          ],
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          MOBILE_APP_PROMO: false,
        },
      };

      // @ts-expect-error JitsiMeetExternalAPI is loaded from script
      const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, options);
      jitsiApiRef.current = api;

      api.addListener('readyToClose', () => {
        setInMeeting(false);
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        }
      });
    };

    if ((window as any).JitsiMeetExternalAPI) {
      loadJitsi();
    } else {
      const script = document.createElement('script');
      script.src = `https://${JITSI_DOMAIN}/external_api.js`;
      script.async = true;
      script.onload = loadJitsi;
      document.head.appendChild(script);
    }
  }, [roomName, fetchDialInNumbers]);

  useEffect(() => {
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, []);

  if (inMeeting) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-5rem)]">
        <div className="flex-1 min-h-[400px] lg:min-h-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900">
          <div ref={jitsiContainerRef} className="w-full h-full" />
        </div>

        <div className="lg:w-80 flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Dial-in Numbers
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Share these with people who want to join by phone
            </p>

            {dialInPin && (
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Meeting PIN</div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-mono font-bold text-primary-700 dark:text-primary-300 tracking-widest">
                    {dialInPin}
                  </span>
                  <button
                    onClick={() => copyText(dialInPin, 'pin')}
                    className="text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 p-1.5 rounded-md transition-colors"
                  >
                    {copied === 'pin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {loadingDialIn ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : dialInNumbers.length > 0 ? (
              <div className="space-y-2">
                {dialInNumbers.map((num, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      num.countryCode === 'IN'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFlagEmoji(num.countryCode)}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {num.country}
                        </span>
                        {num.countryCode === 'IN' && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-600 text-white rounded-full font-semibold">
                            INDIA
                          </span>
                        )}
                      </div>
                      <a
                        href={`tel:${num.number}`}
                        className="text-sm font-mono text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {num.formattedNumber}
                      </a>
                    </div>
                    <button
                      onClick={() => copyText(num.number, `num-${i}`)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copied === `num-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Dial-in numbers will appear once the meeting starts.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Click the phone icon inside the meeting to see dial-in options.
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => copyText(
                  `Join our meeting:\nMeeting ID: ${meetingId}\n${dialInPin ? `PIN: ${dialInPin}\n` : ''}Link: https://${JITSI_DOMAIN}/${roomName}${dialInNumbers.length > 0 ? `\n\nDial-in:\n${dialInNumbers.slice(0, 3).map(n => `${n.country}: ${n.formattedNumber}`).join('\n')}` : ''}`,
                  'all'
                )}
                className="w-full py-2.5 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {copied === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                Copy invite details
              </button>
            </div>

            <div className="mt-3">
              <button
                onClick={() => {
                  if (jitsiApiRef.current) {
                    jitsiApiRef.current.dispose();
                    jitsiApiRef.current = null;
                  }
                  setInMeeting(false);
                }}
                className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Leave meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dialNumbers: DialInNumber[] = [];
  if ((settings.dial_in_india || '').trim()) dialNumbers.push({ country: 'India', countryCode: 'IN', number: settings.dial_in_india.trim(), formattedNumber: settings.dial_in_india.trim() });
  if ((settings.dial_in_us || '').trim()) dialNumbers.push({ country: 'United States', countryCode: 'US', number: settings.dial_in_us.trim(), formattedNumber: settings.dial_in_us.trim() });
  if ((settings.dial_in_uk || '').trim()) dialNumbers.push({ country: 'United Kingdom', countryCode: 'GB', number: settings.dial_in_uk.trim(), formattedNumber: settings.dial_in_uk.trim() });
  const accessCode = (settings.dial_in_pin || '').trim();
  const webUrl = (settings.conference_web_url || '').trim();
  const hasFccStyle = dialNumbers.length > 0 || webUrl;

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/audio-conference"
        className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium mb-6 inline-flex items-center"
      >
        &larr; Back to Audio Conferences
      </Link>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
        Audio Conference
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Join our ministry line (dial-in or web) or start an instant meeting.
      </p>

      {/* Free Conference Call style: fixed dial-in + web link */}
      {hasFccStyle && (
        <div className="mb-8 rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
              <PhoneIncoming className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ministry conference line</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Like Free Conference Call — same numbers every time</p>
            </div>
          </div>
          {dialNumbers.length > 0 && (
            <div className="space-y-2 mb-4">
              {dialNumbers.map((num, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <span className="text-lg mr-2">{getFlagEmoji(num.countryCode)}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white flex-1">{num.country}</span>
                  <a href={`tel:${num.number}`} className="text-sm font-mono text-primary-600 dark:text-primary-400 font-semibold">{num.formattedNumber}</a>
                  <button type="button" onClick={() => copyText(num.number, `dial-${i}`)} className="ml-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                    {copied === `dial-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}
          {accessCode && (
            <div className="mb-4 flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Access code / PIN</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{accessCode}</span>
              <button type="button" onClick={() => copyText(accessCode, 'pin')} className="ml-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                {copied === 'pin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
          {webUrl && (
            <a
              href={webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-center transition-colors"
            >
              Join online (open in new tab)
            </a>
          )}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Or: Instant meeting — Meeting ID (6 digits)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-lg tracking-widest text-center font-mono focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          <Button type="button" variant="secondary" onClick={createMeeting}>
            New
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => copyText(meetingId, 'id')}
            disabled={meetingId.length !== 6}
            title="Copy meeting ID"
          >
            {copied === 'id' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Instant meeting (Jitsi)</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Conference opens here in the browser</p>
          </div>
        </div>
        {meetingId.length === 6 ? (
          <button
            onClick={startMeeting}
            className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Users className="w-5 h-5" />
            Start / Join Conference
          </button>
        ) : (
          <p className="text-sm text-amber-700 dark:text-amber-400 text-center py-2">
            Enter or create a 6-digit meeting ID first
          </p>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        For the instant meeting, dial-in numbers are also shown in the sidebar after you start.
      </p>
    </div>
  );
}

function getCountryName(code: string): string {
  const names: Record<string, string> = {
    IN: 'India', US: 'United States', GB: 'United Kingdom', DE: 'Germany',
    FR: 'France', ES: 'Spain', IT: 'Italy', BR: 'Brazil', AU: 'Australia',
    CA: 'Canada', JP: 'Japan', KR: 'South Korea', MX: 'Mexico', NL: 'Netherlands',
    PL: 'Poland', SE: 'Sweden', CH: 'Switzerland', AT: 'Austria', BE: 'Belgium',
    CZ: 'Czech Republic', DK: 'Denmark', FI: 'Finland', HU: 'Hungary', IE: 'Ireland',
    NO: 'Norway', PT: 'Portugal', RO: 'Romania', SG: 'Singapore', ZA: 'South Africa',
  };
  return names[code.toUpperCase()] || code;
}

export default function JoinConferencePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FadeInUp>
          <Suspense fallback={
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          }>
            <JoinConferenceContent />
          </Suspense>
        </FadeInUp>
      </main>

      <Footer />
    </div>
  );
}
