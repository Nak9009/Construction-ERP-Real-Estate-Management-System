import { useState, useEffect, useMemo } from 'react';
import { Land } from '../types';
import { landService } from '../services/landService';

export const useLands = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);

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
      const data = await landService.getLands();
      setLands(data);
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
        await landService.updateLand(editingLand.id, payload);
      } else {
        await landService.createLand(payload);
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
        await landService.deleteLand(id);
        await fetchLands();
      } catch (error) {
        console.error('Failed to delete land asset', error);
      }
    }
  };

  return {
    lands,
    isModalOpen,
    editingLand,
    loading,
    formData,
    metrics,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleOpenChange,
    handleSubmit,
    handleDelete
  };
};
