'use client';

import { useState, useEffect, useCallback } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Users, Plus, Pencil, Trash2, Loader2, X, Upload } from 'lucide-react';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  phone: string | null;
  order_index: number;
  created_at?: string;
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = document.cookie.split('; ').find((row) => row.startsWith('auth_token='))?.split('=')[1];
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export default function AdminTeamPage() {
  const [list, setList] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', bio: '', image_url: '', email: '', phone: '', order_index: 0 });

  const fetchList = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/team', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load team');
      const data = await res.json();
      setList(Array.isArray(data?.data) ? data.data : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('type', 'team');
      const token = document.cookie.split('; ').find((row) => row.startsWith('auth_token='))?.split('=')[1];
      const res = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      if (data.url) setForm((f) => ({ ...f, image_url: data.url }));
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const resetForm = () => {
    setForm({ name: '', role: '', bio: '', image_url: '', email: '', phone: '', order_index: list.length });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (m: TeamMember) => {
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio || '',
      image_url: m.image_url || '',
      email: m.email || '',
      phone: m.phone || '',
      order_index: m.order_index ?? 0,
    });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      setError('Name and role are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim() || null,
        image_url: form.image_url.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        order_index: Number(form.order_index) || 0,
      };
      if (editingId) {
        const res = await fetch(`/api/team/${editingId}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload), credentials: 'include' });
        if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Update failed'); }
      } else {
        const res = await fetch('/api/team', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload), credentials: 'include' });
        if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Create failed'); }
      }
      resetForm();
      await fetchList();
    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this team member?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Delete failed'); }
      if (editingId === id) resetForm();
      await fetchList();
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Team Members' }]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Manage Team Members
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Add and manage ministry team members
            </p>
          </div>
          <Button size="lg" onClick={() => { setForm({ name: '', role: '', bio: '', image_url: '', email: '', phone: '', order_index: list.length }); setEditingId(null); setShowForm(!showForm); }} className="w-full sm:w-auto shrink-0">
            {showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Add Team Member</>}
          </Button>
        </div>
      </FadeInUp>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-6 md:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {editingId ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo (optional – upload or URL)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer min-h-[44px]">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading…' : 'Upload image'}
                    <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="https://... or upload above"
                />
                {form.image_url && (
                  <div className="mt-2 w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={form.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base" placeholder="Full name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <input type="text" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base" placeholder="Role/Position" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio (optional)</label>
                <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} className="w-full px-3 py-2 sm:px-4 min-h-[80px] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base" placeholder="Team member bio" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email (optional)</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone (optional)</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base" placeholder="Phone" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order</label>
                <input type="number" min={0} value={form.order_index} onChange={(e) => setForm((f) => ({ ...f, order_index: parseInt(e.target.value, 10) || 0 }))} className="w-full max-w-[120px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base" />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Update' : 'Add Member'}
                </Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 sm:py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : list.length === 0 ? (
        <FadeInUp>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-8 sm:p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No team members yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">Add your first team member.</p>
            <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" /> Add Team Member</Button>
          </div>
        </FadeInUp>
      ) : (
        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {list.map((m) => (
              <StaggerItem key={m.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-4 sm:p-6 text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                      {m.image_url ? (
                        <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e5e7eb" width="96" height="96"/%3E%3C/svg%3E'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Users className="w-10 h-10 text-gray-400" /></div>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">{m.name}</h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium text-sm sm:text-base mb-2 truncate">{m.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{m.bio || '—'}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button variant="ghost" size="sm" className="min-w-0 dark:text-gray-400 dark:hover:text-white" onClick={() => openEdit(m)}>
                        <Pencil className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="min-w-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={() => handleDelete(m.id)} disabled={saving}>
                        <Trash2 className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}
    </div>
  );
}
