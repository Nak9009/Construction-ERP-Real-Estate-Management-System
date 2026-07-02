import { api } from '@/lib/api';
import { Transaction } from '../types';

export const financialService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const res = await api.get('/financial/transactions');
    return res.data.data || res.data;
  },
  // In the future:
  // recordIncome
  // recordExpense
};
