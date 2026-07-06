import { useState, useEffect } from 'react';
import { Block } from '../types';
import { blockService } from '../services/blockService';

export const useBlocks = () => {
  const [data, setData] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await blockService.getBlocks();
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
