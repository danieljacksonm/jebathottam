'use client';

import { useState } from 'react';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';

export default function AdminNotes() {
  const [activeTab, setActiveTab] = useState<'notes' | 'sermons'>('notes');

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Notes & Sermons' },
      ]} />

      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              Notes & Sermons
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage notes, sermons, and teachings
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="secondary" size="lg" onClick={() => setActiveTab('notes')}>
              + New Note
            </Button>
            <Button size="lg" onClick={() => setActiveTab('sermons')}>
              + New Sermon
            </Button>
          </div>
        </div>
      </FadeInUp>

      {/* Tabs */}
      <FadeInUp delay={0.1}>
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'notes'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('sermons')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sermons'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Sermons
            </button>
          </nav>
        </div>
      </FadeInUp>

      {/* Content */}
      <FadeInUp delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notes */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Notes</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Prayer Meeting Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">January 15, 2024</p>
                <p className="text-gray-700 dark:text-gray-300">Key points from today's prayer meeting...</p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </Button>
                </div>
              </div>
              <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Bible Study Reflection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">January 12, 2024</p>
                <p className="text-gray-700 dark:text-gray-300">Insights from Romans study...</p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sermons */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Sermons</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Walking in Faith</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">January 14, 2024</p>
                <p className="text-gray-700 dark:text-gray-300">Sunday morning sermon on faith...</p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </Button>
                </div>
              </div>
              <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">The Power of Prayer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">January 7, 2024</p>
                <p className="text-gray-700 dark:text-gray-300">Midweek teaching on prayer...</p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
