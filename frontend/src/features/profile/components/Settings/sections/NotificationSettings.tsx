import React from 'react';
import { useAppStore } from '../../../../../store/appStore';
import SettingsItem, { SettingsSectionWrapper } from '../SettingsShared';

const NotificationSettings: React.FC = () => {
  const { user, updateSettings } = useAppStore();
  const notifications = user?.settings?.notifications;

  const handleToggle = (key: string, currentValue: boolean) => {
    updateSettings({
      notifications: {
        ...notifications,
        [key]: !currentValue
      }
    });
  };

  return (
    <SettingsSectionWrapper title="Notifications" desc="Manage platform and government alerts.">
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-4">Platform Interactions</h4>
      <SettingsItem 
        label="Appreciations" 
        type="toggle" 
        value={notifications?.appreciations} 
        icon="fi-rr-heart" 
        onClick={() => handleToggle('appreciations', !!notifications?.appreciations)}
      />
      <SettingsItem 
        label="Comments" 
        type="toggle" 
        value={notifications?.comments} 
        icon="fi-rr-comment" 
        onClick={() => handleToggle('comments', !!notifications?.comments)}
      />
      <SettingsItem 
        label="Replies" 
        type="toggle" 
        value={notifications?.replies} 
        icon="fi-rr-redo" 
        onClick={() => handleToggle('replies', !!notifications?.replies)}
      />
      <SettingsItem 
        label="Mentions" 
        type="toggle" 
        value={notifications?.mentions} 
        icon="fi-rr-at" 
        onClick={() => handleToggle('mentions', !!notifications?.mentions)}
      />
      <SettingsItem 
        label="Shares" 
        type="toggle" 
        value={notifications?.shares} 
        icon="fi-rr-paper-plane" 
        onClick={() => handleToggle('shares', !!notifications?.shares)}
      />
      <SettingsItem 
        label="Ally Activity" 
        type="toggle" 
        value={notifications?.allyActivity} 
        icon="fi-rr-users" 
        onClick={() => handleToggle('allyActivity', !!notifications?.allyActivity)}
      />
      
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-6">General Alerts</h4>
      <SettingsItem 
        label="Push Notifications" 
        type="toggle" 
        value={notifications?.pushNotifications} 
        icon="fi-rr-bullhorn"
        onClick={() => handleToggle('pushNotifications', !!notifications?.pushNotifications)}
      />
      <SettingsItem 
        label="Email Alerts" 
        desc="Critical updates via email" 
        type="toggle" 
        value={notifications?.emailAlerts} 
        icon="fi-rr-envelope"
        onClick={() => handleToggle('emailAlerts', !!notifications?.emailAlerts)}
      />
    </SettingsSectionWrapper>
  );
};

export default NotificationSettings;
