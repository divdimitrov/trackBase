'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AdminGate from '@/components/AdminGate';
import { useLanguage } from '@/components/LanguageProvider';

function AdminNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: '/admin', label: t.admin.title, exact: true },
    { href: '/admin/recipes', label: t.admin.dashboard.recipes },
    { href: '/admin/diet', label: t.admin.dashboard.diet },
    { href: '/admin/workouts', label: t.admin.dashboard.workouts },
    { href: '/admin/shopping', label: t.admin.dashboard.shopping },
    { href: '/admin/media', label: t.admin.dashboard.media },
  ];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex items-center gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive(l.href, l.exact)
              ? 'bg-gray-900 text-white'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { apiKey } = useAuth();

  return (
    <>
      {apiKey && <AdminNav />}
      <AdminGate>{children}</AdminGate>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
