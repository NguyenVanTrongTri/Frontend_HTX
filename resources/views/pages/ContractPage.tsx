import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, FileText, Info, CheckCircle, Check, Building, Clock, ShieldCheck } from 'lucide-react';
import { PRODUCTS, COOPERATIVE_CONFIGS, COOPERATIVES } from '../../data';
import { motion, AnimatePresence } from 'motion/react';

const InputField = ({ label, value, onChange, placeholder, info, required, showInfo, onToggleInfo, type = "text", readOnly = false, suffix = "" }: any) => {
  return (
    <div className="flex flex-col gap-1 relative">
      <div className="flex items-center gap-1">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        {required && <span className="text-red-500 font-bold">*</span>}
        {info && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onToggleInfo && onToggleInfo(); }} className="text-slate-400 hover:text-[#004d40]">
            <Info size={14} />
          </button>
        )}
      </div>
      {showInfo && info && (
        <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-10 mt-1 p-3 bg-white border border-slate-200 rounded-xl shadow-lg w-72 text-xs text-slate-600 leading-relaxed italic">
          {info}
        </div>
      )}
      <div className="relative">
        <input
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

export default function ContractPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedContract, setSavedContract] = useState<any>(null);

  React.useEffect(() => {
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
    seller: { name: string, taxCode: string, address: string, rep: string, position: string, id: string, idDate: string, idPlace: string, phone: string, bankAcc: string, bankName: string },
    buyer: { name: string, taxCode: string, address: string, rep: string, position: string, id: string, idDate: string, idPlace: string, phone: string, bankAcc: string, bankName: string }
  }>({
    date: '',
    location: '',
    product: { id: '', name: '', unit: '', quantity: '', price: '', note: '' },
    totalInWords: '',
    paymentDate: '',
    paymentPhase1: '30%',
    paymentPhase2: '70%',
    paymentPhase3: '',
    agreedToPaymentPlan: false,
    paymentMethod: 'Chuyển khoản (TMCP/Chuyển khoản ngân hàng)',
    paymentType: 'Thanh toán một cục cố định',
    deliveryTime: '',
    deliveryLocation: 'Giao tại kho Bên bán',
    transportCostBy: 'Bên Mua',
    loadingCostBy: 'Mỗi bên chịu một đầu',
    buyerPenalty: '',
    sellerPenalty: '',
    qualityExemption: '',
    intermediaryAgency: '',
    warrantyProduct: '',
    warrantyDuration: '',
    usageGuideIncluded: false,
    penaltyPercentage: '8',
    contractCopies: '2',
    seller: { 
      name: 'Hợp tác xã Nông nghiệp Sạch Long An', 
      taxCode: '1234567890', 
      address: '123 Đường Số 1, Huyện Tân Thạnh, Long An', 
      rep: 'Nguyễn Văn A', 
      position: 'Chủ tịch HĐQT', 
      id: '', idDate: '', idPlace: '', 
      phone: '0901234567', 
      bankAcc: '1234567890123', 
      bankName: 'Agribank - Chi nhánh Tân Thạnh' 
    },
    buyer: { name: '', taxCode: '', address: '', rep: '', position: '', id: '', idDate: '', idPlace: '', phone: '', bankAcc: '', bankName: '' }
  });

  useEffect(() => {
    // 1. Check dynamic sale posts from localStorage first!
    const rawPosts = localStorage.getItem('vietagri_sale_posts');
    let salePosts: any[] = [];
    if (rawPosts) {
      try {
        salePosts = JSON.parse(rawPosts);
      } catch (e) {
        salePosts = [];
      }
    }
    
    const foundPost = salePosts.find((p: any) => String(p.id) === String(productId));
    const finalProduct = foundPost ? {
      id: foundPost.id,
      name: foundPost.title || foundPost.baseProduct || 'Nông sản',
      cooperativeId: foundPost.cooperativeId || 'HTX-001',
      price: foundPost.price || '0',
      unit: 'kg'
    } : PRODUCTS.find(p => String(p.id) === String(productId));

    const cooperativeId = finalProduct?.cooperativeId || 'HTX-001';
    const config = cooperativeId ? COOPERATIVE_CONFIGS[cooperativeId] : null;
    const province = config?.province || 'Lâm Đồng';

    const date = new Date().toLocaleDateString('vi-VN');

    // Find custom user from local storage
    const savedUser = localStorage.getItem('current_user') || localStorage.getItem('vietagri_current_user');
    let currentUser: any = null;
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        currentUser = null;
      }
    }

    // Default buyer info from logged in partner or mock values
    const defaultBuyerName = currentUser?.name || 'Công ty TNHH Xuất Nhập Khẩu VinaFruit';
    const defaultTaxCode = currentUser?.taxCode || '0312345678';
    const defaultAddress = currentUser?.address || '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh';
    const defaultRep = currentUser?.representative || currentUser?.name || 'Trần Văn Bảo';
    const defaultPhone = currentUser?.phone || '0912345678';

    const selectedCoop = COOPERATIVES.find(c => c.id === cooperativeId);

    setContract(prev => ({
      ...prev,
      date,
      location: province,
      seller: {
        ...prev.seller,
        id: cooperativeId || 'HTX-001',
        name: selectedCoop?.name || 'Hợp tác xã Nông nghiệp Sạch Cầu Đất',
        address: prev.seller.address && prev.seller.address !== '123 Đường Số 1, Huyện Tân Thạnh, Long An' ? prev.seller.address : `Khu phố 1, Thị trấn Liên Nghĩa, Huyện Đức Trọng, Tỉnh ${province}`,
        rep: prev.seller.rep && prev.seller.rep !== 'Nguyễn Văn A' ? prev.seller.rep : 'Nguyễn Văn Hợp',
        position: 'Chủ Tịch Hợp Tác xã',
        phone: '0988777666',
        bankAcc: '999988887777',
        bankName: `Agribank - Chi nhánh Tỉnh ${province}`
      },
      buyer: {
        ...prev.buyer,
        name: prev.buyer.name || defaultBuyerName,
        taxCode: prev.buyer.taxCode || defaultTaxCode,
        address: prev.buyer.address || defaultAddress,
        rep: prev.buyer.rep || defaultRep,
        position: prev.buyer.position || 'Giám đốc mua hàng',
        phone: prev.buyer.phone || defaultPhone,
        bankAcc: prev.buyer.bankAcc || '1029384756',
        bankName: prev.buyer.bankName || 'Vietcombank - Chi nhánh Nam Sài Gòn'
      },
      product: {
        id: finalProduct ? String(finalProduct.id) : '',
        name: finalProduct?.name || '',
        unit: 'kg',
        quantity: prev.product.quantity || '5000',
        price: finalProduct ? finalProduct.price.replace(/[^\d]/g, '') : '',
        note: prev.product.note || ''
      }
    }));
  }, [productId]);


  const [contractNumber, setContractNumber] = useState(() => {
    const saved = localStorage.getItem('contractNumber');
    return saved ? parseInt(saved, 10) : 1;
  });

  const currentYear = new Date().getFullYear();
  const formattedContractNumber = `${contractNumber.toString().padStart(2, '0')}/${currentYear}/HĐMB`;

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

  const handleSave = () => {
    const qty = parseFloat(contract.product.quantity) || 5000;
    const priceVal = parseFloat(contract.product.price) || 0;
    const totalVal = qty * priceVal;

    const nextNumber = contractNumber + 1;
    setContractNumber(nextNumber);
    localStorage.setItem('contractNumber', nextNumber.toString());

    const newContractId = `CT-${Math.floor(Math.random() * 900000 + 100000)}`;

    const newContractV2 = {
      id: newContractId,
      contractNo: formattedContractNumber,
      createdAt: new Date().toISOString(),
      status: 'pending_super_admin',
      totalVal: totalVal,
      paidAmount: 0,
      
      // Parties
      seller: {
        id: contract.seller.id || 'HTX-001',
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
      
      // Flat properties for compatibility with older code/lists
      enterpriseName: contract.buyer.name || 'Công ty TNHH Xuất Nhập Khẩu VinaFruit',
      taxCode: contract.buyer.taxCode || '0312345678',
      coopName: contract.seller.name || 'HTX Cà phê Cầu Đất',
      cooperativeId: contract.seller.id || 'HTX-001',
      product: contract.product.id || '1',
      cropName: contract.product.name || 'Cà Phê Arabica Cầu Đất',
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
      deliveryTime: contract.deliveryTime || 'Trong vòng 15 ngày lấy hàng',
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

    // Save to vietagri_contracts_v3 (Unified source of truth for CustomerDashboard and AdminDashboard)
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

    // Save to vietagri_contracts (simple structure for AdminDashboard)
    const newContractSimple = {
      id: newContractId,
      contractNo: formattedContractNumber,
      party: contract.buyer.name || 'Công ty TNHH Xuất Nhập Khẩu VinaFruit',
      qty: `${qty.toLocaleString('vi-VN')} ${contract.product.unit || 'kg'} ${contract.product.name}`,
      status: 'Chờ duyệt',
      val: `${(totalVal / 1000000).toFixed(1)}M`,
      type: 'b2b',
      cooperativeId: contract.seller.id || 'HTX-001',
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
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-[#004d40] transition-colors font-bold"
        >
          <ChevronLeft size={20} /> Quay lại
        </button>

        <form className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-xl font-black uppercase text-[#004d40]">HỢP ĐỒNG MUA BÁN HÀNG HÓA</h1>
            <p className="text-sm font-bold text-slate-400 mt-2">Số: {formattedContractNumber}</p>
          </div>

          {/* Section: Common Info */}
          <section className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h2 className="text-xs font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
              <FileText size={16} /> Thông tin chung
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField readOnly label="Ngày ký" value={contract.date} onChange={(val: any) => setContract({...contract, date: val})} showInfo={activeInfo === 'date'} onToggleInfo={() => setActiveInfo(activeInfo === 'date' ? null : 'date')} />
              <InputField readOnly label="Tại địa chỉ" value={contract.location} onChange={(val: any) => setContract({...contract, location: val})} showInfo={activeInfo === 'location'} onToggleInfo={() => setActiveInfo(activeInfo === 'location' ? null : 'location')} />
            </div>
          </section>

          {/* Section: Parties */}
          <div className="grid md:grid-cols-2 gap-8">
            <section className="p-6 border border-slate-200 rounded-2xl">
              <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Bên Bán (Bên A)</h2>
              <div className="space-y-4">
                <InputField required label="Tên doanh nghiệp" info="Điền chính xác tên đầy đủ của Hợp tác xã theo Giấy đăng ký kinh doanh. Không viết tắt. Ví dụ: Hợp tác xã Nông nghiệp Sạch Long An." value={contract.seller.name} onChange={(v: string) => handleUpdate('seller', 'name', v)} showInfo={activeInfo === 'seller.name'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.name' ? null : 'seller.name')} />
                <InputField type="number" required label="Mã số doanh nghiệp" info="Là dãy số gồm 10 số (hoặc 13 số) in trên Giấy phép thành lập của HTX. Số này bắt buộc phải đúng để đối tác xuất hóa đơn đỏ và chuyển tiền." value={contract.seller.taxCode} onChange={(v: string) => handleUpdate('seller', 'taxCode', v)} showInfo={activeInfo === 'seller.taxCode'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.taxCode' ? null : 'seller.taxCode')} />
                <InputField required label="Địa chỉ trụ sở chính" info="Địa chỉ nơi đặt văn phòng chính của Hợp tác xã được đăng ký với nhà nước (không phải địa chỉ vườn cây hay kho chứa nông sản)." value={contract.seller.address} onChange={(v: string) => handleUpdate('seller', 'address', v)} showInfo={activeInfo === 'seller.address'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.address' ? null : 'seller.address')} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField required label="Người đại diện" info="Họ và tên người đứng đầu HTX (thường là Chủ tịch Hội đồng quản trị hoặc Giám đốc)." value={contract.seller.rep} onChange={(v: string) => handleUpdate('seller', 'rep', v)} showInfo={activeInfo === 'seller.rep'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.rep' ? null : 'seller.rep')} />
                    <InputField required label="Chức danh" info="Ghi rõ vị trí của người ký. Ví dụ: Chủ tịch HĐQT, Giám đốc..." value={contract.seller.position} onChange={(v: string) => handleUpdate('seller', 'position', v)} showInfo={activeInfo === 'seller.position'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.position' ? null : 'seller.position')} />
                </div>
                <InputField type="number" required label="Số điện thoại" info="Số điện thoại chính của Hợp tác xã hoặc của Giám đốc để bên mua liên hệ điều xe, báo lịch bốc hàng nông sản. (Mục Fax có thể bỏ trống nếu không sử dụng)." value={contract.seller.phone} onChange={(v: string) => handleUpdate('seller', 'phone', v)} showInfo={activeInfo === 'seller.phone'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.phone' ? null : 'seller.phone')} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField type="number" required label="Tài khoản ngân hàng" info="Số tài khoản ngân hàng ĐỨNG TÊN CỦA HỢP TÁC XÃ (Tuyệt đối không dùng số tài khoản cá nhân)." value={contract.seller.bankAcc} onChange={(v: string) => handleUpdate('seller', 'bankAcc', v)} showInfo={activeInfo === 'seller.bankAcc'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.bankAcc' ? null : 'seller.bankAcc')} />
                    <InputField required label="Ngân hàng" info="Tên ngân hàng và tên chi nhánh. Ví dụ: Agribank - Chi nhánh huyện Tân Thạnh, Long An." value={contract.seller.bankName} onChange={(v: string) => handleUpdate('seller', 'bankName', v)} showInfo={activeInfo === 'seller.bankName'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.bankName' ? null : 'seller.bankName')} />
                </div>
              </div>
            </section>

            <section className="p-6 border border-slate-200 rounded-2xl">
              <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Bên Mua (Bên B)</h2>
              <div className="space-y-4">
                <InputField required label="Tên doanh nghiệp" info="Điền chính xác tên đầy đủ của Công ty/Doanh nghiệp theo Giấy chứng nhận đăng ký doanh nghiệp. Không viết tắt tên riêng. Ví dụ: Công ty Cổ phần Xuất Nhập khẩu Nông sản Toàn Cầu." value={contract.buyer.name} onChange={(v: string) => handleUpdate('buyer', 'name', v)} showInfo={activeInfo === 'buyer.name'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.name' ? null : 'buyer.name')} />
                <InputField type="number" required label="Mã số doanh nghiệp (Mã số thuế)" info="Là mã số thuế gồm 10 số của doanh nghiệp. Hệ thống sẽ dùng mã số này để đối chiếu dữ liệu hóa đơn điện tử và kiểm tra tính hợp pháp của doanh nghiệp trên cổng thông tin quốc gia." value={contract.buyer.taxCode} onChange={(v: string) => handleUpdate('buyer', 'taxCode', v)} showInfo={activeInfo === 'buyer.taxCode'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.taxCode' ? null : 'buyer.taxCode')} />
                <InputField required label="Địa chỉ trụ sở chính" info="Địa chỉ đăng ký kinh doanh trên giấy phép của Công ty. Địa chỉ này sẽ được dùng để xuất hóa đơn GTGT (Hóa đơn đỏ) cho đơn hàng nông sản. Lưu ý: Tránh nhầm lẫn với địa chỉ kho nhận hàng hoặc nhà máy chế biến." value={contract.buyer.address} onChange={(v: string) => handleUpdate('buyer', 'address', v)} showInfo={activeInfo === 'buyer.address'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.address' ? null : 'buyer.address')} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField required label="Người đại diện" info="Họ và tên của người giữ quyền quản lý cao nhất của doanh nghiệp (thường là Giám đốc, Tổng Giám đốc hoặc Chủ tịch HĐQT) được ghi trên giấy phép kinh doanh." value={contract.buyer.rep} onChange={(v: string) => handleUpdate('buyer', 'rep', v)} showInfo={activeInfo === 'buyer.rep'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.rep' ? null : 'buyer.rep')} />
                    <InputField required label="Chức danh" info="Ghi rõ chức vụ của người ký. Ví dụ: Giám đốc, Tổng Giám đốc... (Trường hợp ký thay phải có văn bản ủy quyền hợp pháp đính kèm)." value={contract.buyer.position} onChange={(v: string) => handleUpdate('buyer', 'position', v)} showInfo={activeInfo === 'buyer.position'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.position' ? null : 'buyer.position')} />
                </div>
                <InputField type="number" required label="Số điện thoại" info="Số điện thoại hotline của phòng thu mua hoặc số của người phụ trách trực tiếp hợp đồng này để phối hợp lịch nhận hàng, kiểm tra chất lượng nông sản. (Có thể bỏ trống mục Fax)." value={contract.buyer.phone} onChange={(v: string) => handleUpdate('buyer', 'phone', v)} showInfo={activeInfo === 'buyer.phone'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.phone' ? null : 'buyer.phone')} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField type="number" required label="Tài khoản ngân hàng" info="Số tài khoản ngân hàng công ty dùng để chuyển tiền thanh toán. Phải là TÀI KHOẢN ĐỨNG TÊN DOANH NGHIỆP." value={contract.buyer.bankAcc} onChange={(v: string) => handleUpdate('buyer', 'bankAcc', v)} showInfo={activeInfo === 'buyer.bankAcc'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.bankAcc' ? null : 'buyer.bankAcc')} />
                    <InputField required label="Mở tại ngân hàng" info="Ghi rõ tên ngân hàng và chi nhánh giao dịch. Ví dụ: Vietcombank - Chi nhánh TP. Hồ Chí Minh." value={contract.buyer.bankName} onChange={(v: string) => handleUpdate('buyer', 'bankName', v)} showInfo={activeInfo === 'buyer.bankName'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.bankName' ? null : 'buyer.bankName')} />
                </div>
              </div>
            </section>
          </div>

          {/* Section: Items */}
          <section className="p-6 border border-slate-200 rounded-2xl mt-8">
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Thông tin hàng hóa</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField readOnly label="Mã hàng hóa" info="Mã định danh sản phẩm." value={contract.product.id} onChange={(v: string) => handleProductUpdate('id', v)} />
                  <InputField readOnly label="Tên hàng hóa" info="Ví dụ: Gạo ST25, Thanh long ruột đỏ loại 1." value={contract.product.name} onChange={(v: string) => handleProductUpdate('name', v)} />
                  <InputField readOnly label="Đơn vị" info="Ví dụ: Kg, Tấn, Thùng." value={contract.product.unit} onChange={(v: string) => handleProductUpdate('unit', v)} />
                  <InputField type="number" label="Số lượng" info="Quy mô đơn hàng." value={contract.product.quantity} onChange={(v: string) => handleProductUpdate('quantity', v)} />
                  <InputField readOnly type="number" label="Đơn giá" info="Giá trên một đơn vị." value={contract.product.price} onChange={(v: string) => handleProductUpdate('price', v)} />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thành tiền</label>
                    <input readOnly value={calculateTotal().toLocaleString('vi-VN')} className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-100" />
                  </div>
            </div>
            <div className="mt-4">
                <InputField label="Ghi chú" info="Yêu cầu bảo quản hoặc đóng gói." value={contract.product.note} onChange={(v: string) => handleProductUpdate('note', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng cộng</label>
                    <input readOnly value={calculateTotal().toLocaleString('vi-VN')} className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-100 font-bold" />
                </div>
                <InputField 
                    label="Bằng chữ" 
                    info="Ghi lại tổng số tiền bằng văn bản tiếng Việt. Chỉ nhập chữ, viết hoa chữ cái đầu câu. Ví dụ: Mười triệu đồng." 
                    value={contract.totalInWords} 
                    onChange={(v: string) => {
                        // Keep only letters and spaces, then capitalize first letter
                        let formatted = v.replace(/[^A-Za-zÀ-Ỹà-ỹ\s]/g, '');
                        if (formatted.length > 0) {
                            formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
                        }
                        setContract(prev => ({ ...prev, totalInWords: formatted }));
                    }} 
                />
            </div>
          </section>

          <section className="p-6 border border-slate-200 rounded-2xl mt-8">
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Thanh toán</h2>
            <div className="space-y-4">
                <div className="flex flex-col gap-1 relative">
                    <div className="flex items-center gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thời hạn thanh toán</label>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'paymentType' ? null : 'paymentType'); }} className="text-slate-400 hover:text-[#004d40]">
                            <Info size={14} />
                        </button>
                    </div>
                    {activeInfo === 'paymentType' && (
                        <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-10 mt-1 p-3 bg-white border border-slate-200 rounded-xl shadow-lg w-72 text-xs text-slate-600 leading-relaxed italic">
                            Bên B phải thanh toán cho Bên A số tiền ghi tại Điều 1 của Hợp đồng này vào ngày…tháng…năm…
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
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đợt 1</label>
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
                                    <span className="text-[10px] text-slate-600">Đồng ý với phương án này</span>
                                </label>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đợt 2</label>
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
                            <InputField readOnly label="Đợt 3 (nếu có)" placeholder="Còn lại..." value={(parseInt(contract.paymentPhase1 || '0') + parseInt(contract.paymentPhase2 || '0')) === 100 ? 'Không có' : '10%'} onChange={(v: string) => setContract(prev => ({ ...prev, paymentPhase3: v }))} showInfo={activeInfo === 'paymentPhase3'} onToggleInfo={() => setActiveInfo(activeInfo === 'paymentPhase3' ? null : 'paymentPhase3')} />
                          </div>
                        );
                    }
                    
                    let label = "Chi tiết thời hạn";
                    let placeholder = "Điền thông tin chi tiết...";
                    let inputType = "text";
                    if (type === 'Thanh toán một cục cố định') {
                        return (
                <div className="flex flex-col gap-1 relative">
                    <div className="flex items-center gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày thanh toán cố định</label>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'paymentDate' ? null : 'paymentDate'); }} className="text-slate-400 hover:text-[#004d40]">
                            <Info size={14} />
                        </button>
                    </div>
                    {activeInfo === 'paymentDate' && (
                        <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-10 mt-1 p-3 bg-white border border-slate-200 rounded-xl shadow-lg w-72 text-xs text-slate-600 leading-relaxed italic">
                            Hạn thanh toán định kỳ/Mốc thanh toán chốt là điều khoản quy định một hoặc nhiều ngày cụ thể, chính xác trong tháng/năm mà Bên mua (Doanh nghiệp) có nghĩa vụ phải chuyển tiền thanh toán cho Hợp tác xã (Bên bán).
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
                                <div className="flex items-center gap-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thời hạn gối đầu</label>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'paymentDate' ? null : 'paymentDate'); }} className="text-slate-400 hover:text-[#004d40]">
                                        <Info size={14} />
                                    </button>
                                </div>
                                {activeInfo === 'paymentDate' && (
                                    <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-10 mt-1 p-3 bg-white border border-slate-200 rounded-xl shadow-lg w-72 text-xs text-slate-600 leading-relaxed italic">
                                        Phương thức thanh toán mà Bên mua (Doanh nghiệp) được phép hoãn trả tiền của lô hàng này cho đến khi nhận được lô hàng tiếp theo (hoặc đến một chu kỳ chốt sổ cố định).
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
                    return (
                        <InputField 
                            label={label} 
                            placeholder={placeholder} 
                            type={inputType}
                            info="Chi tiết về ngày thanh toán hoặc lộ trình thanh toán dựa trên lựa chọn ở trên." 
                            value={contract.paymentDate} 
                            onChange={(v: string) => setContract(prev => ({ ...prev, paymentDate: v }))} 
                            showInfo={activeInfo === 'paymentDate'} 
                            onToggleInfo={() => setActiveInfo(activeInfo === 'paymentDate' ? null : 'paymentDate')} 
                        />
                    );
                })()}
                
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hình thức thanh toán</label>
                    <select value={contract.paymentMethod} onChange={(e) => setContract(prev => ({ ...prev, paymentMethod: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                        <option value="Chuyển khoản (TMCP/Chuyển khoản ngân hàng)">Chuyển khoản (TMCP/Chuyển khoản ngân hàng)</option>
                        <option value="Tiền mặt">Tiền mặt</option>
                    </select>
                </div>
            </div>
          </section>

          <section className="p-6 border border-slate-200 rounded-2xl mt-8">
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Thời gian, địa điểm, phương thức giao hàng</h2>
            <div className="space-y-4">
                <InputField label="Thời gian giao hàng" placeholder="Ví dụ: 25/05/2026 hoặc 6h-8h sáng mỗi ngày" value={contract.deliveryTime} onChange={(v: string) => setContract(prev => ({ ...prev, deliveryTime: v }))} showInfo={activeInfo === 'deliveryTime'} onToggleInfo={() => setActiveInfo(activeInfo === 'deliveryTime' ? null : 'deliveryTime')} info="Điều khoản quy định mốc thời gian chính xác (ngày, giờ hoặc khoảng thời gian) mà Hợp tác xã (Bên bán) phải hoàn thành việc gom hàng, bốc xếp và bàn giao toàn bộ số lượng nông sản cho Doanh nghiệp (Bên mua)." />
                
                <div className="flex flex-col gap-1 relative">
                    <div className="flex items-center gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Địa điểm giao hàng</label>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'deliveryLocation' ? null : 'deliveryLocation'); }} className="text-slate-400 hover:text-[#004d40]">
                            <Info size={14} />
                        </button>
                    </div>
                    {activeInfo === 'deliveryLocation' && (
                        <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-10 mt-1 p-3 bg-white border border-slate-200 rounded-xl shadow-lg w-72 text-xs text-slate-600 leading-relaxed italic">
                            Điều khoản quy định tọa độ hoặc địa chỉ vật lý chính xác mà Hợp tác xã (Bên bán) có nghĩa vụ phải tập kết nông sản tại đó để cân đo, kiểm tra chất lượng và bàn giao quyền sở hữu hàng hóa cho Doanh nghiệp (Bên mua).
                        </div>
                    )}
                    <select value={contract.deliveryLocation} onChange={(e) => setContract(prev => ({ ...prev, deliveryLocation: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                        <option value="Giao tại kho Bên bán (HTX)">Giao tại kho Bên bán (HTX)</option>
                        <option value="Giao tại kho Bên mua (Doanh nghiệp)">Giao tại kho Bên mua (Doanh nghiệp)</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 relative">
                        <div className="flex items-center gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chi phí vận chuyển</label>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'transportCostBy' ? null : 'transportCostBy'); }} className="text-slate-400 hover:text-[#004d40]">
                                <Info size={14} />
                            </button>
                        </div>
                        {activeInfo === 'transportCostBy' && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-10 mt-1 p-3 bg-white border border-slate-200 rounded-xl shadow-lg w-72 text-xs text-slate-600 leading-relaxed italic">
                                Điều khoản quy định rõ Bên nào (Bên bán hay Bên mua) sẽ chịu trách nhiệm thuê xe và trả tiền để chở nông sản từ nơi thu hoạch/kho của Hợp tác xã đến kho của Doanh nghiệp.
                            </div>
                        )}
                        <select value={contract.transportCostBy} onChange={(e) => setContract(prev => ({ ...prev, transportCostBy: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                            <option value="Bên Mua chịu">Bên Mua chịu</option>
                            <option value="Bên Bán chịu">Bên Bán chịu</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 relative">
                        <div className="flex items-center gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chi phí bốc xếp</label>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'loadingCostBy' ? null : 'loadingCostBy'); }} className="text-slate-400 hover:text-[#004d40]">
                                <Info size={14} />
                            </button>
                        </div>
                        {activeInfo === 'loadingCostBy' && (
                            <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-10 mt-1 p-3 bg-white border border-slate-200 rounded-xl shadow-lg w-72 text-xs text-slate-600 leading-relaxed italic">
                                Điều khoản quy định rõ Bên nào có trách nhiệm thuê và trả tiền cho công nhân (hoặc xe nâng, băng chuyền) để xúc lúa, khiêng vác các thùng trái cây, bao nông sản từ dưới đất/kho lên trên thùng xe tải (bốc lên) hoặc ngược lại (xếp xuống).
                            </div>
                        )}
                        <select value={contract.loadingCostBy} onChange={(e) => setContract(prev => ({ ...prev, loadingCostBy: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                            <option value="Mỗi bên chịu một đầu">Mỗi bên chịu một đầu</option>
                            <option value="Bên B chịu toàn bộ">Bên B chịu toàn bộ</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField 
                        label="Phạt Bên mua (lưu kho)" 
                        placeholder="Ví dụ: 500.000" 
                        value={contract.buyerPenalty} 
                        onChange={(v: string) => setContract(prev => ({ ...prev, buyerPenalty: v }))} 
                        showInfo={activeInfo === 'buyerPenalty'} 
                        onToggleInfo={() => setActiveInfo(activeInfo === 'buyerPenalty' ? null : 'buyerPenalty')} 
                        suffix="đồng/ngày"
                        info="Chế tài bằng tiền áp dụng trong trường hợp đến ngày giao hàng theo thỏa thuận nhưng Bên mua (Doanh nghiệp) trì hoãn, chậm trễ không đến nhận hàng hoặc không cho xe đến chở nông sản đi."
                    />
                    <InputField 
                        label="Phạt Bên bán (điều xe)" 
                        placeholder="Chi phí vận hành..." 
                        value={contract.sellerPenalty} 
                        onChange={(v: string) => setContract(prev => ({ ...prev, sellerPenalty: v }))} 
                        showInfo={activeInfo === 'sellerPenalty'} 
                        onToggleInfo={() => setActiveInfo(activeInfo === 'sellerPenalty' ? null : 'sellerPenalty')} 
                        info="Chế tài bằng tiền áp dụng trong trường hợp Hợp tác xã (Bên bán) đã xác nhận lịch và chuẩn bị sẵn nông sản, nhưng đến giờ hẹn xe của Bên mua đến bốc hàng thì HTX lại chậm trễ, không gom kịp đủ số lượng hoặc trì hoãn không bốc hàng lên xe."
                    />
                </div>

                <InputField label="Ngoại lệ (chất lượng)" info="Điều khoản quy định về những mặt hàng nông sản có đảm bảo không hỏng, kém chất lượng nằm sâu bên trong sản phẩm mà mắt thường không thể nhìn thấy, không thể kiểm tra nhanh được tại chỗ lúc cân giao hàng." placeholder="Ví dụ: Sầu riêng bị sượng..." value={contract.qualityExemption} onChange={(v: string) => setContract(prev => ({ ...prev, qualityExemption: v }))} showInfo={activeInfo === 'qualityExemption'} onToggleInfo={() => setActiveInfo(activeInfo === 'qualityExemption' ? null : 'qualityExemption')} />
                
                <InputField label="Cơ quan kiểm tra trung gian" info="Cơ quan kiểm tra trung gian là một Bên thứ ba độc lập (tổ chức giám định có tư cách pháp nhân như Vinacontrol, SGS) được cả Hợp tác xã và Doanh nghiệp cùng tin tưởng." placeholder="Ví dụ: Ban quản lý chợ..." value={contract.intermediaryAgency} onChange={(v: string) => setContract(prev => ({ ...prev, intermediaryAgency: v }))} showInfo={activeInfo === 'intermediaryAgency'} onToggleInfo={() => setActiveInfo(activeInfo === 'intermediaryAgency' ? null : 'intermediaryAgency')} />
            </div>
          </section>

          <section className="p-6 border border-slate-200 rounded-2xl mt-8">
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">BẢO HÀNH VÀ HƯỚNG DẪN SỬ DỤNG HÀNG HÓA</h2>
            <div className="space-y-4">
                <div className="flex flex-col gap-1 relative">
                    <div className="flex items-center gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loại hàng cần bảo hành</label>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setActiveInfo(activeInfo === 'warrantyProduct' ? null : 'warrantyProduct'); }} className="text-slate-400 hover:text-[#004d40]">
                            <Info size={14} />
                        </button>
                    </div>
                    {activeInfo === 'warrantyProduct' && (
                        <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-10 mt-1 p-3 bg-white border border-slate-200 rounded-xl shadow-lg w-96 text-xs text-slate-600 leading-relaxed italic">
                            - Không áp dụng: Dành cho hàng tươi sống tiêu thụ nội địa (kiểm định chất lượng và chốt số lượng ngay tại bãi cân khi giao nhận).<br/>
                            - Sản phẩm xuất khẩu: Dành cho hàng xuất khẩu (VD: Thanh long đông lạnh IQF, Mít sấy...). Cam kết đạt tiêu chuẩn kiểm dịch, độ ẩm và dư lượng chất cấm tại thời điểm mở tờ khai hải quan.
                        </div>
                    )}
                    <select value={contract.warrantyProduct || 'Không áp dụng'} onChange={(e) => setContract(prev => ({ ...prev, warrantyProduct: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                        <option value="Không áp dụng">Không áp dụng</option>
                        <option value="Sản phẩm xuất khẩu">Sản phẩm xuất khẩu</option>
                    </select>
                </div>
                {contract.warrantyProduct === 'Sản phẩm xuất khẩu' && (
                    <InputField label="Trong thời gian (tháng)" placeholder="Ví dụ: 03" type="number" value={contract.warrantyDuration} onChange={(v: string) => setContract(prev => ({ ...prev, warrantyDuration: v }))} showInfo={activeInfo === 'warrantyDuration'} onToggleInfo={() => setActiveInfo(activeInfo === 'warrantyDuration' ? null : 'warrantyDuration')} />
                )}
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={contract.usageGuideIncluded}
                        onChange={(e) => setContract(prev => ({ ...prev, usageGuideIncluded: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-300 text-[#004d40] focus:ring-[#004d40]"
                    />
                    <span className="text-sm text-slate-700">Đã đính kèm hướng dẫn sử dụng/bảo quản</span>
                </label>
            </div>
          </section>

          <section className="p-6 border border-slate-200 rounded-2xl mt-8">
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">ĐIỀU KHOẢN PHẠT VI PHẠM HỢP ĐỒNG</h2>
            <div className="space-y-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ lệ phạt vi phạm (%)</label>
                    <div className="text-sm text-slate-700 p-3 bg-slate-100 rounded-xl">8%</div>
                    <p className="text-[10px] text-slate-500 italic">Theo Điều 301 Luật Thương mại Việt Nam, mức phạt vi phạm hợp đồng kinh tế/thương mại giữa Hợp tác xã và Doanh nghiệp được bên thỏa thuận nhưng tối đa không quá 8% giá trị phần nghĩa vụ bị vi phạm. Hệ thống mặc định khuyến nghị mức tối đa (8%) để bảo vệ quyền lợi cho HTX khi có tranh chấp xảy ra.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">QUY ĐỊNH PHÁP LÝ HÀNH CHÍNH</label>
                    <p className="text-sm text-slate-700 italic">
                        Ngoài việc phạt tiền do hủy hợp đồng, nếu phát sinh các vi phạm nhỏ hơn (giao hàng trễ, không đúng chất lượng, thanh toán chậm...), hai bên sẽ dựa vào quy định của Luật Thương mại hiện hành để tính mức phạt cụ thể.
                    </p>
                </div>
            </div>
          </section>

          <section className="p-6 border border-slate-200 rounded-2xl mt-8">
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Điều khoản chung</h2>
            <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                    <p className="text-sm text-slate-700"><strong>Khoản 1:</strong> Hợp đồng có hiệu lực ngay tại thời điểm ký. Hợp đồng tự động thanh lý khi Bên B nhận đủ nông sản và Bên A nhận đủ 100% tiền.</p>
                    <p className="text-sm text-slate-700"><strong>Khoản 2 & 3:</strong> Hợp đồng này thay thế mọi thỏa thuận trước đây. Mọi sửa đổi phải được lập thành văn bản hoặc phụ lục.</p>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Số lượng bản lưu</label>
                    <div className="text-sm text-slate-700 p-3 bg-slate-100 rounded-xl">2 bản</div>
                </div>
            </div>
          </section>

          <div className="mt-10 flex justify-end">
            <button 
              type="button"
              onClick={handleSave}
              className="flex items-center gap-3 bg-[#004d40] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#00332c] transition-all shadow-xl shadow-slate-200"
            >
              <Save size={20} /> Lưu thông tin hợp đồng
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
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Lưu thông tin thành công!</h2>
                <p className="text-sm text-slate-500 font-medium font-sans">Hợp đồng điện tử của bạn đã được khởi tạo và đẩy thành công vào cơ sở dữ liệu quốc gia VietAgri.</p>
              </div>

              {/* Mini contract detail badge */}
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5 text-left font-sans">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><Building size={14} /> HỢP TÁC XÃ (BÁN):</span>
                  <span className="text-[#004d40] font-black">{savedContract.coopName}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><CheckCircle size={14} /> DOANH NGHIỆP (MUA):</span>
                  <span className="text-slate-800 font-black">{savedContract.enterpriseName}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 font-sans">
                  <span className="flex items-center gap-1.5"><FileText size={14} /> SỐ HỢP ĐỒNG:</span>
                  <span className="text-[#004d40] font-mono font-black">{savedContract.contractNo}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 font-sans">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> TRẠNG THÁI:</span>
                  <span className="bg-amber-50 text-amber-750 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">Chờ duyệt hành chính</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/customer-dashboard', { 
                      state: { 
                        activeTab: 'contracts',
                        savedSuccess: true,
                        savedContractNo: savedContract.contractNo
                      } 
                    });
                  }}
                  className="w-full py-4 bg-[#004d40] hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-900/10 font-sans cursor-pointer"
                >
                  Đến Trang Hợp Đồng & Công Nợ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}