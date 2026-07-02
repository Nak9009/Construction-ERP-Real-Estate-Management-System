import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/StatsCard';
import { Users, Building2, DollarSign, Wrench, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardView() {
  const { metrics, isLoading, chartData } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav title="Dashboard Overview" />
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-400 mt-2">Welcome back! Here's what's happening today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Users" 
              value={isLoading ? "..." : (metrics?.total_users || 0)} 
              icon={<Users className="w-5 h-5 text-blue-400" />} 
            />
            <StatsCard 
              title="Active Projects" 
              value={isLoading ? "..." : (metrics?.active_projects || 0)} 
              icon={<Building2 className="w-5 h-5 text-emerald-400" />} 
            />
            <StatsCard 
              title="Monthly Sales" 
              value={isLoading ? "..." : `$${(metrics?.monthly_sales || 0).toLocaleString()}`} 
              icon={<DollarSign className="w-5 h-5 text-violet-400" />} 
            />
            <StatsCard 
              title="Open Maintenance" 
              value={isLoading ? "..." : (metrics?.open_maintenance_requests || 0)} 
              icon={<Wrench className="w-5 h-5 text-orange-400" />} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} stroke="#94a3b8" />
                      <Tooltip cursor={{ fill: '#0f172a' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                      <Bar dataKey="sales" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="relative mt-1">
                        <div className="h-2.5 w-2.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                        {i !== 4 && <div className="absolute top-4 left-[4px] w-px h-10 bg-slate-800"></div>}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">New project created</p>
                        <p className="text-xs text-slate-500 mt-0.5">2 hours ago by Admin User</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
