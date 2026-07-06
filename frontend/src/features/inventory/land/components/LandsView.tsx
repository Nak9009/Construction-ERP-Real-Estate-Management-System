import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLands } from '../hooks/useLands';

export function LandsView() {
  const {
    lands,
    isModalOpen,
    editingLand,
    loading,
    formData,
    metrics,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleOpenChange,
    handleSubmit,
    handleDelete
  } = useLands();

  return (
    <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Land Inventory
            </h1>
            <Button onClick={() => handleOpenModal()}>+ Acquire Land</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Parcels</div>
                <div className="text-3xl font-bold">{metrics.totalParcels}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Area (sqm)</div>
                <div className="text-3xl font-bold text-emerald-400">{metrics.totalArea.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Value</div>
                <div className="text-3xl font-bold text-blue-400">${metrics.totalValue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Land Registry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title Number</TableHead>
                      <TableHead>Owner Name</TableHead>
                      <TableHead>Area (sqm)</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow>
                         <TableCell colSpan={6} className="h-24 text-center">Loading land registry...</TableCell>
                       </TableRow>
                    ) : lands.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No land assets found.</TableCell>
                      </TableRow>
                    ) : (
                      lands.map((land) => (
                        <TableRow key={land.id}>
                          <TableCell className="font-medium text-emerald-400">{land.title_number || 'Unregistered'}</TableCell>
                          <TableCell>{land.owner_name || 'N/A'}</TableCell>
                          <TableCell>{land.area_sqm?.toLocaleString() || 'N/A'}</TableCell>
                          <TableCell className="font-bold">${land.purchase_price?.toLocaleString() || '0'}</TableCell>
                          <TableCell>
                            {land.project ? (
                              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-transparent">
                                {land.project.name}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-neutral-500/20 text-neutral-400 border-transparent">
                                Unassigned
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-400" onClick={() => handleOpenModal(land)}>Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDelete(land.id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingLand ? 'Edit Land Asset' : 'Acquire New Land'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title Number / Deed</Label>
              <Input 
                value={formData.title_number} 
                onChange={(e) => setFormData({...formData, title_number: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Owner Name (on deed)</Label>
              <Input 
                value={formData.owner_name} 
                onChange={(e) => setFormData({...formData, owner_name: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Area (sqm)</Label>
                <Input 
                  type="number"
                  value={formData.area_sqm} 
                  onChange={(e) => setFormData({...formData, area_sqm: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Purchase Price ($)</Label>
                <Input 
                  type="number"
                  value={formData.purchase_price} 
                  onChange={(e) => setFormData({...formData, purchase_price: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter className="mt-6 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingLand ? 'Save Changes' : 'Add Land'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
