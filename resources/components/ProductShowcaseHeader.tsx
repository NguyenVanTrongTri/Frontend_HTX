import React from 'react';
import { motion } from 'motion/react';
import { Network, Map, Link2 } from 'lucide-react';

interface Props {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export const ProductShowcaseHeader: React.FC<Props> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <section 
      className="relative pt-32 pb-20 overflow-hidden bg-cover bg-center min-h-[600px] flex flex-col items-center" 
      style={{ backgroundImage: "url('/images/dongruong2.png')" }}
    >
      <div className="container mx-auto px-6 text-center relative z-10 w-full max-w-5xl flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col items-center"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1A382A] mb-6 drop-shadow-sm">
            Nông Sản Hạng Nhất
          </h1>
          
          <p className="text-[#3F4E44] text-base md:text-lg mb-8 leading-relaxed font-medium">
            Sản phẩm đạt chuẩn từ các Hợp tác xã hàng đầu. <br className="hidden md:block" />
            Minh bạch nguồn gốc — Đảm bảo chất lượng — Vươn tầm giá trị.
          </p>

          <div className="relative w-full max-w-4xl mx-auto mb-16">
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/70 to-transparent rounded-t-3xl z-10" />
            
            <div className="relative flex flex-col md:flex-row justify-between items-center rounded-3xl bg-gradient-to-b from-[#EFECE0] to-[#CFCAB2] border-[3px] border-[#F4EFE6] shadow-[0_20px_40px_rgba(0,0,0,0.2),inset_0_-8px_15px_rgba(0,0,0,0.05),inset_0_4px_10px_rgba(255,255,255,0.8)] overflow-hidden z-0">
              
              <div className="absolute inset-0 rounded-3xl shadow-[inset_0_-12px_20px_rgba(80,70,50,0.3)] pointer-events-none" />

              <div className="flex-1 flex items-center justify-center gap-4 py-8 px-6 relative z-10 w-full">
                <div className="text-[#C4A05A]">
                  <Network strokeWidth={1.5} size={42} />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-black text-[#1F3D2F] drop-shadow-sm">500+</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#5A6357]">HTX LIÊN KẾT</div>
                </div>
              </div>

              <div className="hidden md:block w-[1px] h-20 bg-gradient-to-b from-transparent via-[#A8A18B] to-transparent opacity-60 z-10" />

              <div className="flex-1 flex items-center justify-center gap-4 py-8 px-6 relative z-10 w-full md:border-none border-y border-[#A8A18B]/30">
                <div className="text-[#C4A05A]">
                  <Map strokeWidth={1.5} size={42} />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-black text-[#1F3D2F] drop-shadow-sm">2000+</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#5A6357]">HA VÙNG TRỒNG GIS</div>
                </div>
              </div>

              <div className="hidden md:block w-[1px] h-20 bg-gradient-to-b from-transparent via-[#A8A18B] to-transparent opacity-60 z-10" />

              <div className="flex-1 flex items-center justify-center gap-4 py-8 px-6 relative z-10 w-full">
                <div className="text-[#C4A05A]">
                  <Link2 strokeWidth={1.5} size={44} />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-black text-[#1F3D2F] drop-shadow-sm">100%</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#5A6357]">TRACEABLE</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
