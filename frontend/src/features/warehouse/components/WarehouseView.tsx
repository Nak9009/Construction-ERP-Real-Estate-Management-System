import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/ui/StatsCard';
import { PackageSearch, AlertCircle, TrendingDown } from 'lucide-react';
import { useWarehouse } from '../hooks/useWarehouse';

export function WarehouseView() {
  const {
    data,
    loading,
    totalItems
  } = useWarehouse();

  return (
    <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Warehouse Inventory
            </h1>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white border-0">+ Receive Stock</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Items" 
              value={totalItems} 
              icon={<PackageSearch className="w-5 h-5 text-indigo-400" />} 
            />
            <StatsCard 
              title="Low Stock Alerts" 
              value={18} 
              icon={<AlertCircle className="w-5 h-5 text-yellow-400" />} 
            />
            <StatsCard 
              title="Out of Stock" 
              value={5} 
              icon={<TrendingDown className="w-5 h-5 text-red-400" />} 
            />
          </div>

          <Card className="border-slate-800/50">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle>Material Stock List</CardTitle>
            </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Min Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Loading materials...</TableCell>
                      </TableRow>
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No materials found.</TableCell>
                      </TableRow>
                    ) : (
                      data.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs text-slate-400">{item.sku}</TableCell>
                          <TableCell className="font-medium text-white">{item.name}</TableCell>
                          <TableCell>{item.quantity} {item.unit}</TableCell>
                          <TableCell>{item.minStock || item.min_stock || 0}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.status === 'in_stock' ? 'default' : 
                              item.status === 'low_stock' ? 'secondary' : 
                              'destructive'
                            }>
                              {item.status.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:text-cyan-300">Restock</Button>
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
