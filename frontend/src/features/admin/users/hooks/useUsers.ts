import { useState, useEffect } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await userService.getUsers();
      setData(users);
      setTotalUsers(users.length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalUsers
  };
};
