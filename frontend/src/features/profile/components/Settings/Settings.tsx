import React, { useState } from 'react';
import AccountSettings from './sections/AccountSettings';
import PrivacySettings from './sections/PrivacySettings';
import LocationSettings from './sections/LocationSettings';
import CivicPreferences from './sections/CivicPreferences';
import NotificationSettings from './sections/NotificationSettings';
import InterestSettings from './sections/InterestSettings';
import AppearanceSettings from './sections/AppearanceSettings';
import LanguageSettings from './sections/LanguageSettings';
import VerificationSettings from './sections/VerificationSettings';

type SectionId = 'account' | 'privacy' | 'notifications' | 'location' | 'interests' | 'language' | 'appearance' | 'civic' | 'verification' | 'help';

const Settings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<SectionId>('account');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { label: 'Account', icon: 'fi-rr-user', id: 'account' as SectionId },
    { label: 'Identity Verification', icon: 'fi-sr-badge-check', id: 'verification' as SectionId },
    { label: 'Privacy', icon: 'fi-rr-lock', id: 'privacy' as SectionId },
    { label: 'Notifications', icon: 'fi-rr-bell', id: 'notifications' as SectionId },
    { label: 'Location', icon: 'fi-rr-marker', id: 'location' as SectionId },
    { label: 'Interests', icon: 'fi-rr-target', id: 'interests' as SectionId },
    { label: 'Language', icon: 'fi-rr-globe', id: 'language' as SectionId },
    { label: 'Appearance', icon: 'fi-rr-eye', id: 'appearance' as SectionId },
    { label: 'Governance', icon: 'fi-rr-bank', id: 'civic' as SectionId },
    { label: 'Help', icon: 'fi-rr-interrogation', id: 'help' as SectionId },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'account': return <AccountSettings />;
      case 'verification': return <VerificationSettings />;
      case 'privacy': return <PrivacySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'location': return <LocationSettings />;
      case 'interests': return <InterestSettings />;
      case 'language': return <LanguageSettings />;
      case 'appearance': return <AppearanceSettings />;
      case 'civic': return <CivicPreferences />;
      case 'help': return <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-900 rounded-[40px]">Help Center Coming Soon</div>;
      default: return <AccountSettings />;
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 px-4 py-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-72 shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-white hover:border-accent/30 transition-all shadow-lg">
              <i className="fi fi-rr-angle-left"></i>
            </button>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Settings</h2>
          </div>

          <div className="relative mb-6">
            <i className="fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search settings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-accent outline-none transition-all shadow-inner" 
            />
          </div>

          <nav className="space-y-1 max-h-[50vh] overflow-y-auto scrollbar-none pr-2">
            {filteredMenuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                  activeSection === item.id 
                    ? 'bg-accent/10 border border-accent/20 text-white shadow-xl shadow-accent/5' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <i className={`fi ${item.icon} text-lg ${activeSection === item.id ? 'text-accent' : 'group-hover:text-accent'}`}></i>
                <span className={`font-bold text-[12px] uppercase tracking-[0.15em] ${activeSection === item.id ? 'text-white' : ''}`}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-900">
            <button className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/5 rounded-2xl transition-all group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/5 border border-red-500/10 group-hover:border-red-500/30 transition-all">
                <i className="fi fi-rr-exit text-lg"></i>
              </div>
              <span className="font-black text-[12px] uppercase tracking-[0.15em]">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Focused Settings Content */}
      <div className="flex-1 max-w-2xl min-h-[60vh]">
        <div key={activeSection} className="animate-in fade-in slide-in-from-right-4 duration-500">
          {renderActiveSection()}
        </div>
      </div>

    </div>
  );
};

export default Settings;
