'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { ministryInfo } from '@/data/demo-content';

export default function AdminSettings() {
  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Settings' },
      ]} />

      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your ministry platform settings
          </p>
        </div>
      </FadeInUp>

      <div className="space-y-6">
        {/* General Settings */}
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h2>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Ministry Name" defaultValue={ministryInfo.name} className="dark:bg-gray-800 dark:text-white dark:border-gray-700" />
              <Input label="Email" type="email" defaultValue={ministryInfo.email} className="dark:bg-gray-800 dark:text-white dark:border-gray-700" />
              <Input label="Phone" type="tel" defaultValue={ministryInfo.phone} className="dark:bg-gray-800 dark:text-white dark:border-gray-700" />
              <Input label="Address" defaultValue={ministryInfo.address} className="dark:bg-gray-800 dark:text-white dark:border-gray-700" />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Security */}
        <FadeInUp delay={0.2}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Change Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="secondary">Update Password</Button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Appearance */}
        <FadeInUp delay={0.3}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Theme preference is managed globally. Use the theme toggle in the header to switch between light and dark mode.
              </p>
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
