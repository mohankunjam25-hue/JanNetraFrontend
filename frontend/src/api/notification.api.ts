import api from './axios.config';

export const fetchNotificationsApi = async () => {
  const response = await api.get('/api/v1/notifications');
  return response.data;
};

export const fetchUnreadCountApi = async () => {
  const response = await api.get('/api/v1/notifications/unread-count');
  return response.data;
};

export const markAsReadApi = async (notificationId: string) => {
  const response = await api.patch(`/api/v1/notifications/read/${notificationId}`);
  return response.data;
};

export const markAllAsReadApi = async () => {
  const response = await api.patch('/api/v1/notifications/read-all');
  return response.data;
};

export const deleteNotificationApi = async (notificationId: string) => {
  const response = await api.delete(`/api/v1/notifications/${notificationId}`);
  return response.data;
};
