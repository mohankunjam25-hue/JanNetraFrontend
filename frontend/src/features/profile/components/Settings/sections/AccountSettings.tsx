import React, { useState } from 'react';
import { useAppStore } from '../../../../../store/appStore';
import { SettingsSectionWrapper } from '../SettingsShared';
import { updateAccountApi } from '../../../../../api/user.api';
import toast from 'react-hot-toast';

const CATEGORIES = ["Citizen", "Student", "Professional", "Social Worker", "Politician", "Business Owner", "Other"];
const CAREERS = ["Teaching", "Business", "Politics", "Government Service", "Agriculture", "Healthcare", "Engineering", "Media", "Other"];
const INTERESTS = ["Business", "Politics", "Education", "Learning", "Entertainment", "Technology", "Social Issues", "Environment", "Sports"];

const AccountSettings: React.FC = () => {
  const { user, updateProfile } = useAppStore();
  
  const [activeSubView, setActiveSubView] = useState<'main' | 'profile-update' | 'password' | 'delete'>('main');
  const [isAccountExpanded, setIsAccountExpanded] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    category: user?.category || 'Citizen',
    career: user?.career || [],
    interests: user?.interests || [],
    profileImage: user?.avatar || null
  });

  const [isSaving, setIsLoading] = useState(false);

  const handleToggleArray = (field: 'career' | 'interests', value: string) => {
    setFormData(prev => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(i => i !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSaveProfile = async () => {
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!formData.category) return toast.error("Category is required");

    setIsLoading(true);
    try {
      const result = await updateAccountApi({
        fullName: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        category: formData.category,
        career: formData.career,
        interests: formData.interests
      });

      if (result.success) {
        updateProfile(result.data);
        toast.success('Profile updated successfully!');
        setActiveSubView('main');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (activeSubView === 'profile-update') {
    return (
      <SettingsSectionWrapper title="Profile Update" desc="Update your public identity on JanNetra.">
        <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-300">
          
          {/* Full Name & Username */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-all text-sm" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">@</span>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-3 text-white focus:border-accent outline-none transition-all text-sm" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Bio</label>
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-all text-sm h-28 resize-none leading-relaxed" 
              placeholder="Tell the community about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            ></textarea>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Identity Category</label>
            <select 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-accent outline-none transition-all text-sm appearance-none cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Career Multi-Select */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Career Fields (Select Multiple)</label>
            <div className="flex flex-wrap gap-2">
              {CAREERS.map(item => (
                <button
                  key={item}
                  onClick={() => handleToggleArray('career', item)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.career.includes(item) ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Multi-Select */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Interests (Select Multiple)</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(item => (
                <button
                  key={item}
                  onClick={() => handleToggleArray('interests', item)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.interests.includes(item) ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => setActiveSubView('main')}
              className="flex-1 py-4 bg-slate-900 border border-slate-800 text-slate-400 font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex-[2] py-4 bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Synchronizing...' : 'Save & Update Profile'}
            </button>
          </div>
        </div>
      </SettingsSectionWrapper>
    );
  }

  if (activeSubView === 'password') {
    return (
      <SettingsSectionWrapper title="Change Password" desc="Update your security credentials.">
        <div className="p-6 space-y-4">
          <input type="password" placeholder="Current Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
          <input type="password" placeholder="New Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
          <input type="password" placeholder="Confirm New Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-accent outline-none" />
          <div className="flex gap-3 pt-4">
            <button onClick={() => setActiveSubView('main')} className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl uppercase tracking-widest text-xs">Cancel</button>
            <button onClick={() => setActiveSubView('main')} className="flex-[2] py-3 bg-accent text-white font-bold rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-accent/20">Update Password</button>
          </div>
        </div>
      </SettingsSectionWrapper>
    );
  }

  if (activeSubView === 'delete') {
    return (
      <SettingsSectionWrapper title="Delete Account" desc="This action is permanent and cannot be undone.">
        <div className="p-6 text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">
            <i className="fi fi-rr-warning"></i>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Deleting your account will remove all your Voice posts, Allies connections, and Governance data. Please type your password to confirm.
          </p>
          <input type="password" placeholder="Confirm Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none" />
          <div className="flex gap-3">
            <button onClick={() => setActiveSubView('main')} className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl uppercase tracking-widest text-xs">Keep Account</button>
            <button className="flex-[2] py-3 bg-red-600 text-white font-bold rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-red-600/20">Delete Permanently</button>
          </div>
        </div>
      </SettingsSectionWrapper>
    );
  }

  return (
    <SettingsSectionWrapper title="Account" desc="Manage and update your personal information.">
      <div className="p-4 space-y-4">
        
        {/* Profile Header Summary */}
        <div className="flex items-center gap-6 p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 mb-4">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex items-center justify-center shadow-lg">
            {user?.avatar ? <img src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL}${user.avatar}`} className="w-full h-full object-cover" alt="" /> : <span className="text-2xl font-black text-white">{user?.fullName?.charAt(0)}</span>}
          </div>
          <div className="flex-1">
            <h4 className="text-white font-black text-lg">{user?.fullName}</h4>
            <p className="text-xs text-slate-500">@{user?.username}</p>
            <div className="mt-2 flex gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">{user?.category || 'Citizen'}</span>
            </div>
          </div>
        </div>

        {/* Collapsible Account Section */}
        <div className="border border-slate-800 rounded-3xl overflow-hidden">
          <button 
            onClick={() => setIsAccountExpanded(!isAccountExpanded)}
            className="w-full flex items-center justify-between p-5 bg-slate-900/30 hover:bg-slate-900/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <i className="fi fi-rr-user text-lg"></i>
              </div>
              <div className="text-left">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Account Details</h4>
                <p className="text-[10px] text-slate-500 font-medium">Profile, category, and career info</p>
              </div>
            </div>
            <i className={`fi fi-rr-angle-small-${isAccountExpanded ? 'up' : 'down'} text-slate-500 text-xl`}></i>
          </button>

          {isAccountExpanded && (
            <div className="p-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
              <button 
                onClick={() => setActiveSubView('profile-update')}
                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <i className="fi fi-rr-edit text-slate-500 group-hover:text-accent transition-colors"></i>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">Profile Update</span>
                </div>
                <i className="fi fi-rr-angle-small-right text-slate-600"></i>
              </button>
              
              <button onClick={() => setActiveSubView('password')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800 transition-all group">
                <div className="flex items-center gap-4">
                  <i className="fi fi-rr-lock text-slate-500 group-hover:text-accent transition-colors"></i>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">Security & Password</span>
                </div>
                <i className="fi fi-rr-angle-small-right text-slate-600"></i>
              </button>

              <button onClick={() => setActiveSubView('delete')} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-500/5 transition-all group">
                <div className="flex items-center gap-4">
                  <i className="fi fi-rr-trash text-slate-500 group-hover:text-red-500 transition-colors"></i>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-red-500 transition-colors uppercase tracking-widest">Deactivate Account</span>
                </div>
                <i className="fi fi-rr-angle-small-right text-slate-600"></i>
              </button>
            </div>
          )}
        </div>

      </div>
    </SettingsSectionWrapper>
  );
};

export default AccountSettings;
