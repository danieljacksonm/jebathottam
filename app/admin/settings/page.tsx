'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminSettings() {
  return (
    <div>
      <FadeInUp>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your ministry platform settings
          </p>
        </div>
      </FadeInUp>

      <div className="space-y-6">
        <FadeInUp delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Ministry Name" defaultValue="Jebathottam Ministry" />
              <Input label="Email" type="email" defaultValue="info@jebathottam.org" />
              <Input label="Phone" type="tel" defaultValue="(555) 123-4567" />
              <Input label="Address" defaultValue="123 Ministry Way, City, State 12345" />
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Password
                </label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <Button variant="secondary">Update Password</Button>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </div>
  );
}
