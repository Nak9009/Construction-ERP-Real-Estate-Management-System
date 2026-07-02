"use client";

import React, { useState, useMemo } from 'react';
import { Sidebar } from '../dashboard/Sidebar';
import { TopNav } from '../dashboard/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';

interface Contract {
  id: number;
  contract_number: string;
  customer: string;
  amount: number;
  date: string;
  status: string;
}

const INITIAL_CONTRACTS: Contract[] = [
  { id: 1, contract_number: 'CTR-2026-001', customer: 'Alice Johnson', amount: 350000, date: '2026-05-12', status: 'signed' },
  { id: 2, contract_number: 'CTR-2026-002', customer: 'Bob Smith', amount: 420000, date: '2026-06-01', status: 'pending' },
  { id: 3, contract_number: 'CTR-2026-003', customer: 'Charlie Davis', amount: 290000, date: '2026-06-20', status: 'cancelled' },
];

export default function SalesPage() {
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    contract_number: '',
    customer: '',
    amount: '',
    date: '',
    status: 'pending'
  });

  const handleOpenModal = (contract?: Contract) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        contract_number: contract.contract_number,
        customer: contract.customer,
        amount: contract.amount.toString(),
        date: contract.date,
        status: contract.status
      });
    } else {
      setEditingContract(null);
      setFormData({ 
        contract_number: `CTR-2026-00${contracts.length + 1}`, 
        customer: '', 
        amount: '', 
        date: new Date().toISOString().split('T')[0], 
        status: 'pending' 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContract(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContract) {
      setContracts(contracts.map(c => c.id === editingContract.id ? { 
        ...c, 
        contract_number: formData.contract_number,
        customer: formData.customer,
        amount: Number(formData.amount),
        date: formData.date,
        status: formData.status
      } : c));
    } else {
      const newContract: Contract = {
        id: Math.max(...contracts.map(c => c.id), 0) + 1,
        contract_number: formData.contract_number,
        customer: formData.customer,
        amount: Number(formData.amount),
        date: formData.date,
        status: formData.status
      };
      setContracts([...contracts, newContract]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  // Derived metrics for summary cards
  const summary = useMemo(() => {
    const active = contracts.filter(c => c.status !== 'cancelled');
    const totalSales = active.reduce((sum, c) => sum + c.amount, 0);
    const commissions = totalSales * 0.02; // Assuming 2% commission
    return { activeCount: active.length, totalSales, commissions };
  }, [contracts]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav />
        <main className="p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400">
              Sales & Contracts
            </h1>
            <Button onClick={() => handleOpenModal()}>+ New Contract</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-white/10 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Contracts</CardTitle>
                <div className="w-1/3">
                  <Input placeholder="Search contracts..." className="h-8 text-sm bg-black/20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 uppercase text-neutral-400">
                      <tr>
                        <th className="px-4 py-3 font-medium">Contract #</th>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {contracts.map((c) => (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4 font-medium text-blue-400">{c.contract_number}</td>
                          <td className="px-4 py-4">{c.customer}</td>
                          <td className="px-4 py-4">${c.amount.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.status === 'signed' ? 'bg-emerald-500/20 text-emerald-400' :
                              c.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {c.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right space-x-2">
                            <Button variant="ghost" className="text-xs py-1 px-3 text-blue-400" onClick={() => handleOpenModal(c)}>Edit</Button>
                            <Button variant="ghost" className="text-xs py-1 px-3 text-red-400" onClick={() => handleDelete(c.id)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                      {contracts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No contracts found. Create one to get started.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle>Sales Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center items-center">
                  <p className="text-sm text-neutral-400 mb-1">Total Sales Value (YTD)</p>
                  <p className="text-3xl font-bold text-white">${summary.totalSales.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-center items-center">
                  <p className="text-sm text-neutral-400 mb-1">Active Contracts</p>
                  <p className="text-3xl font-bold text-white">{summary.activeCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex flex-col justify-center items-center">
                  <p className="text-sm text-emerald-400 mb-1">Commissions Pending</p>
                  <p className="text-3xl font-bold text-emerald-300">${summary.commissions.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingContract ? 'Edit Contract' : 'Create New Contract'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Contract Number" 
            required 
            value={formData.contract_number} 
            onChange={(e) => setFormData({...formData, contract_number: e.target.value})} 
          />
          <Input 
            label="Customer Name" 
            required 
            value={formData.customer} 
            onChange={(e) => setFormData({...formData, customer: e.target.value})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Amount ($)" 
              type="number" 
              min="0" 
              required 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
            <Input 
              label="Date" 
              type="date" 
              required 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <Select 
            label="Status" 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'signed', label: 'Signed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">{editingContract ? 'Save Changes' : 'Create Contract'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
