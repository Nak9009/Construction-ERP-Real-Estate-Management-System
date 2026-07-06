import { api } from '@/lib/api';
import { Employee } from '../types';

export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const res = await api.get('/workforce/employees');
    const rawData = res.data?.data || res.data || [];
    return rawData.map((emp: any) => ({
      id: emp.id,
      name: `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Unknown',
      role: emp.position || 'N/A',
      department: emp.department?.name || 'N/A',
      status: emp.status || 'inactive',
      contact: emp.email || emp.phone || 'N/A',
      phone: emp.phone
    }));
  },
  createEmployee: async (data: any) => {
    const res = await api.post('/workforce/employees', data);
    return res.data;
  },
  updateEmployee: async (id: string | number, data: any) => {
    const res = await api.put(`/workforce/employees/${id}`, data);
    return res.data;
  },
  deleteEmployee: async (id: string | number) => {
    const res = await api.delete(`/workforce/employees/${id}`);
    return res.data;
  },
};
