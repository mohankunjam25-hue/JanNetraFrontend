import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accounts, switchAccount, removeAccount, logout, setIsAddingAccount } = useAppStore();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const menuItems = [
    { icon: 'fi-rr-home', label: 'Home', path: '/' },
    { divider: true },
    { label: 'Administrative', header: true },
    { icon: 'fi-rr-stats', label: 'Analytics', path: '/analytics' },
    { icon: 'fi-rr-book-alt', label: 'Learning Schemes', path: '/schemes' },
    { icon: 'fi-rr-newspaper', label: 'News', path: '/news' },
    { divider: true },
    { label: 'Social & Activity', header: true },
    { icon: 'fi-rr-comment', label: 'Messages', path: '/chats' },
    { icon: 'fi-rr-bolt', label: 'Buzz', path: '/buzz' },
    { icon: 'fi-rr-flame', label: 'Trending', path: '/trending' },
    { icon: 'fi-rr-time-past', label: 'History', path: '/history' },
  ];

  return (
    <aside className="fixed top-12 left-0 bottom-0 w-[64px] hover:w-[240px] bg-main-bg flex flex-col z-[1000] border-r border-main-border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-2xl hover:shadow-black/5 group">
      <style>{`
        .sidebar-scroll::-webkit-scrollbar { display: none; } 
        .sidebar-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .scroll-mask {
          mask-image: linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent);
        }
      `}</style>
      
      <div className="flex-1 overflow-y-auto sidebar-scroll scroll-mask py-4 px-1.5">
        {menuItems.map((item, index) => {
          if (item.divider) return <hr key={index} className="border-none border-t border-main-border my-2 w-full" />;
          if (item.header) return (
            <h3 key={index} className="px-3 py-1.5 text-[10px] font-bold text-muted-text uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {item.label}
            </h3>
          );
          
          const isActive = location.pathname === item.path;
          
          return (
            <React.Fragment key={index}>
              <div 
                className={`flex items-center p-2.5 mb-0.5 rounded-lg cursor-pointer transition-all duration-200 min-w-[180px] ${isActive ? 'bg-accent/10 text-accent font-bold' : 'text-muted-text hover:bg-surface-bg hover:text-main-text'}`}
                onClick={() => item.path && navigate(item.path)}
              >
                <span className="w-5 flex justify-center mr-4 shrink-0">
                  <i className={`fi ${item.icon} flex items-center text-lg`}></i>
                </span>
                <span className="text-[13px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              
              {/* Latest Updates Section (Only for Home item when sidebar expanded) */}
              {item.label === 'Home' && (
                <div className="hidden group-hover:block ml-4 pl-4 border-l border-main-border my-2 space-y-3 animate-in fade-in slide-in-from-left-2 duration-500">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Latest Updates</p>
                  
                  {[
                    { label: 'India', area: 'National', color: 'text-orange-500', icon: 'fi-rr-world' },
                    { label: user?.state || 'State', area: 'State-wide', color: 'text-blue-500', icon: 'fi-rr-map-marker' },
                    { label: user?.district || 'District', area: 'Local', color: 'text-emerald-500', icon: 'fi-rr-marker' }
                  ].map((update, idx) => (
                    <div key={idx} className="flex gap-3 items-start group/update cursor-pointer hover:bg-white/5 p-1.5 rounded-xl transition-all">
                      <div className={`w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 border border-white/5`}>
                        <i className={`fi ${update.icon} text-[10px] ${update.color}`}></i>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black text-white truncate tracking-tight">{update.label}</span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">{update.area} Update</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Account Switcher Section */}
      <div className="mt-auto pt-2 border-t border-main-border relative">
        {isAccountMenuOpen && (
          <div className="absolute bottom-16 left-2 w-[220px] bg-main-bg border border-main-border rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 z-[1200]">
            <p className="px-3 py-2 text-[10px] font-black text-muted-text uppercase tracking-widest">Switch Account</p>
            {accounts.map((acc) => (
              <div 
                key={acc._id}
                className="flex items-center justify-between group/acc p-2 rounded-xl hover:bg-surface-bg cursor-pointer transition-all"
                onClick={() => {
                  switchAccount(acc._id);
                  setIsAccountMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                    {acc.avatar ? <img src={`${import.meta.env.VITE_API_URL}${acc.avatar}`} className="w-full h-full object-cover" /> : acc.fullName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-main-text truncate max-w-[100px]">{acc.fullName}</span>
                    <span className="text-[9px] text-muted-text">@{acc.username}</span>
                  </div>
                </div>
                {user?._id === acc._id ? (
                  <i className="fi fi-rr-check text-accent text-xs"></i>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAccount(acc._id);
                    }}
                    className="opacity-0 group-hover/acc:opacity-100 p-1.5 hover:text-red-500 transition-all"
                  >
                    <i className="fi fi-rr-trash text-xs"></i>
                  </button>
                )}
              </div>
            ))}
            <hr className="border-main-border my-2" />
            <button 
              onClick={() => {
                setIsAddingAccount(true);
                navigate('/login');
                setIsAccountMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-muted-text hover:bg-surface-bg transition-all text-xs font-bold"
            >
              <i className="fi fi-rr-plus-small text-lg"></i> Add Existing Account
            </button>
            <button 
              onClick={() => {
                logout();
                setIsAccountMenuOpen(false);
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all text-xs font-bold"
            >
              <i className="fi fi-rr-exit text-lg rotate-180"></i> Logout All
            </button>
          </div>
        )}

        <div 
          className={`flex items-center p-2.5 rounded-xl cursor-pointer transition-all duration-200 min-w-[220px] ${isAccountMenuOpen ? 'bg-surface-bg' : 'hover:bg-surface-bg'}`}
          onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shrink-0 overflow-hidden">
            {user?.avatar ? <img src={`${import.meta.env.VITE_API_URL}${user.avatar}`} className="w-full h-full object-cover" /> : (user?.fullName?.charAt(0) || 'U')}
          </div>
          <div className="ml-4 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            <span className="text-xs font-black text-main-text leading-none mb-1">{user?.fullName || 'Citizen'}</span>
            <span className="text-[10px] text-muted-text font-bold">Account Switcher</span>
          </div>
          <i className="fi fi-rr-menu-dots-vertical ml-auto opacity-0 group-hover:opacity-100 text-muted-text text-xs"></i>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
