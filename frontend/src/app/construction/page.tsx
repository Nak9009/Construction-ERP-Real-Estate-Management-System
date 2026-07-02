"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from '@/components/ui/StatsCard';
import { Hammer, CheckSquare, Clock } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', houseRef: 'Block A - Plot 12', stage: 'Foundation', completion: 100, status: 'completed', endDate: '2026-06-15' },
  { id: '2', houseRef: 'Block A - Plot 13', stage: 'Framing', completion: 45, status: 'in_progress', endDate: '2026-07-20' },
  { id: '3', houseRef: 'Block B - Plot 05', stage: 'Roofing', completion: 0, status: 'planned', endDate: '2026-08-10' },
];

export default function ConstructionPage() {
  const [data] = useState(MOCK_DATA);

  const columns = [
    { header: 'Property Reference', accessor: 'houseRef' as const, className: 'font-medium text-white' },
    { header: 'Current Stage', accessor: 'stage' as const },
    { 
      header: 'Progress', 
      accessor: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden w-24">
            <div 
              className={`h-full ${item.completion === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} 
              style={{ width: `${item.completion}%` }}
            />
          </div>
          <span className="text-xs font-mono">{item.completion}%</span>
        </div>
      ) 
    },
    { header: 'Est. Completion', accessor: 'endDate' as const },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={
          item.status === 'completed' ? 'success' : 
          item.status === 'in_progress' ? 'info' : 
          'default'
        }>
          {item.status.replace('_', ' ')}
        </Badge>
      ) 
    },
    { 
      header: 'Actions', 
      accessor: (item: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300">Update</Button>
        </div>
      ) 
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-64">
        <TopNav />
        <main className="flex-1 p-8 pt-24 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
              Construction Progress
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">Schedule Activity</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Active Sites" 
              value={14} 
              icon={<Hammer className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="Tasks Completed (Week)" 
              value={28} 
              icon={<CheckSquare className="w-5 h-5 text-emerald-400" />} 
            />
            <StatsCard 
              title="Behind Schedule" 
              value={2} 
              icon={<Clock className="w-5 h-5 text-red-400" />} 
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Active Construction Phases</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table columns={columns} data={data} keyExtractor={(item) => item.id} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
