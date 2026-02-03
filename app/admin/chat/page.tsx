'use client';

import { useState } from 'react';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { ChatWidget } from '@/components/chat/chat-widget';

export default function AdminChat() {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const recentConversations = [
    { id: 1, name: 'John Smith', lastMessage: 'Thank you for the prayer request', time: '2 hours ago', unread: 0 },
    { id: 2, name: 'Sarah Johnson', lastMessage: 'Can you help with the event?', time: '5 hours ago', unread: 2 },
    { id: 3, name: 'Michael Chen', lastMessage: 'I have a question about...', time: '1 day ago', unread: 0 },
    { id: 4, name: 'Emily Rodriguez', lastMessage: 'Prayer answered! Praise God!', time: '2 days ago', unread: 0 },
  ];

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Chat Management' },
      ]} />

      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              Chat Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Communicate with ministry members and respond to inquiries
            </p>
          </div>
        </div>
      </FadeInUp>

      {/* Tabs */}
      <FadeInUp delay={0.1}>
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'active'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Active Conversations
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'archived'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Archived
            </button>
          </nav>
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <FadeInUp delay={0.2}>
          <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Conversations</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-[600px] overflow-y-auto">
              {recentConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{conversation.name}</h4>
                    {conversation.unread > 0 && (
                      <span className="px-2 py-1 bg-primary-600 text-white rounded-full text-xs font-medium">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                    {conversation.lastMessage}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{conversation.time}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Chat Widget */}
        <FadeInUp delay={0.3}>
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
              <ChatWidget isAdmin={true} />
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
