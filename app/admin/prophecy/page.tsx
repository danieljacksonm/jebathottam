'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AdminProphecy() {
  return (
    <div>
      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
              Prophecy Storage
            </h1>
            <p className="text-gray-600">
              Store and preserve God-spoken words and prophecies
            </p>
          </div>
          <Button size="lg">
            + Store New Prophecy
          </Button>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Prophecies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-6 bg-primary-50 border-l-4 border-primary-600 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">January 2024 Prophecy</h4>
                    <p className="text-sm text-gray-600">Received: January 15, 2024</p>
                  </div>
                  <span className="px-3 py-1 bg-primary-600 text-white rounded text-sm font-medium">
                    Verified
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The Lord says, 'I am bringing a season of restoration and renewal. Trust in My timing, for I am working all things together for your good...'"
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="ghost" size="sm">
                    View Full
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="p-6 bg-primary-50 border-l-4 border-primary-600 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">December 2023 Prophecy</h4>
                    <p className="text-sm text-gray-600">Received: December 28, 2023</p>
                  </div>
                  <span className="px-3 py-1 bg-primary-600 text-white rounded text-sm font-medium">
                    Verified
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "My children, prepare your hearts for what I am about to do. This is a time of preparation and alignment..."
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button variant="ghost" size="sm">
                    View Full
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeInUp>
    </div>
  );
}
