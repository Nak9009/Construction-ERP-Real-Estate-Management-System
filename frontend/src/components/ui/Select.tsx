import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-neutral-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-2.5 rounded-xl text-sm
              bg-white/5 border outline-none
              transition-all duration-200
              appearance-none
              ${error 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' 
                : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 hover:bg-white/10'
              }
              ${className}
            `}
            {...props}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-400 ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
