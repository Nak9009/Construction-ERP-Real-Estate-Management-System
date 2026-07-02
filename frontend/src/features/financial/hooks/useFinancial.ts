import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { financialService } from '../services/financialService';

export const useFinancial = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const txs = await financialService.getTransactions();
      setData(txs);
      setTotalTransactions(txs.length);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalTransactions,
    fetchTransactions
  };
};
