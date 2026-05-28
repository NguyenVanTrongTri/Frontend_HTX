import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  X,
  Globe,
  BarChart3,
  LogOut,
  Bell,
  Settings,
  History,
  Activity,
  Mail,
  User,
  Phone,
  ShieldAlert,
  FileText,
  LayoutList,
  Upload,
  Eye,
  IdCard,
  ArrowRight,
  Navigation,
  Briefcase,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Copy, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import mammoth from 'mammoth';
import authService from '../../services/authService';

const LOCATION_DATA: Record<string, string[]> = {
  "TP. Hồ Chí Minh": ["Quận 1", "Quận 2", "TP. Thủ Đức", "Quận Bình Thạnh"],
  "Hà Nội": ["Quận Hoàn Kiếm", "Quận Ba Đình", "Quận Cầu Giấy"],
  "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà"],
  "Cần Thơ": ["Quận Ninh Kiều", "Quận Cái Răng"],
  "Lâm Đồng": ["TP. Đà Lạt", "Huyện Đức Trọng"]
};

export interface RegionalManagement {
  province: string;
  district: string;
  ward: string;
  htxName: string;
  htxId: string;
  specialty: string;
  adminName: string;
  phone: string;
  status: string;
  activeGisPlots: number;
}

export const REGIONAL_MANAGEMENT_DATA: RegionalManagement[] = [
  { province: 'Lâm Đồng', district: 'TP. Đà Lạt', ward: 'Cầu Đất', htxName: 'HTX Cà phê Cầu Đất', htxId: 'HTX-001', specialty: 'Cà phê Arabica', adminName: 'Nguyễn Văn Cảnh', phone: '0901234568', status: 'Đang hoạt động', activeGisPlots: 450 },
  { province: 'Lâm Đồng', district: 'TP. Đà Lạt', ward: 'Xuân Trường', htxName: 'HTX Hoa Đà Lạt', htxId: 'HTX-002', specialty: 'Hoa tươi ôn đới', adminName: 'Trần Thị Thu Thảo', phone: '0912112233', status: 'Đang hoạt động', activeGisPlots: 280 },
  { province: 'Lâm Đồng', district: 'Huyện Đức Trọng', ward: 'Liên Nghĩa', htxName: 'HTX Nông sản Đức Trọng', htxId: 'HTX-003', specialty: 'Rau củ VietGAP', adminName: 'Phạm Minh Toàn', phone: '0913112244', status: 'Đang hoạt động', activeGisPlots: 390 },
  { province: 'Lâm Đồng', district: 'Huyện Đức Trọng', ward: 'Đầu dòng', htxName: 'HTX Rừng Thông Lâm Đồng', htxId: 'HTX-004', specialty: 'Atiso, Hạt mác ca', adminName: 'Lê Hoàng Dương', phone: '0914112255', status: 'Đang hoạt động', activeGisPlots: 150 },
  { province: 'TP. Hồ Chí Minh', district: 'Quận 1', ward: 'Bến Nghé', htxName: 'HTX Công Nghệ Cao Q1', htxId: 'HTX-005', specialty: 'Rau sạch thủy canh', adminName: 'Vũ Thị Minh', phone: '0915112266', status: 'Đang hoạt động', activeGisPlots: 45 },
  { province: 'TP. Hồ Chí Minh', district: 'Quận Bình Thạnh', ward: 'Phường 22', htxName: 'HTX Bình Thạnh Xanh', htxId: 'HTX-006', specialty: 'Nông nghiệp hữu cơ', adminName: 'Hoàng Minh Quân', phone: '0916112277', status: 'Đang hoạt động', activeGisPlots: 95 },
  { province: 'Hà Nội', district: 'Quận Ba Đình', ward: 'Cống Vị', htxName: 'HTX Ba Đình Organic', htxId: 'HTX-007', specialty: 'Rau VietGAP, Củ quả', adminName: 'Ngô Việt Hùng', phone: '0917112288', status: 'Đang hoạt động', activeGisPlots: 120 },
  { province: 'Đà Nẵng', district: 'Quận Hải Châu', ward: 'Hòa Cường', htxName: 'HTX Hải Châu Nông Sản', htxId: 'HTX-008', specialty: 'Hải sản cấp đông', adminName: 'Đỗ Tiến Đạt', phone: '0918112299', status: 'Đang hoạt động', activeGisPlots: 110 },
  { province: 'Hà Nội', district: 'Quận Cầu Giấy', ward: 'Dịch Vọng', htxName: 'HTX Cầu Giấy Xanh', htxId: 'HTX-009', specialty: 'Sản xuất rau hữu cơ', adminName: 'Phùng Chí Công', phone: '0919112200', status: 'Đang hoạt động', activeGisPlots: 80 },
  { province: 'Đà Nẵng', district: 'Quận Thanh Khê', ward: 'Phần Lăng', htxName: 'HTX Thanh Khê Hải Sản', htxId: 'HTX-010', specialty: 'Hải sản khô cao cấp', adminName: 'Đặng Ngọc Minh', phone: '0920112211', status: 'Đang hoạt động', activeGisPlots: 60 },
  { province: 'Cần Thơ', district: 'Quận Ninh Kiều', ward: 'Xuân Khánh', htxName: 'HTX Ninh Kiều Nông Sản', htxId: 'HTX-011', specialty: 'Trái cây nhiệt đới', adminName: 'Phan Văn Phong', phone: '0921112222', status: 'Đang hoạt động', activeGisPlots: 310 },
  { province: 'TP. Hồ Chí Minh', district: 'Quận 2', ward: 'Thạnh Mỹ Lợi', htxName: 'HTX Nông nghiệp Quận 2', htxId: 'HTX-012', specialty: 'Trái cây xuất khẩu', adminName: 'Nguyễn Tiến Dũng', phone: '0922112233', status: 'Đang hoạt động', activeGisPlots: 75 },
  { province: 'TP. Hồ Chí Minh', district: 'TP. Thủ Đức', ward: 'Linh Trung', htxName: 'HTX Công nghệ Thủ Đức', htxId: 'HTX-013', specialty: 'Nông nghiệp thông minh', adminName: 'Tô Văn Tuấn', phone: '0923112244', status: 'Đang hoạt động', activeGisPlots: 115 },
  { province: 'Hà Nội', district: 'Quận Hoàn Kiếm', ward: 'Tràng Tiền', htxName: 'HTX Hoàn Kiếm Nông Sản', htxId: 'HTX-014', specialty: 'Trà thảo mộc & Thảo dược', adminName: 'Bùi Thị Hà', phone: '0924112255', status: 'Đang hoạt động', activeGisPlots: 30 },
  { province: 'Đà Nẵng', district: 'Quận Sơn Trà', ward: 'Thọ Quang', htxName: 'HTX Sơn Trà Hải Sản', htxId: 'HTX-015', specialty: 'Chế biến thủy hải sản', adminName: 'Lương Văn Hải', phone: '0925112266', status: 'Đang hoạt động', activeGisPlots: 190 },
  { province: 'Cần Thơ', district: 'Quận Cái Răng', ward: 'Thường Thạnh', htxName: 'HTX Cái Răng Nông Sản', htxId: 'HTX-016', specialty: 'Lúa gạo sạch, Trái cây', adminName: 'Hương Thế Linh', phone: '0926112277', status: 'Đang hoạt động', activeGisPlots: 550 },
];

