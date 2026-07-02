"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { api } from '@/lib/api';

interface Project {
  id: string;
  name: string;
  status: string;
  budget: number;
  start_date: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    status: 'planning',
    budget: '',
    start_date: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data.data || res.data); // Handles wrapped resources
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        status: project.status,
        budget: project.budget ? project.budget.toString() : '',
        start_date: project.start_date ? project.start_date.substring(0, 10) : ''
      });
    } else {
      setEditingProject(null);
      setFormData({ name: '', status: 'planning', budget: '', start_date: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        status: formData.status,
        budget: Number(formData.budget),
        start_date: formData.start_date
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      
      await fetchProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save project', error);
      alert('Failed to save project. See console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        await fetchProjects();
      } catch (error) {
        console.error('Failed to delete project', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav />
        <main className="p-8 space-y-6 overflow-y-auto">
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
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 uppercase text-neutral-400">
                    <tr>
                      <th className="px-6 py-3 font-medium">Project Name</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Budget</th>
                      <th className="px-6 py-3 font-medium">Start Date</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading projects...</td>
                      </tr>
                    ) : projects.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No projects found. Create one to get started.</td>
                      </tr>
                    ) : (
                      projects.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium">{p.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              p.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                              p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-neutral-500/20 text-neutral-400'
                            }`}>
                              {p.status ? p.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="px-6 py-4">${p.budget ? Number(p.budget).toLocaleString() : '0'}</td>
                          <td className="px-6 py-4">{p.start_date ? p.start_date.substring(0, 10) : 'N/A'}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Button variant="ghost" className="text-xs py-1 px-3 text-blue-400" onClick={() => handleOpenModal(p)}>Edit</Button>
                            <Button variant="ghost" className="text-xs py-1 px-3 text-red-400" onClick={() => handleDelete(p.id)}>Delete</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Project Name" 
            required 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Status" 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={[
                { value: 'planning', label: 'Planning' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
            />
            <Input 
              label="Start Date" 
              type="date" 
              required 
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            />
          </div>
          <Input 
            label="Budget ($)" 
            type="number" 
            min="0" 
            required 
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
          />
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">{editingProject ? 'Save Changes' : 'Create Project'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
