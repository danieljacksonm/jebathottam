'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { galleryImages } from '@/data/gallery-content';

export default function AdminGallery() {
  return (
    <div>
      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Manage Gallery
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload and manage gallery images
            </p>
          </div>
          <Button size="lg">
            + Add Image
          </Button>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <Card key={image.id} className="hover:shadow-lg transition-shadow dark:bg-gray-900 dark:border-gray-800">
              <div className="relative h-48">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{image.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{image.description}</p>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-red-600 hover:text-red-700 dark:text-red-400">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeInUp>
    </div>
  );
}
