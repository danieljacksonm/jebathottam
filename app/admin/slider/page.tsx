'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { sliderImages } from '@/data/demo-content';

export default function AdminSlider() {
  return (
    <div>
      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
              Manage Slider Images
            </h1>
            <p className="text-gray-600">
              Upload and manage images for the homepage slider
            </p>
          </div>
          <Button size="lg">
            + Add Image
          </Button>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliderImages.map((image) => (
            <Card key={image.id} className="hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{image.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{image.description}</p>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-red-600 hover:text-red-700">
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
