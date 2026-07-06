import { useState, useEffect } from 'react';
import { Employee } from '../types';
import { employeeService } from '../services/employeeService';

export const useEmployees = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    position: '',
    status: 'active',
    phone: '',
    email: '',
  });

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

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      // Try to split name into first and last name if possible
      const parts = employee.name.split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      
      setFormData({
        first_name: firstName,
        last_name: lastName,
        position: employee.role || '',
        status: employee.status || 'active',
        phone: employee.phone || '',
        email: employee.contact && employee.contact.includes('@') ? employee.contact : '',
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        first_name: '',
        last_name: '',
        position: '',
        status: 'active',
        phone: '',
        email: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleCloseModal();
    else setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee.id, formData);
      } else {
        await employeeService.createEmployee(formData);
      }
      await fetchEmployees();
      handleCloseModal();
    } catch (error: any) {
      console.error('Failed to save employee', error);
      alert('Failed to save employee. ' + (error.response?.data?.message || 'Check console.'));
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        await fetchEmployees();
      } catch (error) {
        console.error('Failed to delete employee', error);
      }
    }
  };

  return {
    data,
    loading,
    totalEmployees,
    isModalOpen,
    editingEmployee,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleOpenChange,
    handleSubmit,
    handleDelete,
    fetchEmployees
  };
};
