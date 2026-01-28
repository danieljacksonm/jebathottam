'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminMedia() {
  return (
    <div>
      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Media Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all media files and uploads
            </p>
          </div>
          <Button size="lg">
            + Upload Media
          </Button>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.2}>
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <CardTitle>All Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                <div key={item} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeInUp>
    </div>
  );
}
