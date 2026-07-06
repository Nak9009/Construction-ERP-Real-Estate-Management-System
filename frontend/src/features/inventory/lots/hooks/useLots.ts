import { useState, useEffect } from 'react';
import { Lot } from '../types';
import { lotService } from '../services/lotService';

export const useLots = () => {
  const [data, setData] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await lotService.getLots();
      setData(items);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetchData
  };
};
