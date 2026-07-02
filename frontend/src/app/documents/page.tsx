"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/StatsCard';
import { FolderHeart, FileLock2, UploadCloud } from 'lucide-react';

const MOCK_DATA = [
  { id: '1', name: 'Site_Plan_Final_v3.pdf', type: 'Blueprint', project: 'Downtown Highrise', uploadedBy: 'Jane Smith', date: '2026-07-02', size: '4.2 MB' },
  { id: '2', name: 'Contract_BuildRite.docx', type: 'Legal', project: 'N/A', uploadedBy: 'System', date: '2026-07-01', size: '1.1 MB' },
  { id: '3', name: 'Inspection_Report_Jul.pdf', type: 'Report', project: 'Suburban Villas', uploadedBy: 'Mike Johnson', date: '2026-06-30', size: '2.5 MB' },
];

export default function DocumentsPage() {
  const [data] = useState(MOCK_DATA);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-64">
        <TopNav />
        <main className="flex-1 p-8 pt-24 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
              Document Manager
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0 flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              Upload Document
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Documents" 
              value="1,842" 
              icon={<FolderHeart className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="Storage Used" 
              value="4.2 GB" 
              icon={<FileLock2 className="w-5 h-5 text-emerald-400" />} 
            />
            <StatsCard 
              title="Shared Files" 
              value="356" 
              icon={<UploadCloud className="w-5 h-5 text-cyan-400" />} 
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4 flex flex-row items-center justify-between">
              <CardTitle>Recent Files</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" className="text-xs h-8">All Files</Button>
                <Button variant="ghost" className="text-xs h-8">Blueprints</Button>
                <Button variant="ghost" className="text-xs h-8">Legal</Button>
              </div>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Project / Scope</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">No documents found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-cyan-400">{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.project}</TableCell>
                          <TableCell>{item.uploadedBy}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="text-slate-400">{item.size}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300">Download</Button>
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
