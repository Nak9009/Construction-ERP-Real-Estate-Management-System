import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  valueClassName?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, valueClassName = '' }) => {
  return (
    <Card className="glass-panel border-slate-800/50 hover:bg-slate-900/30 transition-colors">
      <CardContent className="pt-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-2 relative z-10">
          <div className="text-sm font-medium text-slate-400">{title}</div>
          {icon && (
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-300">
              {icon}
            </div>
          )}
        </div>
        <div className={`text-3xl font-bold tracking-tight mb-1 relative z-10 ${valueClassName}`}>
          {value}
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 text-xs font-medium relative z-10">
            <span className={trend.isPositive ? 'text-emerald-400' : 'text-red-400'}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
