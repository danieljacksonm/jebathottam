'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { ministryInfo, missionVision } from '@/data/demo-content';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

const TOAST_DURATION = 4000;

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1];
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[100] flex flex-col gap-2 pointer-events-none sm:max-w-sm sm:w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm animate-slide-in-right ${
            toast.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
          role="alert"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          )}
          <span className="flex-1 break-words">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: 'success' | 'error', message: string) => {
      const id = ++nextId.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), TOAST_DURATION);
      return id;
    },
    [dismiss]
  );

  return { toasts, addToast, dismiss };
}

const DEFAULTS: Record<string, string> = {
  ministry_name: ministryInfo.name,
  ministry_subtitle: ministryInfo.subtitle,
  ministry_tagline: ministryInfo.tagline,
  ministry_scripture: ministryInfo.scripture,
  ministry_email: ministryInfo.email,
  ministry_phone: ministryInfo.phone,
  ministry_address: ministryInfo.address,
  about_heading: 'About Us',
  about_text: '',
  about_text_secondary: '',
  mission_title: missionVision.mission.title,
  mission_description: missionVision.mission.description,
  vision_title: missionVision.vision.title,
  vision_description: missionVision.vision.description,
  logo_url: 'https://jesusisthewayjebathottam.com/images/logo.png',
  primary_color: '#4f46e5',
  dial_in_india: '+91 22 4970 4059',
  dial_in_us: '+1 (605) 475-4000',
  dial_in_uk: '+44 330 001 0116',
  dial_in_pin: '',
  conference_web_url: 'https://join.freeconferencecall.com/jesusisthewayjebathottam',
};

type SectionKey = 'general' | 'about' | 'mission' | 'brand' | 'dialin';

const SECTION_KEYS: Record<SectionKey, string[]> = {
  general: [
    'ministry_name',
    'ministry_subtitle',
    'ministry_tagline',
    'ministry_scripture',
    'ministry_email',
    'ministry_phone',
    'ministry_address',
  ],
  about: ['about_heading', 'about_text', 'about_text_secondary'],
  mission: ['mission_title', 'mission_description', 'vision_title', 'vision_description'],
  brand: ['logo_url', 'primary_color'],
  dialin: ['dial_in_india', 'dial_in_us', 'dial_in_uk', 'dial_in_pin', 'conference_web_url'],
};

const inputClass =
  'w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors';

