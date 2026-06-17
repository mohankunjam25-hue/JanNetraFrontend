import React, { useState, useRef } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'bottom' }) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTip = () => {
    timeoutRef.current = setTimeout(() => {
      setActive(true);
    }, 500); // 0.5 second delay
  };

  const hideTip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActive(false);
  };

  const positions = {
    top: 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2',
    bottom: 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2',
    left: 'right-[calc(100%+10px)] top-1/2 -translate-y-1/2',
    right: 'left-[calc(100%+10px)] top-1/2 -translate-y-1/2',
  };

  return (
    <div 
      className="inline-flex relative items-center justify-center"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active && (
        <div className={`absolute rounded-md px-2 py-1 text-white bg-[#616161e6] text-xs font-sans whitespace-nowrap z-[2000] pointer-events-none animate-in fade-in duration-200 ${positions[position]}`}>
          {text}
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-[5px] border-transparent ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-[#616161e6]' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-[#616161e6]' :
            ''
          }`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
