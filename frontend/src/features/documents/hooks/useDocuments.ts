import { useState, useEffect } from 'react';
import { Document } from '../types';
import { documentService } from '../services/documentService';

export const useDocuments = () => {
  const [data, setData] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getDocuments();
      setData(docs);
      setTotalDocs(docs.length);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalDocs,
    fetchDocuments
  };
};
