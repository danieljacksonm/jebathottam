'use client';

import { useState } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';

// Enhanced data structure with families and prayer points
interface PrayerPoint {
  id: number;
  text: string;
  date: string;
  status: 'pending' | 'happened' | 'not-happened';
  notes?: string;
}

interface Follower {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  notes: string;
  familyId?: number;
  familyName?: string;
  prayerPoints: PrayerPoint[];
}

interface Family {
  id: number;
  name: string;
  members: Follower[];
}

const initialFamilies: Family[] = [
  {
    id: 1,
    name: 'Smith Family',
    members: [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        joinDate: '2024-01-15',
        status: 'active',
        notes: 'Regular attendee, very engaged',
        familyId: 1,
        familyName: 'Smith Family',
        prayerPoints: [
          { id: 1, text: 'Prayer for job opportunity', date: '2024-01-20', status: 'happened', notes: 'Got the job!' },
          { id: 2, text: 'Healing for mother', date: '2024-01-25', status: 'pending' },
        ],
      },
      {
        id: 2,
        name: 'Mary Smith',
        email: 'mary.smith@example.com',
        phone: '(555) 123-4567',
        joinDate: '2024-01-15',
        status: 'active',
        notes: 'John\'s wife',
        familyId: 1,
        familyName: 'Smith Family',
        prayerPoints: [
          { id: 3, text: 'Prayer for children\'s education', date: '2024-01-22', status: 'pending' },
        ],
      },
    ],
  },
];

const initialFollowers: Follower[] = [
  {
    id: 3,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    joinDate: '2023-12-20',
    status: 'active',
    notes: 'Interested in volunteering',
    prayerPoints: [
      { id: 4, text: 'Guidance for ministry service', date: '2024-01-18', status: 'happened' },
      { id: 5, text: 'Financial provision', date: '2024-01-28', status: 'pending' },
    ],
  },
  {
    id: 4,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '(555) 345-6789',
    joinDate: '2024-01-05',
    status: 'active',
    notes: 'New member, needs follow-up',
    prayerPoints: [
      { id: 6, text: 'Prayer for family reconciliation', date: '2024-01-15', status: 'not-happened' },
    ],
  },
];

