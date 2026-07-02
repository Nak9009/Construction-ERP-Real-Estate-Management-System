"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';

interface Land {
  id: string;
  project_id: string | null;
  owner_name: string | null;
  purchase_price: number | null;
  title_number: string | null;
  area_sqm: number | null;
  created_at: string;
  project?: {
    id: string;
    name: string;
  };
}

export default function LandInventoryPage() {
  const [lands, setLands] = useState<Land[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title_number: '',
    owner_name: '',
    purchase_price: '',
    area_sqm: '',
  });

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const res = await api.get('/lands');
      setLands(res.data.lands || res.data);
    } catch (error) {
      console.error('Failed to fetch land inventory', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const totalParcels = lands.length;
    const totalArea = lands.reduce((sum, land) => sum + (Number(land.area_sqm) || 0), 0);
    const totalValue = lands.reduce((sum, land) => sum + (Number(land.purchase_price) || 0), 0);
    return {
      totalParcels,
      totalArea,
      totalValue
    };
  }, [lands]);

  const handleOpenModal = (land?: Land) => {
    if (land) {
      setEditingLand(land);
      setFormData({
        title_number: land.title_number || '',
        owner_name: land.owner_name || '',
        purchase_price: land.purchase_price?.toString() || '',
        area_sqm: land.area_sqm?.toString() || '',
      });
    } else {
      setEditingLand(null);
      setFormData({ 
        title_number: '',
        owner_name: '',
        purchase_price: '',
        area_sqm: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLand(null);
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
      const payload: any = {};
      if (formData.title_number) payload.title_number = formData.title_number;
      if (formData.owner_name) payload.owner_name = formData.owner_name;
      if (formData.purchase_price) payload.purchase_price = Number(formData.purchase_price);
      if (formData.area_sqm) payload.area_sqm = Number(formData.area_sqm);

      if (editingLand) {
        await api.put(`/lands/${editingLand.id}`, payload);
      } else {
        await api.post('/lands', payload);
      }
      
      await fetchLands();
      handleCloseModal();
    } catch (error: any) {
      console.error('Failed to save land asset', error.response?.data || error.message);
      alert('Failed to save land asset. See console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this land asset?')) {
      try {
        await api.delete(`/lands/${id}`);
        await fetchLands();
      } catch (error) {
        console.error('Failed to delete land asset', error);
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
              Land Inventory
            </h1>
            <Button onClick={() => handleOpenModal()}>+ Acquire Land</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Parcels</div>
                <div className="text-3xl font-bold">{metrics.totalParcels}</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Area (sqm)</div>
                <div className="text-3xl font-bold text-emerald-400">{metrics.totalArea.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Value</div>
                <div className="text-3xl font-bold text-blue-400">${metrics.totalValue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-white/10 mt-6">
            <CardHeader>
              <CardTitle>Land Registry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title Number</TableHead>
                      <TableHead>Owner Name</TableHead>
                      <TableHead>Area (sqm)</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow>
                         <TableCell colSpan={6} className="h-24 text-center">Loading land registry...</TableCell>
                       </TableRow>
                    ) : lands.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No land assets found.</TableCell>
                      </TableRow>
                    ) : (
                      lands.map((land) => (
                        <TableRow key={land.id}>
                          <TableCell className="font-medium text-emerald-400">{land.title_number || 'Unregistered'}</TableCell>
                          <TableCell>{land.owner_name || 'N/A'}</TableCell>
                          <TableCell>{land.area_sqm?.toLocaleString() || 'N/A'}</TableCell>
                          <TableCell className="font-bold">${land.purchase_price?.toLocaleString() || '0'}</TableCell>
                          <TableCell>
                            {land.project ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                {land.project.name}
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-500/20 text-neutral-400">
                                Unassigned
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-400" onClick={() => handleOpenModal(land)}>Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDelete(land.id)}>Delete</Button>
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
            <DialogTitle>{editingLand ? 'Edit Land Asset' : 'Acquire New Land'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title Number / Deed</Label>
              <Input 
                value={formData.title_number} 
                onChange={(e) => setFormData({...formData, title_number: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Owner Name (on deed)</Label>
              <Input 
                value={formData.owner_name} 
                onChange={(e) => setFormData({...formData, owner_name: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Area (sqm)</Label>
                <Input 
                  type="number"
                  value={formData.area_sqm} 
                  onChange={(e) => setFormData({...formData, area_sqm: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Purchase Price ($)</Label>
                <Input 
                  type="number"
                  value={formData.purchase_price} 
                  onChange={(e) => setFormData({...formData, purchase_price: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter className="mt-6 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingLand ? 'Save Changes' : 'Add Land'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
