import { api } from '@/lib/api';

export interface LotMapData {
  id: string;
  project_id: string | null;
  owner_name: string;
  purchase_price: number;
  title_number: string;
  area_sqm: number;
  project?: {
    id: string;
    name: string;
  };
  blocks: {
    id: string;
    name: string;
    total_lots: number;
      lots: {
        id: string;
        lot_number: string;
        area_sqm: number;
        status: string;
        svg_path?: string;
        house?: {
        id: string;
        house_number: string;
        status: string;
        selling_price: number;
      };
    }[];
  }[];
}

export const lotMapService = {
  getLandDetails: async (landId: string): Promise<LotMapData> => {
    const res = await api.get(`/lands/${landId}`);
    return res.data.land;
  }
};
