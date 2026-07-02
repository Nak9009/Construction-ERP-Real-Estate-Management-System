export interface Material {
  id: string | number;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  min_stock?: number;
  minStock?: number;
  status: string;
}
