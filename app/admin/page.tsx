'use client';

import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { StatsCard } from '@/components/admin/stats-card';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Blog Posts', value: '24', icon: '📝', change: '+3 this month', trend: 'up' as const },
    { label: 'Upcoming Events', value: '8', icon: '📅', change: '2 this week', trend: 'neutral' as const },
    { label: 'Team Members', value: '12', icon: '👥', change: 'Active', trend: 'neutral' as const },
    { label: 'Stored Prophecies', value: '156', icon: '✨', change: '+12 this month', trend: 'up' as const },
    { label: 'Sermons Archive', value: '89', icon: '📖', change: '+5 this month', trend: 'up' as const },
    { label: 'Notes', value: '342', icon: '📄', change: '+28 this month', trend: 'up' as const },
  ];

  const recentActivity = [
    { type: 'Blog', action: 'New post published', title: 'The Power of Prophetic Words', time: '2 hours ago', icon: '📝' },
    { type: 'Event', action: 'Event created', title: 'Sunday Worship Service', time: '5 hours ago', icon: '📅' },
    { type: 'Team', action: 'Member added', title: 'Emily Rodriguez', time: '1 day ago', icon: '👥' },
    { type: 'Prophecy', action: 'New prophecy stored', title: 'January 2024 Prophecy', time: '2 days ago', icon: '✨' },
  ];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      
      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your ministry platform.
          </p>
        </div>
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
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{activity.icon}</span>
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
            ))}
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
