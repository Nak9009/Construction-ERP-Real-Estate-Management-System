import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
