import { useState, useEffect } from 'react';
import { lotMapService, LotMapData } from '../services/lotMapService';
import { landService } from '@/features/inventory/land/services/landService';

export function useLotMap() {
  const [lands, setLands] = useState<any[]>([]);
  const [selectedLandId, setSelectedLandId] = useState<string>('');
  const [lotMapData, setLotMapData] = useState<LotMapData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Mapplic Style Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [activePhase, setActivePhase] = useState<string | null>(null);

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

  // Compute filtered lots from all blocks
  const allLots = lotMapData?.blocks?.flatMap(b => b.lots) || [];
  
  const filteredLots = allLots.filter(lot => {
    const matchesSearch = lot.lot_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailable = showAvailableOnly ? lot.status === 'available' : true;
    return matchesSearch && matchesAvailable;
  });

  return {
    lands,
    selectedLandId,
    setSelectedLandId,
    lotMapData,
    loading,
    selectedLot,
    isModalOpen,
    handleLotClick,
    closeLotModal,
    searchQuery,
    setSearchQuery,
    showAvailableOnly,
    setShowAvailableOnly,
    activePhase,
    setActivePhase,
    filteredLots,
    allLots
  };
}
