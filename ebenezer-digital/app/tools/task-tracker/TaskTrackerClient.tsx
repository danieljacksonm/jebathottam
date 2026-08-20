"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
  due: string;
};

const STORAGE_KEY = "ebenezer-task-tracker-v1";
const uid = () => Math.random().toString(36).slice(2, 9);

export function TaskTrackerClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw) as Task[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, ready]);

  const openCount = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks((list) => [{ id: uid(), title: title.trim(), done: false, due }, ...list]);
    setTitle("");
    setDue("");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-indigo-700">Free tool · Ebenezer Store</p>
          <h1 className="text-3xl font-bold text-slate-900">Task Tracker</h1>
          <p className="mt-1 text-slate-600">Simple to-do list saved on this device. No account.</p>
        </div>
        <Link href="/products/task-tracker" className="text-sm font-medium text-indigo-800 hover:underline">
          ← Product page
        </Link>
      </div>

      <form onSubmit={add} className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto_auto]">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
        <button type="submit" className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white">
          Add
        </button>
      </form>

      <p className="mb-3 text-sm text-slate-600">{openCount} open · {tasks.length} total</p>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() =>
                setTasks((list) => list.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
              }
            />
            <div className="min-w-0 flex-1">
              <p className={`font-medium ${t.done ? "text-slate-400 line-through" : "text-slate-900"}`}>{t.title}</p>
              {t.due ? <p className="text-xs text-slate-500">Due {t.due}</p> : null}
            </div>
            <button
              type="button"
              className="text-xs text-red-600"
              onClick={() => setTasks((list) => list.filter((x) => x.id !== t.id))}
            >
              Remove
            </button>
          </li>
        ))}
        {tasks.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No tasks yet.</li>}
      </ul>
      <p className="mt-4 text-xs text-slate-500">Saved in your browser only (localStorage).</p>
    </div>
  );
}
