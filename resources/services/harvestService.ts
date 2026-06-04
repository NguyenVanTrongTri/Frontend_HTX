import { apiClient } from '../lib/apiClient';

export const harvestService = {
  getAllSchedules: async () => {
    const response = await apiClient.get('/harvests');
    return response.data;
  },
  createSchedule: async (data: any) => {
    const response = await apiClient.post('/harvests', data);
    return response.data;
  },
  deleteSchedule: async (id: string) => {
    const response = await apiClient.delete(`/harvests/${id}`);
    return response.data;
  },
  getPendingDeliveries: async () => {
    const response = await apiClient.get('/deliveries/pending');
    return response.data;
  },
  updateDeliveryStatus: async (id: string, status: string, note?: string) => {
    const response = await apiClient.put(`/deliveries/${id}/status`, { status, note });
    return response.data;
  },
  createDelivery: async (data: any) => {
    const response = await apiClient.post('/deliveries', data);
    return response.data;
  }
};
