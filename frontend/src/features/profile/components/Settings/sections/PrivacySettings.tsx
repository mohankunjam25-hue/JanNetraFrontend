import React, { useState } from 'react';
import { useAppStore } from '../../../../../store/appStore';
import SettingsItem, { SettingsSectionWrapper } from '../SettingsShared';
import { generate2FAApi, enable2FAApi } from '../../../../../api/user.api';
import toast from 'react-hot-toast';

const PrivacySettings: React.FC = () => {
  const { user, updateSettings } = useAppStore();
  const privacy = user?.settings?.privacy;
  
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isEnabling, setIsEnabling] = useState(false);

  const handleToggle = (key: string, currentValue: boolean) => {
    updateSettings({
      privacy: {
        ...privacy,
        [key]: !currentValue
      }
    });
  };

  const start2FASetup = async () => {
    if (user?.isTwoFactorEnabled) {
      toast.error("2FA is already enabled on this account.");
      return;
    }
    
    try {
      const result = await generate2FAApi();
      if (result.success) {
        setQrCodeUrl(result.data.qrCodeUrl);
        setSecretKey(result.data.secret);
        setShow2FAModal(true);
      }
    } catch (error) {
      console.error("2FA Generation Error:", error);
    }
  };

  const handleVerify2FA = async () => {
    if (otpCode.length !== 6) return toast.error("Enter a 6-digit code");
    setIsEnabling(true);
    try {
      const result = await enable2FAApi(otpCode);
      if (result.success) {
        toast.success("2FA enabled successfully!");
        setShow2FAModal(false);
        // Soft update UI state for the user
        useAppStore.setState(state => ({
          user: state.user ? { ...state.user, isTwoFactorEnabled: true } : null
        }));
      }
    } catch (error) {
      console.error("2FA Enable Error:", error);
    } finally {
      setIsEnabling(false);
    }
  };

  return (
    <>
      <SettingsSectionWrapper title="Privacy & Security" desc="Control profile visibility and security.">
        <SettingsItem 
          label="Public Profile" 
          desc="Visible to everyone" 
          type="toggle" 
          value={privacy?.isProfilePublic} 
          icon="fi-rr-eye"
          onClick={() => handleToggle('isProfilePublic', !!privacy?.isProfilePublic)}
        />
        <SettingsItem 
          label="Share Location" 
          desc="Show your area in posts" 
          type="toggle" 
          value={privacy?.showLocation} 
          icon="fi-rr-marker"
          onClick={() => handleToggle('showLocation', !!privacy?.showLocation)}
        />
        <SettingsItem label="Who Can Message Me" value="Allies" icon="fi-rr-comment" />
        <SettingsItem label="Blocked Users" value="0 users" icon="fi-rr-ban" />
        
        <SettingsItem 
          label="Two-Factor Authentication" 
          desc={user?.isTwoFactorEnabled ? "Enabled" : "Highly Recommended"} 
          icon="fi-rr-shield-check" 
          onClick={start2FASetup}
        />
        
        <SettingsItem label="Active Sessions" value="2 Devices" icon="fi-rr-devices" />
      </SettingsSectionWrapper>

      {show2FAModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-md w-full animate-in zoom-in-95">
            <div className="text-center mb-6">
              <i className="fi fi-rr-shield-check text-4xl text-accent mb-4 inline-block"></i>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">Enable 2FA</h2>
              <p className="text-slate-400 text-xs mt-2">Scan the QR code with Google Authenticator.</p>
            </div>
            
            {qrCodeUrl && (
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-2 rounded-xl mb-4">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Manual Code</p>
                <code className="bg-slate-950 px-4 py-2 rounded-lg text-accent text-xs font-mono mt-1 tracking-widest">
                  {secretKey}
                </code>
              </div>
            )}

            <div className="mb-6">
              <input 
                type="text" 
                maxLength={6}
                placeholder="Enter 6-digit code" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white text-center text-xl tracking-[0.5em] focus:border-accent outline-none font-black"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShow2FAModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleVerify2FA}
                disabled={isEnabling || otpCode.length !== 6}
                className="flex-[2] py-3 rounded-xl bg-accent text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isEnabling ? 'Verifying...' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacySettings;
