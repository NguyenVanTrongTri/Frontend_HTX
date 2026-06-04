import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Maximize, Sprout, Key, CheckCircle2 } from 'lucide-react';

export const LandDataForm = () => {
  const [showOfficerKey, setShowOfficerKey] = useState(false);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              bounce: 0.4
            }}
            className="mb-4"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-amber-500">
              Cập nhật Dữ liệu Vùng trồng
            </h2>
          </motion.div>
          <p className="text-slate-500">Khai báo thông tin canh tác để được hỗ trợ từ hệ sinh thái VietAgri</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden"
        >
          <form className="grid md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2 relative group">
              <label className="text-sm font-semibold text-slate-600 block pl-1">Tọa độ GPS (Lat/Lng)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#059669] group-focus-within:text-[#4ade80] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Ví dụ: 10.762622, 106.660172" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <label className="text-sm font-semibold text-slate-600 block pl-1">Diện tích canh tác (Ha)</label>
              <div className="relative">
                <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 text-[#059669] group-focus-within:text-[#4ade80] transition-colors" size={20} />
                <input 
                  type="number" 
                  placeholder="0.00" 
                  step="0.01"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2 group">
              <label className="text-sm font-semibold text-slate-600 block pl-1">Loại cây trồng</label>
              <div className="relative">
                <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-[#059669] group-focus-within:text-[#4ade80] transition-colors" size={20} />
                <select className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all font-medium text-slate-800 appearance-none">
                  <option value="">Chọn loại cây trồng...</option>
                  <option value="lua">Lúa cao sản</option>
                  <option value="cafe">Cà phê Arabica</option>
                  <option value="trai-cay">Trái cây nhiệt đới (Xoài, Sầu riêng)</option>
                  <option value="rau-cu">Rau củ hữu cơ</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button className="w-full py-5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-2xl shadow-xl shadow-[#059669]/20 transition-all flex items-center justify-center gap-3 group">
                <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                Gửi Thông Tin Xác Thực
              </button>
            </div>
          </form>

          <div className="mt-12 flex flex-col items-center">
            <button 
              onClick={() => setShowOfficerKey(!showOfficerKey)}
              className="text-xs text-slate-400 hover:text-[#059669] transition-colors flex items-center gap-2 font-medium"
            >
              <Key size={14} />
              Cán bộ truy cập?
            </button>
            
            {showOfficerKey && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 w-full max-w-sm"
              >
                <input 
                  type="password" 
                  placeholder="Nhập Mã cán bộ (Secret Key)"
                  className="w-full px-4 py-3 bg-red-50 border border-red-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 transition-all text-sm font-mono text-center outline-none"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
