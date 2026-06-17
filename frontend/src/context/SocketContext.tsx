import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppStore } from '../store/appStore';
import { fetchPostsApi } from '../api/post.api';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const setPosts = useAppStore((state) => state.setPosts);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const newSocket = io(API_URL, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Join private room if user is logged in
      if (user?._id) {
        newSocket.emit('join_id', user._id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Listen for real-time post changes
    newSocket.on('posts_changed', async (data) => {
      console.log('Real-time update: Posts changed', data);
      // Re-fetch posts to get the latest data from database
      try {
        const result = await fetchPostsApi();
        if (result.success) {
          setPosts(result.data);
        }
      } catch (error) {
        console.error("Socket Refresh Posts Error:", error);
      }
    });

    // Listen for user changes (for current user or profile updates)
    newSocket.on('user_changed', (data) => {
        console.log('Real-time update: User changed', data);
        // We could re-fetch user data here if needed
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [setPosts]); // We intentionally do not put 'user._id' here to prevent reconnecting on every user change

  // Handle user login/switch within the same session
  useEffect(() => {
      if (socket && isConnected && user?._id) {
          socket.emit('join_id', user._id);
      }
  }, [user?._id, socket, isConnected]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
