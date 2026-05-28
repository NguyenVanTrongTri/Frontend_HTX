import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Phone, 
  MapPin, 
  Sprout, 
  Navigation,
  ShieldCheck,
  ChevronDown,
  Building2,
  IdCard,
  CheckCircle2,
  ArrowRight,
  Search,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROVINCES, WARDS_MAP, COOPERATIVES, COOPERATIVE_CONFIGS, COOPERATIVES_BY_LOCATION } from '../../data';

interface RegionalManagement {
  province: string;
  district: string;
  ward: string;
  htxName: string;
  htxId: string;
  specialty: string;
  adminName: string;
  phone: string;
  status: string;
}

const REGIONAL_MANAGEMENT_DATA: RegionalManagement[] = [
  { province: 'Lâm Đồng', district: 'TP. Đà Lạt', ward: 'Cầu Đất', htxName: 'HTX Cà phê Cầu Đất', htxId: 'HTX-001', specialty: 'Cà phê Arabica', adminName: 'Nguyễn Văn Cảnh', phone: '0901234568', status: 'Đang hoạt động' },
  { province: 'Lâm Đồng', district: 'TP. Đà Lạt', ward: 'Xuân Trường', htxName: 'HTX Hoa Đà Lạt', htxId: 'HTX-002', specialty: 'Hoa tươi ôn đới', adminName: 'Trần Thị Thu Thảo', phone: '0912112233', status: 'Đang hoạt động' },
  { province: 'Lâm Đồng', district: 'Huyện Đức Trọng', ward: 'Liên Nghĩa', htxName: 'HTX Nông sản Đức Trọng', htxId: 'HTX-003', specialty: 'Rau củ VietGAP', adminName: 'Phạm Minh Toàn', phone: '0913112244', status: 'Đang hoạt động' },
  { province: 'Lâm Đồng', district: 'Huyện Đức Trọng', ward: 'Đầu dòng', htxName: 'HTX Rừng Thông Lâm Đồng', htxId: 'HTX-004', specialty: 'Atiso, Hạt mác ca', adminName: 'Lê Hoàng Dương', phone: '0914112255', status: 'Đang hoạt động' },
  { province: 'TP. Hồ Chí Minh', district: 'Quận 1', ward: 'Bến Nghé', htxName: 'HTX Công Nghệ Cao Q1', htxId: 'HTX-005', specialty: 'Rau sạch thủy canh', adminName: 'Vũ Thị Minh', phone: '0915112266', status: 'Đang hoạt động' },
  { province: 'TP. Hồ Chí Minh', district: 'Quận Bình Thạnh', ward: 'Phường 22', htxName: 'HTX Bình Thạnh Xanh', htxId: 'HTX-006', specialty: 'Nông nghiệp hữu cơ', adminName: 'Hoàng Minh Quân', phone: '0916112277', status: 'Đang hoạt động' },
  { province: 'Hà Nội', district: 'Quận Ba Đình', ward: 'Cống Vị', htxName: 'HTX Ba Đình Organic', htxId: 'HTX-007', specialty: 'Rau VietGAP, Củ quả', adminName: 'Ngô Việt Hùng', phone: '0917112288', status: 'Đang hoạt động' },
  { province: 'Đà Nẵng', district: 'Quận Hải Châu', ward: 'Hòa Cường', htxName: 'HTX Hải Châu Nông Sản', htxId: 'HTX-008', specialty: 'Hải sản cấp đông', adminName: 'Đỗ Tiến Đạt', phone: '0918112299', status: 'Đang hoạt động' },
  { province: 'Hà Nội', district: 'Quận Cầu Giấy', ward: 'Dịch Vọng', htxName: 'HTX Cầu Giấy Xanh', htxId: 'HTX-009', specialty: 'Sản xuất rau hữu cơ', adminName: 'Phùng Chí Công', phone: '0919112200', status: 'Đang hoạt động' },
  { province: 'Đà Nẵng', district: 'Quận Thanh Khê', ward: 'Phần Lăng', htxName: 'HTX Thanh Khê Hải Sản', htxId: 'HTX-010', specialty: 'Hải sản khô cao cấp', adminName: 'Đặng Ngọc Minh', phone: '0920112211', status: 'Đang hoạt động' },
  { province: 'Cần Thơ', district: 'Quận Ninh Kiều', ward: 'Xuân Khánh', htxName: 'HTX Ninh Kiều Nông Sản', htxId: 'HTX-011', specialty: 'Trái cây nhiệt đới', adminName: 'Phan Văn Phong', phone: '0921112222', status: 'Đang hoạt động' },
  { province: 'TP. Hồ Chí Minh', district: 'Quận 2', ward: 'Thạnh Mỹ Lợi', htxName: 'HTX Nông nghiệp Quận 2', htxId: 'HTX-012', specialty: 'Trái cây xuất khẩu', adminName: 'Nguyễn Tiến Dũng', phone: '0922112233', status: 'Đang hoạt động' },
  { province: 'TP. Hồ Chí Minh', district: 'TP. Thủ Đức', ward: 'Linh Trung', htxName: 'HTX Công nghệ Thủ Đức', htxId: 'HTX-013', specialty: 'Nông nghiệp thông minh', adminName: 'Tô Văn Tuấn', phone: '0923112244', status: 'Đang hoạt động' },
  { province: 'Hà Nội', district: 'Quận Hoàn Kiếm', ward: 'Tràng Tiền', htxName: 'HTX Hoàn Kiếm Nông Sản', htxId: 'HTX-014', specialty: 'Trà thảo mộc & Thảo dược', adminName: 'Bùi Thị Hà', phone: '0924112255', status: 'Đang hoạt động' },
  { province: 'Đà Nẵng', district: 'Quận Sơn Trà', ward: 'Thọ Quang', htxName: 'HTX Sơn Trà Hải Sản', htxId: 'HTX-015', specialty: 'Chế biến thủy hải sản', adminName: 'Lương Văn Hải', phone: '0925112266', status: 'Đang hoạt động' },
  { province: 'Cần Thơ', district: 'Quận Cái Răng', ward: 'Thường Thạnh', htxName: 'HTX Cái Răng Nông Sản', htxId: 'HTX-016', specialty: 'Lúa gạo sạch, Trái cây', adminName: 'Hương Thế Linh', phone: '0926112277', status: 'Đang hoạt động' },
];

