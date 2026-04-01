'use client';

import { useState } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { StatsCard } from '@/components/admin/stats-card';
import { Button } from '@/components/ui/button';
import { statsIcons } from '@/components/ui/icons';
import { Database, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const handleSeedExample = async () => {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const res = await fetch('/api/seed', { method: 'POST', credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Seed failed');
      const parts = [];
      if (data.slider_inserted) parts.push('slider');
      if (data.testimonies_inserted) parts.push('testimonies');
      setSeedMessage(parts.length ? `Added example ${parts.join(' and ')} to the database.` : 'Database already has content. Nothing added.');
    } catch (e: any) {
      setSeedMessage(e.message || 'Seed failed');
    } finally {
      setSeeding(false);
    }
  };

  const stats = [
    { title: 'Total Blog Posts', value: '24', icon: statsIcons.blog, change: '+3 this month', trend: 'up' as const },
    { title: 'Upcoming Events', value: '8', icon: statsIcons.events, change: '2 this week', trend: 'neutral' as const },
    { title: 'Team Members', value: '12', icon: statsIcons.team, change: 'Active', trend: 'neutral' as const },
    { title: 'Stored Prophecies', value: '156', icon: statsIcons.prophecy, change: '+12 this month', trend: 'up' as const },
    { title: 'Sermons Archive', value: '89', icon: statsIcons.sermons, change: '+5 this month', trend: 'up' as const },
    { title: 'Notes', value: '342', icon: statsIcons.notes, change: '+28 this month', trend: 'up' as const },
  ];

  const recentActivity = [
    { type: 'Blog', action: 'New post published', title: 'The Power of Prophetic Words', time: '2 hours ago', icon: statsIcons.blog },
    { type: 'Event', action: 'Event created', title: 'Sunday Worship Service', time: '5 hours ago', icon: statsIcons.events },
    { type: 'Team', action: 'Member added', title: 'Emily Rodriguez', time: '1 day ago', icon: statsIcons.team },
    { type: 'Prophecy', action: 'New prophecy stored', title: 'January 2024 Prophecy', time: '2 days ago', icon: statsIcons.prophecy },
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      
      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here&apos;s an overview of your ministry platform.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleSeedExample}
            disabled={seeding}
            className="w-full sm:w-auto shrink-0"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
            Seed example content
          </Button>
        </div>
        {seedMessage && (
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
            {seedMessage}
          </p>
        )}
      </FadeInUp>

      {/* Stats Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <StatsCard {...stat} />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Recent Activity */}
      <FadeInUp delay={0.4}>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {recentActivity.map((activity, index) => {
              const ActivityIcon = activity.icon;
              return (
              <div
                key={index}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-600 dark:text-primary-400">
                    <ActivityIcon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activity.title}
                    </p>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
