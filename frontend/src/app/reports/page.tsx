"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { PieChart, LineChart, FileDown } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', name: 'Q2 Financial Summary', module: 'Finance', type: 'PDF', generatedDate: '2026-07-01' },
  { id: '2', name: 'Material Usage Forecast', module: 'Warehouse', type: 'Excel', generatedDate: '2026-06-28' },
  { id: '3', name: 'Site Incident Log', module: 'Quality', type: 'PDF', generatedDate: '2026-06-15' },
];

export default function ReportsPage() {
  const [data] = useState(MOCK_DATA);

  const columns = [
    { header: 'Report Name', accessor: 'name' as const, className: 'font-medium text-white' },
    { 
      header: 'Module', 
      accessor: (item: any) => (
        <Badge variant="default">{item.module}</Badge>
      ) 
    },
    { header: 'Format', accessor: 'type' as const, className: 'text-slate-400' },
    { header: 'Generated On', accessor: 'generatedDate' as const },
    { 
      header: 'Actions', 
      accessor: (item: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <FileDown className="w-3.5 h-3.5" />
            Download
          </Button>
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
              Analytics & Reports
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel border-slate-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Financial Reports</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Generate P&L Statement</Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Cash Flow Analysis</Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Expense Breakdown</Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-slate-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <LineChart className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Project Reports</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Construction Progress Tracking</Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Resource Utilization</Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Contractor Performance</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Recent Generated Reports</CardTitle>
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
