"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  FileText,
  MessageSquare,
  Star,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Radio,
} from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Briefcase, label: "Services", href: "/admin/services" },
  { icon: FolderOpen, label: "Portfolio", href: "/admin/portfolio" },
  { icon: ShoppingBag, label: "Store Products", href: "/admin/store-products" },
  { icon: FileText, label: "Blog Posts", href: "/admin/blog" },
  { icon: Radio, label: "World News", href: "/admin/news" },
  { icon: MessageSquare, label: "Inquiries", href: "/admin/inquiries" },
  { icon: Star, label: "Testimonials", href: "/admin/testimonials" },
  { icon: Users, label: "Team", href: "/admin/team" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="bg-slate-900 border-r border-slate-800 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Admin<span className="text-brand-500">.</span>
            </span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-brand-400" : ""}`} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800">
        {!isCollapsed && (
          <div className="mb-4 px-3">
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
