import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { useSocket } from '../context/SocketContext';
import { fetchChatListApi, fetchChatHistoryApi, sendMessageApi } from '../api/chat.api';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
    const { user: currentUser } = useAppStore();
    const { socket } = useSocket();
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadChatList();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            loadMessages(selectedChat._id);
        }
    }, [selectedChat]);

    useEffect(() => {
        if (socket) {
            socket.on('new_message', (message: any) => {
                // If message is from the currently selected chat
                if (selectedChat && (message.sender._id === selectedChat._id || message.receiver._id === selectedChat._id)) {
                    setMessages(prev => [...prev, message]);
                }

                // Update the chat list to show the latest message
                setChats(prevChats => {
                    const existingChat = prevChats.find(c => c.userDetails._id === message.sender._id || c.userDetails._id === message.receiver._id);
                    if (existingChat) {
                        return prevChats.map(c => 
                            (c.userDetails._id === message.sender._id || c.userDetails._id === message.receiver._id)
                            ? { 
                                ...c, 
                                lastMessage: message.content, 
                                lastMessageTime: message.createdAt,
                                unreadCount: (selectedChat?._id !== message.sender._id && message.sender._id !== currentUser?._id) ? c.unreadCount + 1 : c.unreadCount
                              }
                            : c
                        ).sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
                    } else {
                        // If it's a new conversation, we might need to re-fetch the list or add it manually
                        loadChatList();
                        return prevChats;
                    }
                });
            });

            return () => {
                socket.off('new_message');
            };
        }
    }, [socket, selectedChat, currentUser?._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadChatList = async () => {
        setIsLoadingChats(true);
        const res = await fetchChatListApi();
        if (res.success) setChats(res.data);
        setIsLoadingChats(false);
    };

    const loadMessages = async (otherUserId: string) => {
        setIsLoadingMessages(true);
        const res = await fetchChatHistoryApi(otherUserId);
        if (res.success) setMessages(res.data);
        setIsLoadingMessages(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const content = newMessage;
        setNewMessage('');

        const res = await sendMessageApi(selectedChat._id, content);
        if (res.success) {
            setMessages([...messages, res.data]);
            // Update last message in chat list
            setChats(chats.map(c => c._id === selectedChat._id ? { ...c, lastMessage: content, lastMessageTime: new Date() } : c));
        } else {
            toast.error("Failed to send message");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex h-[calc(100vh-48px)] bg-[#08060d] overflow-hidden">
            {/* Chat List Sidebar */}
            <div className="w-80 border-r border-slate-900 flex flex-col">
                <div className="p-6 border-b border-slate-900">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-none">
                    {isLoadingChats ? (
                        <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
                    ) : chats.length === 0 ? (
                        <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest py-10">No conversations yet</p>
                    ) : (
                        chats.map((chat) => (
                            <div 
                                key={chat._id}
                                onClick={() => setSelectedChat(chat.userDetails)}
                                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${selectedChat?._id === chat.userDetails._id ? 'bg-accent/10 border border-accent/20' : 'hover:bg-slate-900/50 border border-transparent'}`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black overflow-hidden shrink-0">
                                    {chat.userDetails.avatar ? <img src={`${import.meta.env.VITE_API_URL}${chat.userDetails.avatar}`} className="w-full h-full object-cover" /> : chat.userDetails.fullName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-sm font-black text-white truncate">{chat.userDetails.fullName}</h3>
                                        <span className="text-[9px] text-slate-500 font-bold">{new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMessage}</p>
                                </div>
                                {chat.unreadCount > 0 && (
                                    <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-[10px] font-black text-white">{chat.unreadCount}</div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-slate-900 flex items-center gap-4 bg-slate-900/20">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black overflow-hidden">
                                {selectedChat.avatar ? <img src={`${import.meta.env.VITE_API_URL}${selectedChat.avatar}`} className="w-full h-full object-cover" /> : selectedChat.fullName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white">{selectedChat.fullName}</h3>
                                <p className="text-[10px] text-accent font-black uppercase tracking-widest">Online</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none">
                            {isLoadingMessages ? (
                                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div></div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg._id} className={`flex ${msg.sender._id === currentUser?._id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium ${msg.sender._id === currentUser?._id ? 'bg-accent text-white rounded-tr-none' : 'bg-slate-900 text-slate-300 rounded-tl-none border border-slate-800'}`}>
                                            {msg.content}
                                            <p className={`text-[9px] mt-2 font-bold ${msg.sender._id === currentUser?._id ? 'text-white/60' : 'text-slate-500'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-slate-900 bg-[#08060d]">
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-accent outline-none transition-all"
                                />
                                <button type="submit" className="w-14 h-14 bg-accent text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-accent/20">
                                    <i className="fi fi-rr-paper-plane text-xl"></i>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mb-6">
                            <i className="fi fi-rr-comments text-4xl text-slate-700"></i>
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Your Conversations</h2>
                        <p className="text-slate-500 text-xs font-medium max-w-xs">Select a citizen from the list to start a private conversation about development and governance.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
