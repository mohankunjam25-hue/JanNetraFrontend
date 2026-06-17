import React from 'react';
import { SettingsSectionWrapper } from '../SettingsShared';

const InterestSettings: React.FC = () => (
  <SettingsSectionWrapper title="Interests" desc="Personalize your governance feed.">
    <div className="grid grid-cols-2 gap-3 p-2">
      {['Politics', 'Government Schemes', 'Education', 'Jobs', 'Development', 'Technology', 'Health', 'Agriculture', 'Environment', 'Local News'].map(interest => (
        <div key={interest} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-accent/30 transition-all cursor-pointer">
          <span className="text-white text-xs font-bold uppercase tracking-wider">{interest}</span>
          <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex items-center justify-center group-hover:border-accent">
            <div className="w-2.5 h-2.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      ))}
    </div>
  </SettingsSectionWrapper>
);

export default InterestSettings;
