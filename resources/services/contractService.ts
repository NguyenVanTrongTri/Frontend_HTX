import { apiClient } from '../lib/apiClient';

export const contractService = {
  getAllContracts: async () => {
    const response = await apiClient.get('/contracts');
    return response.data;
  },
  updateContractStatus: async (id: string, status: string, notes?: string) => {
      const response = await apiClient.put(`/contracts/${id}/status`, { status, notes });
      return response.data;
  },
  createContract: async (contractData: any) => {
    const response = await apiClient.post('/contracts', contractData);
    return response.data;
  },
  updateContract: async (id: string, contractData: any) => {
    const response = await apiClient.put(`/contracts/${id}`, contractData);
    return response.data;
  }
};
