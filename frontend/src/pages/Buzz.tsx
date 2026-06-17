import React, { useRef, useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { fetchBuzzVideosApi, toggleAppreciationApi, sharePostApi } from '../api/post.api';
import toast from 'react-hot-toast';

interface BuzzVideo {
  _id: string;
  author: any;
  content: string;
  appreciationsCount: number;
  commentsCount: number;
  sharesCount: number;
  mediaUrls: string[];
  appreciations: string[];
}

const BuzzCard: React.FC<{ item: BuzzVideo }> = ({ item }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const user = useAppStore((state) => state.user);
  const toggleAppreciationLocally = useAppStore((state) => state.toggleAppreciationLocally);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Local state for immediate UI feedback before store update
  const [localAppreciated, setLocalAppreciated] = useState(item.appreciations?.includes(user?._id || ''));
  const [localAppreciationsCount, setLocalAppreciationsCount] = useState(item.appreciationsCount);
  const [localSharesCount, setLocalSharesCount] = useState(item.sharesCount || 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.7 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAppreciate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return toast.error("Please login to appreciate");

    const newStatus = !localAppreciated;
    const newCount = newStatus ? localAppreciationsCount + 1 : Math.max(0, localAppreciationsCount - 1);
    
    setLocalAppreciated(newStatus);
    setLocalAppreciationsCount(newCount);

    try {
      const result = await toggleAppreciationApi(item._id);
      if (result.success) {
        toggleAppreciationLocally(item._id, result.data.isAppreciated, result.data.appreciationsCount, user._id);
        setLocalAppreciated(result.data.isAppreciated);
        setLocalAppreciationsCount(result.data.appreciationsCount);
      } else {
        setLocalAppreciated(!newStatus);
        setLocalAppreciationsCount(localAppreciationsCount);
      }
    } catch (error) {
      setLocalAppreciated(!newStatus);
      setLocalAppreciationsCount(localAppreciationsCount);
      console.error("Buzz Appreciation Error:", error);
    }
  };

  const handleShare = async (type: 'internal' | 'whatsapp' | 'copy', e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await sharePostApi(item._id);
      if (result.success) {
        setLocalSharesCount(result.data.sharesCount);
        const postUrl = `${window.location.origin}/post/${item._id}`;
        
        if (type === 'copy') {
          await navigator.clipboard.writeText(postUrl);
          toast.success("Link copied!");
        } else if (type === 'whatsapp') {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(item.content + " " + postUrl)}`, '_blank');
        } else if (type === 'internal') {
          if (navigator.share) {
            await navigator.share({
                title: 'JanNetra Buzz',
                text: item.content,
                url: postUrl,
            });
          } else {
            await navigator.clipboard.writeText(postUrl);
            toast.success("Link Copied!");
          }
        }
      }
      setShowShareMenu(false);
    } catch (error) { 
      console.error("Share Error:", error);
      toast.error("Sharing failed");
    }
  };

  return (
    <div className="relative min-w-full h-full min-h-[calc(100vh-64px)] snap-start flex flex-col justify-end p-8 overflow-hidden bg-black group/card cursor-pointer" onClick={togglePlay}>
      {/* Video Content */}
      <video
        ref={videoRef}
        src={item.mediaUrls[0].startsWith('http') ? item.mediaUrls[0] : `${import.meta.env.VITE_API_URL}${item.mediaUrls[0]}`}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity duration-700"
        loop
        muted
        playsInline
      />

      {/* Glassmorphic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 animate-in zoom-in duration-300">
            <i className="fi fi-sr-play text-4xl text-white"></i>
          </div>
        </div>
      )}

      {/* Video Info Overlay */}
      <div className="relative z-10 flex flex-col gap-4 text-white pb-6 animate-in slide-in-from-left-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center overflow-hidden p-0.5 shadow-2xl">
             {item.author?.avatar ? (
               <img src={item.author.avatar.startsWith('http') ? item.author.avatar : `${import.meta.env.VITE_API_URL}${item.author.avatar}`} className="w-full h-full object-cover rounded-xl" />
             ) : (
               <span className="text-xl font-black">{item.author?.fullName?.charAt(0).toUpperCase()}</span>
             )}
          </div>
          <div>
            <h4 className="font-black text-base flex items-center gap-2 tracking-tight">
              {item.author?.fullName}
              <i className="fi fi-sr-badge-check text-accent text-xs"></i>
            </h4>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-70">@{item.author?.username}</span>
          </div>
          <button className="ml-2 px-4 py-1.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl">Follow</button>
        </div>
        
        <p className="text-sm text-slate-100 leading-relaxed max-w-[85%] font-medium drop-shadow-lg">
          {item.content}
        </p>

        <div className="flex items-center gap-3">
           <span className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest">
             <i className="fi fi-rr-marker text-accent"></i> Raipur, CG
           </span>
           <span className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest">
             <i className="fi fi-rr-music-alt"></i> Original Audio
           </span>
        </div>
      </div>

      {/* Right Side Actions - Innovative Vertical Bar */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={handleAppreciate}>
          <div className={`w-14 h-14 rounded-[20px] bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/10 transition-all hover:scale-110 active:scale-90 ${localAppreciated ? 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'text-white'}`}>
            <i className={`fi ${localAppreciated ? 'fi-sr-heart' : 'fi-rr-heart'} text-2xl`}></i>
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">{localAppreciationsCount}</span>
        </div>
        
        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <div className="w-14 h-14 rounded-[20px] bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/10 text-white transition-all hover:scale-110 active:scale-90">
            <i className="fi fi-rr-comment text-2xl"></i>
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">{item.commentsCount}</span>
        </div>

        <div className="relative flex flex-col items-center gap-1.5 group cursor-pointer">
          <div onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }} className="w-14 h-14 rounded-[20px] bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/10 text-white transition-all hover:scale-110 active:scale-90 cursor-pointer">
            <i className="fi fi-rr-paper-plane text-2xl"></i>
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">{localSharesCount}</span>
          {showShareMenu && (
            <div className="absolute bottom-16 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 flex flex-col gap-1 z-30 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button 
                onClick={(e) => handleShare('copy', e)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-xl text-left text-xs font-bold text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                <i className="fi fi-rr-copy flex items-center"></i> Copy Link
              </button>
              <button 
                onClick={(e) => handleShare('whatsapp', e)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-xl text-left text-xs font-bold text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                <i className="fi fi-brands-whatsapp text-emerald-500 flex items-center"></i> WhatsApp
              </button>
              <button 
                onClick={(e) => handleShare('internal', e)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-xl text-left text-xs font-bold text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                <i className="fi fi-rr-share flex items-center"></i> Share
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Buzz: React.FC = () => {
  const buzzVideos = useAppStore((state) => state.buzzVideos);
  const setBuzzVideos = useAppStore((state) => state.setBuzzVideos);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBuzz = async () => {
      setIsLoading(true);
      try {
        const result = await fetchBuzzVideosApi();
        if (result.success) {
          setBuzzVideos(result.data);
        }
      } catch (error) {
        console.error("Fetch Buzz Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBuzz();
  }, [setBuzzVideos]);

  if (isLoading && buzzVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Loading Buzz...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-[calc(100vh-64px)] overflow-y-scroll snap-y snap-mandatory scrollbar-none w-full max-w-[360px] mx-auto rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-800 bg-black relative">
      <style>{`.scrollbar-none::-webkit-scrollbar { display: none; }`}</style>
      {buzzVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-4">
          <i className="fi fi-rr-bolt text-4xl text-slate-700"></i>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No videos uploaded yet. Be the first!</p>
        </div>
      ) : (
        buzzVideos.map((item) => (
          <BuzzCard key={item._id} item={item} />
        ))
      )}
    </div>
  );
};

export default Buzz;
