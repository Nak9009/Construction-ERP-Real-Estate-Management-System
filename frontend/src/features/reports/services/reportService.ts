import { api } from '@/lib/api';
import { Report } from '../types';

export const reportService = {
  getReports: async (): Promise<Report[]> => {
    const res = await api.get('/reports');
    return res.data.data || res.data;
  },
  // generateReport...
};
