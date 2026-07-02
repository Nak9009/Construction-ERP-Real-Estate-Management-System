"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from '@/components/ui/StatsCard';
import { ShoppingCart, Clock, CheckCircle } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', poNumber: 'PO-2026-045', supplier: 'BuildMart Wholesale', total: '$14,500', date: '2026-07-01', status: 'pending' },
  { id: '2', poNumber: 'PO-2026-044', supplier: 'Steel Dynamics', total: '$32,000', date: '2026-06-28', status: 'approved' },
  { id: '3', poNumber: 'PO-2026-043', supplier: 'LumberKing', total: '$8,200', date: '2026-06-25', status: 'fulfilled' },
];

export default function ProcurementPage() {
  const [data] = useState(MOCK_DATA);

  const columns = [
    { header: 'PO Number', accessor: 'poNumber' as const, className: 'font-medium text-emerald-400' },
    { header: 'Supplier', accessor: 'supplier' as const },
    { header: 'Order Date', accessor: 'date' as const },
    { header: 'Total Value', accessor: 'total' as const, className: 'font-bold' },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={
          item.status === 'fulfilled' ? 'success' : 
          item.status === 'approved' ? 'info' : 
          'warning'
        }>
          {item.status}
        </Badge>
      ) 
    },
    { 
      header: 'Actions', 
      accessor: (item: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300">View</Button>
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
              Procurement & Purchasing
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Create PO</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Active Orders" 
              value={24} 
              icon={<ShoppingCart className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="Pending Approval" 
              value={8} 
              icon={<Clock className="w-5 h-5 text-yellow-400" />} 
            />
            <StatsCard 
              title="Fulfilled (This Month)" 
              value={42} 
              icon={<CheckCircle className="w-5 h-5 text-emerald-400" />} 
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Purchase Orders</CardTitle>
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
