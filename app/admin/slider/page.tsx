'use client';

import { useState, useEffect, useCallback } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Sliders, Plus, Pencil, Trash2, ChevronUp, ChevronDown, Loader2, X, Upload } from 'lucide-react';

export interface SliderSlide {
  id: number;
  image_url: string;
  text: string | null;
  title: string | null;
  description: string | null;
  order_index: number;
  status: string;
  created_at?: string;
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

export default function AdminSliderPage() {
  const [slides, setSlides] = useState<SliderSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    image_url: '',
    text: '',
    title: '',
    description: '',
    order_index: 0,
    status: 'active',
  });

  const fetchSlides = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/slider', { headers: getAuthHeaders(), credentials: 'include' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to load slides (${res.status})`);
      }
      const data = await res.json();
      const raw = Array.isArray(data.data) ? data.data : [];
      setSlides(raw.filter((s: SliderSlide) => s.id > 0));
    } catch (e: any) {
      setError(e.message || 'Failed to load slides');
      setSlides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const resetForm = () => {
    setForm({
      image_url: '',
      text: '',
      title: '',
      description: '',
      order_index: slides.length,
      status: 'active',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (slide: SliderSlide) => {
    setForm({
      image_url: slide.image_url || '',
      text: slide.text || '',
      title: slide.title || '',
      description: slide.description || '',
      order_index: slide.order_index ?? 0,
      status: slide.status || 'active',
    });
    setEditingId(slide.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        image_url: form.image_url.trim(),
        text: form.text.trim() || null,
        title: form.title.trim() || null,
        description: form.description.trim() || null,
        order_index: Number(form.order_index) || 0,
        status: form.status,
      };
      if (!payload.image_url) {
        setError('Image URL is required');
        setSaving(false);
        return;
      }
      if (editingId) {
        const res = await fetch(`/api/slider/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to update slide');
        }
      } else {
        const res = await fetch('/api/slider', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to add slide');
        }
      }
      setError(null);
      resetForm();
      await fetchSlides();
    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this slide?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/slider/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
      setError(null);
      if (editingId === id) resetForm();
      await fetchSlides();
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('type', 'slider');
      const token = document.cookie.split('; ').find((row) => row.startsWith('auth_token='))?.split('=')[1];
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
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

  const moveOrder = async (id: number, direction: 'up' | 'down') => {
    const index = slides.findIndex((s) => s.id === id);
    if (index < 0) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    const slide = slides[index];
    const other = slides[newIndex];
    const newOrder = other.order_index;
    setSaving(true);
    try {
      await fetch(`/api/slider/${slide.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...slide, order_index: newOrder }),
        credentials: 'include',
      });
      await fetch(`/api/slider/${other.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...other, order_index: slide.order_index ?? index }),
        credentials: 'include',
      });
      await fetchSlides();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Hero Slider' }]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Manage Hero Slider
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Control the images and messages on the homepage hero
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => {
              setForm({
                image_url: '',
                text: '',
                title: '',
                description: '',
                order_index: slides.length,
                status: 'active',
              });
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
                Add Slide
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
              {editingId ? 'Edit Slide' : 'Add New Slide'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image (upload or paste URL)
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
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value.trim() }))}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Upload above (path like /uploads/slider/…) or paste full URL"
                />
                {form.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden max-w-xs aspect-video bg-gray-100 dark:bg-gray-800">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title (overlay)
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Slide title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scripture / Text overlay
                </label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px] sm:min-h-[100px] dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Scripture or inspirational text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Short description"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.order_index}
                    onChange={(e) => setForm((f) => ({ ...f, order_index: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {editingId ? 'Update Slide' : 'Add Slide'}
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
      ) : slides.length === 0 ? (
        <FadeInUp>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-8 sm:p-12 text-center">
            <Sliders className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No slides yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Add your first hero slide to show on the homepage.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </div>
        </FadeInUp>
      ) : (
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {slides.map((slide, index) => (
              <StaggerItem key={slide.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-40 sm:h-48 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={slide.image_url}
                      alt={slide.title || 'Slide'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14"%3ENo image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3 sm:p-4">
                      <p className="text-white text-center font-serif text-sm sm:text-lg line-clamp-2">
                        {slide.title || slide.text || `Slide ${index + 1}`}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-xs font-medium">
                        Order: {slide.order_index}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          slide.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {slide.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 min-w-0 dark:text-gray-400 dark:hover:text-white"
                        onClick={() => openEdit(slide)}
                      >
                        <Pencil className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="min-w-0 p-2"
                        onClick={() => moveOrder(slide.id, 'up')}
                        disabled={index === 0 || saving}
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="min-w-0 p-2"
                        onClick={() => moveOrder(slide.id, 'down')}
                        disabled={index === slides.length - 1 || saving}
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 min-w-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDelete(slide.id)}
                        disabled={saving}
                      >
                        <Trash2 className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Delete</span>
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
