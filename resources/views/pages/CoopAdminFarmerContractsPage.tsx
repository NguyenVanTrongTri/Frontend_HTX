import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, User, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { contractService } from '../../services/contractService';

export default function CoopAdminFarmerContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Ket noi API
      try {
        const response = await contractService.getAllContracts();
        const apiContracts = Array.isArray(response) ? response : (response?.data || []);
        
        // Filter only individual contracts (farmer contracts)
        const farmerContracts = apiContracts.filter((c: any) => c.type === 'individual');
        
        setContracts(farmerContracts.map((c: any) => ({
          id: c.id,
          farmerName: c.seller?.name || c.farmerName || 'Nông dân',
          status: c.status === 'active' || c.status === 'completed' ? 'active' : 'pending',
          crop: c.cropName || 'Nông sản',
          date: c.createdAt || c.date
        })));
      } catch (error) {
        console.error("Failed to fetch farmer contracts:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-black text-forest">Hợp đồng Liên kết Sản xuất với Nông dân</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-xs uppercase">
              <th className="p-3">Mã HĐ</th>
              <th className="p-3">Nông dân</th>
              <th className="p-3">Cây trồng</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.id} className="border-t border-slate-50 text-sm">
                <td className="p-3 font-bold">{c.id}</td>
                <td className="p-3">{c.farmerName}</td>
                <td className="p-3">{c.crop}</td>
                <td className="p-3">{c.status === 'active' ? 'Đang hiệu lực' : 'Chờ xác nhận'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
