"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from '@/components/ui/StatsCard';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', txNumber: 'TX-8901', type: 'Income', category: 'House Sale', amount: '+$350,000', date: '2026-07-02', status: 'completed' },
  { id: '2', txNumber: 'TX-8900', type: 'Expense', category: 'Material Purchase', amount: '-$14,500', date: '2026-07-01', status: 'completed' },
  { id: '3', txNumber: 'TX-8899', type: 'Expense', category: 'Payroll', amount: '-$42,000', date: '2026-06-30', status: 'pending' },
];

export default function FinancialPage() {
  const [data] = useState(MOCK_DATA);

  const columns = [
    { header: 'Transaction ID', accessor: 'txNumber' as const, className: 'font-mono text-xs text-slate-400' },
    { header: 'Date', accessor: 'date' as const },
    { 
      header: 'Type', 
      accessor: (item: any) => (
        <span className={item.type === 'Income' ? 'text-emerald-400' : 'text-red-400'}>
          {item.type}
        </span>
      ) 
    },
    { header: 'Category', accessor: 'category' as const, className: 'font-medium' },
    { header: 'Amount', accessor: 'amount' as const, className: 'font-bold font-mono' },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={item.status === 'completed' ? 'success' : 'warning'}>
          {item.status}
        </Badge>
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
              Financial Overview
            </h1>
            <div className="flex gap-3">
              <Button variant="ghost" className="border border-slate-800 text-slate-300 hover:bg-slate-900">Record Expense</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border-0">Record Income</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Balance" 
              value="$1,245,000" 
              icon={<Wallet className="w-5 h-5 text-indigo-400" />} 
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatsCard 
              title="Monthly Income" 
              value="$450,000" 
              icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} 
              trend={{ value: 8.2, isPositive: true }}
            />
            <StatsCard 
              title="Monthly Expenses" 
              value="$285,000" 
              icon={<TrendingDown className="w-5 h-5 text-red-400" />} 
              trend={{ value: 3.1, isPositive: false }}
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Recent Transactions</CardTitle>
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
