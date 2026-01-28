'use client';

import { useState } from 'react';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';

export default function AdminProphecy() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Prophecy Storage' },
      ]} />

      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              Prophecy Storage
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Store and preserve God-spoken words and prophecies
            </p>
          </div>
          <Button size="lg" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Store New Prophecy'}
          </Button>
        </div>
      </FadeInUp>

      {/* Add Form */}
      {showForm && (
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Store New Prophecy
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Prophecy title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prophecy Content
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[200px] dark:bg-gray-800 dark:text-white"
                  placeholder="Enter the prophecy word..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Received
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white">
                    <option>Pending Verification</option>
                    <option>Verified</option>
                    <option>Archived</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button>Store Prophecy</Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {/* Prophecies List */}
      <FadeInUp delay={0.2}>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Prophecies</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">January 2024 Prophecy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Received: January 15, 2024</p>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm font-medium">
                  Verified
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                "The Lord says, 'I am bringing a season of restoration and renewal. Trust in My timing, for I am working all things together for your good...'"
              </p>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">
                  View Full
                </Button>
                <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  Delete
                </Button>
              </div>
            </div>

            <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">December 2023 Prophecy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Received: December 28, 2023</p>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm font-medium">
                  Verified
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                "My children, prepare your hearts for what I am about to do. This is a time of preparation and alignment..."
              </p>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">
                  View Full
                </Button>
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
      </FadeInUp>
    </div>
  );
}
