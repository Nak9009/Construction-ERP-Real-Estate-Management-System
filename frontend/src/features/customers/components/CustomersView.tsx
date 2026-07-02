import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomers } from '../hooks/useCustomers';

export function CustomersView() {
  const {
    customers,
    isModalOpen,
    editingCustomer,
    loading,
    formData,
    metrics,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleOpenChange,
    handleSubmit,
    handleDelete
  } = useCustomers();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-64">
        <TopNav />
        <main className="flex-1 p-8 pt-24 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Customers Dashboard
            </h1>
            <Button onClick={() => handleOpenModal()}>+ New Customer</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Customers</div>
                <div className="text-3xl font-bold">{metrics.totalCustomers}</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Active Leads</div>
                <div className="text-3xl font-bold text-emerald-400">{metrics.activeLeads}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-white/10 mt-6">
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>ID/Passport</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow>
                         <TableCell colSpan={5} className="h-24 text-center">Loading customers...</TableCell>
                       </TableRow>
                    ) : customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No customers found.</TableCell>
                      </TableRow>
                    ) : (
                      customers.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-emerald-400">{c.first_name} {c.last_name}</TableCell>
                          <TableCell>{c.email || 'N/A'}</TableCell>
                          <TableCell>{c.phone || 'N/A'}</TableCell>
                          <TableCell>{c.identity_card_number || 'N/A'}</TableCell>
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
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Create New Customer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input 
                  required 
                  value={formData.first_name} 
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input 
                  required 
                  value={formData.last_name} 
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input 
                type="tel"
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Identity Card / Passport Number</Label>
              <Input 
                value={formData.identity_card_number} 
                onChange={(e) => setFormData({...formData, identity_card_number: e.target.value})} 
              />
            </div>
            <DialogFooter className="mt-6 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingCustomer ? 'Save Changes' : 'Create Customer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
