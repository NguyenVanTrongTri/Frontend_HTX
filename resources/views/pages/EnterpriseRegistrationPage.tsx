import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Globe,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EnterpriseRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    taxCode: '',
    representative: '',
    phone: '',
    email: '',
    industry: 'Thu mua & Phân phối nông sản'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const newEnterprise = {
        id: `ENT-${Date.now()}`,
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const savedRaw = localStorage.getItem('vietagri_pending_enterprises_v2');
      const savedPending = savedRaw ? JSON.parse(savedRaw) : [];
      localStorage.setItem('vietagri_pending_enterprises_v2', JSON.stringify([newEnterprise, ...savedPending]));
      
      setIsLoading(false);
      setIsSubmitted(true);
      
      setFormData({
        name: '',
        taxCode: '',
        representative: '',
        phone: '',
        email: '',
        industry: 'Thu mua & Phân phối nông sản'
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 bg-forest/5 px-4 py-2 rounded-full border border-forest/10 mb-6">
                <Briefcase className="text-forest" size={16} />
                <span className="text-forest text-[10px] font-black uppercase tracking-widest">Cổng Đăng Ký Đối Tác</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-forest mb-6 tracking-tight">
                Hợp Tác Phát Triển <br />
                <span className="text-mint">Nông Nghiệp Số</span> Bền Vững
              </h1>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                Dành cho các doanh nghiệp thu mua, chế biến và xuất khẩu. Kết nối trực tiếp với chuỗi cung ứng HTX 4.0 minh bạch và hiện đại.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Info Column */}
              <div className="lg:col-span-1 space-y-6">
                {[
                  { 
                    icon: <Globe className="text-mint" />, 
                    title: 'Vùng Nguyên Liệu Số', 
                    desc: 'Tiếp cận dữ liệu GIS chính xác về diện tích và sản lượng.' 
                  },
                  { 
                    icon: <ShieldCheck className="text-mint" />, 
                    title: 'Chứng Nhận Chất Lượng', 
                    desc: 'Sản phẩm đạt chuẩn khắt khe, đầy đủ hồ sơ truy xuất.' 
                  },
                  { 
                    icon: <FileText className="text-mint" />, 
                    title: 'Hợp Đồng Thông Minh', 
                    desc: 'Giao dịch nhanh chóng, bảo mật và minh bạch.' 
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl"
                  >
                    <div className="w-12 h-12 bg-forest/5 rounded-2xl flex items-center justify-center mb-4 text-forest">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-forest mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Form Column */}
              <div className="lg:col-span-2">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100"
                >
                  {isSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-24 h-24 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-8 text-forest">
                        <ShieldCheck size={48} />
                      </div>
                      <h2 className="text-3xl font-black text-forest mb-4 italic">Gửi Yêu Cầu Thành Công!</h2>
                      <p className="text-slate-500 font-bold mb-10 max-w-md mx-auto leading-relaxed">
                        Cảm ơn {formData.name || 'doanh nghiệp'} đã quan tâm hợp tác. <br/>
                        Hồ sơ của bạn đã được chuyển đến hội đồng quản trị VIETAGRI. Sau khi được phê duyệt, <strong>mật khẩu đăng nhập tạm thời</strong> sẽ được gửi tự động về email <span className="text-forest">{formData.email}</span>.
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                          to="/"
                          className="px-8 py-4 bg-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-forest/90 transition-all shadow-xl shadow-forest/20 flex items-center gap-2"
                        >
                          Quay lại Trang Chủ
                        </Link>
                        <button 
                          onClick={() => setIsSubmitted(false)}
                          className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                          Gửi yêu cầu khác
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Enterprise Name */}
                      <div className="relative group">
                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-forest transition-colors" size={20} />
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Tên Doanh Nghiệp (Công ty / Tập đoàn)"
                          className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        />
                      </div>

                      {/* Tax Code */}
                      <div className="relative group">
                        <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-forest transition-colors" size={20} />
                        <input 
                          type="text" 
                          required
                          value={formData.taxCode}
                          onChange={(e) => setFormData({...formData, taxCode: e.target.value.replace(/\D/g, '')})}
                          placeholder="Mã Số Thuế (Số đăng ký kinh doanh)"
                          className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        />
                      </div>

                      {/* Contact Person */}
                      <div className="relative group">
                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-forest transition-colors" size={20} />
                        <input 
                          type="text" 
                          required
                          value={formData.representative}
                          onChange={(e) => setFormData({...formData, representative: e.target.value})}
                          placeholder="Người Đại Diện (Họ và tên)"
                          className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative group">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-forest transition-colors" size={20} />
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                          placeholder="Số Điện Thoại (Di động / Văn phòng)"
                          className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div className="md:col-span-2 relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-forest transition-colors" size={20} />
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="Email công ty (example@company.com)"
                          className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest transition-all"
                        />
                      </div>

                      {/* Industry */}
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Lĩnh vực hợp tác</label>
                        <select 
                            value={formData.industry}
                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-forest rounded-2xl outline-none font-bold text-forest appearance-none cursor-pointer">
                          <option>Thu mua & Phân phối nông sản</option>
                          <option>Chế biến thực phẩm</option>
                          <option>Xuất nhập khẩu</option>
                          <option>Sản xuất vật tư nông nghiệp</option>
                          <option>Dịch vụ Logistics</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-6 bg-forest text-white font-black text-sm uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-forest/20 flex items-center justify-center gap-3 hover:bg-mint transition-all transform hover:-translate-y-1"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Gửi Yêu Cầu Hợp Tác <ArrowRight size={20} /></>
                      )}
                    </button>

                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Bằng việc gửi yêu cầu, bạn đồng ý với <Link to="#" className="text-forest underline">Điều khoản bảo mật</Link> của VIETAGRI.
                    </p>
                  </form>
                )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
