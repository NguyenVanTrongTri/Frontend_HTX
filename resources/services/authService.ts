const STORAGE_KEY = 'registered_admins';
const USER_KEY = 'current_user';

const getAdmins = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

const saveAdmin = (admin: any) => {
    const admins = getAdmins();
    admins.push(admin);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));
}

const updateAdmin = (updatedAdmin: any) => {
    let admins = getAdmins();
    admins = admins.map((a: any) => a.phone === updatedAdmin.phone ? updatedAdmin : a);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));
}

const authService = {
  login: async (phone: string, password: string) => {
    const p = phone.trim();
    const pw = password.trim();
    // Hardcoded fallbacks first
    if ((p === '0901234567' && pw === 'superadmin') || (p === '013' && pw === '013') || (p === '1' && pw === '1')) {
       const user = { token: 'mock-token', role: 'super-admin', phone: p, name: 'Đặng Thái Sơn', passwordChanged: true };
       localStorage.setItem(USER_KEY, JSON.stringify(user));
       return Promise.resolve({ data: user });
    }
    if ((p === '0901234568' && pw === 'admin') || (p === '012' && pw === '012') || (p === '2' && pw === '2')) {
       const user = { token: 'mock-token', role: 'admin', phone: p, name: 'Nguyễn Văn Cảnh', passwordChanged: true };
       localStorage.setItem(USER_KEY, JSON.stringify(user));
       return Promise.resolve({ data: user });
    }
    if ((p === '123' && pw === '123') || (p === '3' && pw === '3') || (p === '001' && pw === '001')) {
       const user = { token: 'mock-token', role: 'farmer', phone: p, name: 'Lê Văn Tám', passwordChanged: true };
       localStorage.setItem(USER_KEY, JSON.stringify(user));
       return Promise.resolve({ data: user });
    }

    const admins = getAdmins();
    const admin = admins.find((a: any) => a.phone === p || (a.id && a.id.toLowerCase() === p.toLowerCase()));
    
    if (admin && admin.password === pw) {
       const user = { 
         token: 'mock-token', 
         role: admin.role, 
         cooperativeId: admin.cooperativeId, 
         phone: admin.phone, 
         name: admin.name,
         passwordChanged: admin.passwordChanged 
       };
       localStorage.setItem(USER_KEY, JSON.stringify(user));
       return Promise.resolve({ data: user });
    }
    
    return Promise.reject('Invalid credentials');
  },
  me: async () => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return Promise.resolve({ data: { role: 'customer' } });
    
    const userData = JSON.parse(user);
    const admins = getAdmins();
    const admin = admins.find((a: any) => a.phone === userData.phone);
    return Promise.resolve({ data: { ...userData, passwordChanged: admin?.passwordChanged } });
  },
  registerAdmin: async (userData: { name: string; email: string; phone: string; role: string; cccd: string; cooperativeId: string; password: string }) => {
    saveAdmin({ ...userData, passwordChanged: false });
    console.log('Registered admin:', userData);
    return Promise.resolve({ data: { success: true } });
  },
  updateAdminPassword: async (phone: string, newPassword: string) => {
    const admins = getAdmins();
    const admin = admins.find((a: any) => a.phone === phone);
    if (!admin) return Promise.reject('Admin not found');
    
    const updatedAdmin = { ...admin, password: newPassword, passwordChanged: true };
    updateAdmin(updatedAdmin);
    
    const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    localStorage.setItem(USER_KEY, JSON.stringify({ ...user, passwordChanged: true }));
    
    return Promise.resolve({ data: { success: true } });
  },
  logout: () => {
    localStorage.removeItem(USER_KEY);
  }
};
export default authService;
