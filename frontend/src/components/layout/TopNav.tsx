'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Bell, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TopNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Helper to format breadcrumbs
  const getBreadcrumbs = () => {
    if (pathname === '/') return ['Dashboard'];
    return pathname
      .split('/')
      .filter((p) => p !== '')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  };

  const breadcrumbs = getBreadcrumbs();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 fixed right-0 top-0 left-64 z-10 text-slate-300">
      {/* Breadcrumbs / Page Title */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-slate-500">ERP</span>
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb} className="flex items-center gap-2">
            <span className="text-slate-700">/</span>
            <span className={idx === breadcrumbs.length - 1 ? 'text-white font-semibold' : 'text-slate-400'}>
              {crumb}
            </span>
          </div>
        ))}
      </div>

      {/* Right-Side Search & Status Actions */}
      <div className="flex items-center gap-6">
        {/* Calendar Widget */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-900">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentDate}</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-48 hidden lg:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-slate-500" />
          </span>
          <Input
            type="text"
            placeholder="Search ERP..."
            className="w-full pl-9 pr-4 h-8 bg-slate-900/40 border-slate-900 rounded-xl text-xs text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-cyan-500/50"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></span>
        </Button>

        {/* Profile Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-900">
          <div className="text-right">
            <h5 className="text-xs font-bold text-white leading-tight">{user ? user.name : 'Guest User'}</h5>
            <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
              {user && user.roles.length > 0 ? user.roles[0] : 'System'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
