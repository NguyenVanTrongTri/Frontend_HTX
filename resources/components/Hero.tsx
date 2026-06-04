import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  const userRole = localStorage.getItem('userRole');
  
  const getDashboardLink = () => {
    switch (userRole) {
      case 'super-admin': return '/super-admin';
      case 'admin': return '/admin';
      case 'farmer': return '/farmer-dashboard';
      case 'customer': return '/customer-dashboard';
      default: return '/login';
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900 pt-20">
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-emerald-700/40 via-emerald-600/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-[#059669]/20 text-[#4ade80] border border-[#059669]/30 font-semibold text-sm mb-6">
              Nông nghiệp thông minh 4.0
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-[#4ade80] to-white bg-clip-text text-transparent inline-block py-1">
                SỐ HÓA NÔNG NGHIỆP
              </span>
              <br />
              <span className="text-white">VIỆT NAM</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-xl">
              Nền tảng kết nối thông minh giữa Nông dân, Hợp tác xã và Doanh nghiệp toàn cầu 
              nhằm tối ưu hóa chuỗi giá trị nông sản Việt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products"
                className="px-8 py-4 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-2xl font-bold text-lg shadow-xl shadow-amber/20 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
              >
                Cửa hàng Nông sản
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to={getDashboardLink()}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 text-center"
              >
                {userRole ? 'Vào Dashboard' : 'Tham gia HTX ngay'}
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex flex-wrap gap-8"
          >
            <div className="flex items-center gap-3 text-white/70">
              <ShieldCheck className="text-[#4ade80]" />
              <span className="text-sm font-medium">Truy xuất 100%</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Leaf className="text-[#4ade80]" />
              <span className="text-sm font-medium">Tiêu chuẩn VietGAP</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Globe className="text-[#4ade80]" />
              <span className="text-sm font-medium">Kết nối toàn cầu</span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="hidden lg:block absolute right-12 bottom-24 bg-black/40 backdrop-blur-xl p-8 rounded-3xl w-80 text-white border border-white/10"
      >
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-3xl font-bold text-[#4ade80] mb-1">500+</div>
            <div className="text-sm text-white/60">Hộ gia đình nông dân</div>
          </div>
          <div className="h-px bg-white/10" />
          <div>
            <div className="text-3xl font-bold text-[#f59e0b] mb-1">1,000+ Ha</div>
            <div className="text-sm text-white/60">Vùng trồng hữu cơ</div>
          </div>
          <div className="h-px bg-white/10" />
          <div>
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-sm text-white/60">Sản phẩm truy xuất nguồn gốc</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
