import { useState, useEffect } from 'react';
import { Analytic } from '../types';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const [data, setData] = useState<Analytic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await analyticsService.getAnalytics();
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
