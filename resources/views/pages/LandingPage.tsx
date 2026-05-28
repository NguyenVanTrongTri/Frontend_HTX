import React from 'react';
import { Hero } from '../components/Hero';
import { OperatingPhilosophy } from '../components/OperatingPhilosophy';
import { ImageGrid } from '../components/ImageGrid';
import { AboutSection } from '../components/AboutSection';
import { LandDataForm } from '../components/LandDataForm';
// import CustomerLandingPage from './CustomerLandingPage';

export default function LandingPage() {
  // const role = localStorage.getItem('userRole');

  // Vô hiệu hóa cơ chế hiển thị trang Landing Page riêng của tài khoản theo yêu cầu của người dùng.
  // Khi nào cần bật lại, chỉ cần bỏ comment phần logic dưới đây.
  /*
  if (role) {
    return <CustomerLandingPage />;
  }
  */

  return (
    <main>
      <Hero />
      <OperatingPhilosophy />
      <ImageGrid />
      <AboutSection />
      <LandDataForm />
    </main>
  );
}
