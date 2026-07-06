import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '../hooks/useAnalytics';

export function AnalyticsView() {
  const { data, loading } = useAnalytics();

  return (
    <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Data Analytics
            </h1>
          </div>

          <Card className="mt-6">
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
        </div>
      </DashboardLayout>
  );
}
