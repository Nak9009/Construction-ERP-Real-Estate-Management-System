import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Navbar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="relative hidden sm:block">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 h-10 bg-gray-50 border-gray-200 rounded-full text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:bg-white w-64 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
          </div>
          <Avatar className="h-9 w-9 shadow-sm">
            <AvatarFallback className="bg-blue-600 text-white font-semibold">
              {user?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
