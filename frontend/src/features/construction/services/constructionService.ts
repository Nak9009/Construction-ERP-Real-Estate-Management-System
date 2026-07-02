import { api } from '@/lib/api';
import { ConstructionTask } from '../types';

export const constructionService = {
  getTasks: async (): Promise<ConstructionTask[]> => {
    const res = await api.get('/construction/progress');
    return res.data.data || res.data;
  },
  // In the future:
  // createTask
  // updateTask
  // deleteTask
};
