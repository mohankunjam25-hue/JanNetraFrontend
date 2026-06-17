import React from 'react';
import { useAppStore } from '../../../../../store/appStore';
import { SettingsSectionWrapper } from '../SettingsShared';

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useAppStore();

  const themes = [
    {
      id: 'light',
      label: 'Light Mode',
      icon: 'fi-rr-sun',
      desc: 'Clean and bright interface, ideal for daylight.'
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      icon: 'fi-rr-moon',
      desc: 'Reduced eye strain in low-light environments.'
    },
    {
      id: 'system',
      label: 'System Preference',
      icon: 'fi-rr-computer',
      desc: 'Automatically sync with your device settings.'
    }
  ];

  return (
    <SettingsSectionWrapper title="Appearance" desc="Customize how JanNetra looks on your device.">
      <div className="p-4 space-y-6">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Select Theme</h4>
        
        <div className="grid grid-cols-1 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              className={`flex items-center gap-6 p-5 rounded-[24px] border transition-all text-left group ${
                theme === t.id 
                  ? 'bg-accent/5 border-accent shadow-lg shadow-accent/5' 
                  : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                theme === t.id ? 'bg-accent text-white shadow-xl shadow-accent/40' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'
              }`}>
                <i className={`fi ${t.icon} text-2xl`}></i>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className={`font-black text-sm uppercase tracking-widest ${theme === t.id ? 'text-white' : 'text-slate-400'}`}>
                    {t.label}
                  </h5>
                  {theme === t.id && <i className="fi fi-rr-check-circle text-accent text-lg"></i>}
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-950/50 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <i className="fi fi-rr-info"></i>
           </div>
           <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
             Theme settings are applied instantly across all open tabs of JanNetra on this browser.
           </p>
        </div>
      </div>
    </SettingsSectionWrapper>
  );
};

export default AppearanceSettings;
