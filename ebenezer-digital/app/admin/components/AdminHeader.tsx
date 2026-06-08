"use client";

import Link from "next/link";
import { Bell, Search, ExternalLink } from "lucide-react";

interface AdminHeaderProps {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* View Site */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden sm:inline">View Site</span>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">{user.email}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
