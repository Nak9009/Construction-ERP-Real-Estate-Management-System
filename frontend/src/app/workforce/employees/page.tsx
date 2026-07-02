"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { StatsCard } from '@/components/ui/StatsCard';
import { UserCircle, ShieldCheck, Activity } from 'lucide-react';

// Placeholder data since we might not have the API ready yet
const MOCK_DATA = [
  { id: '1', name: 'John Doe', role: 'Site Manager', department: 'Construction', status: 'active', contact: '+1 234 567 8900' },
  { id: '2', name: 'Jane Smith', role: 'Architect', department: 'Design', status: 'active', contact: '+1 234 567 8901' },
  { id: '3', name: 'Mike Johnson', role: 'Foreman', department: 'Construction', status: 'on_leave', contact: '+1 234 567 8902' },
];

export default function EmployeesPage() {
  const [data, setData] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(false);

  const columns = [
    { header: 'Name', accessor: 'name' as keyof typeof MOCK_DATA[0], className: 'font-medium text-white' },
    { header: 'Role', accessor: 'role' as keyof typeof MOCK_DATA[0] },
    { header: 'Department', accessor: 'department' as keyof typeof MOCK_DATA[0] },
    { header: 'Contact', accessor: 'contact' as keyof typeof MOCK_DATA[0] },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Badge variant={item.status === 'active' ? 'success' : 'warning'}>
          {item.status.replace('_', ' ')}
        </Badge>
      ) 
    },
    { 
      header: 'Actions', 
      accessor: (item: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50">Edit</Button>
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
              Employee Directory
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0 shadow-lg shadow-cyan-900/50">+ Add Employee</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Employees" 
              value={142} 
              icon={<UserCircle className="w-5 h-5 text-cyan-400" />} 
              trend={{ value: 4, isPositive: true }} 
            />
            <StatsCard 
              title="Active on Site" 
              value={118} 
              icon={<Activity className="w-5 h-5 text-emerald-400" />} 
            />
            <StatsCard 
              title="On Leave" 
              value={24} 
              icon={<ShieldCheck className="w-5 h-5 text-yellow-400" />} 
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Staff List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table 
                columns={columns} 
                data={data} 
                keyExtractor={(item) => item.id}
                loading={loading}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
