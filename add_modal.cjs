const fs = require('fs');
let file = './resources/views/pages/SuperAdminDashboard.tsx';
let data = fs.readFileSync(file, 'utf8');

const modalStr = `
      {/* Role Config Modal */}
      <AnimatePresence>
        {selectedRoleAdmin && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoleAdmin(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between p-6 md:p-10 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <div>
                    <h2 className="text-2xl font-black text-[#004d40]">Cấu hình Tài khoản</h2>
                    <p className="text-sm font-bold text-slate-500 mt-1">
                      {selectedRoleAdmin.name} • @{selectedRoleAdmin.username}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedRoleAdmin(null)}
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 md:p-10 space-y-10">
                  {/* Account Lifecycle */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#004d40] mb-5 flex items-center">
                      <User size={16} className="mr-2" /> Vòng đời tài khoản
                    </h3>
                    <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                       <div>
                         <p className="font-bold text-slate-700 text-sm">Trạng thái hiện tại:</p>
                         <div className="mt-2">
                           {selectedRoleAdmin.status === 'active' ? (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                                <CheckCircle2 size={14} className="mr-1.5" /> Hoạt động
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-rose-100 text-rose-700">
                                <XCircle size={14} className="mr-1.5" /> Bị Khóa
                              </span>
                            )}
                         </div>
                       </div>
                       <div className="flex gap-3 text-left">
                          {selectedRoleAdmin.status === 'active' ? (
                            <button className="px-5 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex flex-col justify-center">
                               <div className="flex items-center mb-1"><ShieldAlert size={14} className="mr-1.5" /> Khóa tài khoản</div>
                               <span className="text-[9px] opacity-70">Phát hiện gian lận</span>
                            </button>
                          ) : (
                            <button className="px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex flex-col justify-center">
                               <div className="flex items-center mb-1"><CheckCircle2 size={14} className="mr-1.5" /> Mở khóa</div>
                               <span className="text-[9px] opacity-70">Khôi phục quyền truy cập</span>
                            </button>
                          )}
                          <button className="px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex flex-col justify-center">
                             <div className="flex items-center mb-1"><Trash2 size={14} className="mr-1.5" /> Xóa tài khoản</div>
                             <span className="text-[9px] opacity-70">Xóa vĩnh viễn (Soft-delete)</span>
                          </button>
                       </div>
                    </div>
                  </section>

                  {/* Permissions Component */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#004d40] mb-5 flex items-center">
                      <LayoutList size={16} className="mr-2" /> Phân quyền hạn (Scope)
                    </h3>
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 space-y-4 shadow-sm">
                      <p className="text-xs font-bold text-slate-500 mb-4">Chọn các module mà Admin này được phép truy cập và quản lý:</p>
                      
                      {[
                        { id: 'inventory', label: 'Quản lý Kho hàng (Nhập/Xuất/Tồn kho)' },
                        { id: 'hr', label: 'Quản lý Nhân sự & Phân công' },
                        { id: 'customers', label: 'Quản lý Khách hàng & Đối tác' },
                        { id: 'contracts', label: 'Quản lý Hợp đồng Điện tử' },
                        { id: 'gis', label: 'Quản lý Bản đồ GIS' }
                      ].map((perm) => (
                        <label key={perm.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                           <div className={\`w-6 h-6 rounded flex items-center justify-center transition-colors \${selectedRoleAdmin.scope.includes(perm.id) ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-transparent group-hover:bg-slate-300'}\`}>
                              <CheckCircle2 size={16} />
                           </div>
                           <span className="font-bold text-slate-700 text-sm flex-1">{perm.label}</span>
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* Security */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#004d40] mb-5 flex items-center">
                      <ShieldCheck size={16} className="mr-2" /> Quản lý bảo mật
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800">Cấp lại Mật khẩu</h4>
                            <p className="text-xs text-slate-500 font-bold mt-1">Buộc người dùng đổi mật khẩu ở lần đăng nhập tiếp theo.</p>
                          </div>
                          <button className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                            Gửi yêu cầu Reset
                          </button>
                       </div>
                       
                       <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex flex-col justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-[#004d40]">Xác thực 2 lớp (2FA)</h4>
                            <p className="text-xs text-[#004d40]/70 font-bold mt-1">Bắt buộc Admin này sử dụng ứng dụng Authenticator.</p>
                          </div>
                          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-emerald-100">
                             <span className="text-xs font-bold text-emerald-800">Trạng thái: Bật</span>
                             <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </section>

                  {/* Audit Logs */}
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#004d40] mb-5 flex items-center">
                      <History size={16} className="mr-2" /> Nhật ký hoạt động
                    </h3>
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                       <div className="space-y-6">
                         {[
                           { action: 'Duyệt Hợp đồng #CT-938475', time: '10:30 AM, 15/05/2026', type: 'approve' },
                           { action: 'Cập nhật Tồn kho (Lô Cà phê Arabica)', time: '09:15 AM, 14/05/2026', type: 'update' },
                           { action: 'Đăng nhập thành công', time: '08:00 AM, 14/05/2026', type: 'login' }
                         ].map((log, i) => (
                           <div key={i} className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                 {log.type === 'approve' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                 {log.type === 'update' && <Edit3 size={14} className="text-blue-500" />}
                                 {log.type === 'login' && <Globe size={14} className="text-amber-500" />}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-700">{log.action}</p>
                                <p className="text-xs font-bold text-slate-400 mt-1">{log.time}</p>
                              </div>
                           </div>
                         ))}
                       </div>
                       <div className="mt-8 flex gap-3">
                         <button className="flex-1 py-3 bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center">
                           <History size={14} className="mr-2"/> Audit Logs toàn bộ
                         </button>
                         <button className="flex-1 py-3 bg-amber-50 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center border border-amber-200">
                           <AlertTriangle size={14} className="mr-2"/> Ghi đè thay đổi (Override)
                         </button>
                       </div>
                    </div>
                  </section>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4 shrink-0">
                <button 
                  onClick={() => setSelectedRoleAdmin(null)}
                  className="px-6 py-3 bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => setSelectedRoleAdmin(null)}
                  className="px-6 py-3 bg-[#004d40] text-white hover:bg-[#00332d] rounded-xl text-xs font-bold tracking-widest uppercase shadow-xl shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;

const term = '    </div>\n  );\n}';
const targetIdx = data.lastIndexOf(term);
if (targetIdx !== -1) {
  data = data.substring(0, targetIdx) + modalStr + data.substring(targetIdx);
  fs.writeFileSync(file, data, 'utf8');
} else {
  console.log("Could not find the end of the file.");
}
