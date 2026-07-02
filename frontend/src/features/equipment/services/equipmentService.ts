import { api } from '@/lib/api';
import { Equipment } from '../types';

export const equipmentService = {
  getEquipment: async (): Promise<Equipment[]> => {
    const res = await api.get('/equipment');
    return res.data.data || res.data;
  },
  // In the future:
  // createEquipment
  // logUsage
  // maintenance
};
