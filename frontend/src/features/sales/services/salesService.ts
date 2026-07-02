import { api } from '@/lib/api';
import { Contract } from '../types';

export const salesService = {
  getContracts: async (): Promise<Contract[]> => {
    const res = await api.get('/sales/contracts');
    return res.data.data || res.data;
  },
  createContract: async (data: any) => {
    const res = await api.post('/sales/contracts', data);
    return res.data;
  },
  updateContract: async (id: string, data: any) => {
    const res = await api.put(`/sales/contracts/${id}`, data);
    return res.data;
  },
  deleteContract: async (id: string) => {
    const res = await api.delete(`/sales/contracts/${id}`);
    return res.data;
  }
};
