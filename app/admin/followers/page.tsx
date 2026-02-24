'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { CheckCircle2, AlertCircle, X, Search, Plus } from 'lucide-react';

// Toast system
interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

const TOAST_DURATION = 4000;

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[100] flex flex-col gap-2 pointer-events-none sm:max-w-sm sm:w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm animate-slide-in-right ${
            toast.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
          role="alert"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          )}
          <span className="flex-1 break-words">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: 'success' | 'error', message: string) => {
      const id = ++nextId.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), TOAST_DURATION);
      return id;
    },
    [dismiss]
  );

  return { toasts, addToast, dismiss };
}

// Data interfaces
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
  phone: string | null;
  join_date: string;
  status: 'active' | 'inactive';
  notes: string | null;
  family_id: number | null;
  family_name: string | null;
  prayerPoints?: PrayerPoint[];
  prayer_count?: number;
  pending_prayers?: number;
}

interface Family {
  id: number;
  name: string;
  members: Follower[];
}

export default function AdminFollowers() {
  const { toasts, addToast, dismiss } = useToasts();
  
  // State
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [showPrayerForm, setShowPrayerForm] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState<Follower | null>(null);
  const [editingFollower, setEditingFollower] = useState<Follower | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'families'>('list');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFamily, setFilterFamily] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    familyId: '',
    familyName: '',
    type: 'member' as 'member' | 'visitor' | 'new_believer',
    status: 'active' as 'active' | 'inactive',
  });
  
  const [familyFormData, setFamilyFormData] = useState({
    name: '',
  });
  
  const [prayerFormData, setPrayerFormData] = useState({
    text: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Fetch followers
  const fetchFollowers = useCallback(async () => {
    try {
      const response = await fetch('/api/followers', {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch followers');
      }
      
      const result = await response.json();
      setFollowers(result.data || []);
    } catch (error: any) {
      console.error('Error fetching followers:', error);
      addToast('error', 'Failed to load followers');
    }
  }, [addToast]);

  // Fetch families
  const fetchFamilies = useCallback(async () => {
    try {
      const response = await fetch('/api/families', {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch families');
      }
      
      const result = await response.json();
      setFamilies(result.data || []);
    } catch (error: any) {
      console.error('Error fetching families:', error);
      addToast('error', 'Failed to load families');
    }
  }, [addToast]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchFollowers(), fetchFamilies()]);
      setLoading(false);
    };
    loadData();
  }, [fetchFollowers, fetchFamilies]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFamilyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFamilyFormData({
      ...familyFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrayerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrayerFormData({
      ...prayerFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Create follower
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        status: formData.status,
        notes: formData.notes || null,
      };

      if (formData.familyId) {
        payload.family_id = parseInt(formData.familyId);
      } else if (formData.familyName) {
        payload.family_name = formData.familyName;
      }

      const response = await fetch('/api/followers', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create follower');
      }

      addToast('success', 'Follower added successfully');
      setFormData({ name: '', email: '', phone: '', notes: '', familyId: '', familyName: '', type: 'member', status: 'active' });
      setShowForm(false);
      await fetchFollowers();
      await fetchFamilies();
    } catch (error: any) {
      console.error('Error creating follower:', error);
      addToast('error', error.message || 'Failed to add follower');
    }
  };

  // Update follower
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFollower) return;

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        status: formData.status,
        notes: formData.notes || null,
      };

      if (formData.familyId) {
        payload.family_id = parseInt(formData.familyId);
      } else {
        payload.family_id = null;
      }

      const response = await fetch(`/api/followers/${editingFollower.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update follower');
      }

      addToast('success', 'Follower updated successfully');
      setEditingFollower(null);
      setFormData({ name: '', email: '', phone: '', notes: '', familyId: '', familyName: '', type: 'member', status: 'active' });
      setShowForm(false);
      await fetchFollowers();
      await fetchFamilies();
    } catch (error: any) {
      console.error('Error updating follower:', error);
      addToast('error', error.message || 'Failed to update follower');
    }
  };

  // Delete follower
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/followers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete follower');
      }

      addToast('success', 'Follower deleted successfully');
      setDeleteConfirm(null);
      await fetchFollowers();
      await fetchFamilies();
    } catch (error: any) {
      console.error('Error deleting follower:', error);
      addToast('error', error.message || 'Failed to delete follower');
    }
  };

  // Create family
  const handleFamilySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/families', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: familyFormData.name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create family');
      }

      addToast('success', 'Family created successfully');
      setFamilyFormData({ name: '' });
      setShowFamilyForm(false);
      await fetchFamilies();
    } catch (error: any) {
      console.error('Error creating family:', error);
      addToast('error', error.message || 'Failed to create family');
    }
  };

  // Edit follower handler
  const handleEditClick = (follower: Follower) => {
    setEditingFollower(follower);
    setFormData({
      name: follower.name,
      email: follower.email,
      phone: follower.phone || '',
      notes: follower.notes || '',
      familyId: follower.family_id ? follower.family_id.toString() : '',
      familyName: '',
      type: 'member', // Default since API doesn't support this yet
      status: follower.status,
    });
    setShowForm(true);
  };

  // Filter logic
  const allFollowers = [
    ...followers,
    ...families.flatMap(family => family.members),
  ];

  // Remove duplicates (followers might appear in both lists)
  const uniqueFollowers = allFollowers.reduce((acc, follower) => {
    if (!acc.find(f => f.id === follower.id)) {
      acc.push(follower);
    }
    return acc;
  }, [] as Follower[]);

  const filteredFollowers = uniqueFollowers.filter((follower) => {
    // Status filter
    if (activeTab === 'active' && follower.status !== 'active') return false;
    if (activeTab === 'inactive' && follower.status !== 'inactive') return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!follower.name.toLowerCase().includes(query) &&
          !follower.email.toLowerCase().includes(query) &&
          !(follower.phone && follower.phone.toLowerCase().includes(query))) {
        return false;
      }
    }

    // Family filter
    if (filterFamily) {
      const familyId = parseInt(filterFamily);
      if (follower.family_id !== familyId) return false;
    }

    // Type filter (if implemented in future)
    // For now, we'll skip this as the API doesn't support it yet

    return true;
  });

  const pendingPrayers = uniqueFollowers.flatMap(f => 
    (f.prayerPoints || []).filter(p => p.status === 'pending').map(p => ({ follower: f, prayer: p }))
  );
  const happenedPrayers = uniqueFollowers.flatMap(f => 
    (f.prayerPoints || []).filter(p => p.status === 'happened').map(p => ({ follower: f, prayer: p }))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

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
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => setShowFamilyForm(!showFamilyForm)}
              className="text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Family
            </Button>
            <Button size="lg" onClick={() => {
              setShowForm(!showForm);
              setEditingFollower(null);
              setFormData({ name: '', email: '', phone: '', notes: '', familyId: '', familyName: '', type: 'member', status: 'active' });
            }} className="text-xs sm:text-sm">
              {showForm ? 'Cancel' : '+ Add'}
            </Button>
          </div>
        </div>
      </FadeInUp>

      {/* Stats Cards */}
      <FadeInUp delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">Total Followers</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">{uniqueFollowers.length}</p>
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
                  {uniqueFollowers.filter(f => f.status === 'active').length}
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

      {/* Search and Filters */}
      <FadeInUp delay={0.1}>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <select
                value={filterFamily}
                onChange={(e) => setFilterFamily(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Families</option>
                {families.map(family => (
                  <option key={family.id} value={family.id}>{family.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="member">Member</option>
                <option value="visitor">Visitor</option>
                <option value="new_believer">New Believer</option>
              </select>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Add Family Form Modal */}
      {showFamilyForm && (
        <FadeInUp delay={0.1}>
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add New Family
              </h2>
              <form onSubmit={handleFamilySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Family Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={familyFormData.name}
                    onChange={handleFamilyInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Smith Family"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="secondary" 
                    type="button" 
                    onClick={() => {
                      setShowFamilyForm(false);
                      setFamilyFormData({ name: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Family</Button>
                </div>
              </form>
            </div>
          </div>
        </FadeInUp>
      )}

      {/* Add/Edit Follower Form */}
      {showForm && (
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-6 sm:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {editingFollower ? 'Edit Follower' : 'Add New Follower'}
            </h2>
            <form onSubmit={editingFollower ? handleUpdate : handleSubmit} className="space-y-4 sm:space-y-6">
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
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="member">Member</option>
                    <option value="visitor">Visitor</option>
                    <option value="new_believer">New Believer</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                  Family Name (Optional - creates new family)
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
                <Button 
                  variant="secondary" 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingFollower(null);
                    setFormData({ name: '', email: '', phone: '', notes: '', familyId: '', familyName: '', type: 'member', status: 'active' });
                  }} 
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  {editingFollower ? 'Update Follower' : 'Add Follower'}
                </Button>
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
            <form onSubmit={(e) => {
              e.preventDefault();
              // Prayer point submission would go here - API endpoint needed
              addToast('success', 'Prayer point added (feature coming soon)');
              setPrayerFormData({ text: '', date: new Date().toISOString().split('T')[0], notes: '' });
              setShowPrayerForm(false);
              setSelectedFollower(null);
            }} className="space-y-4 sm:space-y-6">
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
                <Button 
                  variant="secondary" 
                  type="button" 
                  onClick={() => { 
                    setShowPrayerForm(false); 
                    setSelectedFollower(null); 
                  }} 
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">Add Prayer Point</Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this follower? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="secondary"
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
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
              All ({uniqueFollowers.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'active'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Active ({uniqueFollowers.filter(f => f.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'inactive'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Inactive ({uniqueFollowers.filter(f => f.status === 'inactive').length})
            </button>
          </nav>
        </div>
      </FadeInUp>

      {/* Family View */}
      {viewMode === 'families' && (
        <FadeInUp delay={0.2}>
          <div className="space-y-4 sm:space-y-6">
            {families.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No families found. Create one to get started.</p>
              </div>
            ) : (
              families.map((family) => (
                <div key={family.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-800 bg-primary-50 dark:bg-primary-900/20">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {family.name} ({family.members.length} {family.members.length === 1 ? 'member' : 'members'})
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {family.members.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No members in this family
                      </div>
                    ) : (
                      family.members.map((member) => (
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
                              {(member.prayerPoints && member.prayerPoints.length > 0) && (
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
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleEditClick(member)}
                                className="text-xs sm:text-sm dark:text-gray-400 dark:hover:text-white"
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setDeleteConfirm(member.id)}
                                className="text-xs sm:text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
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
                            {follower.family_name || 'Individual'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {follower.prayer_count || (follower.prayerPoints?.length || 0)} {((follower.prayer_count || follower.prayerPoints?.length || 0) === 1) ? 'prayer' : 'prayers'}
                            </span>
                            {(follower.pending_prayers || (follower.prayerPoints?.filter(p => p.status === 'pending').length || 0)) > 0 && (
                              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs">
                                {follower.pending_prayers || follower.prayerPoints?.filter(p => p.status === 'pending').length || 0} pending
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditClick(follower)}
                              className="dark:text-gray-400 dark:hover:text-white"
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteConfirm(follower.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400"
                            >
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
                    
                    {follower.family_name && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Family: {follower.family_name}</p>
                    )}

                    {/* Prayer Points - Mobile */}
                    {(follower.prayerPoints && follower.prayerPoints.length > 0) && (
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
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditClick(follower)}
                        className="text-xs h-7 px-2 dark:text-gray-400 dark:hover:text-white"
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setDeleteConfirm(follower.id)}
                        className="text-xs h-7 px-2 text-red-600 hover:text-red-700 dark:text-red-400"
                      >
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
                      {uniqueFollowers.reduce((acc, f) => acc + (f.prayerPoints?.length || 0), 0)}
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
                      {uniqueFollowers.reduce((acc, f) => acc + (f.prayerPoints?.filter(p => p.status === 'not-happened').length || 0), 0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Answer Rate:</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">
                        {uniqueFollowers.reduce((acc, f) => acc + (f.prayerPoints?.length || 0), 0) > 0
                          ? Math.round((happenedPrayers.length / uniqueFollowers.reduce((acc, f) => acc + (f.prayerPoints?.length || 0), 0)) * 100)
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

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
