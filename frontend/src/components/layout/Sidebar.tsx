import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  ShieldCheck, 
  Settings, 
  LogOut,
  FolderKanban,
  Hammer,
  MapPin,
  Home,
  UserCircle,
  HardHat,
  Tractor,
  PackageSearch,
  ShoppingCart,
  Wallet,
  Receipt,
  FileText,
  Target,
  FileSignature,
  HeartHandshake,
  ClipboardCheck,
  Wrench,
  Folders,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Building2
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/features/auth/services/authService';
import { Button } from '@/components/ui/button';

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  
  // Keep track of which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Overview: true,
    Projects: true,
    Inventory: true,
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      logout();
    }
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Projects',
      items: [
        { name: 'Projects', href: '/projects', icon: FolderKanban },
        { name: 'Construction', href: '/construction', icon: Hammer },
      ]
    },
    {
      title: 'Inventory',
      items: [
        { name: 'Land', href: '/inventory/land', icon: MapPin },
        { name: 'Houses', href: '/inventory/houses', icon: Home },
      ]
    },
    {
      title: 'Workforce',
      items: [
        { name: 'Employees', href: '/workforce/employees', icon: UserCircle },
        { name: 'Contractors', href: '/workforce/contractors', icon: HardHat },
        { name: 'Equipment', href: '/equipment', icon: Tractor },
      ]
    },
    {
      title: 'Supply Chain',
      items: [
        { name: 'Warehouse', href: '/warehouse', icon: PackageSearch },
        { name: 'Procurement', href: '/procurement', icon: ShoppingCart },
      ]
    },
    {
      title: 'Finance',
      items: [
        { name: 'Budgets', href: '/financial/budgets', icon: Wallet },
        { name: 'Expenses', href: '/financial/expenses', icon: Receipt },
        { name: 'Invoices', href: '/financial/invoices', icon: FileText },
      ]
    },
    {
      title: 'Sales & CRM',
      items: [
        { name: 'Leads', href: '/sales/leads', icon: Target },
        { name: 'Contracts', href: '/sales', icon: FileSignature },
        { name: 'Customers', href: '/customers', icon: HeartHandshake },
      ]
    },
    {
      title: 'Quality',
      items: [
        { name: 'Inspections', href: '/quality/inspections', icon: ClipboardCheck },
        { name: 'Warranty', href: '/warranty', icon: Wrench },
      ]
    },
    {
      title: 'Documents',
      items: [
        { name: 'Document Manager', href: '/documents', icon: Folders },
        { name: 'Reports', href: '/reports', icon: ClipboardList },
      ]
    },
    {
      title: 'Admin',
      items: [
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Roles', href: '/admin/roles', icon: ShieldCheck },
        { name: 'Company', href: '/company', icon: Building2 },
        { name: 'Settings', href: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 text-slate-300 flex flex-col h-full shadow-lg fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <h1 className="text-xl font-bold text-white tracking-tight">ERP <span className="text-cyan-500">System</span></h1>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto scrollbar-thin">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups[group.title];
          const hasActiveChild = group.items.some(item => pathname === item.href || pathname?.startsWith(`${item.href}/`));
          
          return (
            <div key={group.title} className="flex flex-col gap-1">
              <Button 
                variant="ghost"
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between px-3 py-2 h-auto text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 hover:bg-transparent transition-colors w-full"
              >
                {group.title}
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              
              <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ${isExpanded || hasActiveChild ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {group.items.map((item) => {
                  // Strict active check to prevent '/sales' matching '/sales/leads' accidentally
                  const isActive = pathname === item.href || (item.href !== '/sales' && pathname?.startsWith(`${item.href}/`));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full rounded-xl text-slate-400 bg-slate-900 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border-slate-800 transition-all duration-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
