import { apiClient } from '../lib/apiClient';

export const cooperativeService = {
  getAll: async () => {
    const response = await apiClient.get('/cooperatives');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/cooperatives/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/cooperatives', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/cooperatives/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/cooperatives/${id}`);
    return response.data;
  }
};
