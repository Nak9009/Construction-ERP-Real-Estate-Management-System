export interface House {
  id: string;
  house_number: string;
  status: string;
  selling_price: number | null;
  construction_cost: number | null;
  created_at: string;
  lot_id?: string;
  house_type_id?: string;
  house_type?: {
    id: string;
    name: string;
  };
}
