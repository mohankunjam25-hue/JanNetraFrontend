import React from 'react';

interface ProfileHeaderProps {
  user: any; // The user whose profile is being viewed
  isOwnProfile: boolean;
  profileImage: string | null;
  onEditClick: () => void;
  onSettingsClick: () => void;
  onChampionsClick: () => void;
  onAlliesClick: () => void;
  onAllyToggle: () => void;
  onBlockToggle: () => void;
  onShareClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user,
  isOwnProfile,
  profileImage, 
  onEditClick, 
  onSettingsClick, 
  onChampionsClick, 
  onAlliesClick,
  onAllyToggle,
  onBlockToggle,
  onShareClick
}) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const displayImage = profileImage || (user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`) : null);
  const displayName = user?.fullName || 'Citizen';
  const displayUsername = user?.username || 'username';
  const isVerified = user?.isVerified || false;
  
  const stats = {
    voice: user?.voiceCount || 0,
    champions: user?.championsCount || 0,
    allies: user?.alliesCount || 0,
  };

  const formatStat = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start mb-10 px-4 pt-8">
      {/* Profile Photo */}
      <div className="relative group shrink-0">
        <div className="w-32 h-32 md:w-44 md:h-44 bg-slate-900 rounded-full border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl transition-transform hover:scale-[1.02]">
          {displayImage ? (
            <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl font-black text-white">{displayName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        {isOwnProfile && (
          <button 
            onClick={onEditClick}
            className="absolute bottom-1 right-1 bg-accent p-2.5 rounded-full border-4 border-slate-950 text-white shadow-lg hover:scale-110 transition-all"
          >
            <i className="fi fi-rr-camera flex items-center"></i>
          </button>
        )}
      </div>

      {/* Profile Info & Stats */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white tracking-tight">{displayName}</h2>
            {isVerified && <i className="fi fi-sr-badge-check text-blue-500 text-xl"></i>}
          </div>
          <span className="text-slate-500 text-lg font-bold">@{displayUsername}</span>
          
          <div className="flex gap-2 ml-0 md:ml-4">
            {isOwnProfile ? (
              <>
                <button 
                  onClick={onEditClick}
                  className="px-6 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-slate-800"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={onSettingsClick}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all border border-slate-800">
                  <i className="fi fi-rr-settings flex items-center"></i>
                </button>
              </>
            ) : (
              <button 
                onClick={onAllyToggle}
                className={`px-8 py-2 text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all ${user?.isAlly ? 'bg-slate-800 text-white border border-slate-700' : 'bg-accent text-white shadow-accent/20 hover:scale-105'}`}
              >
                {user?.isAlly ? 'Ally' : 'Become Ally'}
              </button>
            )}
            <button 
              onClick={onShareClick}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all border border-slate-800"
            >
              <i className="fi fi-rr-share flex items-center"></i>
            </button>
            {!isOwnProfile && (
              <button 
                onClick={onBlockToggle}
                className={`px-3 py-1.5 rounded-xl transition-all border ${user?.isBlocked ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-slate-900 hover:bg-red-500/10 hover:text-red-500 text-slate-500 border-slate-800'}`}
                title={user?.isBlocked ? "Unblock User" : "Block User"}
              >
                <i className={`fi ${user?.isBlocked ? 'fi-sr-ban' : 'fi-rr-ban'} flex items-center`}></i>
              </button>
            )}
          </div>
        </div>

        {/* Category & Career Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-accent bg-accent/5 px-3 py-1 rounded-lg border border-accent/20">
            <i className="fi fi-rr-user-tag mr-2"></i>
            {user?.category || 'Citizen'}
          </span>
          {(user?.career || []).map((c: string) => (
            <span key={c} className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              {c}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-8 md:gap-12 mb-6 border-y border-slate-900/50 md:border-none py-4 md:py-0 w-full md:w-auto justify-center md:justify-start">
          <div className="flex flex-col md:flex-row md:gap-1.5 items-center">
            <span className="font-black text-white">{formatStat(stats.voice)}</span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Voices</span>
          </div>
          <button 
            onClick={onAlliesClick}
            className="flex flex-col md:flex-row md:gap-1.5 items-center hover:text-accent transition-all"
          >
            <span className="font-black text-white">{formatStat(stats.allies)}</span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Allies</span>
          </button>
          <button 
            onClick={onChampionsClick}
            className="flex flex-col md:flex-row md:gap-1.5 items-center hover:text-accent transition-all"
          >
            <span className="font-black text-white">{formatStat(stats.champions)}</span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Champions</span>
          </button>
        </div>

        {/* Bio */}
        <div className="max-w-md px-4 md:px-0">
          <p className="text-slate-400 text-sm leading-relaxed mb-4 text-center md:text-left font-medium">
            {user?.bio || 'JanNetra Citizen passionate about governance and development.'}
          </p>
          <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-1 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                <i className="fi fi-rr-marker text-accent"></i>
                {user?.district}, {user?.state}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
            {(user?.interests || []).map((tag: string) => (
              <span key={tag} className="text-[10px] font-black text-accent hover:underline cursor-pointer uppercase tracking-tighter">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
