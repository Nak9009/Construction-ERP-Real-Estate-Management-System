"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', roleName: 'Super Admin', users: 4, accessLevel: 'Full Access', status: 'active' },
  { id: '2', roleName: 'Manager', users: 12, accessLevel: 'Department Only', status: 'active' },
  { id: '3', roleName: 'Staff', users: 29, accessLevel: 'Read & Write Limited', status: 'active' },
];

export default function RolesPage() {
  const [data] = useState(MOCK_DATA);

  const columns = [
    { header: 'Role Name', accessor: 'roleName' as const, className: 'font-medium text-white' },
    { header: 'Assigned Users', accessor: 'users' as const },
    { 
      header: 'Access Level', 
      accessor: (item: any) => (
        <span className={item.accessLevel === 'Full Access' ? 'text-red-400 font-medium' : 'text-slate-400'}>
          {item.accessLevel}
        </span>
      ) 
    },
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
          <Button variant="ghost" className="h-8 text-cyan-400 hover:text-cyan-300">Edit Permissions</Button>
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
              Roles & Permissions
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Create Role</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-slate-800/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Roles</p>
                  <h3 className="text-2xl font-bold text-white">8</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-slate-800/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Admin Roles</p>
                  <h3 className="text-2xl font-bold text-white">2</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-slate-800/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Custom Policies</p>
                  <h3 className="text-2xl font-bold text-white">14</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>System Roles</CardTitle>
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
