import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, ShieldCheck, Globe, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerHero = () => {
  const userEmail = localStorage.getItem('userEmail') || 'Người dùng';
  const userRole = localStorage.getItem('userRole');

  const getDashboardLink = () => {
    switch (userRole) {
      case 'super-admin': return '/super-admin';
      case 'admin': return '/admin';
      case 'farmer': return '/farmer-dashboard';
      case 'customer': return '/customer-dashboard';
      default: return '/';
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900 pt-20">
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-emerald-800/60 via-emerald-700/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/30 font-bold text-xs uppercase tracking-widest mb-6">
              Xin chào, {userEmail}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
              <span className="text-white">Chào Mừng Trở Lại</span>
              <br />
              <span className="bg-gradient-to-r from-[#4ade80] to-white bg-clip-text text-transparent">
                HỆ SINH THÁI VIETAGRI
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-xl font-medium">
              Bạn đang ở trong trang chủ dành riêng cho Thành viên Hệ sinh thái. Khám phá các nông sản chất lượng và truy cập quản trị hệ thống.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to={getDashboardLink()}
                className="px-8 py-4 bg-[#4ade80] text-[#004d40] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4ade80]/20 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
              >
                Về lại Dashboard
                <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
              </Link>
              <Link 
                to="/products"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 text-center"
              >
                <Package className="w-5 h-5" /> Cửa hàng mua sắm
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex flex-wrap gap-8"
          >
            <div className="flex items-center gap-3 text-white/80 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <ShieldCheck className="text-[#4ade80]" />
              <span className="text-xs font-bold uppercase tracking-wider">Hội viên VIP</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <Leaf className="text-[#4ade80]" />
              <span className="text-xs font-bold uppercase tracking-wider">Chính sách đặc biệt</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <Globe className="text-[#4ade80]" />
              <span className="text-xs font-bold uppercase tracking-wider">Hỗ trợ 24/7</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
