'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Bell, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';

export function TopNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

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
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear bg-background sticky top-0 z-50">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        {/* Left Side: Sidebar Trigger & Breadcrumbs */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href="#">{crumb}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right-Side Search & Status Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full border">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{currentDate}</span>
          </div>

          <div className="relative w-48 hidden lg:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground" />
            </span>
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 h-8 bg-muted border-none rounded-md text-xs"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-lg"></span>
          </Button>

          <div className="flex items-center gap-3 pl-2 border-l">
            <div className="text-right">
              <h5 className="text-xs font-bold leading-tight">{user ? user.name : 'Guest User'}</h5>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider">
                {user && user.roles.length > 0 ? user.roles[0] : 'System'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
