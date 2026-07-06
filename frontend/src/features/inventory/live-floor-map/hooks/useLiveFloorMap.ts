import { useState, useEffect } from 'react';
import { liveFloorMapService, Floor, Room, RoomStage } from '../services/liveFloorMapService';
import { api } from '@/lib/api';

export function useLiveFloorMap() {
  const [houses, setHouses] = useState<{ id: string; house_number: string }[]>([]);
  const [selectedHouseId, setSelectedHouseId] = useState<string>('');
  
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<string>('');
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch houses (we should probably reuse houseService, but inline for now)
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await api.get('/houses');
        const houseData = res.data.houses || [];
        setHouses(houseData);
        if (houseData.length > 0) {
          setSelectedHouseId(houseData[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch houses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  // Fetch floors when house changes
  useEffect(() => {
    if (!selectedHouseId) return;
    
    const fetchFloors = async () => {
      setLoading(true);
      try {
        const data = await liveFloorMapService.getHouseFloors(selectedHouseId);
        setFloors(data);
        if (data.length > 0) {
          setSelectedFloorId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch floors', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFloors();
  }, [selectedHouseId]);

  const handleRoomClick = async (roomId: string) => {
    try {
      const roomDetails = await liveFloorMapService.getRoomDetails(roomId);
      setSelectedRoom(roomDetails);
    } catch (error) {
      console.error('Failed to fetch room details', error);
    }
  };

  const updateStageProgress = async (stageId: string, progress: number, status: string) => {
    try {
      const updatedStage = await liveFloorMapService.updateRoomStage(stageId, progress, status);
      
      // Update local state for immediate feedback
      setSelectedRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stages: prev.stages?.map(s => s.id === stageId ? updatedStage : s)
        };
      });
      
      // We should also update the `floors` state to reflect the new overall room progress,
      // but for MVP we assume the backend Reverb will push this or we refetch.
    } catch (error) {
      console.error('Failed to update stage', error);
    }
  };

  return {
    houses,
    selectedHouseId,
    setSelectedHouseId,
    floors,
    selectedFloorId,
    setSelectedFloorId,
    selectedRoom,
    setSelectedRoom,
    handleRoomClick,
    updateStageProgress,
    loading
  };
}
