import { useState, useEffect } from 'react';
import { Project } from '../types';
import { projectService } from '../services/projectService';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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
      const data = await projectService.getProjects();
      setProjects(data);
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
      const payload = {
        name: formData.name,
        status: formData.status,
        budget: Number(formData.budget),
        start_date: formData.start_date
      };

      if (editingProject) {
        await projectService.updateProject(editingProject.id, payload);
      } else {
        await projectService.createProject(payload);
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
        await projectService.deleteProject(id);
        await fetchProjects();
      } catch (error) {
        console.error('Failed to delete project', error);
      }
    }
  };

  return {
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
  };
};
