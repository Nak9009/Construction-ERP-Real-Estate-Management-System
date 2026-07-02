import { useState, useEffect } from 'react';
import { Claim } from '../types';
import { warrantyService } from '../services/warrantyService';

export const useWarranty = () => {
  const [data, setData] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalClaims, setTotalClaims] = useState(0);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const claims = await warrantyService.getClaims();
      setData(claims);
      setTotalClaims(claims.length);
    } catch (error) {
      console.error('Failed to fetch claims:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalClaims,
    fetchClaims
  };
};
