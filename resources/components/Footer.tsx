import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Youtube, Twitter, Leaf } from 'lucide-react';

const footerLinks = [
  {
    title: 'Hệ sinh thái',
    links: [
      { name: 'Vùng trồng GIS', href: '/policy/vung-trong-gis' },
      { name: 'Chuỗi cung ứng', href: '/policy/chuoi-cung-ung' },
      { name: 'Nông sản', href: '/policy/nong-san' },
      { name: 'Dự báo khí hậu', href: '/policy/du-bao-khi-hau' }
    ]
  },
  {
    title: 'Hợp tác xã',
    links: [
      { name: 'Chính sách nông dân', href: '/policy/chinh-sach-xa-vien' },
      { name: 'Đào tạo kỹ thuật', href: '/policy/dao-tao-ky-thuat' },
      { name: 'Hỗ trợ vốn', href: '/policy/ho-tro-von' },
      { name: 'VietGAP/GlobalGAP', href: '/policy/vietgap-globalgap' }
    ]
  },
  {
    title: 'Hỗ trợ',
    links: [
      { name: 'Tài liệu hướng dẫn', href: '/policy/tai-lieu-huong-dan' },
      { name: 'Câu hỏi thường gặp', href: '/policy/cau-hoi-thuong-gap' },
      { name: 'Chính sách bảo mật', href: '/policy/chinh-sach-bao-mat' },
      { name: 'Điều khoản sử dụng', href: '/policy/dieu-khoan-su-dung' }
    ]
  }
];

export const Footer = () => {
  return (
    <footer className="bg-[#0a0f1d] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#059669] rounded flex items-center justify-center transform rotate-3 group-hover:rotate-12 transition-transform">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                VIETAGRI <span className="text-[#4ade80]">DIGITAL</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Tiên phong kiến tạo nền nông nghiệp số bền vững, 
              gia tăng giá trị nông sản và thịnh vượng cho người nông dân Việt.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-[#059669] hover:text-white transition-all cursor-pointer">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-[#059669] hover:text-white transition-all cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-[#059669] hover:text-white transition-all cursor-pointer">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-[#059669] hover:text-white transition-all cursor-pointer">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {footerLinks.map(col => (
            <div key={col.title}>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map(link => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="text-slate-400 hover:text-[#4ade80] transition-colors text-sm">
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-slate-400 hover:text-[#4ade80] transition-colors text-sm">
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © 2026 VIETAGRI DIGITAL ECOSYSTEM. All rights reserved. <br className="md:hidden" />
            Designed for Future Vietnam Agriculture.
          </p>
          <div className="text-slate-500 text-xs flex gap-6">
            <span>English (US)</span>
            <span className="text-[#4ade80] font-medium">Tiếng Việt</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
