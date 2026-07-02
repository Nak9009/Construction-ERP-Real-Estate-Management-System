import { api } from '@/lib/api';
import { Contractor } from '../types';

export const contractorService = {
  getContractors: async (): Promise<Contractor[]> => {
    const res = await api.get('/workforce/contractors');
    return res.data.data || res.data;
  },
  // In the future:
  // createContractor, updateContractor...
};
