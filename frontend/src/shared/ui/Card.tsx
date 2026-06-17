import React from 'react';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  padding = 'md',
  interactive = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-xl";
  const interactiveStyles = interactive ? "hover:shadow-2xl transition-all duration-300" : "";
  
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  return (
    <article className={`${baseStyles} ${interactiveStyles} ${paddings[padding]} ${className}`} {...props}>
      {children}
    </article>
  );
};

// Sub-components for Card structure
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-800/50 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`pt-4 border-t border-slate-50 dark:border-slate-800/50 mt-4 ${className}`}>
    {children}
  </div>
);
