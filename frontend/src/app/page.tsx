'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import {
  TrendingUp,
  Activity,
  Home,
  AlertTriangle,
  DollarSign,
  Briefcase,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Layers,
  MapPin,
  Clock
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

// We import standard recharts components dynamically to avoid SSR errors
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active_projects: 3,
    total_houses: 120,
    houses_completed: 45,
    houses_under_construction: 65,
    delayed_projects: 1,
    total_budget: 2500000.00,
    total_expenses: 1280000.00,
    budget_used_percentage: 51.2
  });

  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Green City Phase 1',
      address: 'Chroy Changvar District, Phnom Penh',
      budget: 2500000.00,
      start_date: '2026-01-01',
      end_date: '2027-12-31',
      status: 'in_progress',
      progress: 62,
      description: 'A boutique gated community featuring 120 modern luxury homes.'
    },
    {
      id: '2',
      name: 'Borey Mekong Royal',
      address: 'National Road 6A, Phnom Penh',
      budget: 4800000.00,
      start_date: '2025-06-01',
      end_date: '2027-06-01',
      status: 'delayed',
      progress: 40,
      description: 'High-end mixed residential development.'
    },
    {
      id: '3',
      name: 'Sen Sok Plaza & Residences',
      address: 'Sen Sok, Phnom Penh',
      budget: 1500000.00,
      start_date: '2026-03-01',
      end_date: '2026-12-31',
      status: 'planning',
      progress: 5,
      description: 'Commercial strip mall and residential townhouses.'
    }
  ]);

  // Chart data definitions
  const budgetVsActualData = [
    { name: 'Green City', budget: 250, actual: 128 },
    { name: 'Mekong Royal', budget: 480, actual: 290 },
    { name: 'Sen Sok Plaza', budget: 150, actual: 15 },
  ];

  const houseStatusData = [
    { name: 'Completed', value: 45, color: '#10b981' },
    { name: 'Building', value: 65, color: '#06b6d4' },
    { name: 'Available', value: 10, color: '#6366f1' },
  ];

  const cashFlowData = [
    { month: 'Jan', revenue: 40, expenses: 30 },
    { month: 'Feb', revenue: 55, expenses: 45 },
    { month: 'Mar', revenue: 75, expenses: 50 },
    { month: 'Apr', revenue: 90, expenses: 65 },
    { month: 'May', revenue: 110, expenses: 70 },
    { month: 'Jun', revenue: 135, expenses: 80 },
  ];

  useEffect(() => {
    // Attempt to load live data if authenticated
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/dashboard');
        if (res.data) {
          setStats(res.data.widgets);
        }
      } catch (err) {
        console.warn('Could not fetch live dashboard stats, fallback to mock data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>;
      case 'delayed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Delayed</span>;
      case 'planning':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Planning</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <TopNav />

        {/* Inner Content Padding */}
        <main className="flex-1 p-8 pt-24 space-y-8 max-w-7xl w-full mx-auto">
          {/* Welcome Title */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Executive Overview
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Real-time analytics and construction progress monitors.
            </p>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Projects */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full transition-all duration-300 group-hover:bg-cyan-500/10"></div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Projects</span>
                  <h3 className="text-2xl font-black text-white mt-0.5">{stats.active_projects}</h3>
                </div>
              </div>
            </div>

            {/* Total Houses */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full transition-all duration-300 group-hover:bg-indigo-500/10"></div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Houses</span>
                  <h3 className="text-2xl font-black text-white mt-0.5">{stats.total_houses}</h3>
                </div>
              </div>
            </div>

            {/* Construction Progress */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full transition-all duration-300 group-hover:bg-emerald-500/10"></div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Completed Houses</span>
                  <h3 className="text-2xl font-black text-white mt-0.5">{stats.houses_completed}</h3>
                </div>
              </div>
            </div>

            {/* Delayed Alerts */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full transition-all duration-300 group-hover:bg-rose-500/10"></div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Delayed Projects</span>
                  <h3 className="text-2xl font-black text-white mt-0.5">{stats.delayed_projects}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Widget Card */}
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Portfolio Budget Monitor</h4>
                  <p className="text-xs text-slate-400">Total approved funds and overhead costs logged.</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Budget Cap</span>
                  <span className="text-lg font-bold text-white">${stats.total_budget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Expenses Approved</span>
                  <span className="text-lg font-bold text-cyan-400">${stats.total_expenses.toLocaleString()}</span>
                </div>
                <div className="w-24">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Used %</span>
                  <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${stats.budget_used_percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-white mt-1 block">{stats.budget_used_percentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Budget vs Actual */}
            <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white">Project Budget vs Actual ($K)</h4>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetVsActualData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                    <Bar dataKey="budget" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Planned Budget" />
                    <Bar dataKey="actual" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Expenses Incurred" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: House Status */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <PieIcon className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-semibold text-white">Housing Inventory</h4>
              </div>
              <div className="h-64 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={houseStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {houseStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Central legend */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{stats.total_houses}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Units</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Projects List */}
          <div className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white">Active Projects Monitoring</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-950/50 border border-slate-900/60 p-5 rounded-2xl space-y-4 hover:border-slate-800 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-white text-sm">{proj.name}</h5>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{proj.address}</span>
                      </div>
                    </div>
                    {getStatusBadge(proj.status)}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed truncate">{proj.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-900/60">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>CONSTRUCTION PROGRESS</span>
                      <span className="text-white">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Starts: {proj.start_date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Budget: ${(proj.budget / 1000).toLocaleString()}K</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
