import api from '@/lib/api';
import { User } from '../types';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const res = await api.get('/admin/users');
    return res.data.data || res.data;
  }
};
