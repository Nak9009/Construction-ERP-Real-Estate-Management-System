import { api } from '@/lib/api';
import { Claim } from '../types';

export const warrantyService = {
  getClaims: async (): Promise<Claim[]> => {
    const res = await api.get('/warranty/claims');
    return res.data.data || res.data;
  },
  // createClaim, updateClaim, deleteClaim...
};
