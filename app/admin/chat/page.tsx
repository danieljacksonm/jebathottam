'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const conversations = [
  {
    id: 1,
    name: 'John Doe',
    lastMessage: 'Thank you for the prayer request',
    timestamp: '2 hours ago',
    unread: 2,
    avatar: 'JD',
  },
  {
    id: 2,
    name: 'Sarah Smith',
    lastMessage: 'Can I get more information about the event?',
    timestamp: '5 hours ago',
    unread: 0,
    avatar: 'SS',
  },
  {
    id: 3,
    name: 'Michael Chen',
    lastMessage: 'Blessed by today\'s sermon',
    timestamp: '1 day ago',
    unread: 1,
    avatar: 'MC',
  },
];

export default function AdminChat() {
  return (
    <div>
      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            Chat Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage conversations with ministry members
          </p>
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <FadeInUp delay={0.2}>
          <Card className="lg:col-span-1 dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {conversation.name}
                          </h3>
                          {conversation.unread > 0 && (
                            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {conversation.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Chat Window */}
        <FadeInUp delay={0.4}>
          <Card className="lg:col-span-2 dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  JD
                </div>
                <div>
                  <CardTitle>John Doe</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] overflow-y-auto space-y-4 mb-4">
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Hello, I have a prayer request
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10:30 AM</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-primary-600 text-white rounded-lg p-3">
                    <p className="text-sm">Of course, we'd be happy to pray for you.</p>
                    <p className="text-xs text-primary-100 mt-1">10:32 AM</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Thank you so much!
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10:35 AM</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                />
                <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Send
                </button>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </div>
  );
}
