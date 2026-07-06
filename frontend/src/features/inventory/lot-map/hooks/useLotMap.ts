import { useState, useEffect } from 'react';
import { lotMapService, LotMapData } from '../services/lotMapService';
import { landService } from '@/features/inventory/land/services/landService';

export function useLotMap() {
  const [lands, setLands] = useState<{ id: string; title_number: string; project?: { name: string } }[]>([]);
  const [selectedLandId, setSelectedLandId] = useState<string>('');
  const [lotMapData, setLotMapData] = useState<LotMapData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch list of lands for the selector
  useEffect(() => {
    const fetchLands = async () => {
      try {
        const data = await landService.getLands();
        setLands(data);
        if (data.length > 0) {
          setSelectedLandId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch lands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLands();
  }, []);

  // Fetch detailed lot map data when a land is selected
  useEffect(() => {
    if (!selectedLandId) return;

    const fetchLotMap = async () => {
      setLoading(true);
      try {
        const data = await lotMapService.getLandDetails(selectedLandId);
        setLotMapData(data);
      } catch (error) {
        console.error('Failed to fetch lot map details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLotMap();
  }, [selectedLandId]);

  const handleLotClick = (lot: any) => {
    setSelectedLot(lot);
    setIsModalOpen(true);
  };

  const closeLotModal = () => {
    setIsModalOpen(false);
    setSelectedLot(null);
  };

  return {
    lands,
    selectedLandId,
    setSelectedLandId,
    lotMapData,
    loading,
    selectedLot,
    isModalOpen,
    handleLotClick,
    closeLotModal
  };
}
