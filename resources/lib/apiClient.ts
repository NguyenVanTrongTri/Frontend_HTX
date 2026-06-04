import axios from 'axios';

const isClient = typeof window !== 'undefined';

const inMemoryStorage: Record<string, string> = {};

function getLocalData<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue;
  let data: string | null = null;
  try {
    data = localStorage.getItem(key);
  } catch (e) {
    console.warn(`localStorage.getItem failed for key: ${key}`, e);
  }

  if (!data) {
    data = inMemoryStorage[key];
  }

  if (!data) {
    const stringifiedDefault = JSON.stringify(defaultValue);
    try {
      localStorage.setItem(key, stringifiedDefault);
    } catch (e) {
      console.warn(`localStorage.setItem default failed for key: ${key}`, e);
    }
    inMemoryStorage[key] = stringifiedDefault;
    return defaultValue;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  if (isClient) {
    const stringified = JSON.stringify(value);
    try {
      localStorage.setItem(key, stringified);
    } catch (e) {
      console.error(`localStorage.setItem failed (quota / security constraint) for key: ${key}`, e);
    }
    inMemoryStorage[key] = stringified;
  }
}

// Default Seed Data
const DEFAULT_COOPERATIVES = [
  { id: 'HTX-001', name: 'HTX Cà phê Cầu Đất', taxCode: '123456789', legalRep: 'Nguyễn Văn Cảnh', phone: '0901234568', status: 'active', members: 45, totalArea: 150, specialty: 'Cà phê Arabica', qualityStandards: ['VietGAP', 'GlobalGAP'], establishedDate: '2023-01-15', province: 'Lâm Đồng', district: 'TP. Đà Lạt', ward: 'Cầu Đất', location: 'Cầu Đất, TP. Đà Lạt, Lâm Đồng' },
  { id: 'HTX-002', name: 'HTX Hoa Đà Lạt', taxCode: '123456780', legalRep: 'Trần Thị Thu Thảo', phone: '0912112233', status: 'active', members: 30, totalArea: 80, specialty: 'Hoa ôn đới', qualityStandards: ['VietGAP'], establishedDate: '2023-04-20', province: 'Lâm Đồng', district: 'TP. Đà Lạt', ward: 'Xuân Trường', location: 'Xuân Trường, TP. Đà Lạt, Lâm Đồng' },
  { id: 'HTX-003', name: 'HTX Nông sản Đức Trọng', taxCode: '123456781', legalRep: 'Phạm Minh Toàn', phone: '0913112244', status: 'active', members: 55, totalArea: 210, specialty: 'Rau củ VietGAP', qualityStandards: ['VietGAP'], establishedDate: '2022-11-05', province: 'Lâm Đồng', district: 'Huyện Đức Trọng', ward: 'Liên Nghĩa', location: 'Liên Nghĩa, Huyện Đức Trọng, Lâm Đồng' }
];

