import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useSales } from '../hooks/useSales';

export function SalesView() {
  const {
    contracts,
    isModalOpen,
    editingContract,
    loading,
    formData,
    metrics,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleOpenChange,
    handleSubmit,
    handleDelete
  } = useSales();

  return (
    <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Sales Dashboard
            </h1>
            <Button onClick={() => handleOpenModal()}>+ New Contract</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Contracts</div>
                <div className="text-3xl font-bold">{metrics.totalContracts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Value</div>
                <div className="text-3xl font-bold text-emerald-400">
                  ${metrics.totalAmount.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Signed Contracts</div>
                <div className="text-3xl font-bold text-blue-400">{metrics.signedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Conversion Rate</div>
                <div className="text-3xl font-bold text-purple-400">{metrics.conversionRate}%</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract #</TableHead>
                      <TableHead>Customer (ID)</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow>
                         <TableCell colSpan={6} className="h-24 text-center">Loading contracts...</TableCell>
                       </TableRow>
                    ) : contracts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No contracts found.</TableCell>
                      </TableRow>
                    ) : (
                      contracts.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-emerald-400">{c.contract_number}</TableCell>
                          <TableCell>{c.customer_id ? c.customer_id.substring(0,8) + '...' : 'N/A'}</TableCell>
                          <TableCell className="font-bold">${Number(c.amount).toLocaleString()}</TableCell>
                          <TableCell>{c.signed_date ? c.signed_date.substring(0, 10) : 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`border-transparent ${
                              c.status === 'signed' ? 'bg-emerald-500/20 text-emerald-400' :
                              c.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-neutral-500/20 text-neutral-400'
                            }`}>
                              {c.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-400" onClick={() => handleOpenModal(c)}>Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDelete(c.id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingContract ? 'Edit Contract' : 'Create New Contract'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Contract Number</Label>
              <Input 
                required 
                value={formData.contract_number} 
                onChange={(e) => setFormData({...formData, contract_number: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Customer ID (Optional for now)</Label>
              <Input 
                value={formData.customer_id} 
                onChange={(e) => setFormData({...formData, customer_id: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input 
                  type="number" 
                  required 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Signed Date</Label>
                <Input 
                  type="date" 
                  value={formData.signed_date}
                  onChange={(e) => setFormData({...formData, signed_date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val as string})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-6 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingContract ? 'Save Changes' : 'Create Contract'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
