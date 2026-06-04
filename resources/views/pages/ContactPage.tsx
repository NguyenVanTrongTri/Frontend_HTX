import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden pt-20 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url(/images/lacay.png)' }}
    >
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] pointer-events-none" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-50/50 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-50/50 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium text-sm mb-6 shadow-sm">
            <MessageSquare className="w-4 h-4" /> Liên hệ với chúng tôi
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1F3D2F] mb-6 tracking-tight">
            Kết nối cùng <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Agriviet</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-light">
            Chúng tôi luôn lắng nghe và sẵn sàng đồng hành cùng bạn trên chặng đường phát triển nền nông nghiệp bền vững. Hãy để lại lời nhắn, chuyên viên của chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-start">
          
          {/* Contact Information (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full transition-transform group-hover:scale-110 duration-500 ease-out" />
              
              <h3 className="text-2xl font-bold text-[#1F3D2F] mb-8 relative z-10">Thông Tin Khác</h3>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Trụ Sở Chính</h4>
                    <p className="text-gray-600 leading-relaxed font-light">123 Đường Số 1, Phường An Khánh<br />Quận Ninh Kiều, TP. Cần Thơ</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Hotline Hỗ Trợ</h4>
                    <p className="text-gray-600 leading-relaxed font-light">0292 3888 888<br />090 123 4567 (Zalo)</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Email Chăm Sóc</h4>
                    <p className="text-gray-600 leading-relaxed font-light">contact@agriviet.vn<br />support@agriviet.vn</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Thời gian làm việc</h4>
                    <p className="text-gray-600 leading-relaxed font-light">Thứ 2 - Thứ 6: 08:00 - 17:30<br />Thứ 7: 08:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
            
          </motion.div>

          {/* Contact Form (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-gray-100">
              <div className="mb-10">
                <h3 className="text-2xl md:text-3xl font-bold text-[#1F3D2F] mb-3">Gửi Thông Điệp</h3>
                <p className="text-gray-500 font-light">Điền thông tin vào biểu mẫu dưới đây, chúng tôi sẽ liên hệ lại với bạn ngay sau khi tiếp nhận.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1F3D2F] ml-1">Họ và tên <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1F3D2F] ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required
                      placeholder="0912 345 678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1F3D2F] ml-1">Email liên hệ <span className="text-gray-400 font-normal">(Tuỳ chọn)</span></label>
                  <input 
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1F3D2F] ml-1">Chủ đề <span className="text-red-500">*</span></label>
                  <select 
                    required
                    defaultValue=""
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 appearance-none text-gray-600"
                  >
                    <option value="" disabled>-- Chọn chủ đề cần tư vấn --</option>
                    <option value="buy">Mua sỉ/lẻ nông sản</option>
                    <option value="sell">Hợp tác cung cấp nông sản</option>
                    <option value="partner">Đăng ký làm đại lý phân phối</option>
                    <option value="other">Yêu cầu hỗ trợ khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1F3D2F] ml-1">Nội dung chi tiết <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={5} 
                    required
                    placeholder="Vui lòng mô tả chi tiết thông tin bạn muốn trao đổi..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`w-full py-4 lg:py-5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_8px_20px_rgba(16,185,129,0.25)] ${
                    submitted 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : submitted ? (
                    <>Đã Gửi Thành Công!</>
                  ) : (
                    <>Gửi Yêu Cầu <Send size={18} /></>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
