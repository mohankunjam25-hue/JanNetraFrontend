import React from 'react';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-white hover:text-accent transition-colors">
          <i className="fi fi-rr-angle-left text-xl flex items-center"></i>
        </button>
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">Settings</h2>
      </div>

      <div className="space-y-2">
        {[
          { label: 'Account Settings', icon: 'fi-rr-user' },
          { label: 'Privacy Settings', icon: 'fi-rr-lock' },
          { label: 'Notification Settings', icon: 'fi-rr-bell' },
          { label: 'Appearance', icon: 'fi-rr-eye', value: 'Dark' },
          { label: 'Language', icon: 'fi-rr-globe', value: 'English' },
          { label: 'Logout', icon: 'fi-rr-exit', color: 'text-red-500' }
        ].map(item => (
          <button key={item.label} className="w-full flex items-center justify-between p-5 hover:bg-slate-900 rounded-[24px] transition-all group">
            <div className="flex items-center gap-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border border-slate-800 group-hover:border-accent/30 transition-all ${item.color || 'text-slate-400 group-hover:text-accent'}`}>
                <i className={`fi ${item.icon} text-lg`}></i>
              </div>
              <span className={`font-bold ${item.color || 'text-white'}`}>{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.value && <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.value}</span>}
              <i className="fi fi-rr-angle-small-right text-slate-700"></i>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Settings;
