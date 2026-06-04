import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, FileText, Info, CheckCircle, Check, Building, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { PRODUCTS, COOPERATIVE_CONFIGS, COOPERATIVES } from '../../data';
import { motion, AnimatePresence } from 'motion/react';
import { contractService } from '../../services/contractService';
import authService from '../../services/authService';

interface InputFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  info?: string;
  required?: boolean;
  showInfo?: boolean;
  onToggleInfo?: () => void;
  type?: string;
  readOnly?: boolean;
  suffix?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  id,
  label, 
  value, 
  onChange, 
  placeholder, 
  info, 
  required, 
  showInfo, 
  onToggleInfo, 
  type = "text", 
  readOnly = false, 
  suffix = "" 
}) => {
  return (
    <div className="flex flex-col gap-1 relative">
      <div className="flex items-center gap-1 min-h-[20px]">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        {required && <span className="text-red-500 font-bold">*</span>}
        {info && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onToggleInfo?.(); }} className="text-slate-400 hover:text-[#004d40] inline-flex items-center justify-center p-0 m-0 border-0 h-4 w-4">
            <Info size={14} />
          </button>
        )}
      </div>
      {showInfo && info && (
        <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-15 mt-1 p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg w-72 text-xs leading-relaxed italic">
          {info}
        </div>
      )}
      <div className="relative">
        <input
          id={id}
          type={type === 'number' ? 'text' : type}
          inputMode={type === 'number' ? 'numeric' : undefined}
          readOnly={readOnly}
          value={value}
          onChange={(e) => {
            if (type === 'number') {
              onChange(e.target.value.replace(/[^0-9]/g, ''));
            } else {
              onChange(e.target.value);
            }
          }}
          placeholder={placeholder}
          className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none transition-all ${readOnly ? 'bg-slate-100 cursor-not-allowed' : ''}`}
        />
        {suffix && <span className="absolute right-4 top-3 text-sm text-slate-400 pointer-events-none">{suffix}</span>}
      </div>
    </div>
  );
};

export default function ContractInternalPage() {
  const navigate = useNavigate();
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedContract, setSavedContract] = useState<any>(null);
  
  // Track selected cooperative
  const [selectedCoopId, setSelectedCoopId] = useState('HTX-001');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  useEffect(() => {
    const handleClickOutside = () => setActiveInfo(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [contract, setContract] = useState<{
    date: string,
    location: string,
    product: { id: string, name: string, unit: string, quantity: string, price: string, note: string },
    totalInWords: string,
    paymentDate: string,
    paymentPhase1: string,
    paymentPhase2: string,
    paymentPhase3: string,
    agreedToPaymentPlan: boolean,
    paymentMethod: string,
    paymentType: string,
    deliveryTime: string,
    deliveryLocation: string,
    transportCostBy: string,
    loadingCostBy: string,
    buyerPenalty: string,
    sellerPenalty: string,
    qualityExemption: string,
    intermediaryAgency: string,
    warrantyProduct: string,
    warrantyDuration: string,
    usageGuideIncluded: boolean,
    penaltyPercentage: string,
    contractCopies: string,
    seller: { name: string, taxCode: string, address: string, rep: string, position: string, id: string, idDate: string, idPlace: string, phone: string, bankAcc: string, bankName: string, fax?: string },
    buyer: { name: string, taxCode: string, address: string, rep: string, position: string, id: string, idDate: string, idPlace: string, phone: string, bankAcc: string, bankName: string, fax?: string }
  }>({
    date: '',
    location: '',
    product: { id: '', name: '', unit: 'kg', quantity: '1000', price: '', note: '' },
    totalInWords: '',
    paymentDate: '',
    paymentPhase1: '30%',
    paymentPhase2: '70%',
    paymentPhase3: '',
    agreedToPaymentPlan: false,
    paymentMethod: 'Chuyển khoản (TMCP/Chuyển khoản ngân hàng)',
    paymentType: 'Thanh toán một cục dứt điểm',
    deliveryTime: 'Trong vòng 15 ngày lấy hàng',
    deliveryLocation: 'Giao tại kho Bên bán',
    transportCostBy: 'Bên Mua (Bên B) chịu',
    loadingCostBy: 'Bên bán (Bên A) chịu trách nhiệm bốc xếp xếp lên container tại bãi kho bên bán',
    buyerPenalty: '',
    sellerPenalty: '',
    qualityExemption: '',
    intermediaryAgency: '',
    warrantyProduct: '',
    warrantyDuration: '',
    usageGuideIncluded: true,
    penaltyPercentage: '8',
    contractCopies: '2',
    seller: { 
      name: '', 
      taxCode: '', 
      address: '', 
      rep: '', 
      position: 'Chủ Tịch Hợp Tác xã', 
      id: '', idDate: '', idPlace: '', 
      phone: '', 
      bankAcc: '', 
      bankName: '' 
    },
    buyer: { 
      name: '', 
      taxCode: '', 
      address: '', 
      rep: '', 
      position: 'Giám đốc/Đại diện Thẩm quyền', 
      id: '', idDate: '', idPlace: '', 
      phone: '', 
      bankAcc: '', 
      bankName: '' 
    }
  });

  // Keep date updated
  useEffect(() => {
    const fetchBuyerInfo = async () => {
      try {
        const response = await authService.me();
        const user = response?.data || response;
        if (user) {
          setContract(prev => ({
            ...prev,
            date: new Date().toLocaleDateString('vi-VN'),
            buyer: {
              ...prev.buyer,
              name: user.name || prev.buyer.name,
              taxCode: user.taxCode || prev.buyer.taxCode,
              address: user.address || prev.buyer.address,
              rep: user.name || prev.buyer.rep,
              phone: user.phone || prev.buyer.phone,
              bankAcc: user.bankAcc || prev.buyer.bankAcc,
              bankName: user.bankName || prev.buyer.bankName
            }
          }));
        }
      } catch (e) {
        console.error("Failed to fetch buyer info:", e);
      }
    };
    fetchBuyerInfo();
  }, []);

  // Update seller / products when selected Cooperative changes
  const handleCooperativeChange = (coopId: string) => {
    setSelectedCoopId(coopId);
    const selectedCoop = COOPERATIVES.find(c => c.id === coopId);
    const config = COOPERATIVE_CONFIGS[coopId];
    const province = config?.province || 'Lâm Đồng';

    // Auto find pre-existing project matching this coop ID from PRODUCTS
    const coopProducts = PRODUCTS.filter(p => p.cooperativeId === coopId);
    const defaultProd = coopProducts[0];

    const defaultProdName = defaultProd?.name || (config?.crops ? config.crops[0] : 'Nông sản');
    const defaultProdPrice = defaultProd?.price ? defaultProd.price.replace(/[^\d]/g, '') : '';
    const defaultProdUnit = defaultProd?.unit || 'kg';

    setContract(prev => ({
      ...prev,
      location: province,
      seller: {
        ...prev.seller,
        id: coopId,
        name: selectedCoop?.name || 'Hợp tác xã liên kết',
        address: `Khu phố 1, Thị trấn Liên Nghĩa, Huyện Đức Trọng, Tỉnh ${province}`,
        rep: 'Đại diện Hợp tác xã',
        position: 'Chủ tịch Hội đồng Quản trị',
        phone: '0988777666',
        bankAcc: '999988887777',
        bankName: `Agribank - Chi nhánh Tỉnh ${province}`
      },
      product: {
        ...prev.product,
        id: defaultProd?.id || `MẪU-${coopId}`,
        name: defaultProdName,
        price: defaultProdPrice,
        unit: defaultProdUnit
      }
    }));
  };

  const allCrops = Array.from(
    new Set(
      Object.values(COOPERATIVE_CONFIGS).flatMap(cfg => cfg.crops)
    )
  ).sort();

  const filteredCooperatives = COOPERATIVES.filter(c => {
    if (selectedCrop === 'all') return true;
    const config = COOPERATIVE_CONFIGS[c.id];
    return config?.crops?.includes(selectedCrop);
  });

  const handleCropFilterChange = (crop: string) => {
    setSelectedCrop(crop);
    
    const items = COOPERATIVES.filter(c => {
      if (crop === 'all') return true;
      const config = COOPERATIVE_CONFIGS[c.id];
      return config?.crops?.includes(crop);
    });

    if (items.length > 0) {
      const isStillAvailable = items.some(c => c.id === selectedCoopId);
      if (!isStillAvailable) {
        handleCooperativeChange(items[0].id);
      }
    }
  };

  const [contractNumber, setContractNumber] = useState(() => {
    const saved = localStorage.getItem('coop_contract_number_seq');
    return saved ? parseInt(saved, 10) : 11;
  });

  const currentYear = new Date().getFullYear();
  
  // CRITICAL: Includes Cooperative ID and ends with "HDLKTMHH" representing Hợp đồng liên kết thu mua hàng hóa!
  const formattedContractNumber = `${contractNumber.toString().padStart(2, '0')}/${selectedCoopId}/${currentYear}/HDLKTMHH`;

  const handleUpdate = (section: 'seller' | 'buyer', field: string, value: string) => {
    setContract(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleProductUpdate = (field: string, value: string) => {
    setContract(prev => ({
      ...prev,
      product: { ...prev.product, [field]: value }
    }));
  };

  const calculateTotal = () => {
    const q = parseFloat(contract.product.quantity) || 0;
    const p = parseFloat(contract.product.price) || 0;
    return q * p;
  };

  const handleSave = async () => {
    const qty = parseFloat(contract.product.quantity) || 5000;
    const priceVal = parseFloat(contract.product.price) || 0;
    const totalVal = qty * priceVal;

    const nextNumber = contractNumber + 1;
    setContractNumber(nextNumber);
    localStorage.setItem('coop_contract_number_seq', nextNumber.toString());

    const newContractId = `CT-COOP-${Math.floor(Math.random() * 900000 + 100000)}`;

    const newContractV2 = {
      id: newContractId,
      contractNo: formattedContractNumber,
      createdAt: new Date().toISOString(),
      status: 'pending_coop', // Sent to Coop for approval
      totalVal: totalVal,
      paidAmount: 0,
      type: 'individual', // Represents Hợp đồng Hợp tác xã
      
      // Parties
      seller: {
        id: contract.seller.id || selectedCoopId,
        name: contract.seller.name,
        taxCode: contract.seller.taxCode,
        address: contract.seller.address,
        rep: contract.seller.rep,
        position: contract.seller.position,
        phone: contract.seller.phone,
        bankAcc: contract.seller.bankAcc,
        bankName: contract.seller.bankName
      },
      buyer: {
        name: contract.buyer.name,
        taxCode: contract.buyer.taxCode,
        address: contract.buyer.address,
        rep: contract.buyer.rep,
        position: contract.buyer.position,
        phone: contract.buyer.phone,
        bankAcc: contract.buyer.bankAcc,
        bankName: contract.buyer.bankName
      },
      
      enterpriseName: contract.buyer.name,
      taxCode: contract.buyer.taxCode,
      coopName: contract.seller.name,
      cooperativeId: selectedCoopId,
      product: contract.product.id,
      cropName: contract.product.name,
      totalVolume: `${qty.toLocaleString('vi-VN')} ${contract.product.unit || 'kg'}`,
      unitPrice: `${priceVal.toLocaleString('vi-VN')} VND / ${contract.product.unit || 'kg'}`,
      
      // Payment details
      paymentMethod: contract.paymentMethod,
      paymentType: contract.paymentType,
      paymentPhase1: contract.paymentPhase1 || '30%',
      paymentPhase2: contract.paymentPhase2 || '70%',
      paymentPhase1Status: 'pending',
      paymentPhase2Status: 'pending',
      
      // Delivery & logistics
      deliveryTime: contract.deliveryTime || 'Trong vòng 15 ngày',
      deliveryLocation: contract.deliveryLocation,
      transportCostBy: contract.transportCostBy,
      loadingCostBy: contract.loadingCostBy,
      
      // Warranty & penalties
      penaltyPercentage: contract.penaltyPercentage || '8',
      contractCopies: contract.contractCopies || '2',
      warrantyProduct: contract.warrantyProduct || 'Không áp dụng',
      warrantyDuration: contract.warrantyDuration || '',
      usageGuideIncluded: contract.usageGuideIncluded,
      
      // Signatures
      sellerRep: contract.seller.rep,
      buyerRep: contract.buyer.rep
    };

    try {
      // Ket Noi API
      await contractService.createContract(newContractV2);
      
      // Still using localStorage for backward compatibility/immediate feedback in other pages
      // Save to vietagri_contracts_v2
      const rawV2 = localStorage.getItem('vietagri_contracts_v2');
      let contractsV2 = [];
      if (rawV2) {
        try {
          contractsV2 = JSON.parse(rawV2);
        } catch (e) {
          contractsV2 = [];
        }
      }
      contractsV2 = [newContractV2, ...contractsV2];
      localStorage.setItem('vietagri_contracts_v2', JSON.stringify(contractsV2));

      // Save to vietagri_contracts_v3 (Unified source)
      const rawV3 = localStorage.getItem('vietagri_contracts_v3');
      let contractsV3 = [];
      if (rawV3) {
        try {
          contractsV3 = JSON.parse(rawV3);
        } catch (e) {
          contractsV3 = [];
        }
      }
      contractsV3 = [newContractV2, ...contractsV3];
      localStorage.setItem('vietagri_contracts_v3', JSON.stringify(contractsV3));

      // Save to simple lists (vietagri_contracts)
      const newContractSimple = {
        id: newContractId,
        contractNo: formattedContractNumber,
        party: contract.seller.name,
        qty: `${qty.toLocaleString('vi-VN')} ${contract.product.unit || 'kg'} ${contract.product.name}`,
        status: 'Chờ HTX duyệt',
        val: `${(totalVal / 1000000).toFixed(1)}M`,
        type: 'individual',
        cooperativeId: selectedCoopId,
        date: contract.date
      };

      const rawSimple = localStorage.getItem('vietagri_contracts');
      let contractsSimple = [];
      if (rawSimple) {
        try {
          contractsSimple = JSON.parse(rawSimple);
        } catch (e) {
          contractsSimple = [];
        }
      }
      contractsSimple = [newContractSimple, ...contractsSimple];
      localStorage.setItem('vietagri_contracts', JSON.stringify(contractsSimple));

      // Show beautiful success overlay
      setSavedContract(newContractV2);
      setShowSuccessModal(true);
    } catch (e) {
      console.error("Failed to save contract via API:", e);
      alert("Lỗi khi kết nối API! Vui lòng thử lại sau.");
    }
  };

  // Pre-load current selected cooperative default products
  const currentCoopProducts = PRODUCTS.filter(p => p.cooperativeId === selectedCoopId);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 pb-24">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/super-admin')}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-[#004d40] transition-colors font-bold"
        >
          <ChevronLeft size={20} /> Quay lại Tổng bộ Quản trị
        </button>

        {/* Global Select Cooperative Panel for Super-Admin */}
        <section className="mb-8 bg-white border border-emerald-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                VietAgri Super Admin Panel
              </span>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Cấu hình Hợp đồng Hợp tác xã Liên kết</h2>
              <p className="text-xs text-slate-500 font-medium font-sans">Chọn Hợp tác xã thành viên để hệ thống tự động điền các thông tin đại diện pháp lý và sản phẩm liên kết thu mua.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-[650px]">
              <div className="flex-1">
                <label className="text-xs font-black text-emerald-800 uppercase tracking-widest block mb-2">Loại nông sản</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => handleCropFilterChange(e.target.value)}
                  className="w-full border border-emerald-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none shadow-sm cursor-pointer"
                >
                  <option value="all">Tất cả loại nông sản</option>
                  {allCrops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="text-xs font-black text-emerald-800 uppercase tracking-widest block mb-2">Lựa chọn Hợp tác xã</label>
                <select
                  value={selectedCoopId}
                  onChange={(e) => handleCooperativeChange(e.target.value)}
                  className="w-full border border-emerald-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none shadow-sm cursor-pointer"
                >
                  {filteredCooperatives.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                  {filteredCooperatives.length === 0 && (
                    <option value="">Không có hợp tác xã phù hợp</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Main Editing Form Code */}
        <form className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12 space-y-8">
            <div className="text-center mb-10">
              <h1 className="text-xl font-black uppercase text-[#004d40] tracking-tight">HỢP ĐỒNG LIÊN KẾT THU MUA HÀNG HÓA</h1>
              <p className="text-sm font-bold text-slate-400 mt-2">Số điện tử: {formattedContractNumber}</p>
            </div>

            {/* Section: Common Info */}
            <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h2 className="text-xs font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
                <FileText size={16} /> Thông tin lưu trữ chung
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField readOnly label="Ngày ký số" value={contract.date} onChange={(val: any) => setContract({...contract, date: val})} showInfo={activeInfo === 'date'} onToggleInfo={() => setActiveInfo(activeInfo === 'date' ? null : 'date')} />
                <InputField readOnly label="Tại (Tỉnh/Thành)" value={contract.location} onChange={(val: any) => setContract({...contract, location: val})} showInfo={activeInfo === 'location'} onToggleInfo={() => setActiveInfo(activeInfo === 'location' ? null : 'location')} />
              </div>
            </section>

            {/* Section: Parties */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Bên Bán (Cooperative) */}
              <section className="p-6 border border-slate-200 rounded-2xl relative">
                <h2 className="text-sm font-black uppercase text-[#004d40] mb-6 flex items-center justify-between">
                  <span>BÊN BÁN (BÊN A)</span>
                  <span className="text-[10px] bg-emerald-50 text-[#004d40] px-2 py-0.5 rounded uppercase font-black tracking-widest">{selectedCoopId}</span>
                </h2>
                <div className="space-y-4">
                  <InputField required label="Tên hợp tác xã" info="Tên đầy đủ của Hợp tác xã thành viên." value={contract.seller.name} onChange={(v: string) => handleUpdate('seller', 'name', v)} showInfo={activeInfo === 'seller.name'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.name' ? null : 'seller.name')} />
                  <InputField type="number" required label="Mã số doanh nghiệp/Mã số thuế" info="MST của Hợp tác xã" value={contract.seller.taxCode} onChange={(v: string) => handleUpdate('seller', 'taxCode', v)} showInfo={activeInfo === 'seller.taxCode'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.taxCode' ? null : 'seller.taxCode')} />
                  <InputField required label="Địa chỉ trụ sở chính" info="Văn phòng chính đặt tại vùng trồng." value={contract.seller.address} onChange={(v: string) => handleUpdate('seller', 'address', v)} showInfo={activeInfo === 'seller.address'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.address' ? null : 'seller.address')} />
                  <div className="grid grid-cols-2 gap-4">
                      <InputField required label="Người đại diện" info="Họ và tên người đại diện pháp luật của HTX." value={contract.seller.rep} onChange={(v: string) => handleUpdate('seller', 'rep', v)} showInfo={activeInfo === 'seller.rep'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.rep' ? null : 'seller.rep')} />
                      <InputField required label="Chức danh" info="Chức danh đại diện." value={contract.seller.position} onChange={(v: string) => handleUpdate('seller', 'position', v)} showInfo={activeInfo === 'seller.position'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.position' ? null : 'seller.position')} />
                  </div>
                  <InputField type="number" required label="Số điện thoại liên hệ" value={contract.seller.phone} onChange={(v: string) => handleUpdate('seller', 'phone', v)} showInfo={activeInfo === 'seller.phone'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.phone' ? null : 'seller.phone')} />
                  <div className="grid grid-cols-2 gap-4">
                      <InputField type="number" required label="Tài khoản ngân hàng" value={contract.seller.bankAcc} onChange={(v: string) => handleUpdate('seller', 'bankAcc', v)} showInfo={activeInfo === 'seller.bankAcc'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.bankAcc' ? null : 'seller.bankAcc')} />
                      <InputField required label="Mở tại Ngân hàng" value={contract.seller.bankName} onChange={(v: string) => handleUpdate('seller', 'bankName', v)} showInfo={activeInfo === 'seller.bankName'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.bankName' ? null : 'seller.bankName')} />
                  </div>
                </div>
              </section>

              {/* Bên Mua (Super Admin/VietAgri Platform HQ) */}
              <section className="p-6 border border-slate-200 rounded-2xl">
                <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Bên Mua (Bên B)</h2>
                <div className="space-y-4">
                  <InputField required label="Hệ thống đứng tên" info="Bên đứng tên mua liên kết đại diện." value={contract.buyer.name} onChange={(v: string) => handleUpdate('buyer', 'name', v)} showInfo={activeInfo === 'buyer.name'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.name' ? null : 'buyer.name')} />
                  <InputField type="number" required label="Mã số thuế" value={contract.buyer.taxCode} onChange={(v: string) => handleUpdate('buyer', 'taxCode', v)} showInfo={activeInfo === 'buyer.taxCode'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.taxCode' ? null : 'buyer.taxCode')} />
                  <InputField required label="Địa chỉ đặt văn phòng" value={contract.buyer.address} onChange={(v: string) => handleUpdate('buyer', 'address', v)} showInfo={activeInfo === 'buyer.address'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.address' ? null : 'buyer.address')} />
                  <div className="grid grid-cols-2 gap-4">
                      <InputField required label="Người đại diện" value={contract.buyer.rep} onChange={(v: string) => handleUpdate('buyer', 'rep', v)} showInfo={activeInfo === 'buyer.rep'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.rep' ? null : 'buyer.rep')} />
                      <InputField required label="Chức danh" value={contract.buyer.position} onChange={(v: string) => handleUpdate('buyer', 'position', v)} showInfo={activeInfo === 'buyer.position'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.position' ? null : 'buyer.position')} />
                  </div>
                  <InputField type="number" required label="Số điện thoại tổng ban" value={contract.buyer.phone} onChange={(v: string) => handleUpdate('buyer', 'phone', v)} showInfo={activeInfo === 'buyer.phone'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.phone' ? null : 'buyer.phone')} />
                  <div className="grid grid-cols-2 gap-4">
                      <InputField type="number" required label="Số tài khoản ngân hàng" value={contract.buyer.bankAcc} onChange={(v: string) => handleUpdate('buyer', 'bankAcc', v)} showInfo={activeInfo === 'buyer.bankAcc'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.bankAcc' ? null : 'buyer.bankAcc')} />
                      <InputField required label="Tại ngân hàng" value={contract.buyer.bankName} onChange={(v: string) => handleUpdate('buyer', 'bankName', v)} showInfo={activeInfo === 'buyer.bankName'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.bankName' ? null : 'buyer.bankName')} />
                  </div>
                </div>
              </section>
            </div>

            {/* Section: Items / Products */}
            <section className="p-6 border border-slate-200 rounded-2xl mt-8">
              <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Thông tin nông sản liên kết thu mua</h2>
              
              {/* Quick pre-select product of this coop if available */}
              {currentCoopProducts.length > 0 && (
                <div className="mb-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest block">Sử dụng biểu mẫu sản phẩm của {COOPERATIVES.find(c => c.id === selectedCoopId)?.name}</span>
                  <div className="flex flex-wrap gap-2">
                    {currentCoopProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setContract(prev => ({
                            ...prev,
                            product: {
                              ...prev.product,
                              id: p.id,
                              name: p.name,
                              price: p.price.replace(/[^\d]/g, ''),
                              unit: p.unit
                            }
                          }));
                        }}
                        className={`text-xs px-3.5 py-1.5 rounded-xl border font-bold transition-all ${
                          contract.product.id === p.id 
                            ? 'bg-[#004d40] text-white border-[#004d40]' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <InputField required label="Mã danh phẩm" info="Mã số của mặt hàng nông sản trên hệ thống." value={contract.product.id} onChange={(v: string) => handleProductUpdate('id', v)} />
                    <InputField required label="Tên loại nông sản" info="Tên nông sản thu hoạch liên kết." value={contract.product.name} onChange={(v: string) => handleProductUpdate('name', v)} />
                    <InputField required label="Đơn vị cung tiêu" placeholder="Ví dụ: kg, tấn..." value={contract.product.unit} onChange={(v: string) => handleProductUpdate('unit', v)} />
                    <InputField type="number" required label="Sản lượng bao tiêu" info="Tổng sản lượng cam kết mua." value={contract.product.quantity} onChange={(v: string) => handleProductUpdate('quantity', v)} />
                    <InputField type="number" required label="Đơn giá" info="Mức giá thỏa thuận dựa trên phân cấp." value={contract.product.price} onChange={(v: string) => handleProductUpdate('price', v)} suffix="VND" />
                    <div className="flex flex-col gap-1 relative">
                      <div className="flex items-center gap-1 min-h-[20px]">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ước tính thành tiền</label>
                      </div>
                      <div className="relative">
                        <input 
                          readOnly 
                          value={calculateTotal().toLocaleString('vi-VN') + " VND"} 
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-100 font-bold text-slate-800 cursor-not-allowed outline-none" 
                        />
                      </div>
                    </div>
              </div>
              <div className="mt-4">
                  <InputField label="Yêu cầu quy cách đóng gói và bảo quản" info="Các tiêu chuẩn về đóng thùng hoặc xuất biên." value={contract.product.note} onChange={(v: string) => handleProductUpdate('note', v)} placeholder="Ví dụ: Đóng thùng gỗ lót rơm, bảo quản lạnh tối ưu..." />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                  <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 min-h-[20px]">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng giá trị hợp đồng</label>
                      </div>
                      <input readOnly value={calculateTotal().toLocaleString('vi-VN') + " VND"} className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-emerald-50 text-[#004d40] font-black outline-none" />
                  </div>
                  <InputField 
                      label="Bằng chữ (VNĐ)" 
                      info="Nhập chi tiết văn bản tổng hợp giá trị." 
                      value={contract.totalInWords} 
                      onChange={(v: string) => {
                          let formatted = v.replace(/[^A-Za-zÀ-Ỹà-ỹ\s]/g, '');
                          if (formatted.length > 0) {
                              formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
                          }
                          setContract(prev => ({ ...prev, totalInWords: formatted }));
                      }} 
                  />
              </div>
            </section>

            {/* Section: Payments */}
            <section className="p-6 border border-slate-200 rounded-2xl mt-8">
              <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Thời hạn & Hình thức thanh toán</h2>
              <div className="space-y-4">
                  <div className="flex flex-col gap-1 relative">
                      <div className="flex items-center gap-1 min-h-[20px]">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chế độ thanh toán lý thuyết</label>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'paymentType' ? null : 'paymentType'); }} className="text-slate-400 hover:text-[#004d40] inline-flex items-center justify-center p-0 m-0 border-0 h-4 w-4">
                              <Info size={14} />
                          </button>
                      </div>
                      {activeInfo === 'paymentType' && (
                          <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-15 mt-1 p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg w-72 text-xs leading-relaxed italic">
                              Thiết lập cách chia tiến độ rủi ro giữa ngân sách nền tảng và dòng vốn hợp tác xã.
                          </div>
                      )}
                      <select value={contract.paymentType} onChange={(e) => setContract(prev => ({ ...prev, paymentType: e.target.value, paymentDate: '', paymentPhase1: '30%', paymentPhase2: '70%', paymentPhase3: '' }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                          <option value="Thanh toán một cục cố định">Thanh toán một cục cố định</option>
                          <option value="Thanh toán theo tiến độ (Đặt cọc)">Thanh toán theo tiến độ (Đặt cọc)</option>
                          <option value="Thanh toán gối đầu">Thanh toán gối đầu</option>
                      </select>
                  </div>
                  {(() => {
                      const type = contract.paymentType;
                      
                      if (type === 'Thanh toán theo tiến độ (Đặt cọc)') {
                          return (
                            <div className="grid grid-cols-3 gap-4">
                              <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1 min-h-[20px]">
                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đợt 1 (Đặt cọc trước)</label>
                                  </div>
                                  <select disabled={contract.agreedToPaymentPlan} value={contract.paymentPhase1 || '30%'} onChange={(e) => {
                                      const val = e.target.value;
                                      const defaultPhase2 = val === '20%' ? '80%' : '70%'; 
                                      setContract(prev => ({ ...prev, paymentPhase1: val, paymentPhase2: defaultPhase2, paymentPhase3: '' }));
                                  }} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none disabled:bg-slate-100 disabled:cursor-not-allowed">
                                      <option value="20%">20%</option>
                                      <option value="30%">30%</option>
                                  </select>
                                  <label className="flex items-center gap-2 mt-1 cursor-pointer">
                                      <input
                                          type="checkbox"
                                          checked={contract.agreedToPaymentPlan}
                                          onChange={(e) => setContract(prev => ({ ...prev, agreedToPaymentPlan: e.target.checked }))}
                                          className="w-4 h-4 rounded border-slate-300 text-[#004d40] focus:ring-[#004d40]"
                                      />
                                      <span className="text-[10px] text-slate-600">Xác thực mốc giải ngân</span>
                                  </label>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1 min-h-[20px]">
                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đợt 2 (Bàn giao)</label>
                                  </div>
                                  <select disabled={contract.agreedToPaymentPlan} value={contract.paymentPhase2} onChange={(e) => setContract(prev => ({ ...prev, paymentPhase2: e.target.value, paymentPhase3: '' }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none disabled:bg-slate-100 disabled:cursor-not-allowed">
                                      {contract.paymentPhase1 === '20%' ? (
                                          <>
                                              <option value="80%">80%</option>
                                              <option value="70%">70%</option>
                                          </>
                                      ) : (
                                          <>
                                              <option value="70%">70%</option>
                                              <option value="60%">60%</option>
                                          </>
                                      )}
                                  </select>
                              </div>
                              <InputField readOnly label="Đợt 3 (Quyết toán)" placeholder="Còn lại..." value={(parseInt(contract.paymentPhase1 || '0') + parseInt(contract.paymentPhase2 || '0')) === 100 ? 'Không có' : '10%'} onChange={(v: string) => setContract(prev => ({ ...prev, paymentPhase3: v }))} showInfo={activeInfo === 'paymentPhase3'} onToggleInfo={() => setActiveInfo(activeInfo === 'paymentPhase3' ? null : 'paymentPhase3')} />
                            </div>
                          );
                      }
                      
                      if (type === 'Thanh toán một cục cố định') {
                          return (
                  <div className="flex flex-col gap-1 relative">
                      <div className="flex items-center gap-1 min-h-[20px]">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chốt lịch thanh toán cố định</label>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'paymentDate' ? null : 'paymentDate'); }} className="text-slate-400 hover:text-[#004d40] inline-flex items-center justify-center p-0 m-0 border-0 h-4 w-4">
                              <Info size={14} />
                          </button>
                      </div>
                      {activeInfo === 'paymentDate' && (
                          <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-15 mt-1 p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg w-72 text-xs leading-relaxed italic">
                              Bên mua cam kết thanh toán đầy đủ 100% hóa đơn cho HTX vào mốc thời gian quy định định kỳ hàng tháng.
                          </div>
                      )}
                      <select value={contract.paymentDate} onChange={(e) => setContract(prev => ({ ...prev, paymentDate: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                          <option value="1">Ngày 01 hàng tháng</option>
                          <option value="5">Ngày 05 hàng tháng</option>
                          <option value="10">Ngày 10 hàng tháng</option>
                          <option value="20">Ngày 20 hàng tháng</option>
                      </select>
                  </div>
                          );
                      } else if (type === 'Thanh toán gối đầu') {
                          return (
                              <div className="flex flex-col gap-2 relative">
                                  <div className="flex items-center gap-1 min-h-[20px]">
                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chu kỳ quay vòng gối đầu</label>
                                      <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'paymentDate' ? null : 'paymentDate'); }} className="text-slate-400 hover:text-[#004d40] inline-flex items-center justify-center p-0 m-0 border-0 h-4 w-4">
                                          <Info size={14} />
                                      </button>
                                  </div>
                                  {activeInfo === 'paymentDate' && (
                                      <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-15 mt-1 p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg w-72 text-xs leading-relaxed italic">
                                          Thời hạn chậm trả cho phép sau khi kết toán sản lượng đối soát.
                                      </div>
                                  )}
                                  <div className="flex gap-4">
                                      {['10 ngày', '20 ngày', '30 ngày'].map(option => (
                                          <label key={option} className="flex items-center gap-2 cursor-pointer">
                                              <input
                                                  type="radio"
                                                  name="paymentDate"
                                                  value={option}
                                                  checked={contract.paymentDate === option}
                                                  onChange={(e) => setContract(prev => ({ ...prev, paymentDate: e.target.value }))}
                                                  className="w-4 h-4 text-[#004d40] border-slate-300 focus:ring-[#004d40]"
                                              />
                                              <span className="text-sm text-slate-700">{option}</span>
                                          </label>
                                      ))}
                                  </div>
                              </div>
                          );
                      }
                      return null;
                  })()}
                  
                  <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hình thức chuyển tiền giải ngân</label>
                      <select value={contract.paymentMethod} onChange={(e) => setContract(prev => ({ ...prev, paymentMethod: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                          <option value="Chuyển khoản (TMCP/Chuyển khoản ngân hàng)">Chuyển khoản liên ngân hàng 24/7</option>
                          <option value="Tiền mặt">Lập phiếu Chi tiền mặt hội sở</option>
                      </select>
                  </div>
              </div>
            </section>

            {/* Section: Delivery / Logistics */}
            <section className="p-6 border border-slate-200 rounded-2xl mt-8">
              <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Quy chuẩn thời gian & địa điểm bốc dỡ hàng</h2>
              <div className="space-y-4">
                  <InputField label="Hạn giao hàng kể từ lúc chốt lệnh" placeholder="Ví dụ: Trong vòng 15 ngày..." value={contract.deliveryTime} onChange={(v: string) => setContract(prev => ({ ...prev, deliveryTime: v }))} showInfo={activeInfo === 'deliveryTime'} onToggleInfo={() => setActiveInfo(activeInfo === 'deliveryTime' ? null : 'deliveryTime')} info="Khung thời hạn tối đa Hợp tác xã bắt buộc phải chuẩn bị đủ hàng tại kho sấy." />
                  
                  <div className="flex flex-col gap-1 relative">
                      <div className="flex items-center gap-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tọa độ/Địa bàn hoàn tất giao nhận</label>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'deliveryLocation' ? null : 'deliveryLocation'); }} className="text-slate-400 hover:text-[#004d40]">
                              <Info size={14} />
                          </button>
                      </div>
                      {activeInfo === 'deliveryLocation' && (
                          <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-15 mt-1 p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg w-72 text-xs leading-relaxed italic">
                              Bàn giao tại dốc cầu tải hoặc tổng kho do bên nào bố trí.
                          </div>
                      )}
                      <select value={contract.deliveryLocation} onChange={(e) => setContract(prev => ({ ...prev, deliveryLocation: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                          <option value="Giao tại kho Bên bán (HTX)">Giao tại kho sấy/văn phòng của Hợp tác xã (Bên Bán)</option>
                          <option value="Giao tại kho Bên mua (Việt Agri)">Giao trực tiếp về kho phân phối/thương cảng của VietAgri (Bên Mua)</option>
                      </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 relative">
                          <div className="flex items-center gap-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đầu mối chịu phí xe tải</label>
                              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'transportCostBy' ? null : 'transportCostBy'); }} className="text-slate-400 hover:text-[#004d40]">
                                  <Info size={14} />
                              </button>
                          </div>
                          {activeInfo === 'transportCostBy' && (
                              <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-15 mt-1 p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg w-72 text-xs leading-relaxed italic">
                                  Bên thanh toán tiền cước xe tải đường dài.
                              </div>
                          )}
                          <select value={contract.transportCostBy} onChange={(e) => setContract(prev => ({ ...prev, transportCostBy: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                              <option value="Bên Mua chịu">Bên Mua (VietAgri) chịu chi phí vận chuyển</option>
                              <option value="Bên Bán chịu">Bên Bán (Hợp tác xã) chịu chi phí vận chuyển</option>
                          </select>
                      </div>
                      <div className="flex flex-col gap-1 relative">
                          <div className="flex items-center gap-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chi phí nhân công bốc xếp</label>
                              <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'loadingCostBy' ? null : 'loadingCostBy'); }} className="text-slate-400 hover:text-[#004d40]">
                                  <Info size={14} />
                              </button>
                          </div>
                          {activeInfo === 'loadingCostBy' && (
                              <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-15 mt-1 p-3 bg-slate-900 border border-slate-800 text-white rounded-xl shadow-lg w-72 text-xs leading-relaxed italic">
                                  Quy định tiền công bốc dỡ hàng hai đầu gác tải hoặc kho bãi.
                              </div>
                          )}
                          <select value={contract.loadingCostBy} onChange={(e) => setContract(prev => ({ ...prev, loadingCostBy: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                              <option value="Mỗi bên chịu một đầu">Mỗi bên chịu một đầu (Bên bán bốc lên, bên mua dỡ xuống)</option>
                              <option value="Bên B chịu toàn bộ">Bên B (Bên Mua) chịu chi phí bốc dỡ toàn bộ</option>
                          </select>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <InputField 
                          label="Mức phạt chậm bốc dỡ hàng" 
                          placeholder="Phạt Bên mua..." 
                          value={contract.buyerPenalty} 
                          onChange={(v: string) => setContract(prev => ({ ...prev, buyerPenalty: v }))} 
                          showInfo={activeInfo === 'buyerPenalty'} 
                          onToggleInfo={() => setActiveInfo(activeInfo === 'buyerPenalty' ? null : 'buyerPenalty')} 
                          suffix="đồng/ngày"
                          info="Lưu kho phạt nếu điều xe trễ sau hẹn gác tải."
                      />
                      <InputField 
                          label="Phạt Bên bán chậm bốc hàng" 
                          placeholder="Phạt Bên bán..." 
                          value={contract.sellerPenalty} 
                          onChange={(v: string) => setContract(prev => ({ ...prev, sellerPenalty: v }))} 
                          showInfo={activeInfo === 'sellerPenalty'} 
                          onToggleInfo={() => setActiveInfo(activeInfo === 'sellerPenalty' ? null : 'sellerPenalty')} 
                          suffix="đồng/ngày"
                          info="Trường hợp gác dực xe nhưng HTX không kịp gom đủ tải hàng."
                      />
                  </div>
              </div>
            </section>

            {/* Section: Penalty Percentage */}
            <section className="p-6 border border-slate-200 rounded-2xl mt-8">
              <h2 className="text-sm font-black text-emerald-900 uppercase tracking-wider mb-4">MỨC PHẠT VI PHẠM THỎA THUẬN</h2>
              <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">KhUNG PHẠT THEO LUẬT THƯƠNG MẠI</label>
                      <div className="text-sm text-slate-700 p-4 bg-slate-100 rounded-xl font-bold text-emerald-800">8.0% giá trị hợp đồng</div>
                      <p className="text-[10px] text-slate-500 italic mt-1 leading-relaxed">
                        Theo Hiệu Lập Điều 301 Luật Thương mại, mức bồi thường vi phạm hợp tác chỉ tối đa 8.0% để đảm bảo cân bằng rủi ro quốc gia và quyền tự chủ của Hợp tác xã liên kết.
                      </p>
                  </div>
              </div>
            </section>

            {/* Actions */}
            <div className="mt-10 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate('/super-admin')}
                className="px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold uppercase text-xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={handleSave}
                className="flex items-center gap-3 bg-[#004d40] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-[#00332c] transition-all shadow-xl shadow-slate-200 cursor-pointer"
              >
                <Save size={20} /> KÝ DUYỆT & KHỞI TẠO HỢP ĐỒNG HTX
              </button>
            </div>
          </form>
      </div>

      {/* Stunning Interactive Saving Success Modal */}
      <AnimatePresence>
        {showSuccessModal && savedContract && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white max-w-lg w-full rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 text-center space-y-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#004d40] shrink-0 shadow-inner">
                <Check size={36} className="stroke-[3]" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ký kết thành công!</h2>
                <p className="text-sm text-slate-500 font-medium font-sans">Thỏa thuận bao tiêu liên kết với Hợp tác xã thành viên đã được phê chuẩn trực tuyến và ghi nhận lên hệ thống.</p>
              </div>

              {/* Mini contract detail badge */}
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5 text-left font-sans text-xs font-bold text-slate-500">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><Building size={14} /> HỢP TÁC XÃ (BÁN):</span>
                  <span className="text-[#004d40] font-black">{savedContract.coopName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} /> LIÊN PHẦN (MUA):</span>
                  <span className="text-slate-800 font-black">VietAgri Core Admin</span>
                </div>
                <div className="flex justify-between items-center font-sans">
                  <span className="flex items-center gap-1.5"><FileText size={14} /> SỐ VĂN BẢN:</span>
                  <span className="text-[#004d40] font-mono font-black">{savedContract.contractNo}</span>
                </div>
                <div className="flex justify-between items-center font-sans">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> TRẠNG THÁI HIỆU LỰC:</span>
                  <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">Đang thực hiện (Đã ký)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/super-admin');
                  }}
                  className="w-full py-4 bg-[#004d40] hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-900/10 font-sans cursor-pointer"
                >
                  Trở lại Quản lý Hợp đồng Toàn hệ thống
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
