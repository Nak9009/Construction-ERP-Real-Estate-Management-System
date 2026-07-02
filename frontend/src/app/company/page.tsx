"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building2, Save } from 'lucide-react';

export default function CompanyPage() {
  const [formData, setFormData] = useState({
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-64">
        <TopNav />
        <main className="flex-1 p-8 pt-24 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-cyan-400" />
              Company Profile
            </h1>
          </div>

          <div className="max-w-4xl">
            <Card className="glass-panel border-slate-800/50">
              <CardHeader className="border-b border-slate-800/50 pb-4">
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Company Name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      required 
                    />
                    <Input 
                      label="Tax ID / Registration Number" 
                      value={formData.taxId} 
                      onChange={(e) => setFormData({...formData, taxId: e.target.value})} 
                      required 
                    />
                    <Input 
                      label="Contact Email" 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      required 
                    />
                    <Input 
                      label="Contact Phone" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      required 
                    />
                    <div className="md:col-span-2">
                      <Input 
                        label="Registered Address" 
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})} 
                        required 
                      />
                    </div>
                    <Input 
                      label="Base Currency" 
                      value={formData.currency} 
                      onChange={(e) => setFormData({...formData, currency: e.target.value})} 
                      disabled
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4 mt-6 border-t border-slate-800/50">
                    <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 border-0">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
