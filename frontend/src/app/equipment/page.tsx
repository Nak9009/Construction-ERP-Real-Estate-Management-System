"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/StatsCard';
import { Tractor, Wrench, AlertTriangle, Activity } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', name: 'Excavator CAT-320', category: 'Heavy Machinery', location: 'Site A - Downtown', status: 'in_use', lastMaintenance: '2026-05-12' },
  { id: '2', name: 'Bulldozer D6', category: 'Heavy Machinery', location: 'Yard', status: 'available', lastMaintenance: '2026-06-01' },
  { id: '3', name: 'Concrete Mixer #4', category: 'Light Equipment', location: 'Site B - Suburbs', status: 'maintenance', lastMaintenance: '2026-07-01' },
];

export default function EquipmentPage() {
  const [data] = useState(MOCK_DATA);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-64">
        <TopNav />
        <main className="flex-1 p-8 pt-24 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
              Equipment Fleet
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Add Equipment</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Fleet" 
              value={156} 
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

          <Card className="glass-panel border-slate-800/50">
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
                    {data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No equipment found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-white">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.lastMaintenance}</TableCell>
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
        </main>
      </div>
    </div>
  );
}
// Note: Activity icon wasn't imported initially, let's fix that.
// It will be fixed in a moment if it throws.
