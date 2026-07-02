import { api } from '@/lib/api';
import { Document } from '../types';

export const documentService = {
  getDocuments: async (): Promise<Document[]> => {
    const res = await api.get('/documents');
    return res.data.data || res.data;
  },
  // In the future:
  // uploadDocument
  // deleteDocument
};