export default function RegistrationPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cccd, setCccd] = useState('');
  const [address, setAddress] = useState('');
  const [coopSearch, setCoopSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [assignedCoopName, setAssignedCoopName] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('Tất cả');
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  // Dynamic Provinces list that combines standard PROVINCES with regions in REGIONAL_MANAGEMENT_DATA
  const ALL_PROVINCES = Array.from(new Set([
    ...PROVINCES,
    ...REGIONAL_MANAGEMENT_DATA.map(r => r.province)
  ])).sort();

  // Dynamic Wards list for selected province
  const getWardsForProvince = (province: string) => {
    if (!province) return [];
    const staticWards = WARDS_MAP[province] || [];
    const regionalWards = REGIONAL_MANAGEMENT_DATA
      .filter(r => r.province === province)
      .map(r => r.ward);
    return Array.from(new Set([...staticWards, ...regionalWards])).filter(Boolean);
  };

  // Safe callback when selecting cooperative from suggestions or modal
  const handleSelectCooperative = (coopName: string) => {
    setCoopSearch(coopName);
    
    const matchedReg = REGIONAL_MANAGEMENT_DATA.find(
      r => r.htxName.toLowerCase() === coopName.toLowerCase()
    );
    
    if (matchedReg) {
      setSelectedProvince(matchedReg.province);
      setSelectedWard(matchedReg.ward);
    } else {
      const matchedCoop = COOPERATIVES.find(c => c.name.toLowerCase() === coopName.toLowerCase());
      if (matchedCoop) {
        const config = COOPERATIVE_CONFIGS[matchedCoop.id];
        if (config) {
          setSelectedProvince(config.province);
          const wards = getWardsForProvince(config.province);
          if (wards.length > 0) {
            setSelectedWard(wards[0]);
          }
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Match cooperative based on the coopSearch input
    const searchVal = coopSearch.trim().toLowerCase();
    const matchedCoop = COOPERATIVES.find(c => c.name.toLowerCase() === searchVal)
      || COOPERATIVES.find(c => c.name.toLowerCase().includes(searchVal))
      || COOPERATIVES[0]; // Fallback to first

    const pendingListStr = localStorage.getItem('pending_registration_members');
    const pendingList = pendingListStr ? JSON.parse(pendingListStr) : [];
    
    const newRequest = {
      id: Date.now().toString(),
      name,
      phone,
      cccd,
      province: selectedProvince || 'Lâm Đồng',
      ward: selectedWard || 'Cầu Đất',
      address,
      cooperativeId: matchedCoop.id,
      cooperativeName: matchedCoop.name,
      crop: COOPERATIVE_CONFIGS[matchedCoop.id]?.crops[0] || 'Cà phê Arabica',
      area: '1.5 ha', // standard scale
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    pendingList.push(newRequest);
    localStorage.setItem('pending_registration_members', JSON.stringify(pendingList));
    setAssignedCoopName(matchedCoop.name);
    setRegisteredSuccess(true);
  };

  const getWards = () => {
    return getWardsForProvince(selectedProvince);
  };

  const getCoopList = () => {
    // If both province and ward are selected, filter to that precise location
    if (selectedProvince && selectedWard) {
      const regionalMatches = REGIONAL_MANAGEMENT_DATA
        .filter(r => r.province === selectedProvince && r.ward === selectedWard)
        .map(r => r.htxName);
      if (regionalMatches.length > 0) {
        return regionalMatches;
      }
    }

    // If only province is selected, filter to that province
    if (selectedProvince) {
      const regionalMatches = REGIONAL_MANAGEMENT_DATA
        .filter(r => r.province === selectedProvince)
        .map(r => r.htxName);
      const staticMatches = Object.keys(COOPERATIVE_CONFIGS)
        .filter(id => COOPERATIVE_CONFIGS[id].province === selectedProvince)
        .map(id => COOPERATIVES.find(c => c.id === id)?.name)
        .filter(Boolean) as string[];
      
      const combined = Array.from(new Set([...regionalMatches, ...staticMatches]));
      if (combined.length > 0) return combined;
    }

    // Fallback to all cooperatives
    const allCoopNames = Array.from(new Set([
      ...COOPERATIVES.map(c => c.name),
      ...REGIONAL_MANAGEMENT_DATA.map(r => r.htxName)
    ]));

    return allCoopNames;
  };

  const filteredCoops = (() => {
    const baseList = getCoopList();
    if (coopSearch.trim() === '') return baseList.slice(0, 5);
    
    return baseList.filter(c => {
      const keywords = coopSearch.trim().toLowerCase().split(/\s+/);
      const name = c.toLowerCase();
      return keywords.every(kw => name.includes(kw));
    }).slice(0, 8);
  })();


  return (
    <div className="min-h-screen pt-[72px] bg-white md:flex selection:bg-emerald-200">
      {/* Left side - Decorative */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden lg:flex">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 bg-slate-200">
          <img 
            src="/images/nongsanviet.jpg"
            alt="Agriculture Placeholder"
            className="h-full w-full object-cover"
          />
        </div>
        
        {/* Top brand */}
        <div className="relative z-10 p-12 xl:p-16">
        </div>
        
        {/* Bottom content */}
        <div className="relative z-10 p-12 xl:p-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/20 border border-white/30 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-[#34d399]"></span>
                <span className="text-xs font-bold text-white uppercase tracking-widest drop-shadow-sm">Cộng đồng Nông nghiệp xanh</span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-sm">
                Bắt đầu hành trình <br className="hidden xl:block" />
                số hóa nông sản <span className="text-[#34d399]">của bạn.</span>
              </h1>
              
              <p className="text-white/90 text-lg leading-relaxed mb-10 drop-shadow-sm font-medium">
                Kết nối trực tiếp vào chuỗi cung ứng minh bạch. Quản lý vùng trồng, năng suất và tiêu thụ hiệu quả hơn.
              </p>

              {/* Micro component */}
              <div className="flex gap-4 items-center">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center shadow-sm">
                      <User size={16} className="text-slate-500" />
                    </div>
                  ))}
                </div>
                <div className="text-sm drop-shadow-sm">
                  <span className="text-white font-bold block">50+ Hợp tác xã</span>
                  <span className="text-white/90 font-medium">Đã tham gia mạng lưới liên kết số</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 xl:px-16 overflow-y-auto">
        <motion.div 
          className="mx-auto w-full max-w-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {registeredSuccess ? (
             <div className="text-center py-10 px-4">
                <div className="w-20 h-20 bg-emerald-100 text-[#059669] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-600/10">
                   <ShieldCheck size={40} className="text-[#059669]" strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Đăng ký thành công!</h2>
                
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-left mb-8 space-y-3">
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin đăng ký gửi duyệt</p>
                   <div className="h-px bg-slate-200/60 my-2" />
                   <p className="text-sm font-semibold text-slate-700">
                     Họ và tên: <span className="font-extrabold text-[#059669]">{name}</span>
                   </p>
                   <p className="text-sm font-semibold text-slate-700">
                     Điện thoại: <span className="font-extrabold text-slate-900">{phone}</span>
                   </p>
                   <p className="text-sm font-semibold text-slate-700">
                     CCCD: <span className="font-extrabold text-slate-900 font-mono">{cccd}</span>
                   </p>
                   <p className="text-sm font-semibold text-slate-700">
                     Hợp tác xã: <span className="font-extrabold text-[#059669]">{assignedCoopName}</span>
                   </p>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl mb-10 text-left">
                  <p className="text-emerald-800 font-medium text-xs leading-relaxed">
                    💡 <strong>Hệ thống phân luồng phê duyệt tự động:</strong>
                    <br />
                    Yêu cầu gia nhập đã được chuyển trực tiếp tới tài khoản <strong>Admin của {assignedCoopName}</strong>. 
                     Khi Admin duyệt hồ sơ này, bạn sẽ được <strong>cấp một mật khẩu tạm thời</strong> ngay lập tức để đăng nhập và bắt đầu hoạt động nông dân.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Link 
                    to="/" 
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#059669] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-[#047857] hover:-translate-y-0.5 cursor-pointer"
                  >
                    Về Trang chủ
                  </Link>
                  <Link 
                    to="/login" 
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Đăng nhập tài khoản khác
                  </Link>
                </div>
             </div>
          ) : (
            <>
              {/* Mobile Header */}
              <div className="mb-10 text-center lg:hidden">
                <Link to="/" className="inline-flex items-center gap-2 text-emerald-700 justify-center mb-6">
                   <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                     <Sprout size={24} strokeWidth={2.5} />
                   </div>
                   <span className="text-2xl font-black tracking-tight flex-shrink-0">VietAgri.</span>
                </Link>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Đăng ký thành viên</h2>
                <p className="mt-2 text-slate-500">Kết nối vùng trồng, bắt đầu hành trình số hóa</p>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:block mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">Đăng ký thành viên</h2>
                <p className="text-slate-500 text-lg">Hoàn thành biểu mẫu dưới đây để gia nhập VietAgri</p>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Section 1: Region & Coop */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">1</div>
                    <h3 className="text-lg font-bold text-slate-800">Thông tin khu vực</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tỉnh / TP</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                          required
                          value={selectedProvince}
                          onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setSelectedWard('');
                            setCoopSearch('');
                          }}
                          className="w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-medium text-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none"
                        >
                          <option value="" disabled>Chọn Tỉnh/TP</option>
                          {ALL_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Xã/Phường</label>
                      <div className="relative">
                        <Navigation size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                          required
                          disabled={!selectedProvince}
                          value={selectedWard}
                          onChange={(e) => {
                            setSelectedWard(e.target.value);
                            setCoopSearch('');
                          }}
                          className="w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-medium text-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none disabled:bg-slate-100 disabled:opacity-60"
                        >
                          <option value="" disabled>Chọn Xã/Phường</option>
                          {getWards().map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hợp tác xã trực thuộc</label>
                    <div className="relative group">
                      <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
                      <input 
                        type="text"
                        required
                        value={coopSearch}
                        onChange={(e) => setCoopSearch(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        autoComplete="off"
                        placeholder="Tìm kiếm hợp tác xã của bạn..."
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-medium text-slate-700 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      />
                      {/* Suggestions Popover */}
                      <AnimatePresence>
                        {showSuggestions && (
                          <motion.div
                             initial={{ opacity: 0, y: 10, scale: 0.98 }}
                             animate={{ opacity: 1, y: 0, scale: 1 }}
                             exit={{ opacity: 0, y: 5, scale: 0.98 }}
                             transition={{ duration: 0.2 }}
                             className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-30 overflow-hidden"
                          >
                            {filteredCoops.length > 0 ? (
                              <div className="py-2 max-h-64 overflow-y-auto w-full">
                                 <div className="px-4 py-2 border-b border-slate-50">
                                   <span className="font-bold text-slate-400 text-xs">Gợi ý gần bạn</span>
                                 </div>
                                 {filteredCoops.map((name, idx) => (
                                   <button
                                     key={idx}
                                     type="button"
                                     onClick={() => {
                                       handleSelectCooperative(name);
                                       setShowSuggestions(false);
                                     }}
                                     className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-emerald-50 group/item transition-colors text-slate-700 font-medium whitespace-normal"
                                   >
                                     <div className="text-slate-400 group-hover/item:text-emerald-500 flex-shrink-0">
                                       <CheckCircle2 size={18} />
                                     </div>
                                     <span className="font-medium text-slate-700 group-hover/item:text-emerald-700 break-words">{name}</span>
                                   </button>
                                 ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center">
                                 <p className="text-sm font-medium text-slate-500">Không tìm thấy HTX phù hợp</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={() => setIsSearchModalOpen(true)}
                        className="text-[#059669] hover:text-[#047857] hover:underline text-xs font-extrabold flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Search size={14} />
                        Tra cứu Danh sách HTX & Địa bàn quản lý chi tiết
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 2: Personal Info */}
                <div className="space-y-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">2</div>
                    <h3 className="text-lg font-bold text-slate-800">Thông tin cá nhân</h3>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Họ và tên</label>
                    <div className="relative group">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-medium text-slate-700 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Số CCCD</label>
                      <div className="relative group">
                        <IdCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="text"
                          required
                          value={cccd}
                          onChange={(e) => setCccd(e.target.value)}
                          onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')}
                          placeholder="0123456789"
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-medium text-slate-700 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Điện thoại</label>
                      <div className="relative group">
                        <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')}
                          placeholder="090 123 4567"
                          className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-medium text-slate-700 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Địa chỉ cư trú</label>
                    <div className="relative group">
                      <MapPin size={18} className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                      <textarea 
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Số nhà, Tên đường..."
                        rows={2}
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl outline-none font-medium text-slate-700 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full group relative inline-flex items-center justify-center gap-2 rounded-xl bg-[#059669] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-[#047857] hover:-translate-y-0.5 cursor-pointer"
                  >
                    Hoàn tất đăng ký
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                
                <p className="text-center text-sm text-slate-500 mt-6">
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <a href="#" className="font-bold text-emerald-600 hover:underline">Điều khoản dịch vụ</a> và{' '}
                  <a href="#" className="font-bold text-emerald-600 hover:underline">Chính sách bảo mật</a> của chúng tôi.
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>

      {/* Modal Tra cứu mạng lưới HTX và Địa bàn chi tiết */}
      <AnimatePresence>
        {isSearchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsSearchModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden"
            >
              <button 
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="absolute right-6 top-6 sm:right-8 sm:top-8 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-2xl flex items-center justify-center">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                    Mạng lưới Hợp tác xã & Địa bàn quản lý
                  </h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Hệ thống liên kết số hóa nông nghiệp VietAgri toàn quốc</p>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Tìm theo Tên HTX, đặc sản, người đại diện..."
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 hover:border-slate-300 rounded-xl outline-none font-bold text-xs transition-all"
                  />
                </div>
                
                <div className="relative">
                  <select
                    value={selectedRegionFilter}
                    onChange={(e) => setSelectedRegionFilter(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    <option value="Tất cả">Tất cả các Tỉnh/TP liên kết</option>
                    {Array.from(new Set(REGIONAL_MANAGEMENT_DATA.map(r => r.province))).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Table Area */}
              <div className="flex-1 overflow-y-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Hợp tác xã phụ trách</th>
                      <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Địa bàn quản lý</th>
                      <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Admin liên hệ</th>
                      <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right border-b border-slate-100">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {REGIONAL_MANAGEMENT_DATA
                      .filter(r => {
                        const matchesFilter = selectedRegionFilter === 'Tất cả' || r.province === selectedRegionFilter;
                        const matchesQuery = 
                          r.province.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                          r.district.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                          r.ward.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                          r.htxName.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                          r.adminName.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                          r.specialty.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                          r.phone.includes(modalSearchTerm);
                        return matchesFilter && matchesQuery;
                      })
                      .map((reg, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-extrabold text-slate-800 text-xs">{reg.htxName}</p>
                              <p className="text-[10px] text-emerald-600 font-extrabold uppercase mt-1 bg-emerald-50 inline-block px-1.5 py-0.5 rounded">
                                ID: {reg.htxId} • {reg.specialty}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <MapPin size={14} className="text-[#059669] shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-slate-700 text-xs">{reg.ward}, {reg.district}</p>
                                <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5">{reg.province}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                                <User size={12} className="text-slate-400" />
                                {reg.adminName}
                              </p>
                              <p className="text-[10px] text-emerald-700 font-bold mt-1 bg-emerald-50/50 px-1.5 py-0.5 rounded inline-block font-mono">
                                SĐT: {reg.phone}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setCoopSearch(reg.htxName);
                                setSelectedProvince(reg.province);
                                setSelectedWard(reg.ward);
                                setIsSearchModalOpen(false);
                              }}
                              className="px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-[10px] uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 animate-none"
                            >
                              Chọn HTX
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>

              <div className="mt-5 text-center text-[11px] font-medium text-slate-400 border-t border-slate-50 pt-4 flex items-center justify-between">
                <span>💡 Chọn HTX sẽ tự động thiết lập Tỉnh/TP & Quận/Huyện tương ứng</span>
                <button
                  type="button"
                  onClick={() => setIsSearchModalOpen(false)}
                  className="text-slate-500 hover:text-slate-800 font-bold"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
