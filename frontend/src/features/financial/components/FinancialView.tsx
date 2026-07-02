import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/StatsCard';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancial } from '../hooks/useFinancial';

export function FinancialView() {
  const {
    data,
    loading,
    totalTransactions
  } = useFinancial();

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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Loading transactions...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No transactions found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs text-slate-400">{item.txNumber || item.tx_number}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            <span className={item.type === 'Income' ? 'text-emerald-400' : 'text-red-400'}>
                              {item.type}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell className="font-bold font-mono">{item.amount}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
