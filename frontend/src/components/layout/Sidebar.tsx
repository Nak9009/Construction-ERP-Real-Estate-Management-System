'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Map,
  Home,
  Hammer,
  Users,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, company, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'view_analytics' },
    { name: 'Company Profile', href: '/company', icon: Building2, permission: 'view_companies' },
    { name: 'Projects', href: '/projects', icon: FolderKanban, permission: 'view_projects' },
    { name: 'Land Subdivision', href: '/lands', icon: Map, permission: 'view_lands' },
    { name: 'House Catalog', href: '/houses', icon: Home, permission: 'view_houses' },
    { name: 'Construction stages', href: '/construction', icon: Hammer, permission: 'view_construction' },
  ];

  // Helper to check user permissions
  const hasPermission = (perm: string) => {
    if (!user) return false;
    if (user.roles.includes('Super Admin') || user.roles.includes('Company Owner')) return true;
    return user.permissions.includes(perm);
  };

  const filteredNav = navigation.filter((item) => hasPermission(item.permission));

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-md border-r border-slate-900 flex flex-col h-screen fixed left-0 top-0 z-20 text-slate-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            A
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-wide leading-none">ANTIGRAVITY</h1>
            <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Construction ERP</span>
          </div>
        </div>
      </div>

      {/* Tenant Context */}
      <div className="px-6 py-4 border-b border-slate-900 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400">
            {company ? company.name.substring(0, 2).toUpperCase() : 'CO'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-white truncate">{company ? company.name : 'No Company'}</h4>
            <span className="text-[10px] text-cyan-400/90 font-medium">Tenant Active</span>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-white border border-cyan-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                  : 'hover:bg-slate-900/60 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                }`} />
                <span>{item.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 opacity-0 transition-all duration-300 group-hover:opacity-100 ${
                isActive ? 'text-cyan-400 translate-x-0' : 'text-slate-500 -translate-x-1 group-hover:translate-x-0'
              }`} />
            </Link>
          );
        })}
      </nav>

      {/* User Session profile / Logout */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs border border-slate-700">
              {user ? user.name.substring(0, 1).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-semibold text-white truncate">{user ? user.name : 'Guest'}</h5>
              <span className="text-[9px] text-slate-500 truncate block">
                {user && user.roles.length > 0 ? user.roles[0] : 'No Role'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-900 hover:border-red-500/30 hover:bg-red-500/5 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
