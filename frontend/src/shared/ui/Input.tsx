import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  leftIcon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <i className={`fi ${leftIcon} absolute left-4 top-1/2 -translate-y-1/2 text-slate-500`}></i>
        )}
        <input 
          className={`w-full bg-white dark:bg-slate-900/50 border ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-accent'} rounded-2xl ${leftIcon ? 'pl-12' : 'pl-4'} pr-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition-all shadow-inner ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
      )}
    </div>
  );
};