const textareaClass =
  'w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-y min-h-[100px]';

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {children}
    </label>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({ ...DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null);
  const { toasts, addToast, dismiss } = useToasts();

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load settings');
      const json = await res.json();
      const data: Record<string, string> = json.data ?? {};
      setSettings((prev) => {
        const merged = { ...prev };
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string') merged[key] = value;
        }
        return merged;
      });
    } catch {
      addToast('error', 'Failed to load settings. Using defaults.');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSection = async (section: SectionKey, label: string) => {
    setSavingSection(section);
    try {
      const keys = SECTION_KEYS[section];
      const body: Record<string, string> = {};
      for (const k of keys) {
        body[k] = settings[k] ?? DEFAULTS[k] ?? '';
      }
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Save failed');
      addToast('success', `${label} saved successfully.`);
    } catch {
      addToast('error', `Failed to save ${label.toLowerCase()}.`);
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 dark:text-primary-400" />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <Breadcrumbs
        items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Settings' },
        ]}
      />

      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your ministry platform settings</p>
        </div>
      </FadeInUp>

      <div className="space-y-6">
        {/* General Settings */}
        <FadeInUp delay={0.05}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <FieldLabel htmlFor="ministry_name">Ministry Name</FieldLabel>
                <input
                  id="ministry_name"
                  type="text"
                  className={inputClass}
                  value={settings.ministry_name}
                  onChange={(e) => handleChange('ministry_name', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="ministry_subtitle">Subtitle</FieldLabel>
                <input
                  id="ministry_subtitle"
                  type="text"
                  className={inputClass}
                  value={settings.ministry_subtitle}
                  onChange={(e) => handleChange('ministry_subtitle', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="ministry_tagline">Tagline</FieldLabel>
                <input
                  id="ministry_tagline"
                  type="text"
                  className={inputClass}
                  value={settings.ministry_tagline}
                  onChange={(e) => handleChange('ministry_tagline', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="ministry_scripture">Scripture</FieldLabel>
                <input
                  id="ministry_scripture"
                  type="text"
                  className={inputClass}
                  value={settings.ministry_scripture}
                  onChange={(e) => handleChange('ministry_scripture', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="ministry_email">Email</FieldLabel>
                <input
                  id="ministry_email"
                  type="email"
                  className={inputClass}
                  value={settings.ministry_email}
                  onChange={(e) => handleChange('ministry_email', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="ministry_phone">Phone</FieldLabel>
                <input
                  id="ministry_phone"
                  type="tel"
                  className={inputClass}
                  value={settings.ministry_phone}
                  onChange={(e) => handleChange('ministry_phone', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="ministry_address">Address</FieldLabel>
                <input
                  id="ministry_address"
                  type="text"
                  className={inputClass}
                  value={settings.ministry_address}
                  onChange={(e) => handleChange('ministry_address', e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  disabled={savingSection === 'general'}
                  onClick={() => saveSection('general', 'General settings')}
                >
                  {savingSection === 'general' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving…
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* About Us */}
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About Us Section</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <FieldLabel htmlFor="about_heading">Heading</FieldLabel>
                <input
                  id="about_heading"
                  type="text"
                  className={inputClass}
                  value={settings.about_heading}
                  onChange={(e) => handleChange('about_heading', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="about_text">About Text</FieldLabel>
                <textarea
                  id="about_text"
                  className={textareaClass}
                  rows={4}
                  value={settings.about_text}
                  onChange={(e) => handleChange('about_text', e.target.value)}
                  placeholder="Main paragraph about your ministry…"
                />
              </div>
              <div>
                <FieldLabel htmlFor="about_text_secondary">Secondary Paragraph</FieldLabel>
                <textarea
                  id="about_text_secondary"
                  className={textareaClass}
                  rows={3}
                  value={settings.about_text_secondary}
                  onChange={(e) => handleChange('about_text_secondary', e.target.value)}
                  placeholder="Additional paragraph (optional)…"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  disabled={savingSection === 'about'}
                  onClick={() => saveSection('about', 'About Us section')}
                >
                  {savingSection === 'about' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving…
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Mission & Vision */}
        <FadeInUp delay={0.15}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mission &amp; Vision</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Mission
                  </h3>
                  <div>
                    <FieldLabel htmlFor="mission_title">Title</FieldLabel>
                    <input
                      id="mission_title"
                      type="text"
                      className={inputClass}
                      value={settings.mission_title}
                      onChange={(e) => handleChange('mission_title', e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="mission_description">Description</FieldLabel>
                    <textarea
                      id="mission_description"
                      className={textareaClass}
                      rows={4}
                      value={settings.mission_description}
                      onChange={(e) => handleChange('mission_description', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Vision
                  </h3>
                  <div>
                    <FieldLabel htmlFor="vision_title">Title</FieldLabel>
                    <input
                      id="vision_title"
                      type="text"
                      className={inputClass}
                      value={settings.vision_title}
                      onChange={(e) => handleChange('vision_title', e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="vision_description">Description</FieldLabel>
                    <textarea
                      id="vision_description"
                      className={textareaClass}
                      rows={4}
                      value={settings.vision_description}
                      onChange={(e) => handleChange('vision_description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  disabled={savingSection === 'mission'}
                  onClick={() => saveSection('mission', 'Mission & Vision')}
                >
                  {savingSection === 'mission' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving…
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Logo & Brand Colors */}
        <FadeInUp delay={0.17}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Logo &amp; Brand</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Logo from your site. Primary color (hex) matches site accents.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <FieldLabel htmlFor="logo_url">Logo URL</FieldLabel>
                <input
                  id="logo_url"
                  type="url"
                  placeholder="https://jesusisthewayjebathottam.com/images/logo.png"
                  className={inputClass}
                  value={settings.logo_url ?? ''}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="primary_color">Primary Color (hex, e.g. #4f46e5)</FieldLabel>
                <div className="flex gap-2">
                  <input
                    id="primary_color"
                    type="text"
                    placeholder="#4f46e5"
                    className={inputClass}
                    value={settings.primary_color ?? ''}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                  />
                  <input
                    type="color"
                    className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    value={settings.primary_color?.startsWith('#') ? settings.primary_color : '#4f46e5'}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button disabled={savingSection === 'brand'} onClick={() => saveSection('brand', 'Logo & Brand')}>
                  {savingSection === 'brand' ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Dial-in Numbers (Your Own) */}
        <FadeInUp delay={0.18}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dial-in Numbers</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your own numbers (from Twilio, etc.). Shown in conference page.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <FieldLabel htmlFor="dial_in_india">India</FieldLabel>
                <input id="dial_in_india" type="tel" placeholder="+91 22 4970 4059" className={inputClass} value={settings.dial_in_india ?? ''} onChange={(e) => handleChange('dial_in_india', e.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="dial_in_us">United States</FieldLabel>
                <input id="dial_in_us" type="tel" placeholder="+1 (605) 475-4000" className={inputClass} value={settings.dial_in_us ?? ''} onChange={(e) => handleChange('dial_in_us', e.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="dial_in_uk">United Kingdom</FieldLabel>
                <input id="dial_in_uk" type="tel" placeholder="+44 330 001 0116" className={inputClass} value={settings.dial_in_uk ?? ''} onChange={(e) => handleChange('dial_in_uk', e.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="dial_in_pin">Meeting PIN / Access code (optional)</FieldLabel>
                <input id="dial_in_pin" type="text" placeholder="123456" className={inputClass} value={settings.dial_in_pin ?? ''} onChange={(e) => handleChange('dial_in_pin', e.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="conference_web_url">Conference web link (Free Conference Call style)</FieldLabel>
                <input id="conference_web_url" type="url" placeholder="https://join.freeconferencecall.com/your-room" className={inputClass} value={settings.conference_web_url ?? ''} onChange={(e) => handleChange('conference_web_url', e.target.value)} />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">e.g. Free Conference Call join URL. Leave empty to hide &quot;Join online&quot;.</p>
              </div>
              <div className="flex justify-end pt-2">
                <Button disabled={savingSection === 'dialin'} onClick={() => saveSection('dialin', 'Dial-in numbers')}>
                  {savingSection === 'dialin' ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Security */}
        <FadeInUp delay={0.2}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Change Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className={inputClass}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="secondary">Update Password</Button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Appearance */}
        <FadeInUp delay={0.25}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Theme preference is managed globally. Use the theme toggle in the header to switch between light and
                dark mode.
              </p>
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
