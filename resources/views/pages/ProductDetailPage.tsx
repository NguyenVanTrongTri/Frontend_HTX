import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { 
  Leaf, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  Star,
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  FileText
} from 'lucide-react';
import { PRODUCTS as products } from '../../data';
import { postService } from '../../services/postService';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'info' | 'quotes'>('info');
  const [quantity, setQuantity] = useState(10); // Minimum wholesale order
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isPostProduct = typeof id === 'string' && id.toLowerCase().includes('post');
  const isStaticProduct = typeof id === 'string' && (id.includes('static') || id.includes('products-sc'));
  const hidePrice = isStaticProduct || isPostProduct;

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(null);
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Handle specialized static products with rich content
        if (id === 'products-sc-1' || id === 'static-1') {
          setProduct({
            id: 'products-sc-1',
            name: 'Cà Phê Arabica Cầu Đất',
            desc: 'Hương vị chua thanh, hậu vị ngọt chuẩn gu thưởng thức quốc tế.',
            fullDesc: 'Cà phê Arabica Cầu Đất được trồng tại vùng cao nguyên có độ cao trên 1500m so với mực nước biển với khí hậu ôn đới quanh năm. Từng quả cà phê chín mọng được thu hái hoàn toàn bằng tay, chế biến kỹ lưỡng theo phương pháp ướt và phơi tự nhiên, giữ trọn hương sô-cô-la nồng nàn, vị chua thanh thanh tao cùng hậu vị ngọt đặc trưng quyến rũ tinh khiết.',
            category: 'Trà & Café',
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
            ocop: '5-Star',
            price: '320.000đ',
            priceNum: 320000,
            htxName: 'HTX Cà phê Cầu Đất',
            attributes: [
               { label: 'Hợp tác xã', value: 'HTX Cà phê Cầu Đất' },
               { label: 'Chứng nhận', value: 'VietGAP, Organic USDA' },
               { label: 'Năm thu hoạch', value: '2026' },
               { label: 'Vùng trồng', value: 'Cầu Đất, Lâm Đồng' }
            ],
            gallery: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600']
          });
        } else if (id === 'products-sc-2' || id === 'static-2') {
          setProduct({
            id: 'products-sc-2',
            name: 'Mật Ong Hoa Nhãn',
            desc: 'Hương thơm tinh tế từ mật hoa tự nhiên quý hiếm của vùng quê Hưng Yên.',
            fullDesc: 'Mật ong hoa nhãn Hưng Yên nguyên chất có màu vàng óng sậm dẻo thơm, đặc sánh, không bị đọng đường. Mật sở hữu hương vị nhã nhặn, ngọt lịm đặc trưng của phấn hoa nhãn rộ nở mùa hè, cực kỳ bổ dưỡng cho sức khỏe, hỗ trợ hô hấp và tăng cường hệ miễn dịch hiệu quả.',
            category: 'Đặc sản',
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
            ocop: '5-Star',
            price: '450.000đ',
            priceNum: 450000,
            htxName: 'HTX Hải Châu Nông Sản',
            attributes: [
               { label: 'Hợp tác xã', value: 'HTX Hải Châu Nông Sản' },
               { label: 'Chứng nhận', value: 'VietGAP, ISO 22000' },
               { label: 'Năm thu hoạch', value: '2026' },
               { label: 'Vùng trồng', value: 'Khoái Châu, Hưng Yên' }
            ],
            gallery: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600']
          });
        } else if (id?.startsWith('static-')) {
          const cleanId = id.replace('static-', '');
          const found = products.find(p => String(p.id) === cleanId) || products[0];
          const calculatedPrice = found.price.includes('đ') ? found.price : found.price + 'đ';
          const calculatedPriceNum = parseInt(found.price.replace(/[^0-9]/g, '')) || 100000;
          setProduct({
            id: found.id,
            name: found.name,
            desc: found.desc || 'Sản phẩm chất lượng cao đạt tiêu chuẩn nông nghiệp VietAgri.',
            fullDesc: found.fullDesc || found.desc || 'Sản phẩm chất lượng cao tự nhiên, được phân phối liên kết từ hợp tác xã đạt chuẩn.',
            category: found.category || 'Nông sản',
            image: found.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
            ocop: found.ocop || '4-Star',
            price: calculatedPrice,
            priceNum: calculatedPriceNum,
            htxName: 'HTX Nông Nghiệp Việt Agri',
            attributes: [
               { label: 'Hợp tác xã', value: 'HTX Nông Nghiệp Việt Agri' },
               { label: 'Chứng nhận', value: 'VietGAP, GlobalGAP' },
               { label: 'Năm thu hoạch', value: '2026' },
               { label: 'Vùng trồng', value: 'Việt Nam' }
            ],
            gallery: [found.image].filter(Boolean)
          });
        } else {
          // Check static DB before API to be safe
          const localDbFound = products.find(p => String(p.id) === String(id));
          if (localDbFound) {
            const calculatedPrice = localDbFound.price.includes('đ') ? localDbFound.price : localDbFound.price + 'đ';
            const calculatedPriceNum = parseInt(localDbFound.price.replace(/[^0-9]/g, '')) || 100000;
            setProduct({
              id: localDbFound.id,
              name: localDbFound.name,
              desc: localDbFound.desc || 'Sản phẩm chất lượng cao đạt tiêu chuẩn nông nghiệp VietAgri.',
              fullDesc: localDbFound.fullDesc || localDbFound.desc || 'Sản phẩm chất lượng cao tự nhiên, được phân phối liên kết từ hợp tác xã đạt chuẩn.',
              category: localDbFound.category || 'Nông sản',
              image: localDbFound.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
              ocop: localDbFound.ocop || '4-Star',
              price: calculatedPrice,
              priceNum: calculatedPriceNum,
              htxName: 'HTX Nông Nghiệp Việt Agri',
              attributes: [
                 { label: 'Hợp tác xã', value: 'HTX Nông Nghiệp Việt Agri' },
                 { label: 'Chứng nhận', value: 'VietGAP, GlobalGAP' },
                 { label: 'Năm thu hoạch', value: '2026' },
                 { label: 'Vùng trồng', value: 'Việt Nam' }
              ],
              gallery: [localDbFound.image].filter(Boolean)
            });
          } else {
            // Ket noi API
            const response = await postService.getPostById(id!);
            const data = response?.data || response;
            
            if (data) {
              const priceStr = data.price ? (data.price.toString().includes('đ') ? data.price : data.price + 'đ') : '0đ';
              const priceNum = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
              
              setProduct({
                id: data.id,
                name: data.title || data.productName,
                desc: data.description || 'Sản phẩm chất lượng cao tự nhiên, được phân phối trực tiếp từ hợp tác xã liên kết đạt chuẩn.',
                fullDesc: data.story || data.description,
                category: data.category || 'Đặc sản',
                image: data.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
                ocop: '4-Star',
                price: priceStr,
                priceNum: priceNum,
                htxName: data.cooperativeName || 'HTX Cầu Đất Farm',
                attributes: [
                   { label: 'Hợp tác xã', value: data.cooperativeName || 'HTX Cầu Đất Farm' },
                   { label: 'Chứng nhận', value: String(data.standards || 'VietGAP, HACCP') },
                   { label: 'Năm thu hoạch', value: data.harvestDate || '2026' },
                   { label: 'Vùng trồng', value: data.origin || 'Lâm Đồng' }
                ],
                gallery: data.gallery || [data.image].filter(Boolean)
              });
            } else {
              // Fallback to first item in mock DB
              const fallbackItem = products[0];
              const calculatedPrice = fallbackItem.price.includes('đ') ? fallbackItem.price : fallbackItem.price + 'đ';
              const calculatedPriceNum = parseInt(fallbackItem.price.replace(/[^0-9]/g, '')) || 100000;
              setProduct({
                id: fallbackItem.id,
                name: fallbackItem.name,
                desc: fallbackItem.desc || 'Sản phẩm chất lượng cao.',
                fullDesc: fallbackItem.fullDesc || fallbackItem.desc,
                category: fallbackItem.category || 'Nông sản',
                image: fallbackItem.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
                ocop: fallbackItem.ocop || '4-Star',
                price: calculatedPrice,
                priceNum: calculatedPriceNum,
                htxName: 'HTX Nông Nghiệp Việt Agri',
                attributes: [
                   { label: 'Hợp tác xã', value: 'HTX Nông Nghiệp Việt Agri' },
                   { label: 'Chứng nhận', value: 'VietGAP' },
                   { label: 'Năm thu hoạch', value: '2026' },
                   { label: 'Vùng trồng', value: 'Việt Nam' }
                ],
                gallery: [fallbackItem.image].filter(Boolean)
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch product detail via API:", error);
        // Fallback for demo
        const found = products.find(p => String(p.id) === String(id)) || products[0];
        const calculatedPrice = found.price.includes('đ') ? found.price : found.price + 'đ';
        const calculatedPriceNum = parseInt(found.price.replace(/[^0-9]/g, '')) || 100000;
        setProduct({
          id: found.id,
          name: found.name,
          desc: found.desc || 'Sản phẩm chất lượng cao.',
          fullDesc: found.fullDesc || found.desc,
          category: found.category || 'Nông sản',
          image: found.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
          ocop: found.ocop || '4-Star',
          price: calculatedPrice,
          priceNum: calculatedPriceNum,
          htxName: 'HTX Nông Nghiệp Việt Agri',
          attributes: [
             { label: 'Hợp tác xã', value: 'HTX Nông Nghiệp Việt Agri' },
             { label: 'Chứng nhận', value: 'VietGAP' },
             { label: 'Năm thu hoạch', value: '2026' },
             { label: 'Vùng trồng', value: 'Việt Nam' }
          ],
          gallery: [found.image].filter(Boolean)
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-black text-emerald-950">Không tìm thấy sản phẩm</h2>
      <Link to="/products" className="text-emerald-600 font-bold hover:underline">Quay lại cửa hàng</Link>
    </div>
  );

  // Build a 3-item list containing exactly 3 small unique image frames under the big image
  let galleryList: string[] = [];
  if (product) {
    if (product.gallery && product.gallery.length > 0) {
      galleryList = [...product.gallery];
    }
    if (product.image && !galleryList.includes(product.image)) {
      galleryList.unshift(product.image);
    }
    const fallbackGallery = [
      'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600', // fresh fields/growing produce
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600', // agricultural tractor/farm
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600', // harvested fresh vegetables
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600', // beautiful farm hills
    ];
    galleryList = Array.from(new Set(galleryList.filter(Boolean)));
    while (galleryList.length < 3) {
      const nextFallback = fallbackGallery.find(img => !galleryList.includes(img)) || fallbackGallery[0];
      galleryList.push(nextFallback);
    }
    galleryList = galleryList.slice(0, 3);
  }

  return (
    <div className="min-h-screen bg-white font-sans relative overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] opacity-40 -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-amber-50 rounded-full blur-[120px] opacity-40 -ml-48 -mb-48 pointer-events-none" />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumb & Global Back */}
          <div className="mb-12">
            <Link to="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-950 font-bold text-xs uppercase tracking-widest transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Quay lại danh sách
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Visuals */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[2.5rem] overflow-hidden shadow-2xl relative aspect-square bg-slate-100"
              >
                <img 
                  src={selectedImage || product.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600'} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                
                {/* Floating Cert Badges */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                  <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20 shadow-xl">
                    <Star size={14} className="text-amber-500" fill="currentColor" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-950">OCOP {product.ocop || '5-Star'}</span>
                  </div>
                  <div className="bg-emerald-900/80 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2 border border-emerald-400/20 shadow-xl">
                    <ShieldCheck size={14} className="text-[#4ade80]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">GIS Verified</span>
                  </div>
                </div>
              </motion.div>

              {/* Gallery Miniatures - always 3 thumbnail layouts */}
              <div className="grid grid-cols-3 gap-4">
                {galleryList.map((img, i) => {
                  const isSelected = (selectedImage === img) || (!selectedImage && img === product.image);
                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-2xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-emerald-600 scale-95 opacity-100 ring-2 ring-emerald-600/20' 
                          : 'border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Info & Action */}
            <div className="lg:col-span-7 flex flex-col h-full">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#059669]/10 text-[#059669] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{product.category || 'Vật phẩm'}</span>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <MapPin size={14} /> {product.attributes?.[3]?.value || 'Việt Nam'}
                  </div>
                </div>

                <h1 className="text-4xl font-black text-emerald-950 mb-4 leading-tight tracking-tighter">
                  {product.name}
                </h1>
                
                {!hidePrice && (
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá niêm yết:</span>
                    <span className="text-3xl font-black text-[#059669]">{product.price}</span>
                    <span className="text-slate-400 text-sm font-medium">/ 1Kg</span>
                  </div>
                )}

                <p className="text-slate-500 text-base leading-relaxed mb-8">
                  {product.fullDesc || product.desc || 'Sản phẩm chất lượng cao tự nhiên, được phân phối trực tiếp từ hợp tác xã liên kết đạt chuẩn.'}
                </p>

                {/* Technical Specs Tab Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {(product.attributes || [])
                    .filter(attr => attr.label !== 'Hợp tác xã')
                    .map(attr => (
                      <div key={attr.label} className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{attr.label}</div>
                        <div className="text-xs font-bold text-emerald-950">{attr.value}</div>
                      </div>
                    ))}
                </div>

               
              </motion.div>

              {/* Purchase Section Card */}
              <div className="bg-emerald-900 rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-emerald-400/30 transition-colors" />
                
                <div className="relative z-10">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Link 
                      to="/register-enterprise"
                      className="bg-white text-emerald-950 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-[#4ade80] hover:text-white transition-all shadow-xl shadow-black/20"
                    >
                      <FileText size={16} /> Nhận báo giá & Hợp đồng
                    </Link>
                    <Link 
                      to="/register-enterprise"
                      className="bg-white/5 border border-white/10 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-white"
                    >
                      <MessageCircle size={16} /> Tư vấn kỹ thuật
                    </Link>
                  </div>

                  {/* Trust Footer in Card */}
                  <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-4 justify-center sm:justify-start">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
                      <Truck size={14} className="text-[#4ade80]" /> Giao hàng toàn cầu
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
                      <CheckCircle2 size={14} className="text-[#4ade80]" /> Đảm bảo chất lượng
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
                      <Package size={14} className="text-[#4ade80]" /> Đóng gói chuẩn HTX
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}
