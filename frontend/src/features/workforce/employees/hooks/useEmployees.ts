import { useState, useEffect } from 'react';
import { Employee } from '../types';
import { employeeService } from '../services/employeeService';

export const useEmployees = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const employees = await employeeService.getEmployees();
      setData(employees);
      setTotalEmployees(employees.length);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalEmployees,
    fetchEmployees
  };
};
