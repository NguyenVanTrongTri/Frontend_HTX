import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldHalf
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// TODO: Đảm bảo authService tồn tại tại đường dẫn này
import authService from '../../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Kiểm tra tài khoản cứng trước
    if ((phone === '0901234567' && password === 'superadmin') || (phone === '013' && password === '013') || (phone === '1' && password === '1')) {
      localStorage.setItem('userRole', 'super-admin');
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('userEmail', 'superadmin@vietagri.vn');
      navigate('/super-admin');
      setIsLoading(false);
      return;
    } else if ((phone === '0901234568' && password === 'admin') || (phone === '012' && password === '012') || (phone === '2' && password === '2')) {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('userEmail', 'admin@vietagri.vn');
      navigate('/admin');
      setIsLoading(false);
      return;
    } else if ((phone === '123' && password === '123') || (phone === '3' && password === '3') || (phone === '001' && password === '001')) {
      localStorage.setItem('userRole', 'farmer');
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('userEmail', 'farmer@vietagri.vn');
      navigate('/farmer-dashboard');
      setIsLoading(false);
      return;
    } else if ((phone === '0901234570' && password === 'khachhang') || (phone === '011' && password === '011') || (phone === '4' && password === '4')) {
      localStorage.setItem('userRole', 'customer');
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('userEmail', 'customer@vietagri.vn');
      navigate('/customer-dashboard');
      setIsLoading(false);
      return;
    }

    // Kiểm tra trong danh sách người dùng đã đăng ký (cho đối tác/doanh nghiệp phê duyệt mới)
    const usersRaw = localStorage.getItem('registered_admins');
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      const phoneLower = phone.toLowerCase();
      const foundUser = users.find((u: any) => 
        (u.phone === phone || u.username === phone || (u.id && u.id.toLowerCase() === phoneLower)) && 
        u.password === password
      );
      if (foundUser) {
        // Normalize role for administrative users
        let normalizedRole = foundUser.role;
        if (normalizedRole?.startsWith('admin') || normalizedRole === 'admin') {
            normalizedRole = 'admin';
        } else if (normalizedRole === 'superadmin') {
            normalizedRole = 'super-admin';
        }
        
        localStorage.setItem('userRole', normalizedRole);
        localStorage.setItem('userPhone', foundUser.phone);
        localStorage.setItem('userEmail', foundUser.email || '');
        localStorage.setItem('userName', foundUser.name || '');
        localStorage.setItem('current_user', JSON.stringify({ ...foundUser, role: normalizedRole }));
        
        // Redirect based on role
        if (normalizedRole === 'enterprise') {
          navigate('/customer-dashboard');
        } else if (normalizedRole === 'farmer' || normalizedRole === 'farmer-member') {
          navigate('/farmer-dashboard');
        } else if (normalizedRole === 'admin') {
          navigate('/admin');
        } else if (normalizedRole === 'super-admin') {
          navigate('/super-admin');
        } else {
          navigate('/');
        }
        setIsLoading(false);
        return;
      }
    }

    try {
      // Gọi API
      const res = await authService.login(phone, password);

      // BE trả role
      const roleName = res.data.role;

      // Lưu trữ thông tin đăng nhập vào localStorage để các trang dashboard đọc được
      localStorage.setItem('userPhone', res.data.phone);

      if (roleName?.startsWith('admin') || roleName === 'admin') {
        localStorage.setItem('userRole', 'admin');
        return navigate('/admin');
      }
      
      if (
        roleName === 'farmer' || 
        roleName === 'farmer-member' || 
        roleName === 'Nhân viên' || 
        roleName === 'Kế toán HTX' || 
        roleName === 'Nhân viên Thu mua' || 
        roleName === 'Nhân viên Kho' || 
        roleName === 'Quản lý Vùng trồng'
      ) {
        localStorage.setItem('userRole', 'farmer');
        return navigate('/farmer-dashboard');
      }
      
      if (roleName === 'customer') {
        localStorage.setItem('userRole', 'customer');
        return navigate('/customer-dashboard');
      }
      
      if (roleName === 'super-admin' || roleName === 'superadmin') {
        localStorage.setItem('userRole', 'super-admin');
        return navigate('/super-admin');
      }

      localStorage.setItem('userRole', roleName);
      return navigate('/');
    } catch (err: any) {
      if (err === 'Invalid credentials') {
        console.info('Login attempt failed: Invalid credentials');
        setError('Số điện thoại hoặc mật khẩu không chính xác.');
      } else {
        console.error('API login error:', err);
        setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Left Side (Visual & Identity - 60%) */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        {/* Main Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000")' }}
        />
        
        {/* Emerald Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/60 via-emerald-400/40 to-emerald-200/20 mix-blend-multiply" />
        
        {/* Content Container */}
        <div className="relative z-10 p-16 flex flex-col justify-between w-full">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-transform">
              <span className="text-[#059669] font-black text-2xl">V</span>
            </div>
            <span className="text-2xl font-black text-white tracking-widest uppercase">
              VIETAGRI <span className="text-[#4ade80]">DIGITAL</span>
            </span>
          </Link>

          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight mb-8"
            >
              Chào mừng trở lại với <br />
              <span className="text-[#4ade80]">Hệ sinh thái</span> <br />
              Nông nghiệp Số.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-xl max-w-xl font-medium leading-relaxed"
            >
              Nơi kết nối giá trị thực, minh bạch nguồn gốc và nâng tầm nông sản Việt thông qua công nghệ 4.0.
            </motion.p>
          </div>

          {/* Floating Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/20 p-6 rounded-[2rem] border border-white/20 self-start backdrop-blur-xl flex items-center gap-6"
          >
            <div className="w-14 h-14 bg-[#4ade80]/20 rounded-2xl flex items-center justify-center text-[#4ade80]">
              <ShieldHalf size={32} className="animate-pulse" />
            </div>
            <div>
              <p className="text-[#4ade80] text-[10px] font-black uppercase tracking-[0.2em] mb-1">An ninh hệ thống</p>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">Hệ thống đang bảo mật</span>
                <span className="text-white/60 text-xs font-medium uppercase tracking-wider">256-bit Encryption Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side (Login Form Card - 40%) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 sm:p-12 md:p-16 relative bg-white lg:bg-transparent">
        {/* Mobile Background (Hidden on Desktop) */}
        <div 
          className="lg:hidden absolute inset-0 bg-cover bg-center brightness-[0.4]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000")' }}
        />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Form Card */}
          <div className="bg-white/80 p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/20 backdrop-blur-3xl overflow-hidden relative group">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-emerald-950 mb-3 tracking-tighter">Đăng Nhập</h2>
              <p className="text-slate-500 font-bold text-sm tracking-wide">Nhập thông tin tài khoản để tiếp tục</p>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] text-red-500 font-bold uppercase tracking-wider text-center"
                >
                  {error}
                </motion.div>
              )}
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Phone Input */}
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#059669] transition-colors">
                  <Phone size={20} />
                </div>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                  }}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Số điện thoại đăng nhập"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-[#4ade80] rounded-3xl outline-none font-bold text-emerald-950 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#059669] transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="w-full pl-16 pr-14 py-5 bg-slate-50 border-2 border-transparent focus:border-[#4ade80] rounded-3xl outline-none font-bold text-emerald-950 transition-all placeholder:text-slate-400"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-950 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-6 h-6 bg-slate-100 rounded-lg border-2 border-transparent peer-checked:bg-[#4ade80] peer-checked:border-[#4ade80] transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                      <ArrowRight size={14} className="rotate-[-45deg]" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-950 transition-colors">Duy trì đăng nhập</span>
                </label>
                <Link to="/forgot-password" className="text-xs font-black text-[#4ade80] hover:text-emerald-950 uppercase tracking-widest underline decoration-2 underline-offset-4">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-6 bg-gradient-to-r from-emerald-900 to-[#059669] hover:from-[#059669] hover:to-emerald-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-emerald-900/20 transform hover:-translate-y-1 transition-all relative overflow-hidden group"
              >
                <span className={`flex justify-center items-center gap-3 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  Vào Hệ Thống <ArrowRight size={18} />
                </span>
                
                {isLoading && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </button>

              {/* Register Links */}
              <div className="pt-6 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Bạn chưa có tài khoản?</p>
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    to="/register" 
                    className="py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black text-emerald-950 uppercase tracking-[0.15em] hover:bg-emerald-900 hover:text-white hover:border-emerald-900 transition-all"
                  >
                    Đăng ký Xã viên
                  </Link>
                  <Link 
                    to="/register-enterprise" 
                    className="py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black text-amber-500 uppercase tracking-[0.15em] hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all"
                  >
                    Đăng ký Doanh nghiệp
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
