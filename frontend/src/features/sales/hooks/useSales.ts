import { useState, useEffect, useMemo } from 'react';
import { Contract } from '../types';
import { salesService } from '../services/salesService';

export const useSales = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    contract_number: '',
    customer_id: '',
    amount: '',
    signed_date: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const data = await salesService.getContracts();
      setContracts(data);
    } catch (error) {
      console.error('Failed to fetch contracts', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const totalAmount = contracts.reduce((sum, c) => sum + Number(c.amount), 0);
    const signedCount = contracts.filter(c => c.status === 'signed').length;
    return {
      totalContracts: contracts.length,
      totalAmount,
      signedCount,
      conversionRate: contracts.length > 0 ? ((signedCount / contracts.length) * 100).toFixed(1) : '0'
    };
  }, [contracts]);

  const handleOpenModal = (contract?: Contract) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        contract_number: contract.contract_number,
        customer_id: contract.customer_id || '',
        amount: contract.amount.toString(),
        signed_date: contract.signed_date ? contract.signed_date.substring(0, 10) : '',
        status: contract.status
      });
    } else {
      setEditingContract(null);
      setFormData({ 
        contract_number: `CTR-2026-00${contracts.length + 1}`, 
        customer_id: '', 
        amount: '', 
        signed_date: new Date().toISOString().split('T')[0], 
        status: 'pending' 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContract(null);
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
        contract_number: formData.contract_number,
        amount: Number(formData.amount),
        status: formData.status,
      };

      if (formData.signed_date) {
        payload.signed_date = formData.signed_date;
      }
      
      if (formData.customer_id) {
        payload.customer_id = formData.customer_id;
      }

      if (editingContract) {
        await salesService.updateContract(editingContract.id, payload);
      } else {
        await salesService.createContract(payload);
      }
      
      await fetchContracts();
      handleCloseModal();
    } catch (error: any) {
      console.error('Failed to save contract', error.response?.data || error.message);
      alert('Failed to save contract. See console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await salesService.deleteContract(id);
        await fetchContracts();
      } catch (error) {
        console.error('Failed to delete contract', error);
      }
    }
  };

  return {
    contracts,
    isModalOpen,
    editingContract,
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
