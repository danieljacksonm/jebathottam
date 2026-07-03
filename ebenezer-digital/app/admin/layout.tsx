'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar user={{ userId: '1', email: 'admin@ebenezar.com', role: 'admin' }} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader user={{ userId: '1', email: 'admin@ebenezar.com', role: 'admin' }} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
