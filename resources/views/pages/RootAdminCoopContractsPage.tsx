import React, { useState, useEffect } from 'react';
import { Building2, Search } from 'lucide-react';
import { contractService } from '../../services/contractService';

export default function RootAdminCoopContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Ket noi API
      try {
        const response = await contractService.getAllContracts();
        const apiContracts = Array.isArray(response) ? response : (response?.data || []);
        
        // Filter only B2B contracts (coop contracts)
        const coopContracts = apiContracts.filter((c: any) => c.type === 'b2b');
        
        setContracts(coopContracts.map((c: any) => ({
          id: c.id,
          coopName: c.coopName || c.seller?.name || 'Hợp tác xã',
          status: c.status === 'active' || c.status === 'signed' || c.status === 'completed' ? 'active' : 'draft',
          volume: c.totalVolume || c.volume || '0 Tấn',
          date: c.createdAt || c.date
        })));
      } catch (error) {
        console.error("Failed to fetch coop contracts:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-black text-forest">Hợp đồng Mua bán với HTX</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-xs uppercase">
              <th className="p-3">Mã HĐ</th>
              <th className="p-3">HTX</th>
              <th className="p-3">Sản lượng</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.id} className="border-t border-slate-50 text-sm">
                <td className="p-3 font-bold">{c.id}</td>
                <td className="p-3">{c.coopName}</td>
                <td className="p-3">{c.volume}</td>
                <td className="p-3">{c.status === 'active' ? 'Đang hiệu lực' : 'Nháp'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
