import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building, ShieldCheck, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      logout();
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Roles', href: '/admin/roles', icon: ShieldCheck },
    { name: 'Company', href: '/company', icon: Building },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-lg">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-tight">ERP <span className="text-blue-500">System</span></h1>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
