'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { FadeInUp } from '@/components/animations/page-transition';

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-600' },
  { id: 'twitter', name: 'Twitter / X', icon: '🐦', color: 'bg-sky-600' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
  { id: 'youtube', name: 'YouTube', icon: '📹', color: 'bg-red-600' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', color: 'bg-blue-500' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'bg-green-600' },
];

export default function ConnectSocialMediaAccount() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    account_name: '',
    account_username: '',
    account_id: '',
    page_id: '',
    access_token: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlatform) {
      alert('Please select a platform');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/social-media/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          ...formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to connect account');
      }

      alert('✅ Account connected successfully!');
      router.push('/admin/social-media');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Social Media', href: '/admin/social-media' },
          { label: 'Connect Account' }
        ]} 
      />

      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
            🔗 Connect Social Media Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your social media accounts to start publishing
          </p>
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Platform Selection */}
        <div className="lg:col-span-1">
          <FadeInUp delay={0.1}>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Platform
              </h2>
              <div className="space-y-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      selectedPlatform === platform.id
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-3xl">{platform.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {platform.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </FadeInUp>
        </div>

        {/* Account Details Form */}
        <div className="lg:col-span-2">
          <FadeInUp delay={0.2}>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Account Details
              </h2>

              {!selectedPlatform ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">👈</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please select a platform to continue
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">ℹ️</span>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                          How to connect {platforms.find(p => p.id === selectedPlatform)?.name}
                        </h3>
                        <p className="text-xs text-blue-800 dark:text-blue-400">
                          You'll need to provide access tokens from the platform's developer console.
                          For production use, follow the platform's OAuth flow to get proper credentials.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Name *
                    </label>
                    <input
                      type="text"
                      value={formData.account_name}
                      onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      placeholder="My Church Facebook Page"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username / Handle
                    </label>
                    <input
                      type="text"
                      value={formData.account_username}
                      onChange={(e) => setFormData({ ...formData, account_username: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      placeholder="@mychurch"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account ID
                    </label>
                    <input
                      type="text"
                      value={formData.account_id}
                      onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      placeholder="Platform-specific account ID"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Optional: The unique ID from the platform
                    </p>
                  </div>

                  {['facebook', 'instagram'].includes(selectedPlatform) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Page ID
                      </label>
                      <input
                        type="text"
                        value={formData.page_id}
                        onChange={(e) => setFormData({ ...formData, page_id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        placeholder="Your page ID"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Access Token
                    </label>
                    <textarea
                      value={formData.access_token}
                      onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-mono text-xs"
                      placeholder="Paste your access token here"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Get this from the platform's developer console
                    </p>
                  </div>

                  {/* Warning Box */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">⚠️</span>
                      <div className="flex-1">
                        <h3 className="text-xs font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                          Security Note
                        </h3>
                        <p className="text-xs text-yellow-800 dark:text-yellow-400">
                          Access tokens should be kept secure. In production, implement proper OAuth flows
                          and token refresh mechanisms for each platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                      {loading ? '⏳ Connecting...' : '🔗 Connect Account'}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
