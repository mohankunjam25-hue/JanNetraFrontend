import React from 'react';
import { useAppStore } from '../../../store/appStore';

export const PostGrid: React.FC = () => {
  const userPosts = useAppStore((state) => state.userPosts);
  
  if (userPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <i className="fi fi-rr-comment-slash text-4xl text-slate-700"></i>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No voices shared yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {userPosts.map((post) => {
        const mediaUrl = post.mediaUrls?.[0] || (post.media?.[0]?.url);
        const fullMediaUrl = mediaUrl?.startsWith('http') ? mediaUrl : `${import.meta.env.VITE_API_URL}${mediaUrl}`;
        
        return (
          <div key={post._id} className="aspect-square bg-slate-900 border border-slate-800 rounded-lg md:rounded-[24px] overflow-hidden group cursor-pointer relative shadow-sm">
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-700">
              {mediaUrl ? (
                <img src={fullMediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              ) : (
                <div className="p-4 text-center">
                  <p className="text-[8px] md:text-[10px] text-slate-500 line-clamp-3 font-bold uppercase tracking-tighter">{post.content}</p>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 md:gap-6 text-white font-black text-[10px] md:text-sm">
              <span className="flex items-center gap-1 md:gap-2"><i className="fi fi-sr-heart text-red-500"></i> {post.appreciationsCount}</span>
              <span className="flex items-center gap-1 md:gap-2"><i className="fi fi-sr-comment text-blue-500"></i> {post.commentsCount}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const VideoGrid: React.FC = () => {
  const profileVideos = useAppStore((state) => state.profileVideos);

  if (profileVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <i className="fi fi-rr-play-alt text-4xl text-slate-700"></i>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No videos uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {profileVideos.map((video) => {
        const videoUrl = video.mediaUrls?.[0] || (video.media?.[0]?.url);
        const fullVideoUrl = videoUrl?.startsWith('http') ? videoUrl : `${import.meta.env.VITE_API_URL}${videoUrl}`;

        return (
          <div key={video._id} className="aspect-[9/16] bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden relative group cursor-pointer shadow-lg">
            <video src={fullVideoUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" muted />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <i className="fi fi-sr-play text-white/40 text-4xl group-hover:scale-125 transition-transform"></i>
            </div>
            <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white font-black text-sm drop-shadow-md">
              <i className="fi fi-sr-play flex items-center text-xs"></i> {video.sharesCount || 0}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const SavedItems: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
    {[
      { title: 'Saved Schemes', count: 12, icon: 'fi-rr-document', color: 'text-orange-500' },
      { title: 'Followed Leaders', count: 8, icon: 'fi-rr-users', color: 'text-blue-500' },
      { title: 'Saved Districts', count: 3, icon: 'fi-rr-marker', color: 'text-green-500' },
      { title: 'Village Updates', count: 15, icon: 'fi-rr-home', color: 'text-accent' }
    ].map(item => (
      <div key={item.title} className="p-8 bg-slate-900/40 border border-slate-800 rounded-[32px] flex items-center justify-between hover:border-accent/40 transition-all cursor-pointer group shadow-sm">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-[20px] bg-slate-800 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all shadow-md ${item.color}`}>
            <i className={`fi ${item.icon} text-2xl`}></i>
          </div>
          <div>
            <h4 className="text-white font-black text-lg">{item.title}</h4>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.15em] mt-1">{item.count} items</p>
          </div>
        </div>
        <i className="fi fi-rr-angle-right text-slate-700 group-hover:text-accent transition-all group-hover:translate-x-2"></i>
      </div>
    ))}
  </div>
);

export const InfoSection: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto">
    <div className="space-y-8">
      <h3 className="text-xl font-black text-white border-b border-slate-900 pb-5 flex items-center gap-3">
        <i className="fi fi-rr-info text-accent"></i> Administrative Info
      </h3>
      <div className="space-y-4">
        {[
          { label: 'State', value: 'Jharkhand' },
          { label: 'District', value: 'Ranchi' },
          { label: 'Block', value: 'Kanke' },
          { label: 'Village', value: 'Mesra' }
        ].map(item => (
          <div key={item.label} className="flex justify-between items-center p-5 bg-slate-900/20 rounded-[20px] border border-slate-800/50 hover:border-accent/20 transition-all">
            <span className="text-slate-500 font-black text-[11px] uppercase tracking-widest">{item.label}</span>
            <span className="text-white font-black tracking-tight">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="space-y-10">
      <div>
        <h3 className="text-xl font-black text-white border-b border-slate-900 pb-5 mb-8">Social Metrics</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-8 bg-accent/5 border border-accent/10 rounded-[32px] text-center group hover:bg-accent/10 transition-all">
            <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-2">Contribution</p>
            <p className="text-4xl font-black text-white tracking-tighter">850</p>
          </div>
          <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[32px] text-center group hover:bg-blue-500/10 transition-all">
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-2">Reputation</p>
            <p className="text-4xl font-black text-white tracking-tighter italic">4.9</p>
          </div>
        </div>
      </div>
      <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[32px]">
        <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Followed Topics</h4>
        <div className="flex flex-wrap gap-3">
          {['Education', 'Infrastructure', 'Healthcare', 'Farmers', 'Startups', 'Roads'].map(topic => (
            <span key={topic} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-black rounded-full border border-slate-700 transition-colors cursor-pointer uppercase tracking-wider">{topic}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);
