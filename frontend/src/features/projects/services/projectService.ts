import { api } from '@/lib/api';
import { Project } from '../types';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const res = await api.get('/projects');
    return res.data.data || res.data;
  },
  createProject: async (data: any) => {
    const res = await api.post('/projects', data);
    return res.data;
  },
  updateProject: async (id: string, data: any) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },
  deleteProject: async (id: string) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  }
};
