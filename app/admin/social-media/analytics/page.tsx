'use client';

import { useState, useEffect } from 'react';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';

interface AnalyticsSummary {
  total_posts: number;
  total_accounts: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_views: number;
  total_reach: number;
  total_impressions: number;
  avg_engagement_rate: number;
}

interface PlatformStats {
  platform: string;
  post_count: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_views: number;
  avg_engagement_rate: number;
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

export default function SocialMediaAnalytics() {
  const [summary, setSummary] = useState<AnalyticsSummary>({
    total_posts: 0,
    total_accounts: 0,
    total_likes: 0,
    total_comments: 0,
    total_shares: 0,
    total_views: 0,
    total_reach: 0,
    total_impressions: 0,
    avg_engagement_rate: 0,
  });
  const [platformBreakdown, setPlatformBreakdown] = useState<PlatformStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      let url = '/api/social-media/analytics';
      const params = new URLSearchParams();
      
      if (dateRange.from) params.append('date_from', dateRange.from);
      if (dateRange.to) params.append('date_to', dateRange.to);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();

      setSummary(data.summary || {});
      setPlatformBreakdown(data.platformBreakdown || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    subtitle 
  }: { 
    icon: string; 
    title: string; 
    value: string | number; 
    subtitle?: string;
  }) => (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div>
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Social Media', href: '/admin/social-media' },
          { label: 'Analytics' }
        ]} 
      />

      <FadeInUp>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
                📊 Social Media Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your performance across all platforms
              </p>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Date Range Filter */}
      <FadeInUp delay={0.1}>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <div className="self-end">
              <button
                onClick={() => setDateRange({ from: '', to: '' })}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </FadeInUp>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StaggerItem>
                <StatCard
                  icon="❤️"
                  title="Total Likes"
                  value={formatNumber(summary.total_likes)}
                  subtitle="Across all platforms"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  icon="💬"
                  title="Total Comments"
                  value={formatNumber(summary.total_comments)}
                  subtitle="Engagement conversations"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  icon="🔄"
                  title="Total Shares"
                  value={formatNumber(summary.total_shares)}
                  subtitle="Content distribution"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  icon="👁️"
                  title="Total Views"
                  value={formatNumber(summary.total_views)}
                  subtitle="Content impressions"
                />
              </StaggerItem>
            </div>
          </StaggerContainer>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StaggerItem>
                <StatCard
                  icon="📈"
                  title="Total Reach"
                  value={formatNumber(summary.total_reach)}
                  subtitle="Unique accounts reached"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  icon="🎯"
                  title="Total Impressions"
                  value={formatNumber(summary.total_impressions)}
                  subtitle="Times content was displayed"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  icon="⚡"
                  title="Avg Engagement Rate"
                  value={`${summary.avg_engagement_rate?.toFixed(2) || 0}%`}
                  subtitle="Overall performance"
                />
              </StaggerItem>
            </div>
          </StaggerContainer>

          {/* Platform Breakdown */}
          <FadeInUp delay={0.3}>
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance by Platform
                </h2>
              </div>

              {platformBreakdown.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📊</span>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No analytics data yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start publishing posts to see analytics
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Platform
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Posts
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Comments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Shares
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Engagement
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {platformBreakdown.map((platform) => (
                        <tr
                          key={platform.platform}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{platformIcons[platform.platform] || '🌐'}</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {platform.platform}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {platform.post_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber(platform.total_likes)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber(platform.total_comments)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber(platform.total_shares)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {formatNumber(platform.total_views)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              platform.avg_engagement_rate > 5
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : platform.avg_engagement_rate > 2
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                              {platform.avg_engagement_rate?.toFixed(2) || 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </FadeInUp>
        </>
      )}
    </div>
  );
}
