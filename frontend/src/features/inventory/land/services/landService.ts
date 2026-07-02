import { api } from '@/lib/api';
import { Land } from '../types';

export const landService = {
  getLands: async (): Promise<Land[]> => {
    const res = await api.get('/lands');
    return res.data.lands || res.data;
  },
  createLand: async (data: any) => {
    const res = await api.post('/lands', data);
    return res.data;
  },
  updateLand: async (id: string, data: any) => {
    const res = await api.put(`/lands/${id}`, data);
    return res.data;
  },
  deleteLand: async (id: string) => {
    const res = await api.delete(`/lands/${id}`);
    return res.data;
  }
};
