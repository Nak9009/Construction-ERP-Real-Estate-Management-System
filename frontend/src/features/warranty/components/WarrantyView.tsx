import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/StatsCard';
import { ShieldCheck, AlertCircle, Wrench } from 'lucide-react';
import { useWarranty } from '../hooks/useWarranty';

export function WarrantyView() {
  const {
    data,
    loading,
    totalClaims
  } = useWarranty();

  return (
    <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Warranty & Maintenance
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ New Request</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Active Claims" 
              value={totalClaims} 
              icon={<AlertCircle className="w-5 h-5 text-yellow-400" />} 
            />
            <StatsCard 
              title="Resolved This Month" 
              value={42} 
              icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} 
            />
            <StatsCard 
              title="Pending Inspections" 
              value={8} 
              icon={<Wrench className="w-5 h-5 text-cyan-400" />} 
            />
          </div>

          <Card className="border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Recent Service Requests</CardTitle>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim Ref</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Issue Description</TableHead>
                      <TableHead>Filed On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">Loading service requests...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">No service requests found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs text-slate-400">{item.claimRef || item.claim_ref}</TableCell>
                          <TableCell className="font-medium text-white">{item.customer}</TableCell>
                          <TableCell>{item.property}</TableCell>
                          <TableCell>{item.issue}</TableCell>
                          <TableCell>{item.date || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.status === 'resolved' ? 'default' : 
                              item.status === 'in_progress' ? 'secondary' : 
                              'destructive'
                            }>
                              {item.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300">Update</Button>
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
