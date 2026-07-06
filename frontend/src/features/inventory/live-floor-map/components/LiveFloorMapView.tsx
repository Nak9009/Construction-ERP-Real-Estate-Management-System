"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Map, Layers, CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useLiveFloorMap } from '../hooks/useLiveFloorMap';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'fill-emerald-500/50 hover:fill-emerald-400 stroke-emerald-500';
    case 'in_progress': return 'fill-yellow-500/50 hover:fill-yellow-400 stroke-yellow-500';
    case 'delayed': return 'fill-red-500/50 hover:fill-red-400 stroke-red-500';
    default: return 'fill-neutral-800 hover:fill-neutral-700 stroke-neutral-600'; // not_started
  }
};

const getBadgeVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'default';
    case 'in_progress': return 'secondary';
    case 'delayed': return 'destructive';
    default: return 'outline';
  }
};

export function LiveFloorMapView() {
  const {
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
  } = useLiveFloorMap();

  const currentFloor = floors.find(f => f.id === selectedFloorId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Layers className="h-8 w-8 text-primary" />
            Live Floor Map
          </h1>
          
          <div className="flex gap-4">
            <Select value={selectedHouseId} onValueChange={setSelectedHouseId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select House" />
              </SelectTrigger>
              <SelectContent>
                {houses.map(h => (
                  <SelectItem key={h.id} value={h.id}>House {h.house_number}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {floors.length > 0 && (
              <Select value={selectedFloorId} onValueChange={setSelectedFloorId}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  {floors.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <Card className="lg:col-span-2 flex flex-col h-[700px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Interactive Map: {currentFloor?.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Completed</span>
                <span className="flex items-center gap-1 ml-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> In Progress</span>
                <span className="flex items-center gap-1 ml-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Delayed</span>
                <span className="flex items-center gap-1 ml-2"><div className="w-3 h-3 bg-neutral-800 border border-neutral-600 rounded-full"></div> Not Started</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 relative overflow-hidden bg-neutral-950 rounded-b-lg flex items-center justify-center p-4">
              {loading ? (
                <div className="flex items-center gap-2 text-neutral-400"><Loader2 className="animate-spin" /> Loading map...</div>
              ) : currentFloor ? (
                // Simple SVG Wrapper
                <svg viewBox={currentFloor.svg_map_data?.viewBox || "0 0 1000 1000"} className="w-full h-full max-h-full">
                  {/* Base floor outline */}
                  {currentFloor.svg_map_data?.outline_path && (
                    <path 
                      d={currentFloor.svg_map_data.outline_path} 
                      fill="none" 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="10" 
                    />
                  )}
                  
                  {currentFloor.rooms?.map(room => (
                    <g key={room.id} onClick={() => handleRoomClick(room.id)} className="cursor-pointer group">
                      <path 
                        d={room.svg_path || "M 10 10 h 100 v 100 h -100 Z"} // Default fallback rect
                        className={`transition-all duration-300 stroke-2 ${getStatusColor(room.status)}`}
                      />
                      {/* Room Label */}
                      {room.svg_path && (
                         <text 
                          x="50%" y="50%" 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          fill="white"
                          className="text-2xl font-bold opacity-0 group-hover:opacity-100 pointer-events-none"
                        >
                          {room.name}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
              ) : (
                <div className="text-neutral-500 flex flex-col items-center">
                  <Map className="w-12 h-12 mb-2 opacity-20" />
                  No floor plan available.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {!selectedRoom ? (
                <div className="h-full flex items-center justify-center text-neutral-500 text-center px-4">
                  Click a room on the floor map to view its construction progress and details.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedRoom.name}</h2>
                      <div className="text-sm text-neutral-400 mt-1">Total Progress: {selectedRoom.progress_pct}%</div>
                    </div>
                    <Badge variant={getBadgeVariant(selectedRoom.status) as any}>{selectedRoom.status.replace('_', ' ').toUpperCase()}</Badge>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-800">
                    <h3 className="font-semibold text-neutral-300">Construction Stages</h3>
                    
                    {selectedRoom.stages?.length === 0 ? (
                      <p className="text-sm text-neutral-500 italic">No stages defined for this room yet.</p>
                    ) : (
                      selectedRoom.stages?.map(stage => (
                        <div key={stage.id} className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-medium">{stage.stage_name}</span>
                            <Select 
                              value={stage.status} 
                              onValueChange={(val) => updateStageProgress(stage.id, parseFloat(stage.progress_pct), val)}
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not_started">Not Started</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="delayed">Delayed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-neutral-400">
                              <span>Progress</span>
                              <span>{stage.progress_pct}%</span>
                            </div>
                            <Slider 
                              value={[parseFloat(stage.progress_pct)]} 
                              max={100} 
                              step={5}
                              onValueCommit={([val]) => updateStageProgress(stage.id, val, stage.status)}
                            />
                          </div>
                          
                          {(stage.start_date || stage.expected_end_date) && (
                            <div className="mt-4 flex gap-4 text-xs text-neutral-500">
                              {stage.start_date && <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Start: {stage.start_date}</span>}
                              {stage.expected_end_date && <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> End: {stage.expected_end_date}</span>}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Placeholders for advanced features */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-neutral-300 transition-colors">
                      View Photos
                    </button>
                    <button className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-neutral-300 transition-colors flex items-center justify-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-500"/> Report Issue
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
