import { api } from '@/lib/api';

export interface RoomStage {
  id: string;
  stage_name: string;
  progress_pct: string;
  status: string;
  start_date: string | null;
  expected_end_date: string | null;
}

export interface Room {
  id: string;
  name: string;
  svg_path: string;
  status: string;
  progress_pct: string;
  stages?: RoomStage[];
}

export interface Floor {
  id: string;
  name: string;
  level: number;
  svg_map_data: any;
  rooms: Room[];
}

export const liveFloorMapService = {
  getHouseFloors: async (houseId: string): Promise<Floor[]> => {
    const res = await api.get(`/houses/${houseId}/floors`);
    return res.data.floors;
  },
  
  getRoomDetails: async (roomId: string): Promise<Room> => {
    const res = await api.get(`/rooms/${roomId}`);
    return res.data.room;
  },
  
  updateRoomStage: async (stageId: string, progress_pct: number, status: string): Promise<RoomStage> => {
    const res = await api.patch(`/room-stages/${stageId}`, { progress_pct, status });
    return res.data.stage;
  }
};
