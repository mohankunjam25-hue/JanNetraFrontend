import React from 'react';
import SettingsItem, { SettingsSectionWrapper } from '../SettingsShared';

const LanguageSettings: React.FC = () => (
  <SettingsSectionWrapper title="Language" desc="Select your preferred language.">
    {['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'].map(lang => (
      <SettingsItem key={lang} label={lang} value={lang === 'English' ? 'Selected' : ''} color={lang === 'English' ? 'text-accent' : ''} icon="fi-rr-globe" />
    ))}
  </SettingsSectionWrapper>
);

export default LanguageSettings;
