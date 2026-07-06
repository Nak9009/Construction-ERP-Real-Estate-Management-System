import { useState, useEffect } from 'react';
import { Timeline } from '../types';
import { timelineService } from '../services/timelineService';

export const useTimeline = () => {
  const [data, setData] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await timelineService.getTimeline();
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
