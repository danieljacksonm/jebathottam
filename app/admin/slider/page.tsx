'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

function getUploadHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1];
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const PLACEHOLDER_IMG =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14"%3ENo image%3C/text%3E%3C/svg%3E';

export default function AdminSliderPage() {
  const [slides, setSlides] = useState<SliderSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    image_url: '',
    text: '',
    title: '',
    description: '',
    order_index: 0,
    status: 'active',
  });
  const formSectionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewBlobUrl]);

  useEffect(() => {
    if (showForm && formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showForm]);

  const clearPreviewBlob = useCallback(() => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  }, [previewBlobUrl]);

  const resetForm = useCallback(() => {
    clearPreviewBlob();
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
  }, [slides.length, clearPreviewBlob]);

  const openAdd = useCallback(() => {
    clearPreviewBlob();
    setForm({
      image_url: '',
      text: '',
      title: '',
      description: '',
      order_index: slides.length,
      status: 'active',
    });
    setEditingId(null);
    setShowForm(true);
    setError(null);
  }, [slides.length, clearPreviewBlob]);

  const openEdit = useCallback(
    (slide: SliderSlide) => {
      clearPreviewBlob();
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
      setError(null);
      setTimeout(() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    },
    [clearPreviewBlob]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
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
        setError('Image is required. Upload an image or paste a URL.');
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
    setError(null);
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
    if (!file.type.startsWith('image/')) {
      setError('Please select an image (JPEG, PNG, WebP, GIF).');
      return;
    }
    clearPreviewBlob();
    const blobUrl = URL.createObjectURL(file);
    setPreviewBlobUrl(blobUrl);
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('type', 'slider');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: getUploadHeaders(),
        body: formData,
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      if (data.url) {
        setForm((f) => ({ ...f, image_url: data.url }));
        URL.revokeObjectURL(blobUrl);
        setPreviewBlobUrl(null);
      }
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
    setSaving(true);
    try {
      await fetch(`/api/slider/${slide.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...slide, order_index: other.order_index ?? newIndex }),
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

  const previewSrc = previewBlobUrl || form.image_url.trim() || null;

  return (
    <div className="min-h-screen pb-8">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Hero Slider' }]} />

      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <FadeInUp>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-1">
                Manage Hero Slider
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Control the images and messages on the homepage hero
              </p>
            </div>
            <Button size="lg" onClick={openAdd} className="w-full sm:w-auto shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </div>
        </FadeInUp>

        {error && (
          <div
            className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Form panel – scrolls into view when opened */}
        {showForm && (
          <div ref={formSectionRef} className="mb-8 scroll-mt-4">
            <FadeInUp delay={0.05}>
              <div className="rounded-xl border-2 border-primary-500 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 shadow-lg overflow-hidden">
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-primary-200 dark:border-primary-800 bg-primary-100/50 dark:bg-primary-900/30">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {editingId ? (
                      <>
                        <Pencil className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                        Editing slide
                        {form.title?.trim() && (
                          <span className="font-normal text-gray-600 dark:text-gray-300 truncate">
                            — {form.title.trim()}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                        Add new slide
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {editingId
                      ? 'Update the fields below and click Update Slide.'
                      : 'Upload an image or paste a URL, then fill in the details.'}
                  </p>
                </div>
                <div className="p-4 sm:p-6 bg-white dark:bg-gray-900">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Image (required)
                      </label>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <label className="inline-flex items-center justify-center px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors shrink-0">
                          <Upload className="w-4 h-4 mr-2 shrink-0" />
                          {uploading ? 'Uploading…' : 'Choose image'}
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                        </label>
                        <input
                          type="text"
                          value={form.image_url}
                          onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm"
                          placeholder="Or paste image URL"
                        />
                      </div>
                      {previewSrc && (
                        <div className="mt-3 w-full max-w-sm aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <img
                            key={previewSrc}
                            src={previewSrc}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px] dark:bg-gray-800 dark:text-white text-sm"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm"
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
                          onChange={(e) =>
                            setForm((f) => ({ ...f, order_index: parseInt(e.target.value, 10) || 0 }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          value={form.status}
                          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                      <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {editingId ? 'Update Slide' : 'Add Slide'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </FadeInUp>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : slides.length === 0 ? (
          <FadeInUp>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center">
              <Sliders className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No slides yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto text-sm">
                Add your first hero slide to show on the homepage.
              </p>
              <Button onClick={openAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Slide
              </Button>
            </div>
          </FadeInUp>
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {slides.map((slide, index) => (
                <StaggerItem key={slide.id}>
                  <div
                    className={`rounded-xl border-2 overflow-hidden bg-white dark:bg-gray-900 shadow-sm transition-all ${
                      editingId === slide.id
                        ? 'border-primary-500 dark:border-primary-600 ring-2 ring-primary-500/30'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="relative h-36 sm:h-44 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={slide.image_url}
                        alt={slide.title || 'Slide'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-3">
                        <p className="text-white text-center text-sm sm:text-base line-clamp-2 font-medium">
                          {slide.title || slide.text || `Slide ${index + 1}`}
                        </p>
                      </div>
                      {editingId === slide.id && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded bg-primary-600 text-white text-xs font-medium">
                          Editing
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-xs font-medium">
                          Order {slide.order_index}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            slide.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {slide.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="col-span-2 sm:col-span-1 min-h-10"
                          onClick={() => openEdit(slide)}
                        >
                          <Pencil className="w-4 h-4 mr-2 shrink-0" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-10 px-3"
                          onClick={() => moveOrder(slide.id, 'up')}
                          disabled={index === 0 || saving}
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-10 px-3"
                          onClick={() => moveOrder(slide.id, 'down')}
                          disabled={index === slides.length - 1 || saving}
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-10 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800"
                          onClick={() => handleDelete(slide.id)}
                          disabled={saving}
                        >
                          <Trash2 className="w-4 h-4 mr-2 shrink-0" />
                          Delete
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
    </div>
  );
}
