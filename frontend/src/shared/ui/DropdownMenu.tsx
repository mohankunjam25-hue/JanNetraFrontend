import React, { useState, useRef, useEffect } from 'react';

export interface MenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right';
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, items, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className={`absolute top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 ${align === 'right' ? 'right-0' : 'left-0'}`}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-xs font-bold flex items-center gap-3 transition-colors ${
                item.variant === 'danger' 
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon && <i className={`fi ${item.icon}`}></i>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
