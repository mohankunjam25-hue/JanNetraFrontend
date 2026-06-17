import React, { useState } from 'react';
import { useAppStore } from '../../../store/appStore';
import { updateAccountApi } from '../../../api/user.api';
import toast from 'react-hot-toast';

interface EditProfileProps {
  onBack: () => void;
  profileImage: string | null;
  triggerFileInput: () => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const EditProfile: React.FC<EditProfileProps> = ({ 
  onBack, 
  profileImage, 
  triggerFileInput, 
  handleImageChange, 
  fileInputRef 
}) => {
  const user = useAppStore((state) => state.user);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    mobile: user?.mobile || '',
    socialLinks: {
        x: user?.socialLinks?.x || '',
        facebook: user?.socialLinks?.facebook || '',
        instagram: user?.socialLinks?.instagram || '',
        linkedin: user?.socialLinks?.linkedin || '',
        website: user?.socialLinks?.website || '',
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const result = await updateAccountApi(formData);
      if (result.success) {
        updateProfile(result.data);
        toast.success("Profile updated successfully!");
        onBack();
      }
    } catch (error) {
      console.error("Save Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const avatarSrc = profileImage || (user?.avatar ? `${API_URL}${user.avatar}` : null);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-10">
        <button onClick={onBack} className="text-white hover:text-accent flex items-center gap-2 font-bold transition-colors">
          <i className="fi fi-rr-angle-left flex items-center text-lg"></i> Back
        </button>
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">Edit Profile</h2>
        <button 
          onClick={handleSave} 
          disabled={isLoading}
          className="text-accent font-black uppercase tracking-widest text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Profile Photo */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative group mb-4">
          <div className="w-24 h-24 bg-slate-800 rounded-full border-2 border-slate-700 overflow-hidden flex items-center justify-center shadow-xl">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-white">{(user?.fullName || 'V').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div 
            onClick={triggerFileInput}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
          >
            <i className="fi fi-rr-camera text-white text-xl"></i>
          </div>
        </div>
        <button onClick={triggerFileInput} className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline transition-all">Change Profile Photo</button>
        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Full Identity Name</label>
          <input 
            type="text" 
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white font-medium focus:border-accent outline-none transition-all text-sm shadow-inner" 
            value={formData.fullName} 
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Citizen Bio</label>
          <textarea 
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white font-medium focus:border-accent outline-none transition-all h-24 resize-none leading-relaxed text-sm shadow-inner" 
            value={formData.bio}
            placeholder="Tell your story..."
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
          ></textarea>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'x', icon: 'fi-brands-twitter-alt', label: 'X (Twitter)' },
            { id: 'facebook', icon: 'fi-brands-facebook', label: 'Facebook' },
            { id: 'instagram', icon: 'fi-brands-instagram', label: 'Instagram' },
            { id: 'linkedin', icon: 'fi-brands-linkedin', label: 'LinkedIn' }
          ].map((social) => (
            <div key={social.id}>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">{social.label}</label>
              <div className="relative">
                <i className={`fi ${social.icon} absolute left-5 top-1/2 -translate-y-1/2 text-slate-500`}></i>
                <input 
                  type="text" 
                  placeholder="URL or handle"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-accent outline-none transition-all text-xs font-bold"
                  value={(formData.socialLinks as any)[social.id]}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, [social.id]: e.target.value }
                  })}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">State</label>
            <input type="text" disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-500 text-sm opacity-60" value={user?.state} />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">District</label>
            <input type="text" disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-500 text-sm opacity-60" value={user?.district} />
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-slate-900 text-center">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
            JanNetra ID: {user?._id}
        </p>
      </div>
    </div>
  );
};

export default EditProfile;
