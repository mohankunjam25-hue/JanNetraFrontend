import React from 'react';

interface SettingsItemProps {
  label: string;
  desc?: string;
  icon?: string;
  type?: 'toggle' | 'link' | 'select' | 'button';
  value?: string | boolean;
  color?: string;
  onClick?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ label, desc, icon, type = 'link', value, color, onClick }) => {
  const isToggleOn = value === 'on' || value === true;

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-slate-900/50 rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-slate-800"
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800 group-hover:border-accent/30 transition-all ${color || 'text-slate-400 group-hover:text-accent'}`}>
            <i className={`fi ${icon} text-lg`}></i>
          </div>
        )}
        <div>
          <p className={`font-bold ${color || 'text-white'} text-sm`}>{label}</p>
          {desc && <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">{desc}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {type === 'toggle' && (
          <div className={`w-10 h-5 ${isToggleOn ? 'bg-accent/20' : 'bg-slate-800'} rounded-full relative p-1 transition-colors`}>
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isToggleOn ? 'bg-accent translate-x-5' : 'bg-slate-600'}`}></div>
          </div>
        )}
        {type === 'select' && <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{value}</span>}
        {type === 'link' && <i className="fi fi-rr-angle-small-right text-slate-700 group-hover:text-accent transition-all"></i>}
      </div>
    </div>
  );
};

interface SettingsSectionWrapperProps {
  title: string;
  desc?: string;
  children: React.ReactNode;
}

export const SettingsSectionWrapper: React.FC<SettingsSectionWrapperProps> = ({ title, desc, children }) => (
  <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-6 px-2">
      <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">{title}</h3>
      {desc && <p className="text-slate-500 text-sm font-medium mt-1">{desc}</p>}
    </div>
    <div className="bg-slate-900/20 border border-slate-800/50 rounded-[32px] p-2 space-y-1">
      {children}
    </div>
  </section>
);

export default SettingsItem;
