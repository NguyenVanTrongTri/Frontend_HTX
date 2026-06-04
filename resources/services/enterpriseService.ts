import { apiClient } from '../lib/apiClient';

export const enterpriseService = {
  getAll: async (status?: string) => {
    const response = await apiClient.get('/enterprises', { params: { status } });
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/enterprises/${id}/status`, { status });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/enterprises/${id}`);
    return response.data;
  }
};
