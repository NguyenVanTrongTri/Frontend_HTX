import React, { useState, useEffect } from 'react';
import { FileText, Search, Clock, CheckCircle2, XCircle, Handshake, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { contractService } from '../../services/contractService';

interface ContractDetailViewProps {
  contract: any;
  onClose: () => void;
  onAction: (action: string, id: string) => void;
}

function ContractDetailView({ contract, onClose, onAction }: ContractDetailViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-900/10 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {contract.contractNo || contract.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                contract.status === 'Đang thực hiện' || contract.status === 'signed' || contract.status === 'Đã ký' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                contract.status === 'Chờ duyệt' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-500'
              }`}>
                {contract.status === 'signed' ? 'Đã ký' : contract.status}
              </span>
            </div>
            <h3 className="text-xl font-black text-emerald-950">Chi tiết hợp đồng mua bán</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-emerald-950 transition-colors p-2 hover:bg-slate-100 rounded-xl"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1 text-slate-600 text-sm">
          {/* Section 1: Parties */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50/40 p-6 rounded-2xl border border-slate-100">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bên bán (HTX)</div>
              <div className="font-bold text-emerald-950">{contract.seller || 'Hợp tác xã liên kết VietAgri'}</div>
              <div className="text-xs text-slate-400 mt-1">Đại diện pháp luật hợp lệ</div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bên mua (Đối tác)</div>
              <div className="font-bold text-emerald-950">{contract.party}</div>
              <div className="text-xs text-slate-400 mt-1">Mã doanh nghiệp đã xác minh</div>
            </div>
          </div>

          {/* Section 2: Financials & Crops */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tổng giá trị</div>
              <div className="text-base font-black text-emerald-950">{contract.val || contract.amount || 'Liên hệ'}</div>
            </div>
            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Sản lượng mua</div>
              <div className="text-base font-bold text-emerald-950">{contract.quantity || 'Theo đợt thu hoạch'}</div>
            </div>
            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Thời hạn hợp đồng</div>
              <div className="text-base font-bold text-emerald-950">{contract.duration || '12 tháng'}</div>
            </div>
          </div>

          {/* Section 3: Legal Terms */}
          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-widest text-emerald-950">Điều khoản & Tiêu chuẩn nông nghiệp</h4>
            <div className="bg-slate-50/30 p-6 rounded-2xl border border-slate-100 space-y-3">
              <p className="leading-relaxed">
                <span className="font-bold text-emerald-950">1. Quy chuẩn chất lượng:</span> Tất cả sản phẩm nông sản bàn giao phải được sản xuất theo quy trình đạt chuẩn VietGAP/GlobalGAP, có gắn mã QR truy xuất mã vùng trồng số của bản đồ VietAgri.
              </p>
              <p className="leading-relaxed">
                <span className="font-bold text-emerald-950">2. Phương thức giao nhận:</span> Giao trực tiếp tại kho bãi của Hợp tác xã theo tiến độ thu hoạch chu kỳ sinh trưởng đã khai báo trên hệ thống.
              </p>
              <p className="leading-relaxed">
                <span className="font-bold text-emerald-950">3. Hình thức thanh toán:</span> Chuyển khoản ngân hàng trực tiếp qua tài khoản trung gian được liên kết, đặt cọc trước 30% khi xác nhận ký kết.
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hợp đồng điện tử ký số SHA-256</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Đóng
          </button>
          
          {contract.status === 'Chờ duyệt' && (
            <button 
              onClick={() => onAction('approve', contract.id)}
              className="px-6 py-2.5 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-emerald-900/10 flex items-center gap-2"
            >
              <CheckCircle2 size={14} /> Duyệt hợp đồng
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function RootAdminCustomerContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Ket noi API
      try {
        const response = await contractService.getAllContracts();
        const apiContracts = Array.isArray(response) ? response : (response?.data || []);
        
        setContracts(apiContracts.map((v2: any) => {
          let simplifiedStatus = 'Chờ duyệt';
          if (v2.status === 'signed') simplifiedStatus = 'Đã ký';
          else if (v2.status === 'active' || v2.status === 'in_progress') simplifiedStatus = 'Đang thực hiện';
          
          return {
            id: v2.id,
            contractNo: v2.contractNo || 'HĐMB-Chưa rõ',
            party: v2.enterpriseName || v2.buyer?.name || 'Đối tác',
            val: v2.totalVal ? `${(v2.totalVal / 1000000).toFixed(1)} Triệu` : (v2.amount || '0 Triệu'),
            status: simplifiedStatus,
            ...v2
          };
        }));
      } catch (error) {
        console.error("Failed to fetch customer contracts:", error);
      }
    };
    fetchData();
  }, []);

  const filteredContracts = contracts.filter(c => 
    (c.contractNo?.includes('HĐMB') || c.type === 'b2b') && 
    (c.party?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.contractNo?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAction = async (action: string, id: string) => {
    if (action === 'approve') {
       // Ket noi API
       try {
         const contract = contracts.find(c => c.id === id);
         const updatedData = { ...contract, status: 'signed' };
         await contractService.updateContract(id, updatedData);
         
         const updated = contracts.map(c => c.id === id ? {...c, status: 'Đã ký'} : c);
         setContracts(updated);
         setSelectedContract(null);
       } catch (error) {
         console.error("Failed to approve contract via API:", error);
       }
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-forest">Hợp đồng Mua bán với Khách hàng (B2B)</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo Mã HĐ, Tên đối tác..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black uppercase tracking-widest">
            <tr>
              <th className="p-4">Mã HĐ</th>
              <th className="p-4">Đối tác</th>
              <th className="p-4">Giá trị</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map(c => (
              <tr key={c.id} className="border-t border-slate-50 text-sm hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-forest">{c.contractNo || c.id}</td>
                <td className="p-4">{c.party}</td>
                <td className="p-4">{c.val || c.amount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                    c.status === 'Đang thực hiện' || c.status === 'signed' ? 'bg-blue-50 text-blue-600' :
                    c.status === 'Chờ duyệt' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-forest hover:text-mint" onClick={() => setSelectedContract(c)}><Eye size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedContract && (
          <ContractDetailView 
            contract={selectedContract} 
            onClose={() => setSelectedContract(null)}
            onAction={handleAction}
          />
      )}
    </div>
  );
}
