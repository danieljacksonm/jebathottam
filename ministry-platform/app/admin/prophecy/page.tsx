'use client';

import { useState, useEffect, useCallback } from 'react';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { HtmlEditor } from '@/components/ui/html-editor';
import { BookOpen, Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';

type ProphecyItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  reference: string | null;
  status: 'pending' | 'verified' | 'archived';
  created_at: string;
};

const STATUS_OPTIONS: { value: ProphecyItem['status']; label: string }[] = [
  { value: 'pending', label: 'Pending Verification' },
  { value: 'verified', label: 'Verified' },
  { value: 'archived', label: 'Archived' },
];

export default function AdminProphecyPage() {
  const [list, setList] = useState<ProphecyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    date: '',
    reference: '',
    status: 'pending' as ProphecyItem['status'],
  });

  const fetchList = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/prophecy', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load prophecies');
      const data = await res.json();
      setList(Array.isArray(data?.data) ? data.data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      date: '',
      reference: '',
      status: 'pending',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (item: ProphecyItem) => {
    setForm({
      title: item.title,
      content: item.content,
      date: item.date,
      reference: item.reference || '',
      status: item.status,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.date) {
      setError('Title, content, and date are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        date: form.date,
        reference: form.reference.trim() || null,
        status: form.status,
      };
      if (editingId) {
        const res = await fetch(`/api/prophecy/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Update failed');
        }
      } else {
        const res = await fetch('/api/prophecy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || 'Create failed');
        }
      }
      resetForm();
      await fetchList();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this prophecy?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/prophecy/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Delete failed');
      }
      if (editingId === id) resetForm();
      await fetchList();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status: ProphecyItem['status']) => {
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      verified: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      archived: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    };
    const labels = { pending: 'Pending', verified: 'Verified', archived: 'Archived' };
    return <span className={`px-3 py-1 rounded text-sm font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Prophecy Storage' }]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Prophecy Storage
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Store and preserve God-spoken words and prophecies
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto shrink-0"
          >
            {showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Store New Prophecy</>}
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
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6 md:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {editingId ? 'Edit Prophecy' : 'Store New Prophecy'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Prophecy title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prophecy Content</label>
                <HtmlEditor
                  value={form.content}
                  onChange={(content) => setForm((f) => ({ ...f, content }))}
                  placeholder="Enter the prophecy word..."
                  minHeight="200px"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Received</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProphecyItem['status'] }))}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reference (optional)</label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Scripture or source reference"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Update' : 'Store Prophecy'}
                </Button>
              </div>
            </form>
          </div>
        </FadeInUp>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : list.length === 0 ? (
        <FadeInUp>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 sm:p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No prophecies stored yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">Store your first prophecy with the button above.</p>
            <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" /> Store New Prophecy</Button>
          </div>
        </FadeInUp>
      ) : (
        <FadeInUp delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Prophecies</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {list.filter((p) => p.status === 'verified').slice(0, 5).map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      {statusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Received: {new Date(item.date).toLocaleDateString()}</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3 text-sm">
                      {item.content.replace(/<[^>]+>/g, ' ').trim().slice(0, 120)}
                      {item.content.replace(/<[^>]+>/g, '').length > 120 ? '…' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(item)} className="dark:text-gray-400 dark:hover:text-white">
                        <Pencil className="w-4 h-4 sm:mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} disabled={saving} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-4 h-4 sm:mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {list.filter((p) => p.status === 'verified').length === 0 && (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No verified prophecies yet.</div>
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Pending &amp; Archived</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {list.filter((p) => p.status !== 'verified').slice(0, 5).map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      {statusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Received: {new Date(item.date).toLocaleDateString()}</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3 text-sm">
                      {item.content.replace(/<[^>]+>/g, ' ').trim().slice(0, 120)}
                      {item.content.replace(/<[^>]+>/g, '').length > 120 ? '…' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(item)} className="dark:text-gray-400 dark:hover:text-white">
                        <Pencil className="w-4 h-4 sm:mr-1" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} disabled={saving} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-4 h-4 sm:mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {list.filter((p) => p.status !== 'verified').length === 0 && (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No pending or archived prophecies.</div>
                )}
              </div>
            </div>
          </div>
        </FadeInUp>
      )}
    </div>
  );
}
