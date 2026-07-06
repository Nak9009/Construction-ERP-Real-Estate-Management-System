import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';

export function RolesView() {
  const { data, loading, totalRoles } = useRoles();

  return (
    <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Roles & Permissions
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Create Role</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-800/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Roles</p>
                  <h3 className="text-2xl font-bold text-white">{totalRoles}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-800/50">
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
            <Card className="border-slate-800/50">
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

          <Card className="border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>System Roles</CardTitle>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Assigned Users</TableHead>
                      <TableHead>Access Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">Loading roles...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No roles found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-white">{item.roleName || item.name}</TableCell>
                          <TableCell>{item.users || 0}</TableCell>
                          <TableCell>
                            <span className={item.accessLevel === 'Full Access' ? 'text-red-400 font-medium' : 'text-slate-400'}>
                              {item.accessLevel || 'Standard'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                              {item.status || 'active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300">Edit Permissions</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
          </Card>
        </div>
      </DashboardLayout>
  );
}
