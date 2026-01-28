import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Our Team - Ministry Platform',
  description: 'Meet the dedicated leaders and members serving our ministry.',
};

export default function TeamPage() {
  // Sample team data - replace with actual data from API
  const teamMembers = [
    {
      id: 1,
      name: 'Pastor John Smith',
      role: 'Senior Pastor',
      bio: 'Pastor John has been serving in ministry for over 20 years, with a heart for preserving God\'s word and teaching biblical truth.',
      image: '/api/placeholder/400/400',
      email: 'john@ministryplatform.org',
    },
    {
      id: 2,
      name: 'Pastor Sarah Johnson',
      role: 'Associate Pastor',
      bio: 'Pastor Sarah brings passion for community building and discipleship, helping believers grow in their faith journey.',
      image: '/api/placeholder/400/400',
      email: 'sarah@ministryplatform.org',
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Worship Leader',
      bio: 'Michael leads our worship team with excellence, creating an atmosphere where God\'s presence can be experienced.',
      image: '/api/placeholder/400/400',
      email: 'michael@ministryplatform.org',
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      role: 'Youth Ministry Director',
      bio: 'Emily is passionate about mentoring the next generation and helping young people discover their purpose in Christ.',
      image: '/api/placeholder/400/400',
      email: 'emily@ministryplatform.org',
    },
    {
      id: 5,
      name: 'David Thompson',
      role: 'Administrator',
      bio: 'David ensures the smooth operation of our ministry platform and supports our team in serving the community effectively.',
      image: '/api/placeholder/400/400',
      email: 'david@ministryplatform.org',
    },
    {
      id: 6,
      name: 'Lisa Williams',
      role: 'Prayer Coordinator',
      bio: 'Lisa leads our prayer ministry, organizing intercessory prayer and supporting members through prayer requests.',
      image: '/api/placeholder/400/400',
      email: 'lisa@ministryplatform.org',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Our Team</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Team
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Meet the dedicated leaders and members who serve our ministry community
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member) => (
            <Card key={member.id} className="text-center">
              <CardContent className="pt-6">
                <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed mb-4">{member.bio}</p>
                <a
                  href={`mailto:${member.email}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Contact
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Join Our Team
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              If you feel called to serve in ministry, we would love to hear from you.
              Contact us to learn more about opportunities to serve.
            </p>
            <Link href="/contact">
              <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
                Get in Touch
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
