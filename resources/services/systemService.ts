import { apiClient } from '../lib/apiClient';

export const adminAccountService = {
  getAll: async () => {
    const response = await apiClient.get('/admin/accounts');
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/admin/accounts', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/admin/accounts/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/accounts/${id}`);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/admin/accounts/${id}/status`, { status });
    return response.data;
  }
};

export const systemService = {
  getPolicies: async () => {
    const response = await apiClient.get('/system/policies');
    return response.data;
  },
  updatePolicy: async (key: string, content: string) => {
    const response = await apiClient.put(`/system/policies/${key}`, { content });
    return response.data;
  },
  getLogs: async () => {
    const response = await apiClient.get('/system/logs');
    return response.data;
  },
  getStatistics: async () => {
    const response = await apiClient.get('/system/statistics');
    return response.data;
  }
};
