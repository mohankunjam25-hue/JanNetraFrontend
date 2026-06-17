import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/appStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAppStore.getState();
    console.log("Axios Request to:", config.url, "Token present:", !!accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh & Global Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setAccessToken, logout } = useAppStore.getState();

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      try {
        console.log("Attempting silent token refresh...");
        const response = await axios.post(`${API_URL}/api/v1/users/refresh-token`, {
          refreshToken: refreshToken
        });

        const { accessToken: newAccessToken } = response.data.data;
        setAccessToken(newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid", refreshError);
        logout();
        toast.error("Session expired. Please login again.");
        return Promise.reject(refreshError);
      }
    }

    // Global Error Handling
    const message = error.response?.data?.message || "Something went wrong";
    if (error.response?.status !== 401) {
        toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
