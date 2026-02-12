'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { FadeInUp } from '@/components/animations/page-transition';

interface SocialMediaAccount {
  id: number;
  platform: string;
  account_name: string;
  account_username: string;
  status: string;
}

const platformIcons: Record<string, string> = {
  facebook: '📘',
  instagram: '📷',
  twitter: '🐦',
  linkedin: '💼',
  youtube: '📹',
  tiktok: '🎵',
  telegram: '✈️',
  whatsapp: '💬',
};

const mediaTypes = [
  { value: 'text', label: '📝 Text Only', icon: '📝' },
  { value: 'image', label: '🖼️ Image', icon: '🖼️' },
  { value: 'video', label: '🎥 Video', icon: '🎥' },
  { value: 'carousel', label: '🎠 Carousel', icon: '🎠' },
  { value: 'story', label: '📱 Story', icon: '📱' },
  { value: 'reel', label: '🎬 Reel/Short', icon: '🎬' },
];

export default function CreateSocialMediaPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    media_type: 'text',
    media_urls: [''],
    hashtags: '',
    status: 'draft',
    scheduled_at: '',
    publish_to_website: true,
    website_category: '',
  });

  const [publishNow, setPublishNow] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await fetch('/api/social-media/accounts?status=active');
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const handlePlatformToggle = (accountId: number) => {
    setSelectedPlatforms(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPlatforms.length === accounts.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(accounts.map(a => a.id));
    }
  };

  const addMediaUrl = () => {
    setFormData(prev => ({
      ...prev,
      media_urls: [...prev.media_urls, ''],
    }));
  };

  const updateMediaUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      media_urls: prev.media_urls.map((url, i) => i === index ? value : url),
    }));
  };

  const removeMediaUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media_urls: prev.media_urls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      alert('Please enter post content');
      return;
    }

    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    try {
      setLoading(true);

      // Clean up empty media URLs
      const cleanMediaUrls = formData.media_urls.filter(url => url.trim());

      // Create post
      const createResponse = await fetch('/api/social-media/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          media_urls: cleanMediaUrls,
          platforms: selectedPlatforms,
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create post');
      }

      const createData = await createResponse.json();
      const postId = createData.post.id;

      // If publish now is selected, publish immediately
      if (publishNow) {
        const publishResponse = await fetch(`/api/social-media/posts/${postId}/publish`, {
          method: 'POST',
        });

        if (!publishResponse.ok) {
          throw new Error('Post created but publishing failed');
        }

        const publishData = await publishResponse.json();
        alert(`✨ Post published to ${publishData.summary.success} platforms successfully!`);
      } else {
        alert('✅ Post created successfully!');
      }

      router.push('/admin/social-media');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const characterCount = formData.content.length;
  const twitterLimit = 280;
  const instagramLimit = 2200;

  return (
    <div>
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Social Media', href: '/admin/social-media' },
          { label: 'Create Post' }
        ]} 
      />

      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
            ✨ Create Social Media Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Post to multiple platforms simultaneously
          </p>
        </div>
      </FadeInUp>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Content */}
          <FadeInUp delay={0.1}>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Post Content
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    placeholder="Give your post a title..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Content *
                    </label>
                    <span className={`text-xs ${
                      characterCount > twitterLimit
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {characterCount} chars {characterCount > twitterLimit && '(⚠️ Too long for Twitter)'}
                    </span>
                  </div>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    placeholder="Write your post content here..."
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    💡 Tip: Keep it engaging and use hashtags for better reach
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={formData.hashtags}
                    onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    placeholder="#faith #ministry #blessed"
                  />
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Media */}
          <FadeInUp delay={0.2}>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Media
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Media Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mediaTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, media_type: type.value })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.media_type === type.value
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{type.icon}</span>
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.media_type !== 'text' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Media URLs
                      </label>
                      <button
                        type="button"
                        onClick={addMediaUrl}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        + Add URL
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.media_urls.map((url, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => updateMediaUrl(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                            placeholder="https://example.com/image.jpg"
                          />
                          {formData.media_urls.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMediaUrl(index)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FadeInUp>

          {/* Website Publishing */}
          <FadeInUp delay={0.3}>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Website Publishing
              </h2>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.publish_to_website}
                    onChange={(e) => setFormData({ ...formData, publish_to_website: e.target.checked })}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Also publish this post on the website
                  </span>
                </label>

                {formData.publish_to_website && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website Category
                    </label>
                    <input
                      type="text"
                      value={formData.website_category}
                      onChange={(e) => setFormData({ ...formData, website_category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Announcements, Updates, Events"
                    />
                  </div>
                )}
              </div>
            </div>
          </FadeInUp>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Select Platforms */}
          <FadeInUp delay={0.4}>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Platforms
                </h2>
                {accounts.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {selectedPlatforms.length === accounts.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              {accounts.length === 0 ? (
                <div className="text-center py-6">
                  <span className="text-4xl block mb-2">🔗</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    No accounts connected
                  </p>
                  <a
                    href="/admin/social-media/accounts/connect"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Connect Account →
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  {accounts.map((account) => (
                    <label
                      key={account.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPlatforms.includes(account.id)
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(account.id)}
                        onChange={() => handlePlatformToggle(account.id)}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-2xl">{platformIcons[account.platform] || '🌐'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {account.account_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{account.account_username || 'N/A'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
                </p>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={publishNow}
                      onChange={(e) => setPublishNow(e.target.checked)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      🚀 Publish immediately
                    </span>
                  </label>

                  {!publishNow && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Schedule for later
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.scheduled_at}
                        onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  {loading ? '⏳ Processing...' : publishNow ? '🚀 Publish Now' : '💾 Save Post'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </FadeInUp>
        </div>
      </form>
    </div>
  );
}
