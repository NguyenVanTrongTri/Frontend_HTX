import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Leaf } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Logic kiểm tra đường dẫn để đổi màu Navbar
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isProductsPage = location.pathname === '/products';
  
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Kiểm tra trạng thái đăng nhập
    const role = localStorage.getItem('userRole');
    if (role) {
      setIsCustomer(true); // Using isCustomer as generic isLogged check for UI
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Bản đồ GIS', href: '#' },
    { name: 'Tin tức', href: '/news' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  const getDashboardLink = () => {
    const role = localStorage.getItem('userRole');
    if (role?.startsWith('admin') || role === 'admin') return '/admin';
    if (role === 'super-admin' || role === 'superadmin') return '/super-admin';
    
    switch (role) {
      case 'farmer': 
      case 'farmer-member':
      case 'Nhân viên':
      case 'Kế toán HTX':
      case 'Nhân viên Thu mua':
      case 'Nhân viên Kho':
      case 'Quản lý Vùng trồng':
        return '/farmer-dashboard';
      case 'customer': 
      case 'enterprise':
        return '/customer-dashboard';
      default: return '/customer-dashboard';
    }
  };

  // Quyết định giao diện Navbar dựa trên trạng thái cuộn hoặc trang hiện tại
  const useDarkNav = isScrolled || !isLandingPage;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useDarkNav 
          ? 'bg-white py-4 shadow-md border-b border-gray-100' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-1.5 rounded-lg transition-colors ${useDarkNav ? 'bg-[#004d40]' : 'bg-white/10 backdrop-blur-md'}`}>
              <Leaf className={`w-6 h-6 ${useDarkNav ? 'text-[#4ade80]' : 'text-white'}`} />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors ${useDarkNav ? 'text-[#004d40]' : 'text-white'}`}>
              VIETAGRI <span className="text-[#4ade80]">DIGITAL</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.href}
                className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#4ade80] ${
                  useDarkNav ? 'text-gray-600' : 'text-white/90'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isCustomer ? (
              <Link 
                to={getDashboardLink()}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#059669] text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-[#047857] transition-all"
              >
                Dashboard <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest border transition-all ${
                    useDarkNav 
                      ? 'border-gray-200 text-gray-700 hover:bg-[#f59e0b] hover:text-white hover:border-[#f59e0b]' 
                      : 'border-white/20 text-white hover:bg-[#f59e0b] hover:border-[#f59e0b]'
                  }`}
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2.5 bg-[#059669] text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-[#047857] transition-all"
                >
                  Tham gia HTX
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`md:hidden p-2 rounded-lg transition-colors ${useDarkNav ? 'text-[#004d40]' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            className="md:hidden bg-white border-t border-gray-100 origin-top shadow-2xl"
          >
            <div className="p-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href}
                  className="py-4 text-gray-700 font-bold border-b border-gray-50 last:border-0 hover:text-[#059669] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-6">
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 text-center border-2 border-gray-100 rounded-2xl font-bold text-[#059669] hover:bg-[#f59e0b] hover:text-white hover:border-[#f59e0b] transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 text-center bg-[#059669] text-white rounded-2xl font-bold"
                >
                  Tham gia HTX
                </Link>
                <Link 
                  to="/register-enterprise"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 text-center text-slate-400 font-bold text-xs uppercase tracking-widest"
                >
                  Đăng ký đối tác doanh nghiệp
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
