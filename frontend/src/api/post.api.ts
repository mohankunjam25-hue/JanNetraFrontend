import api from './axios.config';

export const createPostApi = async (formData: FormData, onUploadProgress?: (progress: number) => void) => {
  const response = await api.post('/api/v1/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
    },
  });
  return response.data;
};

export const fetchPostsApi = async (filters: { state?: string; district?: string; block?: string; village?: string } = {}) => {
  const query = new URLSearchParams(filters as any).toString();
  const response = await api.get(`/api/v1/posts?${query}`);
  return response.data;
};

export const fetchUserPostsApi = async (userId: string) => {
  const response = await api.get(`/api/v1/posts/user/${userId}`);
  return response.data;
};

export const fetchBuzzVideosApi = async () => {
  const response = await api.get('/api/v1/posts/buzz');
  return response.data;
};

export const toggleAppreciationApi = async (postId: string) => {
  const response = await api.patch(`/api/v1/posts/appreciate/${postId}`);
  return response.data;
};

export const deletePostApi = async (postId: string) => {
  const response = await api.delete(`/api/v1/posts/${postId}`);
  return response.data;
};

export const sharePostApi = async (postId: string) => {
  const response = await api.patch(`/api/v1/posts/share/${postId}`);
  return response.data;
};
