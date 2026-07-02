import { useState, useEffect } from 'react';
import { Material } from '../types';
import { warehouseService } from '../services/warehouseService';

export const useWarehouse = () => {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const materials = await warehouseService.getMaterials();
      setData(materials);
      setTotalItems(materials.length);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalItems,
    fetchMaterials
  };
};
