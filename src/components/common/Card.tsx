import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`rounded-3xl bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-all duration-500 ${hover ? 'hover:shadow-xl hover:shadow-slate-200/50 hover:scale-[1.01]' : ''} ${className}`}>
      {children}
    </div>
  );
};
