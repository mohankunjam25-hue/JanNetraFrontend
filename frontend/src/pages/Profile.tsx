import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileHeader from '../features/profile/components/ProfileHeader';
import EditProfile from '../features/profile/components/EditProfile';
import Settings from '../features/profile/components/Settings/Settings';
import FollowList from '../features/profile/components/FollowList';
import { PostGrid, VideoGrid, SavedItems, InfoSection } from '../features/profile/components/TabContents';
import GovernanceDashboard from '../features/governance/components/GovernanceDashboard';
import { useAppStore } from '../store/appStore';
import { fetchUserPostsApi } from '../api/post.api';
import { fetchUserProfileApi, toggleAllyApi, fetchChampionsApi, fetchAlliesApi, toggleBlockApi } from '../api/user.api';
import toast from 'react-hot-toast';

type TabType = 'voice' | 'videos' | 'saved' | 'info' | 'governance';
type ViewType = 'profile' | 'edit' | 'settings' | 'champions' | 'allies';

const Profile: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('voice');
  const [currentView, setCurrentView] = useState<ViewType>('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user: currentUser, setUserPosts, setProfileVideos, setChampions, setAllies, updateProfile } = useAppStore();
  
  const [targetUser, setTargetUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use state from API instead of local check if possible
  const isOwnProfile = targetUser ? targetUser.isOwnProfile : (!username || username === currentUser?.username);

  useEffect(() => {
    let isMounted = true;
    
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        let userToFetch = null;
        
        // Always fetch from API to get isAlly and isOwnProfile flags
        const usernameToFetch = username || currentUser?.username;
        if (!usernameToFetch) {
            navigate('/login');
            return;
        }

        const res = await fetchUserProfileApi(usernameToFetch);
        if (res.success) {
            userToFetch = res.data;
            setTargetUser(res.data);
            
            // Sync with global store if it's the current user's profile
            if (res.data.isOwnProfile) {
                updateProfile(res.data);
            }
        } else {
            toast.error("User not found");
            navigate('/');
            return;
        }

        if (userToFetch?._id) {
          const [postsRes, championsRes, alliesRes] = await Promise.all([
            fetchUserPostsApi(userToFetch._id),
            fetchChampionsApi(userToFetch._id),
            fetchAlliesApi(userToFetch._id)
          ]);

          if (isMounted) {
            if (postsRes.success) {
              const allPosts = postsRes.data;
              setUserPosts(allPosts.filter((p: any) => p.type !== 'video'));
              setProfileVideos(allPosts.filter((p: any) => p.type === 'video'));
            }
            if (championsRes.success) setChampions(championsRes.data);
            if (alliesRes.success) setAllies(alliesRes.data);
          }
        }
      } catch (error) {
        console.error("Load Profile Error:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfileData();
    return () => { isMounted = false; };
  }, [username, currentUser?.username, currentUser?._id, setUserPosts, setProfileVideos, setChampions, setAllies, navigate]);

  const handleToggleAlly = async () => {
    if (!targetUser?._id) return;
    try {
      const result = await toggleAllyApi(targetUser._id);
      if (result.success) {
        toast.success(result.message);
        const isAlly = result.data.isAlly;
        
        // Update target user stats on screen
        setTargetUser({
          ...targetUser,
          isAlly: isAlly,
          alliesCount: isAlly ? (targetUser.alliesCount + 1) : Math.max(0, targetUser.alliesCount - 1)
        });

        // Update current user's champion count in store
        updateProfile({
            championsCount: isAlly ? (currentUser?.championsCount || 0) + 1 : Math.max(0, (currentUser?.championsCount || 0) - 1)
        });

        // Re-fetch champions/allies lists to ensure sorting and inclusion
        const [championsRes, alliesRes] = await Promise.all([
          fetchChampionsApi(targetUser._id),
          fetchAlliesApi(targetUser._id)
        ]);
        if (championsRes.success) setChampions(championsRes.data);
        if (alliesRes.success) setAllies(alliesRes.data);
      }
    } catch (error) {
      console.error("Toggle Ally Error:", error);
    }
  };

  const handleToggleBlock = async () => {
    if (!targetUser?._id) return;
    const action = targetUser.isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${targetUser.fullName}?`)) return;

    try {
        const res = await toggleBlockApi(targetUser._id);
        if (res.success) {
            toast.success(res.message);
            const isBlocked = res.data.isBlocked;
            setTargetUser({
                ...targetUser,
                isBlocked: isBlocked,
                // If blocked, they are no longer an ally
                isAlly: isBlocked ? false : targetUser.isAlly,
                alliesCount: (isBlocked && targetUser.isAlly) ? Math.max(0, targetUser.alliesCount - 1) : targetUser.alliesCount
            });

            if (isBlocked) {
                // Fetch fresh lists instead of local state mutation
                const [championsRes, alliesRes] = await Promise.all([
                    fetchChampionsApi(targetUser._id),
                    fetchAlliesApi(targetUser._id)
                ]);
                if (championsRes.success) setChampions(championsRes.data);
                if (alliesRes.success) setAllies(alliesRes.data);
            }
        }
    } catch (error) {
        toast.error("Failed to toggle block status");
    }
  };

  const handleShareProfile = async () => {
    if (!targetUser) return;
    const profileUrl = `${window.location.origin}/profile/${targetUser.username}`;
    const shareData = {
      title: `${targetUser.fullName} on JanNetra`,
      text: `Check out ${targetUser.fullName}'s profile on JanNetra!`,
      url: profileUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share Error:", error);
      // Don't show error if user cancelled the share
      if ((error as any).name !== 'AbortError') {
        toast.error("Sharing failed");
      }
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'voice': return <PostGrid />;
      case 'videos': return <VideoGrid />;
      case 'saved': return <SavedItems />;
      case 'info': return <InfoSection />;
      case 'governance': return <GovernanceDashboard />;
      default: return <PostGrid />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-[#08060d]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Loading Profile...</p>
      </div>
    );
  }

  if (currentView === 'edit') {
    return (
      <EditProfile 
        onBack={() => setCurrentView('profile')} 
        profileImage={profileImage}
        triggerFileInput={triggerFileInput}
        handleImageChange={handleImageChange}
        fileInputRef={fileInputRef}
      />
    );
  }

  if (currentView === 'settings') return <Settings onBack={() => setCurrentView('profile')} />;
  if (currentView === 'champions') return <FollowList type="champions" onBack={() => setCurrentView('profile')} />;
  if (currentView === 'allies') return <FollowList type="allies" onBack={() => setCurrentView('profile')} />;

  return (
    <div className="min-h-screen bg-[#08060d] animate-in fade-in duration-500">
      <ProfileHeader 
        user={targetUser}
        isOwnProfile={isOwnProfile}
        profileImage={profileImage}
        onEditClick={() => setCurrentView('edit')}
        onSettingsClick={() => setCurrentView('settings')}
        onChampionsClick={() => setCurrentView('champions')}
        onAlliesClick={() => setCurrentView('allies')}
        onAllyToggle={handleToggleAlly}
        onBlockToggle={handleToggleBlock}
        onShareClick={handleShareProfile}
      />

      {/* Navigation Tabs */}
      <div className="flex border-t border-slate-900 mt-12 overflow-x-auto scrollbar-none justify-center px-4 md:px-0">
        {[
          { id: 'voice', icon: 'fi-rr-grid', label: 'VOICE', public: true },
          { id: 'videos', icon: 'fi-rr-play-alt', label: 'VIDEOS', public: true },
          { id: 'saved', icon: 'fi-rr-bookmark', label: 'SAVED', public: false },
          { id: 'info', icon: 'fi-rr-info', label: 'INFO', public: false },
          { id: 'governance', icon: 'fi-rr-bank', label: 'GOVERNANCE', public: false }
        ]
        .filter(tab => isOwnProfile || tab.public)
        .map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 md:px-8 py-4 text-[10px] md:text-[11px] font-black tracking-[0.2em] transition-all relative ${
              activeTab === tab.id 
                ? 'text-white after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:h-[1px] after:bg-white' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <i className={`fi ${tab.icon} flex items-center text-sm`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 mb-20 px-4 max-w-5xl mx-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
