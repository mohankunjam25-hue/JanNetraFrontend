import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserLocation } from '../types';
import { updateUserSettingsApi } from '../api/user.api';

interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
}

interface AppState {
  user: User | null;
  accounts: AuthUser[]; // Array of logged-in accounts with their own tokens
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  currentLocation: UserLocation;
  posts: any[];
  buzzVideos: any[];
  isAddingAccount: boolean;
  
  // Actions
  setUser: (user: User | null, accessToken?: string, refreshToken?: string) => void;
  addAccount: (user: User, accessToken: string, refreshToken: string) => void;
  switchAccount: (userId: string) => void;
  removeAccount: (userId: string) => void;
  setAuth: (status: boolean) => void;
  setIsAddingAccount: (isAdding: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  logout: () => void;
  updateLocation: (location: Partial<UserLocation>) => void;
  updateProfile: (data: Partial<User>) => void;
  updateSettings: (settings: any) => Promise<void>;
  setPosts: (posts: any[]) => void;
  setUserPosts: (posts: any[]) => void;
  setProfileVideos: (videos: any[]) => void;
  addPost: (post: any) => void;
  removePost: (postId: string) => void;
  toggleAppreciationLocally: (postId: string, isAppreciated: boolean, appreciationsCount: number, userId: string) => void;
  setBuzzVideos: (videos: any[]) => void;
  
  // Notification State
  notifications: any[];
  unreadNotificationsCount: number;
  userPosts: any[];
  profileVideos: any[];
  champions: any[];
  allies: any[];
  theme: 'light' | 'dark' | 'system';
  setNotifications: (notifications: any[]) => void;
  setUnreadCount: (count: number) => void;
  setChampions: (users: any[]) => void;
  setAllies: (users: any[]) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  markReadLocally: (notificationId: string) => void;
  markAllReadLocally: () => void;
  
  // Hydration state
  hasHydrated: boolean;
  setHasHydrated: (status: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      accounts: [],
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      isAddingAccount: false,
      currentLocation: {
        state: 'Madhya Pradesh',
        district: 'Bhopal',
        block: 'Bhopal North',
        village: 'Arera Colony'
      },
      posts: [],
      buzzVideos: [],
      notifications: [],
      unreadNotificationsCount: 0,
      userPosts: [],
      profileVideos: [],
      champions: [],
      allies: [],
      theme: 'system',
      hasHydrated: false,

      setUser: (user, accessToken, refreshToken) => set((state) => {
        if (!user) return { user: null, isAuthenticated: false, accessToken: null, refreshToken: null };
        
        const currentToken = accessToken || state.accessToken || '';
        const currentRefresh = refreshToken || state.refreshToken || '';

        console.log("Setting User:", user.username, "Token present:", !!currentToken);

        const authUser: AuthUser = { 
          ...user, 
          accessToken: currentToken, 
          refreshToken: currentRefresh 
        };

        const exists = state.accounts.find(a => a._id === user._id);
        const newAccounts = exists 
          ? state.accounts.map(a => a._id === user._id ? authUser : a)
          : [...state.accounts, authUser];

        return { 
          user, 
          accounts: newAccounts, 
          isAuthenticated: true,
          accessToken: authUser.accessToken,
          refreshToken: authUser.refreshToken,
          isAddingAccount: false // Automatically exit adding mode
        };
      }),

      addAccount: (user, accessToken, refreshToken) => set((state) => {
        const authUser: AuthUser = { ...user, accessToken, refreshToken };
        return {
          accounts: state.accounts.find(a => a._id === user._id) 
            ? state.accounts.map(a => a._id === user._id ? authUser : a)
            : [...state.accounts, authUser],
          isAddingAccount: false // Exit adding mode
        };
      }),

      switchAccount: (userId) => set((state) => {
        const targetAccount = state.accounts.find(a => a._id === userId);
        if (!targetAccount) return state;
        
        console.log("Switching to Account:", targetAccount.username, "Token present:", !!targetAccount.accessToken);

        // CRITICAL: Switch tokens along with the user profile
        return { 
          user: targetAccount,
          accessToken: targetAccount.accessToken,
          refreshToken: targetAccount.refreshToken,
          isAuthenticated: true,
          isAddingAccount: false, // Exit adding mode
          userPosts: [],
          profileVideos: [],
          champions: [],
          allies: [],
          notifications: [],
          unreadNotificationsCount: 0
        };
      }),

      removeAccount: (userId) => set((state) => {
        const newAccounts = state.accounts.filter(a => a._id !== userId);
        const newUser = state.user?._id === userId 
          ? (newAccounts.length > 0 ? newAccounts[0] : null) 
          : state.user;
        
        return { 
          accounts: newAccounts, 
          user: newUser,
          accessToken: newUser ? (newUser as AuthUser).accessToken : null,
          refreshToken: newUser ? (newUser as AuthUser).refreshToken : null,
          isAuthenticated: !!newUser
        };
      }),

      setAuth: (status) => set({ isAuthenticated: status }),
      setIsAddingAccount: (isAdding) => set({ isAddingAccount: isAdding }),
      setAccessToken: (token) => set((state) => ({ 
        accessToken: token,
        accounts: state.user 
          ? state.accounts.map(a => a._id === state.user?._id ? { ...a, accessToken: token || '' } : a)
          : state.accounts
      })),
      setRefreshToken: (token) => set((state) => ({ 
        refreshToken: token,
        accounts: state.user 
          ? state.accounts.map(a => a._id === state.user?._id ? { ...a, refreshToken: token || '' } : a)
          : state.accounts
      })),
      logout: () => set({ user: null, accounts: [], isAuthenticated: false, accessToken: null, refreshToken: null }),
      updateLocation: (newLoc) => set((state) => ({
        currentLocation: { ...state.currentLocation, ...newLoc }
      })),
      updateProfile: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
        accounts: state.accounts.map(a => a._id === state.user?._id ? { ...a, ...data } : a)
      })),
      updateSettings: async (newSettings) => {
        try {
          const result = await updateUserSettingsApi(newSettings);
          if (result.success) {
            set((state) => ({
              user: result.data,
              accounts: state.accounts.map(a => a._id === state.user?._id ? result.data : a)
            }));
          }
        } catch (error) {
          console.error('Settings Update Error:', error);
        }
      },
      setPosts: (posts) => set({ posts }),
      setUserPosts: (posts) => set({ userPosts: posts }),
      setProfileVideos: (videos) => set({ profileVideos: videos }),
      addPost: (post) => set((state) => ({ 
        posts: [post, ...state.posts],
        userPosts: [post, ...state.userPosts],
        user: state.user ? { ...state.user, voiceCount: (state.user.voiceCount || 0) + 1 } : null
      })),
      removePost: (postId) => set((state) => ({
        posts: state.posts.filter((p) => p._id !== postId),
        userPosts: state.userPosts.filter((p) => p._id !== postId),
        buzzVideos: state.buzzVideos.filter((v) => v._id !== postId),
        profileVideos: state.profileVideos.filter((v) => v._id !== postId),
        user: state.user ? { ...state.user, voiceCount: Math.max(0, (state.user.voiceCount || 0) - 1) } : null
      })),
      toggleAppreciationLocally: (postId, isAppreciated, appreciationsCount, userId) => set((state) => {
        const updateItem = (item: any) => {
          if (item._id !== postId) return item;
          
          const currentAppreciations = item.appreciations || [];
          const newAppreciations = isAppreciated 
            ? [...currentAppreciations, userId]
            : currentAppreciations.filter((id: string) => id !== userId);
            
          return { ...item, appreciations: newAppreciations, appreciationsCount };
        };

        return {
          posts: state.posts.map(updateItem),
          buzzVideos: state.buzzVideos.map(updateItem),
          userPosts: state.userPosts.map(updateItem),
          profileVideos: state.profileVideos.map(updateItem)
        };
      }),
      setBuzzVideos: (videos) => set({ buzzVideos: videos }),
      
      setNotifications: (notifications) => set({ notifications }),
      setUnreadCount: (count) => set({ unreadNotificationsCount: count }),
      setChampions: (champions) => set({ champions }),
      setAllies: (allies) => set({ allies }),
      setTheme: (theme) => set({ theme }),
      markReadLocally: (notificationId) => set((state) => ({
        notifications: state.notifications.map((n) => 
          n._id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1)
      })),
      markAllReadLocally: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadNotificationsCount: 0
      })),
      setHasHydrated: (status) => set({ hasHydrated: status }),
    }),
    {
      name: 'jannetra-app-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
