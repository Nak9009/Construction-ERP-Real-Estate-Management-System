"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';

interface Contract {
  id: string;
  contract_number: string;
  customer_id?: string;
  amount: number;
  signed_date?: string;
  status: string;
}

export default function SalesPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    contract_number: '',
    customer_id: '',
    amount: '',
    signed_date: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sales/contracts');
      setContracts(res.data.data || res.data);
    } catch (error) {
      console.error('Failed to fetch contracts', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const totalAmount = contracts.reduce((sum, c) => sum + Number(c.amount), 0);
    const signedCount = contracts.filter(c => c.status === 'signed').length;
    return {
      totalContracts: contracts.length,
      totalAmount,
      signedCount,
      conversionRate: contracts.length > 0 ? ((signedCount / contracts.length) * 100).toFixed(1) : '0'
    };
  }, [contracts]);

  const handleOpenModal = (contract?: Contract) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        contract_number: contract.contract_number,
        customer_id: contract.customer_id || '',
        amount: contract.amount.toString(),
        signed_date: contract.signed_date ? contract.signed_date.substring(0, 10) : '',
        status: contract.status
      });
    } else {
      setEditingContract(null);
      setFormData({ 
        contract_number: `CTR-2026-00${contracts.length + 1}`, 
        customer_id: '', 
        amount: '', 
        signed_date: new Date().toISOString().split('T')[0], 
        status: 'pending' 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContract(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCloseModal();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        contract_number: formData.contract_number,
        amount: Number(formData.amount),
        status: formData.status,
      };

      if (formData.signed_date) {
        payload.signed_date = formData.signed_date;
      }
      
      // Temporary workaround since we don't have a customer picker yet
      if (formData.customer_id) {
        payload.customer_id = formData.customer_id;
      }

      if (editingContract) {
        await api.put(`/sales/contracts/${editingContract.id}`, payload);
      } else {
        await api.post('/sales/contracts', payload);
      }
      
      await fetchContracts();
      handleCloseModal();
    } catch (error: any) {
      console.error('Failed to save contract', error.response?.data || error.message);
      alert('Failed to save contract. See console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await api.delete(`/sales/contracts/${id}`);
        await fetchContracts();
      } catch (error) {
        console.error('Failed to delete contract', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav />
        <main className="p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Sales Dashboard
            </h1>
            <Button onClick={() => handleOpenModal()}>+ New Contract</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Contracts</div>
                <div className="text-3xl font-bold">{metrics.totalContracts}</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Value</div>
                <div className="text-3xl font-bold text-emerald-400">
                  ${metrics.totalAmount.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Signed Contracts</div>
                <div className="text-3xl font-bold text-blue-400">{metrics.signedCount}</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Conversion Rate</div>
                <div className="text-3xl font-bold text-purple-400">{metrics.conversionRate}%</div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-white/10 mt-6">
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.status === 'signed' ? 'bg-emerald-500/20 text-emerald-400' :
                              c.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-neutral-500/20 text-neutral-400'
                            }`}>
                              {c.status.toUpperCase()}
                            </span>
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
        </main>
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
            <DialogFooter className="mt-6 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingContract ? 'Save Changes' : 'Create Contract'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
