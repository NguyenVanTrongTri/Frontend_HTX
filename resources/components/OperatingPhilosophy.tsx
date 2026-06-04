import React from 'react';
import { motion } from 'motion/react';

export const OperatingPhilosophy = () => {
  return (
    <section 
      className="relative py-24 px-6 lg:px-20 bg-[#3C664B] overflow-hidden min-h-[700px] flex items-center font-sans mt-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/xanh.png')" }}
    >
      <div className="absolute top-16 right-32 w-32 h-32 grid grid-cols-6 gap-2 opacity-40 -rotate-12 z-0 hidden lg:grid">
         {Array.from({length: 36}).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-[#84D27B]' : i % 5 === 0 ? 'bg-[#EFD566]' : 'bg-transparent'}`}></div>
         ))}
      </div>
      <div className="absolute top-1/2 right-16 w-16 h-48 grid grid-cols-3 gap-3 opacity-60 z-0 hidden lg:grid">
         {Array.from({length: 24}).map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-[#EFD566]' : 'bg-transparent'}`}></div>
         ))}
      </div>
      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] pointer-events-none opacity-20 z-0 flex items-center justify-center">
        <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-[#AECDBA]"></div>
        <div className="absolute w-[300px] h-[500px] rounded-[50%] border-[1.5px] border-dashed border-[#AECDBA]" style={{ transform: 'rotate(45deg)' }}></div>
        <div className="absolute w-[500px] h-[300px] rounded-[50%] border-[1.5px] border-[#AECDBA]" style={{ transform: 'rotate(20deg)' }}></div>
      </div>
      <div className="absolute bottom-20 right-32 text-[#183921] opacity-70 flex z-0 hidden lg:flex">
         <div className="w-12 h-12 bg-[#183921] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center relative z-10 w-full gap-16 lg:gap-8">
        <div className="w-full lg:w-[45%]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-10 bg-[#EFD566]"></div>
              <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#EFD566]">Triết lý vận hành</h2>
            </div>
            
            <h3 className="text-[clamp(3rem,4.5vw,4.5rem)] leading-[1.1] font-black tracking-tight mb-8 text-white">
              Sự hòa quyện giữa truyền thống & công nghệ
            </h3>
            
            <p className="text-[#D9E3DC] text-base md:text-lg leading-relaxed mb-12 max-w-[95%]">
              Hợp tác xã nông nghiệp kiểu mới không làm mất đi tình yêu với đất đai. Chúng tôi cung cấp công cụ số để nâng tầm giá trị nông sản.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
