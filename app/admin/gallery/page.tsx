'use client';

import { useState } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { galleryImages } from '@/data/gallery-content';

export default function AdminGallery() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Gallery' },
      ]} />

      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              Manage Gallery
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload and manage gallery images
            </p>
          </div>
          <Button size="lg" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Image'}
          </Button>
        </div>
      </FadeInUp>

      {/* Upload Form */}
      {showForm && (
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Upload New Image
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop an image here, or click to browse
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Image title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px] dark:bg-gray-800 dark:text-white"
                  placeholder="Image description"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button>Upload Image</Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {/* Gallery Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <StaggerItem key={image.id}>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{image.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{image.description}</p>
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
