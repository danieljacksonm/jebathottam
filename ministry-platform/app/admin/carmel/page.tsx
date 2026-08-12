'use client';

import { useCallback, useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/animations/page-transition';
import { Download, Loader2, Plus, Trash2, X, Pencil } from 'lucide-react';

type AttendanceItem = {
  id: number;
  name: string;
  date: string;
  slot_time: string;
  session_name: string | null;
  duration_mins: number;
  device_type: string | null;
  added_by: string;
};

type SlotItem = {
  id: number;
  slot_time: string;
  session_name: string;
  assigned_member: string | null;
  is_empty: number;
  sort_order: number;
};

function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

const emptySlotForm = {
  slot_time: '',
  session_name: 'காலை நேரம்',
  assigned_member: '',
  sort_order: 0,
};

export default function AdminCarmelPage() {
  const [tab, setTab] = useState<'attendance' | 'slots'>('attendance');
  const [list, setList] = useState<AttendanceItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState(todayIST());
  const [dateTo, setDateTo] = useState(todayIST());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    date: todayIST(),
    slot_time: '',
    session_name: 'காலை நேரம்',
    duration_mins: 30,
  });
  const [slotForm, setSlotForm] = useState(emptySlotForm);
  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      });
      if (search.trim()) params.set('search', search.trim());
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo) params.set('date_to', dateTo);

      const res = await fetch(`/api/admin/carmel?${params}`, { credentials: 'include' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to load');
      }
      const data = await res.json();
      setList(Array.isArray(data.data) ? data.data : []);
      setTotal(Number(data.total) || 0);
      setTotalPages(Number(data.totalPages) || 1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, dateFrom, dateTo]);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/carmel?resource=slots', { credentials: 'include' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to load slots');
      }
      const data = await res.json();
      setSlots(Array.isArray(data.data) ? data.data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load slots');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'attendance') fetchAttendance();
    else fetchSlots();
  }, [tab, fetchAttendance, fetchSlots]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAttendance();
  };

  const handleAddAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slot_time.trim()) {
      setError('Name and slot time are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/carmel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || 'Add failed');
      setShowForm(false);
      setForm({
        name: '',
        date: todayIST(),
        slot_time: '',
        session_name: 'காலை நேரம்',
        duration_mins: 30,
      });
      await fetchAttendance();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Add failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotForm.slot_time.trim() || !slotForm.session_name.trim()) {
      setError('slot_time and session_name are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/carmel', {
        method: editingSlotId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          resource: 'slots',
          id: editingSlotId,
          ...slotForm,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || 'Save failed');
      setShowForm(false);
      setEditingSlotId(null);
      setSlotForm(emptySlotForm);
      await fetchSlots();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAttendance = async (id: number) => {
    if (!confirm('Delete this attendance record?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/carmel?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || 'Delete failed');
      await fetchAttendance();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (id: number) => {
    if (!confirm('Delete this slot?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/carmel?resource=slots&id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || 'Delete failed');
      await fetchSlots();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const startEditSlot = (s: SlotItem) => {
    setEditingSlotId(s.id);
    setSlotForm({
      slot_time: s.slot_time,
      session_name: s.session_name,
      assigned_member: s.assigned_member || '',
      sort_order: s.sort_order,
    });
    setShowForm(true);
  };

  const exportUrl = (() => {
    const params = new URLSearchParams({ export: 'csv' });
    if (search.trim()) params.set('search', search.trim());
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    return `/api/admin/carmel?${params}`;
  })();

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Carmel Watch' }]} />

      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-1">
              Carmel 24x7 Attendance
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage prayer watch marks and slot schedule
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {tab === 'attendance' && (
              <a href={exportUrl}>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" /> Export CSV
                </Button>
              </a>
            )}
            <Button
              type="button"
              onClick={() => {
                setShowForm((v) => !v);
                setEditingSlotId(null);
                if (tab === 'slots') setSlotForm(emptySlotForm);
              }}
              className="w-full sm:w-auto"
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4 mr-2" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />{' '}
                  {tab === 'attendance' ? 'Manual Add' : 'Add Slot'}
                </>
              )}
            </Button>
          </div>
        </div>
      </FadeInUp>

      <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm mb-6 w-fit">
        <button
          type="button"
          onClick={() => {
            setTab('attendance');
            setShowForm(false);
          }}
          className={`px-4 py-2 min-h-[40px] ${
            tab === 'attendance'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
          }`}
        >
          Attendance
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('slots');
            setShowForm(false);
          }}
          className={`px-4 py-2 min-h-[40px] ${
            tab === 'slots'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
          }`}
        >
          Slots
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {showForm && tab === 'attendance' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add record</h2>
          <form
            onSubmit={handleAddAttendance}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slot time
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                placeholder="04:00-04:30"
                value={form.slot_time}
                onChange={(e) => setForm((f) => ({ ...f, slot_time: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={form.session_name}
                onChange={(e) => setForm((f) => ({ ...f, session_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (mins)
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={form.duration_mins}
                onChange={(e) =>
                  setForm((f) => ({ ...f, duration_mins: parseInt(e.target.value, 10) }))
                }
              >
                <option value={30}>30</option>
                <option value={60}>60</option>
              </select>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </form>
        </div>
      )}

      {showForm && tab === 'slots' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingSlotId ? 'Edit slot' : 'Add slot'}
          </h2>
          <form
            onSubmit={handleSaveSlot}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slot time
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                placeholder="04:00-04:30"
                value={slotForm.slot_time}
                onChange={(e) => setSlotForm((f) => ({ ...f, slot_time: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session name
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={slotForm.session_name}
                onChange={(e) => setSlotForm((f) => ({ ...f, session_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigned member
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                placeholder="Leave empty for vacant"
                value={slotForm.assigned_member}
                onChange={(e) => setSlotForm((f) => ({ ...f, assigned_member: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort order
              </label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={slotForm.sort_order}
                onChange={(e) =>
                  setSlotForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingSlotId ? 'Update' : 'Create'}
            </Button>
          </form>
        </div>
      )}

      {tab === 'attendance' && (
        <>
          <form
            onSubmit={handleFilter}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6 p-4 sm:p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  placeholder="Name / slot / session..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline">
                Filter
              </Button>
            </div>
          </form>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
              {total} record{total === 1 ? '' : 's'}
            </div>
            {loading ? (
              <div className="p-10 flex justify-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : list.length === 0 ? (
              <p className="p-8 text-center text-gray-500">No records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Slot</th>
                      <th className="px-4 py-3 font-medium">Session</th>
                      <th className="px-4 py-3 font-medium">Mins</th>
                      <th className="px-4 py-3 font-medium">By</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {list.map((row) => (
                      <tr key={row.id} className="text-gray-900 dark:text-gray-100">
                        <td className="px-4 py-3">{row.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{row.date}</td>
                        <td className="px-4 py-3 font-medium">{row.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{row.slot_time}</td>
                        <td className="px-4 py-3">{row.session_name || '—'}</td>
                        <td className="px-4 py-3">{row.duration_mins}</td>
                        <td className="px-4 py-3">{row.added_by}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleDeleteAttendance(row.id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 min-h-[40px]"
                            disabled={saving}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'slots' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
            {slots.length} slot{slots.length === 1 ? '' : 's'}
          </div>
          {loading ? (
            <div className="p-10 flex justify-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : slots.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No slots yet. Run scripts/seed-carmel-slots.sql or add slots here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Slot</th>
                    <th className="px-4 py-3 font-medium">Session</th>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Empty</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {slots.map((s) => (
                    <tr key={s.id} className="text-gray-900 dark:text-gray-100">
                      <td className="px-4 py-3">{s.sort_order}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                        {s.slot_time}
                      </td>
                      <td className="px-4 py-3">{s.session_name}</td>
                      <td className="px-4 py-3">{s.assigned_member || '—'}</td>
                      <td className="px-4 py-3">{s.is_empty ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startEditSlot(s)}
                            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 min-h-[40px]"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(s.id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 min-h-[40px]"
                            disabled={saving}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
