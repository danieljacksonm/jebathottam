'use client';

import { useState, useEffect, useCallback } from 'react';
import { FadeInUp } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { HtmlEditor } from '@/components/ui/html-editor';
import { FileText, Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';

type NoteItem = {
  id: number;
  title: string | null;
  content: string;
  type: 'note' | 'sermon';
  created_at: string;
  author_name?: string | null;
};

export default function AdminNotesPage() {
  const [list, setList] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'note' | 'sermon'>('note');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'note' as 'note' | 'sermon',
  });

  const fetchList = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/notes', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load notes');
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

  const filteredList = list.filter((n) => n.type === activeTab);

  const resetForm = () => {
    setForm({ title: '', content: '', type: activeTab });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (item: NoteItem) => {
    setForm({
      title: item.title || '',
      content: item.content,
      type: item.type,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const openNew = () => {
    setForm({ title: '', content: '', type: activeTab });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) {
      setError('Content is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = { title: form.title.trim() || null, content: form.content.trim(), type: form.type };
      if (editingId) {
        const res = await fetch(`/api/notes/${editingId}`, {
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
        const res = await fetch('/api/notes', {
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
    if (!confirm('Delete this item?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/notes/${id}`, {
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

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Notes & Sermons' }]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Notes & Sermons
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage notes, sermons, and teachings
            </p>
          </div>
          <Button size="lg" onClick={openNew} className="w-full sm:w-auto shrink-0">
            {activeTab === 'sermon' ? '+ New Sermon' : '+ New Note'}
          </Button>
        </div>
      </FadeInUp>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <FadeInUp delay={0.05}>
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <nav className="flex gap-6">
            <button
              type="button"
              onClick={() => { setActiveTab('note'); if (showForm && !editingId) setForm((f) => ({ ...f, type: 'note' })); }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'note'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Notes
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('sermon'); if (showForm && !editingId) setForm((f) => ({ ...f, type: 'sermon' })); }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sermon'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Sermons
            </button>
          </nav>
        </div>
      </FadeInUp>

      {showForm && (
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6 md:mb-8 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {editingId ? (form.type === 'sermon' ? 'Edit Sermon' : 'Edit Note') : (form.type === 'sermon' ? 'New Sermon' : 'New Note')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title (optional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder={form.type === 'sermon' ? 'Sermon title' : 'Note title'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <HtmlEditor
                  value={form.content}
                  onChange={(content) => setForm((f) => ({ ...f, content }))}
                  placeholder="Write content (HTML supported)"
                  minHeight="220px"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Update' : 'Save'}
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
      ) : filteredList.length === 0 ? (
        <FadeInUp>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 sm:p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No {activeTab === 'sermon' ? 'sermons' : 'notes'} yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Create your first {activeTab === 'sermon' ? 'sermon' : 'note'} with the button above.
            </p>
            <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> New {activeTab === 'sermon' ? 'Sermon' : 'Note'}</Button>
          </div>
        </FadeInUp>
      ) : (
        <FadeInUp delay={0.2}>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Recent {activeTab === 'sermon' ? 'Sermons' : 'Notes'}
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredList.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title || 'Untitled'}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{new Date(item.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2 text-sm mb-4">
                    {item.content.replace(/<[^>]+>/g, ' ').trim().slice(0, 180)}
                    {item.content.replace(/<[^>]+>/g, '').length > 180 ? '…' : ''}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(item)} className="dark:text-gray-400 dark:hover:text-white">
                      <Pencil className="w-4 h-4 sm:mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} disabled={saving} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 className="w-4 h-4 sm:mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInUp>
      )}
    </div>
  );
}
