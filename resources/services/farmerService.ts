import { apiClient } from '../lib/apiClient';

export const farmerService = {
  getAllFarmers: async () => {
    const response = await apiClient.get('/farmers');
    return response.data;
  },
  createFarmer: async (data: any) => {
    const response = await apiClient.post('/farmers', data);
    return response.data;
  },
  deleteFarmer: async (id: string) => {
    const response = await apiClient.delete(`/farmers/${id}`);
    return response.data;
  },
  createFarmerRequest: async (data: any) => {
    const response = await apiClient.post('/farmers/requests', data);
    return response.data;
  },
  updateCrop: async (farmerPhone: string, cropId: any, cropData: any) => {
    const response = await apiClient.put(`/farmers/${farmerPhone}/crops/${cropId}`, cropData);
    return response.data;
  }
};
