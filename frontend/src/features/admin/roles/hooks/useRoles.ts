import { useState, useEffect } from 'react';
import { Role } from '../types';
import { roleService } from '../services/roleService';

export const useRoles = () => {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRoles, setTotalRoles] = useState(0);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const roles = await roleService.getRoles();
      setData(roles);
      setTotalRoles(roles.length);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalRoles
  };
};
