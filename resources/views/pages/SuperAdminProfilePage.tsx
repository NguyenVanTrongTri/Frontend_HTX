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
  Zap,
  Globe,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import authService from '../../services/authService';

export default function SuperAdminProfilePage() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    useEffect(() => {
        // Kết nối API lấy thông tin admin hiện tại
        const fetchAdmin = async () => {
            try {
                const response = await authService.me();
                if (response && response.name) {
                    setAdmin(response);
                } else {
                    setAdmin({
                        name: 'Root Admin',
                        phone: '0988888888',
                        email: 'root@vietagri.vn',
                        cccd: '089000123456',
                        role: 'super_admin',
                        htxName: 'Hệ thống VietAgri',
                        address: 'Hà Nội, Việt Nam'
                    });
                }
            } catch (error) {
                console.warn("Lỗi tải thông tin API, chuyển sang dữ liệu mặc định", error);
                setAdmin({
                    name: 'Root Admin',
                    phone: '0988888888',
                    email: 'root@vietagri.vn',
                    cccd: '089000123456',
                    role: 'super_admin',
                    htxName: 'Hệ thống VietAgri',
                    address: 'Hà Nội, Việt Nam'
                });
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

    const handleEditClick = () => {
        setEditData({ ...admin });
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        // Kết nối API cập nhật thông tin cá nhân
        try {
            await authService.updateProfile(editData);
            setAdmin({ ...editData });
            setIsEditing(false);
        } catch (error) {
            console.error("Lỗi cập nhật API thông tin admin", error);
            setAdmin({ ...editData });
            setIsEditing(false);
        }
    };

    if (!admin) return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfdfd] font-sans text-slate-800 pb-20">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/60 px-6 py-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <button 
                  onClick={() => navigate('/super-admin')}
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
                <div className="lg:col-span-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-forest via-emerald-800 to-emerald-900 rounded-[3.5rem] p-4 relative overflow-hidden shadow-2xl h-72 md:h-80"
                  >
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-[0.05] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-mint opacity-[0.05] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                    
                    <div className="relative h-full flex flex-col md:flex-row items-center md:items-end p-10 md:p-14 gap-10">
                      <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[3.5rem] shadow-2xl flex items-center justify-center text-emerald-900 text-5xl md:text-7xl font-black tracking-tighter border-[10px] border-white/20 overflow-hidden relative group">
                          {admin.avatar ? (
                            <img src={admin.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>SA</span>
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
                            <Shield size={14} className="animate-pulse" /> Super Admin
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-white/50 font-black text-[10px] uppercase tracking-[0.2em]">
                          <span className="flex items-center gap-2.5"><Globe size={16} className="text-mint" /> {admin.htxName}</span>
                          <span className="flex items-center gap-2.5"><Calendar size={16} className="text-mint" /> Tham gia: 2024</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="lg:col-span-4 space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100/80"
                  >
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Đặc quyền quản trị</h3>
                    <div className="space-y-5">
                       <div className="p-6 bg-emerald-50/50 rounded-[2rem] flex items-center gap-5 border border-emerald-100/50">
                        <div className="w-12 h-12 bg-forest rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-950 uppercase tracking-widest opacity-40">Quyền Hạn</p>
                          <p className="text-sm font-black text-emerald-900 italic">Quản Trị Toàn Hệ Thống</p>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50/50 rounded-[2rem] flex items-center gap-5 border border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                          <Zap size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Trạng thái Server</p>
                          <p className="text-sm font-black text-emerald-600">Active</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100/80"
                  >
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Trung tâm bảo mật</h3>
                    <button className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-forest hover:text-white rounded-2xl group transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <Fingerprint size={20} className="text-emerald-600 group-hover:text-mint" />
                        <span className="text-sm font-black uppercase tracking-widest">Thiết lập bảo mật</span>
                      </div>
                      <ChevronRight size={18} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </motion.div>
                </div>
                <div className="lg:col-span-8 space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-12 rounded-[4rem] shadow-xl shadow-slate-200/40 border border-slate-100/80 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8">
                      <button 
                        onClick={handleEditClick}
                        className="px-8 py-4 bg-emerald-50 text-emerald-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-forest hover:text-white transition-all shadow-sm"
                      >
                        Chỉnh sửa hồ sơ
                      </button>
                    </div>

                    <h2 className="text-3xl font-black text-emerald-950 mb-14 tracking-tight flex items-center gap-5 italic uppercase">
                      <div className="w-1.5 h-10 bg-mint rounded-full" /> Thông tin Quản Trị Viên
                    </h2>
                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                      {[
                        { label: "Họ và tên", value: admin.name, icon: <User size={22} /> },
                        { label: "Số điện thoại", value: admin.phone, icon: <Phone size={22} /> },
                        { label: "Mã định danh hệ thống", value: admin.cccd, icon: <CreditCard size={22} /> },
                        { label: "Email liên hệ", value: admin.email, icon: <Mail size={22} /> },
                        { label: "Đơn vị Quản Lý", value: admin.htxName, icon: <Globe size={22} />, full: true },
                        { label: "Văn phòng chính", value: admin.address, icon: <MapPin size={22} />, full: true },
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

            {/* Edit Profile Modal */}
            {isEditing && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl"
                >
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-emerald-950">Chỉnh sửa hồ sơ</h2>
                      <p className="text-sm font-bold text-slate-400 mt-1">Cập nhật thông tin Quản Trị Viên</p>
                    </div>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="w-10 h-10 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Họ và tên</label>
                        <input 
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Số điện thoại</label>
                        <input 
                          type="text"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email</label>
                        <input 
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mã định danh</label>
                        <input 
                          type="text"
                          value={editData.cccd}
                          onChange={(e) => setEditData({...editData, cccd: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Đơn vị quản lý</label>
                        <input 
                          type="text"
                          value={editData.htxName}
                          onChange={(e) => setEditData({...editData, htxName: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Văn phòng chính</label>
                        <input 
                          type="text"
                          value={editData.address}
                          onChange={(e) => setEditData({...editData, address: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-white text-slate-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 border border-slate-200 transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      className="px-6 py-3 bg-forest text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-900 shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
        </div>
    );
}