interface Cooperative {
  id: string;
  name: string;
  taxCode: string;
  legalRep: string;
  position: string;
  location: string;
  province?: string;
  ward?: string;
  address?: string;
  members: number;
  totalArea: number;
  specialty: string;
  qualityStandards: string[];
  adminEmail: string;
  phone: string;
  bankAccount: string;
  bankName: string;
  bankBranch: string;
  establishedDate: string;
  status: 'active' | 'pending' | 'suspended';
  // Legal Representative Profile
  legalRepDob?: string;
  legalRepGender?: string;
  legalRepNationality?: string;
  legalRepIdType?: string;
  legalRepIdNumber?: string;
  legalRepIdDate?: string;
  legalRepIdPlace?: string;
  legalRepAddress?: string;
  legalRepPersonalEmail?: string;
  legalRepCapitalRatio?: number;
  legalRepForm?: string;
  legalRepAttachment?: string;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cooperatives' | 'settings' | 'logs' | 'statistics' | 'locations' | 'accounts' | 'contracts' | 'permissions' | 'policies' | 'categories'>('cooperatives');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('Tất cả');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [activePolicyItem, setActivePolicyItem] = useState('Vùng trồng GIS');
  const [policyFiles, setPolicyFiles] = useState<Record<string, string>>({});
  const [policyContents, setPolicyContents] = useState<Record<string, string>>({});
  const [isSavingPolicy, setIsSavingPolicy] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isEditingPolicy, setIsEditingPolicy] = useState(true);
  
  // Load saved policies on mount
  useEffect(() => {
    const saved = localStorage.getItem('vietagri_policies');
    if (saved) {
      try {
        setPolicyContents(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading policies", e);
      }
    }
  }, []);

  const [cooperatives, setCooperatives] = useState<Cooperative[]>([
    { 
      id: 'HTX-001', 
      name: 'HTX Cà phê Cầu Đất', 
      taxCode: '5800123456',
      legalRep: 'Nguyễn Văn An',
      position: 'Chủ tịch',
      location: '123 Thôn Cầu Đất, Cầu Đất, TP. Đà Lạt, Lâm Đồng', 
      province: 'Lâm Đồng',
      ward: 'TP. Đà Lạt',
      address: '123 Thôn Cầu Đất',
      members: 125, 
      totalArea: 150,
      specialty: 'Cà phê Arabica', 
      qualityStandards: ['VietGAP', 'Hữu cơ'],
      adminEmail: 'caudat@htx.vn',
      phone: '0912345678',
      bankAccount: '1234567890',
      bankName: 'Vietcombank',
      bankBranch: 'Lâm Đồng',
      establishedDate: '2018-05-12',
      status: 'active'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLegalRepModalOpen, setIsLegalRepModalOpen] = useState(false);
  const [selectedLegalHTX, setSelectedLegalHTX] = useState<Cooperative | null>(null);
  const [editingHTX, setEditingHTX] = useState<Cooperative | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    taxCode: '',
    legalRep: '',
    position: '',
    province: '',
    ward: '',
    address: '',
    members: 0,
    totalArea: 0,
    specialty: '',
    qualityStandards: [] as string[],
    adminEmail: '',
    phone: '',
    bankAccount: '',
    bankName: '',
    bankBranch: '',
    // Legal Rep fields
    legalRepDob: '',
    legalRepGender: 'Nam',
    legalRepNationality: 'Việt Nam',
    legalRepIdType: 'CCCD',
    legalRepIdNumber: '',
    legalRepIdDate: '',
    legalRepIdPlace: '',
    legalRepAddress: '',
    legalRepPersonalEmail: '',
    legalRepCapitalRatio: 0,
    legalRepForm: 'Đại diện theo pháp luật',
    legalRepAttachment: ''
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hợp tác xã này?')) {
      setCooperatives(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (htx: Cooperative) => {
    setEditingHTX(htx);
    
    // Improved parsing for legacy location strings
    let p = htx.province || '';
    let w = htx.ward || '';
    if (!p && htx.location && htx.location.includes(', ')) {
      const parts = htx.location.split(', ');
      if (parts.length >= 2) {
        p = parts[parts.length - 1]; // Last part is usually province
        w = parts[parts.length - 2]; // Second to last is ward/district
      }
    }

    setFormData({
      name: htx.name,
      taxCode: htx.taxCode || '',
      legalRep: htx.legalRep || '',
      position: htx.position || '',
      province: p,
      ward: w,
      address: htx.address || '',
      members: htx.members,
      totalArea: htx.totalArea || 0,
      specialty: htx.specialty,
      qualityStandards: htx.qualityStandards || [],
      adminEmail: htx.adminEmail,
      phone: htx.phone || '',
      bankAccount: htx.bankAccount || '',
      bankName: htx.bankName || '',
      bankBranch: htx.bankBranch || '',
      // Legal Rep fields
      legalRepDob: htx.legalRepDob || '',
      legalRepGender: htx.legalRepGender || 'Nam',
      legalRepNationality: htx.legalRepNationality || 'Việt Nam',
      legalRepIdType: htx.legalRepIdType || 'CCCD',
      legalRepIdNumber: htx.legalRepIdNumber || '',
      legalRepIdDate: htx.legalRepIdDate || '',
      legalRepIdPlace: htx.legalRepIdPlace || '',
      legalRepAddress: htx.legalRepAddress || '',
      legalRepPersonalEmail: htx.legalRepPersonalEmail || '',
      legalRepCapitalRatio: htx.legalRepCapitalRatio || 0,
      legalRepForm: htx.legalRepForm || 'Đại diện theo pháp luật',
      legalRepAttachment: htx.legalRepAttachment || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingHTX(null);
    setFormData({ 
      name: '', 
      taxCode: '',
      legalRep: '',
      position: '',
      province: '', 
      ward: '', 
      address: '', 
      members: 0, 
      totalArea: 0,
      specialty: '', 
      qualityStandards: [],
      adminEmail: '',
      phone: '',
      bankAccount: '',
      bankName: '',
      bankBranch: '',
      // Legal Rep fields
      legalRepDob: '',
      legalRepGender: 'Nam',
      legalRepNationality: 'Việt Nam',
      legalRepIdType: 'CCCD',
      legalRepIdNumber: '',
      legalRepIdDate: '',
      legalRepIdPlace: '',
      legalRepAddress: '',
      legalRepPersonalEmail: '',
      legalRepCapitalRatio: 0,
      legalRepForm: 'Đại diện theo pháp luật',
      legalRepAttachment: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locationString = `${formData.address}${formData.address ? ', ' : ''}${formData.ward}, ${formData.province}`;
    const dataToSave = { ...formData, location: locationString };

    if (editingHTX) {
      setCooperatives(prev => prev.map(c => c.id === editingHTX.id ? { ...c, ...dataToSave } : c));
    } else {
      const newHTX: Cooperative = {
        id: `HTX-0${cooperatives.length + 1}`,
        ...dataToSave,
        establishedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setCooperatives(prev => [...prev, newHTX]);
    }
    setIsModalOpen(false);
  };

  const handleSavePolicy = () => {
    setIsSavingPolicy(true);
    
    // Save to localStorage
    const currentContent = policyContents[activePolicyItem] || `Nội dung thiết lập và quy định của ${activePolicyItem}. Các chính sách và điều khoản có thể được cập nhật tại đây và sẽ được đồng bộ trên toàn bộ hệ sinh thái VietAgri. \n\nPhiên bản hiện tại: v1.0.3`;
    const updatedPolicies = {
      ...policyContents,
      [activePolicyItem]: currentContent
    };
    
    setPolicyContents(updatedPolicies);
    localStorage.setItem('vietagri_policies', JSON.stringify(updatedPolicies));

    setTimeout(() => {
      setIsSavingPolicy(false);
      setShowSaveSuccess(true);
      setIsEditingPolicy(false);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 800);
  };

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [adminCoopSearch, setAdminCoopSearch] = useState('');
  const [adminProvinceFilter, setAdminProvinceFilter] = useState('Tất cả');

  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin1',
    province: '',
    district: '',
    cooperativeId: '',
    cccd: ''
  });

  const [viewAllType, setViewAllType] = useState<'pending' | 'active' | 'contracts' | 'pending-contracts' | 'active-contracts' | null>(null);
  const [selectedEnterprise, setSelectedEnterprise] = useState<any | null>(null);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);

  const getModalTitle = () => {
    switch (viewAllType) {
      case 'pending': return 'Phê duyệt Đối tác Doanh nghiệp';
      case 'pending-contracts': return 'Phê duyệt Hợp đồng Hệ thống';
      case 'active': return 'Danh sách Đối tác Hoạt động';
      case 'active-contracts': return 'Danh sách Hợp đồng Hiệu lực';
      case 'contracts': return 'Tất cả Hợp đồng Toàn hệ thống';
      default: return 'Danh sách Chi tiết';
    }
  };

  // Role Management State
  const [roleAdmins, setRoleAdmins] = useState<any[]>(() => {
    const saved = localStorage.getItem('vietagri_role_admins');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'ADM-001', name: 'Nguyễn Văn Cảnh', username: 'canhnv_da', coopName: 'HTX Cà phê Cầu Đất', status: 'active', scope: ['inventory', 'customers', 'contracts'], is2FA: true },
      { id: 'ADM-002', name: 'Trần Thị Thu Thảo', username: 'thaottt_da', coopName: 'HTX Hoa Đà Lạt', status: 'banned', scope: ['hr'], is2FA: false },
      { id: 'ADM-003', name: 'Phạm Minh Toàn', username: 'toanpm_da', coopName: 'HTX Nông sản Đức Trọng', status: 'active', scope: ['inventory', 'crm'], is2FA: true },
    ];
  });

  // Sync roleAdmins to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vietagri_role_admins', JSON.stringify(roleAdmins));
  }, [roleAdmins]);
  const [selectedRoleAdmin, setSelectedRoleAdmin] = useState<any | null>(null);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');

  const [contractSearchTerm, setContractSearchTerm] = useState('');

  const [pendingEnterprises, setPendingEnterprises] = useState<any[]>(() => {
    const raw = localStorage.getItem('vietagri_pending_enterprises_v2');
    if (raw) return JSON.parse(raw);
    return [
      { id: 'ENT-001', name: 'Công ty Cổ phần Nông Sản Sạch Việt Nam', taxCode: '0101234567', representative: 'Nguyễn Thanh Tùng', phone: '0901234567', email: 'contact@nssvn.com', industry: 'Thu mua nông sản', status: 'pending', createdAt: new Date().toISOString() },
      { id: 'ENT-002', name: 'Tập đoàn ABC Foods', taxCode: '0309876543', representative: 'Lê Thu Hà', phone: '0987654321', email: 'info@abcfoods.vn', industry: 'Chế biến thực phẩm', status: 'pending', createdAt: new Date().toISOString() },
      { id: 'ENT-004', name: 'Công ty TNHH GreenFarm', taxCode: '0102123456', representative: 'Trần Văn Minh', phone: '0931234567', email: 'hello@greenfarm.co', industry: 'Thu mua nông sản', status: 'pending', createdAt: new Date().toISOString() }
    ];
  });
  
  const [activeEnterprises, setActiveEnterprises] = useState<any[]>(() => {
    const raw = localStorage.getItem('vietagri_active_enterprises');
    if (raw) return JSON.parse(raw);
    return [
      { id: 'ENT-003', name: 'Công ty TNHH Xuất Nhập Khẩu VinaFruit', taxCode: '0312345678', representative: 'Trần Văn Bảo', phone: '0912345678', email: 'sales@vinafruit.com', industry: 'Xuất nhập khẩu', status: 'active', approvedAt: new Date().toISOString() },
      { id: 'ENT-006', name: 'Dalat Hasfarm', taxCode: '0403332221', representative: 'Lý Quốc Huy', phone: '0978123456', email: 'supply@dalathasfarm.com', industry: 'Hoa tươi & Rau củ', status: 'active', approvedAt: new Date().toISOString() },
      { id: 'ENT-007', name: 'Tập đoàn Lộc Trời', taxCode: '0501112223', representative: 'Ngô Quốc Cường', phone: '0909888777', email: 'procurement@loctroi.vn', industry: 'Xuất khẩu gạo', status: 'active', approvedAt: new Date().toISOString() },
      { id: 'ENT-008', name: 'Vissan JSC', taxCode: '0304445557', representative: 'Nguyễn Thị Hoa', phone: '0988777666', email: 'purchasing@vissan.com.vn', industry: 'Chế biến thịt', status: 'active', approvedAt: new Date().toISOString() },
      { id: 'ENT-010', name: 'NutiFood', taxCode: '0222333444', representative: 'Vũ Quốc Minh', phone: '0911222333', email: 'supply@nutifood.vn', industry: 'Thực phẩm dinh dưỡng', status: 'active', approvedAt: new Date().toISOString() }
    ];
  });

  const [contracts, setContracts] = useState<any[]>(() => {
    const raw = localStorage.getItem('vietagri_contracts_v2');
    if (raw) return JSON.parse(raw);
    return [
      { id: 'CT-102934', enterpriseName: 'Công ty Cổ phần Nông Sản Sạch Việt Nam', taxCode: '0101234567', coopName: 'HTX Cà phê Cầu Đất', product: 'P-001', cropName: 'Cà phê Arabica', totalVolume: '10 Tấn', unitPrice: '85,000 VND / kg', status: 'pending_super_admin', createdAt: new Date().toISOString() },
      { id: 'CT-938475', enterpriseName: 'Công ty TNHH Xuất Nhập Khẩu VinaFruit', taxCode: '0312345678', coopName: 'HTX Nông Nghiệp Đắk Lắk', product: 'P-002', cropName: 'Sầu riêng Ri6', totalVolume: '50 Tấn', unitPrice: '120,000 VND / kg', status: 'active', createdAt: new Date().toISOString() },
      { id: 'CT-234901', enterpriseName: 'Dalat Hasfarm', taxCode: '0403332221', coopName: 'HTX Đơn Dương', product: 'P-003', cropName: 'Cà chua Beef', totalVolume: '20 Tấn', unitPrice: '25,000 VND / kg', status: 'active', createdAt: new Date().toISOString() },
      { id: 'CT-834922', enterpriseName: 'Tập đoàn Lộc Trời', taxCode: '0501112223', coopName: 'HTX Vĩnh Bình', product: 'P-004', cropName: 'Gạo ST25', totalVolume: '500 Tấn', unitPrice: '28,000 VND / kg', status: 'pending_super_admin', createdAt: new Date().toISOString() },
      { id: 'CT-230911', enterpriseName: 'Vissan JSC', taxCode: '0304445557', coopName: 'HTX Phước An', product: 'P-005', cropName: 'Bò hơi', totalVolume: '30 Tấn', unitPrice: '85,000 VND / kg', status: 'active', createdAt: new Date().toISOString() },
      { id: 'CT-554412', enterpriseName: 'VinEco Retail', taxCode: '0314445556', coopName: 'HTX Rau Ứng Dụng CNC', product: 'P-006', cropName: 'Rau Thuỷ Canh', totalVolume: '5 Tấn', unitPrice: '35,000 VND / kg', status: 'pending_super_admin', createdAt: new Date().toISOString() }
    ];
  });

  useEffect(() => {
    // Only update if not already set by init functions
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 15000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const approveEnterprise = (id: string) => {
    const ent = pendingEnterprises.find(e => e.id === id);
    if (!ent) return;

    const tempPassword = '123456';

    const newActive = [
      {
        ...ent,
        status: 'active',
        approvedAt: new Date().toISOString(),
        tempPassword
      },
      ...activeEnterprises
    ];
    
    // Register as a user for system login
    const usersRaw = localStorage.getItem('registered_admins');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const newUser = {
      name: ent.name,
      email: ent.email,
      phone: ent.phone,
      username: ent.phone,
      role: 'enterprise',
      password: tempPassword,
      taxCode: ent.taxCode,
      id: ent.id,
      passwordChanged: false
    };
    localStorage.setItem('registered_admins', JSON.stringify([...users, newUser]));
    
    const newPending = pendingEnterprises.filter(e => e.id !== id);
    
    setPendingEnterprises(newPending);
    setActiveEnterprises(newActive);
    
    localStorage.setItem('vietagri_pending_enterprises_v2', JSON.stringify(newPending));
    localStorage.setItem('vietagri_active_enterprises', JSON.stringify(newActive));
    
    // Clear any previous message first
    setStatusMessage(null);
    
    // Show a more descriptive success toast with the password after a tiny delay to trigger animation
    setTimeout(() => {
      setStatusMessage({ 
        type: 'success', 
        text: `Đã phê duyệt ${ent.name}! Hệ thống đã cấp mật khẩu: ${tempPassword}. Vui lòng gửi thông tin này cho đối tác qua email ${ent.email}.` 
      });
    }, 100);
  };

  const rejectEnterprise = (id: string) => {
    const newPending = pendingEnterprises.filter(e => e.id !== id);
    setPendingEnterprises(newPending);
    localStorage.setItem('vietagri_pending_enterprises_v2', JSON.stringify(newPending));
    setStatusMessage({ type: 'success', text: `Đã từ chối đơn đăng ký doanh nghiệp.` });
  };

  const approveContract = (id: string) => {
    const updatedContracts = contracts.map(c => 
      c.id === id ? { ...c, status: 'active' } : c
    );
    setContracts(updatedContracts);
    localStorage.setItem('vietagri_contracts_v2', JSON.stringify(updatedContracts));
    setStatusMessage({ type: 'success', text: `Đã phê duyệt hợp đồng ${id}.` });
  };

  const rejectContract = (id: string) => {
    const updatedContracts = contracts.map(c => 
      c.id === id ? { ...c, status: 'rejected_super_admin' } : c
    );
    setContracts(updatedContracts);
    localStorage.setItem('vietagri_contracts_v2', JSON.stringify(updatedContracts));
    setStatusMessage({ type: 'success', text: `Đã từ chối hợp đồng ${id}.` });
  };

  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminFormData.cooperativeId) {
        setStatusMessage({ type: 'error', text: 'Vui lòng chọn HTX trực thuộc!' });
        return;
    }
    try {
      const adminData = {
        ...adminFormData,
        password: '123456'
      };
      await authService.registerAdmin(adminData);
      
      // Sync with roleAdmins list
      const selectedCoop = cooperatives.find(c => c.id === adminFormData.cooperativeId);
      const newAdminRole = {
        id: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
        name: adminFormData.name,
        username: adminFormData.email.split('@')[0], // Using email prefix as username
        coopName: selectedCoop ? selectedCoop.name : 'Unknown',
        status: 'active',
        scope: ['inventory'], // Default scope
        is2FA: false
      };
      
      setRoleAdmins(prev => [newAdminRole, ...prev]);
      
      setStatusMessage({ type: 'success', text: 'Cấp tài khoản Admin thành công! Mật khẩu tạm: 123456' });
      setAdminFormData({ name: '', email: '', phone: '', role: 'admin1', province: '', district: '', cooperativeId: '', cccd: '' });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Có lỗi xảy ra khi cấp tài khoản, vui lòng thử lại.' });
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const filteredHTX = cooperatives.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let statsToRender = [
    { title: 'Tổng số HTX', value: cooperatives.length.toString(), icon: <Building2 size={20} />, color: 'bg-blue-500' },
    { title: 'Tổng nông dân', value: cooperatives.reduce((acc, c) => acc + c.members, 0).toLocaleString(), icon: <Users size={20} />, color: 'bg-forest' },
    { title: 'Vùng cấp phép', value: '12', icon: <Globe size={20} />, color: 'bg-amber' },
    { title: 'Tỉ lệ hoạt động', value: '98.5%', icon: <Activity size={20} />, color: 'bg-mint' },
  ];

  if (activeTab === 'contracts') {
    statsToRender = [
      { title: 'Tổng Đối Tác Doanh Nghiệp', value: (pendingEnterprises.length + activeEnterprises.length).toString(), icon: <Building2 size={20} />, color: 'bg-blue-500' },
      { title: 'Đối Tác Hoạt Động', value: activeEnterprises.length.toString(), icon: <Briefcase size={20} />, color: 'bg-mint' },
      { title: 'Tổng Số Hợp Đồng', value: contracts.length.toString(), icon: <History size={20} />, color: 'bg-forest' },
      { title: 'Hợp Đồng Hiệu Lực', value: contracts.filter(c => c.status === 'active' || c.status === 'signed').length.toString(), icon: <CheckCircle2 size={20} />, color: 'bg-emerald-500' },
    ];
  }

  const handleSaveLegalRep = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLegalHTX) {
      setCooperatives(prev => prev.map(c => c.id === selectedLegalHTX.id ? selectedLegalHTX : c));
      setIsLegalRepModalOpen(false);
      setSelectedLegalHTX(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Matching Admin Design */}
      <aside className="w-72 bg-forest text-white hidden lg:flex flex-col h-screen sticky top-0 shrink-0 overflow-y-auto">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-forest font-black text-xl">V</span>
            </div>
            <span className="text-xl font-black tracking-widest">VIETAGRI</span>
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <ShieldCheck className="text-mint" size={12} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Super Admin Access</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { id: 'permissions', label: 'Quản lý Phân quyền', icon: <ShieldAlert size={20} /> },
            { id: 'policies', label: 'Chính sách & Điều khoản', icon: <FileText size={20} /> },
            { id: 'categories', label: 'Danh mục dùng chung', icon: <LayoutList size={20} /> },
            { id: 'cooperatives', label: 'Quản lý HTX', icon: <Building2 size={20} /> },
            { id: 'locations', label: 'Quản lý Tỉnh/TP', icon: <MapPin size={20} /> },
            { id: 'accounts', label: 'Cấp tài khoản Admin', icon: <Users size={20} /> },
            { id: 'contracts', label: 'Hợp đồng toàn hệ thống', icon: <History size={20} /> },
            { id: 'statistics', label: 'Thống kê Hệ thống', icon: <BarChart3 size={20} /> },
            { id: 'settings', label: 'Cấu hình Server', icon: <Settings size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-white/10 text-mint' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 font-bold text-sm">
                {item.icon}
                {item.label}
              </div>
              <ChevronRight size={14} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => {
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userRole');
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
        {/* Header - Matching Admin Design */}
        <header className="bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-96">
            <Search className="text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm HTX, mã định danh..." 
              className="bg-transparent outline-none w-full text-sm font-medium" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-forest transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-black">5</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-black text-forest">Root Admin</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hệ thống VietAgri</p>
              </div>
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 font-black border border-amber-500/20">
                SA
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {statsToRender.map((stat) => (
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
                  <p className="text-2xl font-black text-emerald-950">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="space-y-8">
            {activeTab === 'cooperatives' && (
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-emerald-950">Danh sách Hợp tác xã</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quản lý mạng lưới cung ứng toàn quốc</p>
                  </div>
                  <button 
                    onClick={handleOpenAdd}
                    className="bg-emerald-950 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-950/20"
                  >
                    <Plus size={16} /> Thêm HTX Mới
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên HTX</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khu vực</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Xã viên</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHTX.map((htx) => (
                        <tr key={htx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-emerald-950 group-hover:bg-emerald-400 group-hover:text-white transition-all">
                                <Building2 size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-emerald-950 text-sm">{htx.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{htx.specialty}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                              <MapPin size={14} className="text-emerald-400" />
                              {htx.location}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-black text-emerald-950">
                            {htx.members}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-end gap-2 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedLegalHTX(htx);
                                  setIsLegalRepModalOpen(true);
                                }}
                                className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                                title="Xem Người đại diện"
                              >
                                <IdCard size={14} />
                              </button>
                              <button 
                                onClick={() => handleEdit(htx)}
                                className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-emerald-950 hover:text-white transition-all"
                                title="Chỉnh sửa HTX"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => handleDelete(htx.id)}
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                title="Xóa HTX"
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
            )}

            {activeTab === 'policies' && (
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Policies Sidebar */}
                <div className="w-full md:w-80 bg-slate-50 p-6 border-r border-slate-100 flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-black text-emerald-950 mb-1">Chính sách & Điều khoản</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tương tác hệ sinh thái</p>
                  </div>
                  
                  <div className="space-y-6 overflow-y-auto">
                    {[
                      {
                        title: 'Hệ sinh thái',
                        items: ['Vùng trồng GIS', 'Chuỗi cung ứng', 'Nông sản', 'Dự báo khí hậu']
                      },
                      {
                        title: 'Hợp tác xã',
                        items: ['Chính sách nông dân', 'Đào tạo kỹ thuật', 'Hỗ trợ vốn', 'VietGAP/GlobalGAP']
                      },
                      {
                        title: 'Hỗ trợ',
                        items: ['Tài liệu hướng dẫn', 'Câu hỏi thường gặp', 'Chính sách bảo mật', 'Điều khoản sử dụng']
                      }
                    ].map((category, idx) => (
                      <div key={idx}>
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-widest mb-3 pl-2">{category.title}</h4>
                        <div className="space-y-1">
                          {category.items.map((item, itemIdx) => (
                            <button
                              key={itemIdx}
                              onClick={() => {
                              setActivePolicyItem(item);
                              setIsEditingPolicy(true);
                            }}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activePolicyItem === item 
                                  ? 'bg-emerald-950 text-white shadow-md shadow-emerald-950/10' 
                                  : 'text-slate-500 hover:bg-slate-200/50 hover:text-emerald-900'
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies Editor */}
                <div className="flex-1 p-8 flex flex-col bg-white">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                    <div>
                      <h4 className="text-2xl font-black text-emerald-950">{activePolicyItem}</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">Cập nhật nội dung và điều khoản cho hệ thống</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {!isEditingPolicy && (
                        <button 
                          onClick={() => setIsEditingPolicy(true)}
                          className="px-5 py-2.5 bg-forest text-white rounded-xl font-bold text-sm transition-colors hover:bg-forest/90"
                        >
                          Chỉnh sửa
                        </button>
                      )}
                      <label className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors cursor-pointer">
                        <Upload size={18} />
                        Upload file
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              const fileName = file.name;
                              setPolicyFiles({ ...policyFiles, [activePolicyItem]: fileName });
                              
                              const reader = new FileReader();
                              
                              if (fileName.endsWith('.docx')) {
                                reader.onload = async (event) => {
                                  if (event.target?.result) {
                                    try {
                                      const result = await mammoth.extractRawText({ arrayBuffer: event.target.result as ArrayBuffer });
                                      setPolicyContents(prev => ({
                                        ...prev,
                                        [activePolicyItem]: result.value
                                      }));
                                      setIsEditingPolicy(true); // Keep in edit mode so they can review and save
                                    } catch (err) {
                                      console.error("Error parsing Word file:", err);
                                      setPolicyContents(prev => ({
                                        ...prev,
                                        [activePolicyItem]: "Không thể đọc nội dung từ tệp Word này. Vui lòng kiểm tra lại định dạng tệp."
                                      }));
                                      setIsEditingPolicy(true);
                                    }
                                  }
                                };
                                reader.readAsArrayBuffer(file);
                              } else if (fileName.endsWith('.txt')) {
                                reader.onload = (event) => {
                                  setPolicyContents(prev => ({
                                    ...prev,
                                    [activePolicyItem]: event.target?.result as string
                                  }));
                                  setIsEditingPolicy(true); // Keep in edit mode
                                };
                                reader.readAsText(file);
                              } else {
                                // PDF hoặc định dạng khác chưa hỗ trợ parse text trực tiếp trên client một cách đơn giản
                                setPolicyContents({
                                  ...policyContents,
                                  [activePolicyItem]: `Hệ thống đã nhận tệp: ${fileName}\n\nLưu ý: Đối với định dạng PDF, vui lòng sử dụng chức năng xem trực tiếp hoặc nhập nội dung thủ công. Nội dung văn bản pháp lý đang được xử lý...`
                                });
                                setIsEditingPolicy(true);
                              }
                            }
                          }}
                        />
                      </label>
                      <button 
                        onClick={handleSavePolicy}
                        disabled={isSavingPolicy || !isEditingPolicy}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2 ${
                          showSaveSuccess 
                            ? 'bg-green-500 text-white shadow-green-500/20' 
                            : !isEditingPolicy
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                              : 'bg-emerald-400 hover:bg-emerald-500 text-white shadow-emerald-400/20'
                        }`}
                      >
                        {isSavingPolicy ? (
                          'Đang lưu...'
                        ) : showSaveSuccess ? (
                          <>Đã lưu thành công!</>
                        ) : (
                          'Lưu thay đổi'
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    {isEditingPolicy ? (
                      <textarea 
                        className="w-full flex-1 p-6 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-medium text-slate-700 resize-none transition-all leading-relaxed"
                        placeholder={`Nhập nội dung cho ${activePolicyItem}...`}
                        value={policyContents[activePolicyItem] !== undefined ? policyContents[activePolicyItem] : `Nội dung thiết lập và quy định của ${activePolicyItem}. Các chính sách và điều khoản có thể được cập nhật tại đây và sẽ được đồng bộ trên toàn bộ hệ sinh thái VietAgri. \n\nPhiên bản hiện tại: v1.0.3`}
                        onChange={(e) => setPolicyContents({...policyContents, [activePolicyItem]: e.target.value})}
                      ></textarea>
                    ) : (
                      <div className="w-full flex-1 p-8 bg-slate-50/50 border border-slate-100 rounded-2xl overflow-y-auto">
                        <div className="prose prose-slate max-w-none">
                          <div className="whitespace-pre-wrap text-slate-700 font-medium leading-relaxed">
                            {policyContents[activePolicyItem] !== undefined 
                              ? policyContents[activePolicyItem] 
                              : `Nội dung thiết lập và quy định của ${activePolicyItem}. Các chính sách và điều khoản có thể được cập nhật tại đây và sẽ được đồng bộ trên toàn bộ hệ sinh thái VietAgri. \n\nPhiên bản hiện tại: v1.0.3`}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-400 bg-slate-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Đã đồng bộ với hệ thống lúc {new Date().toLocaleTimeString()}
                      </div>
                      <span>Root Admin - Lần sửa cuối: Hôm nay</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form column (Left) */}
                <div className="lg:col-span-5 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 p-8 sm:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Cấp tài khoản Admin mới</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tạo tài khoản quản lý HTX và khu vực phân quyền</p>
                  </div>

                  <form onSubmit={handleRegisterAdmin} className="space-y-6">
                    {/* Section 1: Region & Coop */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">1</div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Thông tin khu vực</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tỉnh / TP</label>
                          <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select 
                              required
                              value={adminFormData.province}
                              onChange={(e) => setAdminFormData({...adminFormData, province: e.target.value, district: '', cooperativeId: ''})}
                              className="w-full pl-8.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none text-xs font-bold text-slate-700 focus:border-emerald-500 appearance-none transition-all"
                            >
                              <option value="">Chọn Tỉnh/TP</option>
                              {Object.keys(LOCATION_DATA).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quận / Huyện</label>
                          <div className="relative">
                            <Navigation size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select 
                              required
                              disabled={!adminFormData.province}
                              value={adminFormData.district}
                              onChange={(e) => setAdminFormData({...adminFormData, district: e.target.value, cooperativeId: ''})}
                              className="w-full pl-8.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none text-xs font-bold text-slate-700 focus:border-emerald-500 appearance-none transition-all disabled:bg-slate-100 disabled:opacity-60"
                            >
                              <option value="">Chọn Quận/Huyện</option>
                              {(LOCATION_DATA[adminFormData.province] || []).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hợp tác xã trực thuộc</label>
                        <select 
                          required
                          disabled={!adminFormData.district}
                          value={adminFormData.cooperativeId}
                          onChange={(e) => setAdminFormData({...adminFormData, cooperativeId: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none text-xs font-bold text-slate-700 focus:border-emerald-500 transition-all disabled:bg-slate-100 disabled:opacity-60"
                        >
                          <option value="">Chọn Hợp tác xã</option>
                          {cooperatives
                            .filter(htx => {
                              const [locDistrict, locProvince] = htx.location.split(',').map(s => s.trim());
                              return locProvince === adminFormData.province && locDistrict === adminFormData.district;
                            })
                            .map(htx => <option key={htx.id} value={htx.id}>{htx.name}</option>)
                          }
                        </select>
                      </div>
                    </div>

                    {/* Section 2: Personal Info */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">2</div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Thông tin cá nhân & Phân quyền</h3>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Họ và tên</label>
                        <div className="relative group">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#059669] transition-colors" />
                          <input type="text" required placeholder="Nguyễn Văn A" value={adminFormData.name} onChange={e => setAdminFormData({...adminFormData, name: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số CCCD</label>
                          <div className="relative group">
                            <IdCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#059669] transition-colors" />
                            <input type="text" required placeholder="0123456789" value={adminFormData.cccd} onChange={e => setAdminFormData({...adminFormData, cccd: e.target.value.replace(/[^0-9]/g, '')})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Điện thoại</label>
                          <div className="relative group">
                            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#059669] transition-colors" />
                            <input type="tel" required placeholder="090 123 4567" value={adminFormData.phone} onChange={e => setAdminFormData({...adminFormData, phone: e.target.value.replace(/[^0-9]/g, '')})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                          <div className="relative group">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#059669] transition-colors" />
                            <input type="email" required placeholder="admin@vietagri.vn" value={adminFormData.email} onChange={e => setAdminFormData({...adminFormData, email: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phân quyền</label>
                          <select value={adminFormData.role} onChange={e => setAdminFormData({...adminFormData, role: e.target.value})} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all">
                            <option value="admin1">Admin số 1</option>
                            <option value="admin2">Admin số 2</option>
                            <option value="admin3">Admin số 3</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full group relative inline-flex items-center justify-center gap-2 rounded-xl bg-[#059669] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-[#047857] hover:-translate-y-0.5 cursor-pointer">
                      Cấp tài khoản Admin
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>
                </div>

                {/* Regional list column (Right) */}
                <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 p-8 sm:p-10 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-emerald-950">Tra cứu nhanh HTX & Địa bàn chi tiết</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Thông tin chi tiết mạng lưới HTX toàn quốc đang hoạt động</p>
                  </div>

                  {/* Filters for fast lookup list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    <div className="relative">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Tìm theo Tên HTX, đặc sản, ID..."
                        value={adminCoopSearch}
                        onChange={(e) => setAdminCoopSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={adminProvinceFilter}
                        onChange={(e) => setAdminProvinceFilter(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                      >
                        <option value="Tất cả">Tất cả các Tỉnh / TP</option>
                        {Array.from(new Set(REGIONAL_MANAGEMENT_DATA.map(r => r.province))).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Lookup Table list */}
                  <div className="overflow-y-auto max-h-[460px] border border-slate-100 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">HTX & Phân vùng địa bàn chi tiết</th>
                          <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {REGIONAL_MANAGEMENT_DATA
                          .filter(r => {
                            const matchesProvince = adminProvinceFilter === 'Tất cả' || r.province === adminProvinceFilter;
                            const matchesQuery = 
                              r.province.toLowerCase().includes(adminCoopSearch.toLowerCase()) ||
                              r.district.toLowerCase().includes(adminCoopSearch.toLowerCase()) ||
                              r.ward.toLowerCase().includes(adminCoopSearch.toLowerCase()) ||
                              r.htxName.toLowerCase().includes(adminCoopSearch.toLowerCase()) ||
                              r.specialty.toLowerCase().includes(adminCoopSearch.toLowerCase()) ||
                              r.htxId.toLowerCase().includes(adminCoopSearch.toLowerCase());
                            return matchesProvince && matchesQuery;
                          })
                          .map((reg, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-5 py-4">
                                <div className="flex items-start gap-2.5">
                                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                                    <Building2 size={15} />
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-[#064e3b] text-xs leading-snug">{reg.htxName}</p>
                                    <p className="text-[10px] text-emerald-600 font-extrabold uppercase mt-0.5 tracking-wider">
                                      Mã HTX: {reg.htxId} • {reg.specialty}
                                    </p>
                                    
                                    <div className="flex items-center gap-1.5 mt-2 text-slate-500 font-bold text-[10px] bg-slate-50 border border-slate-100 px-2 py-1 rounded inline-flex">
                                      <MapPin size={10} className="text-[#059669]" />
                                      <span>{reg.ward}, {reg.district}, {reg.province}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdminFormData({
                                      ...adminFormData,
                                      province: reg.province,
                                      district: reg.district,
                                      cooperativeId: reg.htxId
                                    });
                                  }}
                                  className="px-3.5 py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-black text-[9px] uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                                >
                                  Áp dụng
                                </button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100/50 text-[11px] font-medium text-slate-500 leading-relaxed">
                    💡 <span className="text-[#059669] font-black">Phím tắt nhanh:</span> Chọn HTX ở bảng trên, hệ thống sẽ tự động đồng bộ giá trị <strong className="font-bold text-slate-700">Tỉnh/TP</strong>, <strong className="font-bold text-slate-700">Quận/Huyện</strong>, và <strong className="font-bold text-slate-700">HTX trực thuộc</strong> vào biểu mẫu điền thông tin bên trái.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'locations' && (
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-emerald-950">Danh sách các Hợp tác xã (HTX) & Địa bàn quản lý chi tiết</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hệ thống phân vùng địa bàn và chỉ định Admin phụ trách toàn quốc</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Tỉnh thành filter */}
                    <div className="relative">
                      <select
                        value={selectedProvinceFilter}
                        onChange={(e) => setSelectedProvinceFilter(e.target.value)}
                        className="pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                      >
                        <option value="Tất cả">Tất cả Tỉnh/TP</option>
                        {Array.from(new Set(REGIONAL_MANAGEMENT_DATA.map(r => r.province))).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    
                    {/* Search bar */}
                    <div className="relative">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Tìm kiếm địa bàn, HTX, Admin..."
                        value={locationSearchTerm}
                        onChange={(e) => setLocationSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs transition-all w-64"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khu vực quản lý</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hợp tác xã phụ trách</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin đại diện phụ trách</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Vùng trồng GIS</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REGIONAL_MANAGEMENT_DATA
                        .filter(r => {
                          const matchesFilter = selectedProvinceFilter === 'Tất cả' || r.province === selectedProvinceFilter;
                          const matchesQuery = 
                            r.province.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
                            r.district.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
                            r.ward.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
                            r.htxName.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
                            r.adminName.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
                            r.phone.includes(locationSearchTerm);
                          return matchesFilter && matchesQuery;
                        })
                        .map((reg, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-start gap-2.5">
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                                  <MapPin size={16} />
                                </div>
                                <div>
                                  <p className="font-extrabold text-emerald-950 text-xs">{reg.ward}, {reg.district}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{reg.province}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div>
                                <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                  <Building2 size={13} className="text-slate-400" />
                                  {reg.htxName}
                                </p>
                                <p className="text-[10px] text-emerald-600 font-extrabold uppercase mt-1 bg-emerald-50 inline-block px-1.5 py-0.5 rounded">
                                  ID: {reg.htxId} • {reg.specialty}
                                </p>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div>
                                <p className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                                  <User size={13} className="text-slate-400" />
                                  {reg.adminName}
                                </p>
                                <p className="text-[10px] text-slate-500 font-mono font-bold mt-1">
                                  SĐT: <span className="text-emerald-700 font-extrabold bg-[#e6fbf4] px-1.5 py-0.5 rounded">{reg.phone}</span>
                                </p>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <span className="font-black text-slate-800 text-xs bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                {reg.activeGisPlots}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 border border-emerald-200 rounded-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></span>
                                {reg.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            
            {activeTab === 'permissions' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#004d40]">Quản lý Phân quyền</h2>
                    <p className="text-slate-500 font-bold text-sm">Quản lý vòng đời tài khoản Admin của các HTX</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('accounts')}
                    className="bg-[#004d40] text-white px-6 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all flex items-center justify-center"
                  >
                    <Plus size={18} className="mr-2" /> Thêm Admin Mới
                  </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-[2.5rem] p-4 flex items-center gap-4 border border-slate-100 shadow-sm relative z-10 w-full max-w-xl">
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                      <Search size={18} />
                    </div>
                    <input 
                      type="text"
                      placeholder="Tìm kiếm theo Tên, Username hoặc HTX..."
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700 placeholder:text-slate-400"
                      value={roleSearchTerm}
                      onChange={(e) => setRoleSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest pl-8">Admin / Username</th>
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Quản lý HTX</th>
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Tình trạng</th>
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Bảo mật</th>
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right pr-8">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {roleAdmins.filter(a => a.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) || a.username.toLowerCase().includes(roleSearchTerm.toLowerCase())).map((admin) => (
                          <tr key={admin.id} className="hover:bg-slate-50/30 transition-colors group">
                            <td className="p-5 pl-8">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                                  {admin.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-[#004d40]">{admin.name}</div>
                                  <div className="text-xs text-slate-400 font-bold">@{admin.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 font-bold text-slate-600 text-sm">
                              {admin.coopName}
                            </td>
                            <td className="p-5">
                              {admin.status === 'active' ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  <CheckCircle2 size={12} className="mr-1.5" /> Hoạt động
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100">
                                  <XCircle size={12} className="mr-1.5" /> Bị Khóa
                                </span>
                              )}
                            </td>
                            <td className="p-5">
                              {admin.is2FA ? (
                                <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" /> 2FA Bật
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5" /> 2FA Tắt
                                </span>
                              )}
                            </td>
                            <td className="p-5 pr-8 text-right">
                              <button 
                                onClick={() => setSelectedRoleAdmin(admin)}
                                className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors font-mono"
                              >
                                Cấu hình
                              </button>
                            </td>
                          </tr>
                        ))}
                        {roleAdmins.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">Không tìm thấy quản trị viên nào.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'statistics' || activeTab === 'settings' || activeTab === 'categories') && (
              <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-100">
                <ShieldCheck size={48} className="text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-emerald-950 mb-2">Module Đang Phát Triển</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chức năng: {activeTab} - Đang hoàn thiện</p>
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                {/* Header for the section */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-forest tracking-tight">Quản lý Đối tác & Hợp đồng</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Phê duyệt doanh nghiệp và hợp đồng trên toàn hệ thống VietAgri</p>
                  </div>
                </div>

                {/* Grid for Pending items - Matching Admin's Phê duyệt look */}
                <div className="grid grid-cols-1 gap-8 items-start">
                  {/* Pending Enterprises */}
                  <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden flex flex-col h-full min-h-[380px]">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-forest">Phê duyệt Đối tác</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Doanh nghiệp đăng ký mới</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setViewAllType('pending')}
                          className="text-[10px] font-black text-forest uppercase tracking-widest hover:opacity-70 transition-opacity"
                        >
                          Xem tất cả
                        </button>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100/50">
                          {pendingEnterprises.length} mới
                        </span>
                      </div>
                    </div>
                    {(() => {
                      const filteredPending = pendingEnterprises.filter(e => e.name.toLowerCase().includes(contractSearchTerm.toLowerCase()) || e.taxCode.includes(contractSearchTerm));
                      return filteredPending.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-medium text-sm flex-1 flex items-center justify-center italic">
                          Không có yêu cầu đăng ký nào đang chờ.
                        </div>
                      ) : (
                        <div className="overflow-x-auto flex-1">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doanh nghiệp</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPending.slice(0, 3).map((ent: any) => (
                                <tr key={ent.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                  <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-forest/5 rounded-2xl flex items-center justify-center text-forest font-black text-lg">
                                        {ent.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="font-bold text-forest text-sm line-clamp-1">{ent.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">MST: {ent.taxCode} • {ent.representative}</p>
                                        <div className="mt-2 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">
                                          {ent.industry}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-3">
                                      <button 
                                        onClick={() => setSelectedEnterprise(ent)} 
                                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-forest hover:text-white transition-all shadow-sm"
                                        title="Xem chi tiết"
                                      >
                                        <Eye size={18} />
                                      </button>
                                      <button 
                                        onClick={() => approveEnterprise(ent.id)} 
                                        className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center hover:bg-forest hover:text-white transition-all shadow-sm"
                                        title="Phê duyệt"
                                      >
                                        <CheckCircle2 size={18} />
                                      </button>
                                      <button 
                                        onClick={() => rejectEnterprise(ent.id)} 
                                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        title="Từ chối"
                                      >
                                        <XCircle size={18} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {filteredPending.length > 3 && (
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                              <button 
                                onClick={() => setViewAllType('pending')}
                                className="text-xs font-black text-forest uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
                              >
                                Xem tất cả {filteredPending.length} doanh nghiệp <ChevronRight size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Active Lists Section - Large table style like Admin's registered list */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden mt-8">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-forest">Danh sách Đối tác Hệ thống</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Các doanh nghiệp đã ký kết và hoạt động trên nền tảng</p>
                    </div>
                    <button 
                      onClick={() => setViewAllType('active')}
                      className="text-forest font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Xem toàn bộ danh sách <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doanh nghiệp / Phân loại</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đại diện / Liên hệ</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái xác thực</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeEnterprises.slice(0, 3).map((ent: any) => (
                          <tr key={ent.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black">
                                  {ent.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-forest text-sm">{ent.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{ent.industry}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-semibold text-slate-700">{ent.representative}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{ent.phone}</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                Đang hoạt động
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => setSelectedEnterprise(ent)}
                                className="px-4 py-2 bg-forest text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-forest/90 transition-all shadow-lg shadow-forest/10 flex items-center gap-2 ml-auto"
                              >
                                <Eye size={14} /> Chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Active Contracts Section */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden mt-8">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-forest">Hợp đồng Đang hiệu lực</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Các chuỗi liên kết đang trong giai đoạn triển khai thu hoạch & phân phối</p>
                    </div>
                    <button 
                      onClick={() => setViewAllType('active-contracts' as any)}
                      className="text-forest font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Bản đồ hợp đồng <Navigation size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã / Đối tác Liên kết</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vùng nguyên liệu / Sản phẩm</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị hợp đồng</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tiến độ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.filter(c => c.status === 'active').slice(0, 3).map((c: any) => (
                          <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xs">
                                  #{c.id.slice(-4)}
                                </div>
                                <div>
                                  <p className="font-bold text-forest text-sm">{c.enterpriseName}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{c.coopName}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-semibold text-slate-700">{c.cropName}</p>
                              <p className="text-[10px] text-forest font-bold uppercase mt-0.5">Sản lượng: {c.totalVolume}</p>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-sm font-black text-emerald-900">{c.unitPrice}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Đơn giá thu mua</p>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-4">
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-forest uppercase tracking-widest bg-forest/5 px-2 py-1 rounded inline-block">75% Hoàn thành</p>
                                  <div className="w-32 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-forest w-3/4 rounded-full"></div>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setSelectedContract(c)}
                                  className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center hover:bg-forest hover:text-white transition-all shadow-sm"
                                >
                                  <Eye size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal - Matching Admin Design */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-10 pb-0 shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-8 top-8 text-slate-300 hover:text-emerald-950 transition-colors z-10"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-forest/10 text-forest rounded-xl flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-forest">
                      {editingHTX ? 'Cập nhật HTX' : 'Đăng ký HTX mới'}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Root System Authorization</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-10 pb-10 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Section 1: General Info */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <Building2 size={16} className="text-mint" />
                      <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest">Thông tin chung</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tên Hợp tác xã</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Hợp tác xã Nông nghiệp..." 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mã số thuế / Mã số HTX</label>
                        <input 
                          required 
                          type="text" 
                          pattern="[0-9]{10,13}"
                          placeholder="10 - 13 chữ số" 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.taxCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, taxCode: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mặt hàng chủ lực</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="Gạo, Cà phê, Trái cây..." 
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                            value={formData.specialty}
                            onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                          />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Người đại diện pháp luật</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Họ và tên..." 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.legalRep}
                          onChange={(e) => setFormData(prev => ({ ...prev, legalRep: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Chức danh</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Chủ tịch, Giám đốc..." 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.position}
                          onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Contact Info */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <Mail size={16} className="text-mint" />
                      <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest">Thông tin liên hệ</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email Quản trị viên</label>
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            required 
                            type="email" 
                            placeholder="admin@htx.vn" 
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                            value={formData.adminEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số điện thoại liên hệ</label>
                        <div className="relative">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            required 
                            type="tel" 
                            placeholder="09xx xxx xxx" 
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 3: Location */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <MapPin size={16} className="text-mint" />
                      <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest">Vùng trồng / Địa điểm</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">TP / Tỉnh</label>
                        <div className="relative">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <select 
                            required 
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 appearance-none transition-all"
                            value={formData.province}
                            onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value, ward: '' }))}
                          >
                            <option value="">Chọn Tỉnh thành</option>
                            {Object.keys(LOCATION_DATA).map(province => (
                              <option key={province} value={province}>{province}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Xã / Phường</label>
                        <div className="relative">
                          <Navigation className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <select 
                            required 
                            disabled={!formData.province}
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 appearance-none transition-all disabled:opacity-50"
                            value={formData.ward}
                            onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                          >
                            <option value="">Chọn Xã/Phường</option>
                            {formData.province && LOCATION_DATA[formData.province]?.map(ward => (
                              <option key={ward} value={ward}>{ward}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Địa chỉ cụ thể (Kèm tên Huyện)</label>
                      <div className="relative">
                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          required 
                          type="text" 
                          placeholder="Số nhà, tên đường, thôn/xóm, Huyện..." 
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Section 4: Production */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <Activity size={16} className="text-mint" />
                      <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest">Năng lực sản xuất</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số lượng nông dân (Thành viên)</label>
                        <input 
                          required 
                          type="number" 
                          placeholder="0" 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.members}
                          onChange={(e) => setFormData(prev => ({ ...prev, members: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tổng diện tích canh tác (ha)</label>
                        <input 
                          required 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.totalArea}
                          onChange={(e) => setFormData(prev => ({ ...prev, totalArea: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tiêu chuẩn chất lượng</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['VietGAP', 'GlobalGAP', 'Hữu cơ', 'Khác'].map((standard) => (
                          <label key={standard} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-mint transition-all">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded-lg border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                              checked={formData.qualityStandards.includes(standard)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({ ...prev, qualityStandards: [...prev.qualityStandards, standard] }));
                                } else {
                                  setFormData(prev => ({ ...prev, qualityStandards: prev.qualityStandards.filter(s => s !== standard) }));
                                }
                              }}
                            />
                            <span className="text-xs font-bold text-emerald-900">{standard}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Section 5: Financial */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <ShieldCheck size={16} className="text-mint" />
                      <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest">Thông tin tài chính</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số tài khoản ngân hàng</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="STK..." 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.bankAccount}
                          onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mở tại ngân hàng</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Agribank, Vietinbank..." 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.bankName}
                          onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Chi nhánh</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Chi nhánh..." 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-emerald-950 transition-all"
                          value={formData.bankBranch}
                          onChange={(e) => setFormData(prev => ({ ...prev, bankBranch: e.target.value }))}
                        />
                      </div>
                    </div>
                  </section>

                  <button className="w-full py-5 bg-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 mt-8 flex items-center justify-center gap-3">
                    {editingHTX ? 'Cập nhật hệ thống' : 'Phê duyệt HTX mới'} <ChevronRight size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLegalRepModalOpen && selectedLegalHTX && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-10 pb-6 shrink-0 bg-slate-50/50 border-b border-slate-100">
                <button 
                  onClick={() => setIsLegalRepModalOpen(false)}
                  className="absolute right-8 top-8 text-slate-300 hover:text-emerald-950 transition-colors z-10"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <IdCard size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-emerald-950">
                      Hồ sơ Người đại diện Pháp luật
                    </h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      {selectedLegalHTX.name} • HTX ID: {selectedLegalHTX.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 pt-6 scrollbar-thin scrollbar-thumb-slate-200">
                <form onSubmit={handleSaveLegalRep} className="space-y-12">
                  {/* I. Thông tin Định danh Cá nhân */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <User size={18} className="text-teal-500" />
                      <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest">I. Thông tin Định danh Cá nhân</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Họ và tên đầy đủ</label>
                        <input 
                          required
                          type="text" 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.legalRep}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRep: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Ngày, tháng, năm sinh</label>
                        <input 
                          type="text" 
                          placeholder="15/05/1985"
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.legalRepDob || ''}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepDob: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Giới tính</label>
                          <select 
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all appearance-none shadow-sm"
                            value={selectedLegalHTX.legalRepGender || 'Nam'}
                            onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepGender: e.target.value })}
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
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                            value={selectedLegalHTX.legalRepNationality || 'Việt Nam'}
                            onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepNationality: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* II. Giấy tờ Chứng thực Cá nhân */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <FileText size={18} className="text-teal-500" />
                      <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest">II. Giấy tờ Chứng thực Cá nhân</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số CCCD</label>
                        <input 
                          type="text" 
                          placeholder="Nhập số CCCD..."
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.legalRepIdNumber || ''}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepIdNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Ngày cấp</label>
                        <input 
                          type="text" 
                          placeholder="20/10/2021"
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.legalRepIdDate || ''}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepIdDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Nơi cấp</label>
                        <input 
                          type="text" 
                          placeholder="Cục Cảnh sát QLHC về TTXH..."
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.legalRepIdPlace || ''}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepIdPlace: e.target.value })}
                        />
                      </div>
                    </div>
                  </section>

                  {/* III. Thông tin Chức vụ & Liên hệ */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <Briefcase size={18} className="text-teal-500" />
                      <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest">III. Thông tin Chức vụ & Liên hệ</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Chức danh</label>
                        <input 
                          type="text" 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.position || ''}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, position: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Số điện thoại di động</label>
                        <input 
                          type="tel" 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.phone || ''}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, phone: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email cá nhân / Email công việc</label>
                        <input 
                          type="email" 
                          placeholder="example@gmail.com"
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.legalRepPersonalEmail || ''}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepPersonalEmail: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Địa chỉ liên lạc / Thường trú</label>
                        <input 
                          type="text" 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.legalRepAddress || ''}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepAddress: e.target.value })}
                        />
                      </div>
                    </div>
                  </section>

                  {/* IV. Thông tin Sở hữu & Ủy quyền */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                      <ShieldCheck size={18} className="text-teal-500" />
                      <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest">IV. Thông tin Sở hữu & Ủy quyền (Nâng cao)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tỷ lệ vốn góp (%)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all shadow-sm"
                          value={selectedLegalHTX.legalRepCapitalRatio || 0}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepCapitalRatio: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Hình thức đại diện</label>
                        <select 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-emerald-950 transition-all appearance-none shadow-sm"
                          value={selectedLegalHTX.legalRepForm || 'Đại diện theo pháp luật'}
                          onChange={(e) => setSelectedLegalHTX({ ...selectedLegalHTX, legalRepForm: e.target.value })}
                        >
                          <option value="Đại diện theo pháp luật">Đại diện theo pháp luật</option>
                          <option value="Đại diện theo ủy quyền">Đại diện theo ủy quyền</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Văn bản đính kèm (Giấy ủy quyền / Quyết định bổ nhiệm)</label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 flex items-center justify-center gap-3 px-6 py-10 border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-teal-500 hover:bg-teal-50/30 transition-all cursor-pointer group">
                            <Upload size={24} className="text-slate-300 group-hover:text-teal-500" />
                            <div className="text-left">
                              <p className="text-sm font-black text-slate-600 group-hover:text-teal-900">
                                {selectedLegalHTX.legalRepAttachment || 'Tải lên File PDF / Image'}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dung lượng tối đa 10MB</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  setSelectedLegalHTX({ ...selectedLegalHTX, legalRepAttachment: e.target.files[0].name });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="pt-8 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsLegalRepModalOpen(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      type="submit"
                      className="flex-2 py-4 bg-emerald-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-500 transition-all shadow-xl shadow-emerald-950/20"
                    >
                      Cập nhật hồ sơ pháp lý
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View All Modal */}
      <AnimatePresence>
        {viewAllType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm"
              onClick={() => setViewAllType(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-[85vh] bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 flex flex-col"
            >
              <button 
                onClick={() => setViewAllType(null)}
                className="absolute right-8 top-8 text-slate-300 hover:text-emerald-950 transition-colors"
                title="Đóng cửa sổ"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-forest/10 text-forest rounded-xl flex items-center justify-center">
                  {viewAllType === 'contracts' ? <History size={24} /> : (viewAllType === 'active' ? <Building2 size={24} /> : <Briefcase size={24} />)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-forest">
                    {getModalTitle()}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Hệ thống quản trị VietAgri Global</p>
                </div>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm nhanh thông tin..." 
                  value={contractSearchTerm}
                  onChange={(e) => setContractSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-forest rounded-[1.5rem] outline-none font-bold text-slate-700 shadow-sm transition-all text-sm"
                />
              </div>

              <div className="flex-1 overflow-y-auto min-h-[400px] border border-slate-100 rounded-[2rem] bg-white shadow-inner">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-[10px] font-black uppercase tracking-widest text-slate-400 sticky top-0 z-10 backdrop-blur-md">
                      {(viewAllType?.includes('contract') || viewAllType === 'contracts') ? (
                        <>
                          <th className="px-8 py-5">Mã / Đối tác</th>
                          <th className="px-8 py-5">HTX / Vùng trồng</th>
                          <th className="px-8 py-5">Sản phẩm / Sản lượng</th>
                          <th className="px-8 py-5">Giá trị / Đơn giá</th>
                          <th className="px-8 py-5 text-right">Trạng thái / Thao tác</th>
                        </>
                      ) : (
                        <>
                          <th className="px-8 py-5">Doanh Nghiệp / MST</th>
                          <th className="px-8 py-5">Người đại diện</th>
                          <th className="px-8 py-5">Lĩnh vực hoạt động</th>
                          <th className="px-8 py-5 text-right">Trạng thái / Duyệt hồ sơ</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let list: any[] = [];
                      if (viewAllType === 'pending') {
                        list = pendingEnterprises;
                      } else if (viewAllType === 'active') {
                        list = activeEnterprises;
                      } else if (viewAllType === 'contracts') {
                        list = contracts;
                      } else if (viewAllType === 'pending-contracts') {
                        list = contracts.filter(c => c.status === 'pending_super_admin');
                      } else if (viewAllType === 'active-contracts') {
                        list = contracts.filter(c => c.status === 'active');
                      }

                      // Apply search
                      const term = contractSearchTerm.toLowerCase();
                      list = list.filter(item => {
                        if (item.name) return item.name.toLowerCase().includes(term) || item.taxCode?.includes(term);
                        if (item.enterpriseName) return item.enterpriseName.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
                        return false;
                      });

                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="py-24 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <Search size={40} className="text-slate-200" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Không có dữ liệu phù hợp với tìm kiếm</p>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return list.map((item: any) => (
                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                          {(viewAllType?.includes('contract') || viewAllType === 'contracts') ? (
                            <>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-[10px]">
                                    #{item.id.slice(-4)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-forest text-sm">{item.enterpriseName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">ID: {item.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <p className="font-bold text-slate-700 text-xs">{item.coopName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight italic">Hợp tác xã liên kết</p>
                              </td>
                              <td className="px-8 py-6">
                                <p className="font-bold text-emerald-700 text-xs">{item.cropName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Sản lượng: {item.totalVolume}</p>
                              </td>
                              <td className="px-8 py-6">
                                <p className="font-black text-slate-800 text-sm italic">{item.unitPrice}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Đơn giá thu mua</p>
                              </td>
                              <td className="px-8 py-6 text-right">
                                {item.status === 'pending_super_admin' ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => approveContract(item.id)} className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center hover:bg-forest hover:text-white transition-all shadow-sm">
                                      <CheckCircle2 size={16} />
                                    </button>
                                    <button onClick={() => rejectContract(item.id)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                      <XCircle size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {item.status === 'active' ? 'Đã kích hoạt' : 'Đã từ chối'}
                                  </span>
                                )}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-forest/10 text-forest rounded-xl flex items-center justify-center font-black">
                                    {item.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-forest text-sm line-clamp-1">{item.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1">MST: {item.taxCode}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <p className="font-bold text-slate-700 text-xs">{item.representative}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">{item.phone} • {item.email}</p>
                              </td>
                              <td className="px-8 py-6">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase tracking-widest">
                                  {item.industry}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                {viewAllType?.includes('pending') ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => {
                                        if (viewAllType === 'pending') {
                                          approveEnterprise(item.id);
                                        } else {
                                          approveContract(item.id);
                                        }
                                        setViewAllType(null);
                                      }} 
                                      className="px-3 py-1.5 rounded-lg bg-forest text-white text-[9px] font-black uppercase tracking-widest hover:bg-forest/90 shadow-lg shadow-forest/20 transition-all"
                                    >
                                      Duyệt hồ sơ
                                    </button>
                                    <button 
                                      onClick={() => {
                                        if (viewAllType === 'pending') {
                                          rejectEnterprise(item.id);
                                        } else {
                                          rejectContract(item.id);
                                        }
                                        setViewAllType(null);
                                      }}
                                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        if (item.name) setSelectedEnterprise(item);
                                        else setSelectedContract(item);
                                      }}
                                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-forest hover:text-white transition-all"
                                    >
                                      <Eye size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'active' || !item.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                      {item.status === 'active' || !item.status ? 'Đang hoạt động' : 'Đã kết thúc'}
                                    </span>
                                    <button 
                                      onClick={() => {
                                        if (item.name) setSelectedEnterprise(item);
                                        else setSelectedContract(item);
                                      }}
                                      className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center hover:bg-forest hover:text-white transition-all"
                                    >
                                      <Eye size={16} />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enterprise Detail Modal */}
      <AnimatePresence>
        {selectedEnterprise && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnterprise(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-forest text-white">
                <div>
                  <h3 className="text-2xl font-black italic">Chi tiết Đối tác</h3>
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mt-1">Thông tin hồ sơ doanh nghiệp</p>
                </div>
                <button 
                  onClick={() => setSelectedEnterprise(null)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-forest text-4xl font-black border-2 border-slate-100 italic">
                    {selectedEnterprise.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 leading-tight line-clamp-2">{selectedEnterprise.name}</h4>
                    <p className="text-forest font-bold text-sm mt-1">{selectedEnterprise.industry}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">MST: {selectedEnterprise.taxCode}</span>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedEnterprise.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {selectedEnterprise.status === 'active' ? 'Đang hoạt động' : 'Chờ phê duyệt'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Người đại diện</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <User size={16} />
                        </div>
                        <p className="font-bold text-slate-700">{selectedEnterprise.representative}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Số điện thoại</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <Phone size={16} />
                        </div>
                        <p className="font-bold text-slate-700">{selectedEnterprise.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Email liên hệ</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <Mail size={16} />
                        </div>
                        <p className="font-bold text-slate-700 text-sm truncate">{selectedEnterprise.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Ngày tham gia hệ thống</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <History size={16} />
                        </div>
                        <p className="font-bold text-slate-700 italic">{new Date(selectedEnterprise.createdAt || selectedEnterprise.approvedAt || new Date()).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Hồ sơ pháp lý đính kèm</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <FileText className="text-forest" size={18} />
                        <span className="text-sm font-bold text-slate-700">GP_Kinh_Doanh.pdf</span>
                      </div>
                      <button className="text-[10px] font-black text-forest uppercase tracking-widest">Xem</button>
                    </div>
                  </div>
                </div>

                {selectedEnterprise.status === 'pending' && (
                  <div className="pt-4 flex items-center gap-4">
                    <button 
                      onClick={() => {approveEnterprise(selectedEnterprise.id); setSelectedEnterprise(null);}}
                      className="flex-1 py-4 bg-forest text-white rounded-2xl font-black uppercase tracking-widest hover:bg-forest/90 shadow-xl shadow-forest/20 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} /> Phê duyệt ngay
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contract Detail Modal */}
      <AnimatePresence>
        {selectedContract && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContract(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-amber-600 text-white">
                <div>
                  <h3 className="text-2xl font-black italic text-white">Chi tiết Hợp đồng</h3>
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mt-1">Mã: {selectedContract.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Đối tác Doanh nghiệp</p>
                    <p className="font-black text-slate-900 line-clamp-2 leading-tight">{selectedContract.enterpriseName}</p>
                  </div>
                  <div className="relative">
                    <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <ArrowRight size={16} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Hợp tác xã liên kết</p>
                    <p className="font-black text-forest line-clamp-2 leading-tight">{selectedContract.coopName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Sản phẩm / Vùng trồng</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <MapPin size={16} />
                        </div>
                        <p className="font-bold text-slate-700">{selectedContract.cropName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Khối lượng cam kết</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                          <Activity size={16} />
                        </div>
                        <p className="font-bold text-slate-700">{selectedContract.totalVolume}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Đơn giá hợp đồng</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <BarChart3 size={16} />
                        </div>
                        <p className="font-black text-emerald-950 italic">{selectedContract.unitPrice}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Trạng thái</p>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedContract.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {selectedContract.status === 'active' ? 'Đang hiệu lực' : 'Chờ xử lý'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tiến độ mùa vụ</h5>
                    <span className="text-[10px] font-black text-forest">75%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-forest w-3/4"></div>
                  </div>
                </div>

                {selectedContract.status === 'pending_super_admin' && (
                  <div className="pt-4 flex items-center gap-4">
                    <button 
                      onClick={() => {approveContract(selectedContract.id); setSelectedContract(null);}}
                      className="flex-1 py-4 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-900 shadow-xl shadow-emerald-950/20 transition-all"
                    >
                      Xác nhận phê duyệt
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-10 right-10 z-[100] max-w-md"
          >
            <div className={`p-6 rounded-[2rem] shadow-2xl border-2 flex items-start gap-4 ${
              statusMessage.type === 'success' 
              ? 'bg-white border-emerald-100 text-emerald-950' 
              : 'bg-white border-red-100 text-red-950'
            }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                statusMessage.type === 'success' ? 'bg-forest text-white' : 'bg-red-500 text-white'
              }`}>
                {statusMessage.type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div className="flex-1 pr-6">
                <h4 className="font-black text-sm mb-1 uppercase tracking-wider">
                  {statusMessage.type === 'success' ? 'Thông báo Thành công' : 'Lỗi hệ thống'}
                </h4>
                <p className="text-xs font-bold leading-relaxed opacity-70">
                  {statusMessage.text}
                </p>
                {statusMessage.type === 'success' && statusMessage.text.includes('mật khẩu') && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => {
                      const pwd = statusMessage.text.match(/mật khẩu: ([\w@#$!]+)/)?.[1];
                      if (pwd) {
                        navigator.clipboard.writeText(pwd);
                        // Optionally show a small feedback
                      }
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Mật khẩu tạm</span>
                      <span className="font-black text-forest text-sm italic">
                        {statusMessage.text.match(/mật khẩu: ([\w@#$!]+)/)?.[1] || '••••••••'}
                      </span>
                    </div>
                    <Copy size={16} className="text-slate-300 group-hover:text-forest transition-colors" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => setStatusMessage(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Config Modal */}
      <AnimatePresence>
        {selectedRoleAdmin && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoleAdmin(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between p-6 md:p-10 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <div>
                    <h2 className="text-2xl font-black text-[#004d40]">Cấu hình Tài khoản</h2>
                    <p className="text-sm font-bold text-slate-500 mt-1">
                      {selectedRoleAdmin.name} • @{selectedRoleAdmin.username}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedRoleAdmin(null)}
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 md:p-10 space-y-10">
                  {/* Account Lifecycle */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#004d40] mb-5 flex items-center">
                      <User size={16} className="mr-2" /> Vòng đời tài khoản
                    </h3>
                    <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                       <div>
                         <p className="font-bold text-slate-700 text-sm">Trạng thái hiện tại:</p>
                         <div className="mt-2">
                           {selectedRoleAdmin.status === 'active' ? (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                                <CheckCircle2 size={14} className="mr-1.5" /> Hoạt động
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-rose-100 text-rose-700">
                                <XCircle size={14} className="mr-1.5" /> Bị Khóa
                              </span>
                            )}
                         </div>
                       </div>
                       <div className="flex gap-3 text-left">
                          {selectedRoleAdmin.status === 'active' ? (
                            <button className="px-5 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex flex-col justify-center">
                               <div className="flex items-center mb-1"><ShieldAlert size={14} className="mr-1.5" /> Khóa tài khoản</div>
                               <span className="text-[9px] opacity-70">Phát hiện gian lận</span>
                            </button>
                          ) : (
                            <button className="px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex flex-col justify-center">
                               <div className="flex items-center mb-1"><CheckCircle2 size={14} className="mr-1.5" /> Mở khóa</div>
                               <span className="text-[9px] opacity-70">Khôi phục quyền truy cập</span>
                            </button>
                          )}
                          <button className="px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex flex-col justify-center">
                             <div className="flex items-center mb-1"><Trash2 size={14} className="mr-1.5" /> Xóa tài khoản</div>
                             <span className="text-[9px] opacity-70">Xóa vĩnh viễn (Soft-delete)</span>
                          </button>
                       </div>
                    </div>
                  </section>

                  {/* Permissions Component */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#004d40] mb-5 flex items-center">
                      <LayoutList size={16} className="mr-2" /> Phân quyền hạn (Scope)
                    </h3>
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 space-y-4 shadow-sm">
                      <p className="text-xs font-bold text-slate-500 mb-4">Chọn các module mà Admin này được phép truy cập và quản lý:</p>
                      
                      {[
                        { id: 'inventory', label: 'Quản lý Kho hàng (Nhập/Xuất/Tồn kho)' },
                        { id: 'hr', label: 'Quản lý Nhân sự & Phân công' },
                        { id: 'customers', label: 'Quản lý Khách hàng & Đối tác' },
                        { id: 'contracts', label: 'Quản lý Hợp đồng Điện tử' },
                        { id: 'gis', label: 'Quản lý Bản đồ GIS' }
                      ].map((perm) => (
                        <label key={perm.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                           <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${selectedRoleAdmin.scope.includes(perm.id) ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-transparent group-hover:bg-slate-300'}`}>
                              <CheckCircle2 size={16} />
                           </div>
                           <span className="font-bold text-slate-700 text-sm flex-1">{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* Security */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#004d40] mb-5 flex items-center">
                      <ShieldCheck size={16} className="mr-2" /> Quản lý bảo mật
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800">Cấp lại Mật khẩu</h4>
                            <p className="text-xs text-slate-500 font-bold mt-1">Buộc người dùng đổi mật khẩu ở lần đăng nhập tiếp theo.</p>
                          </div>
                          <button className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                            Gửi yêu cầu Reset
                          </button>
                       </div>
                       
                       <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex flex-col justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-[#004d40]">Xác thực 2 lớp (2FA)</h4>
                            <p className="text-xs text-[#004d40]/70 font-bold mt-1">Bắt buộc Admin này sử dụng ứng dụng Authenticator.</p>
                          </div>
                          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-emerald-100">
                             <span className="text-xs font-bold text-emerald-800">Trạng thái: Bật</span>
                             <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </section>

                  {/* Audit Logs */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#004d40] mb-5 flex items-center">
                      <History size={16} className="mr-2" /> Nhật ký hoạt động
                    </h3>
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                       <div className="space-y-6">
                         {[
                           { action: 'Duyệt Hợp đồng #CT-938475', time: '10:30 AM, 15/05/2026', type: 'approve' },
                           { action: 'Cập nhật Tồn kho (Lô Cà phê Arabica)', time: '09:15 AM, 14/05/2026', type: 'update' },
                           { action: 'Đăng nhập thành công', time: '08:00 AM, 14/05/2026', type: 'login' }
                         ].map((log, i) => (
                           <div key={i} className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                 {log.type === 'approve' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                 {log.type === 'update' && <Edit3 size={14} className="text-blue-500" />}
                                 {log.type === 'login' && <Globe size={14} className="text-amber-500" />}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-700">{log.action}</p>
                                <p className="text-xs font-bold text-slate-400 mt-1">{log.time}</p>
                              </div>
                           </div>
                         ))}
                       </div>
                       <div className="mt-8 flex gap-3">
                         <button className="flex-1 py-3 bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center">
                           <History size={14} className="mr-2"/> Audit Logs toàn bộ
                         </button>
                         <button className="flex-1 py-3 bg-amber-50 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center border border-amber-200">
                           <AlertTriangle size={14} className="mr-2"/> Ghi đè thay đổi (Override)
                         </button>
                       </div>
                    </div>
                  </section>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4 shrink-0">
                <button 
                  onClick={() => setSelectedRoleAdmin(null)}
                  className="px-6 py-3 bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => setSelectedRoleAdmin(null)}
                  className="px-6 py-3 bg-[#004d40] text-white hover:bg-[#00332d] rounded-xl text-xs font-bold tracking-widest uppercase shadow-xl shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
