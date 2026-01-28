'use client';

import { useState } from 'react';
import { FadeInUp } from '@/components/animations/page-transition';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { ChatWidget } from '@/components/chat/chat-widget';

export default function AdminChat() {
  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Chat' },
      ]} />

      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
            Chat Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Communicate with ministry members and respond to inquiries
          </p>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="max-w-4xl mx-auto">
            <ChatWidget isAdmin={true} />
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
