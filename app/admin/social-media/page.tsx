'use client';

import { useState, useEffect } from 'react';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import Link from 'next/link';

interface SocialMediaPost {
  id: number;
  title: string;
  content: string;
  media_type: string;
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  creator_name: string;
  published_count: number;
  total_platforms: number;
}

interface SocialMediaAccount {
  id: number;
  platform: string;
  account_name: string;
  account_username: string;
  status: string;
  last_posted_at: string | null;
  created_at: string;
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

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  publishing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export default function SocialMediaDashboard() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'accounts'>('posts');
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedToday: 0,
    scheduledPosts: 0,
    connectedAccounts: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load posts
      const postsRes = await fetch('/api/social-media/posts?limit=20');
      const postsData = await postsRes.json();
      setPosts(postsData.posts || []);

      // Load accounts
      const accountsRes = await fetch('/api/social-media/accounts');
      const accountsData = await accountsRes.json();
      setAccounts(accountsData.accounts || []);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const publishedToday = (postsData.posts || []).filter((p: SocialMediaPost) => 
        p.published_at && p.published_at.startsWith(today)
      ).length;
      
      const scheduledPosts = (postsData.posts || []).filter((p: SocialMediaPost) => 
        p.status === 'scheduled'
      ).length;

      setStats({
        totalPosts: postsData.pagination?.total || 0,
        publishedToday,
        scheduledPosts,
        connectedAccounts: accountsData.accounts?.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Social Media Manager' }
        ]} 
      />

      <FadeInUp>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
                Social Media Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Publish to all your social media platforms from one place
              </p>
            </div>
            <Link
              href="/admin/social-media/create"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              ✨ Create Post
            </Link>
          </div>
        </div>
      </FadeInUp>

      {/* Stats Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StaggerItem>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📊</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPosts}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Posts
              </h3>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🚀</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.publishedToday}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Published Today
              </h3>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⏰</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.scheduledPosts}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Scheduled Posts
              </h3>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🔗</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.connectedAccounts}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Connected Accounts
              </h3>
            </div>
          </StaggerItem>
        </div>
      </StaggerContainer>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'posts'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📝 Posts
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'accounts'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🔗 Connected Accounts
          </button>
        </div>
      </div>

      {/* Content */}
      <FadeInUp delay={0.3}>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : activeTab === 'posts' ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📱</span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first post to get started
                </p>
                <Link
                  href="/admin/social-media/create"
                  className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create Post
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                            {post.title || 'Untitled Post'}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[post.status] || statusColors.draft}`}>
                            {post.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>👤 {post.creator_name}</span>
                          <span>📅 {formatDate(post.created_at)}</span>
                          <span>
                            🌐 Published to {post.published_count}/{post.total_platforms} platforms
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/admin/social-media/posts/${post.id}`}
                          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/social-media/posts/${post.id}/edit`}
                          className="px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Connected Social Media Accounts
              </h2>
              <Link
                href="/admin/social-media/accounts/connect"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                + Connect Account
              </Link>
            </div>
            
            {accounts.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🔗</span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No accounts connected
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect your social media accounts to start posting
                </p>
                <Link
                  href="/admin/social-media/accounts/connect"
                  className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Connect Account
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{platformIcons[account.platform] || '🌐'}</span>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {account.account_name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            @{account.account_username || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        account.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {account.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <p>Last post: {formatDate(account.last_posted_at)}</p>
                      <p>Connected: {formatDate(account.created_at)}</p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Link
                        href={`/admin/social-media/accounts/${account.id}`}
                        className="flex-1 px-3 py-2 text-center text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-300 dark:border-gray-700"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </FadeInUp>
    </div>
  );
}
