import { apiClient } from '../lib/apiClient';

export const postService = {
  getAllPosts: async () => {
    const response = await apiClient.get('/posts');
    return response.data;
  },
  getPostById: async (id: string) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },
  createPost: async (data: any) => {
    const response = await apiClient.post('/posts', data);
    return response.data;
  },
  deletePost: async (id: string) => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },
  updatePost: async (id: string, data: any) => {
    const response = await apiClient.put(`/posts/${id}`, data);
    return response.data;
  }
};