export default function AdminFollowers() {
  const [showForm, setShowForm] = useState(false);
  const [showPrayerForm, setShowPrayerForm] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState<Follower | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'families'>('list');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [families, setFamilies] = useState(initialFamilies);
  const [followers, setFollowers] = useState(initialFollowers);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    familyId: '',
    familyName: '',
  });
  const [prayerFormData, setPrayerFormData] = useState({
    text: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrayerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrayerFormData({
      ...prayerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFollower: Follower = {
      id: followers.length + families.reduce((acc, f) => acc + f.members.length, 0) + 1,
      ...formData,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active' as const,
      familyId: formData.familyId ? parseInt(formData.familyId) : undefined,
      familyName: formData.familyName || undefined,
      prayerPoints: [],
    };

    if (formData.familyId) {
      // Add to existing family
      setFamilies(families.map(family => 
        family.id === parseInt(formData.familyId)
          ? { ...family, members: [...family.members, newFollower] }
          : family
      ));
    } else if (formData.familyName) {
      // Create new family
      setFamilies([...families, {
        id: families.length + 1,
        name: formData.familyName,
        members: [newFollower],
      }]);
    } else {
      // Add as individual
      setFollowers([...followers, newFollower]);
    }

    setFormData({ name: '', email: '', phone: '', notes: '', familyId: '', familyName: '' });
    setShowForm(false);
  };

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFollower) return;

    const newPrayerPoint: PrayerPoint = {
      id: Date.now(),
      ...prayerFormData,
      status: 'pending',
    };

    // Update in followers list
    setFollowers(followers.map(f => 
      f.id === selectedFollower.id
        ? { ...f, prayerPoints: [...f.prayerPoints, newPrayerPoint] }
        : f
    ));

    // Update in families
    setFamilies(families.map(family => ({
      ...family,
      members: family.members.map(member =>
        member.id === selectedFollower.id
          ? { ...member, prayerPoints: [...member.prayerPoints, newPrayerPoint] }
          : member
      ),
    })));

    setPrayerFormData({ text: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setShowPrayerForm(false);
    setSelectedFollower(null);
  };

  const updatePrayerStatus = (followerId: number, prayerId: number, status: 'happened' | 'not-happened' | 'pending') => {
    // Update in followers
    setFollowers(followers.map(f =>
      f.id === followerId
        ? {
            ...f,
            prayerPoints: f.prayerPoints.map(p => p.id === prayerId ? { ...p, status } : p),
          }
        : f
    ));

    // Update in families
    setFamilies(families.map(family => ({
      ...family,
      members: family.members.map(member =>
        member.id === followerId
          ? {
              ...member,
              prayerPoints: member.prayerPoints.map(p => p.id === prayerId ? { ...p, status } : p),
            }
          : member
      ),
    })));
  };

  const allFollowers = [
    ...followers,
    ...families.flatMap(family => family.members),
  ];

  const filteredFollowers = allFollowers.filter((follower) => {
    if (activeTab === 'active') return follower.status === 'active';
    if (activeTab === 'inactive') return follower.status === 'inactive';
    return true;
  });

  const pendingPrayers = allFollowers.flatMap(f => 
    f.prayerPoints.filter(p => p.status === 'pending').map(p => ({ follower: f, prayer: p }))
  );
  const happenedPrayers = allFollowers.flatMap(f => 
    f.prayerPoints.filter(p => p.status === 'happened').map(p => ({ follower: f, prayer: p }))
  );

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Followers & Members' },
      ]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              Followers & Members
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage followers, families, and prayer points
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('list')}
              className="text-xs sm:text-sm"
            >
              List View
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === 'families' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('families')}
              className="text-xs sm:text-sm"
            >
              Family View
            </Button>
            <Button size="lg" onClick={() => setShowForm(!showForm)} className="text-xs sm:text-sm">
              {showForm ? 'Cancel' : '+ Add'}
            </Button>
          </div>
        </div>
      </FadeInUp>

      {/* Stats Cards - Mobile Optimized */}
      <FadeInUp delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Total Followers</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">{allFollowers.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <span className="text-xl sm:text-2xl">👥</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Active Members</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                  {allFollowers.filter(f => f.status === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <span className="text-xl sm:text-2xl">✓</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Pending Prayers</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">{pendingPrayers.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <span className="text-xl sm:text-2xl">🙏</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Answered Prayers</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">{happenedPrayers.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <span className="text-xl sm:text-2xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Add Follower Form - Mobile Optimized */}
      {showForm && (
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Add New Follower
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    defaultValue="active"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Family Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Smith Family"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Or Select Existing Family
                  </label>
                  <select
                    name="familyId"
                    value={formData.familyId}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">None (Individual)</option>
                    {families.map(family => (
                      <option key={family.id} value={family.id}>{family.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                <Button variant="secondary" type="button" onClick={() => setShowForm(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">Add Follower</Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {/* Prayer Points Form */}
      {showPrayerForm && selectedFollower && (
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Add Prayer Point for {selectedFollower.name}
            </h2>
            <form onSubmit={handlePrayerSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prayer Point *
                </label>
                <textarea
                  name="text"
                  value={prayerFormData.text}
                  onChange={handlePrayerInputChange}
                  required
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter prayer point..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={prayerFormData.date}
                    onChange={handlePrayerInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={prayerFormData.notes}
                  onChange={handlePrayerInputChange}
                  rows={2}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                <Button variant="secondary" type="button" onClick={() => { setShowPrayerForm(false); setSelectedFollower(null); }} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">Add Prayer Point</Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {/* Tabs - Mobile Optimized */}
      <FadeInUp delay={0.1}>
        <div className="border-b border-gray-200 dark:border-gray-800 mb-4 sm:mb-6 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              All ({allFollowers.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'active'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Active ({allFollowers.filter(f => f.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'inactive'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Inactive ({allFollowers.filter(f => f.status === 'inactive').length})
            </button>
          </nav>
        </div>
      </FadeInUp>

      {/* Family View */}
      {viewMode === 'families' && (
        <FadeInUp delay={0.2}>
          <div className="space-y-4 sm:space-y-6">
            {families.map((family) => (
              <div key={family.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-800 bg-primary-50 dark:bg-primary-900/20">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    {family.name} ({family.members.length} {family.members.length === 1 ? 'member' : 'members'})
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {family.members.map((member) => (
                    <div key={member.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{member.name}</h4>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <p>{member.email}</p>
                            {member.phone && <p>{member.phone}</p>}
                            {member.notes && <p className="italic">{member.notes}</p>}
                          </div>
                          
                          {/* Prayer Points */}
                          {member.prayerPoints.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Prayer Points:</p>
                              {member.prayerPoints.map((prayer) => (
                                <div key={prayer.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs sm:text-sm">
                                  <p className="text-gray-900 dark:text-white mb-2">{prayer.text}</p>
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      prayer.status === 'happened' 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                        : prayer.status === 'not-happened'
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                    }`}>
                                      {prayer.status === 'happened' ? '✓ Happened' : prayer.status === 'not-happened' ? '✗ Not Happened' : 'Pending'}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-500">{new Date(prayer.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => updatePrayerStatus(member.id, prayer.id, 'happened')}
                                      className="text-xs h-7 px-2 text-green-600 hover:text-green-700 dark:text-green-400"
                                    >
                                      ✓ Happened
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => updatePrayerStatus(member.id, prayer.id, 'not-happened')}
                                      className="text-xs h-7 px-2 text-red-600 hover:text-red-700 dark:text-red-400"
                                    >
                                      ✗ Not Happened
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { setSelectedFollower(member); setShowPrayerForm(true); }}
                            className="text-xs sm:text-sm dark:text-gray-400 dark:hover:text-white"
                          >
                            + Prayer
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs sm:text-sm dark:text-gray-400 dark:hover:text-white">
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs sm:text-sm text-red-600 hover:text-red-700 dark:text-red-400">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeInUp>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <FadeInUp delay={0.2}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Family
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Prayer Points
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredFollowers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500 dark:text-gray-400">
                        No followers found
                      </td>
                    </tr>
                  ) : (
                    filteredFollowers.map((follower) => (
                      <tr key={follower.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900 dark:text-white">{follower.name}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{follower.email}</div>
                          {follower.phone && (
                            <div className="text-xs text-gray-500 dark:text-gray-500">{follower.phone}</div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {follower.familyName || 'Individual'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {follower.prayerPoints.length} {follower.prayerPoints.length === 1 ? 'prayer' : 'prayers'}
                            </span>
                            {follower.prayerPoints.filter(p => p.status === 'pending').length > 0 && (
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs">
                                {follower.prayerPoints.filter(p => p.status === 'pending').length} pending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            follower.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                          }`}>
                            {follower.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setSelectedFollower(follower); setShowPrayerForm(true); }}
                              className="dark:text-gray-400 dark:hover:text-white"
                            >
                              + Prayer
                            </Button>
                            <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-800">
              {filteredFollowers.length === 0 ? (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No followers found
                </div>
              ) : (
                filteredFollowers.map((follower) => (
                  <div key={follower.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{follower.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{follower.email}</p>
                        {follower.phone && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">{follower.phone}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ml-2 ${
                        follower.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                      }`}>
                        {follower.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {follower.familyName && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Family: {follower.familyName}</p>
                    )}

                    {/* Prayer Points - Mobile */}
                    {follower.prayerPoints.length > 0 && (
                      <div className="mb-3 space-y-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Prayer Points ({follower.prayerPoints.length}):
                        </p>
                        {follower.prayerPoints.slice(0, 2).map((prayer) => (
                          <div key={prayer.id} className="bg-gray-50 dark:bg-gray-800/50 rounded p-2 text-xs">
                            <p className="text-gray-900 dark:text-white mb-1 line-clamp-2">{prayer.text}</p>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                prayer.status === 'happened' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : prayer.status === 'not-happened'
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                              }`}>
                                {prayer.status === 'happened' ? '✓' : prayer.status === 'not-happened' ? '✗' : 'Pending'}
                              </span>
                              <span className="text-gray-500 dark:text-gray-500 text-xs">
                                {new Date(prayer.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                        {follower.prayerPoints.length > 2 && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            +{follower.prayerPoints.length - 2} more prayers
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setSelectedFollower(follower); setShowPrayerForm(true); }}
                        className="text-xs h-7 px-2 dark:text-gray-400 dark:hover:text-white"
                      >
                        + Prayer
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7 px-2 dark:text-gray-400 dark:hover:text-white">
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-red-600 hover:text-red-700 dark:text-red-400">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </FadeInUp>
      )}

      {/* Reports Section */}
      <FadeInUp delay={0.3}>
        <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Prayer Reports</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Pending Prayers</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pendingPrayers.length === 0 ? (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No pending prayers</p>
                  ) : (
                    pendingPrayers.map(({ follower, prayer }) => (
                      <div key={prayer.id} className="bg-white dark:bg-gray-900 rounded p-3 text-xs sm:text-sm">
                        <p className="font-medium text-gray-900 dark:text-white mb-1">{follower.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{prayer.text}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updatePrayerStatus(follower.id, prayer.id, 'happened')}
                            className="text-xs h-6 px-2 text-green-600 hover:text-green-700 dark:text-green-400"
                          >
                            ✓ Happened
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updatePrayerStatus(follower.id, prayer.id, 'not-happened')}
                            className="text-xs h-6 px-2 text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            ✗ Not Happened
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Answered Prayers</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {happenedPrayers.length === 0 ? (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No answered prayers yet</p>
                  ) : (
                    happenedPrayers.slice(0, 5).map(({ follower, prayer }) => (
                      <div key={prayer.id} className="bg-white dark:bg-gray-900 rounded p-3 text-xs sm:text-sm">
                        <p className="font-medium text-gray-900 dark:text-white mb-1">{follower.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">{prayer.text}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(prayer.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Summary</h3>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Prayers:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {allFollowers.reduce((acc, f) => acc + f.prayerPoints.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">{pendingPrayers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Answered:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{happenedPrayers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Not Happened:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {allFollowers.reduce((acc, f) => acc + f.prayerPoints.filter(p => p.status === 'not-happened').length, 0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Answer Rate:</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {allFollowers.reduce((acc, f) => acc + f.prayerPoints.length, 0) > 0
                          ? Math.round((happenedPrayers.length / allFollowers.reduce((acc, f) => acc + f.prayerPoints.length, 0)) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
