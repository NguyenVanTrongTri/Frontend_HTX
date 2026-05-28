import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';

export const OperatingPhilosophy = () => {
  return (
    <section 
      className="relative py-24 px-6 lg:px-20 bg-[#3C664B] overflow-hidden min-h-[700px] flex items-center font-sans mt-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/xanh.png')" }}
    >
      
      {/* Decorative dots grid top right */}
      <div className="absolute top-16 right-32 w-32 h-32 grid grid-cols-6 gap-2 opacity-40 -rotate-12 z-0 hidden lg:grid">
         {Array.from({length: 36}).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-[#84D27B]' : i % 5 === 0 ? 'bg-[#EFD566]' : 'bg-transparent'}`}></div>
         ))}
      </div>

      {/* Decorative dots mid right */}
      <div className="absolute top-1/2 right-16 w-16 h-48 grid grid-cols-3 gap-3 opacity-60 z-0 hidden lg:grid">
         {Array.from({length: 24}).map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-[#EFD566]' : 'bg-transparent'}`}></div>
         ))}
      </div>

      {/* Decorative lines / wireframe globe left bottom */}
      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] pointer-events-none opacity-20 z-0 flex items-center justify-center">
        <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-[#AECDBA]"></div>
        <div className="absolute w-[300px] h-[500px] rounded-[50%] border-[1.5px] border-dashed border-[#AECDBA]" style={{ transform: 'rotate(45deg)' }}></div>
        <div className="absolute w-[500px] h-[300px] rounded-[50%] border-[1.5px] border-[#AECDBA]" style={{ transform: 'rotate(20deg)' }}></div>
        
        {/* Large leaves */}
        <div className="absolute bottom-40 right-20 text-[#8CE378] flex">
           <Leaf size={80} className="fill-[#8CE378]/30 -rotate-45" />
           <Leaf size={60} className="fill-[#8CE378]/50 rotate-12 -ml-10" />
        </div>
      </div>

      {/* Small floating leaves bottom right */}
      <div className="absolute bottom-20 right-32 text-[#183921] opacity-70 flex z-0 hidden lg:flex">
         <Leaf size={50} className="fill-[#183921] -rotate-12" />
         <Leaf size={40} className="fill-[#183921]/80 rotate-45 -ml-4" />
      </div>


      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center relative z-10 w-full gap-16 lg:gap-8">
        
        {/* Left Content */}
        <div className="w-full lg:w-[45%]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Tag */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-10 bg-[#EFD566]"></div>
              <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#EFD566]">Triết lý vận hành</h2>
            </div>
            
            {/* Title */}
            <h3 className="text-[clamp(3rem,4.5vw,4.5rem)] leading-[1.1] font-black tracking-tight mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFEE6] via-[#F4E1A5] to-[#E9CF81] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Sự hòa quyện</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFEE6] via-[#F4E1A5] to-[#E9CF81] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">giữa</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9CF81] via-[#D1A041] to-[#D6B151] drop-shadow-[0_4px_15px_rgba(209,160,65,0.4)]">truyền thống </span>
              <span className="text-[#D1A041] drop-shadow-md">&</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E9CF81] via-[#D1A041] to-[#D6B151] font-serif italic font-medium drop-shadow-[0_4px_15px_rgba(209,160,65,0.4)]">công nghệ</span>
            </h3>
            
            <p className="text-[#D9E3DC] text-base md:text-lg leading-relaxed mb-12 max-w-[95%]">
              Hợp tác xã nông nghiệp kiểu mới không làm mất đi tình yêu với đất đai. Chúng tôi cung cấp công cụ số để nâng tầm giá trị nông sản, mang lại sự minh bạch tuyệt đối và bảo vệ sức khỏe người tiêu dùng.
            </p>

            {/* Cards */}
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Card 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#EDF5F0] rounded-[1.5rem] p-5 relative overflow-hidden group shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex-1 min-w-[200px]"
              >
                <div className="absolute top-2 right-2 opacity-5 mix-blend-multiply">
                  <ShieldCheck size={80} className="text-[#3C664B] stroke-[1]" />
                </div>
                <div className="w-10 h-10 rounded-full border border-[#B3D6C1] flex items-center justify-center mb-4 relative z-10">
                  <ShieldCheck className="text-[#3C664B] w-5 h-5" />
                </div>
                <h4 className="text-[17px] font-bold mb-2 text-[#214330] relative z-10">Minh bạch 100%</h4>
                <p className="text-[13px] text-[#4F6C5B] leading-relaxed relative z-10">Số hóa từng bước canh tác. Người tiêu dùng quét QR để xem trọn vẹn nhật ký ruộng đồng.</p>
              </motion.div>
              
              {/* Card 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-b from-[#215E3F] to-[#14472C] rounded-[1.5rem] p-5 relative overflow-hidden group shadow-[0_10px_20px_rgba(0,0,0,0.2)] flex-1 min-w-[200px]"
              >
                <div className="absolute top-1 right-2 opacity-20">
                  <HeartHandshake size={90} className="text-[#A1DCB5] stroke-[1]" />
                </div>
                <div className="w-10 h-10 rounded-full border border-[#40815D] flex items-center justify-center mb-4 relative z-10">
                  <HeartHandshake className="text-[#A1DCB5] w-5 h-5" />
                </div>
                <h4 className="text-[17px] font-bold mb-2 text-white relative z-10">Đồng hành</h4>
                <p className="text-[13px] text-white/80 leading-relaxed relative z-10">Liên kết chặt chẽ nông dân, hợp tác xã và doanh nghiệp bao tiêu bằng hợp đồng thông minh.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Images Layout */}
        <div className="w-full lg:w-[55%] relative h-[500px] sm:h-[600px] flex items-center justify-center mt-10 lg:mt-0">
          
          {/* Back Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 sm:top-10 left-0 sm:left-10 w-[260px] sm:w-[320px] h-[360px] sm:h-[460px] bg-white/20 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-white/20 z-0 overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <img src="/images/raucu.png" className="w-full h-full object-cover" alt="Nông sản tươi xanh"/>
            </div>
            <h4 className="text-white font-bold text-xl sm:text-2xl mb-6 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Nông sản tươi xanh</h4>
          </motion.div>

          {/* Main Focused Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute right-0 lg:-right-4 top-24 sm:top-28 w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] rounded-[2.5rem] p-[3px] bg-gradient-to-br from-[#FDF1BB] via-[#C99C3D] to-[#E5C16C] shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-10"
          >
            <div className="w-full h-full rounded-[2.35rem] overflow-hidden bg-[#3C664B] border-4 sm:border-[6px] border-[#3C664B]">
              <img src="/images/kinh.jpg" className="w-full h-full object-cover" alt="Farmer with tech glass overlay"/>
            </div>
          </motion.div>

          {/* Floating Quote */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute top-[60%] sm:top-1/2 -right-4 sm:-right-8 lg:-right-16 translate-y-10 sm:translate-y-24 bg-[#6A8F76]/40 backdrop-blur-xl shadow-lg pl-6 pr-4 py-4 rounded-l-full rounded-r-lg z-20 border border-[#8DAF98]/50"
          >
            <p className="text-[#F1E9CD] font-serif italic text-sm sm:text-[15px] font-medium leading-tight shadow-sm text-right">
              “Tinh hoa từ đất<br/> công nghệ từ người”
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute top-16 right-[-20px] text-[#A6C0B0] z-20 hidden sm:block"
          >
            <Leaf size={24} className="fill-current -rotate-45" />
          </motion.div>
        
        </div>

      </div>
    </section>
  );
};
