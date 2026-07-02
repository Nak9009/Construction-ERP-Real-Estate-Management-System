"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ShieldAlert, Key } from 'lucide-react';

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      // Adjust based on the actual API response shape
      const users = res.data.data || res.data;
      setData(users);
      setTotalUsers(users.length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-64">
        <TopNav />
        <main className="flex-1 p-8 pt-24 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
              User Management
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Invite User</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-slate-800/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Users</p>
                  <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-slate-800/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Admin Accounts</p>
                  <h3 className="text-2xl font-bold text-white">4</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-slate-800/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Key className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Active Sessions</p>
                  <h3 className="text-2xl font-bold text-white">12</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>System Users</CardTitle>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>System Role</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Loading users...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No users found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-white">{item.name}</TableCell>
                          <TableCell className="text-slate-400">{item.email}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.role === 'Super Admin' ? 'destructive' : 
                              item.role === 'Manager' ? 'default' : 
                              'secondary'
                            }>
                              {item.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.lastLogin}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300">Edit</Button>
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
