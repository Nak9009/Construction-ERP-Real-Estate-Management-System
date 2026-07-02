import { useState, useEffect } from 'react';
import { Report } from '../types';
import { reportService } from '../services/reportService';

export const useReports = () => {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reports = await reportService.getReports();
      setData(reports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetchReports
  };
};
