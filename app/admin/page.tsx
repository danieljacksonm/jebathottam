'use client';

import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Blog Posts', value: '24', icon: '📝', change: '+3 this month' },
    { label: 'Upcoming Events', value: '8', icon: '📅', change: '2 this week' },
    { label: 'Team Members', value: '12', icon: '👥', change: 'Active' },
    { label: 'Stored Prophecies', value: '156', icon: '✨', change: '+12 this month' },
    { label: 'Sermons Archive', value: '89', icon: '📖', change: '+5 this month' },
    { label: 'Notes', value: '342', icon: '📄', change: '+28 this month' },
  ];

  const recentActivity = [
    { type: 'Blog', action: 'New post published', title: 'The Power of Prophetic Words', time: '2 hours ago' },
    { type: 'Event', action: 'Event created', title: 'Sunday Worship Service', time: '5 hours ago' },
    { type: 'Team', action: 'Member added', title: 'Emily Rodriguez', time: '1 day ago' },
    { type: 'Prophecy', action: 'New prophecy stored', title: 'January 2024 Prophecy', time: '2 days ago' },
  ];

  return (
    <div>
      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's an overview of your ministry platform.
          </p>
        </div>
      </FadeInUp>

      {/* Stats Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div className="text-4xl">{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>

      {/* Recent Activity */}
      <FadeInUp delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{activity.type === 'Blog' ? '📝' : activity.type === 'Event' ? '📅' : activity.type === 'Team' ? '👥' : '✨'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.title}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeInUp>
    </div>
  );
}
