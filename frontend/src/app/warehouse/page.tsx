"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from '@/components/ui/StatsCard';
import { PackageSearch, AlertCircle, TrendingDown } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', sku: 'CEM-001', name: 'Portland Cement (50kg)', quantity: 450, unit: 'bags', minStock: 200, status: 'in_stock' },
  { id: '2', sku: 'STL-012', name: 'Rebar 12mm', quantity: 45, unit: 'tons', minStock: 50, status: 'low_stock' },
  { id: '3', sku: 'WD-005', name: 'Plywood 18mm', quantity: 0, unit: 'sheets', minStock: 100, status: 'out_of_stock' },
];

export default function WarehousePage() {
  const [data] = useState(MOCK_DATA);

  const columns = [
    { header: 'SKU', accessor: 'sku' as const, className: 'font-mono text-xs text-slate-400' },
    { header: 'Item Name', accessor: 'name' as const, className: 'font-medium text-white' },
    { 
      header: 'Stock Level', 
      accessor: (item: any) => `${item.quantity} ${item.unit}`
    },
    { header: 'Min Stock', accessor: 'minStock' as const },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={
          item.status === 'in_stock' ? 'success' : 
          item.status === 'low_stock' ? 'warning' : 
          'error'
        }>
          {item.status.replace(/_/g, ' ')}
        </Badge>
      ) 
    },
    { 
      header: 'Actions', 
      accessor: (item: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300">Restock</Button>
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
              Warehouse Inventory
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Receive Stock</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Items" 
              value="1,245" 
              icon={<PackageSearch className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="Low Stock Alerts" 
              value={18} 
              icon={<AlertCircle className="w-5 h-5 text-yellow-400" />} 
            />
            <StatsCard 
              title="Out of Stock" 
              value={5} 
              icon={<TrendingDown className="w-5 h-5 text-red-400" />} 
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Material Stock List</CardTitle>
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
