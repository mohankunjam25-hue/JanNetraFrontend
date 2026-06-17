import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import Tooltip from '../shared/components/Tooltip';
import CreatePost from '../features/feed/components/CreatePost';
import NotificationDropdown from './NotificationDropdown';
import { fetchUnreadCountApi } from '../api/notification.api';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const user = useAppStore((state) => state.user);
  const { unreadNotificationsCount, setUnreadCount } = useAppStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const getUnreadCount = async () => {
        try {
          const result = await fetchUnreadCountApi();
          if (result.success) {
            setUnreadCount(result.data.unreadCount);
          }
        } catch (error) {
          console.error("Unread count error:", error);
        }
      };
      getUnreadCount();
      const interval = setInterval(getUnreadCount, 60000); // Polling every minute
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, setUnreadCount]);

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 h-12 bg-main-bg/80 backdrop-blur-md flex items-center justify-between px-4 z-[1100] border-b border-main-border shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Tooltip text="Menu" position="bottom">
          <button className="p-1.5 rounded-full hover:bg-surface-bg flex items-center justify-center text-main-text transition-colors">
            <i className="fi fi-rr-menu-burger flex items-center text-lg"></i>
          </button>
        </Tooltip>
        <div 
          className="flex items-center gap-1.5 font-extrabold text-lg text-main-text cursor-pointer select-none group" 
          onClick={() => navigate('/')}
        >
          <img src="/JanNetra.png" alt="JanNetra Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-200" />
          <span className="tracking-tighter">Jan<span className="text-accent">Netra</span></span>
        </div>
      </div>
      
      {isAuthenticated ? (
        <>
          <div className="hidden md:flex items-center gap-2 flex-[0_1_580px]">
            <div className="flex flex-1 border border-main-border rounded-xl overflow-hidden bg-surface-bg focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 transition-all duration-200">
              <input 
                type="text" 
                placeholder="Search resources, cases, or departments..." 
                className="flex-1 border-none px-4 py-1.5 text-xs bg-transparent text-main-text outline-none placeholder:text-muted-text" 
              />
              <Tooltip text="Search" position="bottom">
                <button className="bg-surface-bg border-l border-main-border px-4 flex items-center hover:bg-accent hover:text-white transition-all text-muted-text">
                  <i className="fi fi-rr-search flex items-center text-sm"></i>
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative">
            <div className="flex items-center border-r border-main-border pr-2 mr-1 gap-1">
              <Tooltip text="Create" position="bottom">
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="p-2 rounded-lg hover:bg-surface-bg flex items-center justify-center text-main-text transition-colors"
                >
                  <i className="fi fi-rr-plus flex items-center text-base"></i>
                </button>
              </Tooltip>
              <Tooltip text="Notifications" position="bottom">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-surface-bg flex items-center justify-center text-main-text transition-colors relative"
                >
                  <i className="fi fi-rr-bell flex items-center text-base"></i>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-2 right-2 min-w-[12px] h-[12px] flex items-center justify-center bg-accent text-[8px] font-black text-white rounded-full border border-white dark:border-main-bg px-0.5 animate-pulse">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </Tooltip>
            </div>
            
            {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}

            <Tooltip text="Profile" position="bottom">
              <div 
                className="w-8 h-8 bg-gradient-to-br from-accent to-purple-600 text-white rounded-lg flex items-center justify-center font-bold cursor-pointer shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 transition-all overflow-hidden text-xs" 
                onClick={() => navigate('/profile')}
              >
                {user?.avatar ? (
                  <img src={user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (user?.fullName || user?.name || 'V').charAt(0).toUpperCase()
                )}
              </div>
            </Tooltip>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="text-slate-500 font-bold text-xs hover:text-white transition-colors">Login</button>
          <button onClick={() => navigate('/signup')} className="bg-accent text-white px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 transition-all">Sign Up</button>
        </div>
      )}
    </nav>

    {isCreateModalOpen && <CreatePost onClose={() => setIsCreateModalOpen(false)} />}
    </>
  );
};

export default Navbar;
