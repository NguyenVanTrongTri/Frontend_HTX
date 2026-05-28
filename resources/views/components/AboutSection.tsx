import React from 'react';
import { motion } from 'motion/react';

const timelineSteps = [
  {
    year: '2020',
    title: 'Canh tác truyền thống',
    desc: 'Bắt đầu từ 50 hộ gia đình nông dân với quy trình thủ công truyền thống.'
  },
  {
    year: '2022',
    title: 'Chuẩn hóa VietGAP',
    desc: '100% vùng trồng được cấp chứng chỉ VietGAP, nâng cao giá trị thương phẩm.'
  },
  {
    year: '2024',
    title: 'Xuất khẩu GlobalGAP',
    desc: 'Mở rộng thị trường sang EU, Nhật Bản với tiêu chuẩn GlobalGAP khắt khe.'
  },
  {
    year: '2026',
    title: 'Chuyển đổi số 4.0',
    desc: 'Ứng dụng IoT, GIS và Blockchain vào quản trị hệ sinh thái số VietAgri.'
  }
];

export const AboutSection = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Timeline */}
          <div>
            <span className="text-[#059669] font-bold tracking-widest uppercase text-sm block mb-4">Câu chuyện của chúng tôi</span>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                bounce: 0.4
              }}
              className="mb-12"
            >
              <h2 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-amber-500">
                HÀNH TRÌNH SỐ HÓA NÔNG SẢN VIỆT
              </h2>
            </motion.div>
            
            <div className="relative pl-8 border-l-2 border-[#059669]/20 flex flex-col gap-12">
              {timelineSteps.map((step, idx) => (
                <motion.div 
                  key={step.year} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-[#059669] border-4 border-white shadow-md ring-4 ring-[#059669]/10" />
                  <div className="font-bold text-[#059669] text-xl mb-1">{step.year}</div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm max-w-md">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Right: Masonry Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <motion.img 
                whileHover={{ scale: 1.02 }}
                src="/images/kinh.jpg" 
                alt="Farmer working" 
                className="rounded-2xl w-full h-64 object-cover shadow-lg"
              />
              <motion.img 
                whileHover={{ scale: 1.02 }}
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600" 
                alt="Modern greenhouse" 
                className="rounded-2xl w-full h-48 object-cover shadow-lg"
              />
            </div>
            <div className="space-y-4 pt-12">
              <motion.img 
                whileHover={{ scale: 1.02 }}
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600" 
                alt="High tech field" 
                className="rounded-2xl w-full h-48 object-cover shadow-lg"
              />
              <motion.img 
                whileHover={{ scale: 1.02 }}
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600" 
                alt="Organic produce" 
                className="rounded-2xl w-full h-64 object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
