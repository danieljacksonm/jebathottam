'use client';

import { useState, useEffect, useCallback } from 'react';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Music2, Plus, Pencil, Trash2, Loader2, X, Upload } from 'lucide-react';

type AudioTrack = {
  id: number;
  title: string;
  artist: string | null;
  duration: string | null;
  image_url: string | null;
  url: string;
  scripture: string | null;
  order_index: number;
};

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = document.cookie.split('; ').find((row) => row.startsWith('auth_token='))?.split('=')[1];
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export default function AdminAudioPage() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    artist: '',
    duration: '',
    image_url: '',
    url: '',
    scripture: '',
    order_index: 0,
  });

  const fetchTracks = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/audio', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load audio tracks');
      const data = await res.json();
      setTracks(Array.isArray(data?.data) ? data.data : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('type', 'media');
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
    setForm({
      title: '',
      artist: '',
      duration: '',
      image_url: '',
      url: '',
      scripture: '',
      order_index: tracks.length,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (track: AudioTrack) => {
    setForm({
      title: track.title,
      artist: track.artist || '',
      duration: track.duration || '',
      image_url: track.image_url || '',
      url: track.url,
      scripture: track.scripture || '',
      order_index: track.order_index ?? 0,
    });
    setEditingId(track.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      setError('Title and audio URL are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        artist: form.artist.trim() || null,
        duration: form.duration.trim() || null,
        image_url: form.image_url.trim() || null,
        url: form.url.trim(),
        scripture: form.scripture.trim() || null,
        order_index: form.order_index,
      };
      if (editingId) {
        const res = await fetch(`/api/audio/${editingId}`, {
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
        const res = await fetch('/api/audio', {
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
      await fetchTracks();
    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this track from 24-hour audio?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/audio/${id}`, { method: 'DELETE', headers: getAuthHeaders(), credentials: 'include' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Delete failed');
      }
      if (editingId === id) resetForm();
      await fetchTracks();
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: '24-Hour Audio' }]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
              24-Hour Audio
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Tracks shown in the homepage audio player (worship, prayer, Word)
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => {
              setForm({
                title: '',
                artist: '',
                duration: '',
                image_url: '',
                url: '',
                scripture: '',
                order_index: tracks.length,
              });
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="w-full sm:w-auto shrink-0"
          >
            {showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Add Track</>}
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
              {editingId ? 'Edit Track' : 'Add Track'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. Morning Devotion"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Artist</label>
                  <input
                    type="text"
                    value={form.artist}
                    onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g. Worship Team"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g. 45:30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audio URL *</label>
                <input
                  type="text"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="https://... or /api/uploads/.../file.mp3"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">MP3 or other playable audio URL. Host file elsewhere or use your server upload for images only (audio URL must be a direct link).</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover image (upload or URL)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading…' : 'Upload image'}
                    <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Upload above or paste image URL"
                />
                {form.image_url && (
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={form.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scripture (optional)</label>
                <input
                  type="text"
                  value={form.scripture}
                  onChange={(e) => setForm((f) => ({ ...f, scripture: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g. Psalm 118:24"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Update' : 'Add Track'}
                </Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {loading ? (
        <div className="flex justify-center py-12 sm:py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : tracks.length === 0 ? (
        <FadeInUp>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm p-8 sm:p-12 text-center">
            <Music2 className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No audio tracks yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">Add tracks to show in the 24-hour audio player on the homepage.</p>
            <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" /> Add Track</Button>
          </div>
        </FadeInUp>
      ) : (
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tracks.map((track) => (
              <StaggerItem key={track.id}>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-100 dark:bg-gray-800">
                    {track.image_url ? (
                      <img src={track.image_url} alt={track.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music2 className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-3 sm:p-4 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{track.title}</h3>
                    {track.artist && <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{track.artist}</p>}
                    {track.duration && <p className="text-xs text-gray-500 mt-0.5">{track.duration}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(track)}><Pencil className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Edit</span></Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400" onClick={() => handleDelete(track.id)} disabled={saving}><Trash2 className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Delete</span></Button>
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
