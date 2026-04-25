'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/page-transition';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { HtmlEditor } from '@/components/ui/html-editor';
import { Calendar, Plus, Pencil, Trash2, Loader2, X } from 'lucide-react';

type EventItem = {
  id: number;
  title: string;
  description: string | null;
  type: string | null;
  date: string;
  time: string | null;
  location: string | null;
  created_at: string;
};

const EVENT_TYPES = ['Worship', 'Study', 'Prayer', 'Fellowship'];

export default function AdminEventsPage() {
  const [list, setList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'Worship',
    date: '',
    time: '',
    location: '',
  });

  const fetchList = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/events', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load events');
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
      description: '',
      type: 'Worship',
      date: '',
      time: '',
      location: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (item: EventItem) => {
    setForm({
      title: item.title,
      description: item.description || '',
      type: item.type || 'Worship',
      date: item.date || '',
      time: item.time ? String(item.time).slice(0, 5) : '',
      location: item.location || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      setError('Title and date are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        type: form.type || null,
        date: form.date,
        time: form.time || null,
        location: form.location.trim() || null,
      };
      if (editingId) {
        const res = await fetch(`/api/events/${editingId}`, {
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
        const res = await fetch('/api/events', {
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
    if (!confirm('Delete this event?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${id}`, {
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
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Events' }]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Manage Events
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Create and manage ministry events and meetings
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
            {showForm ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> New Event</>}
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
              {editingId ? 'Edit Event' : 'New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                    placeholder="Event title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white text-sm sm:text-base"
                  placeholder="Event location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <HtmlEditor
                  value={form.description}
                  onChange={(description) => setForm((f) => ({ ...f, description }))}
                  placeholder="Event description (optional)"
                  minHeight="160px"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Update' : 'Create'}
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
            <Calendar className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">Create your first event with the button above.</p>
            <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" /> New Event</Button>
          </div>
        </FadeInUp>
      ) : (
        <StaggerContainer>
          <div className="space-y-4">
            {list.map((event) => (
              <StaggerItem key={event.id}>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="bg-primary-600 text-white rounded-lg p-4 text-center min-w-[80px]">
                          <div className="text-2xl font-bold">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-xs uppercase">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded text-xs font-medium">
                              {event.type || '—'}
                            </span>
                          </div>
                          {event.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 text-sm">
                              {event.description.replace(/<[^>]+>/g, ' ').trim().slice(0, 150)}
                              {event.description.replace(/<[^>]+>/g, '').length > 150 ? '…' : ''}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-500">
                            {event.time && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {String(event.time).slice(0, 5)}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/events/${event.id}`}>
                          <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:text-white">View</Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(event)} className="dark:text-gray-400 dark:hover:text-white">
                          <Pencil className="w-4 h-4 sm:mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)} disabled={saving} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                          <Trash2 className="w-4 h-4 sm:mr-1" /> Delete
                        </Button>
                      </div>
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
