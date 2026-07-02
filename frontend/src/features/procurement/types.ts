export interface PurchaseOrder {
  id: string | number;
  poNumber?: string;
  po_number?: string;
  supplier: string;
  total: string | number;
  date: string;
  status: string;
}
