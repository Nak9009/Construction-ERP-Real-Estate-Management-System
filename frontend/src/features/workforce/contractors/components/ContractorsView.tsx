import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/StatsCard';
import { HardHat, Briefcase, FileSignature } from 'lucide-react';
import { useContractors } from '../hooks/useContractors';

export function ContractorsView() {
  const {
    data,
    loading,
    totalContractors
  } = useContractors();

  return (
    <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Contractor Management
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Add Contractor</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Contractors" 
              value={totalContractors} 
              icon={<Briefcase className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="Active on Sites" 
              value={18} 
              icon={<HardHat className="w-5 h-5 text-emerald-400" />} 
            />
            <StatsCard 
              title="Active Contracts" 
              value={24} 
              icon={<FileSignature className="w-5 h-5 text-cyan-400" />} 
            />
          </div>

          <Card className="border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Subcontractors List</CardTitle>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Trade Specialization</TableHead>
                      <TableHead>Active Workers</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Loading contractors...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No contractors found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-white">{item.company || item.name}</TableCell>
                          <TableCell>{item.trade || item.specialty}</TableCell>
                          <TableCell>{item.activeWorkers ?? item.active_workers ?? 0}</TableCell>
                          <TableCell className="text-amber-400 font-medium">{item.rating || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300">View Contracts</Button>
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
