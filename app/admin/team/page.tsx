'use client';

import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { teamMembers } from '@/data/demo-content';

export default function AdminTeam() {
  return (
    <div>
      <FadeInUp>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
              Manage Team Members
            </h1>
            <p className="text-gray-600">
              Add and manage ministry team members
            </p>
          </div>
          <Button size="lg">
            + Add Team Member
          </Button>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
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
