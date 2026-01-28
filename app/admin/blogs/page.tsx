'use client';

import { useState } from 'react';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { blogPosts } from '@/data/demo-content';

export default function AdminBlogs() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Blogs' },
      ]} />

      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              Manage Blogs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create, edit, and manage your blog posts
            </p>
          </div>
          <Button size="lg" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Blog Post'}
          </Button>
        </div>
      </FadeInUp>

      {/* Add/Edit Form */}
      {showForm && (
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Create New Blog Post
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter blog post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[200px] dark:bg-gray-800 dark:text-white"
                  placeholder="Write your blog post content here..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white">
                    <option>Teaching</option>
                    <option>Reflection</option>
                    <option>Community</option>
                    <option>Mission</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button>Save Blog Post</Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {/* Blog Posts Table */}
      <FadeInUp delay={0.2}>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Blog Posts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                      {post.featured && (
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Featured</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{post.author}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-xs font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                        Published
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
