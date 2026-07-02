import { useState, useEffect } from 'react';
import { PurchaseOrder } from '../types';
import { procurementService } from '../services/procurementService';

export const useProcurement = () => {
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const orders = await procurementService.getPurchaseOrders();
      setData(orders);
      setTotalOrders(orders.length);
    } catch (error) {
      console.error('Failed to fetch purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    totalOrders,
    fetchPurchaseOrders
  };
};
