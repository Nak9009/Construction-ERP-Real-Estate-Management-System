"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, MapPin, ZoomIn, ZoomOut, Maximize, Filter, Loader2, Home } from 'lucide-react';
import { useLotMap } from '../hooks/useLotMap';
import { LotMapBackground } from './LotMapBackground';

// Mapplic specific colors
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'available': return { fill: 'fill-emerald-600', hover: 'hover:fill-emerald-500', text: 'text-emerald-600', dot: 'bg-emerald-600' };
    case 'reserved': return { fill: 'fill-yellow-500', hover: 'hover:fill-yellow-400', text: 'text-yellow-500', dot: 'bg-yellow-500' };
    case 'sold': return { fill: 'fill-neutral-400', hover: 'hover:fill-neutral-300', text: 'text-neutral-500', dot: 'bg-neutral-400' };
    case 'building': return { fill: 'fill-blue-500', hover: 'hover:fill-blue-400', text: 'text-blue-500', dot: 'bg-blue-500' };
    default: return { fill: 'fill-neutral-200', hover: 'hover:fill-neutral-300', text: 'text-neutral-500', dot: 'bg-neutral-200' };
  }
};

// Helper to calculate approximate center of an SVG path for label placement
const getPathCenter = (pathData: string) => {
  if (!pathData) return { x: 0, y: 0 };
  const points = pathData.match(/-?\d+(\.\d+)?/g);
  if (!points || points.length < 2) return { x: 0, y: 0 };
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < points.length; i += 2) {
    const x = parseFloat(points[i]);
    const y = parseFloat(points[i + 1] || '0');
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { x: minX + (maxX - minX) / 2, y: minY + (maxY - minY) / 2 };
};

export function LotMapView() {
  const {
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
    filteredLots
  } = useLotMap();

  // SVG Pan/Zoom mock state
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        
        {/* Header Area */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Interactive Subdivision Map
          </h1>
          {lotMapData && <span className="ml-2 text-neutral-500">- {lotMapData.blocks?.[0]?.name}</span>}
        </div>

        {/* Main Content: Split Screen */}
        <div className="flex flex-1 gap-6 overflow-hidden">
          
          {/* Sidebar */}
          <Card className="w-80 flex flex-col overflow-hidden bg-background border-r">
            <div className="p-4 space-y-4 border-b">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search lots..." 
                  className="pl-9 bg-neutral-100 dark:bg-neutral-900 border-none rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <Badge variant="secondary" className="rounded-full px-4 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800">Phase 1</Badge>
                <Badge variant="outline" className="rounded-full px-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 opacity-50">Phase 2</Badge>
              </div>

              {/* Toggle Available */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium">Show available</span>
                <Switch 
                  checked={showAvailableOnly} 
                  onCheckedChange={setShowAvailableOnly} 
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredLots.length === 0 ? (
                <div className="text-center text-sm text-neutral-500 py-8">No lots found.</div>
              ) : (
                filteredLots.map(lot => {
                  const colors = getStatusColor(lot.status);
                  return (
                    <div 
                      key={lot.id} 
                      onClick={() => handleLotClick(lot)}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
                    >
                      <div className="text-2xl font-black text-neutral-300 dark:text-neutral-700 w-12 text-center">
                        {lot.lot_number}
                      </div>
                      <div>
                        <div className="font-bold">Lot {lot.lot_number}</div>
                        <div className={`text-sm flex items-center gap-1.5 ${colors.text}`}>
                          <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                          {lot.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Map Area */}
          <Card className="flex-1 relative overflow-hidden bg-[#f4f7f6] dark:bg-neutral-950 flex items-center justify-center">
            {loading ? (
               <div className="flex flex-col items-center gap-2 text-neutral-400">
                 <Loader2 className="animate-spin w-8 h-8" />
                 <span>Loading map...</span>
               </div>
            ) : !lotMapData ? (
               <div className="text-neutral-400">No layout available.</div>
            ) : (
              <>
                {/* SVG Renderer */}
                <div 
                  className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <svg viewBox="0 0 1164 905" className="w-full h-full max-h-[800px] drop-shadow-xl">
                    <LotMapBackground />
                    {/* Lots */}
                    {filteredLots.map((lot: any) => {
                      const colors = getStatusColor(lot.status);
                      const center = getPathCenter(lot.svg_path || '');
                      
                      return (
                        <g 
                          key={lot.id} 
                          className="cursor-pointer group"
                          onClick={() => handleLotClick(lot)}
                        >
                          <path 
                            d={lot.svg_path || "M0,0"} 
                            className={`transition-all duration-300 stroke-white dark:stroke-neutral-950 stroke-[3px] ${colors.fill} ${colors.hover}`}
                          />
                          <text 
                            x={center.x || "50%"} 
                            y={center.y || "50%"} 
                            className="fill-white font-bold text-[18px] pointer-events-none"
                            textAnchor="middle" 
                            dominantBaseline="central"
                          >
                            {lot.lot_number}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border p-1">
                  <button onClick={handleResetZoom} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-600 transition">
                    <Maximize className="w-5 h-5" />
                  </button>
                  <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800" />
                  <button onClick={handleZoomIn} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-600 transition">
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button onClick={handleZoomOut} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-600 transition">
                    <ZoomOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Lot Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeLotModal()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-2xl">
              <span>Lot {selectedLot?.lot_number}</span>
            </DialogTitle>
            <DialogDescription>
              <div className={`mt-2 inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 ${getStatusColor(selectedLot?.status).text}`}>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedLot?.status).dot}`} />
                {selectedLot?.status.replace('_', ' ').toUpperCase()}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          {selectedLot && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-neutral-500">Area</div>
                  <div className="font-medium text-lg">{selectedLot.area_sqm} m²</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-neutral-500">Price</div>
                  <div className="font-medium text-lg text-emerald-600">
                    {selectedLot.house ? `$${selectedLot.house.selling_price?.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>

              {selectedLot.house ? (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Home className="w-4 h-4 text-primary" /> 
                    House Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border">
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-500 uppercase tracking-wider">House No.</div>
                      <div className="font-bold">{selectedLot.house.house_number}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-500 uppercase tracking-wider">Status</div>
                      <div className="font-medium">{selectedLot.house.status}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 pt-4 border-t border-border text-center">
                  <div className="text-sm text-neutral-500 italic">No house built on this lot yet.</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
