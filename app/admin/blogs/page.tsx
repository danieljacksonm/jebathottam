'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { blogPosts } from '@/data/demo-content';

export default function AdminBlogs() {
  return (
    <div>
      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
              Manage Blogs
            </h1>
            <p className="text-gray-600">
              Create, edit, and manage your blog posts
            </p>
          </div>
          <Button size="lg">
            + New Blog Post
          </Button>
        </div>
      </FadeInUp>

      {/* Blog Posts Table */}
      <FadeInUp delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>All Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Author</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{post.title}</div>
                        {post.featured && (
                          <span className="text-xs text-primary-600 font-medium">Featured</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{post.author}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                          Published
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </FadeInUp>

      {/* Add/Edit Form Modal Placeholder */}
      <FadeInUp delay={0.4}>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter blog post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[200px]"
                  placeholder="Write your blog post content here..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Teaching</option>
                    <option>Reflection</option>
                    <option>Community</option>
                    <option>Mission</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="secondary">Cancel</Button>
                <Button>Save Blog Post</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FadeInUp>
    </div>
  );
}
