'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Users, Building2, DollarSign, Wrench } from 'lucide-react';
import api from '../../lib/api';
import { DashboardMetrics } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const chartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{metrics?.total_users || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Projects</p>
              <h3 className="text-2xl font-bold text-gray-900">{metrics?.active_projects || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-violet-100 text-violet-600 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Sales</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ${(metrics?.monthly_sales || 0).toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Open Maintenance</p>
              <h3 className="text-2xl font-bold text-gray-900">{metrics?.open_maintenance_requests || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative mt-1">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    {i !== 4 && <div className="absolute top-3 left-1 w-px h-10 bg-gray-200"></div>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New project created</p>
                    <p className="text-xs text-gray-500">2 hours ago by Admin User</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
