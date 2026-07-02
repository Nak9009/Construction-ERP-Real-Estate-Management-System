"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/StatsCard';
import { ShieldCheck, AlertCircle, Wrench } from 'lucide-react';

interface Claim {
  id: string | number;
  claimRef?: string;
  claim_ref?: string;
  customer: string;
  property: string;
  issue: string;
  date?: string;
  status: string;
}

export default function WarrantyPage() {
  const [data, setData] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalClaims, setTotalClaims] = useState(0);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await api.get('/warranty/claims');
      const claims = res.data.data || res.data;
      setData(claims);
      setTotalClaims(claims.length);
    } catch (error) {
      console.error('Failed to fetch claims:', error);
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

          <Card className="glass-panel border-slate-800/50">
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
        </main>
      </div>
    </div>
  );
}
