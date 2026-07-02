"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from '@/components/ui/StatsCard';
import { ShieldCheck, AlertCircle, Wrench } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', claimRef: 'CLM-2026-089', customer: 'Alice Wong', property: 'Plot 45', issue: 'Plumbing leak', date: '2026-07-01', status: 'open' },
  { id: '2', claimRef: 'CLM-2026-088', customer: 'Bob Smith', property: 'Plot 12', issue: 'Roof tile replacement', date: '2026-06-25', status: 'in_progress' },
  { id: '3', claimRef: 'CLM-2026-087', customer: 'Charlie Davis', property: 'Plot 33', issue: 'Door hinge squeak', date: '2026-06-15', status: 'resolved' },
];

export default function WarrantyPage() {
  const [data] = useState(MOCK_DATA);

  const columns = [
    { header: 'Claim Ref', accessor: 'claimRef' as const, className: 'font-mono text-xs text-slate-400' },
    { header: 'Customer', accessor: 'customer' as const, className: 'font-medium text-white' },
    { header: 'Property', accessor: 'property' as const },
    { header: 'Issue Description', accessor: 'issue' as const },
    { header: 'Filed On', accessor: 'date' as const },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={
          item.status === 'resolved' ? 'success' : 
          item.status === 'in_progress' ? 'info' : 
          'warning'
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
              Warranty & Maintenance
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ New Request</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Active Claims" 
              value={15} 
              icon={<AlertCircle className="w-5 h-5 text-yellow-400" />} 
            />
            <StatsCard 
              title="Resolved This Month" 
              value={42} 
              icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} 
            />
            <StatsCard 
              title="Pending Inspections" 
              value={8} 
              icon={<Wrench className="w-5 h-5 text-cyan-400" />} 
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Recent Service Requests</CardTitle>
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
