"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
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
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 uppercase text-neutral-400">
                    <tr>
                      <th className="px-6 py-3 font-medium">House Number</th>
                      <th className="px-6 py-3 font-medium">Model/Type</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Est. Cost</th>
                      <th className="px-6 py-3 font-medium">Sales Price</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {loading ? (
                       <tr>
                         <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">Loading house inventory...</td>
                       </tr>
                    ) : houses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">No houses found.</td>
                      </tr>
                    ) : (
                      houses.map((house) => (
                        <tr key={house.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-emerald-400">{house.house_number}</td>
                          <td className="px-6 py-4">
                            {house.house_type ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                                {house.house_type.name}
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-500/20 text-neutral-400">
                                Custom Build
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              house.status === 'completed' || house.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                              house.status === 'planned' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {house.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">${house.construction_cost?.toLocaleString() || '0'}</td>
                          <td className="px-6 py-4 font-bold">${house.selling_price?.toLocaleString() || '0'}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Button variant="ghost" className="text-xs py-1 px-3 text-blue-400" onClick={() => handleOpenModal(house)}>Edit</Button>
                            <Button variant="ghost" className="text-xs py-1 px-3 text-red-400" onClick={() => handleDelete(house.id)}>Delete</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingHouse ? 'Edit House Asset' : 'Add New House Unit'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="House Number / Plot Identifier" 
            required
            value={formData.house_number} 
            onChange={(e) => setFormData({...formData, house_number: e.target.value})} 
          />
          <Select 
            label="Construction Status" 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            options={[
              { value: 'planned', label: 'Planned' },
              { value: 'under_construction', label: 'Under Construction' },
              { value: 'completed', label: 'Completed' },
              { value: 'available', label: 'Available for Sale' },
              { value: 'sold', label: 'Sold' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Estimated Cost ($)" 
              type="number"
              value={formData.construction_cost} 
              onChange={(e) => setFormData({...formData, construction_cost: e.target.value})} 
            />
            <Input 
              label="Target Selling Price ($)" 
              type="number"
              value={formData.selling_price} 
              onChange={(e) => setFormData({...formData, selling_price: e.target.value})} 
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">{editingHouse ? 'Save Changes' : 'Add House'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
