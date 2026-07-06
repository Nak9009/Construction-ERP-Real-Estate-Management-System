import { useState, useEffect } from 'react';
import { Inspection } from '../types';
import { inspectionService } from '../services/inspectionService';

export const useInspection = () => {
  const [data, setData] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await inspectionService.getInspection();
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
