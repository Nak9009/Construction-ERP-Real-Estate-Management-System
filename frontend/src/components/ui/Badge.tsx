import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/20 text-red-400 border-red-500/20',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20',
    default: 'bg-slate-500/20 text-slate-400 border-slate-500/20',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
