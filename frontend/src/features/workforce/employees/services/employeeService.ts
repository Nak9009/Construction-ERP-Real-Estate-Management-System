import { api } from '@/lib/api';
import { Employee } from '../types';

export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const res = await api.get('/workforce/employees');
    return res.data.data || res.data;
  },
  // In the future:
  // createEmployee, updateEmployee...
};
