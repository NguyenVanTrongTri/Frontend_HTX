import { apiClient } from '../lib/apiClient';

export const memberService = {
  getPendingMembers: async () => {
    const response = await apiClient.get('/members/pending');
    return response.data;
  },
  getStaffAccounts: async () => {
      const response = await apiClient.get('/staff');
      return response.data;
  },
  createMember: async (data: any) => {
    const response = await apiClient.post('/members', data);
    return response.data;
  },
  approveMember: async (id: string) => {
      const response = await apiClient.post(`/members/${id}/approve`);
      return response.data;
  },
  rejectMember: async (id: string) => {
      const response = await apiClient.post(`/members/${id}/reject`);
      return response.data;
  }
};
