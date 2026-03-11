import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  status: 'pending' | 'processing' | 'completed' | 'failed' | string;
}

export const Badge: React.FC<BadgeProps> = ({ children, status }) => {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-emerald-100/50 text-emerald-600 border-emerald-200';
      case 'processing':
      case 'current':
        return 'bg-blue-100/50 text-blue-600 border-blue-200 animate-pulse';
      case 'failed':
        return 'bg-red-100/50 text-red-600 border-red-200';
      default:
        return 'bg-slate-100/50 text-slate-500 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${getStyles()} backdrop-blur-sm transition-all duration-500`}>
      {children}
    </span>
  );
};
