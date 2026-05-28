import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ProductShowcaseHeader } from '../components/ProductShowcaseHeader';
import { 
  Star, 
  Leaf, 
  QrCode, 
  X,
  MapPin,
  Briefcase,
  ArrowRight
} from 'lucide-react';

const categories = ['Tất cả', 'Trái cây', 'Rau củ', 'Đặc sản', 'Trà & Café'];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [selectedFarm, setSelectedFarm] = useState<null | string>(null);

  const [allProducts] = useState(() => {
    const staticProducts = [
      {
        id: 1,
        name: 'Cà Phê Arabica Cầu Đất',
        desc: 'Hương vị chua thanh, hậu vị ngọt chuẩn gu thưởng thức quốc tế.',
        category: 'Trà & Café',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
        ocop: '5-Star',
        cert: 'Verified Origin via GIS',
        price: '320.000đ'
      },
      {
        id: 2,
        name: 'Dưa Hấu Mỹ Thạnh',
        desc: 'Hương thơm tinh tế từ hoa bạc hà cao nguyên đá Đồng Văn.',
        category: 'Đặc sản',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
        ocop: '5-Star',
        cert: 'Verified Origin via GIS',
        price: '450.000đ'
      },
      {
        id: 5,
        name: 'Thanh Long Bình Thuận',
        desc: 'Thanh long ruột đỏ, ngọt thanh, đạt chuẩn xuất khẩu.',
        category: 'Trái cây',
        image: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=600',
        ocop: '4-Star',
        cert: 'Verified Origin via GIS',
        price: '30.000đ'
      },
      {
        id: 7,
        name: 'Chanh Không Hạt',
        desc: 'Chanh tươi, mọng nước, vỏ mỏng.',
        category: 'Rau củ',
        image: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?auto=format&fit=crop&q=80&w=600',
        ocop: '3-Star',
        cert: 'Verified Origin via GIS',
        price: '25.000đ'
      },
      {
        id: 9,
        name: 'Sầu Riêng Ri6',
        desc: 'Sầu riêng cơm vàng hạt lép, béo ngậy.',
        category: 'Trái cây',
        image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=600',
        ocop: '5-Star',
        cert: 'Verified Origin via GIS',
        price: '90.000đ'
      }
    ];

    const savedPosts = localStorage.getItem('vietagri_sale_posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const transformedPosts = posts.map((post: any) => ({
        id: post.id || Math.random().toString(),
        name: post.title || post.productName,
        desc: post.description || 'Sản phẩm chất lượng cao từ mạng lưới HTX Việt Agri.',
        category: post.category || 'Đặc sản',
        image: post.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
        ocop: '4-Star',
        cert: post.origin || 'Verified Origin via GIS',
        price: post.price.split(' ')[0] + 'đ'
      }));
      return [...transformedPosts, ...staticProducts];
    }
    return staticProducts;
  });

  const filteredProducts = activeCategory === 'Tất cả' 
    ? allProducts 
    : allProducts.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white min-h-screen font-sans">
      <ProductShowcaseHeader 
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Product Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mb-12">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#153B2B] text-[#EFD566] border-[2px] border-[#D1B15A] shadow-[0_10px_20px_rgba(21,59,43,0.4),inset_0_4px_10px_rgba(255,255,255,0.1)] scale-105' 
                      : 'bg-white text-slate-500 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#153B2B]/30 hover:scale-105 hover:text-[#153B2B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 border border-slate-100 relative flex flex-col h-full"
                >
                  {/* Badges */}
                  <div className="absolute top-6 left-6 z-10">
                    <div className="bg-white/90 backdrop-blur text-amber-500 text-[9px] font-black px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-amber-500/20 uppercase tracking-wider">
                      <Star size={10} fill="currentColor" />
                      Chuẩn {product.ocop}
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 z-10">
                    <div className="bg-[#059669]/90 backdrop-blur px-3 py-1.5 rounded-full text-[9px] font-black text-white flex items-center gap-1.5 shadow-sm uppercase tracking-wider">
                      <Leaf size={10} />
                      GIS Origin
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="h-72 overflow-hidden relative shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    />
                    
                    {/* Hover Overlay Buttons */}
                    <div className="absolute inset-0 bg-[#004d40]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link 
                        to="/register-enterprise"
                        className="bg-white text-[#004d40] p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#4ade80] hover:text-white"
                      >
                        Xem chi tiết sản phẩm
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-[#004d40] mb-3 group-hover:text-[#4ade80] transition-colors line-clamp-2 h-14">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-end mb-6">
                        {/* Removed QR Button */}
                      </div>
                      
                      <Link 
                        to="/register-enterprise"
                        className="block w-full py-4 border-2 border-[#004d40]/10 hover:border-[#4ade80] hover:bg-[#4ade80] hover:text-white text-[#004d40] text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all text-center"
                      >
                        Xem chi tiết sản phẩm
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Enterprise CTA Section */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#004d40] rounded-[3rem] p-10 md:p-20 relative overflow-hidden group shadow-2xl"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#4ade80] rounded-full blur-[100px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -ml-48 -mb-48" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8">
                  <Briefcase className="text-[#4ade80]" size={16} />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Dành cho Doanh Nghiệp</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Kết nối trực tiếp <br />
                  <span className="text-[#4ade80]">Vùng nguyên liệu</span> số
                </h2>
                <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-lg">
                  Tham gia vào mạng lưới cung ứng minh bạch, quản lý hợp đồng thông minh và đảm bảo chất lượng nông sản chất lượng cao từ các HTX 4.0.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/register-enterprise" 
                    className="bg-[#4ade80] text-[#004d40] px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-all transform hover:-translate-y-1 shadow-xl shadow-[#4ade80]/20"
                  >
                    Đăng ký đối tác <ArrowRight size={18} />
                  </Link>
                  <button className="bg-white/5 px-8 py-5 rounded-2xl font-black text-xs text-white uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
                    Nhận báo giá sỉ
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Truy xuất GIS', desc: 'Minh bạch 100% nguồn gốc từng lô hàng qua bản đồ số.' },
                  { title: 'Chuẩn 5*', desc: 'Tuyển chọn các sản phẩm chất lượng cao nhất vùng miền.' },
                  { title: 'Quản lý 4.0', desc: 'Hệ thống báo cáo, theo dõi đơn hàng thời gian thực.' },
                  { title: 'Hỗ trợ 24/7', desc: 'Đội ngũ kỹ thuật hỗ trợ kết nối HTX và Doanh nghiệp.' }
                ].map((item, idx) => (
                  <div key={item.title} className={`p-8 rounded-[2rem] border transition-all ${idx === 0 ? 'bg-emerald-400/10 border-emerald-400/20' : 'bg-white/5 border-white/10'}`}>
                    <h4 className="text-white font-bold mb-3">{item.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GIS Farmer Data Modal */}
      <AnimatePresence>
        {selectedFarm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFarm(null)}
              className="absolute inset-0 bg-[#004d40]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-md w-full rounded-[3rem] p-10 relative z-10 text-center"
            >
              <div className="w-20 h-20 bg-[#4ade80]/10 text-[#4ade80] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MapPin size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[#004d40] mb-4">Nguồn gốc {selectedFarm}</h3>
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">HTX Sản Xuất</div>
                  <div className="text-sm font-bold text-[#004d40]">Hợp tác xã Công nghệ cao Long An</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã Vùng Trồng</div>
                    <div className="text-xs font-bold font-mono">LA-4.0-GIS-0102</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chuẩn Canh Tác</div>
                    <div className="text-xs font-bold text-[#4ade80]">GlobalGAP</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFarm(null)}
                className="w-full py-4 bg-[#004d40] text-white font-black rounded-2xl tracking-widest uppercase text-[10px]"
              >
                Đóng thông tin
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
