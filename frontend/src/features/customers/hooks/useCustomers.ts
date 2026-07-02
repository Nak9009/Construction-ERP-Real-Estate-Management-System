import { useState, useEffect, useMemo } from 'react';
import { Customer } from '../types';
import { customerService } from '../services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    identity_card_number: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const totalCustomers = customers.length;
    const activeLeads = Math.floor(totalCustomers * 0.4); // Mock calculation
    return {
      totalCustomers,
      activeLeads
    };
  }, [customers]);

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email || '',
        phone: customer.phone || '',
        identity_card_number: customer.identity_card_number || ''
      });
    } else {
      setEditingCustomer(null);
      setFormData({ 
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        identity_card_number: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCloseModal();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      if (formData.email) payload.email = formData.email;
      if (formData.phone) payload.phone = formData.phone;
      if (formData.identity_card_number) payload.identity_card_number = formData.identity_card_number;

      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, payload);
      } else {
        await customerService.createCustomer(payload);
      }
      
      await fetchCustomers();
      handleCloseModal();
    } catch (error: any) {
      console.error('Failed to save customer', error.response?.data || error.message);
      alert('Failed to save customer. See console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        await fetchCustomers();
      } catch (error) {
        console.error('Failed to delete customer', error);
      }
    }
  };

  return {
    customers,
    isModalOpen,
    editingCustomer,
    loading,
    formData,
    metrics,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleOpenChange,
    handleSubmit,
    handleDelete
  };
};
