import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { fetchNotificationsApi, markAsReadApi, markAllAsReadApi } from '../api/notification.api';
import toast from 'react-hot-toast';

const NotificationDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, setNotifications, markReadLocally, markAllReadLocally } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const result = await fetchNotificationsApi();
        if (result.success) {
          setNotifications(result.data);
        }
      } catch (error) {
        console.error("Fetch Notifications Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [setNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadApi(id);
      markReadLocally(id);
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsReadApi();
      markAllReadLocally();
      toast.success("All caught up!");
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  const getNotificationText = (notification: any) => {
    switch (notification.type) {
      case 'APPRECIATION': return 'appreciated your post';
      case 'COMMENT': return 'commented on your post';
      case 'REPLY': return 'replied to your comment';
      case 'MENTION': return 'mentioned you in a comment';
      case 'SHARE': return 'shared your post';
      case 'ALLY_ACTIVITY': return 'is active in your area';
      default: return 'sent you a notification';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'APPRECIATION': return 'fi-sr-heart text-red-500';
      case 'COMMENT': return 'fi-sr-comment text-blue-500';
      case 'REPLY': return 'fi-sr-redo text-green-500';
      case 'MENTION': return 'fi-sr-at text-purple-500';
      case 'SHARE': return 'fi-sr-paper-plane text-orange-500';
      default: return 'fi-sr-bell text-accent';
    }
  };

  return (
    <div className="absolute top-full right-0 mt-4 w-[360px] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Notifications</h3>
        {notifications.some(n => !n.isRead) && (
          <button onClick={handleMarkAllRead} className="text-[10px] font-black text-accent uppercase tracking-tighter hover:underline">Mark all read</button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto scrollbar-none">
        {isLoading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center">
            <i className="fi fi-rr-bell-slash text-2xl text-slate-200 mb-2"></i>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n._id} 
              className={`p-4 border-b border-slate-50 dark:border-slate-800/50 flex gap-4 transition-colors cursor-pointer ${!n.isRead ? 'bg-slate-50/50 dark:bg-accent/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              onClick={() => !n.isRead && handleMarkAsRead(n._id)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                  {n.sender?.avatar ? (
                    <img src={n.sender.avatar.startsWith('http') ? n.sender.avatar : `${import.meta.env.VITE_API_URL}${n.sender.avatar}`} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="font-bold text-slate-400">{n.sender?.fullName?.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                  <i className={`fi ${getNotificationIcon(n.type)} text-[10px]`}></i>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                  <span className="font-black text-slate-900 dark:text-white">{n.sender?.fullName}</span> {getNotificationText(n)}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                  {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {!n.isRead && <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>}
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 text-center">
        <button onClick={onClose} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Close</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
