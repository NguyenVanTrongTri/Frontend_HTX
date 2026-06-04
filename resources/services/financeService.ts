import { apiClient } from '../lib/apiClient';

export const financeService = {
  getTransactions: async () => {
    const response = await apiClient.get('/transactions');
    return response.data;
  }
};
