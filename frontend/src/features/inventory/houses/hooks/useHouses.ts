import { useState, useEffect, useMemo } from 'react';
import { House } from '../types';
import { houseService } from '../services/houseService';

export const useHouses = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);

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
      const data = await houseService.getHouses();
      setHouses(data);
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

      if (editingHouse) {
        await houseService.updateHouse(editingHouse.id, payload);
      } else {
        await houseService.createHouse(payload);
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
        await houseService.deleteHouse(id);
        await fetchHouses();
      } catch (error) {
        console.error('Failed to delete house', error);
      }
    }
  };

  return {
    houses,
    isModalOpen,
    editingHouse,
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
