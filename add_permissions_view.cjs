const fs = require('fs');
let file = './resources/views/pages/SuperAdminDashboard.tsx';
let data = fs.readFileSync(file, 'utf8');

const replacementStr = `
            {activeTab === 'permissions' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#004d40]">Quản lý Phân quyền</h2>
                    <p className="text-slate-500 font-bold text-sm">Quản lý vòng đời tài khoản Admin của các HTX</p>
                  </div>
                  <button className="bg-[#004d40] text-white px-6 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all flex items-center justify-center">
                    <Plus size={18} className="mr-2" /> Thêm Admin Mới
                  </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-[2.5rem] p-4 flex items-center gap-4 border border-slate-100 shadow-sm relative z-10 w-full max-w-xl">
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                      <Search size={18} />
                    </div>
                    <input 
                      type="text"
                      placeholder="Tìm kiếm theo Tên, Username hoặc HTX..."
                      className="bg-transparent border-none outline-none w-full text-sm font-bold text-slate-700 placeholder:text-slate-400"
                      value={roleSearchTerm}
                      onChange={(e) => setRoleSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest pl-8">Admin / Username</th>
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Quản lý HTX</th>
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Tình trạng</th>
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Bảo mật</th>
                          <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right pr-8">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {roleAdmins.filter(a => a.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) || a.username.toLowerCase().includes(roleSearchTerm.toLowerCase())).map((admin) => (
                          <tr key={admin.id} className="hover:bg-slate-50/30 transition-colors group">
                            <td className="p-5 pl-8">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                                  {admin.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-[#004d40]">{admin.name}</div>
                                  <div className="text-xs text-slate-400 font-bold">@{admin.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 font-bold text-slate-600 text-sm">
                              {admin.coopName}
                            </td>
                            <td className="p-5">
                              {admin.status === 'active' ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  <CheckCircle2 size={12} className="mr-1.5" /> Hoạt động
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100">
                                  <XCircle size={12} className="mr-1.5" /> Bị Khóa
                                </span>
                              )}
                            </td>
                            <td className="p-5">
                              {admin.is2FA ? (
                                <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" /> 2FA Bật
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5" /> 2FA Tắt
                                </span>
                              )}
                            </td>
                            <td className="p-5 pr-8 text-right">
                              <button 
                                onClick={() => setSelectedRoleAdmin(admin)}
                                className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-500 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors font-mono"
                              >
                                Cấu hình
                              </button>
                            </td>
                          </tr>
                        ))}
                        {roleAdmins.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">Không tìm thấy quản trị viên nào.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'statistics' || activeTab === 'settings' || activeTab === 'categories') && (`;

data = data.replace(/\{\(activeTab === 'statistics' \|\| activeTab === 'settings' \|\| activeTab === 'categories'\) && \(/g, replacementStr);
fs.writeFileSync(file, data, 'utf8');
