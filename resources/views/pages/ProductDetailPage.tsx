import React, { useState } from 'react';
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

export default function ProductDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'info' | 'gis' | 'quotes'>('info');
  const [quantity, setQuantity] = useState(10); // Minimum wholesale order

  const product = products.find(p => p.id === Number(id)) || products[0];

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

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column: Visuals */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[3rem] overflow-hidden shadow-2xl relative aspect-[4/5] lg:aspect-square bg-slate-100"
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Cert Badges */}
                <div className="absolute bottom-10 left-10 right-10 flex flex-wrap gap-4">
                  <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border border-white/20 shadow-xl">
                    <Star size={16} className="text-amber-500" fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950">OCOP {product.ocop}</span>
                  </div>
                  <div className="bg-emerald-900/80 backdrop-blur px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border border-emerald-400/20 shadow-xl">
                    <ShieldCheck size={16} className="text-[#4ade80]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">GIS Verified</span>
                  </div>
                </div>
              </motion.div>

              {/* Gallery Miniatures */}
              <div className="grid grid-cols-3 gap-6">
                {(product.gallery || []).map((img, i) => (
                  <div key={i} className="aspect-square rounded-3xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Info & Action */}
            <div className="flex flex-col h-full">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-[#059669]/10 text-[#059669] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{product.category}</span>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    <MapPin size={14} /> {product.attributes?.[3].value || 'Việt Nam'}
                  </div>
                </div>

                <h1 className="text-5xl font-black text-emerald-950 mb-6 leading-tight tracking-tighter">
                  {product.name}
                </h1>
                
                <div className="flex items-baseline gap-4 mb-10">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá niêm yết:</span>
                  <span className="text-3xl font-black text-[#059669]">{product.price}</span>
                  <span className="text-slate-400 text-sm font-medium">/ 1Kg</span>
                </div>

                <p className="text-slate-500 text-lg leading-relaxed mb-12">
                  {product.fullDesc || product.desc}
                </p>

                {/* Technical Specs Tab Grid */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {(product.attributes || []).map(attr => (
                    <div key={attr.label} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{attr.label}</div>
                      <div className="text-sm font-bold text-emerald-950">{attr.value}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs UI */}
                <div className="bg-slate-50 p-2 rounded-3xl flex gap-1 mb-16 max-w-sm">
                  {[
                    { id: 'info', label: 'Chi tiết' },
                    { id: 'gis', label: 'Bản đồ số' },
                    { id: 'quotes', label: 'Báo giá sỉ' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                        activeTab === tab.id 
                        ? 'bg-white text-[#059669] shadow-sm' 
                        : 'text-slate-400 hover:text-emerald-950'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Purchase Section Card */}
              <div className="bg-emerald-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-emerald-400/30 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                    <div>
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Đơn hàng sỉ tối thiểu</div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setQuantity(Math.max(10, quantity - 5))}
                          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center font-black transition-colors"
                        > - </button>
                        <span className="text-2xl font-black">{quantity} Kg</span>
                        <button 
                          onClick={() => setQuantity(quantity + 5)}
                          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center font-black transition-colors"
                        > + </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Ước tính giá trị</div>
                      <div className="text-2xl font-black text-[#4ade80]">{(quantity * 320000).toLocaleString()}đ</div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Link 
                      to={`/contract/${product.id}`}
                      className="bg-white text-emerald-950 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-[#4ade80] hover:text-white transition-all shadow-xl shadow-black/20"
                    >
                      <FileText size={16} /> Nhận báo giá & Hợp đồng
                    </Link>
                    <button className="bg-white/5 border border-white/10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                      <MessageCircle size={16} /> Tư vấn kỹ thuật
                    </button>
                  </div>

                  {/* Trust Footer in Card */}
                  <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-6 justify-center sm:justify-start">
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

      {/* Origin Mapping Section (Simulated) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-emerald-950 mb-4 tracking-tight">Truy xuất Vùng trồng GIS</h2>
            <p className="text-slate-500 font-bold text-sm tracking-wide">Minh bạch hóa 100% dữ liệu nông hộ và tọa độ canh tác của lô hàng này.</p>
          </div>
          
          <div className="bg-white rounded-[4rem] p-6 shadow-2xl relative overflow-hidden aspect-video group">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb052b09?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover rounded-[3rem] opacity-40 group-hover:opacity-60 transition-opacity" 
              alt="Farm Map" 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#059669] text-white rounded-3xl flex items-center justify-center shadow-2xl animate-bounce mb-4">
                <MapPin size={32} />
              </div>
              <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-100 shadow-2xl max-w-sm">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Dữ liệu thời gian thực</div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">HTX:</span>
                    <span className="text-emerald-950 font-black">Cầu Đất Farm 4.0</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">Số hộ liên kết:</span>
                    <span className="text-emerald-950 font-black">120 Xã viên</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">Diện tích:</span>
                    <span className="text-emerald-950 font-black">45.5 Ha</span>
                  </div>
                </div>
                <button className="w-full py-4 bg-[#059669] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors">
                  Khám phá bản đồ vùng trồng <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
