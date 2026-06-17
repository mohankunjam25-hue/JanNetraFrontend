import api from './axios.config';

export const addCommentApi = async (postId: string, content: string) => {
  const response = await api.post(`/api/v1/comments/${postId}`, { content });
  return response.data;
};

export const fetchCommentsApi = async (postId: string) => {
  const response = await api.get(`/api/v1/comments/${postId}`);
  return response.data;
};

export const deleteCommentApi = async (commentId: string) => {
  const response = await api.delete(`/api/v1/comments/c/${commentId}`);
  return response.data;
};
