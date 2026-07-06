import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useHouses } from '../hooks/useHouses';

export function HousesView() {
  const {
    houses,
    isModalOpen,
    editingHouse,
    loading,
    formData,
    metrics,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleOpenChange,
    handleSubmit,
    handleDelete
  } = useHouses();

  return (
    <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              House Inventory
            </h1>
            <Button onClick={() => handleOpenModal()}>+ Add House Unit</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Total Houses</div>
                <div className="text-3xl font-bold">{metrics.totalHouses}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Available/Planned Units</div>
                <div className="text-3xl font-bold text-emerald-400">{metrics.available}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-neutral-400 mb-1">Estimated Sales Value</div>
                <div className="text-3xl font-bold text-blue-400">${metrics.totalValue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Properties List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>House Number</TableHead>
                      <TableHead>Model/Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Est. Cost</TableHead>
                      <TableHead>Sales Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow>
                         <TableCell colSpan={6} className="h-24 text-center">Loading house inventory...</TableCell>
                       </TableRow>
                    ) : houses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No houses found.</TableCell>
                      </TableRow>
                    ) : (
                      houses.map((house) => (
                        <TableRow key={house.id}>
                          <TableCell className="font-medium text-emerald-400">{house.house_number}</TableCell>
                          <TableCell>
                            {house.house_type ? (
                              <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-transparent">
                                {house.house_type.name}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-neutral-500/20 text-neutral-400 border-transparent">
                                Custom Build
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`border-transparent ${
                              house.status === 'completed' || house.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                              house.status === 'planned' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {house.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>${house.construction_cost?.toLocaleString() || '0'}</TableCell>
                          <TableCell className="font-bold">${house.selling_price?.toLocaleString() || '0'}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-400" onClick={() => handleOpenModal(house)}>Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDelete(house.id)}>Delete</Button>
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
            <DialogTitle>{editingHouse ? 'Edit House Asset' : 'Add New House Unit'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>House Number / Plot Identifier</Label>
              <Input 
                required
                value={formData.house_number} 
                onChange={(e) => setFormData({...formData, house_number: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Construction Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val as string})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="under_construction">Under Construction</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="available">Available for Sale</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Cost ($)</Label>
                <Input 
                  type="number"
                  value={formData.construction_cost} 
                  onChange={(e) => setFormData({...formData, construction_cost: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Target Selling Price ($)</Label>
                <Input 
                  type="number"
                  value={formData.selling_price} 
                  onChange={(e) => setFormData({...formData, selling_price: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter className="mt-6 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingHouse ? 'Save Changes' : 'Add House'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
