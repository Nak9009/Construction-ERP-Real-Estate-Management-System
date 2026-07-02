"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from '@/components/ui/StatsCard';
import { HardHat, Briefcase, FileSignature } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', company: 'BuildRite Contracting', trade: 'Electrical', rating: '4.8/5', status: 'active', activeWorkers: 12 },
  { id: '2', company: 'Prime Plumbers', trade: 'Plumbing', rating: '4.5/5', status: 'active', activeWorkers: 8 },
  { id: '3', company: 'Solid Foundation Co.', trade: 'Concrete', rating: '4.9/5', status: 'inactive', activeWorkers: 0 },
];

export default function ContractorsPage() {
  const [data] = useState(MOCK_DATA);

  const columns = [
    { header: 'Company Name', accessor: 'company' as const, className: 'font-medium text-white' },
    { header: 'Trade Specialization', accessor: 'trade' as const },
    { header: 'Active Workers', accessor: 'activeWorkers' as const },
    { header: 'Rating', accessor: 'rating' as const, className: 'text-amber-400 font-medium' },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={item.status === 'active' ? 'success' : 'default'}>
          {item.status}
        </Badge>
      ) 
    },
    { 
      header: 'Actions', 
      accessor: (item: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300">View Contracts</Button>
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
              Contractor Management
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Add Contractor</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Contractors" 
              value={45} 
              icon={<Briefcase className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="Active on Sites" 
              value={18} 
              icon={<HardHat className="w-5 h-5 text-emerald-400" />} 
            />
            <StatsCard 
              title="Active Contracts" 
              value={24} 
              icon={<FileSignature className="w-5 h-5 text-cyan-400" />} 
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Subcontractors List</CardTitle>
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
