import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/StatsCard';
import { Tractor, AlertTriangle, Activity } from 'lucide-react';
import { useEquipment } from '../hooks/useEquipment';

export function EquipmentView() {
  const {
    data,
    loading,
    totalEquipment
  } = useEquipment();

  return (
    <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Equipment Fleet
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Add Equipment</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Fleet" 
              value={totalEquipment} 
              icon={<Tractor className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="In Use" 
              value={89} 
              icon={<Activity className="w-5 h-5 text-cyan-400" />} 
            />
            <StatsCard 
              title="Needs Maintenance" 
              value={12} 
              icon={<AlertTriangle className="w-5 h-5 text-red-400" />} 
            />
          </div>

          <Card className="border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Equipment List</CardTitle>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Loading equipment...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No equipment found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-white">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.lastMaintenance || item.last_maintenance || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.status === 'in_use' ? 'default' : 
                              item.status === 'available' ? 'secondary' : 
                              'destructive'
                            }>
                              {item.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300">Log Usage</Button>
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
