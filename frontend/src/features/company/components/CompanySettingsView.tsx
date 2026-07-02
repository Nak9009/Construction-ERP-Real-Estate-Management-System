import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Save } from 'lucide-react';
import { useCompanySettings } from '../hooks/useCompanySettings';

export function CompanySettingsView() {
  const { formData, setFormData, handleSubmit } = useCompanySettings();

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
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID / Registration Number</Label>
                      <Input 
                        value={formData.taxId} 
                        onChange={(e) => setFormData({...formData, taxId: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Registered Address</Label>
                      <Input 
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Base Currency</Label>
                      <Input 
                        value={formData.currency} 
                        onChange={(e) => setFormData({...formData, currency: e.target.value})} 
                        disabled
                      />
                    </div>
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
