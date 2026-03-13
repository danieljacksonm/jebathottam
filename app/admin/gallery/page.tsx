'use client';

import { useState, useEffect, useCallback } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Image as ImageIcon, Plus, Pencil, Trash2, Loader2, X, Upload } from 'lucide-react';

type GalleryItem = {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  created_at?: string;
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = document.cookie.split('; ').find((row) => row.startsWith('auth_token='))?.split('=')[1];
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image_url: '' });

  const fetchItems = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/gallery', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load gallery');
      const data = await res.json();
      setItems(Array.isArray(data?.data) ? data.data : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('type', 'gallery');
      const headers: HeadersInit = {};
      const token = document.cookie.split('; ').find((row) => row.startsWith('auth_token='))?.split('=')[1];
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include', headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      if (data.url) setForm((f) => ({ ...f, image_url: data.url.trim() }));
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', image_url: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (item: GalleryItem) => {
    setForm({ title: item.title, description: item.description || '', image_url: item.image_url || '' });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image_url.trim()) {
      setError('Title and image are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = { title: form.title.trim(), description: form.description.trim() || null, image_url: form.image_url.trim() };
      if (editingId) {
        const res = await fetch(`/api/gallery/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Update failed');
        }
      } else {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Create failed');
        }
      }
      resetForm();
      await fetchItems();
    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this image?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Delete failed');
      }
      if (editingId === id) resetForm();
      await fetchItems();
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Gallery' }]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Manage Gallery
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Upload and manage gallery images
            </p>
          </div>
          <Button size="lg" onClick={() => { setForm({ title: '', description: '', image_url: '' }); setEditingId(null); setShowForm(!showForm); }} className="w-full sm:w-auto shrink-0">
            {showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Add Image</>}
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
              {editingId ? 'Edit Image' : 'Upload New Image'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image (upload or URL)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer min-h-[44px]">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading…' : 'Upload image'}
                    <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Upload above or paste image URL (e.g. https://... or /api/uploads/...)"
                />
                {form.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden max-w-xs aspect-video bg-gray-100 dark:bg-gray-800">
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Image title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 min-h-[80px] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Image description"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Update' : 'Add Image'}
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
      ) : items.length === 0 ? (
        <FadeInUp>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-8 sm:p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No gallery images yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">Add your first image to the gallery.</p>
            <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" /> Add Image</Button>
          </div>
        </FadeInUp>
      ) : (
        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((item) => (
              <StaggerItem key={item.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-40 sm:h-48 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 sm:mb-4">{item.description || '—'}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm" className="flex-1 min-w-0 dark:text-gray-400 dark:hover:text-white" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 min-w-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={() => handleDelete(item.id)} disabled={saving}>
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
