import { useState, useEffect } from 'react';
import { Equipment } from '../types';
import { equipmentService } from '../services/equipmentService';

export const useEquipment = () => {
  const [data, setData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEquipment, setTotalEquipment] = useState(0);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const equipment = await equipmentService.getEquipment();
      setData(equipment);
      setTotalEquipment(equipment.length);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalEquipment,
    fetchEquipment
  };
};
