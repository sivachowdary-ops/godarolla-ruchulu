'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Database, ArrowLeft, LogOut, Menu, X } from 'lucide-react';
import { logout } from '@/app/actions/admin';
import { useState, useEffect } from 'react';

function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

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
    <>
      {/* Mobile Header (Hamburger) */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-text-charcoal text-white border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-heading font-extrabold text-lg text-accent-gold">GR Dashboard</span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop static, Mobile drawer) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] lg:w-64 bg-text-charcoal text-white shrink-0 border-r border-white/10 flex flex-col font-body transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand area */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-accent-gold">GR Dashboard</h2>
            <p className="text-[10px] text-white/50 tracking-wider">VSM 1969 ADMIN PANEL</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-white/50 hover:text-accent-gold p-1" title="Back to Store">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <button
              className="lg:hidden text-white/50 hover:text-white p-1 ml-2"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-grow p-4 flex flex-col gap-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary-red text-white'
                    : 'hover:bg-white/5 text-white/70 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 lg:w-4 lg:h-4 shrink-0" />
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
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-lg text-sm font-semibold text-primary-red hover:bg-primary-red/10 transition-colors cursor-pointer disabled:opacity-50 min-h-[48px]"
          >
            <LogOut className="w-5 h-5 lg:w-4 lg:h-4 shrink-0" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg-cream/10">
      <AdminNavigation />
      <main className="flex-grow flex flex-col overflow-x-hidden min-h-screen">
        <div className="flex-grow p-4 md:p-8 overflow-y-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
