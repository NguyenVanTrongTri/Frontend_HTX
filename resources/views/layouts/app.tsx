import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.tsx';
import { Footer } from '../components/Footer.tsx';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#4ade80]/30 transition-all duration-300">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
