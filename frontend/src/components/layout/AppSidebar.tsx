"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/store";
import { authService } from "@/features/auth/services/authService";
import { LogOut } from "lucide-react";
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  ShieldCheck, 
  Settings, 
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
  ClipboardList,
  Building2
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
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

export function AppSidebar() {
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

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">ERP System</span>
                <span className="truncate text-xs">Construction Management</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(`${item.href}/`));
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        tooltip={item.name}
                        isActive={isActive}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              tooltip="Logout"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
