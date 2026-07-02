"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, LineChart, FileDown } from 'lucide-react';

interface Report {
  id: string | number;
  name: string;
  module: string;
  type: string;
  generatedDate?: string;
  generated_date?: string;
}

export default function ReportsPage() {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports');
      const reports = res.data.data || res.data;
      setData(reports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
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
              Analytics & Reports
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel border-slate-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Financial Reports</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Generate P&L Statement</Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Cash Flow Analysis</Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Expense Breakdown</Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-slate-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <LineChart className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">Project Reports</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Construction Progress Tracking</Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Resource Utilization</Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 border border-slate-800">Contractor Performance</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Recent Generated Reports</CardTitle>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Generated On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">Loading reports...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No reports generated.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-white">{item.name}</TableCell>
                          <TableCell>
                            <Badge variant="default">{item.module}</Badge>
                          </TableCell>
                          <TableCell className="text-slate-400">{item.type}</TableCell>
                          <TableCell>{item.generatedDate || item.generated_date}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                              <FileDown className="w-3.5 h-3.5" />
                              Download
                            </Button>
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
