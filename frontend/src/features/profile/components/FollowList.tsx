import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { toggleAllyApi } from '../../../api/user.api';
import toast from 'react-hot-toast';

interface FollowListProps {
  type: 'champions' | 'allies';
  onBack: () => void;
}

const FollowList: React.FC<FollowListProps> = ({ type, onBack }) => {
  const navigate = useNavigate();
  const { champions, allies, user, updateProfile } = useAppStore();
  const list = type === 'champions' ? champions : allies;
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const goToProfile = (username: string) => {
    if (username) {
      navigate(`/profile/${username}`);
      onBack(); // Close the list view
    }
  };

  const handleToggleAlly = async (targetId: string) => {
    setLoadingId(targetId);
    try {
      const result = await toggleAllyApi(targetId);
      if (result.success) {
        toast.success(result.message);
        // Sync championsCount locally
        updateProfile({ 
          championsCount: result.data.isAlly 
            ? (user?.championsCount || 0) + 1 
            : Math.max(0, (user?.championsCount || 0) - 1) 
        });
      }
    } catch (error) {
      console.error("Toggle Ally Error:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredList = list.filter(item => 
    item.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-white hover:text-accent transition-colors">
          <i className="fi fi-rr-angle-left text-xl flex items-center"></i>
        </button>
        <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">{type}</h2>
      </div>

      <div className="relative mb-10">
        <i className="fi fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"></i>
        <input 
          type="text" 
          placeholder={`Search ${type}...`} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-[20px] pl-14 pr-6 py-4 text-white font-medium focus:border-accent outline-none transition-all shadow-inner" 
        />
      </div>

      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 rounded-[32px] border border-slate-800/50">
             <i className={`fi ${type === 'champions' ? 'fi-rr-star' : 'fi-rr-users'} text-4xl text-slate-700 mb-4 inline-block`}></i>
             <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No {type} found</p>
          </div>
        ) : (
          filteredList.map(item => (
            <div key={item._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-900/50 transition-all group">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => goToProfile(item.username)}>
                <div className="w-14 h-14 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                   {item.avatar ? (
                     <img src={item.avatar.startsWith('http') ? item.avatar : `${import.meta.env.VITE_API_URL}${item.avatar}`} className="w-full h-full object-cover" alt="" />
                   ) : (
                     item.fullName?.charAt(0).toUpperCase()
                   )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-black text-[15px]">{item.fullName}</p>
                    {item.isVerified && <i className="fi fi-sr-badge-check text-blue-500 text-xs"></i>}
                  </div>
                  <p className="text-slate-500 text-xs font-bold">@{item.username}</p>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-tighter mt-1">
                      <i className="fi fi-rr-marker text-[8px] mr-1 text-accent"></i>
                      {item.village || item.district}, {item.state}
                  </p>
                </div>
              </div>
              
              {item._id !== user?._id && (
                <button 
                  disabled={loadingId === item._id}
                  onClick={() => handleToggleAlly(item._id)}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    type === 'champions' 
                      ? 'bg-slate-800 text-white border border-slate-700 hover:bg-red-500/20 hover:text-red-500' 
                      : 'bg-accent text-white hover:opacity-90 shadow-lg shadow-accent/20'
                  }`}
                >
                  {loadingId === item._id ? '...' : (type === 'champions' ? 'Remove' : 'Ally')}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowList;
