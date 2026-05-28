import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Package, 
  BarChart3, 
  Map as MapIcon, 
  Newspaper, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Wallet,
  LogOut,
  Search,
  Bell,
  Eye,
  ChevronRight,
  PlusCircle,
  Image as ImageIcon,
  Zap,
  Sprout,
  MapPin,
  Building2,
  Calendar,
  FileSignature,
  FileText,
  Handshake,
  Clock,
  Landmark,
  Lock,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  CreditCard,
  Edit2,
  Pencil,
  Trash2,
  User,
  IdCard,
  Phone,
  ArrowRight,
  ChevronDown,
  Navigation,
  Briefcase,
  ShieldCheck,
  Shield,
  Globe,
  Map,
  GraduationCap,
  Building,
  Mail,
  Scale,
  Printer,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { PROVINCES, WARDS_MAP } from '../../data';

const COOPERATIVES = [
    { id: 'HTX-001', name: 'HTX Cà phê Cầu Đất' },
    { id: 'HTX-002', name: 'HTX Hoa Đà Lạt' },
    { id: 'HTX-003', name: 'HTX Nông sản Đức Trọng' },
    { id: 'HTX-004', name: 'HTX Rừng Thông Lâm Đồng' },
    { id: 'HTX-005', name: 'HTX Công Nghệ Cao Q1' },
    { id: 'HTX-006', name: 'HTX Bình Thạnh Xanh' },
    { id: 'HTX-007', name: 'HTX Ba Đình Organic' },
    { id: 'HTX-008', name: 'HTX Hải Châu Nông Sản' },
    { id: 'HTX-009', name: 'HTX Cầu Giấy Xanh' },
    { id: 'HTX-010', name: 'HTX Thanh Khê Hải Sản' },
    { id: 'HTX-011', name: 'HTX Ninh Kiều Nông Sản' },
    { id: 'HTX-012', name: 'HTX Nông nghiệp Quận 2' },
    { id: 'HTX-013', name: 'HTX Công nghệ Thủ Đức' },
    { id: 'HTX-014', name: 'HTX Hoàn Kiếm Nông Sản' },
    { id: 'HTX-015', name: 'HTX Sơn Trà Hải Sản' },
    { id: 'HTX-016', name: 'HTX Cái Răng Nông Sản' },
];

const LOCAL_WARDS_MAP: Record<string, string[]> = {
  'Lâm Đồng': ['Cầu Đất', 'Xuân Trường', 'Trạm Hành', 'Lạc Dương'],
  'Đắk Lắk': ['Buôn Ma Thuột', 'Krông Pắc', 'Cư M\'gar'],
  'Gia Lai': ['Chư Sê', 'Đắk Đoa', 'Pleiku'],
  'Sơn La': ['Mộc Châu', 'Mai Sơn', 'Yên Châu'],
  'Hưng Yên': ['Khoái Châu', 'Kim Động', 'Vân Giang'],
  'Thái Nguyên': ['Đại Từ', 'Phú Lương', 'Đồng Hỷ'],
  'Sóc Trăng': ['Mỹ Xuyên', 'Trần Đề', 'Vĩnh Châu'],
};

interface CooperativeConfig {
  province: string;
  crops: string[];
}

