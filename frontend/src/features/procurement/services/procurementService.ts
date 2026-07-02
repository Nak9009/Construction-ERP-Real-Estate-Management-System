import { api } from '@/lib/api';
import { PurchaseOrder } from '../types';

export const procurementService = {
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    const res = await api.get('/procurement/orders');
    return res.data.data || res.data;
  },
  // In the future:
  // createPO, updatePO, deletePO...
};
