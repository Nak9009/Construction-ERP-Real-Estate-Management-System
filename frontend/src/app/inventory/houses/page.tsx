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

interface House {
  id: string;
  house_number: string;
  status: string;
  selling_price: number | null;
  construction_cost: number | null;
  created_at: string;
  lot_id?: string;
  house_type_id?: string;
  house_type?: {
    id: string;
    name: string;
  };
}

export default function HouseInventoryPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    house_number: '',
    status: 'planned',
    selling_price: '',
    construction_cost: '',
  });

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/houses');
      setHouses(res.data.data || res.data); // Based on Resource collection vs json response
    } catch (error) {
      console.error('Failed to fetch house inventory', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const totalHouses = houses.length;
    const totalValue = houses.reduce((sum, h) => sum + (Number(h.selling_price) || 0), 0);
    const available = houses.filter(h => h.status === 'available' || h.status === 'completed' || h.status === 'planned').length;
    return {
      totalHouses,
      totalValue,
      available
    };
  }, [houses]);

  const handleOpenModal = (house?: House) => {
    if (house) {
      setEditingHouse(house);
      setFormData({
        house_number: house.house_number,
        status: house.status,
        selling_price: house.selling_price?.toString() || '',
        construction_cost: house.construction_cost?.toString() || '',
      });
    } else {
      setEditingHouse(null);
      setFormData({ 
        house_number: '',
        status: 'planned',
        selling_price: '',
        construction_cost: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHouse(null);
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
        house_number: formData.house_number,
        status: formData.status,
      };

      if (formData.selling_price) payload.selling_price = Number(formData.selling_price);
      if (formData.construction_cost) payload.construction_cost = Number(formData.construction_cost);
      
      // Temporary stub for Lot ID. In a real app we'd fetch lots and let user select one.
      // Without Lot ID, this might fail depending on DB constraints. 
      // We'll let it try and catch it if it fails.

      if (editingHouse) {
        await api.put(`/houses/${editingHouse.id}`, payload);
      } else {
        await api.post('/houses', payload);
      }
      
      await fetchHouses();
      handleCloseModal();
    } catch (error: any) {
      console.error('Failed to save house', error.response?.data || error.message);
      alert('Failed to save house. ' + (error.response?.data?.message || 'Check console.'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this house?')) {
      try {
        await api.delete(`/houses/${id}`);
        await fetchHouses();
      } catch (error) {
        console.error('Failed to delete house', error);
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
              House Inventory
            </h1>
            <Button onClick={() => handleOpenModal()}>+ Add House Unit</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Houses</div>
                <div className="text-3xl font-bold">{metrics.totalHouses}</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Available/Planned Units</div>
                <div className="text-3xl font-bold text-emerald-400">{metrics.available}</div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-white/10">
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Estimated Sales Value</div>
                <div className="text-3xl font-bold text-blue-400">${metrics.totalValue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-white/10 mt-6">
            <CardHeader>
              <CardTitle>Properties List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>House Number</TableHead>
                      <TableHead>Model/Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Est. Cost</TableHead>
                      <TableHead>Sales Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow>
                         <TableCell colSpan={6} className="h-24 text-center">Loading house inventory...</TableCell>
                       </TableRow>
                    ) : houses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No houses found.</TableCell>
                      </TableRow>
                    ) : (
                      houses.map((house) => (
                        <TableRow key={house.id}>
                          <TableCell className="font-medium text-emerald-400">{house.house_number}</TableCell>
                          <TableCell>
                            {house.house_type ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                                {house.house_type.name}
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-500/20 text-neutral-400">
                                Custom Build
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              house.status === 'completed' || house.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                              house.status === 'planned' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {house.status.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell>${house.construction_cost?.toLocaleString() || '0'}</TableCell>
                          <TableCell className="font-bold">${house.selling_price?.toLocaleString() || '0'}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-400" onClick={() => handleOpenModal(house)}>Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDelete(house.id)}>Delete</Button>
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
            <DialogTitle>{editingHouse ? 'Edit House Asset' : 'Add New House Unit'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>House Number / Plot Identifier</Label>
              <Input 
                required
                value={formData.house_number} 
                onChange={(e) => setFormData({...formData, house_number: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Construction Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val as string})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="under_construction">Under Construction</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="available">Available for Sale</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Cost ($)</Label>
                <Input 
                  type="number"
                  value={formData.construction_cost} 
                  onChange={(e) => setFormData({...formData, construction_cost: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Target Selling Price ($)</Label>
                <Input 
                  type="number"
                  value={formData.selling_price} 
                  onChange={(e) => setFormData({...formData, selling_price: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter className="mt-6 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingHouse ? 'Save Changes' : 'Add House'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
