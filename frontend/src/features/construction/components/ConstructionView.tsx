import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/StatsCard';
import { Hammer, CheckSquare, Clock } from 'lucide-react';
import { useConstruction } from '../hooks/useConstruction';

export function ConstructionView() {
  const {
    data,
    loading,
    totalTasks
  } = useConstruction();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-64">
        <TopNav />
        <main className="flex-1 p-8 pt-24 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
              Construction Progress
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">Schedule Activity</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Active Sites" 
              value={totalTasks} 
              icon={<Hammer className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="Tasks Completed (Week)" 
              value={28} 
              icon={<CheckSquare className="w-5 h-5 text-emerald-400" />} 
            />
            <StatsCard 
              title="Behind Schedule" 
              value={2} 
              icon={<Clock className="w-5 h-5 text-red-400" />} 
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Active Construction Phases</CardTitle>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property Reference</TableHead>
                      <TableHead>Current Stage</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Est. Completion</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Loading construction tasks...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No construction tasks found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-white">{item.houseRef || item.house_ref}</TableCell>
                          <TableCell>{item.stage}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden w-24">
                                <div 
                                  className={`h-full ${item.completion === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} 
                                  style={{ width: `${item.completion}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono">{item.completion}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.endDate || item.end_date || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.status === 'completed' ? 'default' : 
                              item.status === 'in_progress' ? 'secondary' : 
                              'outline'
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
        </main>
      </div>
    </div>
  );
}
