import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/v1/reports';

export const createReportApi = async (reportedItemId: string, itemType: 'Post' | 'Comment' | 'User', reason: string, description?: string) => {
    try {
        const response = await axios.post(`${API_URL}`, { reportedItemId, itemType, reason, description }, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { success: false, message: "Failed to submit report" };
    }
};
