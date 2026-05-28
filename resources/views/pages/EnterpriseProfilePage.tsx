import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  FileText,
  Camera,
  LogOut,
  ChevronRight,
  Fingerprint,
  ArrowLeft,
  Calendar,
  Globe,
  Settings,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function EnterpriseProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: user } = await authService.me();
        if (user && user.role !== 'customer') { // 'customer' is default when not logged in in me()
          setUserData(user);
        } else {
          // Check localStorage as fallback
          const phone = localStorage.getItem('userPhone');
          const usersRaw = localStorage.getItem('registered_admins');
          if (phone && usersRaw) {
            const users = JSON.parse(usersRaw);
            const found = users.find((u: any) => u.phone === phone);
            if (found) setUserData(found);
          }
        }
      } catch (err) {
        console.error('Fetch user error', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    localStorage.removeItem('current_user');
    navigate('/login');
  };

  if (!userData) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#004d40]/20 border-t-[#004d40] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      {/* Dynamic Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/customer-dashboard')}
            className="flex items-center gap-3 text-[#004d40] font-black text-xs uppercase tracking-widest group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#004d40] group-hover:text-white transition-all">
              <ArrowLeft size={16} />
            </div>
            Quay lại trang chủ
          </button>
          
          <div className="flex items-center gap-4">
             <button className="text-slate-400 hover:text-[#004d40] transition-colors"><Settings size={20} /></button>
             <button 
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 border border-red-100"
            >
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Cover & Profile Header Area - 12 cols initially, then split? No, let's do a bento grid */}
          <div className="lg:col-span-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#004d40] rounded-[3rem] p-4 relative overflow-hidden shadow-2xl h-64 md:h-80"
            >
              {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400 opacity-[0.05] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
              
              <div className="relative h-full flex flex-col md:flex-row items-center md:items-end p-8 md:p-12 gap-8">
                <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-[#004d40] text-5xl md:text-6xl font-black italic border-8 border-white overflow-hidden relative group">
                    {userData.avatar ? (
                      <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{userData.name?.charAt(0) || 'D'}</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera size={32} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left mb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">
                      {userData.name || 'Doanh Nghiệp Đối Tác'}
                    </h1>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4ade80] text-[#004d40] rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#4ade80]/20 mx-auto md:mx-0">
                      <Shield size={12} /> Verification
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/70 font-bold text-xs uppercase tracking-[0.15em]">
                    <span className="flex items-center gap-2"><MapPin size={14} className="text-emerald-400" /> Trụ sở: Hà Nội</span>
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-emerald-400" /> Tham gia: 2024</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Left Column: Quick Actions & Stats */}
          <div className="lg:col-span-4 space-y-8">
            {/* Account Security Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Bảo mật tài khoản</h3>
              <div className="space-y-4">
                 <button 
                  onClick={() => navigate('/customer/change-password')}
                  className="w-full p-5 bg-slate-50 hover:bg-[#004d40] rounded-2xl flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#004d40] transition-colors">
                      <Fingerprint size={20} />
                    </div>
                    <span className="text-sm font-black text-slate-600 group-hover:text-white transition-colors">Đổi mật khẩu</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
                
                <div className="p-5 bg-emerald-50 rounded-2xl flex items-center gap-4 border border-emerald-100">
                  <div className="w-10 h-10 bg-[#004d40] rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Trạng thái</p>
                    <p className="text-xs font-black text-emerald-700">Đã xác thực 2FA</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-2 gap-6"
            >
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hợp đồng</p>
                  <p className="text-3xl font-black text-[#004d40]">12</p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Xếp hạng</p>
                  <div className="flex items-center justify-center gap-0.5 text-amber-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-lg font-black text-slate-700 ml-1">4.9</span>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                <h2 className="text-2xl font-black text-[#004d40] italic flex items-center gap-3">
                  <Building2 size={28} /> Thông tin chính thức
                </h2>
                <button className="px-6 py-3 bg-[#004d40]/5 text-[#004d40] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#004d40] hover:text-white transition-all">Cập nhật</button>
              </div>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { label: "Mã số thuế", value: userData.taxCode || '0123456789', icon: <Fingerprint size={18} /> },
                  { label: "Email liên hệ", value: userData.email || 'info@enterprise.vn', icon: <Mail size={18} /> },
                  { label: "Số điện thoại", value: userData.phone, icon: <Phone size={18} /> },
                  { label: "Website", value: "www.vietagri-partner.vn", icon: <Globe size={18} /> }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{item.label}</label>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="text-emerald-500">{item.icon}</div>
                      <span className="text-base font-black group-hover:text-[#004d40] transition-colors">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Legal Documents */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <h2 className="text-2xl font-black text-[#004d40] italic flex items-center gap-3 mb-8">
                <FileText size={28} /> Hồ sơ & Giấy phép
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: "Giấy phép KD", file: "GPKD_2024.pdf", size: "1.2 MB" },
                  { name: "Chứng nhận ISO", file: "ISO_9001.pdf", size: "0.8 MB" },
                ].map((doc, i) => (
                  <div key={i} className="p-5 bg-slate-50 hover:bg-white rounded-2xl border border-transparent hover:border-emerald-100 hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#004d40] shadow-sm">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-700">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{doc.size}</p>
                      </div>
                    </div>
                    <button className="text-[#4ade80] opacity-0 group-hover:opacity-100 transition-opacity">
                       <ChevronRight size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Star({ size, fill, className }: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={fill || "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