const COOPERATIVE_CONFIGS: Record<string, CooperativeConfig> = {
  'HTX-001': { province: 'Lâm Đồng', crops: ['Cà phê Arabica', 'Chè ô long', 'Dâu tây Đà Lạt'] },
  'HTX-002': { province: 'Lâm Đồng', crops: ['Hoa cúc', 'Hoa hồng', 'Xà lách thủy canh'] },
  'HTX-003': { province: 'Lâm Đồng', crops: ['Súp lơ', 'Ớt chuông', 'Cà chua VietGAP'] },
  'HTX-004': { province: 'Lâm Đồng', crops: ['Thông lấy nhựa', 'Atiso', 'Hạt mác ca'] },
  'HTX-005': { province: 'Đắk Lắk', crops: ['Sầu riêng Ri6', 'Cà phê Robusta', 'Bơ sáp'] },
  'HTX-006': { province: 'Sơn La', crops: ['Mận hậu', 'Xoài tròn Yên Châu', 'Nhãn xuồng'] },
  'HTX-007': { province: 'Gia Lai', crops: ['Hồ tiêu', 'Chanh dây', 'Cà phê Robusta'] },
  'HTX-008': { province: 'Hưng Yên', crops: ['Nhãn lồng', 'Mật ong hoa nhãn', 'Sen Hưng Yên'] },
  'HTX-009': { province: 'Thái Nguyên', crops: ['Trà Tân Cương', 'Chè trung du', 'Măng lục trúc'] },
  'HTX-010': { province: 'Sóc Trăng', crops: ['Lúa ST25', 'Hành tím Vĩnh Châu', 'Tôm thẻ chân trắng'] },
  'HTX-011': { province: 'Đắk Lắk', crops: ['Cà phê nhân', 'Hồ tiêu hữu cơ', 'Sầu riêng Dona'] },
  'HTX-012': { province: 'Gia Lai', crops: ['Sắn dây', 'Đậu nành', 'Ngô lai'] },
  'HTX-013': { province: 'Lâm Đồng', crops: ['Rau bó xôi', 'Bắp cải tí hon', 'Dâu tây thủy canh'] },
  'HTX-014': { province: 'Đắk Lắk', crops: ['Ca cao', 'Hạt điều', 'Mãng cầu xiêm'] },
  'HTX-015': { province: 'Sóc Trăng', crops: ['Gạo tài nguyên', 'Vú sữa hoàng kim', 'Bưởi năm roi'] },
  'HTX-016': { province: 'Đắk Lắk', crops: ['Mắc ca Đắk Lắk', 'Tiêu sọ', 'Sầu riêng chín hóa'] },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminProfile, setAdminProfile] = useState<{ name: string; htxName: string; cooperativeId: string; adminId: string } | null>(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const { data: user } = await authService.me();
      
      if (user && user.role !== 'customer' && user.passwordChanged === false) {
          navigate('/admin/change-password');
          return;
      }
      
      const storedAdmins = localStorage.getItem('registered_admins');
      if (storedAdmins && user.phone) {
        try {
          const admins = JSON.parse(storedAdmins);
          if (Array.isArray(admins)) {
            const admin = admins.find((a: any) => a.phone === user.phone);
            if (admin) {
               const htx = COOPERATIVES.find(c => c.id === admin.cooperativeId);
               setAdminProfile({
                 name: admin.name,
                 htxName: htx ? htx.name : 'Chưa rõ HTX',
                 cooperativeId: admin.cooperativeId || 'HTX-001',
                 adminId: admin.phone || 'ADMIN-001'
               });
            } else {
               setAdminProfile({
                 name: 'Admin',
                 htxName: 'HTX Cà phê Cầu Đất',
                 cooperativeId: 'HTX-001',
                 adminId: 'ADMIN-001'
               });
            }
          }
        } catch (e) {
          console.error(e);
          setAdminProfile({
            name: 'Admin',
            htxName: 'HTX Cà phê Cầu Đất',
            cooperativeId: 'HTX-001',
            adminId: 'ADMIN-001'
          });
        }
      } else {
        setAdminProfile({
          name: 'Admin',
          htxName: 'HTX Cà phê Cầu Đất',
          cooperativeId: 'HTX-001',
          adminId: 'ADMIN-001'
        });
      }
    };
    fetchAdminProfile();
  }, []);
  const [activeFarmers, setActiveFarmers] = useState<any[]>(() => {
    const saved = localStorage.getItem('vietagri_active_farmers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'F-001', name: 'Lê Văn Tám', province: 'Đắk Nông', area: '3.0 ha', phone: '001', password: '001', cooperativeId: 'HTX-005', crops: [
        { name: 'Cà phê Arabica', type: 'perennial', area: 'Đắk Nông', seasonNumber: 1 },
        { name: 'Bơ sáp', type: 'perennial', area: 'Bảo Lộc', seasonNumber: 1 }
      ]},
      { id: 'F-002', name: 'Phạm Văn Hùng', province: 'Gia Lai', area: '1.5 ha', phone: '002', password: '002', cooperativeId: 'HTX-007', crops: [
        { name: 'Hồ tiêu', type: 'perennial', area: 'Gia Lai', seasonNumber: 1 }
      ]},
      { id: 'F-003', name: 'Lương Thị Hạnh', province: 'Lâm Đồng', area: '2.0 ha', phone: '003', password: '003', cooperativeId: 'HTX-001', crops: [
        { name: 'Dâu tây Đà Lạt', type: 'short-term', area: 'Đà Lạt', seasonNumber: 1 },
        { name: 'Xà lách thủy canh', type: 'short-term', area: 'Đà Lạt', seasonNumber: 1 }
      ]},
      { id: 'F-004', name: 'Nguyễn Văn An', province: 'Lâm Đồng', area: '2.5 ha', phone: '004', password: '004', cooperativeId: 'HTX-001', crops: [
        { name: 'Cà phê Arabica', type: 'perennial', area: 'Lâm Đồng', seasonNumber: 1 }
      ]}
    ];
  });

  useEffect(() => {
    localStorage.setItem('vietagri_active_farmers', JSON.stringify(activeFarmers));
  }, [activeFarmers]);

  const [isViewAllMembersOpen, setIsViewAllMembersOpen] = useState(false);
  const [isFarmerListOverlayOpen, setIsFarmerListOverlayOpen] = useState(false);
  const [selectedFarmerDetails, setSelectedFarmerDetails] = useState<any>(null);
  const [farmerToDelete, setFarmerToDelete] = useState<string | null>(null);
  const [isViewAllPendingModalOpen, setIsViewAllPendingModalOpen] = useState(false);
  const [isAgriculturalRequestsModalOpen, setIsAgriculturalRequestsModalOpen] = useState(false);
  const [pendingListSearch, setPendingListSearch] = useState('');
  const [pendingListFilter, setPendingListFilter] = useState<'all' | 'registration' | 'crop' | 'request'>('all');
  const [isViewAllStaffModalOpen, setIsViewAllStaffModalOpen] = useState(false);
  const [isViewAllIndividualContractsModalOpen, setIsViewAllIndividualContractsModalOpen] = useState(false);
  const [isViewAllB2BContractsModalOpen, setIsViewAllB2BContractsModalOpen] = useState(false);
  const [staffListSearch, setStaffListSearch] = useState('');
  const [individualContractsSearch, setIndividualContractsSearch] = useState('');
  const [b2bContractsSearch, setB2BContractsSearch] = useState('');

  // States for Reports - Agricultural support requests distribution management
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [reportFilterGroup, setReportFilterGroup] = useState<'all' | 'Cấp cây giống' | 'Cấp phân bón' | 'Cấp thuốc BVTV' | 'Hỗ trợ kỹ thuật'>('all');
  const [reportFilterStatus, setReportFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [distributingRequest, setDistributingRequest] = useState<any>(null);
  const [distributionForm, setDistributionForm] = useState({
    deliveryDate: new Date().toISOString().split('T')[0],
    warehouse: 'Kho HTX Trung Tâm',
    actualQty: '100',
    unit: 'kg', // or bao, cay, lit, v.v.
    coordinator: 'Nguyễn Văn Cảnh',
    notes: 'Cử cán bộ kỹ thuật và cấp vật tư chuẩn đạt chứng chỉ hữu cơ.'
  });

  const [activeTab, setActiveTab ] = useState<'members' | 'products' | 'reports' | 'post_product' | 'qc' | 'contracts' | 'finances' | 'network'>('members');
  const [contractSubTab, setContractSubTab] = useState<'all' | 'approve'>('all');

  const isStateHandled = useRef(false);

  useEffect(() => {
    const navState = location.state as any;
    if (navState && navState.activeTab && !isStateHandled.current) {
      isStateHandled.current = true;
      setActiveTab(navState.activeTab);
      if (navState.subTab) {
        setContractSubTab(navState.subTab);
      }
      if (navState.toast) {
        setToastMessage(navState.toast);
      }
      
      // Navigate to clear state without manual history manipulation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('Tất cả');
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [isStaffAccountModalOpen, setIsStaffAccountModalOpen] = useState(false);
  const [isMemberDetailsModalOpen, setIsMemberDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [staffAccounts, setStaffAccounts] = useState<any[]>([
    { id: 'XV-001-HTX001-ADMIN001', memberId: 'XV-001', cooperativeId: 'HTX-001', createdByAdminId: 'ADMIN-001', name: 'Trần Thị Thu Thủy', phone: '0901112224', cccd: '079204001234', role: 'Kế toán HTX', password: 'htx001234', createdAt: '16/05/2026' },
    { id: 'XV-002-HTX001-ADMIN001', memberId: 'XV-002', cooperativeId: 'HTX-001', createdByAdminId: 'ADMIN-001', name: 'Nguyễn Thanh Tùng', phone: '0901112225', cccd: '079204005678', role: 'Nhân viên Thu mua', password: 'htx005678', createdAt: '16/05/2026' },
    { id: 'XV-003-HTX001-ADMIN001', memberId: 'XV-003', cooperativeId: 'HTX-001', createdByAdminId: 'ADMIN-001', name: 'Lê Văn Thắng', phone: '0901112226', cccd: '079204009101', role: 'Nhân viên Kho', password: 'htx009101', createdAt: '16/05/2026' },
    { id: 'XV-004-HTX001-ADMIN001', memberId: 'XV-004', cooperativeId: 'HTX-001', createdByAdminId: 'ADMIN-001', name: 'Phạm Minh Trí', phone: '0901112227', cccd: '079204001112', role: 'Quản lý Vùng trồng', password: 'htx001112', createdAt: '16/05/2026' },
  ]);

  // Sync / load staff accounts from registered_admins in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('registered_admins');
    const defaults = [
      { id: 'XV-001-HTX001-ADMIN001', memberId: 'XV-001', cooperativeId: 'HTX-001', createdByAdminId: 'ADMIN-001', name: 'Trần Thị Thu Thủy', phone: '0901112224', cccd: '079204001234', role: 'Kế toán HTX', password: 'htx001234', createdAt: '16/05/2026' },
      { id: 'XV-002-HTX001-ADMIN001', memberId: 'XV-002', cooperativeId: 'HTX-001', createdByAdminId: 'ADMIN-001', name: 'Nguyễn Thanh Tùng', phone: '0901112225', cccd: '079204005678', role: 'Nhân viên Thu mua', password: 'htx005678', createdAt: '16/05/2026' },
      { id: 'XV-003-HTX001-ADMIN001', memberId: 'XV-003', cooperativeId: 'HTX-001', createdByAdminId: 'ADMIN-001', name: 'Lê Văn Thắng', phone: '0901112226', cccd: '079204009101', role: 'Nhân viên Kho', password: 'htx009101', createdAt: '16/05/2026' },
      { id: 'XV-004-HTX001-ADMIN001', memberId: 'XV-004', cooperativeId: 'HTX-001', createdByAdminId: 'ADMIN-001', name: 'Phạm Minh Trí', phone: '0901112227', cccd: '079204001112', role: 'Quản lý Vùng trồng', password: 'htx001112', createdAt: '16/05/2026' },
    ];

    let parsedAdmins = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) parsedAdmins = parsed;
      } catch (e) {}
    }
    let modified = false;

    // Seed defaults into registered_admins so they can always log in
    defaults.forEach(d => {
      if (!parsedAdmins.some((a: any) => a.phone === d.phone)) {
        parsedAdmins.push({
          ...d,
          passwordChanged: true
        });
        modified = true;
      }
    });

    if (modified) {
      localStorage.setItem('registered_admins', JSON.stringify(parsedAdmins));
    }

    const currentHtxId = adminProfile?.cooperativeId || 'HTX-001';

    // Filter out all staff with typical staff roles that belong to current HTX
    const staffFromStorage = parsedAdmins.filter((u: any) => 
      u.cooperativeId === currentHtxId && (
        u.role === 'Nhân viên' || 
        u.role === 'Kế toán HTX' || 
        u.role === 'Nhân viên Thu mua' || 
        u.role === 'Nhân viên Kho' || 
        u.role === 'Quản lý Vùng trồng' ||
        u.role === 'farmer'
      )
    );

    const seenPhones = new Set<string>();
    const uniqueList: any[] = [];
    
    // Add defaults that match current HTX
    defaults.forEach(d => {
      if (d.cooperativeId === currentHtxId) {
        seenPhones.add(d.phone);
        uniqueList.push(d);
      }
    });

    staffFromStorage.forEach((s: any) => {
      if (!seenPhones.has(s.phone)) {
        seenPhones.add(s.phone);
        uniqueList.push(s);
      }
    });

    setStaffAccounts(uniqueList);
  }, [adminProfile]);

  const [newStaffAccount, setNewStaffAccount] = useState({
    name: '',
    phone: '',
    cccd: '',
    province: 'Lâm Đồng',
    ward: '',
    address: '',
    crop: 'Cà phê Arabica',
    role: 'farmer'
  });
  const [createdStaffResult, setCreatedStaffResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isStaffAccountModalOpen) {
      const activeCoopId = adminProfile?.cooperativeId || 'HTX-001';
      const config = COOPERATIVE_CONFIGS[activeCoopId] || { province: 'Lâm Đồng', crops: ['Cà phê Arabica'] };
      const defaultWard = (LOCAL_WARDS_MAP[config.province] || [])[0] || '';
      const defaultCrop = (config.crops && config.crops.length > 0) ? config.crops[0] : '';
      setNewStaffAccount(prev => ({
        ...prev,
        province: config.province,
        ward: defaultWard,
        crop: defaultCrop,
        role: 'farmer'
      }));
    }
  }, [isStaffAccountModalOpen, adminProfile]);

  const closeStaffModal = () => {
    setIsStaffAccountModalOpen(false);
    setCreatedStaffResult(null);
    setCopied(false);
    setNewStaffAccount({
      name: '',
      phone: '',
      cccd: '',
      province: 'Lâm Đồng',
      ward: '',
      address: '',
      crop: 'Cà phê Arabica'
    });
  };

  const handleCreateStaffAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const baseDigits = newStaffAccount.cccd.replace(/\D/g, '').slice(-6) || Math.floor(100000 + Math.random() * 900000).toString();
    const generatedPassword = 'htx' + baseDigits;

    const coopId = adminProfile?.cooperativeId || 'HTX-001';
    const adminId = adminProfile?.adminId || 'ADMIN-001';
    const memberSequence = String(activeFarmers.length + 1).padStart(3, '0');
    const compositeId = `F-${memberSequence}`;

    const newFarmer = {
      id: compositeId,
      memberId: compositeId,
      cooperativeId: coopId,
      createdByAdminId: adminId,
      name: newStaffAccount.name,
      phone: newStaffAccount.phone,
      cccd: newStaffAccount.cccd,
      province: newStaffAccount.province,
      ward: newStaffAccount.ward,
      address: newStaffAccount.address,
      crop: newStaffAccount.crop,
      area: '1.5 ha',
      password: generatedPassword,
      role: 'farmer',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      crops: [
        { name: newStaffAccount.crop, type: 'perennial', area: newStaffAccount.province }
      ]
    };

    setActiveFarmers([newFarmer, ...activeFarmers]);

    const savedAdmins = localStorage.getItem('registered_admins');
    const parsedAdmins = savedAdmins ? JSON.parse(savedAdmins) : [];
    
    const accountForAuth = {
      name: newFarmer.name,
      phone: newFarmer.phone,
      cccd: newFarmer.cccd,
      role: 'farmer',
      cooperativeId: coopId,
      password: newFarmer.password,
      passwordChanged: true,
      memberId: newFarmer.id,
      createdByAdminId: adminId,
      id: newFarmer.id,
      createdAt: newFarmer.createdAt
    };

    if (!parsedAdmins.some((u: any) => u.phone === newFarmer.phone)) {
       parsedAdmins.push(accountForAuth);
       localStorage.setItem('registered_admins', JSON.stringify(parsedAdmins));
    }

    // Update staffAccounts state immediately so it shows in the list
    setStaffAccounts(prev => [accountForAuth, ...prev]);

    setCreatedStaffResult(newFarmer);
    setNewStaffAccount({
      name: '',
      phone: '',
      cccd: '',
      province: adminProfile?.cooperativeId ? (COOPERATIVE_CONFIGS[adminProfile.cooperativeId]?.province || 'Lâm Đồng') : 'Lâm Đồng',
      ward: '',
      address: '',
      crop: adminProfile?.cooperativeId ? (COOPERATIVE_CONFIGS[adminProfile.cooperativeId]?.crops[0] || 'Cà phê Arabica') : 'Cà phê Arabica',
      role: 'farmer'
    });
  };
  const [isAddingToCatalog, setIsAddingToCatalog] = useState(false);
  const [isPostingNewProduct, setIsPostingNewProduct] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  
  const [newSalePost, setNewSalePost] = useState({
    productName: '',
    price: '',
    target: 'Tất cả khách hàng',
    origin: '',
    description: '',
    images: [] as string[]
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setNewSalePost(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setNewSalePost(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Products Management State (Internal Catalog)
  const [products, setProducts] = useState([
    { id: 'SP-001', name: 'Cà phê Arabica Cầu Đất (Loại 1)', category: 'Cà phê', price: '450.000 ₫/kg', unit: 'kg', stock: '45.0 Tấn', status: 'Đang bán' },
    { id: 'SP-002', name: 'Sầu riêng Ri6 (Loại A)', category: 'Trái cây', price: '120.000 ₫/kg', unit: 'kg', stock: '12.0 Tấn', status: 'Đang bán' },
    { id: 'SP-003', name: 'Tiêu đen xô', category: 'Gia vị', price: '85.000 ₫/kg', unit: 'kg', stock: '88.5 Tấn', status: 'Đang bán' },
    { id: 'SP-004', name: 'Chanh dây xuất khẩu', category: 'Trái cây', price: '45.000 ₫/kg', unit: 'kg', stock: '8.2 Tấn', status: 'Sắp hết hàng' },
    { id: 'SP-005', name: 'Hạt điều rang muối', category: 'Hạt', price: '250.000 ₫/kg', unit: 'kg', stock: '0', status: 'Hết hàng' },
  ]);

  // Sale Posts (Publicly Selling)
  const [salePosts, setSalePosts] = useState(() => {
    const saved = localStorage.getItem('vietagri_sale_posts');
    if (saved) {
      try {
        const posts = JSON.parse(saved);
        if (Array.isArray(posts)) {
          // Ensure uniqueness
          return posts.filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => (t.id === v.id)) === i);
        }
      } catch (e) {}
    }
    return [
      { id: 'POST-001', title: 'Cà phê Arabica Cầu Đất Thượng Hạng', baseProduct: 'Cà phê Arabica Cầu Đất (Loại 1)', price: '450.000 ₫/kg', date: '12/03/2024', status: 'Đang hiển thị', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400', origin: 'Lâm Đồng', cooperativeId: 'HTX-001', cooperativeName: 'HTX Cà phê Cầu Đất' },
      { id: 'POST-002', title: 'Sầu riêng Ri6 VietGAP - Chín cây', baseProduct: 'Sầu riêng Ri6 (Loại A)', price: '120.000 ₫/kg', date: '10/03/2024', status: 'Đang hiển thị', image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=400', origin: 'Tiền Giang', cooperativeId: 'HTX-005', cooperativeName: 'HTX Công Nghệ Cao Q1' },
      { id: 'POST-003', title: 'Tiêu đen xô sạch - Giá sỉ', baseProduct: 'Tiêu đen xô', price: '85.000 ₫/kg', date: '08/03/2024', status: 'Đang hiển thị', image: 'https://images.unsplash.com/photo-1599940824399-b87587bc5b1c?auto=format&fit=crop&q=80&w=400', origin: 'Gia Lai', cooperativeId: 'HTX-007', cooperativeName: 'HTX Ba Đình Organic' },
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('vietagri_sale_posts', JSON.stringify(salePosts));
  }, [salePosts]);

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleDeletePost = (id: string) => {
    setPostToDelete(id);
  };

  const confirmDeletePost = () => {
    if (postToDelete) {
      setSalePosts((prev: any) => prev.filter((post: any) => post.id !== postToDelete));
      setPostToDelete(null);
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost({ 
      ...post, 
      simplePrice: post.price.split(' ')[0],
      images: post.images || (post.image ? [post.image] : [])
    });
    setIsEditingPost(true);
  };

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setSalePosts(salePosts.map((post: any) => 
      post.id === editingPost.id 
        ? { 
            ...post, 
            title: editingPost.title, 
            price: `${editingPost.simplePrice} ₫/${post.unit || 'kg'}`, 
            origin: editingPost.origin,
            description: editingPost.description,
            target: editingPost.target,
            images: editingPost.images,
            image: editingPost.images?.[0] || post.image
          } 
        : post
    ));
    setIsEditingPost(false);
    setEditingPost(null);
    alert('Cập nhật tin đăng thành công!');
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && editingPost) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setEditingPost({
        ...editingPost,
        images: [...(editingPost.images || []), ...newImages]
      });
    }
  };

  const removeEditImage = (index: number) => {
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        images: editingPost.images.filter((_: any, i: number) => i !== index)
      });
    }
  };

  const [newCatalogItem, setNewCatalogItem] = useState({
    name: '',
    category: 'Cà phê',
    basePrice: '',
    unit: 'kg'
  });

  const handleAddToCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `SP-${String(products.length + 1).padStart(3, '0')}`;
    const newItem = {
      id,
      cooperativeId: currentHtxId,
      name: newCatalogItem.name,
      category: newCatalogItem.category,
      price: `${newCatalogItem.basePrice} ₫/${newCatalogItem.unit}`,
      unit: newCatalogItem.unit,
      stock: '0',
      status: 'Đang bán'
    };
    setProducts([newItem, ...products]);
    setIsAddingToCatalog(false);
    setNewCatalogItem({ name: '', category: 'Cà phê', basePrice: '', unit: 'kg' });
  };


  const [allPendingMembers, setAllPendingMembers] = useState<any[]>([]);

  // Seed / load pending member registrations AND agricultural requests from localStorage
  useEffect(() => {
    let rawPending = localStorage.getItem('pending_registration_members');
    let rawRequests = localStorage.getItem('vietagri_farmer_requests');
    
    // Clear old mock data if it exists
    if (rawRequests) {
        try {
            const parsed = JSON.parse(rawRequests);
            if (Array.isArray(parsed)) {
                // Keep only newly generated ones with timestamp/Date.now() ids (which are > 100000)
                // IDs in the mock data were like 1001, 1002, etc.
                const filtered = parsed.filter(r => r.id > 100000);
                if (filtered.length !== parsed.length) {
                    localStorage.setItem('vietagri_farmer_requests', JSON.stringify(filtered));
                    rawRequests = JSON.stringify(filtered);
                }
            }
        } catch (e) { }
    }

    // Seed agricultural requests if empty
    if (!rawRequests) {
      const initialRequests: any[] = [];
      localStorage.setItem('vietagri_farmer_requests', JSON.stringify(initialRequests));
      rawRequests = JSON.stringify(initialRequests);
    }

    if (rawPending) {
        try {
            const parsed = JSON.parse(rawPending);
            if (Array.isArray(parsed)) {
                // Remove any leaked 'agricultural_request' or ones with "REQ-" 
                // and keeping only normal registration elements
                const filteredPending = parsed.filter(m => 
                    !m.id?.toString().startsWith('REQ-') && m.type !== 'agricultural_request'
                );
                if (filteredPending.length !== parsed.length) {
                    localStorage.setItem('pending_registration_members', JSON.stringify(filteredPending));
                    rawPending = JSON.stringify(filteredPending);
                }
            }
        } catch (e) { }
    }

    if (!rawPending) {
        const initialPending = [
            { id: '1', name: 'Nguyễn Văn An', phone: '0911001101', cccd: '123456789101', province: 'Lâm Đồng', ward: 'Cầu Đất', address: '12 Cầu Đất, Đà Lạt', cooperativeId: 'HTX-001', cooperativeName: 'HTX Cà phê Cầu Đất', crop: 'Cà phê Arabica', area: '2.5 ha', status: 'pending', createdAt: new Date().toISOString() },
            { id: '2', name: 'Trần Thị Bình', phone: '0912001102', cccd: '123456789102', province: 'Gia Lai', ward: 'Chư Sê', address: '45 Hùng Vương, Chư Sê', cooperativeId: 'HTX-007', cooperativeName: 'HTX Ba Đình Organic', crop: 'Hồ tiêu', area: '1.8 ha', status: 'pending', createdAt: new Date().toISOString() },
            { id: '3', name: 'Lê Hoàng Minh', phone: '0913001103', cccd: '123456789103', province: 'Đắk Lắk', ward: 'Buôn Ma Thuột', address: '89 Phan Chu Trinh', cooperativeId: 'HTX-005', cooperativeName: 'HTX Công Thế Hệ Mới', crop: 'Sầu riêng', area: '5.0 ha', status: 'pending', createdAt: new Date().toISOString() },
        ];
        localStorage.setItem('pending_registration_members', JSON.stringify(initialPending));
        rawPending = JSON.stringify(initialPending);
    }

    let parsedPending = [];
    let parsedRequests = [];
    
    try {
      const p = JSON.parse(rawPending);
      parsedPending = Array.isArray(p) ? p : [];
    } catch(e) {}

    try {
      const r = JSON.parse(rawRequests);
      parsedRequests = Array.isArray(r) ? r : [];
    } catch(e) {}

    // Transform requests into member format
    const transformedRequests = parsedRequests.map((r: any) => ({
      id: `REQ-${r.id}`,
      name: r.farmer,
      phone: r.phone || '0901223344',
      type: 'agricultural_request',
      cropName: r.requests?.join(', ') || 'Hỗ trợ khác',
      crop: r.custom || 'Yêu cầu hỗ trợ',
      area: 'N/A', 
      status: r.status || 'pending',
      cooperativeId: r.cooperativeId || 'HTX-001',
      timestamp: r.timestamp,
      distributionDetails: r.distributionDetails,
      requestsArr: r.requests || [],
      image: r.image
    }));

    setAllPendingMembers([...parsedPending, ...transformedRequests]);
  }, []);

  const currentHtxId = adminProfile?.cooperativeId || 'HTX-001';
  const formatDateSafe = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date.toLocaleDateString('vi-VN');
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[0]);
        const m = parseInt(parts[1]) - 1;
        const y = parseInt(parts[2]);
        const cDate = new Date(y, m, d);
        if (!isNaN(cDate.getTime())) return cDate.toLocaleDateString('vi-VN');
      }
    }
    return dateStr;
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const [approvedMemberInfo, setApprovedMemberInfo] = useState<{ name: string; phone: string; password: string; adminName: string; step: number } | null>(null);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<any>(null);
  const [isContractSigningOpen, setIsContractSigningOpen] = useState(false);
  const [isViewAllDeliveriesOpen, setIsViewAllDeliveriesOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [deliveryStatusNote, setDeliveryStatusNote] = useState('');
  const [isReceiptViewOpen, setIsReceiptViewOpen] = useState(false);
  const [receiptConfirmed, setReceiptConfirmed] = useState(false);

  const updateContractField = (path: string, value: any) => {
    const keys = path.split('.');
    setContractForm(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const [contractForm, setContractForm] = useState({
    contractNo: `${Math.floor(100 + Math.random() * 900)}/HĐHTSXNN`,
    date: new Date().toISOString().split('T')[0],
    location: 'Lâm Đồng',
    partyA: {
      name: '',
      cccd: '',
      cccdDatePlace: '20/10/2020 tại CA Lâm Đồng',
      address: '',
      phone: '',
      areaLocation: ''
    },
    partyB: {
      name: 'HỢP TÁC XÃ NÔNG NGHIỆP CẦU ĐẤT',
      address: 'Thôn Cầu Đất, Xã Xuân Trường, TP. Đà Lạt, Tỉnh Lâm Đồng',
      taxCode: '3700123456',
      rep: 'Lê Minh Anh',
      position: 'Chủ tịch HTX',
      phone: '0988777666',
      bankAccount: '123456789 - Ngân hàng Agribank'
    },
    product: {
      type: '',
      standard: 'VietGAP',
      areaScale: '',
      policies: ['Hỗ trợ kỹ thuật/đào tạo VietGAP'],
      rejectionDays: '3',
      traceability: true,
      quantity: '',
      unit: 'Tấn',
      frequency: 'Theo đợt thu hoạch vụ mùa',
      startTime: '',
      endTime: '',
      changeNoticeDays: '3',
      deliveryLocation: 'Tại rẫy/vườn của Bên A'
    },
    payment: {
      price: '',
      unit: 'Đồng/kg',
      priceAdjustment: 'Giá cố định suốt hợp đồng',
      method: 'Chuyển khoản ngân hàng',
      deadlineDays: '7'
    },
    notary: {
      feeBearer: 'Cả hai bên chia đôi (50/50)'
    },
    jurisdiction: {
      court: ''
    },
    validity: {
      startDate: '',
      endDate: '',
      totalCopies: '2',
      copiesPerParty: '1'
    }
  });

  useEffect(() => {
    if (selectedMemberDetail && isContractSigningOpen) {
      const cooperativeId = adminProfile?.cooperativeId || 'HTX-001';
      const config = COOPERATIVE_CONFIGS[cooperativeId];
      const htxName = adminProfile?.htxName || 'HỢP TÁC XÃ NÔNG NGHIỆP CẦU ĐẤT';
      
      // Calculate next sequential contract number
      const saved = localStorage.getItem('vietagri_contracts');
      let allContracts = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          allContracts = Array.isArray(parsed) ? parsed : [];
        } catch (e) {}
      }
      const filteredContracts = allContracts.filter((c: any) => c.cooperativeId === cooperativeId);
      const nextNo = String(filteredContracts.length + 1).padStart(2, '0');
      
      setContractForm(prev => ({
        ...prev,
        contractNo: `${nextNo}/${new Date().getFullYear()}/HĐHTSXNN`,
        location: config?.province || 'Lâm Đồng',
        partyA: {
          ...prev.partyA,
          name: selectedMemberDetail.name || '',
          cccd: selectedMemberDetail.cccd || '',
          address: selectedMemberDetail.address || selectedMemberDetail.province || '',
          phone: selectedMemberDetail.phone || '',
          areaLocation: `${selectedMemberDetail.ward || ''}, ${selectedMemberDetail.province || ''}`
        },
        partyB: {
          ...prev.partyB,
          name: htxName.toUpperCase(),
          address: config?.province ? `Trụ sở HTX tại ${config.province}` : 'Thôn Cầu Đất, Xã Xuân Trường, TP. Đà Lạt, Tỉnh Lâm Đồng',
          taxCode: '3700123456',
          rep: adminProfile?.name || 'Lê Minh Anh',
          position: 'Chủ Tịch Hợp Tác xã',
          phone: '0988777666',
          bankAccount: '123456789 - Ngân hàng Agribank'
        },
        product: {
          ...prev.product,
          type: selectedMemberDetail.cropName || selectedMemberDetail.crop || '',
          areaScale: selectedMemberDetail.area || '1.5 ha',
          quantity: '10',
          unit: 'Tấn',
          startTime: new Date().toISOString().split('T')[0],
          endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          rejectionDays: '3',
          changeNoticeDays: '5'
        },
        jurisdiction: {
          court: config?.province ? `Tòa án nhân dân ${config.province}` : 'Huyện Đức Hòa, Tỉnh Long An'
        },
        validity: {
          ...prev.validity,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }));
    }
  }, [selectedMemberDetail, isContractSigningOpen, adminProfile]);

  const updateDeliveryStatus = (id: string, newStatus: string) => {
    setPendingDeliveries(prev => prev.map(d => d.id === id ? { ...d, status: newStatus, note: deliveryStatusNote || d.note } : d));
    setToastMessage(`Đã cập nhật trạng thái: ${newStatus}`);
    setDeliveryStatusNote('');
    if (selectedDelivery?.id === id) {
      setSelectedDelivery(prev => ({ ...prev, status: newStatus }));
    }
  };

  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
  };

  const [memberToReject, setMemberToReject] = useState<string | null>(null);

  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const [isViewAllHarvestOpen, setIsViewAllHarvestOpen] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<any>(null);
  const [harvestToDelete, setHarvestToDelete] = useState<string | null>(null);

  const [harvestSchedules, setHarvestSchedules] = useState<any[]>(() => {
    const saved = localStorage.getItem('vietagri_harvest_schedules');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'HV-001', farmer: 'Lê Văn Tám', product: 'Cà phê Arabica', date: '2024-03-20', qty: '3.0 Tấn', area: 'Đắk Nông', batch: '', cooperativeId: 'HTX-001', timestamp: '2026-05-20T10:00:00Z' },
      { id: 'HV-002', farmer: 'Phạm Văn Hùng', product: 'Hồ tiêu', date: '2024-03-22', qty: '1.5 Tấn', area: 'Gia Lai', batch: '', cooperativeId: 'HTX-001', timestamp: '2026-05-21T09:00:00Z' },
    ];
  });

  const [pendingDeliveries, setPendingDeliveries] = useState<any[]>(() => {
    const saved = localStorage.getItem('vietagri_pending_qc_deliveries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'QC-1029', farmer: 'Nguyễn Văn Nam', product: 'Cà phê Arabica', actualQty: '2.5 Tấn', actualDate: 'Hôm nay', status: 'Chờ QC', cooperativeId: 'HTX-001', timestamp: '2026-05-23T07:00:00Z' },
      { id: 'QC-1030', farmer: 'Trần Thị Mai', product: 'Sầu riêng Ri6', actualQty: '1.2 Tấn', actualDate: 'Hôm qua', status: 'Đang QC', cooperativeId: 'HTX-001', timestamp: '2026-05-22T08:00:00Z' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vietagri_pending_qc_deliveries', JSON.stringify(pendingDeliveries));
  }, [pendingDeliveries]);

  // Contracts State
  const [contracts, setContracts] = useState<any[]>(() => {
    const saved = localStorage.getItem('vietagri_contracts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Error parsing vietagri_contracts:", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('vietagri_contracts', JSON.stringify(contracts));
  }, [contracts]);

  const [transactions, setTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem('vietagri_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'TX-001', title: 'Chi trả lương nhân viên', entity: 'Nội bộ HTX', amount: '-45.000.000', type: 'chi', date: '05/03/2024', status: 'Hoàn tất', cooperativeId: 'HTX-001' },
      { id: 'TX-002', title: 'Thu tiền bán Cà phê', entity: 'Bách Hóa Xanh', amount: '+220.000.000', type: 'thu', date: '10/03/2024', status: 'Hoàn tất', cooperativeId: 'HTX-001' },
      { id: 'TX-003', title: 'Thanh toán phân bón', entity: 'Cty Hiệp Phát', amount: '-85.000.000', type: 'chi', date: '12/03/2024', status: 'Hoàn tất', cooperativeId: 'HTX-001' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vietagri_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Filter active farmers that belong to the current cooperative
  const htxActiveFarmers = activeFarmers.filter(f => f.cooperativeId === currentHtxId);

  // Filtered data for the current cooperative
  const filteredSalePosts = salePosts.filter((post: any) => post.cooperativeId === currentHtxId);
  const filteredProducts = products.filter((product: any) => product.cooperativeId === currentHtxId || !product.cooperativeId); 
  const filteredHarvests = harvestSchedules.filter((h: any) => h.cooperativeId === currentHtxId);
  const pendingMembers = allPendingMembers.filter(m => m.cooperativeId === currentHtxId && m.status === 'pending');
  const filteredPendingList = pendingMembers.filter((m) => {
    // 1. Filter by Search Term (Name / crop / phone)
    const matchesSearch = 
      m.name?.toLowerCase().includes(pendingListSearch.toLowerCase()) ||
      m.cropName?.toLowerCase().includes(pendingListSearch.toLowerCase()) ||
      m.crop?.toLowerCase().includes(pendingListSearch.toLowerCase()) ||
      m.phone?.includes(pendingListSearch);

    if (!matchesSearch) return false;

    // 2. Filter by Request Type tab
    if (pendingListFilter === 'registration') {
      return m.type !== 'crop_approval' && m.type !== 'agricultural_request';
    }
    if (pendingListFilter === 'crop') {
      return m.type === 'crop_approval';
    }
    if (pendingListFilter === 'request') {
      return m.type === 'agricultural_request';
    }

    return true;
  });
  const filteredContracts = contracts.filter((c: any) => c.cooperativeId === currentHtxId);
  const filteredTransactions = transactions.filter((t: any) => t.cooperativeId === currentHtxId);

  const filteredStaffList = staffAccounts.filter((staff) => {
    if (!staffListSearch) return true;
    const term = staffListSearch.toLowerCase();
    return (
      staff.name?.toLowerCase().includes(term) ||
      staff.phone?.includes(term) ||
      staff.cccd?.includes(term) ||
      staff.role?.toLowerCase().includes(term) ||
      staff.id?.toLowerCase().includes(term)
    );
  });

  const stats = [
    { title: 'Tổng nông dân', value: htxActiveFarmers.length.toLocaleString(), icon: <Users size={20} />, color: 'bg-blue-500' },
    { title: 'Sản lượng tháng', value: (filteredHarvests.reduce((acc, h) => acc + parseFloat(h.qty || '0'), 0) || 45.2).toFixed(1) + ' Tấn', icon: <Package size={20} />, color: 'bg-forest' },
    { title: 'Doanh thu', value: '850M VNĐ', icon: <Wallet size={20} />, color: 'bg-amber' },
    { title: 'Tăng trưởng', value: '+12.5%', icon: <TrendingUp size={20} />, color: 'bg-mint' },
  ];

  React.useEffect(() => {
    const saved = localStorage.getItem('vietagri_harvest_schedules');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHarvestSchedules(parsed);
        }
      } catch (e) {
        console.error("Error parsing vietagri_harvest_schedules in useEffect:", e);
      }
    }

    // Load simple contracts
    let currentSimple: any[] = [];
    const savedContracts = localStorage.getItem('vietagri_contracts');
    if (savedContracts) {
      try {
        const parsed = JSON.parse(savedContracts);
        currentSimple = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        currentSimple = [];
      }
    }

    if (currentSimple.length === 0) {
      currentSimple = [];
    }

    // Synchronize latest B2B contracts from vietagri_contracts_v2 (created/saved by partners or in the contract designer)
    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
    if (rawV2) {
      try {
        const parsedV2 = JSON.parse(rawV2);
        if (Array.isArray(parsedV2)) {
          let hasChanges = false;

          parsedV2.forEach((v2: any) => {
            const matchedSimpleIndex = currentSimple.findIndex((s: any) => String(s.id) === String(v2.id));
            
            // Improved status mapping
            let simplifiedStatus = 'Chờ duyệt';
            if (v2.status === 'awaiting_signature') simplifiedStatus = 'Chờ ký duyệt';
            else if (v2.status === 'awaiting_farmer_signature') simplifiedStatus = 'Chờ nông dân ký';
            else if (v2.status === 'awaiting_admin_signature' || v2.status === 'Đang chờ ký (Admin)' || v2.status === 'in_progress' || v2.status === 'Đang thực hiện') simplifiedStatus = 'Đang thực hiện';
            else if (v2.status === 'signed') simplifiedStatus = (v2.type === 'individual' ? 'Nông dân đã ký' : 'Chờ DN ký');
            else if (v2.status === 'completed') simplifiedStatus = 'Đã hoàn tất';
            else if (v2.status === 'active') simplifiedStatus = 'Đang thực hiện';
            else if (v2.status === 'denied' || v2.status === 'rejected') simplifiedStatus = 'Đã từ chối';
            else if (v2.status === 'super_admin_approved' || v2.status === 'pending_super_admin') simplifiedStatus = 'Chờ duyệt';

            if (matchedSimpleIndex === -1) {
              const newContractSimple = {
                id: v2.id,
                contractNo: v2.contractNo || 'HĐ-XV-Chưa rõ',
                party: v2.type === 'individual' 
                  ? (v2.seller?.name || v2.coopName || 'Nông dân') 
                  : (v2.enterpriseName || v2.buyer?.name || 'Đối tác Liên kết'),
                cropName: v2.cropName || 'Nông sản',
                qty: v2.totalVolume || 'Không rõ sản lượng',
                status: simplifiedStatus,
                val: v2.totalVal ? `${(v2.totalVal / 1000000).toFixed(1)}M` : (v2.val || '0M'),
                amount: v2.amount || (v2.totalVal ? `${(v2.totalVal / 1000000).toFixed(1)} Triệu` : '0.1 Triệu'),
                type: v2.type || 'b2b',
                cooperativeId: v2.cooperativeId || (v2.type === 'individual' ? v2.seller?.id : v2.buyer?.id) || 'HTX-001',
                date: v2.deliveryTime || 'Gần đây'
              };
              currentSimple.push(newContractSimple);
              hasChanges = true;
            } else {
              const oldItem = currentSimple[matchedSimpleIndex];
              const newParty = v2.type === 'individual' 
                ? (v2.seller?.name || v2.coopName || oldItem.party) 
                : (v2.enterpriseName || v2.buyer?.name || oldItem.party);
              
              const newAmount = v2.amount || (v2.totalVal ? `${(v2.totalVal / 1000000).toFixed(1)} Triệu` : oldItem.amount);

              if (
                oldItem.status !== simplifiedStatus || 
                oldItem.party !== newParty ||
                oldItem.cropName !== v2.cropName ||
                oldItem.amount !== newAmount ||
                (v2.type && oldItem.type !== v2.type)
              ) {
                currentSimple[matchedSimpleIndex] = {
                  ...oldItem,
                  status: simplifiedStatus,
                  party: newParty,
                  cropName: v2.cropName || oldItem.cropName,
                  type: v2.type || oldItem.type,
                  amount: newAmount
                };
                hasChanges = true;
              }
            }
          });

          // Cleanup old mock data if exists
          const mockIds = ['HD-XV-2940', 'HD-XV-2941', 'HD-XV-2942', 'B2B-1029', 'B2B-1030', 'B2B-1031'];
          const initialLen = currentSimple.length;
          currentSimple = currentSimple.filter(s => !mockIds.includes(String(s.id)));
          if (currentSimple.length !== initialLen) hasChanges = true;

        if (hasChanges) {
          localStorage.setItem('vietagri_contracts', JSON.stringify(currentSimple));
        }
      }
    } catch (e) {
      console.error("Sync error:", e);
    }
  }

    setContracts(currentSimple);
  }, [activeTab]);

  const [selectedB2BContract, setSelectedB2BContract] = useState<any>(null);
  
  // Custom digital signing workflow states
  const [signingStep, setSigningStep] = useState<'idle' | 'pincode' | 'signing' | 'success'>('idle');
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [signProgress, setSignProgress] = useState<number>(0);
  const [signStatusMessage, setSignStatusMessage] = useState<string>('');

  // Standard Vietnamese financial number-to-words spelling helper
  const docSoTienBangChu = (soTien: number): string => {
    if (soTien === 0) return 'Không đồng';
    
    // Quick translation mapping for the expected mock contract values:
    if (soTien === 650000000) return 'Sáu trăm năm mươi triệu đồng chẵn';
    if (soTien === 220000000) return 'Hai trăm hai mươi triệu đồng chẵn';
    if (soTien === 350000000) return 'Ba trăm năm mươi triệu đồng chẵn';
    if (soTien === 850000000) return 'Tám trăm năm mươi triệu đồng chẵn';
    if (soTien === 180000000) return 'Một trăm tám mươi triệu đồng chẵn';
    if (soTien === 120000000) return 'Một trăm hai mươi triệu đồng chẵn';
    if (soTien === 250000000) return 'Hai trăm năm mươi triệu đồng chẵn';

    const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const Tien = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
    let str = "";
    let temp = soTien;
    let blocks = [];
    while (temp > 0) {
      blocks.push(temp % 1000);
      temp = Math.floor(temp / 1000);
    }

    const doc3ChuSo = (n: number, isLast: boolean): string => {
      let tram = Math.floor(n / 100);
      let chuc = Math.floor((n % 100) / 10);
      let donvi = n % 10;
      let s = "";
      if (tram > 0 || !isLast) {
        s += ChuSo[tram] + " trăm ";
      }
      if (chuc === 0) {
        if (donvi > 0 && (tram > 0 || !isLast)) {
          s += "lẻ ";
        }
      } else if (chuc === 1) {
        s += "mười ";
      } else {
        s += ChuSo[chuc] + " mươi ";
      }
      if (donvi === 1) {
        if (chuc > 1) s += "mốt";
        else s += "một";
      } else if (donvi === 5) {
        if (chuc > 0) s += "lăm";
        else s += "năm";
      } else if (donvi > 0) {
        s += ChuSo[donvi];
      }
      return s.trim();
    };

    for (let i = 0; i < blocks.length; i++) {
      let blockVal = blocks[i];
      if (blockVal > 0) {
        let bStr = doc3ChuSo(blockVal, i === blocks.length - 1);
        str = bStr + " " + Tien[i] + " " + str;
      }
    }
    
    str = str.trim() + " đồng chẵn";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleViewB2BContract = (simpleContract: any) => {
    // Reset digital signature states
    setSigningStep('idle');
    setPinInput('');
    setPinError('');
    setSignProgress(0);
    setSignStatusMessage('');

    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
    let detailed = null;
    if (rawV2) {
      try {
        const parsed = JSON.parse(rawV2);
        detailed = parsed.find((c: any) => String(c.id) === String(simpleContract.id) || String(c.contractNo) === String(simpleContract.contractNo));
      } catch (e) {}
    }
    
    if (detailed) {
      setSelectedB2BContract(detailed);
    } else {
      const mockDetailed = {
        id: simpleContract.id,
        contractNo: simpleContract.id || simpleContract.contractNo || 'HĐMB-2026/01',
        createdAt: new Date().toISOString(),
        status: simpleContract.status === 'Chờ duyệt' || simpleContract.status === 'pending_super_admin' ? 'pending_super_admin' : 'signed',
        totalVal: simpleContract.val === '650M' ? 650000000 : 
                  (simpleContract.val === '220M' ? 220000000 : 
                  (simpleContract.val === '350M' ? 350000000 : 
                  (simpleContract.val === '250M' ? 250000000 : 
                  (simpleContract.val === '180M' ? 180000000 : 120000000)))),
        cropName: simpleContract.qty?.includes('Cà phê') ? 'Cà phê Arabica Cầu Đất' :
                  (simpleContract.qty?.includes('Sầu') ? 'Sầu Riêng Ri6' : 'Nông sản Organic chất lượng cao'),
        totalVolume: simpleContract.qty || '5 Tấn',
        unitPrice: simpleContract.qty?.includes('Cà phê') ? '130.000 VNĐ / kg' : '90.000 VNĐ / kg',
        coopName: 'Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất',
        enterpriseName: simpleContract.party,
        paymentPhase1: '30%',
        paymentPhase2: '70%',
        paymentMethod: 'Chuyển khoản liên ngân hàng 24/7',
        deliveryTime: simpleContract.date || 'Thu hoạch và giao nhận trong vòng 15 ngày lấy hàng',
        deliveryLocation: 'Kho bãi vật lý bên Bán (Lâm Đồng)',
        seller: {
          name: 'Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất',
          taxCode: '3901284560',
          rep: 'Nguyễn Văn Hợp',
          position: 'Chủ tịch HĐQT / Giám đốc điều hành',
          phone: '0988777666',
          cccd: '068092004561',
          cccdDate: '15/08/2021',
          cccdPlace: 'Cục Cảnh sát QLHC về trật tự xã hội',
          fax: '02633 847 112',
          bankAcc: '999988887777',
          bankName: 'Ngân hàng Nông nghiệp & Phát triển Nông thôn Việt Nam (Agribank) - Chi nhánh Tỉnh Lâm Đồng',
          address: 'Khu phố 1, Huyện Đức Trọng, Tỉnh Lâm Đồng'
        },
        buyer: {
          name: simpleContract.party || 'Công ty Cổ phần Nông sản Sạch Việt Nam',
          taxCode: '0312345678',
          rep: 'Trần Văn Bảo',
          position: 'Giám đốc thu mua miền Nam',
          phone: '0912345678',
          cccd: '079093004455',
          cccdDate: '20/10/2020',
          cccdPlace: 'Cục Cảnh sát QLHC về trật tự xã hội',
          fax: '02838 123 456',
          bankAcc: '1029384756',
          bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank) - Chi nhánh Nam Sài Gòn',
          address: '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'
        }
      };
      setSelectedB2BContract(mockDetailed);
    }
  };

  const startDigitalSigningProcess = (contractId: string) => {
    setPinInput('');
    setPinError('');
    setSignProgress(0);
    setSignStatusMessage('');
    setSigningStep('pincode');
  };

  const handleVerifyPinAndSign = () => {
    if (pinInput !== '123456') {
      setPinError('Mã PIN chữ ký số không chính xác. Mặc định là 123456.');
      return;
    }

    setPinError('');
    setSigningStep('signing');
    setSignProgress(10);
    setSignStatusMessage('Đang kết nối thiết bị Token mật mã...');

    const statuses = [
      { prg: 25, msg: 'Đang giải mã Khóa riêng bảo mật (RSA 2048-bit Private Key)...' },
      { prg: 50, msg: 'Đang băm tệp nội dung Hợp đồng bằng thuật toán SHA-256...' },
      { prg: 75, msg: 'Đang nhúng Chứng thư số & Xác thực mốc thời gian pháp lý (Timestamp)...' },
      { prg: 90, msg: 'Đang mã hóa chữ ký khóa riêng và hoàn tất niêm phong tài liệu...' },
      { prg: 100, msg: 'Ký số hoàn tất! Đóng gói hợp đồng định dạng PDF/A chuẩn quốc gia.' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < statuses.length) {
        setSignProgress(statuses[currentIdx].prg);
        setSignStatusMessage(statuses[currentIdx].msg);
        currentIdx++;
      } else {
        clearInterval(interval);
        completeSigningApproved(selectedB2BContract.id);
      }
    }, 600);
  };

  const completeSigningApproved = (contractId: string) => {
    const updatedContracts = contracts.map((c: any) => {
      if (String(c.id) === String(contractId)) {
        return { ...c, status: 'signed' };
      }
      return c;
    });
    setContracts(updatedContracts);
    localStorage.setItem('vietagri_contracts', JSON.stringify(updatedContracts));

    let updatedSelected = null;
    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
    if (rawV2) {
      try {
        const parsedV2 = JSON.parse(rawV2);
        const updatedV2 = parsedV2.map((c: any) => {
          if (String(c.id) === String(contractId)) {
            const up = { ...c, status: 'signed' };
            updatedSelected = up;
            return up;
          }
          return c;
        });
        localStorage.setItem('vietagri_contracts_v2', JSON.stringify(updatedV2));
      } catch (e) {}
    }

    const rawV3 = localStorage.getItem('vietagri_contracts_v3');
    if (rawV3) {
      try {
        const parsedV3 = JSON.parse(rawV3);
        const updatedV3 = parsedV3.map((c: any) => {
          if (String(c.id) === String(contractId)) {
            return { ...c, status: 'signed' };
          }
          return c;
        });
        localStorage.setItem('vietagri_contracts_v3', JSON.stringify(updatedV3));
      } catch (e) {}
    }

    if (!updatedSelected) {
      updatedSelected = { ...selectedB2BContract, status: 'signed' };
    }

    setSelectedB2BContract(updatedSelected);
    setSigningStep('success');
    setToastMessage('Đã duyệt & hoàn tất ký số bảo mật chữ ký số thành công!');
  };

  const handleApproveB2BContract = (contractId: string) => {
    // Starts the beautiful interactive digital signing flow modal instead of direct change!
    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
    let detailed = null;
    if (rawV2) {
      try {
        const parsed = JSON.parse(rawV2);
        detailed = parsed.find((c: any) => String(c.id) === String(contractId));
      } catch (e) {}
    }
    
    if (!detailed) {
      detailed = contracts.find((c: any) => String(c.id) === String(contractId));
    }

    if (detailed) {
      setSelectedB2BContract(detailed);
    }
    startDigitalSigningProcess(contractId);
  };

  const handlePrintB2BContract = (c: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Không thể mở cửa sổ in. Vui lòng cho phép popup để tải bản in PDF.');
      return;
    }
    
    const moneyWords = docSoTienBangChu(c.totalVal || 650000000);
    const createdDate = new Date(c.createdAt || new Date());
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1;
    const year = createdDate.getFullYear();

    printWindow.document.write(`
      <html>
        <head>
          <title>Hop_Dong_Mua_Ban_${c.id || c.contractNo}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display&display=swap');
            body { 
              font-family: "Times New Roman", Times, serif; 
              padding: 50px 70px; 
              line-height: 1.6; 
              color: #111; 
              font-size: 14.5px; 
              background-color: #fff;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .uppercase { text-transform: uppercase; }
            .font-bold { font-weight: bold; }
            .underline { text-decoration: underline; }
            
            .national-header {
              text-align: center;
              font-size: 15px;
              font-weight: bold;
              line-height: 1.3;
              margin-bottom: 25px;
            }
            .national-header .submotto {
              font-weight: bold;
              font-size: 14px;
              margin-top: 2px;
            }
            .line-separator {
              margin: 4px auto 15px auto;
              width: 150px;
              border-bottom: 1.5px solid #000;
            }
            
            .contract-title {
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 30px;
              margin-bottom: 3px;
              letter-spacing: 0.5px;
            }
            .contract-no {
              font-size: 13.5px;
              font-family: Arial, sans-serif;
              margin-bottom: 25px;
            }
            
            .legal-basis {
              font-style: italic;
              margin-bottom: 25px;
              font-size: 14px;
              padding-left: 10px;
            }
            .legal-basis p {
              margin: 4px 0;
            }
            
            .party-header { 
              font-weight: bold; 
              font-size: 15px; 
              margin-top: 22px; 
              margin-bottom: 8px;
              text-transform: uppercase;
            }
            
            .party-details {
              margin-bottom: 12px;
              padding-left: 5px;
            }
            .party-details table {
              width: 100%;
              border: none !important;
            }
            .party-details td {
              border: none !important;
              padding: 2.5px 0 !important;
              font-size: 14px;
              vertical-align: top;
            }
            .dotted-fill {
              border-bottom: 1px dotted #777;
              font-weight: bold;
              padding-left: 4px;
            }
            
            .section-title {
              font-weight: bold;
              margin-top: 20px;
              margin-bottom: 8px;
              font-size: 14.5px;
            }
            
            table.commodity-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px; 
              margin-bottom: 12px; 
            }
            table.commodity-table th, table.commodity-table td { 
              border: 1px solid #000; 
              padding: 7px 10px; 
              text-align: left; 
              font-size: 13.5px; 
            }
            table.commodity-table th { 
              background-color: #f5f5f5; 
              font-weight: bold; 
              text-align: center;
            }
            
            .signatures-container { 
              display: flex; 
              justify-content: space-between; 
              margin-top: 50px; 
              page-break-inside: avoid;
            }
            .signature-box { 
              width: 46%; 
              text-align: center; 
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
            }
            .signature-label {
              font-weight: bold;
              font-size: 13.5px;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .signature-sub {
              font-style: italic;
              font-size: 12px;
              color: #444;
              margin-bottom: 15px;
            }
            
            /* Visual Stamp Styles */
            .stamp-wrapper {
              position: relative;
              height: 125px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 10px 0;
            }
            
            .cryptographic-meta {
              font-family: monospace, Courier, monospace;
              text-align: left;
              border: 1px solid #777;
              padding: 8px 10px;
              font-size: 10.5px;
              line-height: 1.35;
              color: #1a4f1a;
              background-color: #f7fbf7;
              border-radius: 4px;
              margin-top: 10px;
              width: 90%;
              box-shadow: 1px 1px 4px rgba(0,0,0,0.05);
            }
            
            @media print {
              body { 
                padding: 30px 40px; 
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="national-header">
            <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div class="submotto">Độc lập – Tự do – Hạnh phúc</div>
            <div class="line-separator"></div>
            
            <div class="contract-title">HỢP ĐỒNG MUA BÁN HÀNG HÓA</div>
            <div class="contract-no">Số: ${c.contractNo?.includes('/2026') ? c.contractNo : (c.contractNo || c.id?.split('-').pop() || '01') + '/2026/HĐMB'}</div>
          </div>
          
          <div class="legal-basis">
            <p>– Căn cứ Bộ luật Dân sự 2015;</p>
            <p>– Căn cứ Luật Thương mại 2005;</p>
            <p>– Căn cứ nhu cầu và khả năng thực tế của các bên.</p>
          </div>
          
          <p style="text-indent: 25px; margin-bottom: 15px; font-size: 14px;">
            Hôm nay, ngày ${day} tháng ${month} năm 2026, tại địa chỉ: Văn phòng Ban quản trị Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất, Việt Nam. Chúng tôi, gồm có:
          </p>
          
          <div>
            <div class="party-header">BÊN BÁN (Bên A)</div>
            <div class="party-details">
              <table>
                <tr>
                  <td style="width: 20%; font-weight: bold;">Tên doanh nghiệp:</td>
                  <td class="dotted-fill" style="width: 80%;">${c.seller?.name || 'Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Mã số doanh nghiệp:</td>
                  <td class="dotted-fill">${c.seller?.taxCode || '3901284560'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Địa chỉ trụ sở chính:</td>
                  <td class="dotted-fill">${c.seller?.address || 'Khu phố 1, Huyện Đức Trọng, Tỉnh Lâm Đồng'}</td>
                </tr>
              </table>
              
              <table style="margin-top: 5px;">
                <tr>
                  <td style="width: 25%; font-weight: bold;">Người đại diện pháp luật:</td>
                  <td class="dotted-fill" style="width: 35%;">${c.seller?.rep || 'Nguyễn Văn Hợp'}</td>
                  <td style="width: 12%; font-weight: bold; text-align: center;">Chức danh:</td>
                  <td class="dotted-fill" style="width: 28%;">${c.seller?.position || 'Chủ tịch HĐQT'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">CMND/CCCD/Hộ chiếu:</td>
                  <td class="dotted-fill">${c.seller?.cccd || '068092004561'}</td>
                  <td style="font-weight: bold; text-align: center;">Cấp ngày:</td>
                  <td class="dotted-fill">${c.seller?.cccdDate || '15/08/2021'} tại ${c.seller?.cccdPlace || 'Cục Cảnh sát QLHC'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Số điện thoại:</td>
                  <td class="dotted-fill">${c.seller?.phone || '0988777666'}</td>
                  <td style="font-weight: bold; text-align: center;">Fax:</td>
                  <td class="dotted-fill">${c.seller?.fax || '02633 847 112'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Tài khoản ngân hàng:</td>
                  <td class="dotted-fill">${c.seller?.bankAcc || '999988887777'}</td>
                  <td style="font-weight: bold; text-align: center;">Mở tại:</td>
                  <td class="dotted-fill">${c.seller?.bankName || 'Agribank - Chi nhánh Tỉnh Lâm Đồng'}</td>
                </tr>
              </table>
            </div>
            
            <div class="party-header">BÊN MUA (Bên B)</div>
            <div class="party-details">
              <table>
                <tr>
                  <td style="width: 20%; font-weight: bold;">Tên doanh nghiệp:</td>
                  <td class="dotted-fill" style="width: 80%;">${c.buyer?.name || c.enterpriseName || 'Công ty Cổ phần Nông sản Sạch Việt Nam'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Mã số doanh nghiệp:</td>
                  <td class="dotted-fill">${c.buyer?.taxCode || '0312345678'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Địa chỉ trụ sở chính:</td>
                  <td class="dotted-fill">${c.buyer?.address || '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'}</td>
                </tr>
              </table>
              
              <table style="margin-top: 5px;">
                <tr>
                  <td style="width: 25%; font-weight: bold;">Người đại diện pháp luật:</td>
                  <td class="dotted-fill" style="width: 35%;">${c.buyer?.rep || 'Trần Văn Bảo'}</td>
                  <td style="width: 12%; font-weight: bold; text-align: center;">Chức danh:</td>
                  <td class="dotted-fill" style="width: 28%;">${c.buyer?.position || 'Giám đốc mua hàng'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">CMND/CCCD/Hộ chiếu:</td>
                  <td class="dotted-fill">${c.buyer?.cccd || '079093004455'}</td>
                  <td style="font-weight: bold; text-align: center;">Cấp ngày:</td>
                  <td class="dotted-fill">${c.buyer?.cccdDate || '20/10/2020'} tại ${c.buyer?.cccdPlace || 'Cục Cảnh sát QLHC'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Số điện thoại:</td>
                  <td class="dotted-fill">${c.buyer?.phone || '0912345678'}</td>
                  <td style="font-weight: bold; text-align: center;">Fax:</td>
                  <td class="dotted-fill">${c.buyer?.fax || '02838 123 456'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Tài khoản ngân hàng:</td>
                  <td class="dotted-fill">${c.buyer?.bankAcc || '1029384756'}</td>
                  <td style="font-weight: bold; text-align: center;">Mở tại:</td>
                  <td class="dotted-fill">${c.buyer?.bankName || 'Vietcombank - Chi nhánh Nam Sài Gòn'}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <p style="margin-top: 25px; margin-bottom: 12px; font-weight: normal; text-align: justify; font-size: 14px;">
            Trên cơ sở thỏa thuận hoàn toàn tự nguyện, hai bên thống nhất ký kết hợp đồng mua bán hàng hóa với các điều khoản như sau:
          </p>
          
          <div class="section-title">Điều 1: Tên hàng hóa, số lượng, chất lượng, giá trị hợp đồng</div>
          <p style="margin: 0px 0 5px 0;">Bên A bán cho bên B hàng hóa sau đây:</p>
          
          <table class="commodity-table">
            <thead>
              <tr>
                <th style="width: 6%;">STT</th>
                <th style="width: 35%;">Tên hàng hóa</th>
                <th style="width: 10%;">Đơn vị</th>
                <th style="width: 12%;">Số lượng</th>
                <th style="width: 15%;">Đơn giá</th>
                <th style="width: 22%;">Thành tiền (VNĐ đồng)</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;">1</td>
                <td style="font-weight: bold;">${c.cropName || 'Cà phê Arabica Cầu Đất'}</td>
                <td style="text-align: center;">kg</td>
                <td style="text-align: center; font-weight: bold;">${c.totalVolume}</td>
                <td style="text-align: right;">${c.unitPrice || '130.000 VNĐ / kg'}</td>
                <td style="text-align: right; font-weight: bold;">${(c.totalVal || 0).toLocaleString('vi-VN')}</td>
                <td>Đạt chuẩn hữu cơ chất lượng cao xuất khẩu</td>
              </tr>
              <tr>
                <td style="text-align: center;">2</td>
                <td>--</td>
                <td style="text-align: center;">--</td>
                <td style="text-align: center;">--</td>
                <td style="text-align: right;">--</td>
                <td style="text-align: right;">--</td>
                <td>Hạng mục bao tiêu liên kết trọn gói</td>
              </tr>
              <tr>
                <td colspan="5" style="text-align: right; font-weight: bold;">Tổng cộng:</td>
                <td style="text-align: right; font-weight: bold; color: #b22222;">${(c.totalVal || 0).toLocaleString('vi-VN')} VNĐ</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          
          <div style="font-size: 14px; margin-bottom: 20px;">
            <p style="margin: 3px 0;"><strong>Tổng cộng:</strong> <span style="font-family: Arial; font-weight: bold;">${(c.totalVal || 0).toLocaleString('vi-VN')}</span> đồng</p>
            <p style="margin: 3px 0;"><strong>Bằng chữ:</strong> <span style="font-style: italic; text-decoration: underline; font-weight: bold;">${moneyWords}</span></p>
          </div>
          
          <div class="section-title">Điều 2. Thanh toán</div>
          <div style="padding-left: 15px;">
            <p>1. Bên B phải thanh toán cho Bên A số tiền ghi tại Điều 1 của Hợp đồng này muộn nhất vào ngày 15 tháng 12 năm 2026.</p>
            <p>2. Bên B thanh toán cho Bên A theo hình thức <span class="font-bold underline">${c.paymentMethod || 'Chuyển khoản liên ngân hàng 24/7'}</span> vào tài khoản chỉ định tại Điều trên.</p>
          </div>
          
          <div class="section-title">Điều 3. Thời gian, địa điểm, phương thức giao hàng</div>
          <div style="padding-left: 15px;">
            <p>1. Bên A giao hàng cho bên B theo lịch sau:</p>
            <table class="commodity-table" style="margin-top: 5px;">
              <thead>
                <tr>
                  <th style="width: 8%;">STT</th>
                  <th>Tên hàng hóa</th>
                  <th style="width: 10%;">Đơn vị</th>
                  <th style="width: 12%;">Số lượng</th>
                  <th>Thời gian giao hàng</th>
                  <th>Địa điểm giao hàng</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center;">1</td>
                  <td style="font-weight: bold;">${c.cropName || 'Cà phê Arabica Cầu Đất'}</td>
                  <td style="text-align: center;">kg</td>
                  <td style="text-align: center;">${c.totalVolume}</td>
                  <td>${c.deliveryTime || 'Trong vòng 15 ngày kể từ ngày ký'}</td>
                  <td>${c.deliveryLocation || 'Kho bãi bên bán'}</td>
                  <td>Theo đợt thu hoạch thực tế</td>
                </tr>
              </tbody>
            </table>
            
            <p>2. Phương tiện vận chuyển và chi phí vận chuyển do bên <span style="font-weight: bold; text-decoration: underline;">Bên B (Bên Mua)</span> chịu. Chi phí bốc xếp <span style="font-size: 13.5px; font-style: italic;">do bên A chịu trách nhiệm bốc xếp đưa lên container tại bãi kho bên bán</span>.</p>
            
            <p>3. Quy định lịch giao nhận hàng hóa mà bên mua không đến nhận hàng thì phải chịu chi phí lưu kho bãi là <strong style="font-family: Arial;">1.000.000</strong> đồng/ngày. Nếu phương tiện vận chuyển bên mua đến mà bên bán không có hàng giao thì bên bán phải chịu chi phí thực tế cho việc điều động phương tiện.</p>
            
            <p>4. Khi nhận hàng, bên mua có trách nhiệm kiểm nhận phẩm chất, quy cách hàng hóa tại chỗ. Nếu phát hiện hàng thiếu hoặc không đúng tiêu chuẩn chất lượng v.v… thì lập biên bản tại chỗ, yêu cầu bên bán xác nhận. Hàng đã ra khỏi kho bên bán không chịu trách nhiệm (trừ loại hàng có quy định thời hạn bảo hành).</p>
            
            <p>5. Trường hợp giao nhận hàng theo nguyên đai, nguyên kiện, nếu bên mua sau khi chở về nhập kho mới phát hiện vi phạm thì phải lập biên bản gọi cơ quan kiểm tra trung gian (<span style="font-weight: bold;">Trung tâm Kiểm định & Đo lường QUATEST Lâm Đồng</span>) đến xác nhận và phải gửi đến bên bán trong hạn 10 ngày tính từ khi lập biên bản. Sau 15 ngày nếu bên bán đã nhận được biên bản mà không có ý kiến gì thì coi như đã chịu trách nhiệm bồi thường lô hàng đó.</p>
            
            <p>6. Mỗi lô hàng khi giao nhận phải có xác nhận chất lượng bằng phiếu hoặc biên bản kiểm nghiệm; khi đến nhận hàng, người nhận phải có đủ:</p>
            <p style="padding-left: 20px; margin: 3px 0;">– Giấy giới thiệu của cơ quan bên mua;</p>
            <p style="padding-left: 20px; margin: 3px 0;">– Phiếu xuất kho của cơ quan bên bán;</p>
            <p style="padding-left: 20px; margin: 3px 0;">– Giấy chứng minh nhân dân.</p>
          </div>
          
          <div class="section-title">Điều 4: TRÁCH NHIỆM CỦA CÁC BÊN</div>
          <div style="padding-left: 15px;">
            <p>1. Bên bán không chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá nếu vào thời điểm giao kết hợp đồng bên mua đã biết hoặc phải biết về những khiếm khuyết đó;</p>
            <p>2. Trừ trường hợp quy định tại khoản 1 Điều này, trong thời hạn khiếu nại theo quy định của Luật thương mại năm 2005, bên bán phải chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá đã có trước thời điểm chuyển rủi ro cho bên mua, kể cả trường hợp khiếm khuyết đó được phát hiện sau thời điểm chuyển rủi ro;</p>
            <p>3. Bên bán phải chịu trách nhiệm về khiếm khuyết của hàng hóa phát sinh sau thời điểm chuyển rủi ro nếu khiếm khuyết đó do bên bán vi phạm hợp đồng.</p>
            <p>4. Bên mua có trách nhiệm thanh toán và nhận hàng theo đúng thời gian đã thỏa thuận.</p>
          </div>
          
          <div class="section-title">Điều 5: BẢO HÀNH VÀ HƯỚNG DẪN SỬ DỤNG HÀNG HÓA</div>
          <div style="padding-left: 15px;">
            <p>1. Bên A có trách nhiệm bảo hành chất lượng và giá trị sử dụng loại hàng <span style="font-weight: bold;">Nông sản xuất khẩu</span> cho bên mua trong thời gian là <span style="font-weight: bold;">03</span> tháng.</p>
            <p>2. Bên A phải cung cấp đủ mỗi đơn vị hàng hóa một giấy hướng dẫn sử dụng, chứng chỉ nguồn gốc xuất xứ CO/CQ (nếu cần).</p>
          </div>
          
          <div class="section-title">Điều 6: NGƯNG THANH TOÁN TIỀN MUA HÀNG</div>
          <div style="padding-left: 15px;">
            <p>1. Bên B có bằng chứng về việc bên A lừa dối thì có quyền tạm ngừng việc thanh toán;</p>
            <p>2. Bên B có bằng chứng về việc hàng hóa đang là đối tượng bị tranh chấp thì có quyền tạm ngừng thanh toán cho đến khi việc tranh chấp đã được giải quyết;</p>
            <p>3. Bên B có bằng chứng về việc bên A đã giao hàng không phù hợp với hợp đồng thì có quyền tạm ngừng thanh toán cho đến khi bên A đã khắc phục sự không phù hợp đó;</p>
            <p>4. Trường hợp tạm ngừng thanh toán theo quy định tại khoản 2 và khoản 3 Điều này mà bằng chứng do bên B đưa ra không xác thực, gây thiệt hại cho bên A thì bên B phải bồi thường thiệt hại đó và chịu các chế tài khác theo quy định của pháp luật.</p>
          </div>
          
          <div class="section-title">Điều 7: ĐIỀU KHOẢN PHẠT VI PHẠM HỢP ĐỒNG</div>
          <div style="padding-left: 15px;">
            <p>1. Hai bên cam kết thực hiện nghiêm túc các điều khoản đã thỏa thuận trên, không được đơn phương thay đổi hoặc hủy bỏ hợp đồng, bên nào không thực hiện hoặc đơn phương đình chỉ thực hiện hợp đồng mà không có lý do chính đáng thì sẽ bị phạt tới <strong style="font-family: Arial;">8%</strong> giá trị của hợp đồng bị vi phạm.</p>
            <p>2. Bên nào vi phạm các điều khoản trên đây sẽ phải chịu trách nhiệm vật chất theo quy định của các văn bản pháp luật có hiệu lực hiện hành về phạt vi phạm chất lượng, số lượng, thời gian, địa điểm, thanh toán, bảo hành v.v… mức phạt cụ thể do hai bên thỏa thuận dựa trên khung phạt Nhà nước đã quy định trong các văn bản pháp luật về loại hợp đồng này.</p>
          </div>
          
          <div class="section-title">Điều 8: BẤT KHẢ KHÁNG VÀ GIẢI QUYẾT TRANH CHẤP</div>
          <div style="padding-left: 15px;">
            <p>1. Bất khả kháng nghĩa là các sự kiện xảy ra một cách khách quan, không thể lường trước được và không thể khắc phục được mặc dù đã áp dụng mọi biện pháp cần thiết trong khả năng cho phép, một trong các Bên vẫn không có khả năng thực hiện được nghĩa vụ của mình theo Hợp đồng này; gồm nhưng không giới hạn ở: thiên tai, hỏa hoạn, lũ lụt, chiến tranh, can thiệp của chính quyền bằng vũ trang, cản trở giao thông vận tải và các sự kiện khác tương tự.</p>
            <p>2. Khi xảy ra sự kiện bất khả kháng, bên gặp phải bất khả kháng phải không chậm trễ, thông báo cho bên kia tình trạng thực tế, đề xuất phương án xử lý và nỗ lực giảm thiểu tổn thất, thiệt hại đến mức thấp nhất có thể.</p>
            <p>3. Trừ trường hợp bất khả kháng, hai bên phải thực hiện đầy đủ và đúng thời hạn các nội dung của hợp đồng này. Trong quá trình thực hiện hợp đồng, nếu có vướng mắc từ bất kỳ bên nào, hai bên sẽ cùng nhau giải quyết trên tinh thần hợp tác. Trong trường hợp không tự giải quyết được, hai bên thống nhất đưa ra giải quyết tại Tòa án có thẩm quyền. Phán quyết của tòa án là quyết định cuối cùng, có giá trị ràng buộc các bên. Bên thua phải chịu toàn bộ các chi phí giải quyết tranh chấp.</p>
          </div>
          
          <div class="section-title">Điều 9. Điều khoản chung</div>
          <div style="padding-left: 15px; margin-bottom: 30px;">
            <p>1. Hợp đồng này có hiệu lực từ ngày ký và tự động thanh lý hợp đồng kể từ khi Bên B đã nhận đủ hàng và Bên A đã nhận đủ tiền.</p>
            <p>2. Hợp đồng này có giá trị thay thế mọi giao dịch, thỏa thuận trước đây của hai bên. Mọi sự bổ sung, sửa đổi hợp đồng này đều phải có sự đồng ý bằng văn bản của hai bên.</p>
            <p>3. Trừ các trường hợp được quy định ở trên, hợp đồng này không thể bị hủy bỏ nếu không có thỏa thuận bằng văn bản của các bên. Trong trường hợp hủy hợp đồng, trách nhiệm liên quan tới phạt vi phạm hợp đồng và bồi thường thiệt hại được bảo lưu.</p>
            <p>4. Hợp đồng này được lập thành <span style="font-weight: bold;">04</span> bản, có giá trị như nhau. Mỗi bên giữ <span style="font-weight: bold;">02</span> bản và có giá trị pháp lý như nhau.</p>
          </div>
          
          <div class="signatures-container">
            <div class="signature-box">
              <div class="signature-label">ĐẠI DIỆN BÊN BÁN (BÊN A)</div>
              <div class="signature-sub">(Ký, ghi rõ họ tên và đóng dấu)</div>
              
              ${c.status === 'pending_super_admin' ? `
                <div style="min-height: 80px; display: flex; align-items: center; font-style: italic; color: #777;">
                  Chưa ký số pháp lý
                </div>
              ` : `
                <div class="stamp-wrapper">
                  <!-- Circular seal SVG embedded -->
                  <svg width="120" height="120" viewBox="0 0 140 140" style="color: #ea4335;">
                    <circle cx="70" cy="70" r="66" stroke="#ea4335" stroke-width="3" fill="none" />
                    <circle cx="70" cy="70" r="48" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="2,2" fill="none" />
                    <path id="pathPrint" d="M 23,70 A 47,47 0 0,1 117,70" fill="none" />
                    <path id="pathPrintBottom" d="M 117,70 A 47,47 0 0,1 23,70" fill="none" />
                    <text font-size="9" font-weight="bold" fill="#ea4335">
                      <textPath href="#pathPrint" startOffset="50%" text-anchor="middle">
                        HTX NONG NGHIEP CONG NGHE CAO
                      </textPath>
                    </text>
                    <text font-size="9" font-weight="bold" fill="#ea4335">
                      <textPath href="#pathPrintBottom" startOffset="50%" text-anchor="middle">
                        * CAU DAT - LAM DONG *
                      </textPath>
                    </text>
                    <text x="70" y="65" font-size="11" font-weight="bold" text-anchor="middle" fill="#ea4335">ĐÃ KÝ</text>
                    <text x="70" y="80" font-size="10" font-weight="bold" text-anchor="middle" fill="#ea4335">CHỮ KÝ SỐ</text>
                  </svg>
                </div>
                
                <div class="cryptographic-meta">
                  <strong>CHỮ KÝ SỐ VIETAGRI CA ĐỐI TÁC</strong><br/>
                  Ký bởi: Hợp tác xã Công nghệ cao Cầu Đất<br/>
                  Thời gian ký: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}<br/>
                  Số sê-ri CA: CA-2026-9902A1F8D<br/>
                  Nhà cung cấp: Viettel-CA National Certificate Authority
                </div>
              `}
              
              <div style="margin-top: 15px; font-weight: bold; text-decoration: underline; font-size: 14.5px;">
                ${c.seller?.rep || 'Nguyễn Văn Hợp'}
              </div>
            </div>
            
            <div class="signature-box">
              <div class="signature-label">ĐẠI DIỆN BÊN MUA (BÊN B)</div>
              <div class="signature-sub">(Ký, ghi rõ họ tên và đóng dấu)</div>
              
              ${c.status === 'pending_super_admin' ? `
                <div style="min-height: 80px; display: flex; align-items: center; font-style: italic; color: #777;">
                  Chờ doanh nghiệp ký số liên kết
                </div>
              ` : `
                <div class="stamp-wrapper">
                  <!-- Partner SVG circular seal in green -->
                  <svg width="120" height="120" viewBox="0 0 140 140" style="color: #0d8a43;">
                    <circle cx="70" cy="70" r="66" stroke="#0d8a43" stroke-width="3" fill="none" />
                    <circle cx="70" cy="70" r="48" stroke="#0d8a43" stroke-width="1.5" stroke-dasharray="2,2" fill="none" />
                    <path id="pathPrintB" d="M 23,70 A 47,47 0 0,1 117,70" fill="none" />
                    <path id="pathPrintBBottom" d="M 117,70 A 47,47 0 0,1 23,70" fill="none" />
                    <text font-size="9.5" font-weight="bold" fill="#0d8a43">
                      <textPath href="#pathPrintB" startOffset="50%" text-anchor="middle">
                        CONG TY CP NONG SAN SACH VN
                      </textPath>
                    </text>
                    <text font-size="9" font-weight="bold" fill="#0d8a43">
                      <textPath href="#pathPrintBBottom" startOffset="50%" text-anchor="middle">
                        * CHI NHANH NAM SAI GON *
                      </textPath>
                    </text>
                    <text x="70" y="65" font-size="11" font-weight="bold" text-anchor="middle" fill="#0d8a43">ĐÃ KÝ</text>
                    <text x="70" y="80" font-size="10" font-weight="bold" text-anchor="middle" fill="#0d8a43">XÁC THỰC</text>
                  </svg>
                </div>
                
                <div class="cryptographic-meta" style="color: #1a442e; background-color: #f6fbf8; border-color: #7ab293;">
                  <strong>CHỮ KÝ SỐ QUỐC GIA FPT-CA</strong><br/>
                  Ký bởi: ${c.buyer?.name || c.enterpriseName}<br/>
                  Đại diện: ${c.buyer?.rep || 'Trần Văn Bảo'}<br/>
                  Thời gian: ${new Date().toLocaleDateString('vi-VN')} trước 3 giờ<br/>
                  Số sê-ri CA: CA-2026-FPT-0012A349C
                </div>
              `}
              
              <div style="margin-top: 15px; font-weight: bold; text-decoration: underline; font-size: 14.5px;">
                ${c.buyer?.rep || 'Trần Văn Bảo'}
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };


  React.useEffect(() => {
    localStorage.setItem('vietagri_harvest_schedules', JSON.stringify(harvestSchedules));
  }, [harvestSchedules]);

  const handleDeleteHarvestSchedule = (id: string) => {
    setHarvestToDelete(id);
  };

  const confirmDeleteHarvest = () => {
    if (harvestToDelete) {
      const updated = harvestSchedules.filter(h => h.id !== harvestToDelete);
      setHarvestSchedules(updated);
      localStorage.setItem('vietagri_harvest_schedules', JSON.stringify(updated));
      setHarvestToDelete(null);
    }
  };

  const handleEditHarvestSchedule = (harvest: any) => {
    setEditingHarvest({ ...harvest });
  };

  const handleUpdateHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHarvest) {
      const updated = harvestSchedules.map(h => h.id === editingHarvest.id ? editingHarvest : h);
      setHarvestSchedules(updated);
      localStorage.setItem('vietagri_harvest_schedules', JSON.stringify(updated));
      setEditingHarvest(null);
      alert('Cập nhật lịch thu hoạch thành công!');
    }
  };
  const [newHarvest, setNewHarvest] = useState({
    farmer: '',
    product: '',
    date: '',
    qty: '',
    area: '',
    batch: '',
    requirements: '',
    totalValue: ''
  });

  const handleAddHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `HV-${Date.now()}`;
    const harvestToAdd = { 
      id, 
      cooperativeId: currentHtxId,
      ...newHarvest 
    };
    const updated = [harvestToAdd, ...harvestSchedules];
    setHarvestSchedules(updated);
    localStorage.setItem('vietagri_harvest_schedules', JSON.stringify(updated));
    setIsHarvestModalOpen(false);
    setActiveTab('qc');
    setNewHarvest({ farmer: '', product: '', date: '', qty: '', area: '', batch: '', requirements: '', totalValue: '' });
    alert('Đã lên lịch thu hoạch thành công!');
  };

  const handleApproveMember = (id: string) => {
    const member = allPendingMembers.find(m => m.id === id);
    if (!member) return;

    // Update status in pending list
    const updatedPending = allPendingMembers.map(m => m.id === id ? { ...m, status: 'approved' } : m);
    setAllPendingMembers(updatedPending);
    const registrationsOnly = updatedPending.filter(m => m.type !== 'agricultural_request' && !m.id?.toString().startsWith('REQ-'));
    localStorage.setItem('pending_registration_members', JSON.stringify(registrationsOnly));

    if (member.type === 'agricultural_request') {
      const originalIdStr = member.id.replace('REQ-', '');
      const originalId = parseInt(originalIdStr) || originalIdStr;
      
      const rawRequests = localStorage.getItem('vietagri_farmer_requests');
      if (rawRequests) {
        const parsedRequests = JSON.parse(rawRequests);
        const updatedRequests = parsedRequests.map((r: any) => 
          r.id === originalId ? { ...r, status: 'approved' } : r
        );
        localStorage.setItem('vietagri_farmer_requests', JSON.stringify(updatedRequests));
      }
      setToastMessage(`Đã phê duyệt và lên kế hoạch hỗ trợ nông nghiệp của ${member.name}!`);
      return;
    }

    if (member.type === 'crop_approval') {
      // Add crop to existing farmer
      const savedFarmersRaw = localStorage.getItem('vietagri_active_farmers');
      let farmersList = activeFarmers;
      if (savedFarmersRaw) {
        try {
          const parsed = JSON.parse(savedFarmersRaw);
          if (Array.isArray(parsed)) farmersList = parsed;
        } catch (e) {}
      }
      
      const farmerIndex = farmersList.findIndex((f: any) => String(f.phone).replace(/^0+/, '') === String(member.phone || '').replace(/^0+/, ''));
      if (farmerIndex !== -1) {
        if (!farmersList[farmerIndex].crops) farmersList[farmerIndex].crops = [];
        farmersList[farmerIndex].crops.push({
          name: member.cropName,
          type: member.cropType === 'veggie' || member.cropType === 'rice' ? 'short-term' : 'perennial',
          area: member.area
        });
        localStorage.setItem('vietagri_active_farmers', JSON.stringify(farmersList));
        setActiveFarmers(farmersList);
        setToastMessage(`Đã phê duyệt cây trồng ${member.cropName} cho ${member.name}!`);
      } else {
        alert('Không tìm thấy thông tin nông dân!');
      }
      return;
    }

    if (member.type === 'crop_report') {
      console.log('Processing crop report approval for:', member.name, 'phone:', member.phone, 'crop:', member.cropName);
      const savedFarmersRaw = localStorage.getItem('vietagri_active_farmers');
      let farmersList = activeFarmers;
      if (savedFarmersRaw) {
        try {
          const parsed = JSON.parse(savedFarmersRaw);
          if (Array.isArray(parsed)) farmersList = parsed;
        } catch (e) {
          console.error('Error parsing farmers list', e);
        }
      }
      
      // Use fuzzy matching for phone (ignore leading zeros or string/number diffs)
      const farmerIndex = farmersList.findIndex((f: any) => String(f.phone).replace(/^0+/, '') === String(member.phone).replace(/^0+/, ''));
      
      if (farmerIndex !== -1) {
        if (!farmersList[farmerIndex].crops) farmersList[farmerIndex].crops = [];
        const cropIndex = farmersList[farmerIndex].crops.findIndex((c: any) => (c.name || '').toLowerCase() === (member.cropName || '').toLowerCase());
        
        if (cropIndex !== -1) {
          let nextStatus = member.cropStatus;
          let nextStage = member.growthStage;
          let nextHealth = member.health;

          if (member.postHarvestAction === 'end_cultivation') {
            nextStatus = 'cancelled';
            nextStage = 'Thanh lý';
            nextHealth = 'Bình thường';
          } else if (member.postHarvestAction === 'new_season') {
            const seasonCode = `MV-${Math.floor(100 + Math.random() * 900)}`;
            const memberId = member.phone ? `XV${String(member.phone).slice(-4)}` : 'XV0000';
            const cropCode = `CT-${Math.floor(100 + Math.random() * 900)}`;
            const identCode = Math.random().toString(36).substring(2, 6).toUpperCase();
            const approvalCode = `${seasonCode}-${memberId}-${cropCode}-${identCode}`;
            
            console.log('Generating approval code:', approvalCode);

            const currentSeason = farmersList[farmerIndex].crops[cropIndex].seasonNumber || 1;
            const nextSeasonNumber = currentSeason + 1;

            const finalUpdatedPending = updatedPending.map(m => m.id === id ? { ...m, seasonApprovalCode: approvalCode, seasonNumber: nextSeasonNumber } : m);
            setAllPendingMembers(finalUpdatedPending);
            const regsOnly = finalUpdatedPending.filter(m => m.type !== 'agricultural_request' && !m.id?.toString().startsWith('REQ-'));
            localStorage.setItem('pending_registration_members', JSON.stringify(regsOnly));

            farmersList[farmerIndex].crops[cropIndex] = {
              ...farmersList[farmerIndex].crops[cropIndex],
              status: nextStatus,
              growthStage: nextStage,
              health: nextHealth,
              postHarvestAction: member.postHarvestAction,
              seasonApprovalCode: approvalCode,
              seasonNumber: nextSeasonNumber
            };
          } else {
            farmersList[farmerIndex].crops[cropIndex] = {
              ...farmersList[farmerIndex].crops[cropIndex],
              status: 'approved',
              growthStage: nextStage,
              health: nextHealth,
              postHarvestAction: member.postHarvestAction
            };
          }
          
          localStorage.setItem('vietagri_active_farmers', JSON.stringify(farmersList));
          window.dispatchEvent(new Event('vietagri_data_updated'));
          setActiveFarmers(farmersList);
          console.log('Saved updated farmers list to localStorage');
        } else {
          console.warn('Crop not found on farmer profile:', member.cropName);
        }
      } else {
        console.warn('Farmer not found in active list for phone:', member.phone);
      }

      setToastMessage(`Đã xác nhận và lưu nhật ký thay đổi tình hình cây trồng ${member.cropName} của ${member.name}!`);
      return;
    }

    // Generate numeric temporary password
    const generatedPassword = 'HTX-' + Math.floor(100000 + Math.random() * 900000);

    // Register active credential account into registered_admins in order to allow actual login
    const savedAdminsRaw = localStorage.getItem('registered_admins');
    let adminsList = [];
    if (savedAdminsRaw) {
      try {
        const parsed = JSON.parse(savedAdminsRaw);
        if (Array.isArray(parsed)) adminsList = parsed;
      } catch (e) {}
    }
    if (!adminsList.some((a: any) => a.phone === member.phone)) {
      adminsList.push({
        name: member.name,
        phone: member.phone,
        cccd: member.cccd,
        cooperativeId: member.cooperativeId,
        role: 'farmer',
        password: generatedPassword,
        passwordChanged: false,
        approvedBy: adminProfile?.name || 'Admin HTX',
        approvedAt: new Date().toISOString()
      });
      localStorage.setItem('registered_admins', JSON.stringify(adminsList));
    }

    // Register into active farmers list to make full profile options visible under member management
    const savedFarmersRaw = localStorage.getItem('vietagri_active_farmers');
    const farmersList = savedFarmersRaw ? JSON.parse(savedFarmersRaw) : [];
    if (!farmersList.some((f: any) => f.phone === member.phone)) {
      farmersList.push({
        id: `F-${String(Date.now()).slice(-4)}`,
        name: member.name,
        province: member.province,
        area: member.area || '1.5 ha',
        phone: member.phone,
        password: generatedPassword,
        cooperativeId: member.cooperativeId,
        crops: [
          { name: member.crop || 'Cà phê Arabica', type: 'perennial', area: member.province }
        ]
      });
      localStorage.setItem('vietagri_active_farmers', JSON.stringify(farmersList));
      setActiveFarmers(farmersList);
    }

    // Trigger Success dialog info
    setApprovedMemberInfo({
      name: member.name,
      phone: member.phone,
      password: generatedPassword,
      adminName: adminProfile?.name || 'Admin',
      step: 1
    });
  };

  const handleRejectMember = (id: string) => {
    setMemberToReject(id);
  };

  const confirmRejectMember = () => {
    if (memberToReject) {
      const member = allPendingMembers.find(m => m.id === memberToReject);
      const updatedPending = allPendingMembers.map(m => m.id === memberToReject ? { ...m, status: 'rejected' } : m);
      setAllPendingMembers(updatedPending);
      const regsOnlyForReject = updatedPending.filter(m => m.type !== 'agricultural_request' && !m.id?.toString().startsWith('REQ-'));
      localStorage.setItem('pending_registration_members', JSON.stringify(regsOnlyForReject));

      if (member && member.type === 'agricultural_request') {
        const originalIdStr = member.id.replace('REQ-', '');
        const originalId = parseInt(originalIdStr) || originalIdStr;
        const rawRequests = localStorage.getItem('vietagri_farmer_requests');
        if (rawRequests) {
          const parsedRequests = JSON.parse(rawRequests);
          const updatedRequests = parsedRequests.map((r: any) => 
            r.id === originalId ? { ...r, status: 'rejected' } : r
          );
          localStorage.setItem('vietagri_farmer_requests', JSON.stringify(updatedRequests));
        }
        setToastMessage(`Đã từ chối yêu cầu hỗ trợ nông nghiệp của ${member.name}`);
      }

      if (member && member.type === 'crop_report') {
        setToastMessage(`Đã từ chối và bác bỏ báo cáo cây trồng của ${member.name}`);
      }
      setMemberToReject(null);
    }
  };

  const confirmDeleteFarmer = () => {
    if (farmerToDelete) {
      setActiveFarmers((prev) => prev.filter(f => f.id !== farmerToDelete));
      setFarmerToDelete(null);
      setToastMessage('Đã xóa nông dân khỏi hệ thống thành công!');
    }
  };

  const handleConfirmDistribution = (requestId: string) => {
    const cleanIdStr = requestId.replace('REQ-', '');
    const cleanId = parseInt(cleanIdStr) || cleanIdStr;

    const rawRequests = localStorage.getItem('vietagri_farmer_requests');
    if (rawRequests) {
      const parsed = JSON.parse(rawRequests);
      const updatedRequests = parsed.map((r: any) => {
        if (r.id === cleanId) {
          return {
            ...r,
            status: 'approved',
            distributionDetails: {
              deliveryDate: distributionForm.deliveryDate,
              warehouse: distributionForm.warehouse,
              actualQty: distributionForm.actualQty,
              unit: distributionForm.unit,
              coordinator: distributionForm.coordinator,
              notes: distributionForm.notes
            }
          };
        }
        return r;
      });
      localStorage.setItem('vietagri_farmer_requests', JSON.stringify(updatedRequests));
    }

    // Also update in allPendingMembers list
    const updatedPending = allPendingMembers.map(m => {
      if (m.id === requestId) {
        return {
          ...m,
          status: 'approved',
          distributionDetails: {
            deliveryDate: distributionForm.deliveryDate,
            warehouse: distributionForm.warehouse,
            actualQty: distributionForm.actualQty,
            unit: distributionForm.unit,
            coordinator: distributionForm.coordinator,
            notes: distributionForm.notes
          }
        };
      }
      return m;
    });

    setAllPendingMembers(updatedPending);
    
    // Only save ACTUALLY pending registrations to pending_registration_members
    const registrationsOnly = updatedPending.filter(m => m.type !== 'agricultural_request' && !m.id?.toString().startsWith('REQ-'));
    localStorage.setItem('pending_registration_members', JSON.stringify(registrationsOnly));
    
    setDistributingRequest(null);
    setToastMessage(`Đã duyệt & lập kế hoạch phân bổ vật tư thành công!`);
  };

  const agriculturalRequests = allPendingMembers.filter(m => m.type === 'agricultural_request' && m.status !== 'pending');

  const countByItem = (itemName: string) => {
    return agriculturalRequests.filter(m => {
      const arr = m.requestsArr || [];
      if (arr.includes(itemName)) return true;
      const text = m.cropName || '';
      return text.includes(itemName);
    }).length;
  };

  const seedQty = countByItem('Cấp cây giống');
  const fertilizerQty = countByItem('Cấp phân bón');
  const pesticideQty = countByItem('Cấp thuốc BVTV');
  const techQty = countByItem('Hỗ trợ kỹ thuật');

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans w-full fixed inset-0 z-[100] print:block print:bg-white print:static print:h-auto print:overflow-visible">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          /* Hide everything in the dashboard except the receipt overlay */
          .min-h-screen > *:not(.receipt-overlay) {
            display: none !important;
          }
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          .receipt-overlay {
            position: static !important;
            display: block !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          .receipt-action-bar {
            display: none !important;
          }
          #printable-receipt {
            box-shadow: none !important;
            border: none !important;
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 20mm !important;
            margin: 0 auto !important;
            background: white !important;
            visibility: visible !important;
            display: block !important;
          }
          /* Ensure text colors are preserved */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
      
      {/* Dynamic React Toast Notifications */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[300] bg-forest text-white px-6 py-4 rounded-2xl shadow-xl border border-emerald-500/10 flex items-center gap-3 font-semibold text-sm transition-all duration-300">
          <span className="w-2.5 h-2.5 bg-mint rounded-full animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-72 bg-forest text-white hidden lg:flex flex-col print:hidden">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-forest font-black text-xl">V</span>
            </div>
            <span className="text-xl font-black tracking-widest">VIETAGRI</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { id: 'members', label: 'Quản lý Xã viên', icon: <Users size={20} /> },
            { id: 'products', label: 'Danh mục & Giá bán', icon: <Package size={20} /> },
            { id: 'post_product', label: 'Đăng bán', icon: <PlusCircle size={20} /> },
            { id: 'qc', label: 'Thu mua, QC & Kho', icon: <CheckCircle2 size={20} /> },
            { id: 'contracts', label: 'Quản lý Hợp đồng', icon: <MapPin size={20} /> },
            { id: 'finances', label: 'Tài chính & Đối soát', icon: <Wallet size={20} /> },
            { id: 'reports', label: 'Báo cáo & Phân phối', icon: <BarChart3 size={20} /> },
            { id: 'network', label: 'Liên kết HTX toàn quốc', icon: <Building2 size={20} /> },
            { id: 'map', label: 'Bản đồ Vùng trồng', icon: <MapIcon size={20} />, future: true },
            { id: 'news', label: 'Quảng bá & Tin tức', icon: <Newspaper size={20} />, future: true },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => !item.future && setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-white/10 text-mint' : 'text-white/60 hover:bg-white/5'
              } ${item.future ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3 font-bold text-sm">
                {item.icon}
                {item.label}
              </div>
              {item.future && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white italic">Sắp có</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => {
              localStorage.removeItem('userRole');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userPhone');
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 p-4 text-white/60 hover:text-white transition-colors font-bold text-sm"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 shadow-sm print:hidden">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-96">
            <Search className="text-slate-400" size={18} />
            <input type="text" placeholder="Tìm kiếm nông dân, đơn hàng..." className="bg-transparent outline-none w-full text-sm font-medium" />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-forest transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-black">3</span>
            </button>
            <div 
              onClick={() => navigate('/admin/profile')}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-2 rounded-xl transition-colors"
              title="Xem thông tin cá nhân"
            >
              <div className="text-right">
                <p className="text-sm font-black text-forest">Quản Trị Viên</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{adminProfile?.htxName || 'HTX 4.0 Digital'}</p>
              </div>
              <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center text-forest font-black">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <motion.div 
                  whileHover={{ y: -5 }}
                  key={stat.title} 
                  className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{stat.title}</p>
                    <p className="text-2xl font-black text-forest">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Active Tab Content */}
          <div className="space-y-8">
            {activeTab === 'members' && (
              <>
                <div className="grid xl:grid-cols-3 gap-8">
                {/* Pending Approvals Table */}
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-forest">Phê duyệt (Hồ sơ / Cây trồng)</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Danh sách chờ xét duyệt</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setIsStaffAccountModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/10"
                      >
                        <Building2 size={16} /> Cấp tài khoản Xã viên
                      </button>
                      <button 
                        onClick={() => setIsViewAllPendingModalOpen(true)}
                        className="text-mint font-black text-xs uppercase tracking-widest hover:text-emerald-700 transition-all cursor-pointer"
                        title="Xem tất cả danh sách chờ phê duyệt, Xem xét"
                      >
                        Xem tất cả
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và tên</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Yêu cầu</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quy mô</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingMembers.map((member, index) => (
                          <tr key={`${member.id}-${index}`} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${member.type === 'crop_approval' ? 'bg-yellow-50 text-yellow-600' : member.type === 'crop_report' ? 'bg-teal-50 text-teal-600' : member.type === 'agricultural_request' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-forest'}`}>
                                  {member.type === 'crop_approval' ? 'T' : member.type === 'crop_report' ? 'BC' : member.type === 'agricultural_request' ? 'Y' : member.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-forest text-sm">{member.name}</p>
                                  <p className="text-[10px] text-slate-400">
                                    {member.type === 'crop_approval' 
                                      ? `Đăng ký trồng mới: ${member.cropName}` 
                                      : member.type === 'crop_report'
                                      ? `Báo cáo: ${member.cropName}` 
                                      : member.type === 'agricultural_request' 
                                      ? `Yêu cầu: ${member.cropName}` 
                                      : member.crop}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-sm font-medium text-slate-600">
                              {member.type === 'crop_approval' ? (
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                  Cây trồng mới
                                </span>
                              ) : member.type === 'crop_report' ? (
                                <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                  Báo cáo cây trồng
                                </span>
                              ) : member.type === 'agricultural_request' ? (
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                  Hỗ trợ nông nghiệp
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                  Phê duyệt tài khoản
                                </span>
                              )}
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-mint/10 text-mint text-[10px] font-black rounded-full uppercase italic whitespace-nowrap">
                                {member.area}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setSelectedMemberDetail(member)}
                                  className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                  title="Xem chi tiết"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button 
                                  onClick={() => handleApproveMember(member.id)}
                                  className="w-8 h-8 rounded-lg bg-mint/10 text-mint flex items-center justify-center hover:bg-mint hover:text-white transition-all shadow-sm"
                                  title="Phê duyệt"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleRejectMember(member.id)}
                                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                  title="Từ chối"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Member Rejection Modal */}
                {memberToReject && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setMemberToReject(null)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
                    >
                      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle size={32} />
                      </div>
                      <h3 className="text-xl font-black text-forest mb-2">Từ chối hồ sơ</h3>
                      <p className="text-sm text-slate-500 font-medium mb-8">Bạn có chắc chắn muốn từ chối hồ sơ đăng ký của nông dân này?</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setMemberToReject(null)}
                          className="py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                          Hủy bỏ
                        </button>
                        <button 
                          onClick={confirmRejectMember}
                          className="py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                        >
                          Từ chối
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Member Detail Modal */}
                {selectedMemberDetail && !isContractSigningOpen && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedMemberDetail(null)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={`relative bg-white rounded-[2rem] w-full shadow-2xl overflow-hidden transition-all duration-300 ${
                        selectedMemberDetail.type === 'crop_report' ? 'max-w-5xl p-8' : selectedMemberDetail.type === 'agricultural_request' ? 'max-w-2xl p-8' : 'max-w-xl p-8'
                      }`}
                    >
                      {/* Form Header */}
                      <div className={`flex items-center justify-between border-b border-slate-100 mb-6 pb-5`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            selectedMemberDetail.type === 'crop_approval' 
                              ? 'bg-amber-100 text-amber-700' 
                              : selectedMemberDetail.type === 'crop_report'
                              ? 'bg-teal-100 text-teal-700'
                              : selectedMemberDetail.type === 'agricultural_request'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {selectedMemberDetail.type === 'crop_approval' ? (
                              <Sprout size={24} />
                            ) : selectedMemberDetail.type === 'crop_report' ? (
                              <CheckCircle2 size={24} />
                            ) : selectedMemberDetail.type === 'agricultural_request' ? (
                              <Package size={24} />
                            ) : (
                              <User size={24} />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-forest">
                              {selectedMemberDetail.type === 'crop_approval' 
                                ? 'Chi tiết Đăng ký Cây trồng'
                                : selectedMemberDetail.type === 'crop_report'
                                ? 'Báo cáo Tiến độ / Tình hình cây trồng'
                                : selectedMemberDetail.type === 'agricultural_request'
                                ? 'Đơn Đề nghị Hỗ trợ Nông nghiệp'
                                : 'Hồ sơ Đăng ký Gia nhập HTX'}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                              MÃ SỐ HỒ SƠ: #00{selectedMemberDetail.id}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedMemberDetail(null)}
                          className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>

                      {/* CONDITIONAL BODIES BY TYPE */}

                      {/* 1. Crop Proposal */}
                      {selectedMemberDetail.type === 'crop_approval' && (
                        <div className="space-y-6">
                          {/* Farmer Contact Card */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Xã viên đề xuất</p>
                              <p className="font-bold text-slate-800 text-sm">{selectedMemberDetail.name}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Số điện thoại</p>
                              <p className="font-bold text-slate-800 text-sm font-mono">{selectedMemberDetail.phone || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Crop Specific Details */}
                          <div className="p-6 bg-amber-50/45 rounded-3xl border border-amber-100/70 space-y-4">
                            <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">
                               <Sprout size={15} /> THÔNG TIN ĐỀ XUẤT CANH TÁC
                            </h4>
                            <div className="grid grid-cols-1 gap-3 text-xs text-slate-700">
                              <div className="flex justify-between items-center py-2 border-b border-amber-100/40">
                                <span className="font-semibold text-slate-600">Loại cây đề xuất:</span>
                                <span className="font-extrabold text-[#004d40] text-sm bg-white px-3 py-1 rounded-lg shadow-sm border border-amber-100">
                                  {selectedMemberDetail.cropName}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-amber-100/40">
                                <span className="font-semibold text-slate-600">Quy mô đăng ký trồng mới:</span>
                                <span className="font-black text-amber-700 font-mono text-sm bg-amber-100/50 px-3 py-1 rounded-lg">
                                  {selectedMemberDetail.area}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-amber-100/40">
                                <span className="font-semibold text-slate-600">Khu vực địa lý canh tác:</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                  <MapPin size={13} className="text-amber-600" />
                                  {selectedMemberDetail.address || selectedMemberDetail.province || 'Lâm Đồng'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="font-semibold text-slate-600">Sản lượng dự kiến:</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                  {selectedMemberDetail.expectedYield ? `${selectedMemberDetail.expectedYield} ${selectedMemberDetail.yieldUnit || 'Tấn'}` : 'Chưa cập nhật'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Warning / Audit Notice */}
                          <div className="p-4 bg-yellow-50/80 rounded-2xl border border-yellow-100 text-xs text-yellow-800 leading-relaxed font-medium">
                            ⚠️ <strong>Khảo sát thực địa:</strong> Hệ thống yêu cầu Cán bộ kỹ sư nông nghiệp thẩm định thổ nhưỡng và chất lượng nguồn nước tưới tiêu tại địa bàn trước khi ký chính thức Hợp đồng liên kết sản xuất sinh khối hữu cơ.
                          </div>

                          {/* Footer Actions */}
                          <div className="flex gap-3 pt-2">
                            <button 
                              onClick={() => {
                                 handleRejectMember(selectedMemberDetail.id);
                                 setSelectedMemberDetail(null);
                              }}
                              className="flex-1 py-3.5 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border border-transparent hover:border-red-100"
                            >
                              Bác bỏ đề xuất
                            </button>
                            <button 
                              onClick={() => {
                                 navigate(`/contract-customer/${selectedMemberDetail.id}`);
                              }}
                              className="flex-1 py-3.5 bg-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-lg shadow-forest/10 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                               <FileSignature size={14} /> Lập Hợp đồng & Duyệt
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 1.5 Crop Status Report */}
                      {selectedMemberDetail.type === 'crop_report' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            
                            {/* LEFT PANEL: THÔNG TIN TÌNH HÌNH CÂY TRỒNG */}
                            <div className="flex flex-col">
                              <div className="p-6 bg-teal-50/45 rounded-3xl border border-teal-100/70 space-y-4 flex-1 flex flex-col">
                                <h4 className="text-xs font-black text-teal-800 uppercase tracking-widest flex items-center gap-2 border-b border-teal-100 pb-2">
                                   <CheckCircle2 size={15} /> THÔNG TIN TÌNH HÌNH CÂY TRỒNG
                                </h4>
                                <div className="grid grid-cols-1 gap-3 text-xs text-slate-700 flex-1">
                                  <div className="flex justify-between items-center py-1.5 border-b border-teal-100/40">
                                    <span className="font-semibold text-slate-600">Cây trồng báo cáo:</span>
                                    <span className="font-extrabold text-[#004d40] text-xs bg-white px-3 py-1 rounded-lg shadow-sm border border-teal-100">
                                      {selectedMemberDetail.cropName}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center py-1.5 border-b border-teal-100/40">
                                    <span className="font-semibold text-slate-600">Quy mô diện tích:</span>
                                    <span className="font-black text-teal-800 font-mono bg-teal-100/30 px-3 py-1 rounded-lg">
                                      {selectedMemberDetail.area || 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center py-1.5 border-b border-teal-100/40">
                                    <span className="font-semibold text-slate-600">Trạng thái mới:</span>
                                    <span className="font-bold text-teal-700 bg-teal-100/50 px-3 py-1 rounded-lg">
                                      {selectedMemberDetail.cropStatus === 'cultivating' ? 'Đang canh tác' : selectedMemberDetail.cropStatus === 'harvested' ? 'Đã thu hoạch' : selectedMemberDetail.cropStatus === 'cancelled' ? 'Tạm dừng/Hủy' : selectedMemberDetail.cropStatus || 'Dự kiến'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center py-1.5 border-b border-teal-100/40">
                                    <span className="font-semibold text-slate-600">Giai đoạn sinh trưởng:</span>
                                    <span className="font-bold text-slate-800">{selectedMemberDetail.growthStage || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-1.5 border-b border-teal-100/40">
                                    <span className="font-semibold text-slate-600">Theo dõi sức khỏe:</span>
                                    <span className="font-bold text-emerald-600">{selectedMemberDetail.health || 'Bình thường'}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-1.5 border-b border-teal-100/40">
                                    <span className="font-semibold text-slate-600">Ngày xuống giống:</span>
                                    <span className="font-bold text-slate-800 font-mono">{selectedMemberDetail.plantingDate || 'Chưa cập nhật'}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-1.5 border-b border-teal-100/40">
                                    <span className="font-semibold text-slate-600">Ngày thu hoạch dự kiến:</span>
                                    <span className="font-bold text-slate-800 font-mono">{selectedMemberDetail.expectedHarvestDate || 'Chưa cập nhật'}</span>
                                  </div>
                                  <div className="py-2">
                                    <span className="font-semibold text-slate-600 block mb-1">Nội dung thay đổi chi tiết:</span>
                                    <span className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-dashed border-teal-100 italic leading-relaxed block max-h-[110px] overflow-y-auto">
                                      {selectedMemberDetail.reportDetails || 'Không có mô tả chi tiết.'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT PANEL: THÔNG TIN THÀNH VIÊN & NGƯỜI BÁO CÁO */}
                            <div className="flex flex-col justify-between space-y-4">
                              <div className="space-y-4 flex-1">
                                {/* Farmer Contact Card */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Xã viên báo cáo</p>
                                    <p className="font-bold text-slate-800 text-sm truncate">{selectedMemberDetail.name}</p>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Số điện thoại</p>
                                    <p className="font-bold text-slate-800 text-sm font-mono truncate">{selectedMemberDetail.phone || 'N/A'}</p>
                                  </div>
                                </div>

                                {/* Farmer Post-Harvest Decision */}
                                {selectedMemberDetail.cropStatus === 'harvested' && (
                                  <div className={`p-5 rounded-3xl border-2 shadow-lg space-y-3 transition-all duration-300 ring-4 ${
                                    selectedMemberDetail.postHarvestAction === 'end_cultivation' 
                                      ? 'bg-gradient-to-br from-rose-50 to-rose-100/30 border-rose-400 ring-rose-500/10 text-rose-950' 
                                      : 'bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-emerald-500 ring-emerald-500/10 text-emerald-950'
                                  }`}>
                                    <div className="flex items-center gap-2">
                                      <div className="relative flex h-2.5 w-2.5">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedMemberDetail.postHarvestAction === 'end_cultivation' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${selectedMemberDetail.postHarvestAction === 'end_cultivation' ? 'bg-rose-600' : 'bg-emerald-600'}`}></span>
                                      </div>
                                      <p className={`text-[9px] font-black uppercase tracking-widest ${
                                        selectedMemberDetail.postHarvestAction === 'end_cultivation' ? 'text-rose-800' : 'text-emerald-800'
                                      }`}>
                                        QUYẾT ĐỊNH SAU THU HOẠCH
                                      </p>
                                    </div>
                                    <h5 className={`font-black text-sm tracking-tight flex items-center gap-1.5 ${
                                      selectedMemberDetail.postHarvestAction === 'end_cultivation' ? 'text-rose-800' : 'text-emerald-800'
                                    }`}>
                                      {selectedMemberDetail.postHarvestAction === 'end_cultivation' ? (
                                        <>🛑 KẾT THÚC ĐỢT CANH TÁC</>
                                      ) : (
                                        <>🌿 TIẾP TỤC MÙA VỤ MỚI</>
                                      )}
                                    </h5>
                                    <p className="text-[10px] text-slate-600 font-extrabold leading-relaxed">
                                      {selectedMemberDetail.postHarvestAction === 'end_cultivation' 
                                        ? 'Xã viên mong muốn kết thúc quá trình liên kết sản xuất và thanh lý / vô hiệu hóa hợp đồng nông nghiệp hiện tại.' 
                                        : 'Xã viên đăng ký gia hạn hợp đồng liên kết sản xuất nông nghiệp mới để chuẩn bị xuống giống lứa tiếp theo.'}
                                    </p>
                                    <div className={`pt-2.5 flex items-center justify-between border-t mt-1.5 ${
                                      selectedMemberDetail.postHarvestAction === 'end_cultivation' ? 'border-rose-200/60' : 'border-emerald-250/60'
                                    }`}>
                                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Chính sách HTX:</span>
                                      <span className={`text-[9px] px-3 py-1 rounded-xl font-black tracking-widest uppercase transition-all shadow-md ${
                                        selectedMemberDetail.postHarvestAction === 'end_cultivation' 
                                          ? 'bg-rose-600 text-white shadow-rose-200' 
                                          : 'bg-emerald-600 text-white shadow-emerald-200'
                                      }`}>
                                        {selectedMemberDetail.postHarvestAction === 'end_cultivation' ? 'Thanh lý HĐ' : 'Gia hạn HĐ'}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Detailed Registration Form */}
                                <div className="p-6 bg-emerald-50/45 rounded-3xl border border-emerald-100/70 space-y-4">
                                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2 border-b border-emerald-100 pb-2">
                                     <IdCard size={15} /> THÔNG TIN ĐĂNG KÝ THÀNH VIÊN
                                  </h4>

                                  <div className="space-y-2.5 text-xs text-slate-700">
                                    <div className="flex justify-between items-center py-1 border-b border-emerald-100/35">
                                      <span className="font-semibold text-slate-500">Số CCCD / Định danh:</span>
                                      <span className="font-bold text-slate-800 font-mono">{selectedMemberDetail.cccd || '123456789101'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-emerald-100/35">
                                      <span className="font-semibold text-slate-500">Hợp tác xã gia nhập:</span>
                                      <span className="font-extrabold text-[#004d40]">
                                        {selectedMemberDetail.cooperativeName || 'HTX Cà phê Cầu Đất'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-emerald-100/35">
                                      <span className="font-semibold text-slate-500">Cây trồng canh tác chủ lực:</span>
                                      <span className="font-bold text-slate-800">{selectedMemberDetail.crop || 'Cà phê Arabica'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-emerald-100/35">
                                      <span className="font-semibold text-slate-500">Quy mô diện tích đất:</span>
                                      <span className="font-black text-emerald-700 font-mono italic">{selectedMemberDetail.area || '1.5 ha'}</span>
                                    </div>
                                    <div className="flex justify-between items-start py-1">
                                      <span className="font-semibold text-slate-500 shrink-0">Địa chỉ cư trú:</span>
                                      <span className="font-medium text-slate-850 text-right leading-snug">
                                        {selectedMemberDetail.address || 'Cầu Đất, Đà Lạt, Lâm Đồng'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Footer Actions Specific to Crop Report */}
                              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
                                <button 
                                  onClick={() => {
                                     handleRejectMember(selectedMemberDetail.id);
                                     setSelectedMemberDetail(null);
                                  }}
                                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border border-transparent hover:border-rose-100"
                                >
                                  Từ chối báo cáo
                                </button>
                                <button 
                                  onClick={() => {
                                     handleApproveMember(selectedMemberDetail.id);
                                     setSelectedMemberDetail(null);
                                  }}
                                  className="flex-1 py-3.5 bg-teal-600 text-white hover:bg-teal-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-teal-100/50"
                                >
                                   <CheckCircle2 size={14} /> Xác nhận và lưu quy trình
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}

                      {/* 2. Support Material Request */}
                      {selectedMemberDetail.type === 'agricultural_request' && (
                        <div className="space-y-6">
                          {/* Farmer Contact Card */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Nông dân đề nghị</p>
                              <p className="font-bold text-slate-800 text-sm">{selectedMemberDetail.name}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Số điện thoại</p>
                              <p className="font-bold text-slate-800 text-sm font-mono">{selectedMemberDetail.phone || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Request materials & explanation bubble */}
                          <div className="p-5 bg-indigo-50/40 rounded-3xl border border-indigo-100/60 space-y-4">
                            <h4 className="text-xs font-black text-indigo-800 uppercase tracking-widest flex items-center gap-2">
                               <Package size={15} /> CÁC HẠNG MỤC YÊU CẦU CẤP PHÁT
                            </h4>

                            {/* Categorized Badges */}
                            <div className="flex flex-wrap gap-2 pb-3 border-b border-indigo-100/35">
                              {(selectedMemberDetail.requestsArr || []).map((item: string, idx: number) => {
                                let themeClasses = "bg-slate-100 text-slate-700 border-slate-200";
                                if (item.includes("cây giống")) themeClasses = "bg-blue-100/80 text-blue-800 border-blue-200";
                                else if (item.includes("phân bón")) themeClasses = "bg-emerald-100/80 text-emerald-800 border-emerald-200";
                                else if (item.includes("BVTV")) themeClasses = "bg-rose-100/80 text-rose-800 border-rose-200";
                                else if (item.includes("kỹ thuật")) themeClasses = "bg-amber-100/80 text-amber-800 border-amber-200";

                                return (
                                  <span key={idx} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${themeClasses}`}>
                                    {item}
                                  </span>
                                );
                              })}
                            </div>

                            {/* Detail text memo from the farmer */}
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Ý kiến / Mô tả nhu cầu thực tế</p>
                              <div className="bg-white p-4 rounded-2xl border border-dashed border-indigo-100 flex flex-col gap-3">
                                {(() => {
                                  const text = selectedMemberDetail.crop || 'Mong muốn được hợp tác xã hỗ trợ cung ứng vật tư đạt chuẩn hữu cơ để chăm sóc vườn.';
                                  const parts = text.split('📌');
                                  
                                  return (
                                    <>
                                      {parts[0].trim() && (
                                        <p className="text-sm text-slate-700 italic leading-relaxed whitespace-pre-wrap pb-3 border-b border-slate-100">
                                          &ldquo;{parts[0].trim()}&rdquo;
                                        </p>
                                      )}
                                      
                                      {parts.slice(1).map((part: string, index: number) => {
                                        const lines = part.trim().split('\n');
                                        const title = lines[0].replace(/\[|\]/g, '').trim();
                                        const items = lines.slice(1).filter((l: string) => l.trim().startsWith('-'));
                                        
                                        return (
                                          <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                            <h5 className="text-[11px] font-black text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                               <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                               {title}
                                            </h5>
                                            <ul className="space-y-1.5">
                                              {items.map((item: string, i: number) => {
                                                const [key, ...vals] = item.replace(/^- /, '').split(': ');
                                                return (
                                                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2 ml-1">
                                                    <span className="font-bold text-slate-700 w-24 shrink-0">{key}:</span>
                                                    <span className="flex-1">{vals.join(': ')}</span>
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>
                                        );
                                      })}
                                    </>
                                  );
                                })()}
                                {selectedMemberDetail.image && (
                                  <div className="border border-indigo-100 rounded-2xl overflow-hidden p-3 bg-slate-50 mt-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">Hình ảnh được đính kèm</p>
                                    <img src={selectedMemberDetail.image} alt="Tình trạng ruộng đính kèm" className="max-h-48 mx-auto object-contain rounded-xl shadow-sm border border-slate-200" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Allocation guide line info notice */}
                          <div className="p-4 bg-[#004d40]/5 rounded-2xl border border-[#004d40]/10 text-sm text-[#004d40] font-medium leading-relaxed">
                            🌾 <strong>Khuyến nghị Điều phối:</strong> Phê duyệt ngay để đưa hồ sơ này vào Danh bạ Phân cấp hỗ trợ. Sau kì bàn giao, Quản trị viên có thể điều tiết vật tư trực tiếp tại phân mục <strong>"Báo cáo & Phân phối"</strong>.
                          </div>

                          {/* Footer Actions */}
                          <div className="flex gap-4 pt-4">
                            <button 
                              onClick={() => {
                                 handleRejectMember(selectedMemberDetail.id);
                                 setSelectedMemberDetail(null);
                              }}
                              className="flex-1 py-4 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border border-transparent hover:border-red-100"
                            >
                              Từ chối đề đạt
                            </button>
                            <button 
                              onClick={() => {
                                 handleApproveMember(selectedMemberDetail.id);
                                 setSelectedMemberDetail(null);
                              }}
                              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#004d40] transition-all shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
                            >
                               <CheckCircle2 size={16} /> Phê duyệt hỗ trợ
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 3. New Member Registrations */}
                      {selectedMemberDetail.type !== 'crop_approval' && selectedMemberDetail.type !== 'agricultural_request' && selectedMemberDetail.type !== 'crop_report' && (
                        <div className="space-y-6">
                          {/* Personal Info Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Họ và tên xã viên</p>
                              <p className="font-bold text-slate-800 text-sm">{selectedMemberDetail.name}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Số điện thoại</p>
                              <p className="font-bold text-slate-800 text-sm font-mono">{selectedMemberDetail.phone || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Detailed Registration Form data card */}
                          <div className="p-6 bg-emerald-50/45 rounded-3xl border border-emerald-100/70 space-y-4">
                            <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                               <IdCard size={15} /> THÔNG TIN ĐĂNG KÝ THÀNH VIÊN
                            </h4>

                            <div className="space-y-3.5 text-xs text-slate-700">
                              <div className="flex justify-between items-center py-1.5 border-b border-emerald-100/35">
                                <span className="font-semibold text-slate-500">Số CCCD / Định danh:</span>
                                <span className="font-bold text-slate-850 font-mono">{selectedMemberDetail.cccd || '123456789101'}</span>
                              </div>
                              <div className="flex justify-between items-center py-1.5 border-b border-emerald-100/35">
                                <span className="font-semibold text-slate-500">Hợp tác xã gia nhập:</span>
                                <span className="font-extrabold text-[#004d40]">
                                  {selectedMemberDetail.cooperativeName || 'HTX Cà phê Cầu Đất'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-1.5 border-b border-emerald-100/35">
                                <span className="font-semibold text-slate-500">Cây trồng canh tác chủ lực:</span>
                                <span className="font-bold text-slate-800">{selectedMemberDetail.crop || 'Cà phê Arabica'}</span>
                              </div>
                              <div className="flex justify-between items-center py-1.5 border-b border-emerald-100/35">
                                <span className="font-semibold text-slate-500">Quy mô diện tích đất:</span>
                                <span className="font-black text-emerald-700 font-mono italic">{selectedMemberDetail.area || '1.5 ha'}</span>
                              </div>
                              <div className="flex justify-between items-start py-1.5">
                                <span className="font-semibold text-slate-500 shrink-0">Địa chỉ cư trú:</span>
                                <span className="font-bold text-slate-800 text-right leading-snug font-medium">
                                  {selectedMemberDetail.address || 'Cầu Đất, Đà Lạt, Lâm Đồng'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Credentials Auto Generation notification */}
                          <div className="p-4 bg-emerald-50 text-xs text-emerald-800 rounded-2xl border border-emerald-100/65 flex items-start gap-2.5 font-medium leading-relaxed">
                            <Shield className="text-emerald-600 shrink-0 mt-0.5 animate-pulse" size={16} />
                            <div>
                              <strong>Cấp số định danh tài khoản:</strong> Sau khi phê duyệt thành công, hệ thống tự động sinh tài khoản bảo mật và mật khẩu lưu hành nội bộ để cấp cho xã viên.
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="flex gap-3 pt-2">
                            <button 
                              onClick={() => {
                                 handleRejectMember(selectedMemberDetail.id);
                                 setSelectedMemberDetail(null);
                              }}
                              className="flex-1 py-3.5 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border border-transparent hover:border-red-100"
                            >
                              Từ chối hồ sơ
                            </button>
                            <button 
                              onClick={() => {
                                 handleApproveMember(selectedMemberDetail.id);
                                 setSelectedMemberDetail(null);
                              }}
                              className="flex-1 py-3.5 bg-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-lg shadow-forest/15 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                               <CheckCircle2 size={14} /> Phê duyệt Gia nhập
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}

                {/* Contract Signing Modal */}
                {isContractSigningOpen && selectedMemberDetail && (
                  <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                    />
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-forest rounded-2xl flex items-center justify-center text-white shadow-lg shadow-forest/20">
                            <Receipt size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-forest">Tạo Hợp đồng Hợp tác Sản Xuất</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Hệ thống VietAgri Digital - Quản lý Hợp đồng</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsContractSigningOpen(false)}
                          className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm"
                        >
                          <XCircle size={24} />
                        </button>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 overflow-y-auto p-12 bg-[#fcfcfc]">
                        <div className="max-w-3xl mx-auto space-y-12 bg-white p-16 shadow-2xl border border-slate-100 rounded-lg relative">
                             {/* Watermark */}
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none rotate-[-45deg]">
                                <h1 className="text-9xl font-black text-forest whitespace-nowrap uppercase">Hợp đồng liên kết sản xuất</h1>
                             </div>

                             <div className="text-center space-y-2 mb-12">
                                <h2 className="text-2xl font-black text-forest uppercase tracking-tight leading-tight">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                                <p className="text-sm font-bold text-slate-700">Độc lập - Tự do - Hạnh phúc</p>
                                <div className="w-40 h-px bg-slate-200 mx-auto mt-4 mb-4"></div>
                                <h2 className="text-xl font-black text-forest uppercase tracking-tight mt-[3px]">HỢP ĐỒNG HỢP TÁC SẢN XUẤT NÔNG NGHIỆP</h2>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số:</label>
                                   <input 
                                      type="text" 
                                      value={contractForm.contractNo} 
                                      onChange={(e) => updateContractField('contractNo', e.target.value)}
                                      className="bg-transparent border-b border-forest/20 text-xs font-bold text-forest focus:border-forest outline-none px-2 w-48 text-center" 
                                   />
                                </div>
                             </div>

                             <div className="space-y-10 text-slate-700 leading-relaxed text-sm">
                                {/* Thông tin chung */}
                                <section className="space-y-4">
                                   <h4 className="font-black text-forest uppercase text-[10px] tracking-widest border-b border-forest/10 pb-2">THÔNG TIN CHUNG</h4>
                                   <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-1">
                                         <label className="text-[9px] font-black text-slate-400 uppercase">Ngày ký hợp đồng</label>
                                         <input type="date" value={contractForm.date} onChange={(e) => updateContractField('date', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:bg-white transition-all outline-none" />
                                      </div>
                                      <div className="space-y-1">
                                         <label className="text-[9px] font-black text-slate-400 uppercase">Tại địa chỉ</label>
                                         <input type="text" value={contractForm.location} onChange={(e) => updateContractField('location', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:bg-white transition-all outline-none" />
                                      </div>
                                   </div>
                                </section>

                                <div className="grid grid-cols-2 gap-12">
                                   {/* Party A - Farmer */}
                                   <section className="space-y-4">
                                      <h4 className="font-black text-forest uppercase text-[10px] tracking-widest border-b border-forest/10 pb-2 flex items-center gap-2">
                                         <User size={14} /> I. BÊN A: HỘ NÔNG DÂN
                                      </h4>
                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Họ và tên đầy đủ</label>
                                            <input type="text" value={contractForm.partyA.name} onChange={(e) => updateContractField('partyA.name', e.target.value)} placeholder="Ghi chữ hoa có dấu" className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:bg-white transition-all outline-none uppercase" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Số CCCD / Định danh</label>
                                            <input type="text" value={contractForm.partyA.cccd} onChange={(e) => updateContractField('partyA.cccd', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Ngày cấp & Nơi cấp CCCD</label>
                                            <input type="text" value={contractForm.partyA.cccdDatePlace} onChange={(e) => updateContractField('partyA.cccdDatePlace', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs text-slate-600 outline-none" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Địa chỉ thường trú</label>
                                            <textarea value={contractForm.partyA.address} onChange={(e) => updateContractField('partyA.address', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs text-slate-600 focus:bg-white transition-all outline-none h-16" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Số điện thoại di động</label>
                                            <input type="text" value={contractForm.partyA.phone} onChange={(e) => updateContractField('partyA.phone', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 outline-none" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Vị trí vùng trồng (Tỉnh/Huyện/Xã)</label>
                                            <input type="text" value={contractForm.partyA.areaLocation} onChange={(e) => updateContractField('partyA.areaLocation', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 outline-none" />
                                         </div>
                                      </div>
                                   </section>

                                   {/* Party B - HTX */}
                                   <section className="space-y-4">
                                      <h4 className="font-black text-forest uppercase text-[10px] tracking-widest border-b border-forest/10 pb-2 flex items-center gap-2">
                                         <Building size={14} /> II. BÊN B: HỢP TÁC XÃ
                                      </h4>
                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Tên Hợp tác xã</label>
                                            <input type="text" value={contractForm.partyB.name} onChange={(e) => updateContractField('partyB.name', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:bg-white transition-all outline-none" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Mã số thuế HTX</label>
                                            <input type="text" value={contractForm.partyB.taxCode} onChange={(e) => updateContractField('partyB.taxCode', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Địa chỉ trụ sở chính</label>
                                            <textarea value={contractForm.partyB.address} onChange={(e) => updateContractField('partyB.address', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs text-slate-600 focus:bg-white transition-all outline-none h-16" />
                                         </div>
                                         <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                               <label className="text-[9px] font-black text-slate-400 uppercase">Người đại diện</label>
                                               <input type="text" value={contractForm.partyB.rep} onChange={(e) => updateContractField('partyB.rep', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                               <label className="text-[9px] font-black text-slate-400 uppercase">Chức vụ</label>
                                               <input type="text" value={contractForm.partyB.position} onChange={(e) => updateContractField('partyB.position', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs text-slate-600 outline-none" />
                                            </div>
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Số điện thoại liên hệ</label>
                                            <input type="text" value={contractForm.partyB.phone} onChange={(e) => updateContractField('partyB.phone', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs outline-none" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Tài khoản ngân hàng</label>
                                            <input type="text" value={contractForm.partyB.bankAccount} onChange={(e) => updateContractField('partyB.bankAccount', e.target.value)} className="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-2 text-xs outline-none" />
                                         </div>
                                      </div>
                                   </section>
                                </div>

                                {/* Điều 1: Đối tượng hợp đồng */}
                                <section className="space-y-6">
                                   <h4 className="font-black text-forest uppercase text-[10px] tracking-widest border-b border-forest/10 pb-2">ĐIỀU 1: NỘI DUNG HỢP TÁC SẢN XUẤT</h4>
                                   <div className="grid grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Loại nông sản hợp tác</label>
                                            <input type="text" value={contractForm.product.type} onChange={(e) => updateContractField('product.type', e.target.value)} placeholder="Cà phê Arabica, Lúa OM18..." className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Tiêu chuẩn chất lượng cam kết</label>
                                            <select value={contractForm.product.standard} onChange={(e) => updateContractField('product.standard', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest">
                                               <option value="VietGAP">VietGAP</option>
                                               <option value="GlobalGAP">GlobalGAP</option>
                                               <option value="Hữu cơ (Organic)">Hữu cơ (Organic)</option>
                                               <option value="An toàn sinh học">An toàn sinh học</option>
                                               <option value="Không dư lượng thuốc BVTV">Không dư lượng thuốc BVTV</option>
                                            </select>
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Diện tích/Quy mô vùng trồng</label>
                                            <input type="text" value={contractForm.product.areaScale} onChange={(e) => updateContractField('product.areaScale', e.target.value)} placeholder="2.5 Hécta, 5000 m2..." className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                      </div>

                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Chính sách hỗ trợ đầu vào</label>
                                            <div className="grid grid-cols-1 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                               {['Hỗ trợ hạt giống/cây giống', 'Cung cấp phân bón/thuốc BVTV (trả sau)', 'Hỗ trợ kỹ thuật/đào tạo VietGAP', 'Ứng trước vốn sản xuất'].map(policy => (
                                                  <label key={policy} className="flex items-center gap-2 cursor-pointer group">
                                                     <input 
                                                        type="checkbox" 
                                                        checked={contractForm.product.policies.includes(policy)}
                                                        onChange={(e) => {
                                                           const newPolicies = e.target.checked 
                                                              ? [...contractForm.product.policies, policy]
                                                              : contractForm.product.policies.filter(p => p !== policy);
                                                           updateContractField('product.policies', newPolicies);
                                                        }}
                                                        className="w-4 h-4 rounded text-forest focus:ring-forest" 
                                                     />
                                                     <span className="text-[10px] text-slate-600 font-medium group-hover:text-forest transition-colors">{policy}</span>
                                                  </label>
                                               ))}
                                            </div>
                                         </div>
                                         <div className="flex items-center justify-between p-3 bg-forest/5 rounded-xl border border-forest/10">
                                            <div className="flex flex-col">
                                               <span className="text-[10px] font-black text-forest uppercase">Truy xuất nguồn gốc</span>
                                               <span className="text-[8px] text-slate-500">HTX chịu trách nhiệm gắn mã QR</span>
                                            </div>
                                            <button 
                                               type="button"
                                               onClick={() => updateContractField('product.traceability', !contractForm.product.traceability)}
                                               className={`w-10 h-5 rounded-full relative transition-colors ${contractForm.product.traceability ? 'bg-forest' : 'bg-slate-300'}`}
                                            >
                                               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${contractForm.product.traceability ? 'right-1' : 'left-1'}`} />
                                            </button>
                                         </div>
                                      </div>
                                   </div>
                                </section>

                                {/* Điều 2: Kế hoạch giao nhận */}
                                <section className="space-y-6">
                                   <h4 className="font-black text-forest uppercase text-[10px] tracking-widest border-b border-forest/10 pb-2">ĐIỀU 2: KẾ HOẠCH CUNG ỨNG & GIAO NHẬN</h4>
                                   <div className="grid grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Số lượng cung ứng cam kết</label>
                                            <div className="flex gap-2">
                                               <input type="number" value={contractForm.product.quantity} onChange={(e) => updateContractField('product.quantity', e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                               <select value={contractForm.product.unit} onChange={(e) => updateContractField('product.unit', e.target.value)} className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none font-bold text-forest">
                                                  <option value="Tấn">Tấn</option>
                                                  <option value="Tạ">Tạ</option>
                                                  <option value="Kg">Kg</option>
                                               </select>
                                            </div>
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Tần suất / Lịch trình giao nhận</label>
                                            <select value={contractForm.product.frequency} onChange={(e) => updateContractField('product.frequency', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest">
                                               <option value="Giao một lần tập trung">Giao một lần tập trung</option>
                                               <option value="Hàng tuần">Hàng tuần</option>
                                               <option value="Hàng tháng">Hàng tháng</option>
                                               <option value="Theo đợt thu hoạch vụ mùa">Theo đợt thu hoạch vụ mùa</option>
                                            </select>
                                         </div>
                                         <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                               <label className="text-[9px] font-black text-slate-400 uppercase">Ngày bắt đầu cung ứng</label>
                                               <input type="text" value={contractForm.product.startTime} onChange={(e) => updateContractField('product.startTime', e.target.value)} placeholder="01/06/2026" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none font-bold text-forest" />
                                            </div>
                                            <div className="space-y-1">
                                               <label className="text-[9px] font-black text-slate-400 uppercase">Ngày kết thúc cung ứng</label>
                                               <input type="text" value={contractForm.product.endTime} onChange={(e) => updateContractField('product.endTime', e.target.value)} placeholder="30/11/2026" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none font-bold text-forest" />
                                            </div>
                                         </div>
                                      </div>

                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Thời hạn thông báo từ chối nhận hàng (Số ngày)</label>
                                            <input type="number" value={contractForm.product.rejectionDays} onChange={(e) => updateContractField('product.rejectionDays', e.target.value)} placeholder="Vd: 2" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Thông báo thay đổi lịch (Số ngày)</label>
                                            <input type="number" value={contractForm.product.changeNoticeDays} onChange={(e) => updateContractField('product.changeNoticeDays', e.target.value)} placeholder="Vd: 3" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Địa điểm giao nhận nông sản</label>
                                            <select value={contractForm.product.deliveryLocation} onChange={(e) => updateContractField('product.deliveryLocation', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest">
                                               <option value="Tại rẫy/vườn của Bên A">Tại rẫy/vườn của Bên A</option>
                                               <option value="Tại kho trung chuyển của HTX (Bên B)">Tại kho trung chuyển của HTX (Bên B)</option>
                                               <option value="Địa điểm khác">Địa điểm khác</option>
                                            </select>
                                         </div>
                                      </div>
                                   </div>
                                </section>

                                {/* Điều 4: Cấu hình giá cả & Thanh toán */}
                                <section className="space-y-6">
                                   <div className="p-4 bg-forest/5 rounded-2xl border border-forest/10 mb-2">
                                      <h4 className="font-black text-forest uppercase text-[10px] tracking-widest border-b border-forest/10 pb-2 mb-2">ĐIỀU 4: GIÁ CẢ & PHƯƠNG THỨC THANH TOÁN</h4>
                                      <p className="text-[9px] text-forest/70 font-medium italic">Thiết lập cơ chế giá và hạn định tài chính giữa HTX và Xã viên.</p>
                                   </div>
                                   <div className="grid grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Giá thu mua cam kết</label>
                                            <div className="flex gap-2">
                                               <input type="number" value={contractForm.payment.price} onChange={(e) => updateContractField('payment.price', e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                               <select value={contractForm.payment.unit} onChange={(e) => updateContractField('payment.unit', e.target.value)} className="w-32 bg-white border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none font-bold text-forest">
                                                  <option value="Đồng/kg">Đồng/kg</option>
                                                  <option value="Đồng/tấn">Đồng/tấn</option>
                                                  <option value="Đồng/bộ">Đồng/bộ</option>
                                               </select>
                                            </div>
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Cơ chế điều chỉnh giá</label>
                                            <div className="space-y-2 py-2">
                                               {['Giá cố định suốt hợp đồng', 'Điều chỉnh theo giá thị trường (thỏa thuận bằng văn bản)'].map(adj => (
                                                  <label key={adj} className="flex items-center gap-2 cursor-pointer group">
                                                     <input 
                                                        type="radio" 
                                                        name="priceAdjustment" 
                                                        checked={contractForm.payment.priceAdjustment === adj} 
                                                        onChange={() => updateContractField('payment.priceAdjustment', adj)}
                                                        className="w-4 h-4 text-forest focus:ring-forest" 
                                                     />
                                                     <span className="text-[10px] text-slate-600 font-medium group-hover:text-forest transition-colors">{adj}</span>
                                                  </label>
                                               ))}
                                            </div>
                                         </div>
                                      </div>

                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Phương thức thanh toán</label>
                                            <select value={contractForm.payment.method} onChange={(e) => updateContractField('payment.method', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest">
                                               <option value="Chuyển khoản ngân hàng">Chuyển khoản ngân hàng</option>
                                               <option value="Tiền mặt">Tiền mặt</option>
                                               <option value="Ví điện tử/Liên kết ứng dụng">Ví điện tử/Liên kết ứng dụng</option>
                                            </select>
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Hạn định thanh toán (Số ngày sau khi đạt QC)</label>
                                            <input type="number" value={contractForm.payment.deadlineDays} onChange={(e) => updateContractField('payment.deadlineDays', e.target.value)} placeholder="Vd: 7" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                      </div>
                                   </div>
                                </section>

                                {/* Notary & Jurisdiction */}
                                <section className="space-y-6">
                                   <div className="grid grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                         <h4 className="font-black text-forest uppercase text-[10px] tracking-widest border-b border-forest/10 pb-2">CHI PHÍ CÔNG CHỨNG</h4>
                                         <div className="space-y-2 py-2">
                                            {['Bên A (Nông dân) chịu', 'Bên B (Hợp tác xã) chịu', 'Cả hai bên chia đôi (50/50)'].map(bearer => (
                                               <label key={bearer} className="flex items-center gap-2 cursor-pointer group">
                                                  <input 
                                                     type="radio" 
                                                     name="notaryFee" 
                                                     checked={contractForm.notary.feeBearer === bearer} 
                                                     onChange={() => updateContractField('notary.feeBearer', bearer)}
                                                     className="w-4 h-4 text-forest focus:ring-forest" 
                                                  />
                                                  <span className="text-[10px] text-slate-600 font-medium group-hover:text-forest transition-colors">{bearer}</span>
                                               </label>
                                            ))}
                                         </div>
                                      </div>
                                      <div className="space-y-4">
                                         <h4 className="font-black text-forest uppercase text-[10px] tracking-widest border-b border-forest/10 pb-2">TÒA ÁN THẨM QUYỀN</h4>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Địa bàn Tòa án giải quyết tranh chấp</label>
                                            <input type="text" value={contractForm.jurisdiction.court} onChange={(e) => updateContractField('jurisdiction.court', e.target.value)} placeholder="Vd: Huyện Đức Hòa, Tỉnh Long An" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                      </div>
                                   </div>
                                </section>

                                {/* Article 8: Hiệu lực hợp đồng */}
                                <section className="space-y-6">
                                   <h4 className="font-black text-forest uppercase text-[10px] tracking-widest border-b border-forest/10 pb-2">ĐIỀU 8: HIỆU LỰC HỢP ĐỒNG & PHÂN PHÁT</h4>
                                   <div className="grid grid-cols-2 gap-8">
                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Ngày bắt đầu hiệu lực</label>
                                            <input type="text" value={contractForm.validity.startDate} onChange={(e) => updateContractField('validity.startDate', e.target.value)} placeholder="Vd: 23/05/2026" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Ngày kết thúc hiệu lực</label>
                                            <input type="text" value={contractForm.validity.endDate} onChange={(e) => updateContractField('validity.endDate', e.target.value)} placeholder="Vd: 23/05/2027" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                      </div>
                                      <div className="space-y-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Tổng số lượng bản hợp đồng lập</label>
                                            <input type="number" value={contractForm.validity.totalCopies} onChange={(e) => updateContractField('validity.totalCopies', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Mỗi bên giữ (bản)</label>
                                            <input type="number" value={contractForm.validity.copiesPerParty} onChange={(e) => updateContractField('validity.copiesPerParty', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none font-bold text-forest" />
                                         </div>
                                      </div>
                                   </div>
                                </section>

                                <div className="grid grid-cols-2 gap-8 pt-12 border-t border-slate-100 mt-12">


                                </div>
                             </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-between">
                         <div className="flex items-center gap-3 text-slate-400">
                            <Shield className="text-mint" size={20} />
                            <div className="flex flex-col">
                               <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">Ký kết an toàn</p>
                               <p className="text-[10px]">Đảm bảo bằng công nghệ Blockchain & Chữ ký số VietAgri</p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button 
                               onClick={() => setIsContractSigningOpen(false)}
                               className="px-8 py-4 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-slate-800 transition-colors"
                            >
                               Quay lại
                            </button>
                            <button 
                               onClick={() => {
                                  handleApproveMember(selectedMemberDetail.id);
                                  setIsContractSigningOpen(false);
                                  setSelectedMemberDetail(null);
                                  setToastMessage("Hợp đồng đã được ký kết & phê duyệt thành công!");
                               }}
                               className="px-12 py-4 bg-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 flex items-center gap-2"
                            >
                               <Pencil size={14} /> XÁC NHẬN KÝ & PHÊ DUYỆT
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Quick Reports / Distribution */}
                <div className="bg-forest rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-mint/20 rounded-full blur-3xl -mt-16 -mr-16" />
                  <h3 className="text-xl font-black mb-6 relative z-10">Phối lợi nhuận</h3>
                  <div className="space-y-6 relative z-10">
                    <div className="p-6 bg-white/10 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Quỹ HTX đã tích lũy</p>
                      <p className="text-3xl font-black text-mint">842.5M</p>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Phân phối nông dân', percent: '70%', amount: '589.7M' },
                        { label: 'Quỹ tái đầu tư', percent: '20%', amount: '168.5M' },
                        { label: 'Chi phí vận hành', percent: '10%', amount: '84.2M' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold">{item.label}</p>
                            <div className="w-32 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-mint" style={{ width: item.percent }} />
                            </div>
                          </div>
                          <p className="text-sm font-black text-mint">{item.amount}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-4 bg-white text-forest rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-colors mt-4">
                      Thực hiện chi trả
                    </button>
                  </div>
                </div>
              </div>

               {/* Secured Staff Accounts List */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden mt-8">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between col-span-full">
                  <div>
                    <h3 className="text-xl font-black text-forest">Danh sách Tài khoản Nông dân đã cấp</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tài khoản nông hộ nông dân được bảo mật và liên kết chặt chẽ theo HTX & Admin đại diện</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsViewAllStaffModalOpen(true)}
                      className="text-mint font-black text-xs uppercase tracking-widest hover:text-emerald-700 transition-all cursor-pointer"
                      title="Xem tất cả tài khoản nông dân"
                    >
                      Xem tất cả
                    </button>
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-1">
                      🛡️ Bảo mật Hệ thống HTX
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Xã viên / Vai trò</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Số Điện Thoại / CCCD</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bộ Mã Bảo Mật (Xã viên / HTX / Admin)</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã Định danh Liên kết Toàn diện</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phạm vi Truy cập</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffAccounts.map((staff, i) => (
                        <tr 
                          key={staff.id || i} 
                          onClick={() => {
                            setSelectedMember(staff);
                            setIsMemberDetailsModalOpen(true);
                          }}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center font-black text-forest text-sm">
                                {staff.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-forest text-sm">{staff.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{staff.role || 'Nhân viên'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-semibold text-slate-700">{staff.phone}</p>
                            <p className="text-xs text-slate-400 font-mono">CCCD: {staff.cccd || '---'}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-800 text-[9px] font-mono font-bold rounded">
                                  Xã viên: {staff.memberId || 'XV-XXX'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-mono font-bold rounded">
                                  HTX: {staff.cooperativeId || 'HTX-001'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 text-[9px] font-mono font-bold rounded font-bold">
                                  Admin: {staff.createdByAdminId || 'ADM-001'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <code className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-150 break-all block max-w-xs overflow-hidden text-ellipsis">
                              {staff.id}
                            </code>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-rose-50 border border-rose-200/50 text-rose-700 text-[9px] font-black rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                              🔒 Chỉ HTX {staff.cooperativeId || 'HTX-001'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>)}

            {activeTab === 'products' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-forest text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Số lượng sản phẩm</p>
                      <p className="text-2xl font-black text-forest">{products.length}</p>
                    </div>
                  </motion.div>
                </div>

                {isAddingToCatalog ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-forest/10 text-forest rounded-2xl flex items-center justify-center">
                          <Package size={28} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-forest">Thêm Sản phẩm vào Danh mục</h3>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Quản lý danh sách sản phẩm HTX vận hành</p>
                        </div>
                      </div>
                      <button onClick={() => setIsAddingToCatalog(false)} className="text-slate-400 font-bold">Hủy</button>
                    </div>

                    <form onSubmit={handleAddToCatalog} className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tên sản phẩm quản lý</label>
                          <input 
                            required 
                            type="text" 
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-forest outline-none border-2 border-transparent focus:border-forest" 
                            value={newCatalogItem.name}
                            onChange={(e) => setNewCatalogItem({...newCatalogItem, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Danh mục</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-forest outline-none border-2 border-transparent focus:border-forest"
                            value={newCatalogItem.category}
                            onChange={(e) => setNewCatalogItem({...newCatalogItem, category: e.target.value})}
                          >
                            <option>Cà phê</option>
                            <option>Trái cây</option>
                            <option>Gia vị</option>
                            <option>Hạt</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Giá niêm yết</label>
                            <input 
                              required 
                              type="text" 
                              placeholder="450.000"
                              className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-forest outline-none border-2 border-transparent focus:border-forest" 
                              value={newCatalogItem.basePrice}
                              onChange={(e) => setNewCatalogItem({...newCatalogItem, basePrice: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Đơn vị</label>
                            <input 
                              required 
                              type="text" 
                              placeholder="kg"
                              className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold text-forest outline-none border-2 border-transparent focus:border-forest" 
                              value={newCatalogItem.unit}
                              onChange={(e) => setNewCatalogItem({...newCatalogItem, unit: e.target.value})}
                            />
                          </div>
                        </div>
                        <button className="w-full py-5 bg-forest text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-mint transition-all mt-6 shadow-xl shadow-forest/20">
                          Xác nhận Thêm vào Danh mục
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row items-sm-center justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-black text-forest tracking-tight">Danh mục & Giá bán chung</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Bảng giá niêm yết áp dụng toàn mạng lưới HTX</p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setIsAddingToCatalog(true)}
                          className="px-6 py-3 bg-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 flex items-center gap-2"
                        >
                           <PlusCircle size={16} /> Thêm sản phẩm quản lý
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 w-full md:w-96">
                          <Search className="text-slate-400" size={18} />
                          <input type="text" placeholder="Tìm tên sản phẩm, mã SP..." className="bg-transparent outline-none w-full text-sm font-medium" />
                        </div>
                        <div className="flex items-center gap-2">
                           <select className="px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-forest rounded-xl outline-none font-bold text-forest transition-all appearance-none text-sm cursor-pointer border border-slate-200">
                            <option>Tất cả danh mục</option>
                            <option>Cà phê</option>
                            <option>Trái cây</option>
                            <option>Gia vị</option>
                            <option>Phân bón & Vật tư</option>
                          </select>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh mục</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá niêm yết</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProducts.map((item) => (
                              <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                                      item.category === 'Cà phê' ? 'bg-[#4B3832]/10 text-[#4B3832]' : 
                                      item.category === 'Trái cây' ? 'bg-amber-100 text-amber-700' :
                                      item.category === 'Gia vị' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                      {item.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-forest text-sm">{item.name}</p>
                                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{item.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-sm font-medium text-slate-600">{item.category}</td>
                                <td className="px-8 py-6">
                                  <span className="font-black text-forest">{item.price}</span>
                                </td>
                                 <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                    <button 
                                      className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-forest hover:text-white transition-all border border-slate-200 hover:border-forest shadow-sm"
                                      title="Xem chi tiết"
                                    >
                                      <Search size={14} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteProduct(item.id)}
                                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
                                      title="Xóa khỏi danh mục"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Delete Confirmation Modal for Products */}
                    {productToDelete && (
                      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setProductToDelete(null)}
                          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
                        >
                          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={32} />
                          </div>
                          <h3 className="text-xl font-black text-forest mb-2">Xác nhận xóa sản phẩm</h3>
                          <p className="text-sm text-slate-500 font-medium mb-8">Xóa sản phẩm này khỏi danh mục hệ thống?</p>
                          <div className="grid grid-cols-2 gap-4">
                            <button 
                              onClick={() => setProductToDelete(null)}
                              className="py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
                            >
                              Hủy bỏ
                            </button>
                            <button 
                              onClick={confirmDeleteProduct}
                              className="py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                            >
                              Xác nhận xóa
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'post_product' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {isPostingNewProduct ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-mint/10 text-forest rounded-2xl flex items-center justify-center">
                          <ImageIcon size={28} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-forest">Đăng tin Bán hàng</h3>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Đăng tin quảng bá & chào bán sản phẩm ra thị trường</p>
                        </div>
                      </div>
                      <button onClick={() => setIsPostingNewProduct(false)} className="text-slate-400 font-bold hover:text-forest transition-colors">Hủy & Quay lại</button>
                    </div>

                    <form className="grid lg:grid-cols-2 gap-12" onSubmit={(e) => { 
                      e.preventDefault(); 
                      
                      const newId = `POST-${Date.now()}`;
                      const product = products.find(p => p.name === newSalePost.productName);
                      
                      const postToAdd = {
                        id: newId,
                        title: `${newSalePost.productName} - ${newSalePost.origin || 'Chất lượng cao'}`,
                        baseProduct: newSalePost.productName,
                        cooperativeId: currentHtxId,
                        cooperativeName: adminProfile?.htxName || 'HTX Cà phê Cầu Đất',
                        category: product?.category || 'Chưa phân loại',
                        price: `${newSalePost.price} ₫/${product?.unit || 'kg'}`,
                        date: new Date().toLocaleDateString('vi-VN'),
                        status: 'Đang hiển thị',
                        image: newSalePost.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
                        images: [...newSalePost.images],
                        origin: newSalePost.origin || 'Việt Nam',
                        unit: product?.unit || 'kg',
                        description: newSalePost.description,
                        target: newSalePost.target
                      };

                      setSalePosts([postToAdd, ...salePosts]);
                      alert('Tin đăng bán đã được phê duyệt & đăng tải!'); 
                      setIsPostingNewProduct(false); 
                      setNewSalePost({
                        productName: '',
                        price: '',
                        target: 'Tất cả khách hàng',
                        origin: '',
                        description: '',
                        images: []
                      });
                    }}>
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sản phẩm niêm yết chào bán</label>
                          <select 
                            required 
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all appearance-none cursor-pointer"
                            value={newSalePost.productName}
                            onChange={(e) => {
                              const name = e.target.value;
                              const product = products.find(p => p.name === name);
                              setNewSalePost({
                                ...newSalePost,
                                productName: name,
                                price: product ? product.price.split(' ')[0] : ''
                              });
                            }}
                          >
                            <option value="">Chọn sản phẩm từ danh mục...</option>
                            {filteredProducts.map((p) => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Giá chào bán công khai</label>
                            <input 
                              required 
                              type="text" 
                              placeholder="Thỏa thuận hoặc 450.000" 
                              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all" 
                              value={newSalePost.price}
                              onChange={(e) => setNewSalePost({...newSalePost, price: e.target.value})}
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nhắm đến đối tượng</label>
                            <select 
                              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all appearance-none text-sm cursor-pointer border border-slate-200"
                              value={newSalePost.target}
                              onChange={(e) => setNewSalePost({...newSalePost, target: e.target.value})}
                            >
                              <option>Tất cả khách hàng</option>
                              <option>Chuyên B2B (Doanh nghiệp)</option>
                              <option>Khách lẻ (Retail)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Vùng sản xuất / Giấy chứng nhận</label>
                           <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                              required 
                              type="text" 
                              placeholder="VietGAP, Organic, Chỉ dẫn địa lý..." 
                              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all" 
                              value={newSalePost.origin}
                              onChange={(e) => setNewSalePost({...newSalePost, origin: e.target.value})}
                            />
                           </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nội dung chào hàng & Cam kết chất lượng</label>
                          <textarea 
                            rows={4} 
                            placeholder="Mô tả chi tiết về lô hàng, chất lượng, quy cách đóng gói..." 
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all resize-none"
                            value={newSalePost.description}
                            onChange={(e) => setNewSalePost({...newSalePost, description: e.target.value})}
                          ></textarea>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Hình ảnh quảng bá (Bắt mắt)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {newSalePost.images.map((img, idx) => (
                              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                                <img src={img} alt="Product preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <button 
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            ))}
                            <label className="border-2 border-dashed border-slate-200 rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 hover:border-mint transition-colors cursor-pointer bg-slate-50 relative overflow-hidden group">
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                multiple
                                onChange={handleImageUpload}
                              />
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-mint group-hover:text-white transition-all">
                                <PlusCircle size={20} />
                              </div>
                              <p className="text-[10px] font-black text-forest">Thêm ảnh</p>
                            </label>
                          </div>
                        </div>

                        <button className="w-full py-5 bg-mint text-forest rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-forest hover:text-white transition-all shadow-xl shadow-mint/20 flex items-center justify-center gap-3">
                          Phát hành Tin Đăng bán <ChevronRight size={18} />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row items-sm-center justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-black text-forest tracking-tight">Quản lý Tin Đăng bán</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Danh sách các sản phẩm đang được chào bán công khai</p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setIsPostingNewProduct(true)}
                          className="px-6 py-3 bg-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 flex items-center gap-2"
                        >
                           <PlusCircle size={16} /> Đăng bán sản phẩm mới
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 w-full md:w-96">
                          <Search className="text-slate-400" size={18} />
                          <input type="text" placeholder="Tìm tin đăng..." className="bg-transparent outline-none w-full text-sm font-medium" />
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tin đăng bán</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm gốc</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá chào bán</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày đăng</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredSalePosts.map((post) => (
                              <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                  <div>
                                    <p className="font-bold text-forest text-sm">{post.title}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{post.id}</p>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-sm font-medium text-slate-600">{post.baseProduct}</td>
                                <td className="px-8 py-6">
                                  <span className="font-black text-forest">{post.price}</span>
                                </td>
                                <td className="px-8 py-6 text-sm font-medium text-slate-600">{post.date}</td>
                                <td className="px-8 py-6">
                                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-[8px] uppercase tracking-widest">
                                    {post.status}
                                  </span>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => handleEditPost(post)}
                                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm"
                                      title="Chỉnh sửa"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeletePost(post.id)}
                                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
                                      title="Xóa"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Edit Post Modal */}
                    {isEditingPost && editingPost && (
                      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setIsEditingPost(false)}
                          className="absolute inset-0 bg-forest/40 backdrop-blur-md"
                        />
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-black text-forest tracking-tight">Chỉnh sửa Tin Đăng bán</h3>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{editingPost.id}</p>
                            </div>
                            <button type="button" onClick={() => setIsEditingPost(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-colors">
                              <XCircle size={24} />
                            </button>
                          </div>
                          
                          <form onSubmit={handleUpdatePost} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tiêu đề tin đăng</label>
                                <input 
                                  type="text" 
                                  required
                                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all" 
                                  value={editingPost.title}
                                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                />
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Giá chào bán (VNĐ)</label>
                                  <input 
                                    type="text" 
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all" 
                                    value={editingPost.simplePrice}
                                    onChange={(e) => setEditingPost({...editingPost, simplePrice: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nhắm đến đối tượng</label>
                                  <select 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all appearance-none cursor-pointer border border-slate-200"
                                    value={editingPost.target || 'Tất cả khách hàng'}
                                    onChange={(e) => setEditingPost({...editingPost, target: e.target.value})}
                                  >
                                    <option>Tất cả khách hàng</option>
                                    <option>Chuyên B2B (Doanh nghiệp)</option>
                                    <option>Khách lẻ (Retail)</option>
                                  </select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Khu vực / Nguồn gốc / Chứng nhận</label>
                                <input 
                                  type="text" 
                                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all" 
                                  value={editingPost.origin || ''}
                                  onChange={(e) => setEditingPost({...editingPost, origin: e.target.value})}
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mô tả sản phẩm</label>
                                <textarea 
                                  rows={4}
                                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all resize-none" 
                                  value={editingPost.description || ''}
                                  onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                                  placeholder="Mô tả chi tiết sản phẩm..."
                                />
                              </div>

                              <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Hình ảnh quảng bá</label>
                                <div className="grid grid-cols-4 gap-4">
                                  {editingPost.images?.map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                      <img src={img} alt="" className="w-full h-full object-cover" />
                                      <button 
                                        type="button"
                                        onClick={() => removeEditImage(idx)}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <XCircle size={14} />
                                      </button>
                                    </div>
                                  ))}
                                  <label className="border-2 border-dashed border-slate-200 rounded-xl aspect-square flex flex-col items-center justify-center gap-1 hover:border-mint transition-colors cursor-pointer bg-slate-50">
                                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleEditImageUpload} />
                                    <PlusCircle size={20} className="text-slate-400" />
                                  </label>
                                </div>
                              </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-forest text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-mint transition-all shadow-xl shadow-forest/20">
                              Lưu thay đổi
                            </button>
                          </form>
                        </motion.div>
                      </div>
                    )}

                    {/* Delete Confirmation Modal for Posts */}
                    {postToDelete && (
                      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setPostToDelete(null)}
                          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
                        >
                          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={32} />
                          </div>
                          <h3 className="text-xl font-black text-forest mb-2">Xác nhận xóa</h3>
                          <p className="text-sm text-slate-500 font-medium mb-8">Bạn có chắc chắn muốn xóa tin đăng này? Hành động này không thể hoàn tác.</p>
                          <div className="grid grid-cols-2 gap-4">
                            <button 
                              onClick={() => setPostToDelete(null)}
                              className="py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
                            >
                              Hủy bỏ
                            </button>
                            <button 
                              onClick={confirmDeletePost}
                              className="py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                            >
                              Xác nhận xóa
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-800">
                {/* Header section with Stats */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-forest tracking-tight flex items-center gap-3">
                      <BarChart3 className="text-emerald-700 font-black" size={28} />
                      Báo cáo & Phân phối Vật tư
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Thống kê sản lượng sinh khối, quản lý điều phối và phê duyệt phân bổ vật tư hỗ trợ nông thôn hữu cơ.
                    </p>
                  </div>
                </div>

                {/* Aggregate Statistics Header Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Sprout size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Yêu cầu cây giống</h4>
                      <span className="text-xl font-black text-forest">{seedQty} yêu cầu</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Yêu cầu phân bón</h4>
                      <span className="text-xl font-black text-forest">{fertilizerQty} yêu cầu</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Thuốc bảo vệ thực vật</h4>
                      <span className="text-xl font-black text-forest">{pesticideQty} yêu cầu</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tư vấn kỹ thuật</h4>
                      <span className="text-xl font-black text-forest">{techQty} yêu cầu</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* LEFT COLUMN: Production & Material metrics breakdown (Span 5) */}
                  <div className="lg:col-span-5 space-y-8">
                    {/* Monthly Biomass chart Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-black text-forest">Thống kê sản lượng thu hoạch</h3>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ước tính theo tháng trong năm (Tấn sản phẩm/Tháng)</p>
                        </div>
                        <TrendingUp className="text-mint animate-bounce" size={20} />
                      </div>
                      <div className="h-48 flex items-end gap-1 px-2 mt-8">
                        {[40, 70, 45, 90, 65, 80, 55, 95, 30, 85, 60, 75].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <div className="absolute -top-7 bg-forest text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow">
                              {(h * 0.5).toFixed(1)} Tấn
                            </div>
                            <div className="w-full bg-slate-50 hover:bg-slate-100 rounded-t-lg h-full flex items-end">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.02 }}
                                className="w-full bg-emerald-600 group-hover:bg-mint rounded-t-lg transition-colors cursor-pointer"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-3 px-1 text-[9px] font-black text-slate-400 uppercase font-mono">
                        <span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span>
                        <span>T7</span><span>T8</span><span>T9</span><span>T10</span><span>T11</span><span>T12</span>
                      </div>
                    </div>

                    {/* Materials pressure / Request Priority progress indicator Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-black text-forest mb-1">Mức độ ưu tiên phân bổ</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-6">Tỷ trọng nhu cầu vật tư thiết yếu cần chuẩn bị</p>
                      
                      <div className="space-y-4">
                        {/* Seedlings */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block"></span>
                              Hạt giống & Cây giống
                            </span>
                            <span className="font-mono font-black text-slate-900">{seedQty} / {agriculturalRequests.length} ({agriculturalRequests.length ? Math.round((seedQty/agriculturalRequests.length)*100) : 0}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${agriculturalRequests.length ? (seedQty/agriculturalRequests.length)*100 : 0}%` }}></div>
                          </div>
                        </div>

                        {/* Fertilizer */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full inline-block"></span>
                              Phân hữu cơ & NPK bón rễ
                            </span>
                            <span className="font-mono font-black text-slate-900">{fertilizerQty} / {agriculturalRequests.length} ({agriculturalRequests.length ? Math.round((fertilizerQty/agriculturalRequests.length)*100) : 0}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${agriculturalRequests.length ? (fertilizerQty/agriculturalRequests.length)*100 : 0}%` }}></div>
                          </div>
                        </div>

                        {/* Pesticide */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span>
                              Thuốc bảo vệ thực vật sinh học
                            </span>
                            <span className="font-mono font-black text-slate-900">{pesticideQty} / {agriculturalRequests.length} ({agriculturalRequests.length ? Math.round((pesticideQty/agriculturalRequests.length)*100) : 0}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${agriculturalRequests.length ? (pesticideQty/agriculturalRequests.length)*100 : 0}%` }}></div>
                          </div>
                        </div>

                        {/* Tech support */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                              Tập huấn & Hỗ trợ kỹ thuật
                            </span>
                            <span className="font-mono font-black text-slate-900">{techQty} / {agriculturalRequests.length} ({agriculturalRequests.length ? Math.round((techQty/agriculturalRequests.length)*100) : 0}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${agriculturalRequests.length ? (techQty/agriculturalRequests.length)*100 : 0}%` }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-[#004d40]/5 rounded-2xl border border-[#004d40]/10 text-[11px] text-[#004d40] font-medium leading-relaxed">
                        💡 Thống kê này được phân tích tự động dựa trên tổng hợp phiếu đề đạt từ tài khoản nông dân liên kết HTX gửi về để thiết lập mức độ cấp thiết.
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Interactive Support Requests queue (Span 7) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-full">
                      
                      {/* Header and counter info */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-slate-50 pb-5">
                        <div>
                          <h3 className="text-xl font-black text-forest">Danh sách hổ trợ nông nghiệp</h3>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phân loại theo nhóm, thống kê và lên lịch bàn giao</p>
                        </div>
                        <button 
                          onClick={() => setIsAgriculturalRequestsModalOpen(true)}
                          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          Xem tất cả <ChevronRight size={12} />
                        </button>
                      </div>

                      {/* Filters and search area inside frame */}
                      <div className="space-y-4 mb-6">
                        {/* Search and status filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <input 
                              type="text"
                              value={reportSearchTerm}
                              onChange={(e) => setReportSearchTerm(e.target.value)}
                              placeholder="Tìm tên nông dân đề đạt..."
                              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-150 rounded-xl font-bold text-xs text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-sm"
                            />
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>

                          <select 
                            value={reportFilterStatus}
                            onChange={(e: any) => setReportFilterStatus(e.target.value)}
                            className="bg-slate-50 border border-slate-150 py-2 px-4 rounded-xl text-xs font-bold text-slate-600 outline-none focus:bg-white cursor-pointer shadow-sm"
                          >
                            <option value="all">Trạng thái: Tất cả ({agriculturalRequests.length})</option>
                            <option value="unallocated">Chờ điều phối ({agriculturalRequests.filter(r => r.status === 'approved' && !r.distributionDetails).length})</option>
                            <option value="allocated">Đã lên lịch ({agriculturalRequests.filter(r => r.status === 'approved' && !!r.distributionDetails).length})</option>
                            <option value="rejected">Bị từ chối ({agriculturalRequests.filter(r => r.status === 'rejected').length})</option>
                          </select>
                        </div>

                        {/* Material Category filter badges */}
                        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 rounded-xl">
                          {[
                            { id: 'all', label: `Tất cả (${agriculturalRequests.length})` },
                            { id: 'Cấp cây giống', label: `Hạt giống (${seedQty})` },
                            { id: 'Cấp phân bón', label: `Phân bón (${fertilizerQty})` },
                            { id: 'Cấp thuốc BVTV', label: `Thuốc BVTV (${pesticideQty})` },
                            { id: 'Hỗ trợ kỹ thuật', label: `Kỹ thuật (${techQty})` }
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setReportFilterGroup(tab.id as any)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${reportFilterGroup === tab.id ? 'bg-forest text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Request list */}
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {agriculturalRequests
                          .filter((req) => {
                            // Search filter
                            if (reportSearchTerm && !req.name?.toLowerCase().includes(reportSearchTerm.toLowerCase())) {
                              return false;
                            }
                            // Status filter
                            if (reportFilterStatus !== 'all') {
                              if (reportFilterStatus === 'unallocated' && (req.status !== 'approved' || req.distributionDetails)) return false;
                              if (reportFilterStatus === 'allocated' && (req.status !== 'approved' || !req.distributionDetails)) return false;
                              if (reportFilterStatus === 'rejected' && req.status !== 'rejected') return false;
                            }
                            // Group filter
                            if (reportFilterGroup !== 'all') {
                              const arr = req.requestsArr || [];
                              if (!arr.includes(reportFilterGroup) && !req.cropName?.includes(reportFilterGroup)) {
                                return false;
                              }
                            }
                            return true;
                          })
                          .map((req, index) => {
                            const isCurrentlyAllocating = distributingRequest?.id === req.id;
                            return (
                              <div 
                                key={`${req.id}-${index}`}
                                onClick={() => setSelectedMemberDetail(req)}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer ${req.status === 'approved' ? 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-300' : req.status === 'rejected' ? 'bg-red-50/20 border-red-100' : 'bg-slate-50/40 border-slate-100 hover:border-mint/30 shadow-sm hover:shadow active:scale-[0.99]'}`}
                              >
                                <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
                                  <div className="flex items-start xl:items-center gap-4 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-xs shrink-0 ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : req.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                                      {req.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col gap-1.5 flex-1 w-full min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="font-bold text-slate-800 text-[13px] whitespace-nowrap">{req.name}</h4>
                                        <span className="text-[10px] text-slate-400 font-medium font-mono whitespace-nowrap">SĐT: {req.phone}</span>
                                        <div className="flex flex-wrap gap-1 md:ml-2">
                                          {(req.requestsArr || []).map((item: string, idx: number) => {
                                            let badgeColor = 'bg-slate-100 text-slate-600';
                                            if (item.includes('cây giống')) badgeColor = 'bg-blue-50 text-blue-700 border border-blue-100';
                                            else if (item.includes('phân bón')) badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                                            else if (item.includes('BVTV')) badgeColor = 'bg-rose-50 text-rose-700 border border-rose-100';
                                            else if (item.includes('kỹ thuật')) badgeColor = 'bg-amber-50 text-amber-700 border border-amber-100';
                                            return (
                                              <span key={idx} className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${badgeColor}`}>
                                                {item}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      </div>
                                      <p className="text-[11px] text-slate-500 italic truncate w-full">
                                        &ldquo;{req.crop}&rdquo;
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-between xl:justify-end mt-3 xl:mt-0">
                                    {req.status === 'approved' && req.distributionDetails ? (
                                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider rounded border border-emerald-200 whitespace-nowrap shrink-0">
                                        ✓ Đã lên lịch
                                      </span>
                                    ) : req.status === 'rejected' ? (
                                      <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[9px] font-black uppercase tracking-wider rounded border border-red-200 whitespace-nowrap shrink-0">
                                        ✘ Từ chối
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider rounded border border-amber-200 animate-pulse whitespace-nowrap shrink-0">
                                        ● Chờ sắp xếp
                                      </span>
                                    )}

                                    {req.status === 'approved' && !req.distributionDetails && !isCurrentlyAllocating && (
                                      <div className="flex items-center gap-1.5">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setMemberToReject(req.id);
                                          }}
                                          className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded text-[10px] transition-colors cursor-pointer shrink-0"
                                          title="Từ chối"
                                        >
                                          <XCircle size={14} />
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDistributingRequest(req);
                                          }}
                                          className="px-2.5 h-7 bg-[#004d40] text-white hover:bg-mint rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                                        >
                                          <Calendar size={12} /> Lên lịch & Bàn giao
                                        </button>
                                      </div>
                                    )}

                                    {req.status === 'approved' && req.distributionDetails && !isCurrentlyAllocating && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDistributingRequest(req);
                                          // Auto load previous values
                                          setDistributionForm({
                                            deliveryDate: req.distributionDetails?.deliveryDate || new Date().toISOString().split('T')[0],
                                            warehouse: req.distributionDetails?.warehouse || 'Kho HTX Trung Tâm',
                                            actualQty: req.distributionDetails?.actualQty || '100',
                                            unit: req.distributionDetails?.unit || 'kg',
                                            coordinator: req.distributionDetails?.coordinator || 'Nguyễn Văn Cảnh',
                                            notes: req.distributionDetails?.notes || 'Cử cán bộ kỹ thuật và cấp vật tư chuẩn đạt chứng chỉ hữu cơ.'
                                          });
                                        }}
                                        className="w-7 h-7 flex items-center justify-center text-forest hover:bg-emerald-50 rounded cursor-pointer transition-colors"
                                        title="Sửa chi tiết phân bổ"
                                      >
                                        <Edit2 size={13} />
                                      </button>
                                    )}
                                  </div>
                                </div>


                                {/* Inline request details and approval form */}
                                {isCurrentlyAllocating && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 border-t border-slate-200/85 space-y-4"
                                  >
                                    <h5 className="text-xs font-black text-[#004d40] uppercase tracking-wide flex items-center gap-1">
                                      🔍 THÔNG TIN CHI TIẾT YÊU CẦU
                                    </h5>
                                    
                                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
                                      <div className="flex flex-col gap-3">
                                        <div>
                                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Nội dung chi tiết từ nông dân</label>
                                          <div className="text-[12px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                            {req.crop}
                                          </div>
                                        </div>

                                        {req.image && (
                                          <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Hình ảnh đính kèm</label>
                                            <div className="mt-1">
                                              <img 
                                                src={req.image} 
                                                alt="Yêu cầu từ nông dân" 
                                                className="max-h-48 rounded-lg border border-slate-200 shadow-sm"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Phản hồi / Ghi chú phê duyệt từ HTX</label>
                                      <textarea 
                                        rows={2}
                                        value={distributionForm.notes}
                                        onChange={(e) => setDistributionForm({ ...distributionForm, notes: e.target.value })}
                                        placeholder="Nhập hướng dẫn hoặc phản hồi cho nông dân..."
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-emerald-500 text-slate-700 shadow-sm resize-none"
                                      />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-1.5">
                                      <button 
                                        type="button"
                                        onClick={() => setDistributingRequest(null)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                      >
                                        Đóng chi tiết
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setMemberToReject(req.id);
                                        }}
                                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                      >
                                        Bác bỏ
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleConfirmDistribution(req.id);
                                        }}
                                        className="px-6 py-2 bg-[#004d40] text-white hover:bg-mint rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md hover:shadow-emerald-900/20"
                                      >
                                        Phê duyệt yêu cầu
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            );
                          })}

                        {agriculturalRequests
                          .filter((req) => {
                            // Apply filters to check empty state
                            if (reportSearchTerm && !req.name?.toLowerCase().includes(reportSearchTerm.toLowerCase())) return false;
                            if (reportFilterStatus !== 'all' && req.status !== reportFilterStatus) return false;
                            if (reportFilterGroup !== 'all') {
                              const arr = req.requestsArr || [];
                              if (!arr.includes(reportFilterGroup) && !req.cropName?.includes(reportFilterGroup)) return false;
                            }
                            return true;
                          }).length === 0 && (
                          <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <Sprout size={40} className="text-slate-300 mb-3 animate-pulse" />
                            <h4 className="text-sm font-bold text-slate-700 mb-0.5">Không tìm thấy đơn yêu cầu nào</h4>
                            <p className="text-[11px] text-slate-400 font-medium">Bản ghi trống hoặc không trùng khớp với bộ lọc dữ liệu.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'qc' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row items-sm-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-forest tracking-tight">Thu mua, QC & Kho</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Điều phối thu hoạch, kiểm định chất lượng và quản lý tồn kho</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsHarvestModalOpen(true)}
                      className="px-6 py-3 bg-white text-forest border-2 border-forest/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-forest/5 flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Calendar size={16} /> Lên lịch thu hoạch
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cần thu hoạch tuần này</h4>
                      <span className="text-2xl font-black text-slate-800">12 Vườn</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lô hàng chờ lô QC</h4>
                      <span className="text-2xl font-black text-slate-800">5 Lô</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng tồn kho (Tấn)</h4>
                      <span className="text-2xl font-black text-slate-800">145.5</span>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Lô hàng chờ QC & Nhập kho */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-forest">Lịch thu hoạch sắp tới</h3>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setIsFarmerListOverlayOpen(!isFarmerListOverlayOpen)}
                          className={`font-black text-[10px] uppercase tracking-widest transition-colors ${isFarmerListOverlayOpen ? 'text-forest' : 'text-mint hover:text-forest'}`}
                        >
                          Danh sách Nông dân
                        </button>
                        <button 
                          onClick={() => setIsViewAllHarvestOpen(true)}
                          className="text-mint font-black text-[10px] uppercase tracking-widest hover:text-forest transition-colors"
                        >
                          Xem lịch biểu
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {filteredHarvests
                        .sort((a, b) => {
                          const timeA = a.timestamp || '';
                          const timeB = b.timestamp || '';
                          if (timeA && timeB) return timeB.localeCompare(timeA);
                          return b.id.localeCompare(a.id);
                        })
                        .slice(0, 3)
                        .map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-mint/50 transition-all cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-slate-800">{item.product} - {item.farmer}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.id} • {item.qty} • {formatDateSafe(item.date)} • {item.area}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            {item.confirmed ? (
                                <span className="px-3 py-1 rounded-[10px] text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                                Đã xác nhận
                                </span>
                            ) : item.isRefused ? (
                                <span className="px-3 py-1 rounded-[10px] text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 cursor-pointer" onClick={() => item.refusalReason && alert('Lý do: ' + item.refusalReason)}>
                                Không xác nhận
                                </span>
                            ) : (
                                <span className="px-3 py-1 rounded-[10px] text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                                Chờ nông dân
                                </span>
                            )}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleEditHarvestSchedule(item); }}
                                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                title="Chỉnh sửa"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteHarvestSchedule(item.id); }}
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                title="Xóa"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-slate-100">
                       <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-forest">Đang chờ QC & Nhập kho</h3>
                        <button 
                          onClick={() => setIsViewAllDeliveriesOpen(true)}
                          className="text-mint font-black text-[10px] uppercase tracking-widest hover:text-forest transition-colors"
                        >
                          Xem tất cả
                        </button>
                      </div>
                      <div className="space-y-3">
                        {pendingDeliveries
                          .filter(d => !adminProfile?.cooperativeId || d.cooperativeId === adminProfile.cooperativeId)
                          .sort((a, b) => {
                            const timeA = a.timestamp || '';
                            const timeB = b.timestamp || '';
                            if (timeA && timeB) return timeB.localeCompare(timeA);
                            // Fallback to numeric part of ID if possible
                            const getNum = (id: string) => parseInt(id.replace(/\D/g, '')) || 0;
                            const numA = getNum(a.id);
                            const numB = getNum(b.id);
                            if (numA !== numB) return numB - numA;
                            return b.id.localeCompare(a.id);
                          })
                          .slice(0, 3)
                          .map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-bold text-slate-800">{item.product} - {item.farmer}</span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.id} • {item.actualQty} • {item.actualDate}</span>
                            </div>
                             <div className="flex items-center gap-2">
                               <span className={`px-2 py-0.5 rounded-[6px] text-[8px] font-black uppercase tracking-widest ${
                                  item.status === 'Chờ QC' ? 'bg-amber-100 text-amber-700' : 
                                  item.status === 'Đang QC' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {item.status}
                                </span>
                                <button 
                                  onClick={() => setSelectedDelivery(item)}
                                  className="w-7 h-7 bg-white text-forest border border-slate-100 rounded-lg flex items-center justify-center hover:bg-forest hover:text-white transition-all shadow-sm"
                                >
                                  <ChevronRight size={14} />
                                </button>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tồn kho thành phẩm */}
                  <div className="bg-forest rounded-[2.5rem] p-8 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mt-32 -mr-32" />
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <h3 className="text-xl font-black">Kho thành phẩm</h3>
                      <Package size={24} className="text-mint" />
                    </div>
                    <div className="space-y-4 relative z-10">
                      {[
                        { crop: 'Cà phê Arabica (Loại 1)', qty: '45.0', unit: 'Tấn' },
                        { crop: 'Sầu riêng Ri6 (Loại A)', qty: '12.0', unit: 'Tấn' },
                        { crop: 'Tiêu đen xô', qty: '88.5', unit: 'Tấn' },
                        { crop: 'Chanh dây (XK)', qty: '8.2', unit: 'Tấn' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                          <span className="font-bold text-sm tracking-wide">{item.crop}</span>
                          <div className="flex items-end gap-1">
                            <span className="text-xl font-black text-mint">{item.qty}</span>
                            <span className="text-[10px] font-black text-white/60 mb-1 uppercase tracking-widest">{item.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 relative z-10 space-y-3">
                       <button className="w-full py-4 bg-mint text-forest rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
                        Quản lý chi tiết Kho
                      </button>
                      <button className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-colors">
                        Lịch sử Xuất/Nhập
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row items-sm-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-forest tracking-tight">Quản lý Hợp đồng</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Ký kết và theo dõi hợp đồng điện tử với nông dân, đối tác</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 flex items-center gap-2">
                      <FileSignature size={16} /> Tạo hợp đồng mới
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đang hiệu lực</h4>
                      <span className="text-2xl font-black text-slate-800">
                        {140 + filteredContracts.filter((c: any) => c.status === 'Đang thực hiện' || c.status === 'Đã ký').length}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chờ phê duyệt</h4>
                      <span className="text-2xl font-black text-slate-800">
                        {filteredContracts.filter((c: any) => c.status === 'Chờ duyệt' || c.status === 'pending_super_admin').length}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Handshake size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Với đối tác & DN</h4>
                      <span className="text-2xl font-black text-slate-800">
                        {12 + filteredContracts.filter((c: any) => c.type === 'b2b').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Unified Single-Screen Layout under Contracts */}
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Phê duyệt Hợp đồng section (Top Priority) */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-rose-600 flex items-center gap-2">
                          <CheckCircle2 size={20} className="text-rose-500 animate-pulse animate-duration-1000" />
                          Phê duyệt hợp đồng
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">Mọi lệnh phê duyệt sẽ được hiển thị trên đây</p>
                      </div>
                      {filteredContracts.filter((c: any) => c.status === 'Chờ duyệt' || c.status === 'pending_super_admin').length > 0 && (
                        <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1.5 rounded-full font-black animate-pulse font-sans">
                          {filteredContracts.filter((c: any) => c.status === 'Chờ duyệt' || c.status === 'pending_super_admin').length} Hồ sơ mới
                        </span>
                      )}
                    </div>

                    {filteredContracts.filter((c: any) => c.status === 'Chờ duyệt' || c.status === 'pending_super_admin').length === 0 ? (
                      <div className="flex items-center gap-4 bg-emerald-50/50 border border-emerald-100/40 p-5 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Mọi hồ sơ và dữ liệu giao dịch đã được ký duyệt</h4>
                          <p className="text-xs text-slate-400 font-medium font-sans">Hiện không có yêu cầu phê duyệt hoặc thương thảo mới nào được gửi từ doanh nghiệp liên kết.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContracts.filter((c: any) => c.status === 'Chờ duyệt' || c.status === 'pending_super_admin').map((item: any, i: number) => (
                          <div 
                            key={i}
                            className="group bg-slate-50 border border-slate-200/50 rounded-3xl p-6 hover:border-emerald-500/20 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between gap-6"
                          >
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono font-black text-[#004d40] tracking-wider uppercase bg-emerald-50 border border-emerald-100/40 px-3 py-1 rounded-full">
                                  Mã số: {item.id}
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-wider">
                                  <Clock size={12} className="animate-spin duration-1000" /> Chờ phê duyệt
                                </span>
                              </div>

                              <div className="space-y-1">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-[#004d40] transition-colors">
                                  {item.party}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium font-sans">
                                  Nông sản giao dịch: <strong className="text-slate-800">{item.qty || item.date}</strong>
                                </p>
                                <p className="text-xs text-slate-500 font-medium font-sans">
                                  Giá trị ước tính: <strong className="text-forest text-sm font-black">{item.val || item.amount}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/40">
                              <button
                                type="button"
                                onClick={() => handleViewB2BContract(item)}
                                className="py-3 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer font-sans text-center"
                              >
                                Xem & Kiểm định
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApproveB2BContract(item.id)}
                                className="py-3 bg-[#004d40] hover:bg-emerald-950 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-950/10 cursor-pointer font-sans flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 size={12} /> Ký số nhanh
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Existing Contract Categories lists */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Hợp đồng Thu mua (Xã viên) */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mt-32 -mr-32 pointer-events-none" />
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-mint/10 rounded-xl flex items-center justify-center text-mint">
                            <Users size={20} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-forest">Hợp đồng Xã viên</h3>
                            <p className="text-xs text-slate-500 font-medium">Thỏa thuận bao tiêu/thu mua nông sản nông dân</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsViewAllIndividualContractsModalOpen(true)}
                          className="text-mint font-black text-[10px] uppercase tracking-widest hover:text-forest transition-colors">
                          Xem tất cả
                        </button>
                      </div>
                      <div className="space-y-4 relative z-10">
                        {filteredContracts.filter((c: any) => c.contractNo?.includes('HĐHTSXNN')).length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                              <FileSignature className="text-slate-300" size={24} />
                            </div>
                            <p className="text-sm font-bold text-slate-400">Chưa có hợp đồng nào</p>
                          </div>
                        ) : (
                          filteredContracts.filter((c: any) => c.contractNo?.includes('HĐHTSXNN')).map((item, i) => (
                            <div 
                              key={i} 
                              onClick={() => navigate(`/contract-customer/${item.id}`)}
                              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl group hover:border-mint/50 transition-all cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-sm font-bold text-slate-800 truncate">{item.party}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                  {item.amount && !['0.0 Triệu', '0.1 Triệu', '0 Triệu'].includes(item.amount) ? `${item.amount} • ` : ''}
                                  {item.cropName || 'Nông sản'}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 ml-4">
                                <span className={`px-2 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-widest ${
                                  item.status === 'Nông dân đã ký' || item.status === 'Đã ký' || item.status === 'Đã hoàn tất' || item.status === 'Hoàn tất' ? 'bg-emerald-50 text-emerald-600' : 
                                  (item.status === 'Chờ nông dân ký' || item.status === 'awaiting_farmer_signature') ? 'bg-amber-50 text-amber-600 animate-pulse' : 
                                  (item.status === 'signed' || item.status.includes('đã ký')) ? 'bg-indigo-50 text-indigo-600 font-bold' :
                                  (item.status === 'Chờ ký duyệt' || item.status === 'Chờ duyệt') ? 'bg-amber-50 text-amber-600' : 
                                  'bg-slate-100 text-slate-500'
                                }`}>
                                  {item.status === 'awaiting_farmer_signature' || item.status === 'Chờ ký duyệt' ? 'Chờ nông dân ký' : 
                                   item.status === 'signed' || item.status === 'Đã ký' ? 'Nông dân đã ký' : 
                                   item.status}
                                </span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-mint transition-colors" />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Hợp đồng Đối tác (Khách hàng B2B) */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mt-32 -mr-32 pointer-events-none" />
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-forest">Hợp đồng Đối tác B2B</h3>
                            <p className="text-xs text-slate-500 font-medium">Khách hàng DN / Siêu thị quy mô</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsViewAllB2BContractsModalOpen(true)}
                          className="text-mint font-black text-[10px] uppercase tracking-widest hover:text-forest transition-colors">
                          Xem tất cả
                        </button>
                      </div>
                      <div className="space-y-4 relative z-10">
                        {filteredContracts.filter((c: any) => c.contractNo?.includes('HĐMB') && c.status !== 'Chờ duyệt' && c.status !== 'pending_super_admin' && c.status !== 'pending').length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                              <FileSignature className="text-slate-300" size={24} />
                            </div>
                            <p className="text-sm font-bold text-slate-400">Chưa có hợp đồng nào</p>
                          </div>
                        ) : (
                          filteredContracts.filter((c: any) => c.contractNo?.includes('HĐMB') && c.status !== 'Chờ duyệt' && c.status !== 'pending_super_admin' && c.status !== 'pending').map((item: any, i: number) => (
                            <div 
                              key={i} 
                              onClick={() => handleViewB2BContract(item)}
                              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl group hover:border-mint/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                            >
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-slate-800">{item.party}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.val || item.amount} • {item.qty || item.date}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-widest ${
                                  item.status === 'Đang thực hiện' || item.status === 'signed' ? 'bg-blue-50 text-blue-600' :
                                  item.status === 'Chờ duyệt' || item.status === 'pending_super_admin' || item.status === 'Chờ DN ký' || item.status === 'Chờ ký duyệt' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {item.status === 'signed' ? 'Đang thực hiện' : (item.status === 'pending_super_admin' ? 'Chờ duyệt' : item.status)}
                                </span>
                                <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-white group-hover:border-forest transition-all">
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finances' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row items-sm-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-forest tracking-tight">Tài chính & Đối soát</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Quản lý dòng tiền, công nợ nông dân và đối soát hợp đồng</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white text-forest border-2 border-forest/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-forest/5 flex items-center gap-2 transition-all">
                      <Receipt size={16} /> Tạo phiếu Thu/Chi
                    </button>
                    <button className="px-6 py-3 bg-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 flex items-center gap-2">
                       <Landmark size={16} /> Báo cáo tài chính
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-mint/20 text-forest rounded-xl flex items-center justify-center shrink-0">
                        <Wallet size={20} />
                      </div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Số dư khả dụng</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-slate-800">1.250M</span>
                      <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1"><TrendingUp size={12}/> +12% so với tháng trước</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <ArrowDownRight size={20} />
                      </div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Doanh thu (Tháng)</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-slate-800">850M</span>
                       <p className="text-[10px] text-slate-400 font-bold mt-1">Tiền vào từ KH, Đối tác</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                        <ArrowUpRight size={20} />
                      </div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Chi phí (Tháng)</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-slate-800">420M</span>
                       <p className="text-[10px] text-slate-400 font-bold mt-1">Thu mua, Lương, Vận hành</p>
                    </div>
                  </div>

                  <div className="bg-forest p-6 rounded-[2rem] shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mt-16 -mr-16 pointer-events-none" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="w-10 h-10 bg-white/10 text-mint rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                        <CreditCard size={20} />
                      </div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-white/60">Công nợ phải thu</span>
                    </div>
                    <div className="relative z-10">
                      <span className="text-2xl font-black text-white">350M</span>
                      <p className="text-[10px] text-mint font-bold mt-1">Từ 12 Đại lý & Đối tác B2B</p>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Yêu cầu thanh toán / Lịch sử thu chi */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-forest">Giao dịch gần đây</h3>
                        <p className="text-xs text-slate-500 font-medium">Lịch sử thu / chi của HTX</p>
                      </div>
                      <button className="text-mint font-black text-[10px] uppercase tracking-widest hover:text-forest transition-colors">
                        Xem tất cả
                      </button>
                    </div>
                    <div className="space-y-4">
                      {filteredTransactions.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer group">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-slate-800">{item.title}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.entity} • {item.date}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-sm font-black tracking-wide ${item.type === 'thu' ? 'text-emerald-500' : 'text-slate-700'}`}>
                              {item.amount} ₫
                            </span>
                             <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                item.status === 'Hoàn tất' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {item.status}
                              </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quản lý công nợ */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-forest">Theo dõi Công Nợ</h3>
                        <p className="text-xs text-slate-500 font-medium">Báo cáo phải thu & phải trả</p>
                      </div>
                       <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-forest border border-slate-200 hover:bg-forest hover:text-white hover:border-forest transition-all">
                        <Search size={14} />
                      </button>
                    </div>
                    <div className="space-y-4">
                       {[
                        { name: 'VinMart+ Quận 7', type: 'Phải thu', amount: '220.000.000', dueDate: 'Đến hạn: 15/04/2024', status: 'Chưa thanh toán', progress: 0 },
                        { name: 'Công ty Phân bón Hiệp Phát', type: 'Phải trả', amount: '85.000.000', dueDate: 'Đến hạn: 10/04/2024', status: 'Đã thanh toán 50%', progress: 50 },
                        { name: 'Nguyễn Văn Nam (Xã viên)', type: 'Phải thu (Tạm ứng)', amount: '15.000.000', dueDate: 'Trừ vào cuối vụ', status: 'Chưa thanh toán', progress: 0 },
                        { name: 'Bách Hóa Xanh (Tổng)', type: 'Phải thu', amount: '450.000.000', dueDate: 'Đến hạn: 20/04/2024', status: 'Đã thanh toán 80%', progress: 80 }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-2xl group hover:border-mint/50 transition-all cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-bold text-slate-800">{item.name}</span>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${item.type.includes('Phải thu') ? 'text-blue-500' : 'text-rose-500'}`}>
                                {item.type}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-black text-forest">{item.amount} ₫</span>
                              <span className="text-[10px] font-black text-slate-400 capitalize tracking-wide">{item.dueDate}</span>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${item.progress === 0 ? 'bg-transparent' : item.progress === 100 ? 'bg-emerald-500' : 'bg-mint'}`} 
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">{item.status}</span>
                            {item.progress > 0 && <span className="text-forest">{item.progress}%</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Approved Member Success Modal with Temporary Password */}
      {approvedMemberInfo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setApprovedMemberInfo(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl border border-slate-100"
          >
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-forest">Phê duyệt thành công!</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Cấp tài khoản & Mật khẩu tạm</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl my-6 space-y-4">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Xã viên phê duyệt</span>
                <span className="font-extrabold text-[#059669] text-base">{approvedMemberInfo.name}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Số điện thoại (ID Đăng nhập)</span>
                  <span className="font-extrabold text-slate-800 text-sm font-mono">{approvedMemberInfo.phone}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mật khẩu tạm thời</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-amber-600 text-sm font-mono bg-amber-50 px-2 py-1 rounded">{approvedMemberInfo.password}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>Duyệt bởi Admin: <strong>{approvedMemberInfo.adminName}</strong></span>
                <span>Hợp tác xã: <strong>{adminProfile?.htxName}</strong></span>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 text-xs p-4 rounded-xl leading-relaxed mb-6 font-medium">
              💡 <strong>Lưu ý:</strong> Hãy gửi Số điện thoại và Mật khẩu tạm thời này cho nông dân. Nông dân có thể truy cập hệ thống ngay lập tức và tiến hành cập nhật mật khẩu mới khi đăng nhập lần đầu tiên.
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`Tài khoản VietAgri của bạn đã được phê duyệt!\nSĐT đăng nhập: ${approvedMemberInfo.phone}\nMật khẩu tạm thời: ${approvedMemberInfo.password}`);
                  setToastMessage('Đã sao chép thông tin tài khoản!');
                }}
                className="flex-1 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#059669] font-bold text-sm rounded-xl border border-emerald-100 transition-all cursor-pointer"
              >
                Sao chép thông tin
              </button>
              <button 
                onClick={() => setApprovedMemberInfo(null)}
                className="px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
              >
                Hoàn tất
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View All Individual Contracts Modal */}
      {isViewAllIndividualContractsModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsViewAllIndividualContractsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300"
          >
            <div className="border-b border-slate-100 pb-5 mb-6 shrink-0">
              <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-forest">Hợp đồng Xã viên</h3>
                  <button 
                    onClick={() => setIsViewAllIndividualContractsModalOpen(false)}
                    className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <XCircle size={20} />
                  </button>
              </div>
              <div className="text-sm font-bold text-slate-500">
                  Số lượng hợp đồng: {filteredContracts.filter((c: any) => c.contractNo?.includes('HĐHTSXNN') && (c.party.toLowerCase().includes(individualContractsSearch.toLowerCase()) || c.cropName.toLowerCase().includes(individualContractsSearch.toLowerCase()))).length}
              </div>
            </div>
            <div className="overflow-y-auto space-y-4">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm theo tên hoặc nông sản..." 
                    value={individualContractsSearch}
                    onChange={(e) => setIndividualContractsSearch(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                />
              {filteredContracts.filter((c: any) => c.contractNo?.includes('HĐHTSXNN') && (c.party.toLowerCase().includes(individualContractsSearch.toLowerCase()) || c.cropName.toLowerCase().includes(individualContractsSearch.toLowerCase()))).map((item: any, i: number) => (
                <div 
                  key={i} 
                  onClick={() => {
                    navigate(`/contract-customer/${item.id}`);
                    setIsViewAllIndividualContractsModalOpen(false);
                  }}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-mint transition-all"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{item.party}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.cropName}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-widest ${
                    item.status === 'Nông dân đã ký' || item.status === 'Đã ký' || item.status === 'Đã hoàn tất' || item.status === 'Hoàn tất' ? 'bg-emerald-50 text-emerald-600' : 
                    (item.status === 'Chờ nông dân ký' || item.status === 'awaiting_farmer_signature') ? 'bg-amber-50 text-amber-600 animate-pulse' : 
                    (item.status === 'signed' || item.status?.includes('đã ký')) ? 'bg-indigo-50 text-indigo-600 font-bold' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {item.status === 'awaiting_farmer_signature' || item.status === 'Chờ nông dân ký' || item.status === 'Chờ ký duyệt' ? 'Chờ nông dân ký' : 
                     item.status === 'signed' || item.status === 'Đã ký' ? 'Nông dân đã ký' : 
                     item.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* View All B2B Contracts Modal */}
      {isViewAllB2BContractsModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsViewAllB2BContractsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300"
          >
            <div className="border-b border-slate-100 pb-5 mb-6 shrink-0">
              <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-forest">Hợp đồng Đối tác B2B</h3>
                  <button 
                    onClick={() => setIsViewAllB2BContractsModalOpen(false)}
                    className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <XCircle size={20} />
                  </button>
              </div>
              <div className="text-sm font-bold text-slate-500">
                  Số lượng hợp đồng: {filteredContracts.filter((c: any) => c.contractNo?.includes('HĐMB') && c.status !== 'Chờ duyệt' && c.status !== 'pending_super_admin' && c.status !== 'pending' && (c.party.toLowerCase().includes(b2bContractsSearch.toLowerCase()) || c.qty.toString().toLowerCase().includes(b2bContractsSearch.toLowerCase()))).length}
              </div>
            </div>
            <div className="overflow-y-auto space-y-4">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm theo tên hoặc số lượng..." 
                    value={b2bContractsSearch}
                    onChange={(e) => setB2BContractsSearch(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                />
               {filteredContracts.filter((c: any) => c.contractNo?.includes('HĐMB') && c.status !== 'Chờ duyệt' && c.status !== 'pending_super_admin' && c.status !== 'pending' && (c.party.toLowerCase().includes(b2bContractsSearch.toLowerCase()) || c.qty.toString().toLowerCase().includes(b2bContractsSearch.toLowerCase()))).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
                   <span>{item.party} - {item.qty}</span>
                   <span className={`px-2 py-1 rounded-[8px] text-[9px] font-black uppercase ${
                     item.status === 'Đang thực hiện' || item.status === 'signed' ? 'bg-blue-50 text-blue-600' :
                     item.status === 'Chờ duyệt' || item.status === 'pending_super_admin' || item.status === 'Chờ DN ký' || item.status === 'Chờ ký duyệt' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                   }`}>{item.status === 'signed' ? 'Đang thực hiện' : (item.status === 'pending_super_admin' ? 'Chờ duyệt' : item.status)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
      {/* View All Agricultural Requests Modal */}
      {isAgriculturalRequestsModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAgriculturalRequestsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-forest flex items-center gap-2">
                  <Package className="text-emerald-700" size={24} />
                  Đơn đề nghị hỗ trợ nông nghiệp
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Phân loại theo nhóm, thống kê và lên lịch bàn giao</p>
              </div>
              <button 
                onClick={() => setIsAgriculturalRequestsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

              {/* Filters and search area inside frame */}
              <div className="space-y-4 mb-6 sticky top-0 bg-white z-10 pb-4 border-b border-slate-50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={reportSearchTerm}
                      onChange={(e) => setReportSearchTerm(e.target.value)}
                      placeholder="Tìm tên nông dân đề đạt..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-sm"
                    />
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>

                  <select 
                    value={reportFilterStatus}
                    onChange={(e: any) => setReportFilterStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-150 py-3 px-4 rounded-xl text-sm font-bold text-slate-600 outline-none focus:bg-white cursor-pointer shadow-sm min-w-[200px]"
                  >
                    <option value="all">Trạng thái: Tất cả ({agriculturalRequests.length})</option>
                    <option value="pending">Chờ ({agriculturalRequests.filter((r: any) => r.status === 'pending').length})</option>
                    <option value="approved">Đã duyệt ({agriculturalRequests.filter((r: any) => r.status === 'approved').length})</option>
                    <option value="rejected">Từ chối ({agriculturalRequests.filter((r: any) => r.status === 'rejected').length})</option>
                  </select>
                </div>

                {/* Material Category filter badges */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 rounded-2xl w-fit">
                  {[
                    { id: 'all', label: `Tất cả (${agriculturalRequests.length})` },
                    { id: 'Cấp cây giống', label: `Hạt giống (${seedQty})` },
                    { id: 'Cấp phân bón', label: `Phân bón (${fertilizerQty})` },
                    { id: 'Cấp thuốc BVTV', label: `Thuốc BVTV (${pesticideQty})` },
                    { id: 'Hỗ trợ kỹ thuật', label: `Kỹ thuật (${techQty})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setReportFilterGroup(tab.id as any)}
                      className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${reportFilterGroup === tab.id ? 'bg-forest text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Request list */}
              <div className="space-y-4">
                {agriculturalRequests
                  .filter((req: any) => {
                    if (reportSearchTerm && !req.name?.toLowerCase().includes(reportSearchTerm.toLowerCase())) return false;
                    if (reportFilterStatus !== 'all' && req.status !== reportFilterStatus) return false;
                    if (reportFilterGroup !== 'all') {
                      const arr = req.requestsArr || [];
                      if (!arr.includes(reportFilterGroup) && !req.cropName?.includes(reportFilterGroup)) return false;
                    }
                    return true;
                  })
                  .map((req: any, index: number) => {
                    const isCurrentlyAllocating = distributingRequest?.id === req.id;
                    return (
                      <div 
                        key={`${req.id}-${index}-modal`}
                        onClick={() => {
                          setSelectedMemberDetail(req);
                          setIsAgriculturalRequestsModalOpen(false);
                        }}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer ${req.status === 'approved' ? 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-300' : req.status === 'rejected' ? 'bg-red-50/20 border-red-100' : 'bg-slate-50/40 border-slate-100 hover:border-mint/30 shadow-sm hover:shadow active:scale-[0.99]'}`}
                      >
                        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
                          <div className="flex items-start xl:items-center gap-4 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-mono text-xs shrink-0 ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : req.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                              {req.name.charAt(0)}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1 w-full min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-slate-800 text-[13px] whitespace-nowrap">{req.name}</h4>
                                <span className="text-[10px] text-slate-400 font-medium font-mono whitespace-nowrap">SĐT: {req.phone}</span>
                                <div className="flex flex-wrap gap-1 md:ml-2">
                                  {(req.requestsArr || []).map((item: string, idx: number) => {
                                    let badgeColor = 'bg-slate-100 text-slate-600';
                                    if (item.includes('cây giống')) badgeColor = 'bg-blue-50 text-blue-700 border border-blue-100';
                                    else if (item.includes('phân bón')) badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                                    else if (item.includes('BVTV')) badgeColor = 'bg-rose-50 text-rose-700 border border-rose-100';
                                    else if (item.includes('kỹ thuật')) badgeColor = 'bg-amber-50 text-amber-700 border border-amber-100';
                                    return (
                                      <span key={idx} className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${badgeColor}`}>
                                        {item}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-500 italic truncate w-full">
                                &ldquo;{req.crop}&rdquo;
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full xl:w-auto shrink-0 justify-between xl:justify-end mt-3 xl:mt-0">
                            {req.status === 'approved' ? (
                              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider rounded border border-emerald-200 whitespace-nowrap shrink-0">
                                ✓ Đã lên lịch
                              </span>
                            ) : req.status === 'rejected' ? (
                              <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[9px] font-black uppercase tracking-wider rounded border border-red-200 whitespace-nowrap shrink-0">
                                ✘ Từ chối
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[9px] font-black uppercase tracking-wider rounded border border-amber-200 animate-pulse whitespace-nowrap shrink-0">
                                ● Chờ sắp xếp
                              </span>
                            )}

                            {req.status === 'pending' && !isCurrentlyAllocating && (
                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMemberToReject(req.id);
                                  }}
                                  className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded text-[10px] transition-colors cursor-pointer shrink-0"
                                  title="Từ chối"
                                >
                                  <XCircle size={14} />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDistributingRequest(req);
                                  }}
                                  className="px-2.5 h-7 bg-[#004d40] text-white hover:bg-mint rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                                >
                                  <Calendar size={12} /> Xem chi tiết & Phê duyệt
                                </button>
                              </div>
                            )}

                            {req.status === 'approved' && !isCurrentlyAllocating && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDistributingRequest(req);
                                  setDistributionForm({
                                    deliveryDate: req.distributionDetails?.deliveryDate || new Date().toISOString().split('T')[0],
                                    warehouse: req.distributionDetails?.warehouse || 'Kho HTX Trung Tâm',
                                    actualQty: req.distributionDetails?.actualQty || '100',
                                    unit: req.distributionDetails?.unit || 'kg',
                                    coordinator: req.distributionDetails?.coordinator || 'Nguyễn Văn Cảnh',
                                    notes: req.distributionDetails?.notes || 'Cử cán bộ kỹ thuật và cấp vật tư chuẩn đạt chứng chỉ hữu cơ.'
                                  });
                                }}
                                className="w-7 h-7 flex items-center justify-center text-forest hover:bg-emerald-50 rounded cursor-pointer transition-colors"
                                title="Sửa chi tiết phân bổ"
                              >
                                <Edit2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        {req.status === 'approved' && req.distributionDetails && !isCurrentlyAllocating && (
                          <div className="mt-3 py-2 px-3 bg-emerald-50/50 rounded-lg border border-emerald-100/50 flex flex-wrap lg:flex-nowrap items-center gap-x-4 gap-y-1.5 text-[10px] text-[#004d40]">
                            <div className="flex items-center gap-1 font-bold whitespace-nowrap shrink-0">
                              <Calendar size={12} /> Dự kiến cấp: <span className="font-sans font-bold ml-0.5">{formatDateSafe(req.distributionDetails.deliveryDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-40 shrink-0 hidden lg:block">|</div>
                            <div className="whitespace-nowrap shrink-0">Kho: <span className="font-bold">{req.distributionDetails.warehouse}</span></div>
                            <div className="flex items-center gap-1.5 opacity-40 shrink-0 hidden lg:block">|</div>
                            <div className="whitespace-nowrap shrink-0">SL: <span className="font-bold">{req.distributionDetails.actualQty} {req.distributionDetails.unit || 'kg'}</span></div>
                            <div className="flex items-center gap-1.5 opacity-40 shrink-0 hidden lg:block">|</div>
                            <div className="truncate flex-1 min-w-0">PT: <span className="font-bold">{req.distributionDetails.coordinator}</span></div>
                          </div>
                        )}

                        {isCurrentlyAllocating && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-slate-200/85 space-y-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h5 className="text-xs font-black text-[#004d40] uppercase tracking-wide flex items-center gap-1">
                              🔍 THÔNG TIN CHI TIẾT YÊU CẦU
                            </h5>
                            
                            <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
                              <div className="flex flex-col gap-3">
                                <div>
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Nội dung chi tiết từ nông dân</label>
                                  <div className="text-[12px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                    {req.crop}
                                  </div>
                                </div>

                                {req.image && (
                                  <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Hình ảnh đính kèm</label>
                                    <div className="mt-1">
                                      <img 
                                        src={req.image} 
                                        alt="Yêu cầu từ nông dân" 
                                        className="max-h-48 rounded-lg border border-slate-200 shadow-sm"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1 text-xs">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Phản hồi / Ghi chú phê duyệt từ HTX</label>
                              <textarea 
                                rows={2}
                                value={distributionForm.notes}
                                onChange={(e) => setDistributionForm({ ...distributionForm, notes: e.target.value })}
                                placeholder="Nhập hướng dẫn hoặc phản hồi cho nông dân..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-emerald-500 text-slate-700 shadow-sm resize-none"
                              />
                            </div>

                            <div className="flex justify-end gap-2 pt-1.5">
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDistributingRequest(null);
                                }}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Đóng chi tiết
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMemberToReject(req.id);
                                }}
                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Bác bỏ
                              </button>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfirmDistribution(req.id);
                                }}
                                className="px-6 py-2 bg-[#004d40] text-white hover:bg-mint rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md hover:shadow-emerald-900/20"
                              >
                                Phê duyệt yêu cầu
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}

                {agriculturalRequests.filter((req: any) => {
                  if (reportSearchTerm && !req.name?.toLowerCase().includes(reportSearchTerm.toLowerCase())) return false;
                  if (reportFilterStatus !== 'all' && req.status !== reportFilterStatus) return false;
                  if (reportFilterGroup !== 'all') {
                    const arr = req.requestsArr || [];
                    if (!arr.includes(reportFilterGroup) && !req.cropName?.includes(reportFilterGroup)) return false;
                  }
                  return true;
                }).length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Sprout size={40} className="text-slate-300 mb-3 animate-pulse" />
                    <h4 className="text-sm font-bold text-slate-700 mb-0.5">Không tìm thấy đơn yêu cầu nào</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Bản ghi trống hoặc không trùng khớp với bộ lọc dữ liệu.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex gap-3 justify-end pt-5 mt-6 border-t border-slate-100 shrink-0">
              <button 
                type="button"
                onClick={() => setIsAgriculturalRequestsModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View All Pending Approvals Modal */}
      {isViewAllPendingModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsViewAllPendingModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-forest flex items-center gap-2">
                  <Eye className="text-emerald-700" size={24} />
                  Danh sách phê duyệt / Xem xét
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Tổng số hồ sơ chờ xét duyệt: <span className="font-extrabold text-[#004d40]">{pendingMembers.length} hồ sơ</span>
                </p>
              </div>
              <button 
                onClick={() => setIsViewAllPendingModalOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Filter and Search Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 shrink-0">
              {/* Category tabs */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
                <button
                  onClick={() => setPendingListFilter('all')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${pendingListFilter === 'all' ? 'bg-white text-forest shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Tất cả ({pendingMembers.length})
                </button>
                <button
                  onClick={() => setPendingListFilter('registration')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${pendingListFilter === 'registration' ? 'bg-white text-forest shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Đăng ký xã viên ({pendingMembers.filter(m => m.type !== 'crop_approval' && m.type !== 'agricultural_request').length})
                </button>
                <button
                  onClick={() => setPendingListFilter('crop')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${pendingListFilter === 'crop' ? 'bg-white text-forest shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Trồng mới ({pendingMembers.filter(m => m.type === 'crop_approval').length})
                </button>
                <button
                  onClick={() => setPendingListFilter('request')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${pendingListFilter === 'request' ? 'bg-white text-forest shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Hỗ trợ ({pendingMembers.filter(m => m.type === 'agricultural_request').length})
                </button>
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Tìm kiếm nông dân, nông sản..."
                  value={pendingListSearch}
                  onChange={(e) => setPendingListSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 text-sm focus:bg-white focus:border-emerald-500 transition-all shadow-sm"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            {/* Modal Body: Scrollable Table */}
            <div className="overflow-y-auto flex-1 border border-slate-100 rounded-3xl min-h-[300px]">
              {filteredPendingList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} />
                  </div>
                  <h4 className="text-base font-bold text-slate-700 mb-1">Không tìm thấy yêu cầu nào</h4>
                  <p className="text-xs text-slate-400 font-medium">Vui lòng thử tìm kiếm lại hoặc đổi bộ lọc.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-50">
                    {filteredPendingList.map((member, index) => (
                      <tr key={`${member.id}-${index}`} className="hover:bg-slate-55/40 hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-5 pl-8">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${member.type === 'crop_approval' ? 'bg-yellow-50 text-yellow-600' : member.type === 'agricultural_request' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-forest'}`}>
                              {member.type === 'crop_approval' ? 'T' : member.type === 'agricultural_request' ? 'Y' : member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-forest text-sm">{member.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium font-mono">{member.phone || 'SĐT: N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {member.type === 'crop_approval' ? (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap block w-max">
                              Cây trồng mới
                            </span>
                          ) : member.type === 'agricultural_request' ? (
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap block w-max">
                              Hỗ trợ vật tư
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap block w-max">
                              Đăng ký xã viên
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{member.type === 'crop_approval' ? member.cropName : member.type === 'agricultural_request' ? member.cropName : member.crop}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Diện tích: {member.area || 'N/A'} • {member.ward || member.province || 'Lâm Đồng'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 pr-8">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setSelectedMemberDetail(member);
                              }}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm cursor-pointer"
                              title="Xem chi tiết"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                handleApproveMember(member.id);
                              }}
                              className="w-8 h-8 rounded-lg bg-mint/10 text-[#004d40] flex items-center justify-center hover:bg-mint hover:text-white transition-all shadow-sm cursor-pointer"
                              title="Phê duyệt"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                            <button 
                              onClick={() => {
                                handleRejectMember(member.id);
                              }}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                              title="Từ chối"
                            >
                              <XCircle size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end pt-5 mt-6 border-t border-slate-100 shrink-0">
              <button 
                type="button"
                onClick={() => setIsViewAllPendingModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View All Staff/Farmer Accounts Modal */}
      {isViewAllStaffModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsViewAllStaffModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-forest flex items-center gap-2">
                  <Eye className="text-emerald-700" size={24} />
                  Danh sách Tài khoản Nông dân đã cấp
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Tổng số tài khoản: <span className="font-extrabold text-[#004d40]">{staffAccounts.length} tài khoản</span>
                </p>
              </div>
              <button 
                onClick={() => setIsViewAllStaffModalOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Search Section */}
            <div className="flex flex-col md:flex-row items-center justify-end gap-4 mb-6 shrink-0">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo Tên, SĐT, CCCD, ID..."
                  value={staffListSearch}
                  onChange={(e) => setStaffListSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 text-sm focus:bg-white focus:border-emerald-500 transition-all shadow-sm"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            {/* Modal Body: Scrollable Table */}
            <div className="overflow-y-auto flex-1 border border-slate-100 rounded-3xl min-h-[300px]">
              {filteredStaffList.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} />
                  </div>
                  <h4 className="text-base font-bold text-slate-700 mb-1">Không tìm thấy tài khoản nào</h4>
                  <p className="text-xs text-slate-400 font-medium">Vui lòng thử tìm kiếm lại với từ khóa khác.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Xã viên / Vai trò</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Số Điện Thoại / CCCD</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bộ Mã Bảo Mật</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã Định danh</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStaffList.map((staff, i) => (
                      <tr 
                        key={staff.id || i}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="px-6 py-5 pl-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center font-black text-forest text-sm">
                              {staff.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-forest text-sm">{staff.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{staff.role || 'Nhân viên'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-slate-700">{staff.phone}</p>
                          <p className="text-xs text-slate-400 font-mono">CCCD: {staff.cccd || '---'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-800 text-[9px] font-mono font-bold rounded">
                                Xã viên: {staff.memberId || 'XV-XXX'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-mono font-bold rounded">
                                HTX: {staff.cooperativeId || 'HTX-001'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 text-[9px] font-mono font-bold rounded">
                                Admin: {staff.createdByAdminId || 'ADM-001'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <code className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-150 break-all block max-w-xs overflow-hidden text-ellipsis">
                            {staff.id}
                          </code>
                        </td>
                        <td className="px-6 py-5">
                          <button 
                            onClick={() => {
                              setSelectedMember(staff);
                              setIsMemberDetailsModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-mint/10 text-forest hover:bg-mint hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end pt-5 mt-6 border-t border-slate-100 shrink-0">
              <button 
                type="button"
                onClick={() => setIsViewAllStaffModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Staff Account Modal */}
      {isStaffAccountModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeStaffModal} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full ${createdStaffResult ? 'max-w-3xl' : 'max-w-4xl'} bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-forest flex items-center gap-2">
                  <Building2 size={24} className="text-emerald-700" />
                  Cấp tài khoản Xã viên
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Hợp tác xã: <span className="font-extrabold text-forest">{adminProfile?.htxName || 'HTX Cà phê Cầu Đất'}</span>
                </p>
              </div>
              <button 
                onClick={closeStaffModal}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors"
               >
                <XCircle size={20} />
              </button>
            </div>
            
            {createdStaffResult ? (
              <div className="space-y-6 text-center py-2">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-forest">Tài khoản đã sẵn sàng!</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Hãy cung cấp thông tin này cho nhân sự mới</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* Left Column: Personal info & ID tags */}
                  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100/80 space-y-4 flex flex-col justify-between">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200/40 pb-2">Thông tin cá nhân</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và tên</span>
                          <span className="font-bold text-forest text-sm">{createdStaffResult.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-t border-slate-200/40 pt-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số CCCD</span>
                          <span className="font-mono font-bold text-forest text-sm">{createdStaffResult.cccd}</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-t border-slate-200/40 pt-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</span>
                          <span className="font-mono font-bold text-forest text-sm">{createdStaffResult.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mã phân quyền nghiệp vụ</h5>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Xã viên</span>
                          <span className="font-mono font-bold text-amber-600 text-[11px]">{createdStaffResult.memberId}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Mã HTX</span>
                          <span className="font-mono font-bold text-emerald-600 text-[11px]">{createdStaffResult.cooperativeId}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Admin</span>
                          <span className="font-mono font-bold text-slate-600 text-[11px]">{createdStaffResult.createdByAdminId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Security ID, Password Generator, and Lockdown Notice */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100/80 space-y-4">
                      <div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block font-bold mb-1.5">Mật khẩu tự động cấp</span>
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                          <code className="font-mono font-bold text-base text-forest tracking-widest">{createdStaffResult.password}</code>
                          <button
                            type="button"
                            onClick={() => {
                              const info = `Mã Định Danh: ${createdStaffResult.id}\nMật khẩu: ${createdStaffResult.password}`;
                              navigator.clipboard.writeText(info);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="px-3 py-1.5 bg-forest text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-mint hover:text-forest transition-colors flex items-center gap-1 shrink-0"
                          >
                            {copied ? 'Đã sao chép' : 'Sao chép'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold mb-1.5">Mã định danh liên kết toàn diện</span>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <code className="font-mono font-bold text-xs text-slate-500 break-all block">{createdStaffResult.id}</code>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-250/50 text-amber-800 text-xs font-medium space-y-1">
                      <p className="font-black text-[10px] uppercase tracking-wider flex items-center gap-1 text-amber-900">🛡️ KHÓA HTX ĐỘC QUYỀN:</p>
                      <p className="text-[11px] leading-relaxed text-amber-800/90">
                        Tài khoản này đã được liên kết cố định với Hợp tác xã <span className="font-bold">{createdStaffResult.cooperativeId}</span>. Hệ thống bảo mật ngăn cấm tài khoản này đăng nhập hay truy cập dữ liệu của bất kỳ Hợp tác xã nào khác.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={closeStaffModal}
                    className="w-full py-4 bg-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-mint hover:text-forest transition-colors shadow-lg"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            ) : (
              <form className="space-y-5 flex-1 text-left animate-in fade-in duration-300" onSubmit={handleCreateStaffAccount}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Regional info / HTX Products */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">1</div>
                      <h4 className="text-sm font-bold text-slate-800">Thông tin khu vực nghiệp vụ</h4>
                    </div>

                    <div className="relative">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tỉnh / Thành phố</label>
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl">
                        <MapPin size={16} className="text-slate-500" />
                        <span className="font-bold text-slate-700 text-sm">{newStaffAccount.province}</span>
                        <span className="text-[9px] ml-auto bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">Đồng bộ HTX</span>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Xã / Phường</label>
                      <div className="relative">
                        <Navigation size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                          required
                          value={newStaffAccount.ward}
                          onChange={(e) => setNewStaffAccount({...newStaffAccount, ward: e.target.value})}
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none text-sm"
                        >
                          <option value="" disabled>Chọn Xã/Phường</option>
                          {((LOCAL_WARDS_MAP[newStaffAccount.province] || []).length > 0 ? (
                            LOCAL_WARDS_MAP[newStaffAccount.province] || []
                          ) : ['Cầu Đất']).map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nông sản chủ lực đăng ký</label>
                      <input 
                        required
                        type="text"
                        value={newStaffAccount.crop}
                        onChange={(e) => setNewStaffAccount({...newStaffAccount, crop: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-bold text-slate-700 text-sm"
                        placeholder="VD: Cà phê, Chè, Sầu riêng"
                      />
                    </div>
                  </div>

                  {/* Right Column: Personal Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">2</div>
                      <h4 className="text-sm font-bold text-slate-800">Thông tin cá nhân xã viên</h4>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ và tên</label>
                      <input 
                        required
                        type="text"
                        value={newStaffAccount.name}
                        onChange={(e) => setNewStaffAccount({...newStaffAccount, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all text-sm"
                        placeholder="VD: Nguyễn Văn A"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                      <input 
                        required
                        type="text"
                        value={newStaffAccount.phone}
                        onChange={(e) => setNewStaffAccount({...newStaffAccount, phone: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all text-sm"
                        placeholder="VD: 0912345678"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số CCCD (6 số cuối tạo mật khẩu)</label>
                      <input 
                        required
                        type="text"
                        value={newStaffAccount.cccd}
                        onChange={(e) => setNewStaffAccount({...newStaffAccount, cccd: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all text-sm"
                        placeholder="Nhập 12 số CCCD của nông dân"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Địa chỉ chi tiết (Thôn/Xóm/Số nhà)</label>
                      <input 
                        required
                        type="text"
                        value={newStaffAccount.address}
                        onChange={(e) => setNewStaffAccount({...newStaffAccount, address: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all text-sm"
                        placeholder="VD: Thôn Cầu Đất, Thôn Trường An..."
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-3 justify-end border-t border-slate-100 col-span-2">
                  <button 
                    type="button"
                    onClick={closeStaffModal}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-forest hover:bg-mint hover:text-forest text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    Cấp tài khoản Nông dân
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* Add Harvest Modal */}
      {isHarvestModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-forest/40 backdrop-blur-md" onClick={() => setIsHarvestModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-10 relative z-10 shadow-2xl flex flex-col md:flex-row gap-8 max-h-[90vh]"
          >
            {/* Left Column: Harvest Schedule Form */}
            <div className="flex-1 overflow-y-auto pr-2 max-h-[80vh]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-forest">Lên lịch Thu hoạch</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Lên kế hoạch thu mua nông sản</p>
                </div>
                {/* On mobile, close button can remain inside */}
                <button 
                  onClick={() => setIsHarvestModalOpen(false)}
                  className="md:hidden w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <form onSubmit={handleAddHarvest} className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Chọn Xã viên / Chủ vườn</label>
                  <select 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all appearance-none cursor-pointer"
                    value={newHarvest.farmer}
                    onChange={(e) => {
                      const farmerName = e.target.value;
                      const farmerData = activeFarmers.find(f => f.name === farmerName);
                      setNewHarvest({
                        ...newHarvest, 
                        farmer: farmerName,
                        product: farmerData?.crops[0]?.name || '',
                        area: farmerData?.crops[0]?.area || '',
                        batch: ''
                      });
                    }}
                  >
                    <option value="">-- Chọn nông dân --</option>
                    {htxActiveFarmers.map(f => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sản phẩm đăng ký</label>
                  <select 
                    required
                    disabled={!newHarvest.farmer}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all appearance-none cursor-pointer disabled:opacity-50"
                    value={newHarvest.product}
                    onChange={(e) => {
                      const cropName = e.target.value;
                      const farmerData = activeFarmers.find(f => f.name === newHarvest.farmer);
                      const cropData = farmerData?.crops.find(c => c.name === cropName);
                      setNewHarvest({
                        ...newHarvest, 
                        product: cropName,
                        area: cropData?.area || newHarvest.area,
                        batch: ''
                      });
                    }}
                  >
                    <option value="">-- Chọn nông sản --</option>
                    {activeFarmers.find(f => f.name === newHarvest.farmer)?.crops.map((c, idx) => (
                      <option key={`${c.name}-${idx}`} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Ngày nhận nông sản dự kiến</label>
                  <input 
                    required
                    type="text" 
                    placeholder="10/01/2025"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                    value={newHarvest.date}
                    onChange={(e) => setNewHarvest({...newHarvest, date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sản lượng dự kiến</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                    value={newHarvest.qty}
                    onChange={(e) => setNewHarvest({...newHarvest, qty: e.target.value})}
                    placeholder="VD: 2.5 Tấn"
                  />
                </div>

                {activeFarmers.find(f => f.name === newHarvest.farmer)?.crops.find(c => c.name === newHarvest.product)?.type === 'short-term' ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số lần thu hoạch (Batch)</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-amber rounded-2xl outline-none font-bold text-forest transition-all shadow-sm shadow-amber/10"
                      value={newHarvest.batch}
                      onChange={(e) => setNewHarvest({...newHarvest, batch: e.target.value})}
                      placeholder="VD: 1, 2, 3..."
                    />
                    <p className="text-[9px] text-amber-600 font-bold italic ml-2">Cây ngắn ngày: Cần ghi rõ đợt hái</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Vùng thu mua</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                      value={newHarvest.area}
                      onChange={(e) => setNewHarvest({...newHarvest, area: e.target.value})}
                      placeholder="VD: Bảo Lộc"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tổng giá trị sản phẩm (VNĐ)</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                    value={newHarvest.totalValue}
                    onChange={(e) => setNewHarvest({...newHarvest, totalValue: e.target.value})}
                    placeholder="VD: 50.000.000"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mô tả yêu cầu thu hoạch</label>
                  <textarea 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all resize-none"
                    value={newHarvest.requirements}
                    onChange={(e) => setNewHarvest({...newHarvest, requirements: e.target.value})}
                    placeholder="Ghi chú yêu cầu đặc biệt..."
                    rows={3}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={!newHarvest.farmer || !newHarvest.product}
                  className="col-span-2 py-5 bg-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác nhận lên lịch
                </button>
              </form>
            </div>

            {/* Middle Divider */}
            <div className="hidden md:block w-px bg-slate-100 self-stretch" />

            {/* Right Column: Farmer Quick List */}
            <div className="flex-1 flex flex-col min-w-0 max-h-[80vh]">
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                  <h3 className="text-2xl font-black text-forest">Danh sách Nông dân</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Chọn nhanh nông hộ từ HTX ({htxActiveFarmers.length})</p>
                </div>
                <button 
                  onClick={() => setIsHarvestModalOpen(false)}
                  className="hidden md:flex w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Instant Search bar inside panel */}
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 mb-6 shrink-0 shadow-inner">
                <Search className="text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Tìm nhanh nông dân theo tên..." 
                  className="bg-transparent outline-none w-full text-xs font-bold text-forest" 
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                />
              </div>

              {/* Scrollable grid/list body */}
              <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-1 select-none">
                {htxActiveFarmers.filter(f => f.name.toLowerCase().includes(memberSearchQuery.toLowerCase())).length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Không tìm thấy nông dân
                  </div>
                ) : (
                  htxActiveFarmers
                    .filter(f => f.name.toLowerCase().includes(memberSearchQuery.toLowerCase()))
                    .map((farmer, idx) => {
                      const isSelected = newHarvest.farmer === farmer.name;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => {
                            const farmerName = farmer.name;
                            const farmerData = activeFarmers.find(f => f.name === farmerName);
                            setNewHarvest({
                              ...newHarvest,
                              farmer: farmerName,
                              product: farmerData?.crops[0]?.name || '',
                              area: farmerData?.crops[0]?.area || '',
                              batch: ''
                            });
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                            isSelected 
                              ? 'bg-mint/10 border-mint shadow-md' 
                              : 'bg-slate-50/50 hover:bg-white border-slate-100 hover:border-mint/50 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                              isSelected ? 'bg-mint text-white' : 'bg-forest/5 text-forest'
                            }`}>
                              {farmer.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-extrabold text-forest text-sm truncate">{farmer.name}</p>
                              <p className="text-[10px] text-slate-400 font-extrabold truncate">{farmer.phone || 'N/A'}</p>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-slate-700">{farmer.province}</p>
                            <p className="text-[10px] text-mint font-black uppercase tracking-wider mt-0.5">{farmer.area}</p>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* View All QC Deliveries Modal */}
      {isViewAllDeliveriesOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-forest/40 backdrop-blur-md" onClick={() => setIsViewAllDeliveriesOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-[2.5rem] p-10 relative z-10 shadow-2xl overflow-hidden flex flex-col h-[80vh]"
          >
            <div className="flex items-center justify-between mb-8 flex-shrink-0">
              <div>
                <h3 className="text-2xl font-black text-forest">Danh sách Chờ QC & Nhập kho</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Quản lý nông sản chờ kiểm định</p>
              </div>
              <button 
                onClick={() => setIsViewAllDeliveriesOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {pendingDeliveries
                .filter(d => !adminProfile?.cooperativeId || d.cooperativeId === adminProfile.cooperativeId)
                .sort((a, b) => {
                  const timeA = a.timestamp || '';
                  const timeB = b.timestamp || '';
                  if (timeA && timeB) return timeB.localeCompare(timeA);
                  const getNum = (id: string) => parseInt(id.replace(/\D/g, '')) || 0;
                  return getNum(b.id) - getNum(a.id) || b.id.localeCompare(a.id);
                })
                .map((item, i) => (
                <div key={i} className="group p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-mint transition-all flex items-center justify-between cursor-pointer" onClick={() => { setSelectedDelivery(item); setIsViewAllDeliveriesOpen(false); }}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${
                        item.status === 'Chờ QC' ? 'bg-amber-100 text-amber-600' : 
                        item.status === 'Đang QC' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                        {item.status === 'Chờ QC' ? 'QC' : item.status === 'Đang QC' ? '...' : 'OK'}
                    </div>
                    <div>
                        <h4 className="font-bold text-forest text-sm">{item.product}</h4>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{item.farmer} • {item.actualQty} • {item.actualDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        item.status === 'Chờ QC' ? 'bg-amber-100 text-amber-700' : 
                        item.status === 'Đang QC' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {item.status}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-mint group-hover:text-forest transition-all">
                        <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
              {pendingDeliveries.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                    <Package size={48} strokeWidth={1} className="mb-4" />
                    <p className="font-bold text-sm">Chưa có yêu cầu nào</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Selected Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-forest/40 backdrop-blur-md" onClick={() => setSelectedDelivery(null)} />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-mint/10 text-mint rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-forest">Chi tiết Giao hàng</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Mã vận đơn: {selectedDelivery.id}</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedDelivery(null)}
                className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-black"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Xã viên</p>
                  <p className="font-bold text-forest">{selectedDelivery.farmer}</p>
                  <p className="text-[10px] font-medium text-slate-400">{selectedDelivery.farmerPhone}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sản phẩm</p>
                  <p className="font-bold text-forest">{selectedDelivery.product}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Số lượng thực giao</p>
                  <p className="font-bold text-forest text-lg">{selectedDelivery.actualQty}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày giao thực tế</p>
                  <p className="font-bold text-forest">{selectedDelivery.actualDate}</p>
               </div>
               <div className="col-span-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Ghi chú từ nông dân</p>
                  <p className="text-xs font-bold text-forest/70 italic">"{selectedDelivery.note || 'Không có ghi chú'}"</p>
               </div>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Ghi chú QC / Kiểm soát chất lượng</label>
                  <textarea 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all resize-none"
                    placeholder="Nhập ghi chú kiểm định tại đây..."
                    rows={2}
                    value={deliveryStatusNote}
                    onChange={(e) => setDeliveryStatusNote(e.target.value)}
                  />
               </div>
               
               <div className="flex gap-3">
                  <button 
                      onClick={() => {
                          setIsReceiptViewOpen(true);
                          setReceiptConfirmed(selectedDelivery.status === 'Nhập kho' || selectedDelivery.status === 'Đã kiểm định');
                      }}
                      className="flex-1 py-4 bg-forest text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 flex items-center justify-center gap-2"
                  >
                      <FileText size={18} /> Tạo Biên bản giao nhận nông sản
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delivery Receipt View (Simulated New Page) */}
      {isReceiptViewOpen && selectedDelivery && (
        <div className="fixed inset-0 z-[300] bg-slate-100 overflow-y-auto receipt-overlay print:bg-white print:static">
          <div className="min-h-screen py-10 px-4 flex flex-col items-center print:p-0 print:block">
            {/* Action Bar */}
            <div className="w-full max-w-[21cm] mb-6 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm sticky top-4 z-10 border border-slate-200 print:hidden receipt-action-bar">
                <button 
                  onClick={() => setIsReceiptViewOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft size={20} /> Quay lại
                </button>
                <div className="flex gap-3">
                    <button 
                      onClick={() => window.print()}
                      className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-sm"
                    >
                      <Printer size={18} /> In biên bản
                    </button>
                    {!receiptConfirmed ? (
                        <button 
                          onClick={() => {
                            setReceiptConfirmed(true);
                            updateDeliveryStatus(selectedDelivery.id, 'Nhập kho');
                          }}
                          className="px-8 py-2 bg-[#059669] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#047857] transition-all shadow-lg shadow-emerald-200"
                        >
                          Xác nhận
                        </button>
                    ) : (
                        <button 
                          disabled
                          className="px-8 py-2 bg-slate-400 text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2"
                        >
                          <Check size={16} /> Đã xác nhận
                        </button>
                    )}
                </div>
            </div>

            {/* Receipt Document */}
            <div id="printable-receipt" className="w-full max-w-[21cm] bg-white shadow-2xl p-[2cm] min-h-[29.7cm] relative text-slate-800 font-serif border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:w-[21cm]">
               {/* Watermark/Logo bg would go here */}
               <div className="flex justify-between items-start border-b-2 border-forest pb-8 mb-10">
                  <div className="space-y-1">
                     <h1 className="text-2xl font-black text-forest font-sans tracking-tighter">VIETAGRI</h1>
                     <p className="text-xs font-bold text-slate-500 font-sans uppercase tracking-widest">Hệ thống quản lý nông sản số</p>
                  </div>
                  <div className="text-right space-y-1">
                     <p className="text-xs font-bold uppercase font-sans">Mã số: {selectedDelivery.id}</p>
                     <p className="text-[10px] text-slate-400 font-sans italic">Ngày in: {new Date().toLocaleString('vi-VN')}</p>
                  </div>
               </div>

               <div className="text-center mb-12">
                  <h2 className="text-3xl font-black uppercase tracking-tight font-sans text-slate-900 mb-2">Biên bản giao nhận nông sản</h2>
                  <p className="text-sm font-medium italic">Số: {selectedDelivery.id.replace('DLV-', '')}/BBGN-{new Date().getFullYear()}</p>
               </div>

               <div className="space-y-8 text-sm mb-12 leading-relaxed">
                  <p>Hôm nay, ngày {selectedDelivery.actualDate.split('/')[0]} tháng {selectedDelivery.actualDate.split('/')[1]} năm {selectedDelivery.actualDate.split('/')[2]}, tại {adminProfile?.htxName || 'Hợp tác xã'}, chúng tôi gồm:</p>
                  
                  <div className="space-y-4">
                     <div className="flex flex-col gap-2">
                        <p className="font-bold uppercase font-sans text-xs underline decoration-forest decoration-2 underline-offset-4">BÊN GIAO (Xã viên):</p>
                        <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-slate-100">
                           <p><span className="font-semibold">Họ và tên:</span> {selectedDelivery.farmer}</p>
                           <p><span className="font-semibold">Số điện thoại:</span> {selectedDelivery.farmerPhone}</p>
                           <p className="col-span-2"><span className="font-semibold">Địa chỉ:</span> Lâm Đồng, Việt Nam</p>
                        </div>
                     </div>

                     <div className="flex flex-col gap-2">
                        <p className="font-bold uppercase font-sans text-xs underline decoration-forest decoration-2 underline-offset-4">BÊN NHẬN (Hợp tác xã):</p>
                        <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-slate-100">
                           <p><span className="font-semibold">Đại diện:</span> {adminProfile?.name || 'Cán bộ HTX'}</p>
                           <p><span className="font-semibold">Đơn vị:</span> {adminProfile?.htxName || 'Hợp tác xã Nông nghiệp'}</p>
                        </div>
                     </div>
                  </div>

                  <p>Hai bên tiến hành bàn giao nông sản với các chi tiết cụ thể như sau:</p>

                  <table className="w-full border-collapse border border-slate-300 font-sans text-xs mb-8">
                     <thead className="bg-slate-50">
                        <tr>
                           <th className="border border-slate-300 p-3 text-left">Nội dung sản phẩm</th>
                           <th className="border border-slate-300 p-3 text-center">Đơn vị</th>
                           <th className="border border-slate-300 p-3 text-center">Số lượng</th>
                           <th className="border border-slate-300 p-3 text-right">Thành tiền (Dự kiến)</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td className="border border-slate-300 p-4 font-bold">{selectedDelivery.product}</td>
                           <td className="border border-slate-300 p-4 text-center">Tấn/Túi</td>
                           <td className="border border-slate-300 p-4 text-center font-bold text-lg">{selectedDelivery.actualQty}</td>
                           <td className="border border-slate-300 p-4 text-right font-bold">{selectedDelivery.actualValue ? `${Number(selectedDelivery.actualValue).toLocaleString()} VNĐ` : 'Chờ định giá'}</td>
                        </tr>
                        <tr>
                           <td colSpan={3} className="border border-slate-300 p-4 text-right font-bold uppercase bg-slate-50">Tổng cộng giá trị bàn giao</td>
                           <td className="border border-slate-300 p-4 text-right font-black text-forest text-lg">
                              {selectedDelivery.actualValue ? `${Number(selectedDelivery.actualValue).toLocaleString()} VNĐ` : 'Chờ QC'}
                           </td>
                        </tr>
                     </tbody>
                  </table>

                  <div className="space-y-2">
                     <p className="font-bold text-xs uppercase font-sans italic text-slate-500">Ghi chú & Tình trạng hàng hóa:</p>
                     <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 min-h-[80px]">
                        {selectedDelivery.note || 'Hàng hóa đúng quy cách, không hư hỏng tại thời điểm bàn giao.'}
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-10 mt-20 font-sans">
                  <div className="text-center space-y-20">
                     <div>
                        <p className="font-bold uppercase text-[11px]">Đại diện bên Giao</p>
                        <p className="text-[10px] text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
                     </div>
                     <div className="pt-4 border-t border-slate-200 inline-block px-10">
                        <p className="font-bold text-sm">{selectedDelivery.farmer}</p>
                     </div>
                  </div>
                  <div className="text-center space-y-20">
                     <div>
                        <p className="font-bold uppercase text-[11px]">Đại diện bên Nhận</p>
                        <p className="text-[10px] text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
                     </div>
                     <div className="pt-4 border-t border-slate-200 inline-block px-10">
                        <p className="font-bold text-sm">{adminProfile?.name || 'Cán bộ HTX'}</p>
                     </div>
                  </div>
               </div>

               {/* Footer Decoration */}
               <div className="absolute bottom-[1cm] left-[2cm] right-[2cm] border-t border-slate-100 pt-4 flex justify-between items-center text-[8px] font-sans text-slate-300 uppercase tracking-[0.2em] font-black">
                  <span>VIETAGRI DIGITAL ECOSYSTEM</span>
                  <span>Trang 01/01</span>
               </div>
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal for Harvests */}
      {harvestToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setHarvestToDelete(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-black text-forest mb-2">Xóa lịch thu hoạch?</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">Bạn có chắc chắn muốn xóa lịch thu hoạch này? Hành động này không thể hoàn tác.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setHarvestToDelete(null)}
                className="py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmDeleteHarvest}
                className="py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200"
              >
                Xác nhận xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View All Harvests Modal */}
      {isViewAllHarvestOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-forest/40 backdrop-blur-md" onClick={() => setIsViewAllHarvestOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl font-black text-forest tracking-tight">Tất cả lịch thu hoạch</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Tổng cộng: {filteredHarvests.length} lượt</p>
              </div>
              <button onClick={() => setIsViewAllHarvestOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="space-y-4">
                {filteredHarvests
                  .sort((a, b) => {
                    const timeA = a.timestamp || '';
                    const timeB = b.timestamp || '';
                    if (timeA && timeB) return timeB.localeCompare(timeA);
                    return b.id.localeCompare(a.id);
                  })
                  .map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-mint/50 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shrink-0">
                        <span className="text-[10px] font-black text-forest uppercase">{formatDateSafe(item.date).includes('/') ? `Tháng ${formatDateSafe(item.date).split('/')[1]}` : 'QC'}</span>
                        <span className="text-xl font-black text-forest leading-none">{formatDateSafe(item.date).includes('/') ? formatDateSafe(item.date).split('/')[0] : '...'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-slate-800 tracking-tight">{item.product} - {item.farmer}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-slate-100">{item.id}</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.qty} • {item.area} {item.batch && `• Lần ${item.batch}`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {item.confirmed ? (
                            <span className="px-3 py-1 rounded-[10px] text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                            Đã xác nhận
                            </span>
                        ) : item.isRefused ? (
                            <span className="px-3 py-1 rounded-[10px] text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 cursor-pointer" onClick={() => item.refusalReason && alert('Lý do: ' + item.refusalReason)}>
                            Không xác nhận
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-[10px] text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                            Chờ nông dân
                            </span>
                        )}
                       <button 
                        onClick={() => handleEditHarvestSchedule(item)}
                        className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteHarvestSchedule(item.id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Harvest Modal */}
      {editingHarvest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-forest/50 backdrop-blur-md" onClick={() => setEditingHarvest(null)} />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 relative z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-forest">Thông tin lịch thu hoạch</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Chi tiết kế hoạch thu mua</p>
              </div>
              <button 
                onClick={() => setEditingHarvest(null)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <XCircle size={20} />
              </button>
            </div>

            {editingHarvest.isRefused && (
                <div className="mb-8 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Lý do từ chối:</p>
                    <p className="text-sm font-bold text-red-700">"{editingHarvest.refusalReason || 'Không có lý do chi tiết'}"</p>
                </div>
            )}

            <form className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Chọn Xã viên / Chủ vườn</label>
                <input 
                  disabled
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-forest transition-all"
                  value={editingHarvest.farmer}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sản phẩm đăng ký</label>
                <input 
                  disabled
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-forest transition-all"
                  value={editingHarvest.product}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Ngày nhận nông sản dự kiến</label>
                <input 
                  disabled
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-forest transition-all"
                  value={editingHarvest.date}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sản lượng dự kiến</label>
                <input 
                  disabled
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-forest transition-all"
                  value={editingHarvest.qty}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Vùng thu mua</label>
                <input 
                  disabled
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-forest transition-all"
                  value={editingHarvest.area}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tổng giá trị sản phẩm (VNĐ)</label>
                <input 
                  disabled
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-forest transition-all"
                  value={editingHarvest.totalValue || ''}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mô tả yêu cầu thu hoạch</label>
                <textarea 
                  disabled
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-forest transition-all resize-none"
                  value={editingHarvest.requirements || ''}
                  rows={3}
                />
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* View All Members Modal */}
      {isViewAllMembersOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-forest/40 backdrop-blur-md" onClick={() => setIsViewAllMembersOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[90vw] bg-white rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl font-black text-forest tracking-tight">Danh sách Nông dân</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Tổng cộng: {htxActiveFarmers.length} thành viên</p>
              </div>
              <button onClick={() => setIsViewAllMembersOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 mb-6">
                <Search className="text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm nông dân theo tên..." 
                  className="bg-transparent outline-none w-full text-sm font-medium" 
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                />
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-tl-xl">Xã viên</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Khu vực / Diện tích</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Tài khoản</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest rounded-tr-xl">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {htxActiveFarmers.filter(f => f.name.toLowerCase().includes(memberSearchQuery.toLowerCase())).map((farmer, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-forest/5 rounded-full flex items-center justify-center text-forest font-black">
                              {farmer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-forest text-sm">{farmer.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{farmer.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-700">
                          {farmer.province} • {farmer.area}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-600">
                          {farmer.phone || 'N/A'} 
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedFarmerDetails(farmer)}
                            className="px-3 py-1.5 bg-forest/5 text-forest rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-forest hover:text-white transition-all shadow-sm"
                          >
                            Hồ sơ
                          </button>
                          <button 
                            onClick={() => setFarmerToDelete(farmer.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Member Details Modal */}
      {selectedFarmerDetails && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedFarmerDetails(null)} />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-forest text-white rounded-2xl flex items-center justify-center text-2xl font-black">
                  {selectedFarmerDetails.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-forest">{selectedFarmerDetails.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedFarmerDetails.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFarmerDetails(null)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tỉnh thành</p>
                  <p className="text-sm font-bold text-forest">{selectedFarmerDetails.province}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tổng diện tích</p>
                  <p className="text-sm font-bold text-forest">{selectedFarmerDetails.area}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tài khoản (SĐT / MK)</p>
                  <p className="text-sm font-bold text-forest">{selectedFarmerDetails.phone || 'N/A'} / {selectedFarmerDetails.password || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-forest uppercase tracking-widest pl-1">Vùng sản xuất & Nông sản</h4>
                <div className="space-y-3">
                  {selectedFarmerDetails.crops.map((crop: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${crop.type === 'perennial' ? 'bg-forest' : 'bg-amber-500'}`} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{crop.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{crop.type === 'perennial' ? 'Cây lâu năm' : 'Cây ngắn ngày'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-forest">{crop.area}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase italic">Vùng trồng VietGAP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-forest/5 rounded-[2rem] border border-forest/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-forest text-white rounded-xl flex items-center justify-center">
                    <Handshake size={20} />
                  </div>
                  <h4 className="text-sm font-black text-forest uppercase tracking-widest">Hành động khả dụng</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => {
                      const farmer = selectedFarmerDetails;
                      setNewHarvest({
                        farmer: farmer.name,
                        product: farmer.crops[0]?.name || '',
                        area: farmer.crops[0]?.area || '',
                        date: '',
                        qty: '',
                        batch: ''
                      });
                      setSelectedFarmerDetails(null);
                      setIsViewAllMembersOpen(false);
                      setActiveTab('qc');
                      setIsHarvestModalOpen(true);
                    }}
                    className="py-4 bg-forest text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-lg shadow-forest/20"
                  >
                    Lên lịch thu mua
                  </button>
                  <button className="py-4 bg-white text-forest border-2 border-forest/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-forest hover:text-white transition-all shadow-sm">
                    Gửi thông báo riêng
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}


        {farmerToDelete && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setFarmerToDelete(null)}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-black text-forest mb-2">Xóa nông dân</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">Bạn có chắc chắn muốn xóa nông dân này khỏi hệ thống HTX? Lưu ý: Mọi dữ liệu về lịch sử thu hoạch và công nợ sẽ bị ẩn đi.</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setFarmerToDelete(null)}
                className="py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmDeleteFarmer}
                className="py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200"
              >
                Xác nhận xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stunning Interactive B2B Contract Approval & Review Sheet Modal */}
      {selectedB2BContract && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white rounded-[2.5rem] p-8 md:p-12 max-w-6xl w-full xl:max-w-7xl shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto flex flex-col gap-6 scrollbar-none"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mục duyệt hợp đồng điện tử</span>
                <h3 className="text-xl font-black text-forest flex items-center gap-2">
                  <FileText className="text-[#004d40]" size={22} />
                  CHI TIẾT HỢP ĐỒNG SỐ #{selectedB2BContract.contractNo?.includes('/2026') ? selectedB2BContract.contractNo : `${selectedB2BContract.contractNo || selectedB2BContract.id?.split('-').pop() || '01'}/2026/HĐMB`}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setSelectedB2BContract(null);
                  setSigningStep('idle');
                }}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer text-slate-500 hover:text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Interactive Signing Overlay Container */}
            {signingStep !== 'idle' ? (
              <div className="bg-slate-50/80 border border-slate-200 rounded-[2rem] p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                {signingStep === 'pincode' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full space-y-6"
                  >
                    <div className="mx-auto w-20 h-20 bg-[#f0f7f5] rounded-full flex items-center justify-center text-[#1a5f53] mb-6">
                      <Lock size={40} />
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-black text-slate-800">Ký số</h4>
                      <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto">Vui lòng nhập mã PIN bảo mật của USB Token Vietagri-CA để áp dụng chữ ký số.</p>
                    </div>

                    <div className="space-y-4">
                      <input 
                        type="password"
                        placeholder="Mã PIN Chữ ký số (Mặc định: 123456)"
                        className="w-full px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-center font-bold tracking-widest text-lg outline-none focus:border-[#1a5f53] transition-all text-slate-600 placeholder:text-slate-400"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleVerifyPinAndSign()}
                      />
                      {pinError && (
                        <p className="text-sm text-[#1a5f53] font-bold text-center">{pinError}</p>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setSigningStep('idle')}
                        className="w-1/2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyPinAndSign}
                        className="w-1/2 py-4 bg-[#1a5f53] hover:bg-[#0c4a3e] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-[#1a5f53]/20"
                      >
                        Xác nhận ký
                      </button>
                    </div>
                  </motion.div>
                )}

                {signingStep === 'signing' && (
                  <div className="max-w-lg w-full space-y-6">
                    {/* Animated Circular Spinner */}
                    <div className="relative w-28 h-28 mx-auto">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                        <motion.circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          stroke="#1a5f53" 
                          strokeWidth="6" 
                          fill="transparent"
                          strokeDasharray="264"
                          animate={{ strokeDashoffset: 264 - (2.64 * signProgress) }}
                          transition={{ duration: 0.3 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-slate-800 text-xl font-mono">
                        {signProgress}%
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-base font-black text-slate-800 animate-pulse">Đang thực hiện quy trình ký</h4>
                      <p className="text-xs text-slate-500 font-mono italic max-w-sm mx-auto">{signStatusMessage}</p>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1a5f53] h-full transition-all duration-300" style={{ width: `${signProgress}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Được hỗ trợ bởi Viettel-CA HSM Secure Signature Tool</p>
                  </div>
                )}

                 {signingStep === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full space-y-6"
                  >
                    <div className="mx-auto w-16 h-16 bg-[#1a5f53] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#1a5f53]/20 mb-4">
                      <CheckCircle2 size={36} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#1a5f53]">Ký số Hợp tác xã Thành công!</h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Hợp đồng điện tử <strong>Số {selectedB2BContract.contractNo}</strong> đã được đại diện Hợp tác xã ký số HSM thành công. Hệ thống đã đồng bộ chuyển tiếp văn kiện này sang trang <strong>Customer Dashboard</strong> của Doanh nghiệp đối tác (Bên mua) để thực hiện ký số đối ứng. Hợp đồng chưa có hiệu lực pháp lý toàn vẹn và không thể tải bản in PDF cho tới khi cả hai bên đã hoàn tất ký số.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        disabled
                        className="w-1/2 py-3.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200"
                        title="Hợp đồng chưa hoàn thiện chữ ký điện tử hai bên"
                      >
                        <Lock size={14} /> Chưa thể tải bản in PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSigningStep('idle');
                          setSelectedB2BContract(null);
                        }}
                        className="w-1/2 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        Đóng / Hoàn tất
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Printable Whitepaper Legal Doc Styled Area with Standard A4 template styling */
              <div className="bg-slate-50 border border-slate-200/80 rounded-[2rem] p-6 md:p-12 text-[#1c1c1c] font-serif leading-relaxed text-sm space-y-8 max-h-[68vh] overflow-y-auto scrollbar-thin shadow-inner select-text relative">
                {/* National Header in template style */}
                <div className="text-center font-serif text-slate-900 space-y-0.5">
                  <div className="font-bold text-[14px] leading-tight tracking-normal">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="font-bold text-[13.5px] tracking-wide">Độc lập – Tự do – Hạnh phúc</div>
                  <div className="w-36 h-[1.5px] bg-slate-950 mx-auto mt-2"></div>
                </div>

                {/* Contract Title */}
                <div className="text-center font-serif py-3 space-y-1">
                  <h4 className="text-[17px] font-bold text-slate-900 tracking-wide">
                    {selectedB2BContract.contractNo?.includes('HĐHTSXNN') ? 'HỢP ĐỒNG HỢP TÁC SẢN XUẤT NÔNG NGHIỆP' : 'HỢP ĐỒNG MUA BÁN HÀNG HÓA'}
                  </h4>
                  <p className="text-xs font-sans tracking-wide">Số: {selectedB2BContract.contractNo?.includes('/2026') ? selectedB2BContract.contractNo : `${selectedB2BContract.contractNo || selectedB2BContract.id?.split('-').pop() || '01'}/2026/${selectedB2BContract.contractNo?.includes('HĐHTSXNN') ? 'HĐHTSXNN' : 'HĐMB'}`}</p>
                </div>

                {/* Legal foundations */}
                <div className="text-xs space-y-1 pl-4 italic border-l-2 border-slate-300">
                  <p>– Căn cứ Bộ luật Dân sự 2015;</p>
                  <p>– Căn cứ Luật Thương mại 2005;</p>
                  <p>– Căn cứ nhu cầu và khả năng thực tế của các bên.</p>
                </div>

                {/* Opening statement */}
                <p className="text-xs leading-relaxed text-justify indent-8 pt-2">
                  Hôm nay, ngày {new Date(selectedB2BContract.createdAt).getDate()} tháng {new Date(selectedB2BContract.createdAt).getMonth() + 1} năm 2026, tại địa chỉ: Văn phòng Ban Giám đốc Hợp tác xã, chúng tôi gồm có:
                </p>

                {/* Buyer & Seller details in legal structure representation */}
                <div className="space-y-6 pt-2 font-sans text-xs">
                  {/* Bên Bán */}
                  <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-3">
                    <div className="font-bold text-forest uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                      BÊN BÁN (Bên A)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700 leading-normal">
                      <div className="md:col-span-2"><strong>Tên doanh nghiệp:</strong> {selectedB2BContract.seller?.name || selectedB2BContract.coopName}</div>
                      <div className="md:col-span-2"><strong>Mã số doanh nghiệp:</strong> {selectedB2BContract.seller?.taxCode || '3901284560'}</div>
                      <div className="md:col-span-2"><strong>Địa chỉ trụ sở chính:</strong> {selectedB2BContract.seller?.address || 'Khu phố 1, Huyện Đức Trọng, Tỉnh Lâm Đồng'}</div>
                      <div><strong>Người đại diện pháp luật:</strong> {selectedB2BContract.seller?.rep || 'Nguyễn Văn Hợp'}</div>
                      <div><strong>Chức danh:</strong> {selectedB2BContract.seller?.position || 'Chủ tịch HĐQT'}</div>
                      <div><strong>CMND/CCCD/Hộ chiếu:</strong> {selectedB2BContract.seller?.cccd || '068092004561'}</div>
                      <div><strong>Cấp ngày:</strong> {selectedB2BContract.seller?.cccdDate || '15/08/2021'} (tại {selectedB2BContract.seller?.cccdPlace || 'Cục Cảnh sát QLHC'})</div>
                      <div><strong>Số điện thoại:</strong> {selectedB2BContract.seller?.phone || '0988777666'}</div>
                      <div><strong>Fax:</strong> {selectedB2BContract.seller?.fax || '02633 847 112'}</div>
                      <div className="md:col-span-2"><strong>Tài khoản ngân hàng số:</strong> {selectedB2BContract.seller?.bankAcc || '999988887777'} <strong>Mở tại ngân hàng:</strong> {selectedB2BContract.seller?.bankName || 'Agribank Lâm Đồng'}</div>
                    </div>
                  </div>

                  {/* Bên Mua */}
                  <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-3">
                    <div className="font-bold text-indigo-700 uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      BÊN MUA (Bên B)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700 leading-normal">
                      <div className="md:col-span-2"><strong>Tên doanh nghiệp:</strong> {selectedB2BContract.buyer?.name || selectedB2BContract.enterpriseName}</div>
                      <div className="md:col-span-2"><strong>Mã số doanh nghiệp:</strong> {selectedB2BContract.buyer?.taxCode || '0312345678'}</div>
                      <div className="md:col-span-2"><strong>Địa chỉ trụ sở chính:</strong> {selectedB2BContract.buyer?.address || '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'}</div>
                      <div><strong>Người đại diện pháp luật:</strong> {selectedB2BContract.buyer?.rep || 'Trần Văn Bảo'}</div>
                      <div><strong>Chức danh:</strong> {selectedB2BContract.buyer?.position || 'Giám đốc thu mua'}</div>
                      <div><strong>CMND/CCCD/Hộ chiếu:</strong> {selectedB2BContract.buyer?.cccd || '079093004455'}</div>
                      <div><strong>Cấp ngày:</strong> {selectedB2BContract.buyer?.cccdDate || '20/10/2020'} (tại {selectedB2BContract.buyer?.cccdPlace || 'Cục Cảnh sát QLHC'})</div>
                      <div><strong>Số điện thoại:</strong> {selectedB2BContract.buyer?.phone || '0912345678'}</div>
                      <div><strong>Fax:</strong> {selectedB2BContract.buyer?.fax || '02838 123 456'}</div>
                      <div className="md:col-span-2"><strong>Tài khoản ngân hàng số:</strong> {selectedB2BContract.buyer?.bankAcc || '1029384756'} <strong>Mở tại ngân hàng:</strong> {selectedB2BContract.buyer?.bankName || 'Vietcombank'}</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-justify pt-3">
                  Trên cơ sở thỏa thuận hoàn toàn tự nguyện, hai bên thống nhất ký kết hợp đồng mua bán hàng hóa với các điều khoản như sau:
                </p>

                {/* ALL 9 ARTICLES (ĐIỀU KHOẢN) DETAILED EXPLICITLY */}
                <div className="space-y-6 font-serif text-[13.5px]">
                  
                  {/* Điều 1 */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 border-b pb-1">Điều 1: Tên hàng hóa, số lượng, chất lượng, giá trị hợp đồng</h5>
                    <p className="text-justify text-xs text-slate-600">Bên A bán cho bên B hàng hóa sau đây:</p>
                    <div className="border border-slate-200 rounded-xl overflow-hidden font-sans">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-3 font-bold text-slate-700 text-center w-[8%]">STT</th>
                            <th className="p-3 font-bold text-slate-700">Tên Hàng Hóa</th>
                            <th className="p-3 font-bold text-slate-700 text-center">Đơn vị</th>
                            <th className="p-3 font-bold text-slate-700 text-center">Số lượng</th>
                            <th className="p-3 font-bold text-slate-700 text-right">Đơn giá (VNĐ)</th>
                            <th className="p-3 font-bold text-slate-700 text-right">Thành tiền (VNĐ)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="p-3 text-center">1</td>
                            <td className="p-3 font-bold text-slate-800">{selectedB2BContract.cropName}</td>
                            <td className="p-3 text-center">kg</td>
                            <td className="p-3 text-center font-bold text-slate-900">{selectedB2BContract.totalVolume}</td>
                            <td className="p-3 text-right">{selectedB2BContract.unitPrice?.split(' ')[0]}</td>
                            <td className="p-3 text-right font-black text-forest">{(selectedB2BContract.totalVal || 0).toLocaleString('vi-VN')} VNĐ</td>
                          </tr>
                          <tr className="bg-slate-50/50">
                            <td className="p-3 text-center">2</td>
                            <td className="p-3 text-slate-400">---</td>
                            <td className="p-3 text-center text-slate-400">---</td>
                            <td className="p-3 text-center text-slate-400">---</td>
                            <td className="p-3 text-right text-slate-400">---</td>
                            <td className="p-3 text-right text-slate-400">---</td>
                          </tr>
                          <tr className="border-t border-slate-200">
                            <td colSpan={5} className="p-3 text-right font-bold text-slate-700 text-xs">Tổng số tiền cộng cộng:</td>
                            <td className="p-3 text-right font-black text-rose-600">{(selectedB2BContract.totalVal || 0).toLocaleString('vi-VN')} VNĐ</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border text-xs space-y-1 text-slate-700">
                      <p><strong>Tổng cộng bằng tiền:</strong> {selectedB2BContract.totalVal?.toLocaleString('vi-VN')} đồng Việt Nam.</p>
                      <p><strong>Bằng chữ:</strong> <span className="italic font-bold text-slate-900 underline">{docSoTienBangChu(selectedB2BContract.totalVal)}</span></p>
                    </div>
                  </div>

                  {/* Điều 2 */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1">Điều 2: Thanh toán</h5>
                    <div className="text-xs text-slate-700 pl-4 space-y-1">
                      <p>1. Bên B phải thanh toán cho Bên A số tiền ghi tại Điều 1 của Hợp đồng này dứt điểm muộn nhất vào ngày 15 tháng 12 năm 2026.</p>
                      <p>2. Bên B thanh toán cho Bên A theo hình thức: <span className="font-bold underline text-slate-900">{selectedB2BContract.paymentMethod || 'Chuyển khoản liên ngân hàng 24/7'}</span> vào số tài khoản do bên A chỉ định tại hợp đồng.</p>
                      <p>3. Phân kỳ tài chính: Đặt cọc <strong>{selectedB2BContract.paymentPhase1 || '30%'}</strong> trong vòng 03 ngày làm việc sau khi ký số; thanh toán nốt <strong>{selectedB2BContract.paymentPhase2 || '70%'}</strong> sau khi bốc dỡ bàn giao.</p>
                    </div>
                  </div>

                  {/* Điều 3 */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1">Điều 3: Thời gian, địa điểm, phương thức giao hàng</h5>
                    <div className="text-xs text-slate-700 pl-4 space-y-1">
                      <p>1. Bên A giao hàng cho bên B theo lịch giao nông sản định kỳ: <strong>{selectedB2BContract.deliveryTime || 'Thu hoạch và giao nhận trong 15 ngày'}</strong>.</p>
                      <p>2. Địa điểm giao nhận hàng hóa: <span className="underline">{selectedB2BContract.deliveryLocation || 'Kho bãi vật lý bên Bán (Lâm Đồng)'}</span>.</p>
                      <p>3. Phương tiện vận chuyển và chi phí vận chuyển do bên <span className="font-bold underline">Bên B</span> chịu. Chi phí bốc xếp hai bên phối hợp bàn giao tại đầu kho.</p>
                      <p>4. Quy định lịch giao nhận hàng hóa mà bên mua không đến nhận hàng thì phải chịu chi phí lưu kho bãi là 1.000.000 đồng/ngày. Nếu phương tiện vận chuyển bên mua đến mà bên bán không có hàng giao thì bên bán phải chịu chi phí thực tế cho việc điều động phương tiện.</p>
                      <p>5. Khi nhận hàng, bên mua có trách nhiệm kiểm nhận phẩm chất, quy cách hàng hóa tại chỗ. Nếu phát hiện hàng thiếu hoặc không đúng tiêu chuẩn chất lượng v.v… thì lập biên bản tại chỗ, yêu cầu bên bán xác nhận. Hàng đã ra khỏi kho bên bán không chịu trách nhiệm (trừ loại hàng có quy định thời hạn bảo hành).</p>
                    </div>
                  </div>

                  {/* Điều 4 */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1">Điều 4: Trách nhiệm của các bên</h5>
                    <div className="text-xs text-slate-700 pl-4 space-y-1">
                      <p>1. Bên bán không chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá nếu vào thời điểm giao kết hợp đồng bên mua đã biết hoặc phải biết về những khiếm khuyết đó;</p>
                      <p>2. Trừ trường hợp quy định tại khoản 1 Điều này, trong thời hạn khiếu nại theo quy định của Luật thương mại năm 2005, bên bán phải chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá đã có trước thời điểm chuyển rủi ro cho bên mua, kể cả trường hợp khiếm khuyết đó được phát hiện sau thời điểm chuyển rủi ro;</p>
                      <p>3. Bên bán phải chịu trách nhiệm về khiếm khuyết của hàng hóa phát sinh sau thời điểm chuyển rủi ro nếu khiếm khuyết đó do bên bán vi phạm hợp đồng.</p>
                      <p>4. Bên mua có trách nhiệm thanh toán và nhận hàng theo đúng thời gian đã thỏa thuận.</p>
                    </div>
                  </div>

                  {/* Điều 5 */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1">Điều 5: Bảo hành và hướng dẫn sử dụng hàng hóa</h5>
                    <div className="text-xs text-slate-700 pl-4 space-y-1">
                      <p>1. Bên A có trách nhiệm bảo hành chất lượng hàng nông sản sạch cho bên mua trong suốt quá trình vận tải đóng gói trong thời gian quy định.</p>
                      <p>2. Bên A phải cung cấp đủ phiếu xuất kho, phiếu kiểm nghiệm chỉ tiêu hữu cơ, CO/CQ hướng dẫn quy cách dán nhãn của cơ quan hải quan (nếu cần).</p>
                    </div>
                  </div>

                  {/* Điều 6 */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1">Điều 6: Ngưng thanh toán tiền mua hàng</h5>
                    <div className="text-xs text-slate-700 pl-4 space-y-1">
                      <p>1. Bên B có bằng chứng về việc bên A lừa dối thì có quyền tạm ngừng việc thanh toán;</p>
                      <p>2. Bên B có bằng chứng về việc hàng hóa đang là đối tượng bị tranh chấp thì có quyền tạm ngừng thanh toán cho đến khi việc tranh chấp đã được giải quyết;</p>
                      <p>3. Bên B có bằng chứng về việc bên A đã giao hàng không phù hợp với hợp đồng thì có quyền tạm ngừng thanh toán cho đến khi bên A đã khắc phục sự không phù hợp đó;</p>
                      <p>4. Trường hợp tạm ngừng thanh toán mà bằng chứng do bên B đưa ra không xác thực, gây thiệt hại cho bên A thì bên B phải bồi thường thiệt hại đó và chịu các chế tài khác theo luật định.</p>
                    </div>
                  </div>

                  {/* Điều 7 */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1">Điều 7: Điều khoản phạt vi phạm hợp đồng</h5>
                    <div className="text-xs text-slate-700 pl-4 space-y-1">
                      <p>1. Hai bên cam kết thực hiện nghiêm túc các điều khoản đã thỏa thuận trên, không được đơn phương thay đổi hoặc hủy bỏ hợp đồng, bên nào không thực hiện hoặc đơn phương đình chỉ thực hiện hợp đồng mà không có lý do chính đáng thì sẽ bị phạt tới <strong className="font-bold">8%</strong> giá trị của hợp đồng bị vi phạm.</p>
                      <p>2. Bên nào vi phạm các điều khoản trên đây sẽ phải chịu trách nhiệm vật chất theo quy định đối với bất cứ hành vi cố ý phá vỡ liên kết thương mại.</p>
                    </div>
                  </div>

                  {/* Điều 8 */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1">Điều 8: Bất khả kháng và giải quyết tranh chấp</h5>
                    <div className="text-xs text-slate-700 pl-4 space-y-1">
                      <p>1. Bất khả kháng nghĩa là các sự kiện xảy ra một cách khách quan, không thể lường trước được và không thể khắc phục được mặc dù đã áp dụng mọi biện pháp cần thiết trong khả năng cho phép.</p>
                      <p>2. Khi xảy ra sự kiện bất khả kháng, bên gặp phải bất khả kháng phải thông báo ngay cho bên kia trong vòng 24 giờ kể từ khi sự việc phát sinh.</p>
                      <p>3. Mọi tranh chấp phát sinh sẽ được hai bên hòa giải thương lượng trên tinh thần tôn trọng quyền lợi của nhau. Nếu không thể thương thảo tự thỏa thuận, mọi tranh chấp sẽ được giải quyết tại {selectedB2BContract.disputeResolutionCourt || 'Tòa án nhân dân có thẩm quyền'} theo quy định của Bộ luật Tố tụng Dân sự 2015.</p>
                    </div>
                  </div>

                  {/* Điều 9 */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-slate-900 border-b pb-1">Điều 9: Điều khoản chung</h5>
                    <div className="text-xs text-slate-700 pl-4 space-y-1">
                      <p>1. Hợp đồng này có hiệu lực kể từ ngày ký chữ ký số và tự động thanh lý hợp đồng kể từ khi Bên B đã nhận đủ hàng và Bên A đã nhận đủ tiền.</p>
                      <p>2. Mọi sự bổ sung, sửa đổi hợp đồng này đều phải có sự đồng ý bằng văn bản của hai bên hoặc ký kết phụ lục hợp đồng thương mại điện tử liên kết.</p>
                      <p>3. Hợp đồng được thành lập dưới dạng tệp điện tử PDF định dạng chuẩn lưu trữ quốc gia, có giá trị pháp lý tương đương văn bản giấy thông thường.</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Signature Underlays conforming with state */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-200 font-sans">
                  <div className="text-center w-1/2 flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Đại diện Bên bán (Bên A)</p>
                    {(selectedB2BContract.status === 'pending_super_admin' || selectedB2BContract.status === 'Chờ duyệt') ? (
                      <div className="text-xs italic text-slate-400 py-6 font-sans font-bold">Chưa ký số (Chờ Hợp tác xã ký)</div>
                    ) : (
                      <div className="my-2 border border-rose-500 rounded-xl bg-rose-50/70 p-2 text-center text-[10px] text-rose-600 font-bold max-w-xs relative flex flex-col gap-0.5 shadow-sm">
                        <span className="uppercase text-rose-700 block tracking-wider font-extrabold">ĐÃ KÝ SỐ CA</span>
                        <span className="font-mono">Ký bởi: {selectedB2BContract.seller?.name || 'Chủ Tịch Hợp Tác xã'}</span>
                        <span>Thời gian: {new Date(selectedB2BContract.createdAt || new Date()).toLocaleDateString('vi-VN')}</span>
                        <span className="text-[9px] font-mono text-slate-500 font-normal">Mã sê-ri: Viettel-HSM-902A</span>
                      </div>
                    )}
                    <p className="text-xs font-bold text-slate-700 underline">{selectedB2BContract.seller?.rep || 'Nguyễn Văn Hợp'}</p>
                  </div>

                  <div className="text-center w-1/2 flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Đại diện Bên mua (Bên B)</p>
                    {(selectedB2BContract.status === 'signed' || selectedB2BContract.status === 'completed' || selectedB2BContract.status === 'active') ? (
                      <div className="my-2 border border-emerald-500 rounded-xl bg-emerald-50/70 p-2 text-center text-[10px] text-emerald-600 font-bold max-w-xs relative flex flex-col gap-0.5 shadow-sm">
                        <span className="uppercase text-emerald-700 block tracking-wider font-extrabold">ĐÃ KÝ SỐ DOANH NGHIỆP</span>
                        <span className="font-mono">Ký bởi: {selectedB2BContract.buyer?.name || selectedB2BContract.enterpriseName || 'Doanh nghiệp'}</span>
                        <span>Thời gian: {new Date().toLocaleDateString('vi-VN')}</span>
                        <span className="text-[9px] font-mono text-slate-500 font-normal">Xác thực: FPT-CA-91A2</span>
                      </div>
                    ) : (
                      <div className="text-xs italic text-slate-400 py-6 font-sans font-bold">Chưa ký số (Chờ Doanh nghiệp ký)</div>
                    )}
                    <p className="text-xs font-bold text-slate-700 underline">{selectedB2BContract.buyer?.rep || 'Trần Văn Bảo'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Actions Footer */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-3 border-t border-slate-100 font-sans">
              <button
                type="button"
                onClick={() => {
                  setSelectedB2BContract(null);
                  setSigningStep('idle');
                }}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Đóng lại
              </button>

               {signingStep === 'idle' && (
                (selectedB2BContract.status === 'pending_super_admin' || 
                 selectedB2BContract.status === 'awaiting_admin_signature' || 
                 selectedB2BContract.status === 'Đang chờ ký (Admin)' || 
                 selectedB2BContract.status === 'Đang thực hiện' || 
                 selectedB2BContract.status === 'in_progress') ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        // Mark as rejected
                        const updatedContracts = contracts.map((c: any) => 
                          c.id === selectedB2BContract.id ? { ...c, status: 'Hợp đồng đã bị từ chối' } : c
                        );
                        setContracts(updatedContracts);
                        
                        // Update vietagri_contracts_v2 to persist detailed contract status
                        const rawV2 = localStorage.getItem('vietagri_contracts_v2');
                        if (rawV2) {
                            try {
                                let contractsV2 = JSON.parse(rawV2);
                                contractsV2 = contractsV2.map((c: any) => 
                                    String(c.id) === String(selectedB2BContract.id) ? { ...c, status: 'Hợp đồng đã bị từ chối' } : c
                                );
                                localStorage.setItem('vietagri_contracts_v2', JSON.stringify(contractsV2));
                            } catch (e) { console.error(e); }
                        }
                        
                        setToastMessage('Hợp đồng đã bị từ chối!');
                        setSelectedB2BContract(updatedContracts.find(c => c.id === selectedB2BContract.id));
                      }}
                      className="px-6 py-3.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
                    >
                      {selectedB2BContract.status === 'Hợp đồng đã bị từ chối' ? 'Không phê duyệt hợp đồng' : 'Từ chối'}
                    </button>

                    {selectedB2BContract.status !== 'Hợp đồng đã bị từ chối' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedContracts = contracts.map((c: any) => 
                              c.id === selectedB2BContract.id ? { ...c, status: 'Thương thảo' } : c
                            );
                            setContracts(updatedContracts);
                            
                            // Update vietagri_contracts_v2 to persist detailed contract status
                            const rawV2 = localStorage.getItem('vietagri_contracts_v2');
                            if (rawV2) {
                                try {
                                    let contractsV2 = JSON.parse(rawV2);
                                    contractsV2 = contractsV2.map((c: any) => 
                                        String(c.id) === String(selectedB2BContract.id) ? { ...c, status: 'Thương thảo' } : c
                                    );
                                    localStorage.setItem('vietagri_contracts_v2', JSON.stringify(contractsV2));
                                } catch (e) { console.error(e); }
                            }
                            
                            setToastMessage('Đã chuyển phản hồi thương thảo sửa đổi điều khoản tới đối tác Doanh nghiệp thành công!');
                            setSelectedB2BContract(updatedContracts.find(c => c.id === selectedB2BContract.id));
                          }}
                          className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Thương thảo
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApproveB2BContract(selectedB2BContract.id)}
                          className="px-8 py-3.5 bg-[#004d40] hover:bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-950/20 cursor-pointer flex items-center gap-2"
                        >
                          <CheckCircle2 size={16} /> Phê duyệt & Ký số Hợp đồng
                        </button>
                      </>
                    )}
                  </>
                ) : (selectedB2BContract.status === 'signed' || selectedB2BContract.status === 'completed' || selectedB2BContract.status === 'active') ? (
                  <button
                    type="button"
                    onClick={() => handlePrintB2BContract(selectedB2BContract)}
                    className="px-8 py-3.5 bg-forest hover:bg-[#004d40] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/15 cursor-pointer flex items-center gap-2"
                  >
                    <FileText size={16} /> Tải bản in PDF / Chữ ký số
                  </button>
                ) : selectedB2BContract.status === 'Hợp đồng đã bị từ chối' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedContracts = contracts.filter((c: any) => c.id !== selectedB2BContract.id);
                      setContracts(updatedContracts);
                      localStorage.setItem('vietagri_contracts', JSON.stringify(updatedContracts));
                      
                      const rawV2 = localStorage.getItem('vietagri_contracts_v2');
                      if (rawV2) {
                          try {
                              let contractsV2 = JSON.parse(rawV2);
                              contractsV2 = contractsV2.filter((c: any) => String(c.id) !== String(selectedB2BContract.id));
                              localStorage.setItem('vietagri_contracts_v2', JSON.stringify(contractsV2));
                          } catch (e) {}
                      }
                      
                      setToastMessage('Đã xóa hợp đồng thành công!');
                      setSelectedB2BContract(null);
                    }}
                    className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePrintB2BContract(selectedB2BContract)}
                    className="px-8 py-3.5 bg-forest hover:bg-[#004d40] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/15 cursor-pointer flex items-center gap-2"
                  >
                    <FileText size={16} /> Tải bản in PDF / Chữ ký số
                  </button>
                )
              )}
            </div>
          </motion.div>
        </div>
      )}
      {/* Member Details Modal */}
      {isMemberDetailsModalOpen && selectedMember && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-10 pb-6 shrink-0 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-forest text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-forest">Hồ sơ Chi tiết Xã viên</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {selectedMember.name} • {selectedMember.memberId || selectedMember.id}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsMemberDetailsModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 pt-6 scrollbar-thin scrollbar-thumb-slate-200">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  // Update the local list
                  setStaffAccounts(prev => prev.map(s => (s.id === selectedMember.id || s.memberId === selectedMember.memberId) ? selectedMember : s));
                  setIsMemberDetailsModalOpen(false);
                }}
                className="space-y-12"
              >
                {/* I. Thông tin Định danh Cá nhân */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                    <User size={18} className="text-forest" />
                    <h3 className="text-sm font-black text-forest uppercase tracking-widest">I. Thông tin Định danh Cá nhân</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2 opacity-60">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mã số nông dân (Không thể sửa)</label>
                      <input 
                        disabled
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-100 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-500 cursor-not-allowed"
                        value={selectedMember.memberId || selectedMember.id}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Họ và tên đầy đủ</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.name}
                        onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Ngày, tháng, năm sinh</label>
                      <input 
                        type="text" 
                        placeholder="23/05/1985"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.dob || '15/05/1985'}
                        onChange={(e) => setSelectedMember({ ...selectedMember, dob: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Giới tính</label>
                      <select 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all appearance-none"
                        value={selectedMember.gender || 'Nam'}
                        onChange={(e) => setSelectedMember({ ...selectedMember, gender: e.target.value })}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Quốc tịch</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.nationality || 'Việt Nam'}
                        onChange={(e) => setSelectedMember({ ...selectedMember, nationality: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Địa chỉ thường trú</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.permanentAddress || selectedMember.address || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, permanentAddress: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Địa chỉ liên lạc thực tế</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.contactAddress || selectedMember.address || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, contactAddress: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                {/* II. Giấy tờ Chứng thực Cá nhân */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                    <IdCard size={18} className="text-forest" />
                    <h3 className="text-sm font-black text-forest uppercase tracking-widest">II. Giấy tờ Chứng thực Cá nhân</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số CCCD</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.cccd || selectedMember.idNumber || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, cccd: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Ngày cấp</label>
                      <input 
                        type="text" 
                        placeholder="20/10/2021"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.idDate || '20/10/2021'}
                        onChange={(e) => setSelectedMember({ ...selectedMember, idDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nơi cấp</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.idPlace || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, idPlace: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                {/* III. Thông tin Thành viên & Góp vốn */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                    <Briefcase size={18} className="text-forest" />
                    <h3 className="text-sm font-black text-forest uppercase tracking-widest">III. Thông tin Thành viên & Góp vốn</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Ngày chính thức gia nhập HTX</label>
                      <input 
                        type="text" 
                        placeholder="12/03/2022"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.joiningDate || selectedMember.createdAt || '12/03/2022'}
                        onChange={(e) => setSelectedMember({ ...selectedMember, joiningDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Ngày chấm dứt tư cách thành viên</label>
                      <input 
                        type="text" 
                        placeholder="DD/MM/YYYY"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.terminationDate && selectedMember.terminationDate !== '---' ? selectedMember.terminationDate : ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, terminationDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số vốn góp (VNĐ)</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.capitalContribution || '50000000'}
                        onChange={(e) => setSelectedMember({ ...selectedMember, capitalContribution: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tỷ lệ vốn góp (%)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.capitalRatio || 2.5}
                        onChange={(e) => setSelectedMember({ ...selectedMember, capitalRatio: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Thời điểm thực hiện góp vốn</label>
                      <input 
                        type="text" 
                        placeholder="15/03/2022"
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.contributionDate || '15/03/2022'}
                        onChange={(e) => setSelectedMember({ ...selectedMember, contributionDate: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                {/* IV. Thông tin Liên hệ & Năng lực Sản xuất */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                    <Sprout size={18} className="text-forest" />
                    <h3 className="text-sm font-black text-forest uppercase tracking-widest">IV. Thông tin Liên hệ & Năng lực Sản xuất</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số điện thoại di động</label>
                      <input 
                        type="tel" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.phone}
                        onChange={(e) => setSelectedMember({ ...selectedMember, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.email || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Diện tích đất canh tác (ha)</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.area || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, area: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Vị trí vùng trồng</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.location || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sản phẩm nông sản chính</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.crop || (selectedMember.crops?.[0]?.name) || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, crop: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tiêu chuẩn chất lượng áp dụng</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.qualityStandard || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, qualityStandard: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                {/* V. Thông tin Tài khoản Ngân hàng */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                    <Landmark size={18} className="text-forest" />
                    <h3 className="text-sm font-black text-forest uppercase tracking-widest">V. Thông tin Tài khoản Ngân hàng</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số tài khoản ngân hàng</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.bankAccNumber || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, bankAccNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tên ngân hàng mở tài khoản</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.bankName || ''}
                        onChange={(e) => setSelectedMember({ ...selectedMember, bankName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tên chủ tài khoản</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        value={selectedMember.bankAccHolder || selectedMember.name.toUpperCase()}
                        onChange={(e) => setSelectedMember({ ...selectedMember, bankAccHolder: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                <div className="pt-8 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsMemberDetailsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    className="flex-2 py-4 bg-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20"
                  >
                    Cập nhật hồ sơ nông dân
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-forest">{value}</p>
    </div>
  );
}
