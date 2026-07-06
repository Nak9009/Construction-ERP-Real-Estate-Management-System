import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [data, setData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await notificationService.getNotifications();
      setData(items);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetchData
  };
};
