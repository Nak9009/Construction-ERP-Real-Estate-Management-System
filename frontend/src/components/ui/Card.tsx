import React, { HTMLAttributes } from 'react';

export const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className = '', children, ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 leading-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