const DEFAULT_PRODUCTS = [
  { id: 'POST-001', name: 'Cà phê Arabica Cầu Đất Thượng Hạng', cooperativeId: 'HTX-001', price: '450.000', unit: 'kg', desc: 'Sản phẩm cà phê Arabica cao cấp Đất Việt', category: 'Trà & Café', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600', ocop: '5-Star', cert: 'Verified Origin via GIS' },
  { id: 'POST-002', name: 'Sầu riêng Ri6 VietGAP - Chín cây', cooperativeId: 'HTX-005', price: '120.000', unit: 'kg', desc: 'Sầu riêng Ri6 thơm ngon chuẩn VietGAP', category: 'Trái cây', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600', ocop: '4-Star', cert: 'Verified Origin via GIS' },
  { id: 'POST-003', name: 'Tiêu đen xô sạch - Giá sỉ', cooperativeId: 'HTX-007', price: '85.000', unit: 'kg', desc: 'Tiêu hạt đen phơi khô tự nhiên', category: 'Đặc sản', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600', ocop: '4-Star', cert: 'Verified Origin via GIS' }
];

const DEFAULT_POSTS = [
  {
    id: 'static-1',
    title: 'Lịch sử cây chè trên vùng đất Ba Vì',
    excerpt: 'Từ "Đồn điền cà phê lộng lẫy" đến...',
    description: 'Từ "Đồn điền cà phê lộng lẫy" đến nông nghiệp số chất lượng cao hôm nay.',
    date: '01/05/2026',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
    category: 'Trà & Café',
    origin: 'HTX Ba Vì'
  },
  {
    id: 'static-2',
    title: 'Mật Ong Hoa Nhãn',
    productName: 'Mật Ong Hoa Nhãn',
    excerpt: 'Hương thơm tinh tế từ hoa bạc hà cao nguyên đá Đồng Văn.',
    description: 'Mật ong hoa nhãn nguyên chất từ hợp tác xã Đồng Văn, chất lượng OCOP 5 sao.',
    date: '05/05/2026',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
    category: 'Đặc sản',
    price: '450.000',
    ocop: '5-Star',
    origin: 'HTX Đồng Văn'
  },
  {
    id: 'post-1',
    title: 'Sầu riêng Ri6 Sấy Lạnh',
    productName: 'Sầu riêng Ri6 Sấy Lạnh',
    excerpt: 'Công nghệ sấy lạnh giữ trọn hương vị sầu riêng tươi...',
    description: 'Sầu riêng chín cây được sấy lạnh công nghệ cao, giữ nguyên độ ngọt tự nhiên từ HTX Đắk Lắk.',
    date: '10/05/2026',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
    category: 'Đặc sản',
    price: '180.000',
    origin: 'HTX Công Nghệ Cao Q1',
    ocop: '4-Star'
  }
];

const DEFAULT_FARMERS = [
  { 
    id: '1', 
    name: 'Lê Văn Tám', 
    phone: '123', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '1.5 ha',
    crops: [
      { name: 'Cà phê Robusta', type: 'perennial', area: 'Bảo Lộc', expectedHarvestDate: '15/12/2026', expectedYield: '4.8', yieldUnit: 'tấn' },
      { name: 'Tiêu hữu cơ', type: 'perennial', area: 'Di Linh', expectedHarvestDate: '10/11/2026', expectedYield: '2.0', yieldUnit: 'tấn' }
    ]
  },
  { 
    id: '2', 
    name: 'Trần Văn An', 
    phone: '0987654321', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '2.0 ha',
    crops: [
      { name: 'Cà phê Arabica', type: 'perennial', area: 'Cầu Đất', expectedHarvestDate: '25/11/2026', expectedYield: '3.5', yieldUnit: 'tấn' },
      { name: 'Sầu riêng Ri6', type: 'perennial', area: 'Đơn Dương', expectedHarvestDate: '05/09/2026', expectedYield: '12.5', yieldUnit: 'tấn' }
    ]
  },
  { 
    id: '3', 
    name: 'Nguyễn Thị Bình', 
    phone: '0912345678', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '1.8 ha',
    crops: [
      { name: 'Sầu riêng Ri6', type: 'perennial', area: 'Đạ Huoai', expectedHarvestDate: '20/08/2026', expectedYield: '15.0', yieldUnit: 'tấn' }
    ]
  },
  { 
    id: '4', 
    name: 'Phạm Văn Cường', 
    phone: '0923456789', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '2.5 ha',
    crops: [
      { name: 'Chanh dây', type: 'short-term', area: 'Đức Trọng', expectedHarvestDate: '12/10/2026', expectedYield: '8.2', yieldUnit: 'tấn' },
      { name: 'Bơ Booth', type: 'perennial', area: 'Lâm Hà', expectedHarvestDate: '30/09/2026', expectedYield: '5.5', yieldUnit: 'tấn' }
    ]
  },
  { 
    id: '5', 
    name: 'Hoàng Đức Hải', 
    phone: '0934567890', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '1.2 ha',
    crops: [
      { name: 'Bơ Booth', type: 'perennial', area: 'Đơn Dương', expectedHarvestDate: '18/09/2026', expectedYield: '6.0', yieldUnit: 'tấn' }
    ]
  },
  { 
    id: '6', 
    name: 'Đỗ Thị Hương', 
    phone: '0945678901', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '3.0 ha',
    crops: [
      { name: 'Mắc ca', type: 'perennial', area: 'Lâm Hà', expectedHarvestDate: '05/11/2026', expectedYield: '4.5', yieldUnit: 'tấn' },
      { name: 'Cà phê Robusta', type: 'perennial', area: 'Bảo Lâm', expectedHarvestDate: '20/12/2026', expectedYield: '9.0', yieldUnit: 'tấn' }
    ]
  },
  { 
    id: '7', 
    name: 'Bùi Văn Khoa', 
    phone: '0956789012', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '1.0 ha',
    crops: [
      { name: 'Khoai lang Lệ Cần', type: 'short-term', area: 'Đức Trọng', expectedHarvestDate: '15/09/2026', expectedYield: '18.0', yieldUnit: 'tấn' }
    ]
  },
  { 
    id: '8', 
    name: 'Ngô Thanh Lâm', 
    phone: '0967890123', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '0.8 ha',
    crops: [
      { name: 'Hoa cẩm chướng', type: 'short-term', area: 'Đà Lạt', expectedHarvestDate: '01/10/2026', expectedYield: '2.5', yieldUnit: 'tấn' }
    ]
  },
  { 
    id: '9', 
    name: 'Võ Thị Mỹ', 
    phone: '0978901234', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '1.6 ha',
    crops: [
      { name: 'Dâu tây Đà Lạt', type: 'short-term', area: 'Măng Đen', expectedHarvestDate: '28/09/2026', expectedYield: '3.0', yieldUnit: 'tấn' },
      { name: 'Atisô', type: 'perennial', area: 'Đà Lạt', expectedHarvestDate: '15/10/2026', expectedYield: '4.2', yieldUnit: 'tấn' }
    ]
  },
  { 
    id: '10', 
    name: 'Đặng Hoàng Nam', 
    phone: '0989012345', 
    status: 'active', 
    cooperativeId: 'HTX-001',
    province: 'Lâm Đồng',
    area: '2.2 ha',
    crops: [
      { name: 'Chè Ô Long', type: 'perennial', area: 'Cầu Đất', expectedHarvestDate: '08/11/2026', expectedYield: '7.5', yieldUnit: 'tấn' }
    ]
  }
];

const DEFAULT_SYSTEM_POLICIES = {
  terms: 'Điều khoản sử dụng của VietAgri mang lại giải pháp số hóa toàn diện...',
  privacy: 'VietAgri cam kết bảo vệ thông tin mật danh tính và GIS của thành viên...',
  standard_support: 'Chế độ hỗ trợ phát triển bền vững 24/7'
};

const DEFAULT_STATISTICS = {
  totalFarmers: 11200,
  totalEnterprises: 4200,
  totalCooperatives: 16,
  totalRevenue: 24700000000,
  growthRate: 15.4
};

// Initiate apiClient
export const apiClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock Adapter Implementation
apiClient.defaults.adapter = async function (config) {
  let urlPath = config.url || '';
  const method = (config.method || 'GET').toUpperCase();

  // Strip host/baseURL to find endpoint
  if (config.baseURL && urlPath.startsWith(config.baseURL)) {
    urlPath = urlPath.substring(config.baseURL.length);
  } else if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
    try {
      const parsedUrl = new URL(urlPath);
      urlPath = parsedUrl.pathname.replace(/^\/api/, '');
    } catch (e) {
      // Keep as is
    }
  }

  // Normalize leading slash
  if (!urlPath.startsWith('/')) {
    urlPath = '/' + urlPath;
  }

  // Remove query parameters for matching
  const [cleanPath, queryString] = urlPath.split('?');
  const segments = cleanPath.split('/').filter(Boolean);

  let responseData: any = null;
  let responseStatus = 200;

  try {
    // 1. Auth Endpoint
    if (segments[0] === 'auth') {
      const sub = segments[1];
      if (sub === 'login') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const phone = body?.phone?.trim();
        const password = body?.password?.trim();

        let loggedUser: any = null;
        if ((phone === '0901234567' && password === 'superadmin') || (phone === '013' && password === '013') || (phone === '1' && password === '1')) {
          loggedUser = { token: 'mock-token', role: 'super_admin', phone, name: 'Đặng Thái Sơn', passwordChanged: true };
        } else if ((phone === '0901234568' && password === 'admin') || (phone === '012' && password === '012') || (phone === '2' && password === '2')) {
          loggedUser = { token: 'mock-token', role: 'admin', phone, name: 'Nguyễn Văn Cảnh', passwordChanged: true };
        } else if ((phone === '123' && password === '123') || (phone === '3' && password === '3') || (phone === '001' && password === '001')) {
          loggedUser = { token: 'mock-token', role: 'farmer', phone, name: 'Lê Văn Tám', passwordChanged: true, cooperativeId: 'HTX-001' };
        } else {
          loggedUser = { token: 'mock-token', role: 'customer', phone, name: 'Khách hàng', passwordChanged: true };
        }
        
        localStorage.setItem('current_user', JSON.stringify(loggedUser));
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userRole', loggedUser.role);
        localStorage.setItem('userName', loggedUser.name);
        responseData = loggedUser;
      } else if (sub === 'me') {
        const currentUserStr = localStorage.getItem('current_user');
        responseData = currentUserStr ? JSON.parse(currentUserStr) : { role: 'customer' };
      } else if (sub === 'register' || sub === 'register-enterprise') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        responseData = { success: true, message: 'Đăng ký thành công!', data: body };
      } else if (sub === 'password') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        responseData = { success: true, message: 'Đổi mật khẩu thành công!' };
      } else if (sub === 'profile') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const current = localStorage.getItem('current_user');
        if (current) {
          const merged = { ...JSON.parse(current), ...body };
          localStorage.setItem('current_user', JSON.stringify(merged));
        }
        responseData = { success: true, message: 'Cập nhật thành công!' };
      } else if (sub === 'forgot-password') {
        responseData = { success: true, message: 'Yêu cầu phục hồi mật khẩu đã gửi!' };
      }
    }

    // 2. Posts & News
    else if (cleanPath === '/posts') {
      const posts = getLocalData<any[]>('mock_posts', DEFAULT_POSTS);
      if (method === 'GET') {
        responseData = posts;
      } else if (method === 'POST') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const newPost = { ...body, id: 'post-' + Date.now() };
        posts.push(newPost);
        setLocalData('mock_posts', posts);
        responseData = newPost;
      }
    } else if (segments[0] === 'posts' && segments.length === 2) {
      const id = segments[1];
      const posts = getLocalData<any[]>('mock_posts', DEFAULT_POSTS);
      if (method === 'GET') {
        responseData = posts.find(p => p.id === id) || DEFAULT_POSTS[0];
      } else if (method === 'PUT') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const index = posts.findIndex(p => p.id === id);
        if (index !== -1) {
          posts[index] = { ...posts[index], ...body };
          setLocalData('mock_posts', posts);
          responseData = posts[index];
        } else {
          responseStatus = 404;
        }
      } else if (method === 'DELETE') {
        const filtered = posts.filter(p => p.id !== id);
        setLocalData('mock_posts', filtered);
        responseData = { success: true };
      }
    }

    // 3. Products
    else if (cleanPath === '/products') {
      const products = getLocalData<any[]>('mock_products', DEFAULT_PRODUCTS);
      if (method === 'GET') {
        responseData = products;
      } else if (method === 'POST') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const newProd = { ...body, id: 'prod-' + Date.now() };
        products.push(newProd);
        setLocalData('mock_products', products);
        responseData = newProd;
      }
    } else if (segments[0] === 'products' && segments.length === 2) {
      const id = segments[1];
      const products = getLocalData<any[]>('mock_products', DEFAULT_PRODUCTS);
      if (method === 'DELETE') {
        const filtered = products.filter(p => p.id !== id);
        setLocalData('mock_products', filtered);
        responseData = { success: true };
      }
    }

    // 4. Cooperatives
    else if (cleanPath === '/cooperatives') {
      const coops = getLocalData<any[]>('mock_cooperatives', DEFAULT_COOPERATIVES);
      if (method === 'GET') {
        responseData = coops;
      } else if (method === 'POST') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const newCoop = { ...body, id: 'HTX-' + (coops.length + 1).toString().padStart(3, '0'), status: 'active' };
        coops.push(newCoop);
        setLocalData('mock_cooperatives', coops);
        responseData = newCoop;
      }
    } else if (segments[0] === 'cooperatives' && segments.length === 2) {
      const id = segments[1];
      const coops = getLocalData<any[]>('mock_cooperatives', DEFAULT_COOPERATIVES);
      if (method === 'GET') {
        responseData = coops.find(c => c.id === id);
      } else if (method === 'PUT') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const index = coops.findIndex(c => c.id === id);
        if (index !== -1) {
          coops[index] = { ...coops[index], ...body };
          setLocalData('mock_cooperatives', coops);
          responseData = coops[index];
        }
      } else if (method === 'DELETE') {
        const filtered = coops.filter(c => c.id !== id);
        setLocalData('mock_cooperatives', filtered);
        responseData = { success: true };
      }
    }

    // 5. Farmers
    else if (cleanPath === '/farmers') {
      const farmers = getLocalData<any[]>('mock_farmers', DEFAULT_FARMERS);
      if (method === 'GET') {
        responseData = farmers;
      } else if (method === 'POST') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const newFar = { ...body, id: 'farmer-' + Date.now(), status: 'active' };
        farmers.push(newFar);
        setLocalData('mock_farmers', farmers);
        responseData = newFar;
      }
    } else if (segments[0] === 'farmers' && segments.length === 2) {
      const id = segments[1];
      if (method === 'DELETE') {
        const farmers = getLocalData<any[]>('mock_farmers', DEFAULT_FARMERS);
        const filtered = farmers.filter(f => f.id !== id && f.phone !== id);
        setLocalData('mock_farmers', filtered);
        responseData = { success: true };
      }
    } else if (cleanPath === '/farmers/requests') {
      responseData = { success: true };
    }

    // 6. Contracts
    else if (cleanPath === '/contracts') {
      const contracts = getLocalData<any[]>('mock_contracts', []);
      if (method === 'GET') {
        responseData = contracts;
      } else if (method === 'POST') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const newCont = { ...body, id: 'HD-' + Date.now().toString().substring(6), status: 'pending_coop' };
        contracts.push(newCont);
        setLocalData('mock_contracts', contracts);
        responseData = newCont;
      }
    } else if (segments[0] === 'contracts' && segments.length === 2) {
      const id = segments[1];
      const contracts = getLocalData<any[]>('mock_contracts', []);
      const index = contracts.findIndex(c => c.id === id);
      if (method === 'PUT' && index !== -1) {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        contracts[index] = { ...contracts[index], ...body };
        setLocalData('mock_contracts', contracts);
        responseData = contracts[index];
      }
    } else if (segments[0] === 'contracts' && segments.length === 3 && segments[2] === 'status') {
      const id = segments[1];
      const contracts = getLocalData<any[]>('mock_contracts', []);
      const index = contracts.findIndex(c => c.id === id);
      if (index !== -1) {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        contracts[index].status = body.status;
        if (body.notes) {
          contracts[index].notes = body.notes;
        }
        setLocalData('mock_contracts', contracts);
        responseData = contracts[index];
      }
    }

    // 7. System Stats & Policies
    else if (cleanPath === '/system/statistics') {
      responseData = DEFAULT_STATISTICS;
    } else if (cleanPath === '/system/policies') {
      responseData = DEFAULT_SYSTEM_POLICIES;
    } else if (segments[0] === 'system' && segments[1] === 'policies') {
      responseData = { success: true };
    } else if (cleanPath === '/system/logs') {
      responseData = [
        { id: '1', action: 'Login', user: 'trongtriww@gmail.com', time: new Date().toISOString() },
        { id: '2', action: 'Fetch Products', user: 'system', time: new Date().toISOString() }
      ];
    } else if (cleanPath === '/admin/accounts') {
      responseData = getLocalData('mock_admin_accounts', []);
    } else if (segments[0] === 'admin' && segments[1] === 'accounts') {
      const id = segments[2];
      const accounts = getLocalData<any[]>('mock_admin_accounts', []);
      if (method === 'POST') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const newAcc = { ...body, id: 'adm-' + Date.now(), status: 'active' };
        accounts.push(newAcc);
        setLocalData('mock_admin_accounts', accounts);
        responseData = newAcc;
      } else if (method === 'PUT') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const index = accounts.findIndex(a => a.id === id);
        if (index !== -1) {
          accounts[index] = { ...accounts[index], ...body };
          setLocalData('mock_admin_accounts', accounts);
          responseData = accounts[index];
        }
      } else if (method === 'DELETE') {
        const filtered = accounts.filter(a => a.id !== id);
        setLocalData('mock_admin_accounts', filtered);
        responseData = { success: true };
      }
    }

    // 7.5. Enterprises
    else if (cleanPath === '/enterprises') {
      const pendingRaw = getLocalData<any[]>('vietagri_pending_enterprises_v2', []);
      const activeRaw = getLocalData<any[]>('vietagri_active_enterprises_v2', [
        {
          id: 'ENT-001',
          name: 'Công ty Cổ phần Nông sản Sạch Việt Nam',
          taxCode: '0101234567',
          representative: 'Phạm Minh Toàn',
          phone: '0913112244',
          email: 'toan.pham@vietagrimkt.vn',
          industry: 'Thu mua & Phân phối nông sản',
          status: 'active',
          createdAt: '2026-05-15T08:00:00Z',
          approvedAt: '2026-05-16T09:00:00Z',
          tempPassword: 'Approved'
        }
      ]);

      if (method === 'GET') {
        const queryParams = config.params || {};
        const qStatus = queryParams.status;
        if (qStatus === 'pending') {
          responseData = pendingRaw;
        } else if (qStatus === 'active') {
          responseData = activeRaw;
        } else {
          responseData = [...pendingRaw, ...activeRaw];
        }
      }
    } else if (segments[0] === 'enterprises' && segments.length === 3 && segments[2] === 'status') {
      const id = segments[1];
      const pendingRaw = getLocalData<any[]>('vietagri_pending_enterprises_v2', []);
      const activeRaw = getLocalData<any[]>('vietagri_active_enterprises_v2', [
        {
          id: 'ENT-001',
          name: 'Công ty Cổ phần Nông sản Sạch Việt Nam',
          taxCode: '0101234567',
          representative: 'Phạm Minh Toàn',
          phone: '0913112244',
          email: 'toan.pham@vietagrimkt.vn',
          industry: 'Thu mua & Phân phối nông sản',
          status: 'active',
          createdAt: '2026-05-15T08:00:00Z',
          approvedAt: '2026-05-16T09:00:00Z',
          tempPassword: 'Approved'
        }
      ]);

      if (method === 'PUT') {
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const newStatus = body?.status;
        
        let foundEnt = pendingRaw.find(e => e.id === id);
        if (!foundEnt) {
          foundEnt = activeRaw.find(e => e.id === id);
        }

        if (foundEnt) {
          if (newStatus === 'active') {
            const updatedPending = pendingRaw.filter(e => e.id !== id);
            const activeEnt = {
              ...foundEnt,
              status: 'active',
              approvedAt: new Date().toISOString(),
              tempPassword: '123456'
            };
            const updatedActive = [activeEnt, ...activeRaw.filter(e => e.id !== id)];
            
            // Also add enterprise to registered accounts so they can log in
            const mockAccounts = getLocalData<any[]>('mock_accounts_v2', []);
            if (!mockAccounts.some(acc => acc.email === activeEnt.email)) {
              mockAccounts.push({
                email: activeEnt.email,
                phone: activeEnt.phone,
                role: 'customer',
                name: activeEnt.name,
                password: '123456'
              });
              setLocalData('mock_accounts_v2', mockAccounts);
            }

            setLocalData('vietagri_pending_enterprises_v2', updatedPending);
            setLocalData('vietagri_active_enterprises_v2', updatedActive);
            responseData = activeEnt;
          } else if (newStatus === 'rejected') {
            const updatedPending = pendingRaw.filter(e => e.id !== id);
            const updatedActive = activeRaw.filter(e => e.id !== id);
            setLocalData('vietagri_pending_enterprises_v2', updatedPending);
            setLocalData('vietagri_active_enterprises_v2', updatedActive);
            responseData = { success: true };
          } else if (newStatus === 'locked' || newStatus === 'active') {
            const updatedActive = activeRaw.map(e => e.id === id ? { ...e, status: newStatus } : e);
            setLocalData('vietagri_active_enterprises_v2', updatedActive);
            responseData = { ...foundEnt, status: newStatus };
          }
        } else {
          responseData = { error: 'Not found' };
        }
      }
    } else if (segments[0] === 'enterprises' && segments.length === 2) {
      const id = segments[1];
      const pendingRaw = getLocalData<any[]>('vietagri_pending_enterprises_v2', []);
      const activeRaw = getLocalData<any[]>('vietagri_active_enterprises_v2', []);

      if (method === 'DELETE') {
        const updatedPending = pendingRaw.filter(e => e.id !== id);
        const updatedActive = activeRaw.filter(e => e.id !== id);
        setLocalData('vietagri_pending_enterprises_v2', updatedPending);
        setLocalData('vietagri_active_enterprises_v2', updatedActive);
        responseData = { success: true };
      }
    }

    // 8. Other Fallbacks
    else {
      // General fallbacks for harvests, deliveries, enterprises, members, staff, etc.
      if (cleanPath === '/harvests' || cleanPath === '/deliveries/pending' || cleanPath === '/staff' || cleanPath === '/members/pending' || cleanPath === '/transactions') {
        responseData = [];
      } else {
        responseData = {};
      }
    }
  } catch (err) {
    console.error('Error in mock API adapter:', err);
    responseStatus = 500;
  }

  // Double check null data
  if (responseData === null) {
    responseData = {};
  }

  return {
    data: responseData,
    status: responseStatus,
    statusText: responseStatus === 200 ? 'OK' : 'Internal Server Error',
    headers: config.headers || {},
    config: config,
    request: {}
  };
};

