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
import { ShoppingCart, Clock, CheckCircle } from 'lucide-react';

interface PurchaseOrder {
  id: string | number;
  poNumber?: string;
  po_number?: string;
  supplier: string;
  total: string | number;
  date: string;
  status: string;
}

export default function ProcurementPage() {
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/procurement/orders');
      const orders = res.data.data || res.data;
      setData(orders);
      setTotalOrders(orders.length);
    } catch (error) {
      console.error('Failed to fetch purchase orders:', error);
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
              Procurement & Purchasing
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Create PO</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Active Orders" 
              value={totalOrders} 
              icon={<ShoppingCart className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="Pending Approval" 
              value={8} 
              icon={<Clock className="w-5 h-5 text-yellow-400" />} 
            />
            <StatsCard 
              title="Fulfilled (This Month)" 
              value={42} 
              icon={<CheckCircle className="w-5 h-5 text-emerald-400" />} 
            />
          </div>

          <Card className="glass-panel border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Loading purchase orders...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No purchase orders found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-emerald-400">{item.poNumber || item.po_number}</TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="font-bold">{item.total}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.status === 'fulfilled' ? 'default' : 
                              item.status === 'approved' ? 'secondary' : 
                              'destructive'
                            }>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300">View</Button>
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
