import api from '@/lib/api';
import { Role } from '../types';

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    const res = await api.get('/admin/roles');
    return res.data.data || res.data;
  }
};
