'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Database, ArrowLeft, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/admin';
import { useState } from 'react';

function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (pathname === '/admin/login') return null;

  const links = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Products', href: '/admin/products', icon: Database },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-full lg:w-64 bg-text-charcoal text-white shrink-0 border-r border-white/10 flex flex-col font-body">
      {/* Brand area */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-accent-gold">GR Dashboard</h2>
          <p className="text-[10px] text-white/50 tracking-wider">VSM 1969 ADMIN PANEL</p>
        </div>
        <Link href="/" className="text-white/50 hover:text-accent-gold p-1" title="Back to Store">
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-grow p-4 flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-primary-red text-white'
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-primary-red hover:bg-primary-red/10 transition-colors cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg-cream/10">
      <AdminNavigation />
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
