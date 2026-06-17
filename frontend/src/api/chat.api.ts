import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/v1/chats';

export const sendMessageApi = async (receiverId: string, content: string, media?: string) => {
    try {
        const response = await axios.post(`${API_URL}/send`, { receiverId, content, media }, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, message: "Failed to send message" };
    }
};

export const fetchChatHistoryApi = async (otherUserId: string) => {
    try {
        const response = await axios.get(`${API_URL}/history/${otherUserId}`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, message: "Failed to fetch messages" };
    }
};

export const fetchChatListApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/list`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, message: "Failed to fetch chat list" };
    }
};
