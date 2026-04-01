import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-semibold text-gray-900">
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Profile
              </Button>
              <Button variant="secondary" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Manage your ministry content and resources
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prophecies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">Total stored</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sermons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">Total archived</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">Personal notes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="secondary" className="h-auto py-4 flex flex-col items-center">
              <span className="text-2xl mb-2">📝</span>
              <span>New Prophecy</span>
            </Button>
            <Button variant="secondary" className="h-auto py-4 flex flex-col items-center">
              <span className="text-2xl mb-2">📖</span>
              <span>Add Sermon</span>
            </Button>
            <Button variant="secondary" className="h-auto py-4 flex flex-col items-center">
              <span className="text-2xl mb-2">📄</span>
              <span>Create Note</span>
            </Button>
            <Button variant="secondary" className="h-auto py-4 flex flex-col items-center">
              <span className="text-2xl mb-2">👥</span>
              <span>Manage Users</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest ministry activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to display</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
