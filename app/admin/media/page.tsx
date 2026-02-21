'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import {
  Image as ImageIcon,
  Film,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react';

interface MediaItem {
  id: number;
  title: string;
  description: string | null;
  type: 'poster' | 'youtube' | 'youtube-shorts';
  image_url: string | null;
  video_id: string | null;
  thumbnail_url: string | null;
  message: string | null;
  created_at?: string;
  updated_at?: string;
}

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

const TOAST_DURATION = 4000;

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

type FormTab = 'poster' | 'video';

interface PosterForm {
  image_url: string;
  title: string;
  message: string;
}

interface VideoForm {
  title: string;
  video_id: string;
  thumbnail_url: string;
  description: string;
  video_type: 'youtube' | 'youtube-shorts';
}

const emptyPosterForm: PosterForm = { image_url: '', title: '', message: '' };
const emptyVideoForm: VideoForm = {
  title: '',
  video_id: '',
  thumbnail_url: '',
  description: '',
  video_type: 'youtube',
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posters' | 'videos'>('posters');

  const [showForm, setShowForm] = useState(false);
  const [formTab, setFormTab] = useState<FormTab>('poster');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  const [posterForm, setPosterForm] = useState<PosterForm>(emptyPosterForm);
  const [videoForm, setVideoForm] = useState<VideoForm>(emptyVideoForm);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const uploadIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, addToast, dismiss } = useToasts();

  const posters = items.filter((item) => item.type === 'poster');
  const videos = items.filter((item) => item.type === 'youtube' || item.type === 'youtube-shorts');

  const fetchMedia = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/media', { headers: getAuthHeaders(), credentials: 'include' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to load media (${res.status})`);
      }
      const data = await res.json();
      const raw = Array.isArray(data.data) ? data.data : [];
      setItems(raw);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load media';
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

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
    setPosterForm(emptyPosterForm);
    setVideoForm(emptyVideoForm);
    setShowForm(false);
    setEditingId(null);
  }, [clearPreviewBlob]);

  const openAddPoster = useCallback(() => {
    clearPreviewBlob();
    setPosterForm(emptyPosterForm);
    setEditingId(null);
    setFormTab('poster');
    setShowForm(true);
    setActiveTab('posters');
    setError(null);
  }, [clearPreviewBlob]);

  const openAddVideo = useCallback(() => {
    setVideoForm(emptyVideoForm);
    setEditingId(null);
    setFormTab('video');
    setShowForm(true);
    setActiveTab('videos');
    setError(null);
  }, []);

  const openEdit = useCallback(
    (item: MediaItem) => {
      clearPreviewBlob();
      setEditingId(item.id);
      setError(null);

      if (item.type === 'poster') {
        setPosterForm({
          image_url: item.image_url || '',
          title: item.title || '',
          message: item.message || '',
        });
        setFormTab('poster');
        setActiveTab('posters');
      } else {
        setVideoForm({
          title: item.title || '',
          video_id: item.video_id || '',
          thumbnail_url: item.thumbnail_url || '',
          description: item.description || '',
          video_type: item.type as 'youtube' | 'youtube-shorts',
        });
        setFormTab('video');
        setActiveTab('videos');
      }

      setShowForm(true);
      setTimeout(() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    },
    [clearPreviewBlob]
  );

  const handleSubmitPoster = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = posterForm.image_url.trim();
    if (!imageUrl) {
      addToast('error', 'Image is required. Upload an image or paste a URL.');
      return;
    }
    if (!posterForm.title.trim()) {
      addToast('error', 'Title is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: posterForm.title.trim(),
        type: 'poster',
        image_url: imageUrl,
        message: posterForm.message.trim() || null,
        description: null,
        video_id: null,
        thumbnail_url: null,
      };

      if (editingId) {
        const res = await fetch(`/api/media/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to update poster');
        }
        addToast('success', 'Poster updated successfully');
      } else {
        const res = await fetch('/api/media', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to create poster');
        }
        addToast('success', 'Poster created successfully');
      }

      resetForm();
      await fetchMedia();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      addToast('error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim()) {
      addToast('error', 'Title is required.');
      return;
    }
    if (!videoForm.video_id.trim()) {
      addToast('error', 'YouTube Video ID is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: videoForm.title.trim(),
        type: videoForm.video_type,
        video_id: videoForm.video_id.trim(),
        thumbnail_url: videoForm.thumbnail_url.trim() || null,
        description: videoForm.description.trim() || null,
        image_url: null,
        message: null,
      };

      if (editingId) {
        const res = await fetch(`/api/media/${editingId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to update video');
        }
        addToast('success', 'Video updated successfully');
      } else {
        const res = await fetch('/api/media', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to create video');
        }
        addToast('success', 'Video added successfully');
      }

      resetForm();
      await fetchMedia();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed';
      addToast('error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, label: string) => {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
      if (editingId === id) resetForm();
      addToast('success', `"${label}" deleted`);
      await fetchMedia();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Delete failed';
      addToast('error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('error', 'Please select an image (JPEG, PNG, WebP, GIF).');
      return;
    }

    if (fileInputRef.current) fileInputRef.current.value = '';

    const currentUploadId = ++uploadIdRef.current;
    clearPreviewBlob();
    const blobUrl = URL.createObjectURL(file);
    setPreviewBlobUrl(blobUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('type', 'media');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: getUploadHeaders(),
        body: formData,
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));

      if (currentUploadId !== uploadIdRef.current) return;

      if (!res.ok) {
        const msg =
          res.status === 401
            ? 'Please log in again.'
            : res.status === 403
              ? 'You do not have permission to upload.'
              : (data?.error || `Upload failed (${res.status})`);
        throw new Error(msg);
      }

      if (typeof data?.url !== 'string' || !data.url.trim()) {
        addToast('error', 'Upload succeeded but no image URL was returned. Try again or paste a URL.');
        clearPreviewBlob();
        setPosterForm((f) => ({ ...f, image_url: '' }));
      } else {
        setPosterForm((f) => ({ ...f, image_url: data.url.trim() }));
        URL.revokeObjectURL(blobUrl);
        setPreviewBlobUrl(null);
        addToast('success', 'Image uploaded successfully');
      }
    } catch (err: unknown) {
      if (currentUploadId !== uploadIdRef.current) return;
      const msg = err instanceof Error ? err.message : 'Upload failed';
      addToast('error', msg);
      clearPreviewBlob();
    } finally {
      if (currentUploadId === uploadIdRef.current) setUploading(false);
    }
  };

  const posterPreviewSrc = previewBlobUrl || posterForm.image_url.trim() || null;

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';

  return (
    <div className="min-h-screen pb-8">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <Breadcrumbs
        items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Media Library' }]}
      />

      <div className="max-w-6xl mx-auto">
        <FadeInUp>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-1">
                Media Library
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage posters, videos, and media content
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button variant="secondary" size="lg" onClick={openAddPoster} className="flex-1 sm:flex-none">
                <ImageIcon className="w-4 h-4 mr-2 shrink-0" />
                New Poster
              </Button>
              <Button size="lg" onClick={openAddVideo} className="flex-1 sm:flex-none">
                <Film className="w-4 h-4 mr-2 shrink-0" />
                New Video
              </Button>
            </div>
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

        {/* Form */}
        {showForm && (
          <div ref={formSectionRef} className="mb-8 scroll-mt-4">
            <FadeInUp delay={0.05}>
              <div className="rounded-xl border-2 border-primary-500 dark:border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 shadow-lg overflow-hidden">
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-primary-200 dark:border-primary-800 bg-primary-100/50 dark:bg-primary-900/30">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {editingId ? (
                      <>
                        <Pencil className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                        {formTab === 'poster' ? 'Edit Poster' : 'Edit Video'}
                        {(formTab === 'poster' ? posterForm.title : videoForm.title)?.trim() && (
                          <span className="font-normal text-gray-600 dark:text-gray-300 truncate">
                            — {(formTab === 'poster' ? posterForm.title : videoForm.title).trim()}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                        {formTab === 'poster' ? 'Add New Poster' : 'Add New Video'}
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {editingId
                      ? 'Update the fields below and save.'
                      : formTab === 'poster'
                        ? 'Upload an image and fill in the details.'
                        : 'Enter the YouTube video details.'}
                  </p>
                </div>

                <div className="p-4 sm:p-6 bg-white dark:bg-gray-900">
                  {formTab === 'poster' ? (
                    <form onSubmit={handleSubmitPoster} className="space-y-5">
                      <div>
                        <label className={labelClass}>Image (required)</label>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          <label
                            className={`inline-flex items-center justify-center px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors shrink-0 ${
                              uploading
                                ? 'opacity-60 cursor-not-allowed'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                            }`}
                          >
                            {uploading ? (
                              <Loader2 className="w-4 h-4 mr-2 shrink-0 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2 shrink-0" />
                            )}
                            {uploading ? 'Uploading…' : 'Choose image'}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageUpload}
                              disabled={uploading}
                            />
                          </label>
                          <input
                            type="text"
                            value={posterForm.image_url}
                            onChange={(e) => setPosterForm((f) => ({ ...f, image_url: e.target.value }))}
                            className={`flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm`}
                            placeholder="Or paste image URL"
                          />
                        </div>
                        {posterPreviewSrc && (
                          <div className="mt-3 w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <img
                              key={posterPreviewSrc}
                              src={posterPreviewSrc}
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
                        <label className={labelClass}>Title (required)</label>
                        <input
                          type="text"
                          value={posterForm.title}
                          onChange={(e) => setPosterForm((f) => ({ ...f, title: e.target.value }))}
                          className={inputClass}
                          placeholder="Poster title"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Message / Scripture</label>
                        <textarea
                          value={posterForm.message}
                          onChange={(e) => setPosterForm((f) => ({ ...f, message: e.target.value }))}
                          className={`${inputClass} min-h-[80px]`}
                          placeholder="Scripture or inspirational text"
                        />
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button type="submit" disabled={saving || uploading} className="w-full sm:w-auto">
                          {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                          {editingId ? 'Update Poster' : 'Add Poster'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmitVideo} className="space-y-5">
                      <div>
                        <label className={labelClass}>Title (required)</label>
                        <input
                          type="text"
                          value={videoForm.title}
                          onChange={(e) => setVideoForm((f) => ({ ...f, title: e.target.value }))}
                          className={inputClass}
                          placeholder="Video title"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Video Type</label>
                        <select
                          value={videoForm.video_type}
                          onChange={(e) =>
                            setVideoForm((f) => ({ ...f, video_type: e.target.value as 'youtube' | 'youtube-shorts' }))
                          }
                          className={inputClass}
                        >
                          <option value="youtube">YouTube Video</option>
                          <option value="youtube-shorts">YouTube Shorts</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>YouTube Video ID (required)</label>
                        <input
                          type="text"
                          value={videoForm.video_id}
                          onChange={(e) => setVideoForm((f) => ({ ...f, video_id: e.target.value }))}
                          className={inputClass}
                          placeholder="e.g. dQw4w9WgXcQ"
                        />
                        {videoForm.video_id.trim() && (
                          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                            Preview:{' '}
                            <a
                              href={`https://www.youtube.com/watch?v=${videoForm.video_id.trim()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              https://www.youtube.com/watch?v={videoForm.video_id.trim()}
                            </a>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>Thumbnail URL (optional)</label>
                        <input
                          type="text"
                          value={videoForm.thumbnail_url}
                          onChange={(e) => setVideoForm((f) => ({ ...f, thumbnail_url: e.target.value }))}
                          className={inputClass}
                          placeholder="Custom thumbnail URL (leave empty to auto-generate)"
                        />
                        {(videoForm.thumbnail_url.trim() || videoForm.video_id.trim()) && (
                          <div className="mt-3 w-full max-w-sm aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <img
                              src={
                                videoForm.thumbnail_url.trim() ||
                                `https://img.youtube.com/vi/${videoForm.video_id.trim()}/hqdefault.jpg`
                              }
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                          value={videoForm.description}
                          onChange={(e) => setVideoForm((f) => ({ ...f, description: e.target.value }))}
                          className={`${inputClass} min-h-[80px]`}
                          placeholder="Short description of the video"
                        />
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                          {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                          {editingId ? 'Update Video' : 'Add Video'}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </FadeInUp>
          </div>
        )}

        {/* Tabs */}
        <FadeInUp delay={0.1}>
          <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('posters')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'posters'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Posters ({posters.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'videos'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Videos ({videos.length})
                </span>
              </button>
            </nav>
          </div>
        </FadeInUp>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            {/* Posters Tab */}
            {activeTab === 'posters' && (
              posters.length === 0 ? (
                <FadeInUp>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posters yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto text-sm">
                      Add your first poster to share inspirational content.
                    </p>
                    <Button onClick={openAddPoster}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Poster
                    </Button>
                  </div>
                </FadeInUp>
              ) : (
                <StaggerContainer>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {posters.map((poster) => (
                      <StaggerItem key={poster.id}>
                        <div
                          className={`rounded-xl border-2 overflow-hidden bg-white dark:bg-gray-900 shadow-sm transition-all ${
                            editingId === poster.id
                              ? 'border-primary-500 dark:border-primary-600 ring-2 ring-primary-500/30'
                              : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className="relative h-56 sm:h-64 bg-gray-100 dark:bg-gray-800">
                            <img
                              src={poster.image_url || PLACEHOLDER_IMG}
                              alt={poster.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                              }}
                            />
                            {editingId === poster.id && (
                              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-primary-600 text-white text-xs font-medium">
                                Editing
                              </div>
                            )}
                          </div>
                          <div className="p-3 sm:p-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                              {poster.title}
                            </h3>
                            {poster.message && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {poster.message}
                              </p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1 min-h-10"
                                onClick={() => openEdit(poster)}
                              >
                                <Pencil className="w-4 h-4 mr-2 shrink-0" />
                                Edit
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1 min-h-10 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800"
                                onClick={() => handleDelete(poster.id, poster.title)}
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
              )
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              videos.length === 0 ? (
                <FadeInUp>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center">
                    <Film className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No videos yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto text-sm">
                      Add your first video to share sermons and worship content.
                    </p>
                    <Button onClick={openAddVideo}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                  </div>
                </FadeInUp>
              ) : (
                <StaggerContainer>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {videos.map((video) => {
                      const thumbSrc =
                        video.thumbnail_url ||
                        (video.video_id
                          ? `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`
                          : null);

                      return (
                        <StaggerItem key={video.id}>
                          <div
                            className={`rounded-xl border-2 overflow-hidden bg-white dark:bg-gray-900 shadow-sm transition-all ${
                              editingId === video.id
                                ? 'border-primary-500 dark:border-primary-600 ring-2 ring-primary-500/30'
                                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                            }`}
                          >
                            <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                              {thumbSrc ? (
                                <img
                                  src={thumbSrc}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Film className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <a
                                  href={
                                    video.type === 'youtube-shorts'
                                      ? `https://www.youtube.com/shorts/${video.video_id}`
                                      : `https://www.youtube.com/watch?v=${video.video_id}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-14 h-14 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Play className="w-7 h-7 text-white ml-1" />
                                </a>
                              </div>
                              {editingId === video.id && (
                                <div className="absolute top-2 left-2 px-2 py-1 rounded bg-primary-600 text-white text-xs font-medium">
                                  Editing
                                </div>
                              )}
                              <span
                                className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${
                                  video.type === 'youtube-shorts'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-900/70 text-white'
                                }`}
                              >
                                {video.type === 'youtube-shorts' ? 'Shorts' : 'YouTube'}
                              </span>
                            </div>
                            <div className="p-3 sm:p-4">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                {video.title}
                              </h3>
                              {video.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                                  {video.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 font-mono">
                                ID: {video.video_id}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="flex-1 min-h-10"
                                  onClick={() => openEdit(video)}
                                >
                                  <Pencil className="w-4 h-4 mr-2 shrink-0" />
                                  Edit
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="flex-1 min-h-10 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800"
                                  onClick={() => handleDelete(video.id, video.title)}
                                  disabled={saving}
                                >
                                  <Trash2 className="w-4 h-4 mr-2 shrink-0" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </StaggerItem>
                      );
                    })}
                  </div>
                </StaggerContainer>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
