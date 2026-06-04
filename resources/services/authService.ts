import { apiClient } from '../lib/apiClient';

const USER_KEY = 'current_user';

const authService = {
  login: async (phone: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { phone, password });
      if (response.data) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      // Fallback for demo if API fails
      console.warn("API login failed, using local storage fallback", error);
      const p = phone.trim();
      const pw = password.trim();
      
      let user: any = null;
      if ((p === '0901234567' && pw === 'superadmin') || (p === '013' && pw === '013') || (p === '1' && pw === '1')) {
         user = { token: 'mock-token', role: 'super-admin', phone: p, name: 'Đặng Thái Sơn', passwordChanged: true };
      } else if ((p === '0901234568' && pw === 'admin') || (p === '012' && pw === '012') || (p === '2' && pw === '2')) {
         user = { token: 'mock-token', role: 'admin', phone: p, name: 'Nguyễn Văn Cảnh', passwordChanged: true };
      } else if ((p === '123' && pw === '123') || (p === '3' && pw === '3') || (p === '001' && pw === '001')) {
         user = { token: 'mock-token', role: 'farmer', phone: p, name: 'Lê Văn Tám', passwordChanged: true };
      }

      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return { data: user };
      }
      throw error;
    }
  },
  me: async () => {
    try {
      // Ket Noi API
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      const user = localStorage.getItem(USER_KEY);
      if (!user) return { data: { role: 'customer' } };
      return { data: JSON.parse(user) };
    }
  },
  registerAdmin: async (userData: any) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  registerEnterprise: async (enterpriseData: any) => {
    // Ket noi API
    const response = await apiClient.post('/auth/register-enterprise', enterpriseData);
    return response.data;
  },
  updateAdminPassword: async (phone: string, newPassword: string) => {
    const response = await apiClient.put('/auth/password', { phone, newPassword });
    return response.data;
  },
  updateProfile: async (userData: any) => {
    // Ket noi API
    const response = await apiClient.put('/auth/profile', userData);
    
    // Sync local storage if success
    const current = localStorage.getItem(USER_KEY);
    if (current) {
      const merged = { ...JSON.parse(current), ...userData };
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
    }
    
    return response.data;
  },
  forgotPassword: async (input: string) => {
    // Ket noi API
    const response = await apiClient.post('/auth/forgot-password', { input });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }
};

export default authService;
