import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlocks } from '../hooks/useBlocks';

export function BlocksView() {
  const { data, loading } = useBlocks();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-64">
        <TopNav />
        <main className="flex-1 p-8 pt-24 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Block Management
            </h1>
          </div>

          <Card className="glass-panel border-white/10 mt-6">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-neutral-400 text-center py-8">Loading...</p>
              ) : data.length === 0 ? (
                <p className="text-neutral-400 text-center py-8">No data found.</p>
              ) : (
                <p>Total items: {data.length}</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
