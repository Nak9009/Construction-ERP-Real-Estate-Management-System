import { useState } from 'react';
import { CompanySettings } from '../types';

export const useCompanySettings = () => {
  const [formData, setFormData] = useState<CompanySettings>({
    name: 'BuildRite Construction Group',
    email: 'contact@buildrite.com',
    phone: '+1 (555) 123-4567',
    address: '100 Construction Ave, Suite 500, New York, NY 10001',
    taxId: 'US-987654321',
    currency: 'USD ($)',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Company settings saved successfully (mock)');
  };

  return {
    formData,
    setFormData,
    handleSubmit
  };
};
