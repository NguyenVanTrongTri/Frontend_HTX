
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  User, 
  CreditCard, 
  ShieldCheck, 
  LogOut, 
  Camera,
  Shield,
  Calendar,
  MapPin,
  Fingerprint,
  ChevronRight,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import authService from '../../services/authService';

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

export default function AdminProfilePage() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<any>(null);

    useEffect(() => {
        const fetchAdmin = async () => {
            const { data: user } = await authService.me();
            const storedAdmins = localStorage.getItem('registered_admins');
            if (storedAdmins && user.phone) {
                const admins = JSON.parse(storedAdmins);
                const foundAdmin = admins.find((a: any) => a.phone === user.phone);
                if (foundAdmin) {
                    const htx = COOPERATIVES.find(c => c.id === foundAdmin.cooperativeId);
                    setAdmin({
                        ...foundAdmin,
                        htxName: htx ? htx.name : (foundAdmin.htxName || 'Chưa rõ HTX')
                    });
                } else if (user.name) {
                    // Handling hardcoded or custom users that might not be in registered_admins list explicitly
                    setAdmin({
                      name: user.name,
                      phone: user.phone,
                      email: user.email || 'admin@vietagri.vn',
                      cccd: user.cccd || '0123456789XX',
                      role: user.role,
                      htxName: user.htxName || 'HTX Cà phê Cầu Đất',
                      cooperativeId: user.cooperativeId || 'HTX-001'
                    });
                }
            }
        };
        fetchAdmin();
    }, []);

    const handleLogout = () => {
        authService.logout();
        localStorage.removeItem('userRole');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    if (!admin) return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfdfd] font-sans text-slate-800 pb-20">
            {/* Precision Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/60 px-6 py-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-3 text-emerald-900 font-black text-[10px] uppercase tracking-[0.2em] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                    <ArrowLeft size={16} />
                  </div>
                  Quay lại trang quản trị
                </button>
                
                <div className="flex items-center gap-4">
                   <button 
                    onClick={handleLogout}
                    className="px-6 py-2.5 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 border border-red-100/50 shadow-sm"
                  >
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </div>
              </div>
            </nav>

            <div className="pt-28 max-w-6xl mx-auto px-6">
              <div className="grid lg:grid-cols-12 gap-10">
                
                {/* Immersive Profile Hero */}
                <div className="lg:col-span-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 rounded-[3.5rem] p-4 relative overflow-hidden shadow-2xl h-72 md:h-80"
                  >
                    {/* Architectural Accents */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-mint opacity-[0.05] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    
                    <div className="relative h-full flex flex-col md:flex-row items-center md:items-end p-10 md:p-14 gap-10">
                      <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[3.5rem] shadow-2xl flex items-center justify-center text-emerald-900 text-5xl md:text-7xl font-black tracking-tighter border-[10px] border-white/20 overflow-hidden relative group">
                          {admin.avatar ? (
                            <img src={admin.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>{admin.name?.charAt(0) || 'A'}</span>
                          )}
                          <div className="absolute inset-0 bg-emerald-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                            <Camera size={36} className="text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 text-center md:text-left mb-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            {admin.name}
                          </h1>
                          <div className="inline-flex items-center gap-2 px-5 py-2 bg-mint/20 backdrop-blur-md text-mint border border-mint/30 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/40 mx-auto md:mx-0">
                            <Shield size={14} className="animate-pulse" /> Verified Admin
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-white/50 font-black text-[10px] uppercase tracking-[0.2em]">
                          <span className="flex items-center gap-2.5"><Building2 size={16} className="text-mint" /> {admin.htxName}</span>
                          <span className="flex items-center gap-2.5"><Calendar size={16} className="text-mint" /> Tham gia hệ thống: 2024</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Information Grid System */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Privilege Badge */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100/80"
                  >
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Đặc quyền quản trị</h3>
                    <div className="space-y-5">
                       <div className="p-6 bg-emerald-50/50 rounded-[2rem] flex items-center gap-5 border border-emerald-100/50">
                        <div className="w-12 h-12 bg-emerald-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-950 uppercase tracking-widest opacity-40">Cấp độ</p>
                          <p className="text-sm font-black text-emerald-900 italic">Quản Trị Viên HTX</p>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50/50 rounded-[2rem] flex items-center gap-5 border border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                          <Zap size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Trạng thái số</p>
                          <p className="text-sm font-black text-emerald-600">Active Node</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Settings Shortcuts */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100/80"
                  >
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Trung tâm bảo mật</h3>
                    <button className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-emerald-900 hover:text-white rounded-2xl group transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <Fingerprint size={20} className="text-emerald-600 group-hover:text-mint" />
                        <span className="text-sm font-black uppercase tracking-widest">Đổi mã định danh</span>
                      </div>
                      <ChevronRight size={18} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </motion.div>
                </div>

                {/* Profile Details (Main) */}
                <div className="lg:col-span-8 space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-12 rounded-[4rem] shadow-xl shadow-slate-200/40 border border-slate-100/80 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8">
                      <button className="px-8 py-4 bg-emerald-50 text-emerald-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-900 hover:text-white transition-all shadow-sm">Chỉnh sửa hồ sơ</button>
                    </div>

                    <h2 className="text-3xl font-black text-emerald-950 mb-14 tracking-tight flex items-center gap-5 italic uppercase">
                      <div className="w-1.5 h-10 bg-mint rounded-full" /> Thông tin nhân sự
                    </h2>

                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                      {[
                        { label: "Họ và tên", value: admin.name, icon: <User size={22} /> },
                        { label: "Số điện thoại", value: admin.phone, icon: <Phone size={22} /> },
                        { label: "Mã định danh (CCCD)", value: admin.cccd, icon: <CreditCard size={22} /> },
                        { label: "Email hệ thống", value: admin.email, icon: <Mail size={22} /> },
                        { label: "HTX trực thuộc", value: admin.htxName, icon: <Building2 size={22} />, full: true },
                        { label: "Địa chỉ công tác", value: admin.address || "Tòa nhà Agri-Digital, Thành phố Đà Lạt", icon: <MapPin size={22} />, full: true },
                      ].map((field, i) => (
                        <div key={i} className={`${field.full ? 'md:col-span-2' : ''} group`}>
                          <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-4">{field.label}</label>
                          <div className="flex items-center gap-5">
                            <div className="text-mint group-hover:scale-110 transition-transform duration-300">{field.icon}</div>
                            <span className="text-lg font-black text-emerald-950 group-hover:text-emerald-700 transition-colors">{field.value}</span>
                          </div>
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
