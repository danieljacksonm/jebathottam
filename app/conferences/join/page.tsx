'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { apiGet } from '@/lib/api';

export default function JoinConferencePage() {
  const router = useRouter();
  const [method, setMethod] = useState<'link' | 'pin'>('link');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoinByPin(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Search for conference by PIN
      const conferences = await apiGet<{
        success: boolean;
        data: Array<{ id: number; dial_in_pin: string }>;
      }>('/conferences?limit=100');

      if (conferences.success) {
        const found = conferences.data.find((c) => c.dial_in_pin === input.trim());
        if (found) {
          router.push(`/conferences/${found.id}`);
        } else {
          setError('Conference PIN not found.');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleJoinByLink(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const url = new URL(input.trim(), window.location.origin);
      const pathname = url.pathname;
      const match = pathname.match(/\/conferences\/(\d+)/);
      if (match && match[1]) {
        router.push(`/conferences/${match[1]}`);
      } else {
        setError('Invalid conference link.');
      }
    } catch {
      setError('Invalid URL format.');
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FadeInUp>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Join Conference
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Choose how you want to join
              </p>
            </div>

            {/* Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setMethod('link')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  method === 'link'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <div className="text-3xl mb-2">🔗</div>
                <h3 className="font-bold text-gray-900 dark:text-white">Via Link</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paste the meeting link</p>
              </button>

              <button
                onClick={() => setMethod('pin')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  method === 'pin'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-bold text-gray-900 dark:text-white">Via PIN</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enter the 6-digit PIN</p>
              </button>
            </div>

            {/* Form */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-blue-200 dark:border-gray-700">
              <form
                onSubmit={method === 'link' ? handleJoinByLink : handleJoinByPin}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {method === 'link' ? 'Conference Link' : 'Conference PIN'}
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      method === 'link'
                        ? 'https://your-domain.com/conferences/123'
                        : '000000'
                    }
                    className="w-full px-4 py-3 text-lg rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold"
                >
                  {loading ? 'Finding Conference...' : 'Join Conference'}
                </Button>
              </form>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  💡 Tips for Dial-in Users (No Internet)
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                  <li>✓ Call the conference dial-in number from your phone</li>
                  <li>✓ When prompted, enter the 6-digit PIN</li>
                  <li>✓ Say your name when asked</li>
                  <li>✓ Press # to confirm</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeInUp>
      </main>

      <Footer />
    </div>
  );
}
