import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Shield, Info, ArrowLeft, MapPin, LayoutList, Leaf, Cloud, Users, BookOpen, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PolicyPage() {
  const { policyId } = useParams();
  const [policyName, setPolicyName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Basic mapping for demo
    const policies: Record<string, string> = {
      'vung-trong-gis': 'Vùng trồng GIS',
      'chuoi-cung-ung': 'Chuỗi cung ứng',
      'nong-san': 'Nông sản',
      'du-bao-khi-hau': 'Dự báo khí hậu',
      'chinh-sach-xa-vien': 'Chính sách nông dân',
      'dao-tao-ky-thuat': 'Đào tạo kỹ thuật',
      'ho-tro-von': 'Hỗ trợ vốn',
      'vietgap-globalgap': 'VietGAP/GlobalGAP',
      'tai-lieu-huong-dan': 'Tài liệu hướng dẫn',
      'cau-hoi-thuong-gap': 'Câu hỏi thường gặp',
      'chinh-sach-bao-mat': 'Chính sách bảo mật',
      'dieu-khoan-su-dung': 'Điều khoản sử dụng'
    };

    const name = policies[policyId || ''] || 'Chính sách';
    setPolicyName(name);

    // Load from localStorage if available
    const saved = localStorage.getItem('vietagri_policies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed[name]) {
          setContent(parsed[name]);
          window.scrollTo(0, 0);
          return;
        }
      } catch (e) {
        console.error("Error reading saved policies", e);
      }
    }

    setContent(`Nội dung thiết lập và quy định của ${name}. Các chính sách và điều khoản có thể được cập nhật tại đây và sẽ được đồng bộ trên toàn bộ hệ sinh thái VietAgri.`);
    
    // Scroll to top when page opens
    window.scrollTo(0, 0);
  }, [policyId]);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-8 transition-colors">
          <ArrowLeft size={16} />
          Trở về trang chủ
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              {policyId?.includes('bao-mat') ? <Shield size={32} /> : 
               policyId?.includes('huong-dan') || policyId?.includes('cau-hoi') ? <Info size={32} /> : 
               policyId?.includes('gis') ? <MapPin size={32} /> :
               policyId?.includes('chuoi-cung-ung') ? <LayoutList size={32} /> :
               policyId?.includes('nong-san') ? <Leaf size={32} /> :
               policyId?.includes('khi-hau') ? <Cloud size={32} /> :
               policyId?.includes('xa-vien') ? <Users size={32} /> :
               policyId?.includes('dao-tao') ? <BookOpen size={32} /> :
               policyId?.includes('von') ? <Wallet size={32} /> :
               <FileText size={32} />}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{policyName}</h1>
              <p className="text-slate-500 mt-2">Cập nhật lần cuối: 15/05/2026</p>
            </div>
          </div>
          
          <div className="prose prose-slate prose-emerald max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed font-medium">
              Chào mừng bạn đến với chuyên trang thông tin về {policyName} của Hệ sinh thái VietAgri Digital.
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Quy định chung</h3>
            <div className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
              {content}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Hướng dẫn và quyền lợi</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Nội dung demo: Chi tiết về hướng dẫn và quyền lợi khi tham gia hoặc sử dụng tính năng/chính sách này. 
              Mọi nội dung sẽ được đội ngũ vận hành từ Super Admin cập nhật liên tục để đảm bảo thông tin minh bạch nhất.
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Thông tin liên hệ hỗ trợ</h3>
            <div className="bg-slate-50 p-6 rounded-2xl mt-6 border border-slate-100">
              <p className="text-slate-700 font-medium mb-2">Hỗ trợ đối tác & Hợp tác xã:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Email: support@vietagri.vn</li>
                <li>Hotline: 1900 8888 (Phím 1)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
