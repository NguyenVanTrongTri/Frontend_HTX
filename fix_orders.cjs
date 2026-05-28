const fs = require('fs');

const file = './resources/views/pages/CustomerDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacementStr = `{activeContracts.length === 0 ? (
                      <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-xl">
                        <Package size={48} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-wider">Chưa có đơn hàng nào / Chưa có hợp đồng đang hiệu lực</p>
                      </div>
                   ) : activeContracts.map((contract) => {
                      const cName = contract.cropName.toLowerCase();
                      const isShortTerm = cName.includes('rau') || cName.includes('cải') || cName.includes('dưa') || cName.includes('hành') || cName.includes('nấm');
                      const baseDate = new Date(contract.deliveryTime).getTime();

                      if (isShortTerm) {
                        return (
                          <div key={contract.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 flex flex-col gap-6 group transition-all hover:border-blue-200">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                                  <Repeat size={32} />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Sản phẩm ngắn ngày (Giao nhiều lần)</p>
                                  <h4 className="text-xl font-black text-[#004d40]">{contract.cropName}</h4>
                                  <p className="text-sm text-slate-400 font-bold max-w-md truncate">Đối tác: {contract.coopName}</p>
                                </div>
                              </div>
                              <div className="text-left lg:text-right">
                                <p className="text-2xl font-black text-[#004d40] mb-1">{contract.totalVolume}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100 shadow-sm"><Repeat size={12} className="inline mr-1.5 -mt-0.5 text-blue-500" />Định kỳ hàng tuần</p>
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-100/60">
                               <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center"><Calendar size={14} className="mr-2 text-blue-600" /> Lịch trình giao nhận (Dự kiến)</p>
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* Đợt 1 */}
                                  <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                                     <div className="flex justify-between items-center mb-3">
                                       <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest bg-emerald-100/50 px-2.5 py-1 rounded-md">Đợt 1</span>
                                       <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider flex items-center"><CheckCircle2 size={12} className="mr-1"/> Hoàn thành</span>
                                     </div>
                                     <p className="text-lg font-black text-emerald-900 tracking-tight">{(parseInt(contract.totalVolume.replace(/\\D/g,'')) / 3).toLocaleString('vi-VN')} {contract.totalVolume.replace(/[0-9,\\s]/g, '')}</p>
                                     <p className="text-[11px] font-bold text-emerald-700/70 mt-1.5">{new Date(baseDate - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}</p>
                                  </div>
                                  {/* Đợt 2 */}
                                  <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200 shadow-md shadow-amber-900/5 relative overflow-hidden ring-1 ring-amber-400/20">
                                     <div className="flex justify-between items-center mb-3 relative z-10">
                                       <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200">Đợt 2</span>
                                       <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider animate-pulse flex items-center"><Truck size={12} className="mr-1"/> Đang nhận</span>
                                     </div>
                                     <p className="text-lg font-black text-amber-950 tracking-tight relative z-10">{(parseInt(contract.totalVolume.replace(/\\D/g,'')) / 3).toLocaleString('vi-VN')} {contract.totalVolume.replace(/[0-9,\\s]/g, '')}</p>
                                     <p className="text-[11px] font-bold text-amber-700/80 mt-1.5 relative z-10">{new Date(baseDate - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}</p>
                                     <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-300 w-[65%]" />
                                  </div>
                                  {/* Đợt 3 */}
                                  <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200/60">
                                     <div className="flex justify-between items-center mb-3">
                                       <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest bg-slate-200/50 px-2.5 py-1 rounded-md">Đợt 3</span>
                                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center"><Clock size={12} className="mr-1"/> Chờ xử lý</span>
                                     </div>
                                     <p className="text-lg font-black text-slate-700 tracking-tight">{(parseInt(contract.totalVolume.replace(/\\D/g,'')) / 3).toLocaleString('vi-VN')} {contract.totalVolume.replace(/[0-9,\\s]/g, '')}</p>
                                     <p className="text-[11px] font-bold text-slate-500 mt-1.5">{new Date(contract.deliveryTime).toLocaleDateString('vi-VN')}</p>
                                  </div>
                               </div>
                            </div>
                          </div>
                        );
                      } else {
                        // Long term -> single batch
                        return (
                          <div key={contract.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 flex flex-col gap-6 group transition-all hover:border-[#004d40]/30 hover:shadow-2xl">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-[#004d40] shadow-inner group-hover:bg-[#004d40] group-hover:text-white transition-colors duration-300 shrink-0">
                                  <Package size={32} />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-[#004d40]/70 uppercase tracking-[0.2em]">Sản phẩm dài ngày (Giao 1 lần)</p>
                                  <h4 className="text-xl font-black text-[#004d40]">Lô {contract.cropName}</h4>
                                  <p className="text-sm text-slate-400 font-bold max-w-md truncate">Đối tác: {contract.coopName}</p>
                                </div>
                              </div>
                              <div className="text-left lg:text-right">
                                <p className="text-2xl font-black text-[#004d40] mb-1">{contract.totalVolume}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest bg-slate-50 inline-flex items-center px-3 py-1 rounded-full border border-slate-100 shadow-sm"><Calendar size={12} className="mr-1.5 text-[#004d40]"/>Hạn giao: {contract.deliveryTime}</p>
                              </div>
                            </div>

                            <div className="w-full bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                               <div className="flex-1 w-full space-y-3">
                                  <div className="flex items-center justify-between mb-1">
                                     <span className="text-[10px] font-black text-[#004d40] uppercase tracking-widest flex items-center"><Truck size={14} className="mr-1.5" /> Trạng thái: Đang vận chuyển về kho</span>
                                     <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">60%</span>
                                  </div>
                                  <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
                                     <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 animate-[pulse_3s_ease-in-out_infinite]" style={{ width: '60%' }} />
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-bold">Vị trí hiện tại: <span className="text-[#004d40]">Trạm trung chuyển liên tỉnh</span></p>
                               </div>
                               <div className="shrink-0 mt-4 md:mt-0">
                                  <button className="px-6 py-3.5 bg-white border border-[#004d40]/20 text-[#004d40] hover:bg-[#004d40] hover:text-white hover:shadow-lg hover:-translate-y-0.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center">
                                    Chi tiết hành trình <ChevronRight size={14} className="ml-1" />
                                  </button>
                               </div>
                            </div>
                          </div>
                        );
                      }
                   })}`;

const startIdx = content.indexOf('{orders.map((order) => (');
if (startIdx === -1) {
    console.error("Could not find the start block of orders.map");
} else {
    // Find the end of the block
    const endStr = '))}';
    let endIdx = content.indexOf(endStr, startIdx);
    if (endIdx === -1) {
        console.error("Could not find block end");
    } else {
        endIdx += endStr.length;
        const newContent = content.substring(0, startIdx) + replacementStr + content.substring(endIdx);
        fs.writeFileSync(file, newContent, 'utf8');
        console.log("Successfully replaced the orders section.");
    }
}
