'use client';

import { useState } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { teamMembers } from '@/data/demo-content';

export default function AdminTeam() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Team Members' },
      ]} />

      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              Manage Team Members
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add and manage ministry team members
            </p>
          </div>
          <Button size="lg" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Team Member'}
          </Button>
        </div>
      </FadeInUp>

      {/* Add Form */}
      {showForm && (
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Add New Team Member
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Role/Position"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px] dark:bg-gray-800 dark:text-white"
                  placeholder="Team member bio"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button>Add Member</Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {/* Team Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <StaggerItem key={member.id}>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{member.bio}</p>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="flex-1 dark:text-gray-400 dark:hover:text-white">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </div>
  );
}
