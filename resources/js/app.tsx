import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../views/layouts/app.tsx';
import LandingPage from '../views/pages/LandingPage.tsx';
import LoginPage from '../views/pages/LoginPage.tsx';
import ProductsPage from '../views/pages/ProductsPage.tsx';
import AdminDashboard from '../views/pages/AdminDashboard.tsx';
import CustomerDashboard from '../views/pages/CustomerDashboard.tsx';
import ContractPage from '../views/pages/ContractPage.tsx';
import ContractPageCustomer from '../views/pages/ContractPageCustomer.tsx';
import EnterpriseRegistrationPage from '../views/pages/EnterpriseRegistrationPage.tsx';
import FarmerDashboard from '../views/pages/FarmerDashboard.tsx';
import ContractPageFarmer from '../views/pages/ContractPageFarmer.tsx';
import ProductDetailPage from '../views/pages/ProductDetailPage.tsx';
import RegistrationPage from '../views/pages/RegistrationPage.tsx';
import PolicyPage from '../views/pages/PolicyPage.tsx';
import NewsPage from '../views/pages/NewsPage.tsx';
import ContactPage from '../views/pages/ContactPage.tsx';
import SuperAdminDashboard from '../views/pages/SuperAdminDashboard.tsx';
import AdminProfilePage from '../views/pages/AdminProfilePage.tsx';
import FarmerProfilePage from '../views/pages/FarmerProfilePage.tsx';
import EnterpriseProfilePage from '../views/pages/EnterpriseProfilePage.tsx';
import PasswordChangePage from '../views/pages/PasswordChangePage.tsx';
import ForgotPasswordPage from '../views/pages/ForgotPasswordPage.tsx';
import '../css/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
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
        <Route path="customer-dashboard" element={<CustomerDashboard />} />
        <Route path="farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="contract/:productId" element={<ContractPage />} />
        <Route path="contract-customer/:productId" element={<ContractPageCustomer />} />
        <Route path="contract-farmer/:contractId" element={<ContractPageFarmer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
