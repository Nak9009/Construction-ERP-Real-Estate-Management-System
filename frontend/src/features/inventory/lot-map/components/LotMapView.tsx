"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Square } from 'lucide-react';
import { useLotMap } from '../hooks/useLotMap';

// Helper to determine the color of a lot based on status
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'available': return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30';
    case 'reserved': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30';
    case 'sold': return 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30';
    case 'building': 
    case 'under_construction': return 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30';
    case 'completed': return 'bg-neutral-500/20 border-neutral-500/50 text-neutral-400 hover:bg-neutral-500/30';
    default: return 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700';
  }
};

export function LotMapView() {
  const {
    lands,
    selectedLandId,
    setSelectedLandId,
    lotMapData,
    loading,
    selectedLot,
    isModalOpen,
    handleLotClick,
    closeLotModal
  } = useLotMap();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            Interactive Lot Map
          </h1>
          
          <div className="w-full sm:w-72">
            <Select value={selectedLandId} onValueChange={setSelectedLandId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Land Asset" />
              </SelectTrigger>
              <SelectContent>
                {lands.map(land => (
                  <SelectItem key={land.id} value={land.id}>
                    {land.title_number || 'Unnamed Land'} {land.project?.name ? `(${land.project.name})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 text-sm items-center">
              <span className="font-semibold text-neutral-300 mr-2">Legend:</span>
              <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50"></div> Available</div>
              <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/50"></div> Reserved</div>
              <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50"></div> Sold</div>
              <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50"></div> Building</div>
              <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-neutral-500/20 border border-neutral-500/50"></div> Completed</div>
              <div className="flex items-center gap-1 ml-4"><Home className="w-4 h-4 text-white" /> House Present</div>
            </div>
          </CardContent>
        </Card>

        {/* Map Grid area */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-neutral-400">Loading map data...</div>
        ) : !lotMapData ? (
          <div className="h-64 flex items-center justify-center text-neutral-400">No land selected or no data available.</div>
        ) : (
          <div className="space-y-8">
            {lotMapData.blocks?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-neutral-400">
                  <Square className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  This land has not been subdivided into blocks and lots yet.
                </CardContent>
              </Card>
            ) : (
              lotMapData.blocks?.map(block => (
                <Card key={block.id} className="border-2 border-neutral-800/50 overflow-hidden bg-neutral-900/50">
                  <CardHeader className="bg-neutral-950/50 border-b border-neutral-800/50 pb-4">
                    <CardTitle className="text-xl flex items-center justify-between">
                      <span>{block.name}</span>
                      <Badge variant="secondary">{block.lots?.length || 0} Lots</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                      {block.lots?.map(lot => (
                        <div
                          key={lot.id}
                          onClick={() => handleLotClick(lot)}
                          className={`
                            relative cursor-pointer rounded-lg border-2 p-3 aspect-square
                            flex flex-col items-center justify-center text-center transition-all duration-200
                            ${getStatusColor(lot.status)}
                          `}
                          title={`Lot ${lot.lot_number} - ${lot.status}`}
                        >
                          <span className="font-bold text-lg mb-1">{lot.lot_number}</span>
                          <span className="text-xs opacity-75">{lot.area_sqm} sqm</span>
                          
                          {lot.house && (
                            <div className="absolute top-2 right-2">
                              <Home className="w-4 h-4 opacity-80" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

      </div>

      {/* Lot Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeLotModal()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Lot Details: {selectedLot?.lot_number}</span>
              <Badge className={getStatusColor(selectedLot?.status)}>{selectedLot?.status}</Badge>
            </DialogTitle>
            <DialogDescription>
              Detailed information for this specific lot.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLot && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-neutral-400">Area</div>
                  <div className="font-medium">{selectedLot.area_sqm} sqm</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-neutral-400">Dimensions</div>
                  <div className="font-medium">{selectedLot.width || '?'} x {selectedLot.length || '?'}</div>
                </div>
              </div>

              {selectedLot.house ? (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Home className="w-4 h-4" /> 
                    House Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-neutral-900 p-3 rounded-md border border-border">
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-400">House No.</div>
                      <div className="font-medium">{selectedLot.house.house_number}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-400">Status</div>
                      <div><Badge variant="outline">{selectedLot.house.status}</Badge></div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <div className="text-xs text-neutral-400">Selling Price</div>
                      <div className="font-medium text-emerald-400">${selectedLot.house.selling_price?.toLocaleString() || '0'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-sm text-neutral-400 italic">No house built on this lot yet.</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
