import { api } from '@/lib/api';
import { House } from '../types';

export const houseService = {
  getHouses: async (): Promise<House[]> => {
    const res = await api.get('/houses');
    return res.data?.houses || res.data?.data || res.data || [];
  },
  createHouse: async (data: any) => {
    const res = await api.post('/houses', data);
    return res.data;
  },
  updateHouse: async (id: string, data: any) => {
    const res = await api.put(`/houses/${id}`, data);
    return res.data;
  },
  deleteHouse: async (id: string) => {
    const res = await api.delete(`/houses/${id}`);
    return res.data;
  }
};
