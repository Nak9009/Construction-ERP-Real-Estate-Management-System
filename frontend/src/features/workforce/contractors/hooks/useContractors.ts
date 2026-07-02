import { useState, useEffect } from 'react';
import { Contractor } from '../types';
import { contractorService } from '../services/contractorService';

export const useContractors = () => {
  const [data, setData] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalContractors, setTotalContractors] = useState(0);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      const contractors = await contractorService.getContractors();
      setData(contractors);
      setTotalContractors(contractors.length);
    } catch (error) {
      console.error('Failed to fetch contractors:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalContractors,
    fetchContractors
  };
};
