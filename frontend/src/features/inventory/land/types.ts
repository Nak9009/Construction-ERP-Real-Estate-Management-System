export interface Land {
  id: string;
  project_id: string | null;
  owner_name: string | null;
  purchase_price: number | null;
  title_number: string | null;
  area_sqm: number | null;
  created_at: string;
  project?: {
    id: string;
    name: string;
  };
}
