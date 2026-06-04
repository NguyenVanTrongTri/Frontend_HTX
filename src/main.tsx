import React, {StrictMode, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Layout from '../resources/views/layouts/app.tsx';
import LandingPage from '../resources/views/pages/LandingPage.tsx';
import LoginPage from '../resources/views/pages/LoginPage.tsx';
import ProductsPage from '../resources/views/pages/ProductsPage.tsx';
import AdminDashboard from '../resources/views/pages/AdminDashboard.tsx';
import CustomerDashboard from '../resources/views/pages/CustomerDashboard.tsx';
import ContractPage from '../resources/views/pages/ContractPage.tsx';
import ContractPageCustomer from '../resources/views/pages/ContractPageCustomer.tsx';
import EnterpriseRegistrationPage from '../resources/views/pages/EnterpriseRegistrationPage.tsx';
import FarmerDashboard from '../resources/views/pages/FarmerDashboard.tsx';
import ContractPageFarmer from '../resources/views/pages/ContractPageFarmer.tsx';
import ProductDetailPage from '../resources/views/pages/ProductDetailPage.tsx';
import RegistrationPage from '../resources/views/pages/RegistrationPage.tsx';
import PolicyPage from '../resources/views/pages/PolicyPage.tsx';
import NewsPage from '../resources/views/pages/NewsPage.tsx';
import ContactPage from '../resources/views/pages/ContactPage.tsx';
import SuperAdminDashboard from '../resources/views/pages/SuperAdminDashboard.tsx';
import SuperAdminProfilePage from '../resources/views/pages/SuperAdminProfilePage.tsx';
import AdminProfilePage from '../resources/views/pages/AdminProfilePage.tsx';
import FarmerProfilePage from '../resources/views/pages/FarmerProfilePage.tsx';
import EnterpriseProfilePage from '../resources/views/pages/EnterpriseProfilePage.tsx';
import PasswordChangePage from '../resources/views/pages/PasswordChangePage.tsx';
import ForgotPasswordPage from '../resources/views/pages/ForgotPasswordPage.tsx';
import ContractInternalPage from '../resources/views/pages/ContractInternalPage.tsx';
import { AlertTriangle, LogIn } from 'lucide-react';
import '../resources/css/app.css';

function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const [isMaintenance, setIsMaintenance] = useState(() => {
    return localStorage.getItem('vietagri_maintenance_mode') === 'true';
  });
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsMaintenance(localStorage.getItem('vietagri_maintenance_mode') === 'true');
    };
    window.addEventListener('maintenance_mode_changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('maintenance_mode_changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Determine if user has Super Admin administrative clearance or is on an admin/login route
  const isSuperAdminClass = userRole === 'super_admin' || userEmail === 'trongtri14780@gmail.com' || userEmail === 'superadmin@vietagri.vn';
  const isSuperAdminRoute = location.pathname.startsWith('/super-admin');
  const isLoginRoute = location.pathname.includes('/login');

  if (isMaintenance && !isSuperAdminClass && !isSuperAdminRoute && !isLoginRoute) {
    return (
      <>
        <div className="pointer-events-none select-none opacity-60 grayscale-[0.3] blur-[1px]">
          {children}
        </div>
        <div className="fixed inset-0 z-[99999] bg-slate-950/30 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500 border border-white/50">
            <div className="w-20 h-20 bg-amber-50/80 text-amber-500 rounded-3xl flex items-center justify-center mb-6 shadow-inner pointer-events-none border border-amber-100">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-3xl font-black text-[#0c2a1a] mb-3">Hệ thống bảo trì</h1>
            <p className="text-slate-600 mb-8 font-bold leading-relaxed px-4">
              Hệ sinh thái <span className="text-emerald-700">VietAgri</span> đang được nâng cấp để phục vụ quý khách tốt hơn. Vui lòng quay lại sau ít phút hoặc liên hệ quản trị viên để biết thêm chi tiết.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-white/50 hover:bg-white text-slate-700 py-4 rounded-xl font-bold transition-all border border-slate-200 cursor-pointer"
              >
                Tải lại trang
              </button>
              <Link
                to="/login"
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-800/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn size={18} /> Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MaintenanceWrapper>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="register" element={<RegistrationPage />} />
            <Route path="policy/:policyId" element={<PolicyPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="register-enterprise" element={<EnterpriseRegistrationPage />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/change-password" element={<PasswordChangePage />} />
          <Route path="farmer/change-password" element={<PasswordChangePage />} />
          <Route path="customer/change-password" element={<PasswordChangePage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="admin/profile" element={<AdminProfilePage />} />
          <Route path="farmer/profile" element={<FarmerProfilePage />} />
          <Route path="customer/profile" element={<EnterpriseProfilePage />} />
          <Route path="super-admin" element={<SuperAdminDashboard />} />
          <Route path="super-admin/profile" element={<SuperAdminProfilePage />} />
          <Route path="customer-dashboard" element={<CustomerDashboard />} />
          <Route path="farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="contract/:productId" element={<ContractPage />} />
          <Route path="contract-customer/:productId" element={<ContractPageCustomer />} />
          <Route path="contract-farmer/:contractId" element={<ContractPageFarmer />} />
          <Route path="contract-internal" element={<ContractInternalPage />} />
        </Routes>
      </MaintenanceWrapper>
    </BrowserRouter>
  </StrictMode>,
);
