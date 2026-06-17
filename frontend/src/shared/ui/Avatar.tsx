import React from 'react';

interface AvatarProps {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  fallback, 
  size = 'md', 
  isVerified = false, 
  className = '',
  onClick
}) => {
  const sizes = {
    sm: "w-8 h-8 rounded-xl text-xs",
    md: "w-10 h-10 rounded-2xl text-sm",
    lg: "w-14 h-14 rounded-2xl text-lg",
    xl: "w-32 h-32 rounded-full text-4xl" // Profile header size
  };

  const API_URL = import.meta.env.VITE_API_URL || '';
  const displaySrc = src ? (src.startsWith('http') ? src : `${API_URL}${src}`) : null;

  return (
    <div className="relative inline-block">
      <div 
        onClick={onClick}
        className={`${sizes[size]} bg-accent text-white flex items-center justify-center font-black shadow-lg overflow-hidden ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
      >
        {displaySrc ? (
          <img src={displaySrc} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span>{fallback.charAt(0).toUpperCase()}</span>
        )}
      </div>
      {isVerified && (
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
          <i className="fi fi-sr-badge-check text-blue-500 text-[10px]"></i>
        </div>
      )}
    </div>
  );
};
