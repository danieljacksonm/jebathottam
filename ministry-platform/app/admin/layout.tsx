'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeProvider, useTheme } from '@/components/admin/theme-provider';
import { Logo } from '@/components/ui/logo';
import { ChatWidget } from '@/components/chat/chat-widget';
import { adminNavIcons } from '@/components/ui/icons';

const navSections = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', iconKey: 'dashboard' as const },
    ],
  },
  {
    label: 'Website content',
    items: [
      { name: 'Hero Slider', href: '/admin/slider', iconKey: 'slider' as const },
      { name: 'Blogs', href: '/admin/blogs', iconKey: 'blogs' as const },
      { name: 'Gallery', href: '/admin/gallery', iconKey: 'gallery' as const },
      { name: 'Events', href: '/admin/events', iconKey: 'events' as const },
      { name: 'Testimonies', href: '/admin/testimonies', iconKey: 'testimonies' as const },
    ],
  },
  {
    label: 'People',
    items: [
      { name: 'Team', href: '/admin/team', iconKey: 'team' as const },
      { name: 'Followers & Members', href: '/admin/followers', iconKey: 'followers' as const },
    ],
  },
  {
    label: 'Media & communication',
    items: [
      { name: 'Social Media', href: '/admin/social-media', iconKey: 'socialMedia' as const, badge: 'New' },
      { name: 'Media Library', href: '/admin/media', iconKey: 'media' as const },
      { name: '24-Hour Audio', href: '/admin/audio', iconKey: 'audio' as const },
      { name: 'Notes & Sermons', href: '/admin/notes', iconKey: 'notes' as const },
      { name: 'Prophecy', href: '/admin/prophecy', iconKey: 'prophecy' as const },
      { name: 'Chat', href: '/admin/chat', iconKey: 'chat' as const },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', iconKey: 'settings' as const },
    ],
  },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) {
          router.replace('/login?from=' + encodeURIComponent(pathname));
          return;
        }
        setAuthChecked(true);
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [router, pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.replace('/login');
    router.refresh();
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
            <Logo variant="admin" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.label}>
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {section.label}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    const Icon = adminNavIcons[item.iconKey];
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.75} />
                          <span className="flex-1 truncate">{item.name}</span>
                          {'badge' in item && item.badge && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-primary-600 text-white rounded-full flex-shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Website</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white touch-manipulation"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                Welcome, Admin
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white min-h-[44px] flex items-center px-2 touch-manipulation"
              >
                Log out
              </button>
              <button className="min-w-[44px] min-h-[44px] rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center touch-manipulation" aria-label="Profile">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ThemeProvider>
  );
}
