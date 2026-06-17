import React from 'react';
import SettingsItem, { SettingsSectionWrapper } from '../SettingsShared';

const CivicPreferences: React.FC = () => (
  <SettingsSectionWrapper title="Civic Preferences" desc="Unique governance-focused settings.">
    <SettingsItem label="Follow PM Updates" type="toggle" value="on" icon="fi-rr-bank" />
    <SettingsItem label="Follow CM Updates" type="toggle" value="on" icon="fi-rr-building" />
    <SettingsItem label="Follow MLA Updates" type="toggle" value="on" icon="fi-rr-portrait" />
    <SettingsItem label="Scheme Announcements" type="toggle" value="on" icon="fi-rr-document" />
    <SettingsItem label="Development Project Alerts" type="toggle" value="on" icon="fi-rr-settings-sliders" />
  </SettingsSectionWrapper>
);

export default CivicPreferences;
