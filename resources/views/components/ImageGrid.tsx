import React from 'react';
import { motion } from 'motion/react';

export const ImageGrid = () => {
  // Array of 8 images (2 rows of 4 as requested)
  const images = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    src: `/images/image${i + 1}.png`,
    alt: `Hợp tác xã VietAgri ${i + 1}`
  }));

  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          <span className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-4">Hình ảnh hoạt động</span>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              bounce: 0.4
            }}
            className="pb-2"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-amber-500">
              HỢP TÁC XÃ VIETAGRI
            </h2>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
          {images.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="aspect-[4/3] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 group shadow-lg hover:shadow-2xl transition-all duration-700"
            >
              <img 
                src={img.src} 
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800&text=VietAgri+${img.id}`;
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
