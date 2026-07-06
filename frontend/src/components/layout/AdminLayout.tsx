import React, { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
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
    <DashboardLayout>
      <div className="p-6">
        {children}
      </div>
    </DashboardLayout>
  );
};
