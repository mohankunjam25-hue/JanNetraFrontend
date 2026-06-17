import api from './axios.config';

export const registerUserApi = async (data: any) => {
  const response = await api.post('/api/v1/users/register', data);
  return response.data;
};

export const loginUserApi = async (data: any) => {
  const response = await api.post('/api/v1/users/login', data);
  return response.data;
};

export const logoutUserApi = async () => {
  const response = await api.post('/api/v1/users/logout');
  return response.data;
};

export const updateUserSettingsApi = async (settings: any) => {
  const response = await api.patch('/api/v1/users/update-settings', { settings });
  return response.data;
};

export const updateAccountApi = async (data: any) => {
  const response = await api.patch('/api/v1/users/update-account', data);
  return response.data;
};

export const updateProfileImagesApi = async (formData: FormData) => {
  const response = await api.patch('/api/v1/users/update-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const fetchChampionsApi = async (userId: string) => {
  const response = await api.get(`/api/v1/users/champions/${userId}`);
  return response.data;
};

export const fetchAlliesApi = async (userId: string) => {
  const response = await api.get(`/api/v1/users/allies/${userId}`);
  return response.data;
};

export const fetchUserProfileApi = async (username: string) => {
  const response = await api.get(`/api/v1/users/profile/${username}`);
  return response.data;
};

export const toggleAllyApi = async (targetUserId: string) => {
  const response = await api.patch(`/api/v1/users/toggle-ally/${targetUserId}`);
  return response.data;
};

export const toggleBlockApi = async (targetUserId: string) => {
    const response = await api.patch(`/api/v1/users/toggle-block/${targetUserId}`);
    return response.data;
};

export const submitVerificationApi = async (formData: FormData) => {
    const response = await api.post('/api/v1/users/verify-identity', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const generate2FAApi = async () => {
  const response = await api.post('/api/v1/users/2fa/generate');
  return response.data;
};

export const enable2FAApi = async (token: string) => {
  const response = await api.post('/api/v1/users/2fa/enable', { token });
  return response.data;
};

export const forgotPasswordApi = async (data: any) => {
  const response = await api.post('/api/v1/users/forgot-password', data);
  return response.data;
};

export const resetPasswordApi = async (data: any) => {
  const response = await api.post('/api/v1/users/reset-password', data);
  return response.data;
};
