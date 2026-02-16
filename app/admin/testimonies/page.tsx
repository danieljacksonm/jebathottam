'use client';

import { useState, useEffect, useCallback } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { MessageSquare, Plus, Pencil, Trash2, Loader2, X, Upload } from 'lucide-react';

export interface TestimonyItem {
  id: number;
  name: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at?: string;
}

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1];
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function AdminTestimoniesPage() {
  const [list, setList] = useState<TestimonyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', content: '', image_url: '' });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('type', 'testimony');
      const token = document.cookie.split('; ').find((row) => row.startsWith('auth_token='))?.split('=')[1];
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
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

  const fetchList = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/testimonies');
      if (!res.ok) throw new Error('Failed to load testimonies');
      const data = await res.json();
      const raw = Array.isArray(data.data) ? data.data : [];
      setList(raw.filter((t: TestimonyItem) => t.id > 0));
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

  const resetForm = () => {
    setForm({ name: '', content: '', image_url: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (t: TestimonyItem) => {
    setForm({
      name: t.name,
      content: t.content,
      image_url: t.image_url || '',
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      setError('Name and content are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        content: form.content.trim(),
        image_url: form.image_url.trim() || null,
      };
      if (editingId) {
        const res = await fetch(`/api/testimonies/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Update failed');
        }
      } else {
        const res = await fetch('/api/testimonies', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Create failed');
        }
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
    if (!confirm('Delete this testimony?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/testimonies/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Delete failed');
      }
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
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Testimonies' }]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Manage Testimonies
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Add and edit testimonies shown on the public testimony page
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => {
              setForm({ name: '', content: '', image_url: '' });
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="w-full sm:w-auto shrink-0"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Testimony
              </>
            )}
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
              {editingId ? 'Edit Testimony' : 'Add Testimony'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Person's name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 min-h-[120px] sm:min-h-[160px] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Their testimony / story"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image (optional – upload or paste URL)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading…' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
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
                    <img
                      src={form.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Update' : 'Add Testimony'}
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
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No testimonies yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Add testimonies to display on the public testimony page.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimony
            </Button>
          </div>
        </FadeInUp>
      ) : (
        <StaggerContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {list.map((t) => (
              <StaggerItem key={t.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                  <div className="sm:w-24 sm:shrink-0 flex justify-center sm:justify-start p-4 sm:p-0 sm:pl-4 sm:pt-4">
                    {t.image_url ? (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-primary-100 dark:ring-primary-900/30">
                        <img
                          src={t.image_url}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12"%3E?%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 sm:p-4 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{t.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">{t.content}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {new Date(t.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="dark:text-gray-400 dark:hover:text-white"
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDelete(t.id)}
                        disabled={saving}
                      >
                        <Trash2 className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                      <a
                        href={`/testimony/${t.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        View →
                      </a>
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
