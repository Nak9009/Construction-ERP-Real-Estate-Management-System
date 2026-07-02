import { api } from '@/lib/api';
import { Material } from '../types';

export const warehouseService = {
  getMaterials: async (): Promise<Material[]> => {
    const res = await api.get('/warehouse/materials');
    return res.data.data || res.data;
  },
  // In the future:
  // receiveStock, etc...
};
