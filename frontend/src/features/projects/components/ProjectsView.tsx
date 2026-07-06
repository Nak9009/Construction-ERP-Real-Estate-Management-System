import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '../hooks/useProjects';

export function ProjectsView() {
  const {
    projects,
    isModalOpen,
    editingProject,
    loading,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleOpenChange,
    handleSubmit,
    handleDelete
  } = useProjects();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-64">
        <TopNav />
        <main className="flex-1 p-8 pt-24 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Projects Management
            </h1>
            <Button onClick={() => handleOpenModal()}>+ New Project</Button>
          </div>

          <Card className="glass-panel border-white/10">
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">Loading projects...</TableCell>
                      </TableRow>
                    ) : projects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No projects found. Create one to get started.</TableCell>
                      </TableRow>
                    ) : (
                      projects.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`border-transparent ${
                              p.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                              p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-neutral-500/20 text-neutral-400'
                            }`}>
                              {p.status ? p.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                            </Badge>
                          </TableCell>
                          <TableCell>${p.budget ? Number(p.budget).toLocaleString() : '0'}</TableCell>
                          <TableCell>{p.start_date ? p.start_date.substring(0, 10) : 'N/A'}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-400" onClick={() => handleOpenModal(p)}>Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-400" onClick={() => handleDelete(p.id)}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val as string})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input 
                  type="date" 
                  required 
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Budget ($)</Label>
              <Input 
                type="number" 
                min="0" 
                required 
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>
            <DialogFooter className="mt-6 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingProject ? 'Save Changes' : 'Create Project'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
