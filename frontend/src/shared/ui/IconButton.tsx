import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: 'ghost' | 'solid' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  variant = 'ghost', 
  size = 'md',
  isActive = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-full flex items-center justify-center transition-all";
  
  const variants = {
    ghost: `text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'text-accent bg-accent/10' : 'hover:text-slate-900 dark:hover:text-white'}`,
    solid: "bg-slate-900 text-white hover:bg-slate-800 shadow-md",
    danger: "text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500"
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-xl"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      <i className={`fi ${icon}`}></i>
    </button>
  );
};
