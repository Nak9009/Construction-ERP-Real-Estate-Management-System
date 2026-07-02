import { useState, useEffect } from 'react';
import { ConstructionTask } from '../types';
import { constructionService } from '../services/constructionService';

export const useConstruction = () => {
  const [data, setData] = useState<ConstructionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasks = await constructionService.getTasks();
      setData(tasks);
      setTotalTasks(tasks.length);
    } catch (error) {
      console.error('Failed to fetch construction tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalTasks,
    fetchTasks
  };
};
