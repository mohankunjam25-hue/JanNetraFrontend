import React from 'react';
import SettingsItem, { SettingsSectionWrapper } from '../SettingsShared';

const LocationSettings: React.FC = () => (
  <SettingsSectionWrapper title="Location & Governance" desc="Manage area-based personalization.">
    <SettingsItem label="State" value="Jharkhand" icon="fi-rr-map" />
    <SettingsItem label="District" value="Ranchi" icon="fi-rr-building" />
    <SettingsItem label="Block" value="Kanke" icon="fi-rr-subway" />
    <SettingsItem label="Village" value="Mesra" icon="fi-rr-home" />
    <SettingsItem label="Follow Other States" value="2 States" icon="fi-rr-add" />
    <SettingsItem label="Change Location" desc="Update your primary area" icon="fi-rr-marker" color="text-accent" />
  </SettingsSectionWrapper>
);

export default LocationSettings;
