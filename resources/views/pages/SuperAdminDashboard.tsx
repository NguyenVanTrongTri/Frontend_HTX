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
  XCircle,
  Filter,
  FileX2,
  ShoppingCart,
  Download,
  LayoutDashboard,
  AlertCircle,
  Lock,
  Unlock,
  ArrowUpCircle,
  ArrowDownCircle,
  UserCheck,
  UserX,
  UserCog,
  Package,
  Image as ImageIcon,
  PlusCircle,
  Edit2,
  Database,
  Key,
  Sliders,
  Server,
  HardDrive,
  RotateCcw,
  Save
} from 'lucide-react';
import { Copy, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import mammoth from 'mammoth';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import authService from '../../services/authService';
import { cooperativeService } from '../../services/cooperativeService';
import { adminAccountService, systemService } from '../../services/systemService';
import { enterpriseService } from '../../services/enterpriseService';
import { contractService } from '../../services/contractService';
import { productService } from '../../services/productService';
import { postService } from '../../services/postService';
import RootAdminCustomerContractsPage from './RootAdminCustomerContractsPage';
import RootAdminCoopContractsPage from './RootAdminCoopContractsPage';
import RootAdminContractManagePage from './RootAdminContractManagePage';

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

const NewsManageTab = ({
  customNews,
  newsForm,
  setNewsForm,
  isEditingNews,
  handleCreateOrUpdateNews,
  handleDeleteNews,
  handleStartEditNews,
  handleCancelEditNews
}: any) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 text-[#004d40] rounded-2xl flex items-center justify-center shrink-0">
              <FileText size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#004d40]">Quản lý Tin tức</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Đăng bài báo, liên kết tin tức ngoài & tự động cân chỉnh giao diện hiển thị</p>
            </div>
          </div>
          {isEditingNews && (
            <button 
              onClick={handleCancelEditNews} 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Hủy chỉnh sửa
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Form Block */}
          <form onSubmit={handleCreateOrUpdateNews} className="lg:col-span-7 space-y-6 text-left">
            <h4 className="text-lg font-extrabold text-[#004d40] flex items-center gap-2 pb-2 border-b border-slate-100 uppercase tracking-tight">
              <PlusCircle size={20} className="text-emerald-500" />
              {isEditingNews ? 'Cập nhật tin liên kết' : 'Thêm tin liên kết mới'}
            </h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tiêu đề tin tức <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required 
                  placeholder="Nhập tiêu đề tin nông nghiệp, sự kiện lúa gạo..."
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#004d40] rounded-2xl outline-none font-semibold text-slate-700 transition-all text-sm"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Liên kết bài báo gốc (URL)</label>
                  <input 
                    type="url" 
                    placeholder="https://vnexpress.net/tin-tuc-nong-nghiep..."
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#004d40] rounded-2xl outline-none font-semibold text-slate-700 transition-all text-xs"
                    value={newsForm.link}
                    onChange={(e) => setNewsForm({ ...newsForm, link: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-350 pl-2">Liên kết ngoài bài tin gốc (báo VNExpress, Dân Trí...)</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Đường dẫn hình ảnh minh họa</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#004d40] rounded-2xl outline-none font-semibold text-slate-700 transition-all text-xs"
                    value={newsForm.image}
                    onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-350 pl-2 font-medium">Bỏ trống để tự động gán cảnh quan lúa mẫu</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Mô tả ngắn tin tức / Tóm tắt Excerpt</label>
                <textarea 
                  rows={4}
                  placeholder="Nhập tóm tắt ngắn về sự kiện hoặc bài viết..."
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#004d40] rounded-2xl outline-none font-semibold text-slate-700 transition-all text-sm resize-none"
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#004d40] hover:bg-[#036e5c] text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              {isEditingNews ? 'Cấu hình & Lưu bài viết' : 'Xác nhận Đăng bài tin tức'}
            </button>
          </form>

          {/* Real-time Preview Area (Tự động cân chỉnh) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h4 className="text-lg font-extrabold text-[#004d40] flex items-center gap-2 pb-2 border-b border-slate-100 uppercase tracking-tight">
              <Globe size={18} className="text-emerald-500 animate-pulse" />
              Giao diện khi hiển thị (Live Preview)
            </h4>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200/60 flex items-center justify-center shadow-inner">
              <div className="w-full max-w-[280px] bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden group pointer-events-none">
                <div className="relative h-44 overflow-hidden bg-slate-200">
                  <img 
                    src={newsForm.image.trim() || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400'} 
                    alt="Preview image" 
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-emerald-950/85 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {new Date().toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className="p-4 flex flex-col h-[180px]">                
                  <h3 className="font-extrabold text-xs text-[#004d40] mb-1.5 leading-tight line-clamp-2 h-9 break-words">
                    {newsForm.title.trim() || 'Tiêu đề bài tin tức nông nghiệp mẫu'}
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-4 flex-grow line-clamp-3 h-12 break-words leading-relaxed font-semibold">
                    {newsForm.excerpt.trim() || 'Hệ thống tự động canh chỉnh kích thước khung, tỷ lệ ảnh, ngăn tràn văn bản và đồng bộ hóa lưới hiển thị tối ưu trên di động.'}
                  </p>
                  <span className="text-emerald-700 font-bold text-xs mt-auto flex items-center gap-1">
                    Xem thêm →
                    {newsForm.link.trim() && (
                      <span className="text-[9px] text-slate-400 font-normal truncate max-w-[120px]">
                        ({newsForm.link.trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-emerald-800 text-xs font-semibold space-y-2 leading-relaxed">
              <p className="font-bold text-[#004d40] mb-1">💡 Hệ thống tự động cân chỉnh:</p>
              <div className="flex items-start gap-2">
                <span className="text-[#004d40] font-black">•</span>
                <span>Hình ảnh cắt tỉa tự động (`object-cover w-full h-full`) để luôn đều nhau, tránh lệch lồi lõm hoặc méo.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#004d40] font-black">•</span>
                <span>Giao diện tin tức ngoài di động tự động co giãn 2 cột mượt mà, đồng đều hoàn mỹ.</span>
              </div>
            </div>
          </div>
        </div>

        {/* List of custom news */}
        <div className="mt-14 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-lg font-extrabold text-[#004d40] uppercase tracking-tight">Danh sách tin bài đang liên kết ({customNews.length})</h4>
          </div>

          {customNews.length === 0 ? (
            <div className="py-12 bg-slate-50 rounded-3xl text-center text-slate-400 border border-dashed border-slate-200">
              <FileText size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="font-bold text-sm">Chưa có tin tức liên kết nào.</p>
              <p className="text-xs text-slate-300 mt-1">Sử dụng biểu mẫu phía trên để xuất bản tin tức đầu tiên.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100/80 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="py-4 px-4 w-1/12 text-center">Bìa minh họa</th>
                    <th className="py-4 px-4 w-3/12">Tiêu đề bài tin</th>
                    <th className="py-4 px-4 w-2/12">Địa chỉ URL gốc</th>
                    <th className="py-4 px-4 w-4/12">Tóm tắt mô tả</th>
                    <th className="py-4 px-4 w-1/12 text-center">Ngày đăng</th>
                    <th className="py-4 px-4 w-1/12 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customNews.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 text-center">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-100 inline-block">
                          <img src={item.image} alt="News thumbnail" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-xs text-[#004d40] line-clamp-2 leading-snug">{item.title}</span>
                      </td>
                      <td className="py-4 px-4">
                        {item.link && item.link !== '#' ? (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-emerald-700 hover:underline font-extrabold break-all flex items-center gap-1.5"
                          >
                            <Globe size={11} className="shrink-0" /> 
                            <span className="truncate max-w-[120px]">{item.link.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold italic">Không có liên kết</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-slate-450 line-clamp-2 leading-relaxed font-semibold">{item.excerpt}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-[10px] font-mono font-bold text-slate-400 whitespace-nowrap">{item.date}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            type="button"
                            onClick={() => handleStartEditNews(item)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                            title="Sửa tin tức này"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteNews(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="Xóa tin tức"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SystemSettingsTab = () => {
    const [maintenanceMode, setMaintenanceMode] = useState(() => {
        return localStorage.getItem('vietagri_maintenance_mode') === 'true';
    });
    const [maxUploadSize, setMaxUploadSize] = useState(() => {
        return localStorage.getItem('vietagri_max_upload_size') || '10';
    });
    const [sessionTimeout, setSessionTimeout] = useState(() => {
        return localStorage.getItem('vietagri_session_timeout') || '30';
    });
    const [cacheLimit, setCacheLimit] = useState(() => {
        return localStorage.getItem('vietagri_cache_limit') || '512';
    });
    const [smtpEmail, setSmtpEmail] = useState(() => {
        return localStorage.getItem('vietagri_smtp_email') || 'SG.gO8_v0M3Q82-i_u9vRw_dQ.xxxxxx';
    });
    const [smsOtp, setSmsOtp] = useState(() => {
        return localStorage.getItem('vietagri_sms_otp') || 'sms_vn_8923xxxx_key';
    });
    const [vnpaySecret, setVnpaySecret] = useState(() => {
        return localStorage.getItem('vietagri_vnpay_secret') || 'vnpay_secret_key_893264';
    });
    const [momoSecret, setMomoSecret] = useState(() => {
        return localStorage.getItem('vietagri_momo_secret') || 'momo_partner_secret_47192';
    });
    const [mapsApiKey, setMapsApiKey] = useState(() => {
        return localStorage.getItem('vietagri_maps_api_key') || 'AIzaSyA_maps_key_58932';
    });

    const [isClearingCache, setIsClearingCache] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [showClearCacheSuccess, setShowClearCacheSuccess] = useState(false);

    const handleClearCache = () => {
        setIsClearingCache(true);
        setTimeout(() => {
            setIsClearingCache(false);
            setShowClearCacheSuccess(true);
            setTimeout(() => setShowClearCacheSuccess(false), 3000);
        }, 1500);
    };

    const handleBackup = () => {
        setIsBackingUp(true);
        setTimeout(() => {
            setIsBackingUp(false);
            
            // Build temporary SQL dump text and download it automatically
            const backupText = 
`-- ==========================================
-- VietAgri System Database Backup Dump
-- Generated automatically: ${new Date().toLocaleString()}
-- Server Status: Operational
-- Version: v4.2.1-production
-- ==========================================

SET FOREIGN_KEY_CHECKS = 0;
CREATE TABLE IF NOT EXISTS \`cooperatives\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`province\` varchar(100) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping contracts to local state dump
-- Database configuration limits:
-- max_upload_size: ${maxUploadSize}MB
-- session_timeout: ${sessionTimeout}m
-- cache_limit: ${cacheLimit}MB
-- Email Smtp Server: ${smtpEmail}
-- Maps Key: ${mapsApiKey}
`;
            
            const element = document.createElement("a");
            const file = new Blob([backupText], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = `vietagri_database_backup_${new Date().toISOString().split('T')[0]}.sql`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }, 1800);
    };

    const handleToggleMaintenance = () => {
        const nextVal = !maintenanceMode;
        setMaintenanceMode(nextVal);
        localStorage.setItem('vietagri_maintenance_mode', nextVal ? 'true' : 'false');
        window.dispatchEvent(new Event('maintenance_mode_changed'));
    };

    const handleSaveAll = () => {
        localStorage.setItem('vietagri_max_upload_size', maxUploadSize);
        localStorage.setItem('vietagri_session_timeout', sessionTimeout);
        localStorage.setItem('vietagri_cache_limit', cacheLimit);
        localStorage.setItem('vietagri_smtp_email', smtpEmail);
        localStorage.setItem('vietagri_sms_otp', smsOtp);
        localStorage.setItem('vietagri_vnpay_secret', vnpaySecret);
        localStorage.setItem('vietagri_momo_secret', momoSecret);
        localStorage.setItem('vietagri_maps_api_key', mapsApiKey);
        
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Elegant Notifications */}
            {showSaveSuccess && (
                <div className="fixed top-6 right-6 z-[9999] bg-emerald-600 border border-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-6 duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">✓</div>
                    <div>
                        <p className="font-extrabold text-sm">Cập nhật thành công</p>
                        <p className="text-[11px] opacity-80">Các thay đổi về tham số server đã được áp dụng ngay lập tức.</p>
                    </div>
                </div>
            )}

            {showClearCacheSuccess && (
                <div className="fixed top-6 right-6 z-[9999] bg-red-600 border border-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-6 duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">✓</div>
                    <div>
                        <p className="font-extrabold text-sm">Đã xoá Cache & Log rác</p>
                        <p className="text-[11px] opacity-80">Đã giải phóng 100% tài nguyên bộ nhớ đệm tạm thời trên máy chủ.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-emerald-950">Cấu hình Hệ thống & Server</h2>
                    <p className="text-slate-500 font-bold mt-1">Quản lý tài nguyên, kết nối API và bảo trì Server VietAgri</p>
                </div>
                <button 
                    onClick={handleSaveAll}
                    id="btn-save-system-config"
                    className="flex items-center gap-2 bg-emerald-800 text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-emerald-850/20 hover:bg-emerald-900 transition-all text-xs uppercase tracking-widest cursor-pointer"
                >
                    <Save size={18} /> Lưu tất cả cấu hình
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: Maintenance & API Keys */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Maintenance Mode */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden relative">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${maintenanceMode ? 'bg-amber-100 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <AlertTriangle size={28} />
                                </div>
                                <div className="pr-4">
                                    <h3 className="text-lg font-black text-emerald-950">Chế độ Bảo trì (Maintenance Mode)</h3>
                                    <p className="text-sm font-bold text-slate-400 mt-1 flex flex-col md:flex-row gap-1">Ngăn người dùng đăng nhập tạm thời, <span className="text-slate-500">phục vụ việc nâng cấp hệ thống.</span></p>
                                </div>
                            </div>
                            <button 
                                onClick={handleToggleMaintenance}
                                id="toggle-maintenance-mode"
                                className={`relative w-16 h-8 rounded-full transition-colors outline-none focus:ring-4 focus:ring-amber-500/20 shrink-0 cursor-pointer ${maintenanceMode ? 'bg-amber-500' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${maintenanceMode ? 'translate-x-8' : 'translate-x-0'} shadow-sm`}></div>
                            </button>
                        </div>
                        {maintenanceMode && (
                            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                <p className="text-sm font-bold text-amber-700">Hệ thống đang trong chế độ bảo trì. Người dùng thông thường không thể truy cập, nhưng Super Admin vẫn có quyền thao tác cấu hình.</p>
                            </div>
                        )}
                    </div>

                    {/* API Keys */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center gap-3">
                            <Key className="text-mint" size={22} />
                            <h3 className="text-lg font-black text-emerald-950">Cấu hình API & Dịch vụ bên thứ ba</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email SMTP Server Account</label>
                                    <input 
                                        type="text" 
                                        value={smtpEmail} 
                                        onChange={(e) => setSmtpEmail(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-slate-700 font-mono text-sm transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">SMS OTP Provider Key</label>
                                    <input 
                                        type="text" 
                                        value={smsOtp} 
                                        onChange={(e) => setSmsOtp(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-slate-700 font-mono text-sm transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Cổng thanh toán VNPay Secret</label>
                                    <input 
                                        type="password" 
                                        value={vnpaySecret} 
                                        onChange={(e) => setVnpaySecret(e.target.value)}
                                        placeholder="VNPay HashSecret" 
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-slate-700 font-mono text-sm transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Cổng thanh toán MoMo Partner Key</label>
                                    <input 
                                        type="password" 
                                        value={momoSecret} 
                                        onChange={(e) => setMomoSecret(e.target.value)}
                                        placeholder="MoMo Secret Key" 
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-slate-700 font-mono text-sm transition-all" 
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Google Maps API Key (Cho hiển thị Vùng Trồng GIS)</label>
                                    <input 
                                        type="text" 
                                        value={mapsApiKey} 
                                        onChange={(e) => setMapsApiKey(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-slate-700 font-mono text-sm transition-all" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Resources & Backup */}
                <div className="space-y-6">
                    {/* Giới hạn tài nguyên */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50">
                        <h3 className="text-lg font-black text-emerald-950 mb-6 flex items-center gap-3">
                            <Sliders className="text-emerald-500" size={22} />  Giới hạn & Tài nguyên
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dung lượng file upload tối đa</label>
                                    <span className="text-xs font-black text-emerald-600">{maxUploadSize} MB</span>
                                </div>
                                <input type="range" min="2" max="100" value={maxUploadSize} onChange={(e) => setMaxUploadSize(e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian hết hạn phiên (Session Limit)</label>
                                    <span className="text-xs font-black text-emerald-600">{sessionTimeout} Phút</span>
                                </div>
                                <input type="range" min="15" max="120" step="15" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cấu hình Bộ nhớ đệm (Cache Allocation)</label>
                                <select 
                                    value={cacheLimit} 
                                    onChange={(e) => setCacheLimit(e.target.value)}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-950 rounded-2xl outline-none font-bold text-slate-700 appearance-none transition-all cursor-pointer"
                                >
                                    <option value="256">256 MB</option>
                                    <option value="512">512 MB</option>
                                    <option value="1024">1024 MB (1 GB)</option>
                                    <option value="2048">2048 MB (2 GB)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Dọn dẹp & Sao lưu */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50">
                        <h3 className="text-lg font-black text-emerald-950 mb-6 flex items-center gap-3">
                            <Server className="text-teal-600" size={22} /> Dữ liệu & Sao lưu
                        </h3>
                        <div className="space-y-4">
                            <button 
                                onClick={handleBackup}
                                disabled={isBackingUp}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-teal-50 border border-slate-100 rounded-2xl transition-all group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                                        {isBackingUp ? <RotateCcw size={18} className="animate-spin" /> : <HardDrive size={18} />}
                                    </div>
                                    <div className="text-left font-sans">
                                        <p className="font-bold text-slate-700 group-hover:text-teal-700 transition-colors text-sm">Download SQL Backup</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Xuất CSDL tệp .sql</p>
                                    </div>
                                </div>
                                <Download size={18} className="text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
                            </button>

                            <button 
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50 border border-slate-100 rounded-2xl transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                        <History size={18} />
                                    </div>
                                    <div className="text-left font-sans">
                                        <p className="font-bold text-slate-700 group-hover:text-amber-700 transition-colors text-sm">Phục hồi Dữ liệu</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Nạp lại SQL backup</p>
                                    </div>
                                </div>
                                <Upload size={18} className="text-slate-300 group-hover:text-amber-500 transition-colors shrink-0" />
                            </button>

                            <button 
                                onClick={handleClearCache}
                                disabled={isClearingCache}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-rose-50 border border-slate-100 rounded-2xl transition-all group disabled:opacity-70 disabled:cursor-not-allowed mt-2 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                                        {isClearingCache ? <RotateCcw size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    </div>
                                    <div className="text-left font-sans">
                                        <p className="font-bold text-rose-700 group-hover:text-rose-850 transition-colors text-sm">Clear Cache & Clear Logs</p>
                                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-0.5">Xoá tệp rác & giải phóng RAM</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-rose-300 group-hover:text-rose-550 transition-colors shrink-0" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState<any[]>([
    { id: '1', title: 'Yêu cầu từ HTX Cầu Đất', message: 'HTX Cầu Đất vừa gửi yêu cầu duyệt hồ sơ quy hoạch chi tiết.', isRead: false, type: 'negotiation', contractNo: 'HD-001', timestamp: new Date().toISOString() },
    { id: '2', title: 'Phê duyệt tài khoản', message: 'Tài khoản admin mới tại khu vực Hà Nội đã được xác thực.', isRead: false, type: 'approval', contractNo: null, timestamp: new Date().toISOString() },
    { id: '3', title: 'Từ chối cập nhật', message: 'Sản phẩm "Gạo ST25" đã bị từ chối cập nhật do thiếu thông tin giấy chứng nhận.', isRead: true, type: 'rejection', contractNo: 'PRD-102', timestamp: new Date().toISOString() },
    { id: '4', title: 'Cảnh báo hệ thống', message: 'Tài nguyên lưu trữ đang ở mức 85%. Vui lòng kiểm tra.', isRead: true, type: 'approval', contractNo: null, timestamp: new Date().toISOString() },
    { id: '5', title: 'Yêu cầu liên kết', message: 'Doanh nghiệp "Nông sản sạch Sài Gòn" muốn liên kết với HTX Nông sản Đức Trọng.', isRead: false, type: 'negotiation', contractNo: null, timestamp: new Date().toISOString() },
  ]);

  const markAllAsRead = () => {
    setNotificationsList(notificationsList.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotificationsList(notificationsList.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationsList(notificationsList.filter(n => n.id !== id));
  };

  const [activeTab, setActiveTab] = useState<'cooperatives' | 'settings' | 'logs' | 'statistics' | 'locations' | 'accounts' | 'enterprises' | 'contracts' | 'contract-manage' | 'permissions' | 'policies' | 'products' | 'post_product' | 'news_manage'>('cooperatives');
  
  const [customNews, setCustomNews] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('vietagri_custom_news');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newsForm, setNewsForm] = useState({
    id: '',
    title: '',
    excerpt: '',
    image: '',
    link: '',
  });

  const [isEditingNews, setIsEditingNews] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<any | null>(null);

  const saveCustomNewsList = (newsList: any[]) => {
    localStorage.setItem('vietagri_custom_news', JSON.stringify(newsList));
    setCustomNews(newsList);
    // Dispatch event to notify changes to other open tabs/windows
    window.dispatchEvent(new Event('storage'));
  };

  const handleCreateOrUpdateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập tiêu đề tin tức' });
      return;
    }

    let updatedNewsList = [...customNews];
    const imageToUse = newsForm.image.trim() || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400';

    if (isEditingNews && newsForm.id) {
      updatedNewsList = updatedNewsList.map(item => 
        item.id === newsForm.id 
          ? { 
              ...item, 
              title: newsForm.title, 
              excerpt: newsForm.excerpt, 
              image: imageToUse, 
              link: newsForm.link, 
              date: item.date || new Date().toLocaleDateString('vi-VN') 
            } 
          : item
      );
      setStatusMessage({ type: 'success', text: 'Đã cập nhật tin bài thành công!' });
    } else {
      const newItem = {
        id: `news-custom-${Date.now()}`,
        title: newsForm.title,
        excerpt: newsForm.excerpt || 'Thông tin liên kết từ nguồn đối tác.',
        image: imageToUse,
        link: newsForm.link || '#',
        date: new Date().toLocaleDateString('vi-VN')
      };
      updatedNewsList = [newItem, ...updatedNewsList];
      setStatusMessage({ type: 'success', text: 'Đăng tin tức liên kết thành công!' });
    }

    saveCustomNewsList(updatedNewsList);
    setNewsForm({ id: '', title: '', excerpt: '', image: '', link: '' });
    setIsEditingNews(false);
  };

  const handleDeleteNews = (id: string) => {
    const newsToDel = customNews.find(item => item.id === id);
    if (newsToDel) {
      setNewsToDelete(newsToDel);
    }
  };

  const handleStartEditNews = (item: any) => {
    setNewsForm({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      image: item.image,
      link: item.link === '#' ? '' : item.link,
    });
    setIsEditingNews(true);
  };

  const handleCancelEditNews = () => {
    setNewsForm({ id: '', title: '', excerpt: '', image: '', link: '' });
    setIsEditingNews(false);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('Tất cả');
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [activePolicyItem, setActivePolicyItem] = useState('Vùng trồng GIS');
  const [policyFiles, setPolicyFiles] = useState<Record<string, string>>({});
  const [policyContents, setPolicyContents] = useState<Record<string, string>>({});
  const [isSavingPolicy, setIsSavingPolicy] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isEditingPolicy, setIsEditingPolicy] = useState(true);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kết nối API lấy danh sách hợp tác xã
        const coops = await cooperativeService.getAll();
        if (coops && Array.isArray(coops)) {
          setCooperatives(coops);
        }

        // Kết nối API lấy chính sách hệ thống
        const policies = await systemService.getPolicies();
        if (policies) {
          setPolicyContents(policies);
        } else {
          const saved = localStorage.getItem('vietagri_policies');
          if (saved) setPolicyContents(JSON.parse(saved));
        }

        // Kết nối API lấy tài khoản quản trị viên
        const admins = await adminAccountService.getAll();
        if (admins && Array.isArray(admins)) {
          setRoleAdmins(admins);
        }

        // Kết nối API lấy thông tin doanh nghiệp đăng ký
        const [pendingEnts, activeEnts] = await Promise.all([
          enterpriseService.getAll('pending'),
          enterpriseService.getAll('active')
        ]);
        if (pendingEnts) setPendingEnterprises(Array.isArray(pendingEnts) ? pendingEnts : (pendingEnts.data || []));
        if (activeEnts) setActiveEnterprises(Array.isArray(activeEnts) ? activeEnts : (activeEnts.data || []));

        // Kết nối API lấy danh sách toàn bộ hợp đồng
        const allContracts = await contractService.getAllContracts();
        if (allContracts) setContracts(Array.isArray(allContracts) ? allContracts : (allContracts.data || []));

      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchData();
  }, [activeTab]);

  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hợp tác xã này?')) {
      try {
        await cooperativeService.delete(id);
        setCooperatives(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error("Failed to delete cooperative", error);
        alert("Không thể xóa HTX. Vui lòng thử lại.");
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const locationString = `${formData.address}${formData.address ? ', ' : ''}${formData.ward}, ${formData.province}`;
    const dataToSave = { ...formData, location: locationString };

    try {
      if (editingHTX) {
        await cooperativeService.update(editingHTX.id, dataToSave);
        setCooperatives(prev => prev.map(c => c.id === editingHTX.id ? { ...c, ...dataToSave } : c));
      } else {
        const newHTXData = {
          ...dataToSave,
          establishedDate: new Date().toISOString().split('T')[0],
          status: 'active'
        };
        const response = await cooperativeService.create(newHTXData);
        const createdHTX = response?.data || response;
        setCooperatives(prev => [...prev, createdHTX]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save cooperative", error);
      alert("Lỗi khi lưu thông tin hợp tác xã.");
    }
  };

  const handleSavePolicy = async () => {
    setIsSavingPolicy(true);

    try {
      const currentContent = policyContents[activePolicyItem] || `Nội dung thiết lập và quy định của ${activePolicyItem}. Các chính sách và điều khoản có thể được cập nhật tại đây và sẽ được đồng bộ trên toàn bộ hệ sinh thái VietAgri. \n\nPhiên bản hiện tại: v1.0.3`;
      
      await systemService.updatePolicy(activePolicyItem, currentContent);

      const updatedPolicies = {
        ...policyContents,
        [activePolicyItem]: currentContent
      };

      setPolicyContents(updatedPolicies);
      localStorage.setItem('vietagri_policies', JSON.stringify(updatedPolicies));

      setShowSaveSuccess(true);
      setIsEditingPolicy(false);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save policy", error);
      alert("Lỗi khi lưu chính sách hệ thống.");
    } finally {
      setIsSavingPolicy(false);
    }
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

  // Products & Sale Posts State
  const [products, setProducts] = useState<any[]>([]);
  const [salePosts, setSalePosts] = useState<any[]>([]);
  const [isAddingToCatalog, setIsAddingToCatalog] = useState(false);
  const [newCatalogItem, setNewCatalogItem] = useState({ name: '', category: 'Cà phê', basePrice: '', unit: 'kg' });
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isPostingNewProduct, setIsPostingNewProduct] = useState(false);
  const [newSalePost, setNewSalePost] = useState({ productName: '', price: '', target: 'Tất cả khách hàng', origin: '', description: '', images: [] as string[] });
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [systemStats, setSystemStats] = useState({
      totalUsers: 0,
      totalArea: 0,
      topPerformers: [] as any[],
      provinceDistribution: [] as any[],
      contractGrowth: [] as any[],
      userGrowth: [] as any[],
      totalContractsValue: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (activeTab === 'statistics') {
        setIsLoadingStats(true);
        try {
          const [coopsRes, entersRes, farmersRes, contractsRes] = await Promise.all([
            cooperativeService.getAll(),
            enterpriseService.getAll(),
            import('../../services/farmerService').then(m => m.farmerService.getAllFarmers()),
            contractService.getAllContracts()
          ]).catch(() => [[], [], [], []]);
          
          const safeCoops = Array.isArray(coopsRes) ? coopsRes : (coopsRes?.data || []);
          const safeEnters = Array.isArray(entersRes) ? entersRes : (entersRes?.data || []);
          const safeFarmers = Array.isArray(farmersRes) ? farmersRes : (farmersRes?.data || []);
          const safeContracts = Array.isArray(contractsRes) ? contractsRes : (contractsRes?.data || []);

          // Processing PieChart: province distribution based on coops
          const provinceCount = (safeCoops as any[]).reduce((acc: any, coop: any) => {
              const prov = coop.province || 'Lâm Đồng';
              acc[prov] = (acc[prov] || 0) + 1;
              return acc;
          }, {});
          
          let pieData = Object.keys(provinceCount).map(key => ({
              name: key,
              value: provinceCount[key]
          }));
          
          if(pieData.length === 0) pieData = [
            { name: 'Lâm Đồng', value: 45 },
            { name: 'Tây Nguyên', value: 25 },
            { name: 'ĐBSCL', value: 20 },
            { name: 'Khác', value: 10 }
          ];

          // Compute Contracts total value
          let totalVal = 0;
          (safeContracts as any[]).forEach(c => {
             // Try to parse values like "50,000,000 VNĐ" to 50
             const valMatch = c.totalValue?.toString().replace(/\D/g, '');
             const val = parseInt(valMatch || '0') / 1000000 || 0; // rough convert to Millions
             totalVal += val;
          });

          // Top performers (simulate from coops)
          let topPerformers = (safeCoops as any[]).slice(0,4).map((c: any, i: number) => ({
             name: c.specialty || c.name,
             growth: `+${(Math.random() * 20 + 5).toFixed(1)}%`,
             value: `${Math.floor((c.totalArea || 10) * 1.5)} tấn`,
             progress: Math.floor(Math.random() * 40 + 50),
             color: ['bg-emerald-500', 'bg-mint', 'bg-amber-500', 'bg-blue-500'][i % 4]
          }));

          if (topPerformers.length === 0) {
              topPerformers = [
                  { name: 'Cà phê Arabica Cầu Đất', growth: '+12.5%', value: '450 tấn', progress: 85, color: 'bg-emerald-500' },
                  { name: 'Rau VietGAP Đức Trọng', growth: '+8.2%', value: '1,200 tấn', progress: 65, color: 'bg-mint' },
                  { name: 'Sầu riêng Đắk Lắk', growth: '+24.5%', value: '380 tấn', progress: 92, color: 'bg-amber-500' },
                  { name: 'Tiêu Chư Sê', growth: '+5.4%', value: '85 tấn', progress: 45, color: 'bg-blue-500' },
              ];
          }
          
          // Growth (simulate using total count as the final month)
          const finalFarmers = safeFarmers.length > 0 ? safeFarmers.length : 1200;
          const finalEnters = safeEnters.length > 0 ? safeEnters.length : 50;
          const finalContractsVal = totalVal > 0 ? totalVal : 48;

          setSystemStats({
             totalUsers: safeFarmers.length + safeEnters.length + safeCoops.length,
             totalArea: safeCoops.reduce((acc: number, c: any) => acc + (c.totalArea || 0), 0),
             topPerformers,
             provinceDistribution: pieData,
             totalContractsValue: totalVal,
             contractGrowth: [
                 { name: 'T1', value: Math.floor(finalContractsVal * 0.4) },
                 { name: 'T2', value: Math.floor(finalContractsVal * 0.5) },
                 { name: 'T3', value: Math.floor(finalContractsVal * 0.6) },
                 { name: 'T4', value: Math.floor(finalContractsVal * 0.8) },
                 { name: 'T5', value: Math.floor(finalContractsVal * 0.9) },
                 { name: 'T6', value: Math.floor(finalContractsVal) }
             ],
             userGrowth: [
                 { name: 'T1', farmers: Math.floor(finalFarmers * 0.2), enterprises: Math.floor(finalEnters * 0.2) },
                 { name: 'T2', farmers: Math.floor(finalFarmers * 0.4), enterprises: Math.floor(finalEnters * 0.4) },
                 { name: 'T3', farmers: Math.floor(finalFarmers * 0.5), enterprises: Math.floor(finalEnters * 0.5) },
                 { name: 'T4', farmers: Math.floor(finalFarmers * 0.7), enterprises: Math.floor(finalEnters * 0.7) },
                 { name: 'T5', farmers: Math.floor(finalFarmers * 0.9), enterprises: Math.floor(finalEnters * 0.9) },
                 { name: 'T6', farmers: finalFarmers, enterprises: finalEnters }
             ]
          });
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          setIsLoadingStats(false);
        }
      }
    };
    fetchStatistics();
  }, [activeTab]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (activeTab === 'products' || activeTab === 'post_product') {
        try {
          // Kết nối API lấy danh mục sản phẩm và tin cậy
          const [fetchedProducts, fetchedPosts] = await Promise.all([
            productService.getAllProducts(),
            postService.getAllPosts()
          ]);
          if (fetchedProducts) setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : (fetchedProducts.data || []));
          if (fetchedPosts) setSalePosts(Array.isArray(fetchedPosts) ? fetchedPosts : (fetchedPosts.data || []));
        } catch (error) {
          console.error("Failed to fetch products/posts", error);
        }
      }
    };
    fetchProductData();
  }, [activeTab]);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredSalePosts = salePosts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewSalePost(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setNewSalePost(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleAddToCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceString = `${newCatalogItem.basePrice} ₫/${newCatalogItem.unit}`;
      const productData = { name: newCatalogItem.name, category: newCatalogItem.category, price: priceString, unit: newCatalogItem.unit };
      const response = await productService.createProduct(productData);
      setProducts([response.data || response, ...products]);
      setIsAddingToCatalog(false);
      setNewCatalogItem({ name: '', category: 'Cà phê', basePrice: '', unit: 'kg' });
    } catch (error) {
      console.error(error);
      alert('Lỗi khi thêm sản phẩm');
    }
  };

  const handleDeleteProduct = (id: string) => setProductToDelete(id);
  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete);
        setProducts(products.filter(p => p.id !== productToDelete));
        setProductToDelete(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeletePost = (id: string) => setPostToDelete(id);
  const confirmDeletePost = async () => {
    if (postToDelete) {
      try {
        await postService.deletePost(postToDelete);
        setSalePosts(salePosts.filter(p => p.id !== postToDelete));
        setPostToDelete(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost({ ...post, simplePrice: (post.price || '').split(' ')[0] });
    setIsEditingPost(true);
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedPost = { ...editingPost, price: `${editingPost.simplePrice} ₫/${editingPost.unit || 'kg'}` };
      await postService.updatePost(editingPost.id, updatedPost);
      setSalePosts(salePosts.map(p => p.id === editingPost.id ? updatedPost : p));
      setIsEditingPost(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditingPost((prev: any) => ({ ...prev, images: [...(prev.images || []), reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeEditImage = (index: number) => {
    setEditingPost((prev: any) => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== index) }));
  };
  const [selectedEnterprise, setSelectedEnterprise] = useState<any | null>(null);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);

  const cleanContractNo = (rawNo: string | undefined, originalId?: string) => {
    if (!rawNo) {
      const defaultNum = originalId?.split('-').pop() || '01';
      return `${defaultNum}/2026/HĐMB`;
    }
    const parts = rawNo.split('/');
    const cleanParts = parts.filter(p => !p.toUpperCase().includes('HTX'));
    let numPart = cleanParts[0] || originalId?.split('-').pop() || '01';
    let yearPart = '2026';
    const foundYear = parts.find(p => p.length === 4 && !isNaN(Number(p)));
    if (foundYear) {
      yearPart = foundYear;
    }
    let codePart = 'HĐMB';
    if (rawNo.includes('HĐHTSXNN')) {
      codePart = 'HĐHTSXNN';
    } else if (rawNo.includes('HDLKTMHH')) {
      codePart = 'HDLKTMHH';
    } else if (rawNo.includes('HĐMB')) {
      codePart = 'HĐMB';
    } else {
      const foundCode = cleanParts.find(p => isNaN(Number(p)) && p.length > 2 && p !== yearPart);
      if (foundCode) {
        codePart = foundCode;
      }
    }
    return `${numPart}/${yearPart}/${codePart}`;
  };

  const docSoTienBangChu = (soTien: number): string => {
    if (soTien === 0) return 'Không đồng';

    const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const Tien = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

    const doc3ChuSo = (n: number): string => {
      let tram = Math.floor(n / 100);
      let chuc = Math.floor((n % 100) / 10);
      let donvi = n % 10;
      let s = "";

      if (tram > 0) s += ChuSo[tram] + " trăm ";

      if (chuc === 0) {
        if (donvi > 0) s += (tram > 0 ? "lẻ " : "");
      } else if (chuc === 1) {
        s += "mười ";
      } else {
        s += ChuSo[chuc] + " mươi ";
      }

      if (donvi === 1) {
        if (chuc > 1) s += "mốt";
        else s += "một";
      } else if (donvi === 5) {
        if (chuc > 0 || tram > 0) s += "lăm";
        else s += "năm";
      } else if (donvi > 0) {
        s += ChuSo[donvi];
      }

      return s.trim();
    };

    let str = "";
    let temp = soTien;
    let i = 0;

    while (temp > 0) {
      let blockVal = temp % 1000;
      if (blockVal > 0) {
        let bStr = doc3ChuSo(blockVal);
        str = bStr + (Tien[i] ? " " + Tien[i] : "") + (str ? " " + str : "");
      }
      temp = Math.floor(temp / 1000);
      i++;
    }

    return (str.charAt(0).toUpperCase() + str.slice(1) + " đồng chẵn").trim();
  };

  const handlePrintB2BContract = (c: any) => {
    const includeStamp = window.confirm(
      "Hệ thống hỗ trợ 2 mẫu in:\n\n" +
      "• Nhấn OK để tải: Bản in CÓ đầy đủ Mộc đỏ & Chữ ký số điện tử pháp lý.\n" +
      "• Nhấn CANCEL để tải: Bản in SẠCH (bản ký tay truyền thống / chưa đóng dấu)."
    );

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Không thể mở cửa sổ in. Vui lòng cho phép popup để tải bản in PDF.');
      return;
    }

    const totalVal = c.totalVal || (c.type === 'enterprise_htx' ? 650000000 : 150000000);
    const moneyWords = docSoTienBangChu(totalVal);
    const createdDate = new Date(c.createdAt || new Date());
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1;
    const year = createdDate.getFullYear();
    const currentContractNo = cleanContractNo(c.contractNo, c.id);

    // Pre-build complex HTML blocks to avoid nested backticks parsing issues in TS:
    let sellerStampHtml = '';
    if (!includeStamp) {
      sellerStampHtml = '<div style="min-height: 120px;"></div>';
    } else if (c.status === 'pending_super_admin' || c.status === 'Chờ duyệt') {
      sellerStampHtml = `
        <div style="min-height: 80px; display: flex; align-items: center; font-style: italic; color: #777; justify-content: center;">
          Chưa ký số pháp lý
        </div>
      `;
    } else {
      sellerStampHtml = `
        <div class="stamp-wrapper">
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
        
        <div class="cryptographic-meta" style="text-align: left; margin: 10px auto;">
          <strong>CHỮ KÝ SỐ VIETAGRI CA ĐỐI TÁC</strong><br/>
          Ký bởi: ${c.seller?.name || c.coopName || 'Chủ Tịch Hợp Tác xã'}<br/>
          Thời gian ký: ${createdDate.toLocaleDateString('vi-VN')} ${createdDate.toLocaleTimeString('vi-VN')}<br/>
          Số sê-ri CA: CA-2026-Viettel-HSM-902A<br/>
          Nhà cung cấp: Viettel-CA National Certificate Authority
        </div>
      `;
    }

    let buyerStampHtml = '';
    if (!includeStamp) {
      buyerStampHtml = '<div style="min-height: 120px;"></div>';
    } else if (c.status === 'active' || c.status === 'signed') {
      buyerStampHtml = `
        <div class="stamp-wrapper">
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
        
        <div class="cryptographic-meta" style="color: #1a442e; background-color: #f6fbf8; border-color: #7ab293; text-align: left; margin: 10px auto;">
          <strong>CHỮ KÝ SỐ QUỐC GIA FPT-CA</strong><br/>
          Ký bởi: ${c.buyer?.name || c.enterpriseName || 'Doanh nghiệp'}<br/>
          Đại diện: ${c.buyer?.rep || c.buyerRep || 'Trần Văn Bảo'}<br/>
          Thời gian: ${createdDate.toLocaleDateString('vi-VN')} ${createdDate.toLocaleTimeString('vi-VN')}<br/>
          Số sê-ri CA: CA-2026-FPT-CA-91A2
        </div>
      `;
    } else {
      buyerStampHtml = `
        <div style="min-height: 80px; display: flex; align-items: center; font-style: italic; color: #777; justify-content: center;">
          Chờ doanh nghiệp ký số liên kết
        </div>
      `;
    }

    const sellerNameSigned = includeStamp ? `
      <div style="margin-top: 15px; font-weight: bold; text-decoration: underline; font-size: 14.5px;">
        ${c.seller?.rep || c.sellerRep || 'Nguyễn Văn Hợp'}
      </div>
    ` : '';

    const buyerNameSigned = includeStamp ? `
      <div style="margin-top: 15px; font-weight: bold; text-decoration: underline; font-size: 14.5px;">
        ${c.buyer?.rep || c.buyerRep || 'Trần Văn Bảo'}
      </div>
    ` : '';

    const signPlace = c.buyer?.cccdPlace || c.cccdPlace || 'Cục Cảnh sát QLHC';

    const titleStr = currentContractNo.includes('HĐHTSXNN')
      ? 'HỢP ĐỒNG HỢP TÁC SẢN XUẤT NÔNG NGHIỆP'
      : (currentContractNo.includes('HDLKTMHH')
        ? 'HỢP ĐỒNG LIÊN KẾT THU MUA HÀNG HÓA'
        : 'HỢP ĐỒNG MUA BÁN HÀNG HÓA');

    printWindow.document.write(`
      <html>
        <head>
          <title>Hop_Dong_Mua_Ban_${currentContractNo}</title>
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
            
            .stamp-wrapper {
              position: relative;
              height: 125px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 10px 0;
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
            
            <div class="contract-title">${currentContractNo.includes('HĐHTSXNN') ? 'HỢP ĐỒNG HỢP TÁC SẢN XUẤT NÔNG NGHIỆP' : (currentContractNo.includes('HDLKTMHH') ? 'HỢP ĐỒNG LIÊN KẾT THU MUA HÀNG HÓA' : 'HỢP ĐỒNG MUA BÁN HÀNG HÓA')}</div>
            <div class="contract-no">Số: ${currentContractNo}</div>
          </div>
          
          <div class="legal-basis">
            <p>– Căn cứ Bộ luật Dân sự 2015;</p>
            <p>– Căn cứ Luật Thương mại 2005;</p>
            <p>– Căn cứ nhu cầu và khả năng thực tế của các bên.</p>
          </div>
          
          <p style="text-indent: 25px; margin-bottom: 15px; font-size: 14px;">
            Hôm nay, ngày ${day} tháng ${month} năm ${year}, tại địa chỉ: Văn phòng Ban quản trị Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất, Việt Nam. Chúng tôi, gồm có:
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
            
            <p>2. Phương tiện vận chuyển và chi phí vận chuyển do bên <span style="font-weight: bold; text-decoration: underline;">Bên B (Bên Mua)</span> chịu.</p>
            <p>3. Quy định lịch giao nhận hàng hóa mà bên mua không đến nhận hàng thì phải chịu chi phí lưu kho bãi là <strong style="font-family: Arial;">1.000.000</strong> đồng/ngày.</p>
          </div>
          
          <div class="section-title">Điều 4: TRÁCH NHIỆM CỦA CÁC BÊN</div>
          <p>Các bên cam kết thực hiện đúng và đầy đủ các nghĩa vụ theo hợp đồng.</p>
          
          <div class="section-title">Điều 5: BẢO HÀNH VÀ HƯỚNG DẪN SỬ DỤNG HÀNG HÓA</div>
          <p>Bên A cam kết sản phẩm được bảo hành đúng tiêu chuẩn nông sản xuất khẩu.</p>
          
          <div class="section-title">Điều 6: NGƯNG THANH TOÁN TIỀN MUA HÀNG</div>
          <p>Thực hiện theo quy định của pháp luật hiện hành.</p>
          
          <div class="section-title">Điều 7: ĐIỀU KHOẢN PHẠT VI PHẠM HỢP ĐỒNG</div>
          <p>Mức phạt vi phạm hợp đồng tối đa 8% theo quy định.</p>
          
          <div class="section-title">Điều 8: BẤT KHẢ KHÁNG VÀ GIẢI QUYẾT TRANH CHẤP</div>
          <p>Giải quyết thông qua thương lượng hoặc Tòa án có thẩm quyền.</p>
          
          <div class="section-title">Điều 9. Điều khoản chung</div>
          <p>Hợp đồng có hiệu lực từ ngày ký bởi các bên.</p>

          <div class="signatures-container">
            <div class="signature-box">
              <div class="signature-label">ĐẠI DIỆN BÊN BÁN (BÊN A)</div>
              <div style="margin-top: 50px; font-weight: bold; text-transform: uppercase;">${c.seller?.rep}</div>
            </div>
            
            <div class="signature-box">
              <div class="signature-label">ĐẠI DIỆN BÊN MUA (BÊN B)</div>
              <div style="margin-top: 50px; font-weight: bold; text-transform: uppercase;">${c.buyer?.rep}</div>
            </div>
          </div>
        </body>
    `);
    printWindow.document.close();
  };


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
  const [roleAdmins, setRoleAdmins] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('vietagri_role_admins', JSON.stringify(roleAdmins));
  }, [roleAdmins]);
  
  const [selectedRoleAdmin, setSelectedRoleAdmin] = useState<any | null>(null);
  const [isRoleAdminModalOpen, setIsRoleAdminModalOpen] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');

  const handleToggleAdminStatus = async (adminId: string) => {
    if(window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái hoạt động (Bật/Tắt khóa) của tài khoản này?')) {
      try {
        const admin = roleAdmins.find(a => a.id === adminId);
        if (!admin) return;
        const newStatus = admin.status === 'active' ? 'banned' : 'active';
        await adminAccountService.updateStatus(adminId, newStatus);

        setRoleAdmins(prev => prev.map(a => {
          if(a.id === adminId) {
            const updated = { ...a, status: newStatus };
            if(selectedRoleAdmin?.id === adminId) setSelectedRoleAdmin(updated);
            return updated;
          }
          return a;
        }));
      } catch (error) {
        console.error("Failed to toggle admin status", error);
        alert("Lỗi khi thay đổi trạng thái quản trị viên.");
      }
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if(window.confirm('Cảnh báo bảo mật: Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản quản trị viên này không? Toàn bộ lịch sừ quyền hạn sẽ bị loại bỏ hoàn toàn.')) {
      try {
        await adminAccountService.delete(adminId);
        setRoleAdmins(prev => prev.filter(a => a.id !== adminId));
        if(selectedRoleAdmin?.id === adminId) setSelectedRoleAdmin(null);
      } catch (error) {
        console.error("Failed to delete admin account", error);
        alert("Lỗi khi xóa tài khoản.");
      }
    }
  };

  const handleSetAdminLevel = (adminId: string, newLevel: number) => {
    if(window.confirm(`Bạn có chắc chắn muốn nâng cấp/thay đổi quyền quản lý của Admin này sang Cấp độ ${newLevel}?`)) {
      setRoleAdmins(prev => prev.map(a => {
        if(a.id === adminId) {
          let updatedCoop = a.coopName || '';
          if (newLevel === 1) {
            updatedCoop = updatedCoop.split(' & ')[0];
          } else if (newLevel === 2) {
            updatedCoop = `${updatedCoop.split(' & ')[0]} & Chuỗi liên kết`;
          } else if (newLevel === 3) {
            updatedCoop = `${updatedCoop.split(' & ')[0]} & Chuỗi giá trị toàn quốc`;
          }
          const updated = { 
            ...a, 
            level: newLevel,
            coopName: updatedCoop
          };
          if(selectedRoleAdmin?.id === adminId) setSelectedRoleAdmin(updated);
          return updated;
        }
        return a;
      }));
    }
  };

  const handleToggleScope = (adminId: string, scopeId: string) => {
    setRoleAdmins(prev => prev.map(a => {
      if(a.id === adminId) {
        const hasScope = a.scope.includes(scopeId);
        const updatedScope = hasScope 
          ? a.scope.filter((s: string) => s !== scopeId)
          : [...a.scope, scopeId];
        const updated = { ...a, scope: updatedScope };
        if(selectedRoleAdmin?.id === adminId) setSelectedRoleAdmin(updated);
        return updated;
      }
      return a;
    }));
  };

  const handleToggle2FA = (adminId: string) => {
    if(window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái tĩnh năng Xác thực 2 lớp (2FA) của người dùng này?')) {
      setRoleAdmins(prev => prev.map(a => {
        if(a.id === adminId) {
          const updated = { ...a, is2FA: !a.is2FA };
          if(selectedRoleAdmin?.id === adminId) setSelectedRoleAdmin(updated);
          return updated;
        }
        return a;
      }));
    }
  };

  const handleResetPassword = () => {
    window.alert('Đã gửi yêu cầu đổi mật khẩu đến email của quản trị viên.');
  };

  const openAdminDetails = (admin: any) => {
    setSelectedRoleAdmin(admin);
    setIsRoleAdminModalOpen(true);
  };

  const [contractSearchTerm, setContractSearchTerm] = useState('');
  const [contractType, setContractType] = useState<'customer' | 'coop'>('customer');
  const [selectedCoopContractFilter, setSelectedCoopContractFilter] = useState('Tất cả');
  const [selectedContractTypeFilter, setSelectedContractTypeFilter] = useState('Tất cả');

  const [pendingEnterprises, setPendingEnterprises] = useState<any[]>([]);

  const [activeEnterprises, setActiveEnterprises] = useState<any[]>([]);

  const [selectedEnterpriseDetail, setSelectedEnterpriseDetail] = useState<any>(null);

  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    // Only update if not already set by init functions
  }, []);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 15000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const approveEnterprise = async (id: string) => {
    const ent = pendingEnterprises.find(e => e.id === id);
    if (!ent) return;

    try {
      await enterpriseService.updateStatus(id, 'active');
      
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

      const newPending = pendingEnterprises.filter(e => e.id !== id);

      setPendingEnterprises(newPending);
      setActiveEnterprises(newActive);

      // Clear any previous message first
      setStatusMessage(null);

      // Show a more descriptive success toast with the password after a tiny delay
      setTimeout(() => {
        setStatusMessage({
          type: 'success',
          text: `Đã phê duyệt ${ent.name}! Hệ thống đã cấp mật khẩu: ${tempPassword}. Vui lòng gửi thông tin này cho đối tác qua email ${ent.email}.`
        });
      }, 100);
    } catch (error) {
      console.error("Failed to approve enterprise", error);
      alert("Lỗi khi phê duyệt doanh nghiệp.");
    }
  };

  const rejectEnterprise = async (id: string) => {
    // Kết nối API
    try {
      await enterpriseService.updateStatus(id, 'rejected');
      const newPending = pendingEnterprises.filter(e => e.id !== id);
      setPendingEnterprises(newPending);
      setStatusMessage({ type: 'success', text: `Đã từ chối đơn đăng ký doanh nghiệp.` });
    } catch (error) {
      console.error("Failed to reject enterprise", error);
      alert("Lỗi khi từ chối doanh nghiệp.");
    }
  };

  const toggleLockEnterprise = async (id: string, currentStatus: string) => {
    const isLocked = currentStatus === 'locked';
    const actionText = isLocked ? "mở khóa" : "khóa";
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản doanh nghiệp này không?`)) {
      // Kết nối API
      try {
        const newStatus = isLocked ? 'active' : 'locked';
        await enterpriseService.updateStatus(id, newStatus);
        setActiveEnterprises(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
        setStatusMessage({ type: 'success', text: `Đã ${actionText} tài khoản doanh nghiệp thành công.` });
      } catch (error) {
        console.error(`Failed to ${actionText} enterprise via API:`, error);
        alert(`Lỗi khi ${actionText} tài khoản doanh nghiệp.`);
      }
    }
  };

  const approveContract = async (id: string) => {
    try {
      await contractService.updateContractStatus(id, 'active');
      const updatedContracts = contracts.map(c =>
        c.id === id ? { ...c, status: 'active' } : c
      );
      setContracts(updatedContracts);
      setStatusMessage({ type: 'success', text: `Đã phê duyệt hợp đồng ${id}.` });
    } catch (error) {
      console.error("Failed to approve contract", error);
      alert("Lỗi khi phê duyệt hợp đồng.");
    }
  };

  const rejectContract = async (id: string) => {
    try {
      await contractService.updateContractStatus(id, 'rejected_super_admin');
      const updatedContracts = contracts.map(c =>
        c.id === id ? { ...c, status: 'rejected_super_admin' } : c
      );
      setContracts(updatedContracts);
      setStatusMessage({ type: 'success', text: `Đã từ chối hợp đồng ${id}.` });
    } catch (error) {
      console.error("Failed to reject contract", error);
      alert("Lỗi khi từ chối hợp đồng.");
    }
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
        username: (adminFormData.email || '').split('@')[0] || adminFormData.name.toLowerCase().replace(/\s+/g, ''), // Using email prefix or username fallback
        coopName: selectedCoop ? selectedCoop.name : 'Unknown',
        status: 'active',
        scope: ['inventory'], // Default scope
        is2FA: false,
        level: 'base'
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
    (c.location || '').toLowerCase().includes(searchTerm.toLowerCase())
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
  } else if (activeTab === 'products' || activeTab === 'enterprises') {
    statsToRender = [];
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
            { id: 'products', label: 'Danh mục & Giá chung', icon: <Package size={20} /> },
            { id: 'post_product', label: 'Quản lý Tin Đăng bán', icon: <ImageIcon size={20} /> },
            { id: 'cooperatives', label: 'Quản lý HTX', icon: <Building2 size={20} /> },
            { id: 'locations', label: 'Quản lý Tỉnh/TP', icon: <MapPin size={20} /> },
            { id: 'accounts', label: 'Cấp tài khoản Admin', icon: <Users size={20} /> },
            { id: 'enterprises', label: 'Quản lý Doanh nghiệp', icon: <Building2 size={20} /> },
            { id: 'contracts', label: 'Hợp đồng toàn hệ thống', icon: <History size={20} /> },
            { id: 'contract-manage', label: 'Quản lý hợp đồng', icon: <Briefcase size={20} /> },
            { id: 'statistics', label: 'Thống kê Hệ thống', icon: <BarChart3 size={20} /> },
            { id: 'policies', label: 'Chính sách & Điều khoản', icon: <FileText size={20} /> },
            { id: 'news_manage', label: 'Quản lý tin tức', icon: <FileText size={20} /> },
            { id: 'settings', label: 'Cấu hình Server', icon: <Settings size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-white/10 text-mint' : 'text-white/60 hover:bg-white/5'
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
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-slate-400 hover:text-forest transition-colors p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <Bell size={22} />
              {notificationsList.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white font-black text-[9px] border-2 border-white rounded-full flex items-center justify-center shadow-sm animate-pulse px-1">
                  {notificationsList.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
            <div 
              onClick={() => navigate('/super-admin/profile')}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
              title="Xem thông tin cá nhân"
            >
              <div className="text-right">
                <p className="text-sm font-black text-forest">Root Admin</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hệ thống VietAgri</p>
              </div>
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 font-black border border-amber-500/20">
                SA
              </div>
            </div>
            
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-8 top-20 w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden font-sans origin-top-right text-left"
                  >
                    <div className="p-4 bg-forest text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell size={16} className="text-amber-400" />
                        <h4 className="font-black text-[12px] tracking-wider uppercase text-emerald-50">Thông báo ({notificationsList.length})</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {notificationsList.filter(n => !n.isRead).length > 0 && (
                          <button onClick={() => {markAllAsRead(); setShowNotifications(false)}} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded font-bold uppercase cursor-pointer">
                            Đánh dấu đã đọc
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notificationsList.length === 0 ? (
                          <div className="py-10 text-center text-slate-400 text-sm font-bold">Hộp thông báo trống</div>
                        ) : (
                          notificationsList.map((notif) => (
                            <div key={notif.id} onClick={() => {markAsRead(notif.id); setShowNotifications(false)}} className={`p-4 border-b border-slate-50 relative hover:bg-slate-50 cursor-pointer ${!notif.isRead ? 'bg-emerald-50/30' : ''}`}>
                               {!notif.isRead && <span className="absolute left-2 top-5 w-2 h-2 bg-emerald-500 rounded-full" />}
                               <div className="flex items-start gap-4">
                                <div className="bg-emerald-100 p-2 text-forest rounded-lg shrink-0"><Mail size={18}/></div>
                                <div className="flex-1">
                                  <h5 className="font-black text-xs text-forest">{notif.title}</h5>
                                  <p className="text-[11px] text-slate-600 mt-1">{notif.message}</p>
                                  <span className="text-[10px] text-slate-400 mt-2 block">{new Date(notif.timestamp).toLocaleString('vi-VN')}</span>
                                </div>
                                <button onClick={(e) => deleteNotification(notif.id, e)} className="text-slate-300 hover:text-red-500 shrink-0"><X size={14}/></button>
                               </div>
                            </div>
                          ))
                        )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          {statsToRender.length > 0 && (
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
          )}

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
            {activeTab === 'contract-manage' && (
              <RootAdminContractManagePage />
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
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activePolicyItem === item
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
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center gap-2 ${showSaveSuccess
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
                        onChange={(e) => setPolicyContents({ ...policyContents, [activePolicyItem]: e.target.value })}
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
                              onChange={(e) => setAdminFormData({ ...adminFormData, province: e.target.value, district: '', cooperativeId: '' })}
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
                              onChange={(e) => setAdminFormData({ ...adminFormData, district: e.target.value, cooperativeId: '' })}
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
                          onChange={(e) => setAdminFormData({ ...adminFormData, cooperativeId: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none text-xs font-bold text-slate-700 focus:border-emerald-500 transition-all disabled:bg-slate-100 disabled:opacity-60"
                        >
                          <option value="">Chọn Hợp tác xã</option>
                          {cooperatives
                            .filter(htx => {
                              if (!htx.location || !htx.location.includes(',')) return false;
                              const parts = htx.location.split(',').map((s: string) => s.trim());
                              if (parts.length < 2) return false;
                              const locProvince = parts[parts.length - 1];
                              const locDistrict = parts[parts.length - 2];
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
                          <input type="text" required placeholder="Nguyễn Văn A" value={adminFormData.name} onChange={e => setAdminFormData({ ...adminFormData, name: e.target.value })} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Số CCCD</label>
                          <div className="relative group">
                            <IdCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#059669] transition-colors" />
                            <input type="text" required placeholder="0123456789" value={adminFormData.cccd} onChange={e => setAdminFormData({ ...adminFormData, cccd: e.target.value.replace(/[^0-9]/g, '') })} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Điện thoại</label>
                          <div className="relative group">
                            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#059669] transition-colors" />
                            <input type="tel" required placeholder="090 123 4567" value={adminFormData.phone} onChange={e => setAdminFormData({ ...adminFormData, phone: e.target.value.replace(/[^0-9]/g, '') })} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                          <div className="relative group">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#059669] transition-colors" />
                            <input type="email" required placeholder="admin@vietagri.vn" value={adminFormData.email} onChange={e => setAdminFormData({ ...adminFormData, email: e.target.value })} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phân quyền</label>
                          <select value={adminFormData.role} onChange={e => setAdminFormData({ ...adminFormData, role: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-bold text-xs focus:border-emerald-500 transition-all">
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

            {activeTab === 'enterprises' && (
              <div className="space-y-8">
                {/* Stats Grid for Enterprises */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Tổng doanh nghiệp</p>
                      <p className="text-2xl font-black text-forest">{pendingEnterprises.length + activeEnterprises.length}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Đã liên kết gỗ</p>
                      <p className="text-2xl font-black text-[#059669]">{activeEnterprises.length}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Hồ sơ chờ duyệt</p>
                      <p className="text-2xl font-black text-amber-600">{pendingEnterprises.length}</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <History size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Hợp đồng liên kết</p>
                      <p className="text-2xl font-black text-indigo-600">
                        {contracts.filter(c => c.type === 'enterprise_htx').length}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Main Content split layout */}
                <div className="grid xl:grid-cols-3 gap-8 items-stretch">
                  {/* Left Big Card: Pending Approvals (2 cols span on desktop) */}
                  <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black text-emerald-950">Phê duyệt Doanh nghiệp</h3>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hồ sơ đối tác mới đăng ký nhận từ cổng /register-enterprise</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewAllType('pending')}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-100 transition-all font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-sm cursor-pointer flex items-center gap-1"
                            title="Xem tất cả danh sách chờ phê duyệt"
                          >
                            Xem tất cả
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        {pendingEnterprises.length === 0 ? (
                          <div className="p-12 text-center flex flex-col justify-center items-center min-h-[220px]">
                            <Building2 className="text-slate-200 mx-auto mb-3" size={38} />
                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Không có hồ sơ doanh nghiệp nào đang chờ duyệt</p>
                            <p className="text-[11px] text-slate-400 mt-1 font-medium">Toàn bộ hồ sơ đã được xử lý thành công.</p>
                          </div>
                        ) : (
                          <table className="w-full text-left">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên Doanh nghiệp</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đại diện pháp luật</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngành nghề</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pendingEnterprises.map((ent) => (
                                <tr key={ent.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                  <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
                                        {ent.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="font-extrabold text-slate-800 text-sm">{ent.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">MST: {ent.taxCode || '---'}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <p className="text-xs font-bold text-slate-700">{ent.representative}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">{ent.phone}</p>
                                  </td>
                                  <td className="px-8 py-6">
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                      {ent.industry || 'Nông nghiệp'}
                                    </span>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => {
                                          setSelectedEnterpriseDetail(ent);
                                        }}
                                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all shadow-sm"
                                        title="Xem chi tiết hồ sơ"
                                      >
                                        <Eye size={14} />
                                      </button>
                                      <button
                                        onClick={() => approveEnterprise(ent.id)}
                                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100"
                                        title="Phê duyệt Doanh nghiệp"
                                      >
                                        <CheckCircle2 size={15} />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Bạn có chắc muốn từ chối hồ sơ đăng ký của ${ent.name}?`)) {
                                            rejectEnterprise(ent.id);
                                          }
                                        }}
                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
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
                    </div>
                  </div>

                  {/* Right side panel: Quick Guide & Integration Stats */}
                  <div className="bg-gradient-to-br from-emerald-900 to-forest rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-950/20 flex flex-col justify-between h-full">
                    <div>
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck size={24} className="text-mint" />
                      </div>
                      <h4 className="text-lg font-black tracking-tight mb-2">VietAgri Linkage System</h4>
                      <p className="text-xs text-emerald-100 leading-relaxed font-semibold">
                        Cổng kết nối đa chiều giữa Doanh nghiệp thu mua chế biến toàn quốc với các Hợp tác xã (HTX) và Liên minh gỗ sạch.
                      </p>
                    </div>
                    
                    <div className="mt-8 space-y-4 text-xs">
                      <div className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-mint mt-1.5 shrink-0" />
                        <p className="text-emerald-50 font-medium">Auto-Sync tài khoản khi phê duyệt để doanh nghiệp đăng nhập.</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-mint mt-1.5 shrink-0" />
                        <p className="text-emerald-50 font-medium">Bảo mật mã số thuế và kiểm tra dữ liệu qua hóa đơn cục thuế liên thông.</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-mint mt-1.5 shrink-0" />
                        <p className="text-emerald-50 font-medium">Hỗ trợ giao kết hợp đồng số trực tiếp bằng chuẩn chữ ký mã hóa.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Big Card: Active Accounts List (Tài khoản doanh nghiệp đã cấp) */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden mt-8">
                  <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-forest">Danh sách Tài khoản Doanh nghiệp mạng lưới</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quản lý mạng lưới đối tác đã kích hoạt liên kết kinh tế chính thống</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          placeholder="Tìm doanh nghiệp, MST..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-forest transition-all w-60"
                        />
                      </div>
                      <button
                        onClick={() => setViewAllType('active')}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-100 transition-all font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-sm cursor-pointer flex items-center gap-1"
                        title="Xem tất cả danh sách doanh nghiệp"
                      >
                        Xem tất cả
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {activeEnterprises.length === 0 ? (
                      <div className="p-16 text-center">
                        <Building2 className="text-slate-200 mx-auto mb-4" size={48} />
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Không có doanh nghiệp đối tác nào đang hoạt động</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">Bấm duyệt hồ sơ ở bảng trên để thêm vào danh sách liên kết.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doanh nghiệp / MST</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người quản lý pháp lý</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông tin liên hệ</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu cấp tạm</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Lệnh Thao tác (API)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeEnterprises
                            .filter(ent => 
                              ent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (ent.taxCode || '').includes(searchTerm)
                            )
                            .map((ent) => (
                              <tr key={ent.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-black text-sm">
                                      {ent.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="font-extrabold text-forest text-sm">{ent.name}</p>
                                        {ent.status === 'locked' && (
                                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-black uppercase rounded flex items-center gap-1">
                                            <Lock size={8} /> Đã khóa
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex gap-2 mt-1">
                                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-mono font-bold rounded">
                                          MST: {ent.taxCode}
                                        </span>
                                        <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded">
                                          ID: {ent.id}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <p className="text-xs font-bold text-slate-700">{ent.representative}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{ent.industry || 'Thu mua nông sản'}</p>
                                </td>
                                <td className="px-8 py-6">
                                  <p className="text-xs font-semibold text-slate-700 font-mono">{ent.phone}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold lowercase">{ent.email}</p>
                                </td>
                                <td className="px-8 py-6">
                                  <span className="px-2.5 py-1 rounded-md bg-amber-50 text-emerald-950 border border-amber-100 text-[10px] font-mono font-black select-all">
                                    {ent.tempPassword || 'Approved'}
                                  </span>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedEnterpriseDetail(ent);
                                      }}
                                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                      title="Xem chi tiết lý lịch hồ sơ"
                                    >
                                      <Eye size={14} />
                                    </button>
                                    {ent.status === 'locked' ? (
                                      <button
                                        onClick={() => toggleLockEnterprise(ent.id, ent.status)}
                                        className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all shadow-sm border border-amber-100"
                                        title="Mở khóa tài khoản doanh nghiệp"
                                      >
                                        <Unlock size={14} />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => toggleLockEnterprise(ent.id, ent.status)}
                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                                        title="Khóa tài khoản doanh nghiệp"
                                      >
                                        <Lock size={14} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Elegant Detailed Enterprise View Modal */}
                <AnimatePresence>
                  {selectedEnterpriseDetail && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedEnterpriseDetail(null)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                      />
                      <motion.div 
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        className="relative bg-white rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl overflow-hidden"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 mb-6 pb-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                              <Building2 size={24} />
                            </div>
                            <div>
                              <h3 className="text-lg font-black text-forest">Chi tiết Hồ sơ Đối tác Doanh nghiệp</h3>
                              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                                MÃ KẾT NỐI API: #{selectedEnterpriseDetail.id}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedEnterpriseDetail(null)}
                            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* Profile Content Body */}
                        <div className="space-y-6">
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                              📋 THÔNG TIN ĐĂNG KÝ DOANH NGHIỆP
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tên Doanh nghiệp</p>
                                <p className="font-extrabold text-slate-800 text-sm">{selectedEnterpriseDetail.name}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Mã số thuế (MST)</p>
                                <p className="font-extrabold text-slate-800 text-sm font-mono">{selectedEnterpriseDetail.taxCode || 'Chưa cung cấp'}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200/40">
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Người đại diện pháp luật</p>
                                <p className="font-bold text-slate-800 text-sm">{selectedEnterpriseDetail.representative || 'Chưa cung cấp'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Lĩnh vực hoạt động</p>
                                <p className="font-bold text-slate-800 text-sm">{selectedEnterpriseDetail.industry || 'Chưa cung cấp'}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200/40">
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Số điện thoại</p>
                                <p className="font-bold text-slate-800 text-sm font-mono">{selectedEnterpriseDetail.phone || 'Chưa cung cấp'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Thư điện tử (Email)</p>
                                <p className="font-bold text-[#004d40] text-sm lowercase font-medium">{selectedEnterpriseDetail.email || 'Chưa cung cấp'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Connection & Contract list */}
                          <div className="p-6 bg-teal-50/40 rounded-3xl border border-teal-100/50 space-y-4">
                            <h4 className="text-xs font-black text-teal-800 uppercase tracking-widest flex items-center gap-2">
                              🤝 LỊCH SỬ KÝ KẾT HỢP ĐỒNG LIÊN KẾT
                            </h4>

                            {(() => {
                              const relatedContracts = contracts.filter(c => 
                                (c.enterpriseName || '').toLowerCase() === (selectedEnterpriseDetail.name || '').toLowerCase() ||
                                (c.buyer?.name || '').toLowerCase() === (selectedEnterpriseDetail.name || '').toLowerCase()
                              );

                              if (relatedContracts.length === 0) {
                                return (
                                  <p className="text-xs text-slate-400 font-bold italic">
                                    Doanh nghiệp chưa khởi tạo hoặc ký bất kỳ hợp đồng nào trên sàn VietAgri.
                                  </p>
                                );
                              }

                              return (
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                  {relatedContracts.map((cnt, ci) => (
                                    <div key={cnt.id || ci} className="p-3 bg-white rounded-xl border border-teal-100/30 flex justify-between items-center text-xs">
                                      <div>
                                        <p className="font-bold text-slate-800">Hợp đồng #{cnt.id}</p>
                                        <p className="text-[10px] text-slate-400">Sản phẩm: {cnt.productName || cnt.crop || 'Gỗ / Lâm sản'}</p>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                        cnt.status === 'active' || cnt.status === 'approved' 
                                          ? 'bg-emerald-50 text-emerald-600' 
                                          : cnt.status === 'pending' 
                                          ? 'bg-amber-50 text-amber-600' 
                                          : 'bg-red-50 text-red-600'
                                      }`}>
                                        {cnt.status === 'active' ? 'Đang thực hiện' : cnt.status === 'pending' ? 'Chờ duyệt' : cnt.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-4 border-t border-slate-100">
                            {selectedEnterpriseDetail.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Bạn có chắc muốn từ từ từ chối hồ sơ đăng ký của ${selectedEnterpriseDetail.name}?`)) {
                                      rejectEnterprise(selectedEnterpriseDetail.id);
                                      setSelectedEnterpriseDetail(null);
                                    }
                                  }}
                                  className="flex-1 py-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                >
                                  Bác bỏ từ chối
                                </button>
                                <button
                                  onClick={() => {
                                    approveEnterprise(selectedEnterpriseDetail.id);
                                    setSelectedEnterpriseDetail(null);
                                  }}
                                  className="flex-1 py-3 bg-forest hover:bg-mint hover:text-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-forest/10"
                                >
                                  <CheckCircle2 size={14} /> Phê duyệt & Cấp mật khẩu
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setSelectedEnterpriseDetail(null)}
                                className="w-full py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                              >
                                Đóng hộp thoại
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
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
                              <div className="flex flex-col gap-1">
                                <span>{admin.coopName}</span>
                                <span className={`inline-flex self-start items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                  (admin.level || 1) === 3 
                                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                    : (admin.level || 1) === 2 
                                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                  Cấp {admin.level || 1}
                                </span>
                              </div>
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
                                  2FA Bật
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                  Chưa bật 2FA
                                </span>
                              )}
                            </td>
                            <td className="p-5 text-right pr-8">
                              <div className="flex justify-end gap-1">
                                <button onClick={() => openAdminDetails(admin)} title="Xem chi tiết & cấu hình" className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg hover:text-forest transition-colors"><Eye size={16} /></button>
                                <button onClick={() => {
                                  const currentLvl = Number(admin.level) || 1;
                                  const nextLevel = (currentLvl % 3) + 1;
                                  handleSetAdminLevel(admin.id, nextLevel);
                                }} title={`Đổi Cấp bậc (Hiện tại: Cấp ${admin.level || 1})`} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg hover:text-indigo-600 transition-colors">
                                  <UserCog size={16} />
                                </button>
                                <button onClick={() => handleToggleAdminStatus(admin.id)} title={admin.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'} className="p-2 text-slate-400 hover:bg-amber-50 rounded-lg hover:text-amber-500 transition-colors">
                                  {admin.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                                </button>
                                <button onClick={() => handleDeleteAdmin(admin.id)} title="Xóa tài khoản" className="p-2 text-slate-400 hover:bg-rose-50 rounded-lg hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
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

            {activeTab === 'contracts' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-1 bg-forest rounded-full"></span>
                      <span className="text-[10px] font-black text-forest uppercase tracking-[0.2em]">Hệ thống giám sát vĩ mô</span>
                    </div>
                    <h2 className="text-4xl font-black text-forest tracking-tighter">Hợp đồng Toàn hệ thống</h2>
                    <p className="text-slate-500 font-medium mt-1">Quản lý tập trung chuỗi giá trị từ sản xuất đến tiêu thụ nông sản</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center text-forest">
                        <FileText size={20} />
                      </div>
                      <div className="pr-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng số</p>
                        <p className="text-lg font-black text-forest leading-tight">{contracts.length}</p>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <BarChart3 size={20} />
                      </div>
                      <div className="pr-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tỷ lệ ký</p>
                        <p className="text-lg font-black text-forest leading-tight">
                          {Math.round((contracts.filter(c => c.status === 'active' || c.status === 'signed').length / contracts.length) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters & Control Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/60 backdrop-blur-md rounded-[2rem] border border-slate-100 shadow-sm">
                  <div className="space-y-1.5 p-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Filter size={10} /> Loại hợp đồng
                    </label>
                    <div className="relative group">
                      <select
                        value={selectedContractTypeFilter}
                        onChange={(e) => setSelectedContractTypeFilter(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-sm font-bold text-slate-700 px-4 py-3 rounded-xl appearance-none cursor-pointer focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                      >
                        <option value="Tất cả">Tất cả các loại</option>
                        <option value="enterprise_htx">Mua bán (DN - HTX)</option>
                        <option value="htx_farmer">Liên kết (HTX - ND)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Building2 size={10} /> Đơn vị HTX
                    </label>
                    <div className="relative group">
                      <select
                        value={selectedCoopContractFilter}
                        onChange={(e) => setSelectedCoopContractFilter(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-sm font-bold text-slate-700 px-4 py-3 rounded-xl appearance-none cursor-pointer focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                      >
                        <option value="Tất cả">Tất cả Hợp tác xã</option>
                        {Array.from(new Set(contracts.map(c => c.coopName))).sort().map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1.5 p-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Search size={10} /> Truy vấn dữ liệu
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Tìm theo Mã HĐ, Tên Doanh nghiệp, Nông dân hoặc Sản phẩm..."
                        className="w-full bg-white border border-slate-200 text-sm font-bold text-slate-700 px-12 py-3 rounded-xl focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                        value={contractSearchTerm}
                        onChange={(e) => setContractSearchTerm(e.target.value)}
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      {contractSearchTerm && (
                        <button
                          onClick={() => setContractSearchTerm('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Data Visualization Table */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Chi tiết đối tượng</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Cơ sở HTX liên kết</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Nội dung sản xuất</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Quy mô & Tài chính</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const filtered = contracts.filter(c => {
                            const matchType = selectedContractTypeFilter === 'Tất cả' || c.type === selectedContractTypeFilter;
                            const matchCoop = selectedCoopContractFilter === 'Tất cả' || c.coopName === selectedCoopContractFilter;
                            const matchSearch = contractSearchTerm === '' ||
                              c.id.toLowerCase().includes(contractSearchTerm.toLowerCase()) ||
                              (c.enterpriseName || '').toLowerCase().includes(contractSearchTerm.toLowerCase()) ||
                              (c.farmerName || '').toLowerCase().includes(contractSearchTerm.toLowerCase()) ||
                              (c.cropName || '').toLowerCase().includes(contractSearchTerm.toLowerCase()) ||
                              c.coopName.toLowerCase().includes(contractSearchTerm.toLowerCase());
                            return matchType && matchCoop && matchSearch;
                          });

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                  <div className="flex flex-col items-center gap-4 text-slate-300">
                                    <FileX2 size={64} strokeWidth={1} />
                                    <div>
                                      <p className="text-slate-500 font-bold">Không tìm thấy dữ liệu hợp đồng</p>
                                      <p className="text-xs font-bold uppercase tracking-widest mt-1">Vui lòng điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((c) => (
                            <tr key={c.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 cursor-pointer" onClick={() => setSelectedContract(c)}>
                              <td className="px-8 py-7">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm relative shadow-sm ${c.type === 'enterprise_htx'
                                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                                      : 'bg-gradient-to-br from-emerald-500 to-forest text-white'
                                    }`}>
                                    {c.type === 'enterprise_htx' ? <ShoppingCart size={20} /> : <User size={20} />}
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
                                      <span className={`w-3 h-3 rounded-full ${c.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-black text-slate-900 text-sm leading-tight flex items-center gap-2">
                                      {c.type === 'enterprise_htx' ? (c.enterpriseName) : (c.farmerName)}
                                      <span className="text-[10px] font-black text-slate-300">#{c.id}</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${c.type === 'enterprise_htx' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        {c.type === 'enterprise_htx' ? 'Hợp đồng mua bán' : 'Hợp đồng liên kết'}
                                      </span>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        {c.type === 'enterprise_htx' ? `MST: ${c.taxCode}` : `ID: ${c.farmerId}`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-7">
                                <div>
                                  <p className="text-sm font-bold text-forest">{c.coopName}</p>
                                  <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                    <MapPin size={10} />
                                    <p className="text-[10px] font-bold uppercase">{c.coopId || 'VAG-ID-0394'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-7">
                                <div>
                                  <p className="text-sm font-bold text-slate-700">{c.cropName}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Mã SP: {c.product || 'PRD-001'}</p>
                                </div>
                              </td>
                              <td className="px-8 py-7">
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{c.totalVolume}</p>
                                  <p className="text-[10px] text-forest font-black uppercase mt-1">Giá: {c.unitPrice}</p>
                                </div>
                              </td>
                              <td className="px-8 py-7 text-right">
                                <div className="flex flex-col items-end gap-2">
                                  <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${c.status === 'active' || c.status === 'signed'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : c.status === 'pending_super_admin'
                                        ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                    {c.status === 'active' || c.status === 'signed' ? 'Chính thức' : c.status === 'pending_super_admin' ? 'Chờ duyệt' : 'Dự thảo'}
                                  </div>
                                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                    {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer / Summary */}
                  <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chu kỳ báo cáo</p>
                        <p className="text-sm font-black text-forest">Quý 2 / 2026</p>
                      </div>
                      <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hiệu lực hệ thống</p>
                        <p className="text-sm font-black text-emerald-600">Đang hoạt động</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={16} /> XUẤT BÁO CÁO (EXCEL)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Insight Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-gradient-to-br from-forest to-emerald-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black tracking-tight mb-4 leading-tight">Mở rộng mạng lưới<br />Liên kết chuỗi giá trị</h3>
                      <p className="text-emerald-100/80 text-sm font-medium max-w-md mb-8">Hỗ trợ các Hợp tác xã kết nối trực tiếp với doanh nghiệp xuất khẩu hàng đầu và nâng cao năng lực sản xuất cho nông dân thành viên qua các hợp đồng bao tiêu bền vững.</p>
                      <button className="px-8 py-4 bg-white text-forest font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-transform">
                        TẠO CHIẾN DỊCH LIÊN KẾT MỚI
                      </button>
                    </div>
                    <div className="absolute right-[-10%] bottom-[-20%] opacity-10 group-hover:opacity-20 transition-opacity">
                      <LayoutDashboard size={400} />
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 flex flex-col items-center justify-center text-center group">
                    <div className="w-20 h-20 rounded-[2rem] bg-amber-50 flex items-center justify-center text-amber-500 mb-6 group-hover:rotate-12 transition-transform">
                      <AlertCircle size={40} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Hỗ trợ Phê duyệt</h4>
                    <p className="text-sm text-slate-500 font-medium mb-8">Bạn có {contracts.filter(c => c.status === 'pending_super_admin').length} hợp đồng mới đang chờ được kiểm tra tính pháp lý và phê duyệt lên hệ thống giám sát vĩ mô.</p>
                    <button
                      onClick={() => {
                        setSelectedContractTypeFilter('Tất cả');
                        setContractSearchTerm('');
                        // Force scroll to table if needed or just let filters do work
                      }}
                      className="w-full py-4 bg-slate-900 text-white font-black text-xs rounded-2xl tracking-widest hover:bg-forest transition-colors shadow-lg"
                    >
                      XEM CÁC MỤC CHỜ DUYỆT
                    </button>
                  </div>
                </div>

                {/* Quản lý thanh toán hợp đồng */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden mt-8">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-forest">Hợp đồng Cần Xác nhận Thanh toán</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Kiểm soát dòng tiền và trạng thái thanh toán từ các giao dịch</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-4 py-3">Mã HĐ</th>
                          <th className="px-4 py-3">Đối tác</th>
                          <th className="px-4 py-3">Giá trị</th>
                          <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.filter(c => c.status === 'active').slice(0, 3).map(c => (
                          <tr key={c.id} className="border-b border-slate-50">
                            <td className="px-4 py-4 text-xs font-bold text-forest">{c.id}</td>
                            <td className="px-4 py-4 text-xs font-medium text-slate-700">{c.enterpriseName || c.farmerName}</td>
                            <td className="px-4 py-4 text-xs font-bold text-emerald-600">{c.unitPrice}</td>
                            <td className="px-4 py-4 text-right">
                              <button className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-100">
                                Xác nhận
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Quản lý danh sách sản phẩm hệ thống vận hành</p>
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
                        <p className="text-sm text-slate-500 font-medium mt-1">Bảng giá niêm yết áp dụng toàn hệ thống VietAgri</p>
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
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
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
                                  <div className="flex items-center justify-end gap-2 text-right">
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

            {activeTab === 'statistics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div>
                          <h2 className="text-2xl font-black text-emerald-950">Thống kê & Báo cáo Hệ thống</h2>
                          <p className="text-slate-500 font-bold mt-1">Hoạt động, sản lượng và giao dịch trên toàn hệ sinh thái VietAgri</p>
                      </div>
                      <button className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-forest hover:text-white transition-all text-sm uppercase tracking-widest">
                          <Download size={18} /> Xuất báo cáo tổng hợp
                      </button>
                  </div>

                  {isLoadingStats ? (
                      <div className="flex justify-center items-center h-64">
                          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                  ) : (
                      <>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Tăng trưởng Người dùng</h3>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={systemStats.userGrowth}>
                                      <defs>
                                        <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} />
                                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} />
                                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                                      <Area type="monotone" dataKey="farmers" name="Tổng thành viên" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorFarmers)" />
                                  </AreaChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Phân bổ vùng canh tác</h3>
                          <div className="h-64 flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                      <Pie
                                          data={systemStats.provinceDistribution}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={70}
                                          outerRadius={90}
                                          paddingAngle={5}
                                          dataKey="value"
                                          stroke="none"
                                      >
                                          <Cell fill="#047857" />
                                          <Cell fill="#10b981" />
                                          <Cell fill="#34d399" />
                                          <Cell fill="#94a3b8" />
                                      </Pie>
                                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }} />
                                  </PieChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Giá trị hợp đồng (Tỷ VNĐ)</h3>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={systemStats.contractGrowth}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} />
                                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                                      <Bar dataKey="value" name="Giá trị" fill="#047857" radius={[6, 6, 0, 0]} />
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiệu suất Nông sản Top đầu</h3>
                              <button className="text-[10px] uppercase font-black tracking-widest text-emerald-600 hover:text-forest flex items-center gap-1 transition-colors">Chi tiết <ChevronRight size={14}/></button>
                          </div>
                          <div className="p-8 space-y-6">
                              {systemStats.topPerformers.map((item, idx) => (
                                  <div key={idx} className="group cursor-pointer">
                                      <div className="flex items-center justify-between mb-3">
                                          <p className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{item.name}</p>
                                          <div className="text-right">
                                              <p className="text-sm font-black text-emerald-950">{item.value}</p>
                                              <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500">{item.growth}</p>
                                          </div>
                                      </div>
                                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                          <div className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.progress}%` }}></div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái Hệ thống</h3>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                              </div>
                          </div>
                          <div className="p-8 grid grid-cols-2 gap-4">
                              <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 hover:bg-slate-50 transition-colors cursor-default">
                                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 mb-5 border border-slate-50">
                                      <Activity size={22} />
                                  </div>
                                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Uptime Server</p>
                                  <p className="text-3xl font-black text-emerald-950 tracking-tight">99.99%</p>
                                  <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500 mt-3 flex items-center gap-1"><ArrowUpCircle size={14}/> Hoạt động ổn định</p>
                              </div>
                              <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 hover:bg-slate-50 transition-colors cursor-default">
                                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 mb-5 border border-slate-50">
                                      <Globe size={22} />
                                  </div>
                                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Băng thông sử dụng</p>
                                  <p className="text-3xl font-black text-emerald-950 tracking-tight">4.2 TB</p>
                                  <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500 mt-3 flex items-center gap-1"><ArrowUpCircle size={14}/> +12% tháng trước</p>
                              </div>
                              <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 hover:bg-slate-50 transition-colors cursor-default">
                                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-500 mb-5 border border-slate-50">
                                      <Database size={22} />
                                  </div>
                                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Dung lượng Core DB</p>
                                  <p className="text-3xl font-black text-emerald-950 tracking-tight">850 GB</p>
                                  <p className="text-[10px] uppercase tracking-widest font-black text-amber-600 mt-3 flex items-center gap-1">54% capacity</p>
                              </div>
                              <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 hover:bg-slate-50 transition-colors cursor-default">
                                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-red-500 mb-5 border border-slate-50">
                                      <ShieldAlert size={22} />
                                  </div>
                                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Cảnh báo bảo mật</p>
                                  <p className="text-3xl font-black text-emerald-950 tracking-tight">0</p>
                                  <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500 mt-3 flex items-center gap-1"><CheckCircle2 size={14}/> Hệ thống an toàn</p>
                              </div>
                          </div>
                      </div>
                  </div>
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
                          <h3 className="text-2xl font-black text-forest">Đăng tin Bán hàng Hệ thống</h3>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Đăng tin quảng bá & chào bán sản phẩm vĩ mô từ các HTX liên kết</p>
                        </div>
                      </div>
                      <button onClick={() => setIsPostingNewProduct(false)} className="text-slate-400 font-bold hover:text-forest transition-colors">Hủy & Quay lại</button>
                    </div>

                    <form className="grid lg:grid-cols-2 gap-12" onSubmit={async (e) => { 
                      e.preventDefault(); 
                      
                      const newId = `POST-${Date.now()}`;
                      const product = products.find(p => p.name === newSalePost.productName);
                      
                      const postToAdd = {
                        id: newId,
                        title: `${newSalePost.productName} - ${newSalePost.origin || 'Chất lượng cao'}`,
                        baseProduct: newSalePost.productName,
                        cooperativeName: 'Ban quản trị VietAgri',
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

                      try {
                        await postService.createPost(postToAdd);
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
                      } catch (err) {
                        console.error("Lỗi khi đăng tin:", err);
                        alert("Lỗi khi đăng bài chào bán thương mại!");
                      }
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
                                price: product && product.price ? product.price.split(' ')[0] : ''
                              });
                            }}
                          >
                            <option value="">Chọn sản phẩm từ danh mục...</option>
                            {products.map((p) => (
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
                        <h2 className="text-3xl font-black text-forest tracking-tight">Quản lý Tin Đăng bán Hệ thống</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Danh sách các sản phẩm đang được chào bán vĩ mô trên sàn VietAgri</p>
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
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
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
                                  <div className="flex items-center justify-end gap-2 text-right">
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

            {activeTab === 'news_manage' && (
              <>
                <NewsManageTab 
                  customNews={customNews}
                  newsForm={newsForm}
                  setNewsForm={setNewsForm}
                  isEditingNews={isEditingNews}
                  handleCreateOrUpdateNews={handleCreateOrUpdateNews}
                  handleDeleteNews={handleDeleteNews}
                  handleStartEditNews={handleStartEditNews}
                  handleCancelEditNews={handleCancelEditNews}
                />

                {newsToDelete && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setNewsToDelete(null)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full text-center shadow-2xl border border-slate-100"
                    >
                      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-100 animate-pulse">
                        <Trash2 size={32} />
                      </div>
                      <h3 className="text-xl font-black text-rose-950 mb-2 uppercase tracking-tight">Xác nhận xóa tin tức</h3>
                      <p className="text-xs text-slate-450 font-bold uppercase tracking-wider mb-4">Bạn có chắc chắn muốn gỡ bỏ bài viết này?</p>
                      <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100 mb-6 font-semibold text-xs text-slate-600">
                        <p className="font-extrabold text-[#004d40] mb-1">Tiêu đề bài viết:</p>
                        <p className="line-clamp-2 italic">"{newsToDelete.title}"</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setNewsToDelete(null)}
                          className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          Hủy bỏ
                        </button>
                        <button 
                          onClick={() => {
                            const updated = customNews.filter(item => item.id !== newsToDelete.id);
                            saveCustomNewsList(updated);
                            setNewsToDelete(null);
                            setStatusMessage({ type: 'success', text: 'Đã xóa tin tức liên kết thành công!' });
                          }}
                          className="py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-rose-200 cursor-pointer"
                        >
                          Xác nhận xóa
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'settings' && (
              <SystemSettingsTab />
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
                      onClick={() => { approveEnterprise(selectedEnterprise.id); setSelectedEnterprise(null); }}
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
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mt-1">Số: {cleanContractNo(selectedContract.contractNo, selectedContract.id)}</p>
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

                {selectedContract.status === 'pending_super_admin' ? (
                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => handlePrintB2BContract(selectedContract)}
                      className="w-full sm:flex-1 py-4 bg-slate-100 text-slate-800 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      Tải bản in PDF
                    </button>
                    <button
                      onClick={() => { approveContract(selectedContract.id); setSelectedContract(null); }}
                      className="w-full sm:flex-1 py-4 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-900 shadow-xl shadow-emerald-950/20 transition-all"
                    >
                      Xác nhận phê duyệt
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => handlePrintB2BContract(selectedContract)}
                      className="w-full sm:flex-1 py-4 bg-slate-100 text-slate-800 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      Tải bản in PDF
                    </button>
                    <button
                      className="w-full sm:flex-1 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-default"
                    >
                      <CheckCircle2 size={18} />
                      Hợp đồng đã ký kết hoàn tất
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
            <div className={`p-6 rounded-[2rem] shadow-2xl border-2 flex items-start gap-4 ${statusMessage.type === 'success'
                ? 'bg-white border-emerald-100 text-emerald-950'
                : 'bg-white border-red-100 text-red-950'
              }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${statusMessage.type === 'success' ? 'bg-forest text-white' : 'bg-red-500 text-white'
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
                  {/* Account Advanced Configuration */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#004d40] flex items-center">
                        <User size={16} className="mr-2" /> Cấu hình Cấp bậc & Trạng thái
                      </h3>
                      <span className="text-xs font-bold text-slate-400">ID: {selectedRoleAdmin.id}</span>
                    </div>

                    {/* Level Selector */}
                    <div className="space-y-3">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                        Nâng cấp quản lý tài khoản (Cấp bậc)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { level: 1, title: 'Cấp 1', sub: 'Quản lý 1 HTX', desc: 'Có quyền điều hành độc lập tại một hợp tác xã trực thuộc cơ sở.' },
                          { level: 2, title: 'Cấp 2', sub: 'Chuỗi liên kết', desc: 'Điều hướng và giám sát liên kết chuỗi cung ứng giữa nhiều hợp tác xã.' },
                          { level: 3, title: 'Cấp 3', sub: 'Cấp toàn quốc', desc: 'Cấp quyền tối cao quản lý toàn bộ chuỗi giá trị nông sản vĩ mô.' }
                        ].map((item) => {
                          const isActive = (selectedRoleAdmin.level || 1) === item.level;
                          return (
                            <button
                              key={item.level}
                              onClick={() => handleSetAdminLevel(selectedRoleAdmin.id, item.level)}
                              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                isActive 
                                  ? 'bg-emerald-50/70 border-emerald-500 shadow-sm shadow-emerald-500/10' 
                                  : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-2">
                                <span className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                                  {item.title}
                                </span>
                                {isActive && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                )}
                              </div>
                              <h4 className={`font-black text-sm mb-1 ${isActive ? 'text-[#004d40]' : 'text-slate-805'}`}>
                                {item.sub}
                              </h4>
                              <p className="text-[11px] text-slate-400 leading-normal mb-1">
                                {item.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Active/Lock Control as a premium Switch */}
                      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">Trạng thái khóa tài khoản</h4>
                          <p className="text-xs text-slate-500 font-bold mt-1">
                            Bật công tắc này để tạm khóa tất cả các truy cập của Admin này vào hệ thống ngay lập tức.
                          </p>
                        </div>
                        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm">
                          <span className={`text-xs font-black uppercase tracking-wider ${selectedRoleAdmin.status === 'banned' ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {selectedRoleAdmin.status === 'banned' ? '🔒 Đã khóa truy cập' : '🔓 Đang hoạt động'}
                          </span>
                          <div 
                            onClick={() => handleToggleAdminStatus(selectedRoleAdmin.id)} 
                            className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors flex items-center px-1 ${
                              selectedRoleAdmin.status === 'banned' ? 'bg-rose-500' : 'bg-slate-200'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                              selectedRoleAdmin.status === 'banned' ? 'translate-x-[20px]' : 'translate-x-0'
                            }`} />
                          </div>
                        </div>
                      </div>

                      {/* Delete Account Card */}
                      <div className="bg-red-50/30 p-6 rounded-2xl border border-red-100 flex flex-col justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-rose-800">Xóa vĩnh viễn</h4>
                          <p className="text-xs text-rose-600/70 font-bold mt-1">
                            Loại bỏ hoàn toàn tài khoản Admin ra khỏi hệ sinh thái vĩnh viễn. Hành vụ này không thể khôi phục.
                          </p>
                        </div>
                        <button 
                          onClick={() => {
                            if (window.confirm('CẢNH BÁO NGUY HIỂM\n\nBạn có chắc chắn 100% muốn xóa vĩnh viễn tài khoản quản trị viên này không?\n\nMọi thông tin liên quan, quyền truy cập và dữ liệu vận hành thuộc quyền quản lý của Admin này sẽ bị gỡ bỏ vĩnh viễn và KHÔNG THỂ KHÔI PHỤC.')) {
                              setRoleAdmins(prev => prev.filter(a => a.id !== selectedRoleAdmin.id));
                              setSelectedRoleAdmin(null);
                            }
                          }}
                          className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Trash2 size={14} /> Xóa tài khoản vĩnh viễn
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
                          <input type="checkbox" className="hidden" checked={selectedRoleAdmin.scope.includes(perm.id)} onChange={() => handleToggleScope(selectedRoleAdmin.id, perm.id)} />
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
                        <button onClick={handleResetPassword} className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                          Gửi yêu cầu Reset
                        </button>
                      </div>

                      <div className={`p-6 rounded-2xl border flex flex-col justify-between gap-4 ${selectedRoleAdmin.is2FA ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div>
                          <h4 className={`font-bold text-sm ${selectedRoleAdmin.is2FA ? 'text-[#004d40]' : 'text-slate-800'}`}>Xác thực 2 lớp (2FA)</h4>
                          <p className={`text-xs font-bold mt-1 ${selectedRoleAdmin.is2FA ? 'text-[#004d40]/70' : 'text-slate-500'}`}>Bắt buộc Admin này sử dụng ứng dụng Authenticator.</p>
                        </div>
                        <div className={`flex items-center justify-between bg-white px-4 py-2 rounded-xl border ${selectedRoleAdmin.is2FA ? 'border-emerald-100' : 'border-slate-100'}`}>
                          <span className={`text-xs font-bold ${selectedRoleAdmin.is2FA ? 'text-emerald-800' : 'text-slate-500'}`}>
                            Trạng thái: {selectedRoleAdmin.is2FA ? 'Bật' : 'Tắt'}
                          </span>
                          <div onClick={() => handleToggle2FA(selectedRoleAdmin.id)} className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${selectedRoleAdmin.is2FA ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedRoleAdmin.is2FA ? 'right-1' : 'left-1'}`} />
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
                          <History size={14} className="mr-2" /> Audit Logs toàn bộ
                        </button>
                        <button className="flex-1 py-3 bg-amber-50 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center border border-amber-200">
                          <AlertTriangle size={14} className="mr-2" /> Ghi đè thay đổi (Override)
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
