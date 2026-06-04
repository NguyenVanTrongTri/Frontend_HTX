import { apiClient } from '../lib/apiClient';

export const productService = {
  getAllProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },
  createProduct: async (data: any) => {
      const response = await apiClient.post('/products', data);
      return response.data;
  },
  deleteProduct: async (id: string) => {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
  }
};
