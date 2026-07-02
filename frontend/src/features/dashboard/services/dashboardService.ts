import api from '@/lib/api';
import { DashboardMetrics } from '../types';

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }
};
