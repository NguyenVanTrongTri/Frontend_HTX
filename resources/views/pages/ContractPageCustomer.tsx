import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, FileText, Info, CheckCircle, Check, Building, Clock, ShieldCheck, Printer, Send, FileSignature } from 'lucide-react';
import { PRODUCTS, COOPERATIVE_CONFIGS, COOPERATIVES } from '../../data';
import { motion, AnimatePresence } from 'motion/react';

const convertNumberToVietnameseWords = (num: number): string => {
  if (num === 0) return "Không đồng";
  const units = ["", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ"];
  const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

  const readThreeDigits = (n: number, isFirst: boolean): string => {
    let result = "";
    const hundreds = Math.floor(n / 100);
    const tens = Math.floor((n % 100) / 10);
    const ones = n % 10;

    if (hundreds > 0 || !isFirst) {
      result += digits[hundreds] + " trăm ";
    }

    if (tens > 0) {
      if (tens === 1) {
        result += "mười ";
      } else {
        result += digits[tens] + " mươi ";
      }
    } else if (hundreds > 0 && ones > 0) {
      result += "lẻ ";
    }

    if (ones > 0) {
      if (ones === 1 && tens > 1) {
        result += "mốt";
      } else if (ones === 5 && tens > 0) {
        result += "lăm";
      } else {
        result += digits[ones];
      }
    }
    return result.trim();
  };

  let strNum = Math.floor(Math.abs(num)).toString();
  let groups: string[] = [];
  while (strNum.length > 0) {
    groups.push(strNum.substring(Math.max(0, strNum.length - 3)));
    strNum = strNum.substring(0, Math.max(0, strNum.length - 3));
  }

  let result = "";
  for (let i = groups.length - 1; i >= 0; i--) {
    const val = parseInt(groups[i], 10);
    if (val > 0) {
      const gStr = readThreeDigits(val, i === groups.length - 1);
      result += " " + gStr + units[i];
    }
  }

  let finalStr = result.trim().replace(/\s+/g, " ");
  if (finalStr.length > 0) {
    finalStr = finalStr.charAt(0).toUpperCase() + finalStr.slice(1) + " đồng";
  }
  return finalStr;
};

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
  const [isSaved, setIsSaved] = useState(false);
  
  // States for Admin digital signing
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSignProcessing, setIsSignProcessing] = useState(false);
  const [signProgress, setSignProgress] = useState(0);
  const [signMessage, setSignMessage] = useState('');
  const [signSuccess, setSignSuccess] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = () => setActiveInfo(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [contract, setContract] = useState<{
    date: string,
    location: string,
    product: { id: string, name: string, unit: string, quantity: string, price: string, note: string, qualityStandard: string },
    totalInWords: string,
    paymentDate: string,
    paymentPhase1: string,
    paymentPhase2: string,
    paymentPhase3: string,
    agreedToPaymentPlan: boolean,
    paymentMethod: string,
    paymentType: string,
    deliveryTime: string,
    startTime: string,
    endTime: string,
    deliveryLocation: string,
    transportCostBy: string,
    loadingCostBy: string,
    buyerPenalty: string,
    sellerPenalty: string,
    qualityExemption: string,
    intermediaryAgency: string,
    notaryFeeBy: string,
    disputeResolutionCourt: string,
    validFrom: string,
    validTo: string,
    penaltyPercentage: string,
    contractCopies: string,
    seller: { name: string, taxCode: string, address: string, rep: string, position: string, id: string, idDate: string, idPlace: string, phone: string, bankAcc: string, bankName: string },
    buyer: { name: string, taxCode: string, address: string, rep: string, position: string, id: string, idDate: string, idPlace: string, phone: string, bankAcc: string, bankName: string }
  }>({
    date: '',
    location: '',
    product: { id: '', name: '', unit: '', quantity: '', price: '', note: '', qualityStandard: 'VietGAP' },
    totalInWords: '',
    paymentDate: 'Ngay khi giao hàng (trong vòng 24 giờ)',
    paymentPhase1: '10% giá trị dự kiến',
    paymentPhase2: 'Thanh toán phần còn lại sau khi thu hoạch',
    paymentPhase3: '',
    agreedToPaymentPlan: false,
    paymentMethod: 'Chuyển khoản (TMCP/Chuyển khoản ngân hàng)',
    paymentType: 'Thanh toán ngay khi giao hàng',
    deliveryTime: '',
    startTime: '',
    endTime: '',
    deliveryLocation: 'Giao tại vườn/kho Bên bán (Nông dân)',
    transportCostBy: 'Bên Mua',
    loadingCostBy: 'Mỗi bên chịu một đầu',
    buyerPenalty: '',
    sellerPenalty: '',
    qualityExemption: '',
    intermediaryAgency: '',
    notaryFeeBy: 'Hai bên',
    disputeResolutionCourt: '',
    validFrom: '',
    validTo: '',
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
    // 0. Check if this is an EXISTING contract ID
    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
    if (rawV2) {
      try {
        const contractsV2 = JSON.parse(rawV2);
        const existing = contractsV2.find((c: any) => String(c.id) === String(productId));
        if (existing) {
          setSavedContract(existing);
          setIsSaved(true);
          // Populate state for potential editing/back reference
          setContract(prev => ({
            ...prev,
            date: existing.createdAt ? new Date(existing.createdAt).toLocaleDateString('vi-VN') : prev.date,
            seller: existing.seller || prev.seller,
            buyer: existing.buyer || prev.buyer,
            product: {
              ...prev.product,
              id: existing.product || prev.product.id,
              name: existing.cropName || prev.product.name,
              quantity: existing.totalVolume?.replace(/[^\d,.]/g, '').replace(',', '.') || prev.product.quantity,
              price: existing.unitPrice?.replace(/[^\d,.]/g, '').replace(',', '.') || prev.product.price,
              qualityStandard: existing.qualityStandard || prev.product.qualityStandard
            },
            paymentMethod: existing.paymentMethod || prev.paymentMethod,
            paymentType: existing.paymentType || prev.paymentType,
            deliveryLocation: existing.deliveryLocation || prev.deliveryLocation,
            deliveryTime: existing.deliveryTime || prev.deliveryTime
          }));
          return;
        }
      } catch (e) {}
    }

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

    // 2. Load member/farmer info if productId matches a registration/farmer
    const rawPending = localStorage.getItem('pending_registration_members');
    const rawFarmers = localStorage.getItem('vietagri_active_farmers');
    const rawRequests = localStorage.getItem('vietagri_farmer_requests');
    
    let memberData: any = null;
    try {
      const pending = rawPending ? JSON.parse(rawPending) : [];
      const farmers = rawFarmers ? JSON.parse(rawFarmers) : [];
      const requests = rawRequests ? JSON.parse(rawRequests) : [];
      
      const allMembers = [
        ...(Array.isArray(pending) ? pending : []),
        ...(Array.isArray(farmers) ? farmers : []),
        ...(Array.isArray(requests) ? requests : [])
      ];
      
      memberData = allMembers.find((m: any) => String(m.id) === String(productId) || String(m.memberId) === String(productId));
    } catch (e) {}

    const cooperativeId = finalProduct?.cooperativeId || memberData?.cooperativeId || 'HTX-001';
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
    const selectedCoop = COOPERATIVES.find(c => c.id === cooperativeId);
    const defaultBuyerName = currentUser?.name || selectedCoop?.name || 'HTX Cà phê Cầu Đất';
    const defaultTaxCode = currentUser?.taxCode || '0312345678';
    const defaultAddress = currentUser?.address || (selectedCoop ? `Trụ sở ${selectedCoop.name}, ${province}` : '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh');
    const defaultRep = currentUser?.representative || currentUser?.name || 'Trần Văn Bảo';
    const defaultPhone = currentUser?.phone || '0912345678';

    setContract(prev => {
      const qVal = parseFloat(prev.product.quantity || '5000') || 5000;
      const pVal = finalProduct ? parseFloat(finalProduct.price.replace(/[^\d]/g, '')) || 0 : 0;
      const initialTotal = qVal * pVal;
      const initialWords = convertNumberToVietnameseWords(initialTotal);

      return {
        ...prev,
        date,
        location: province,
        totalInWords: prev.totalInWords || initialWords,
        seller: {
          ...prev.seller,
          id: memberData?.id || memberData?.memberId || '',
          name: memberData?.name || 'Nông dân',
          address: memberData?.address || memberData?.region || `Khu phố 1, Thị trấn Liên Nghĩa, Huyện Đức Trọng, Tỉnh ${province}`,
          rep: memberData?.name || 'Nguyễn Văn Hợp',
          position: 'Chủ hộ',
          phone: memberData?.phone || '0988777666',
          bankAcc: '999988887777',
          bankName: `Agribank - Chi nhánh Tỉnh ${province}`
        },
        buyer: {
          ...prev.buyer,
          name: defaultBuyerName,
          taxCode: defaultTaxCode,
          address: defaultAddress,
          rep: defaultRep,
          position: 'Giám đốc',
          phone: defaultPhone,
          bankAcc: '1029384756',
          bankName: 'Vietcombank - Chi nhánh Nam Sài Gòn'
        },
        product: {
          id: finalProduct ? String(finalProduct.id) : (memberData?.crops?.[0]?.id || ''),
          name: finalProduct?.name || (memberData?.crops?.[0]?.name) || (memberData?.registrationType === 'crop_approval' ? (memberData?.cropName || memberData?.crops?.[0]?.name) : '') || 'Sầu riêng Ri6',
          unit: 'kg',
          quantity: memberData?.scale || prev.product.quantity || '5000',
          price: finalProduct ? finalProduct.price.replace(/[^\d]/g, '') : '45000',
          note: prev.product.note || '',
          qualityStandard: prev.product.qualityStandard || 'VietGAP'
        }
      };
    });
  }, [productId]);


  const [contractNumber, setContractNumber] = useState(() => {
    const saved = localStorage.getItem('contractNumber');
    return saved ? parseInt(saved, 10) : 1;
  });

  const currentYear = new Date().getFullYear();
  const formattedContractNumber = `${contractNumber.toString().padStart(2, '0')}/${currentYear}/HĐHTSXNN`;

  const handleUpdate = (section: 'seller' | 'buyer', field: string, value: string) => {
    setContract(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleProductUpdate = (field: string, value: string) => {
    setContract(prev => {
      const updatedProduct = { ...prev.product, [field]: value };
      const q = parseFloat(updatedProduct.quantity) || 0;
      const p = parseFloat(updatedProduct.price) || 0;
      const total = q * p;
      return {
        ...prev,
        product: updatedProduct,
        totalInWords: convertNumberToVietnameseWords(total)
      };
    });
  };

  const calculateTotal = () => {
    const q = parseFloat(contract.product.quantity) || 0;
    const p = parseFloat(contract.product.price) || 0;
    return q * p;
  };

  const docSoTienBangChu = (soTien: number): string => {
    if (soTien === 0) return 'Không đồng';
    
    const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const Tien = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
    let str = "";
    let temp = soTien;
    let blocks = [];
    while (temp > 0) {
      blocks.push(temp % 1000);
      temp = Math.floor(temp / 1000);
    }

    const doc3ChuSo = (n: number, isLast: boolean): string => {
      let tram = Math.floor(n / 100);
      let chuc = Math.floor((n % 100) / 10);
      let donvi = n % 10;
      let s = "";
      if (tram > 0 || !isLast) {
        s += ChuSo[tram] + " trăm ";
      }
      if (chuc === 0) {
        if (donvi > 0 && (tram > 0 || !isLast)) {
          s += "lẻ ";
        }
      } else if (chuc === 1) {
        s += "mười ";
      } else {
        s += ChuSo[chuc] + " mươi ";
      }
      if (donvi === 1) {
        if (chuc > 1) s += "mốt";
        else s += "một";
      } else if (donvi === 5) {
        if (chuc > 0) s += "lăm";
        else s += "năm";
      } else if (donvi > 0) {
        s += ChuSo[donvi];
      }
      return s.trim();
    };

    for (let i = 0; i < blocks.length; i++) {
      let blockVal = blocks[i];
      if (blockVal > 0) {
        let bStr = doc3ChuSo(blockVal, i === blocks.length - 1);
        str = bStr + " " + Tien[i] + " " + str;
      }
    }
    
    str = str.trim() + " đồng chẵn";
    return str.charAt(0).toUpperCase() + str.slice(1);
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
      status: 'draft',
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
      enterpriseName: contract.buyer.name || 'HTX Cà phê Cầu Đất',
      taxCode: contract.buyer.taxCode || '0312345678',
      coopName: contract.seller.name || 'Nông dân',
      cooperativeId: contract.buyer.id || 'HTX-001',
      product: contract.product.id || '1',
      cropName: contract.product.name || 'Nông sản',
      qualityStandard: contract.product.qualityStandard || 'VietGAP',
      totalVolume: `${qty.toLocaleString('vi-VN')} ${contract.product.unit || 'kg'}`,
      unitPrice: `${priceVal.toLocaleString('vi-VN')} VND / ${contract.product.unit || 'kg'}`,
      
      // Payment details
      paymentMethod: contract.paymentMethod,
      paymentType: contract.paymentType,
      paymentPhase1: contract.paymentPhase1 || '30%',
      paymentPhase2: contract.paymentPhase2 || '70%',
      paymentPhase1Status: 'pending',
      paymentPhase2Status: 'pending',
      amount: `${(totalVal / 1000000).toFixed(1)} Triệu`,
      
      // Delivery & logistics
      deliveryTime: contract.deliveryTime || 'Trong vòng 15 ngày lấy hàng',
      deliveryLocation: contract.deliveryLocation,
      transportCostBy: contract.transportCostBy,
      loadingCostBy: contract.loadingCostBy,
      
      // Warranty & penalties
      penaltyPercentage: contract.penaltyPercentage || '8',
      contractCopies: contract.contractCopies || '2',
      notaryFeeBy: contract.notaryFeeBy || 'Hai bên',
      disputeResolutionCourt: contract.disputeResolutionCourt,
      validFrom: contract.validFrom,
      validTo: contract.validTo,
      
      // Signatures
      sellerRep: contract.seller.rep,
      buyerRep: contract.buyer.rep,
      type: 'individual'
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

    // Save to vietagri_contracts (simple structure for AdminDashboard)
    const newContractSimple = {
      id: newContractId,
      contractNo: formattedContractNumber,
      party: contract.seller.name,
      cropName: contract.product.name,
      qty: `${qty.toLocaleString('vi-VN')} ${contract.product.unit || 'kg'} ${contract.product.name}`,
      status: 'Chờ nông dân ký',
      amount: `${(totalVal / 1000000).toFixed(1)} Triệu`,
      type: 'individual',
      cooperativeId: contract.buyer.id || 'HTX-001',
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

    // Save to vietagri_contracts_v3 (for CustomerDashboard to display)
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

    // Show beautiful success overlay
    setSavedContract(newContractV2);
    setIsSaved(true);
  };

  const startSignProcess = () => {
    setPinInput('');
    setPinError('');
    setIsSignProcessing(false);
    setSignProgress(0);
    setSignMessage('');
    setSignSuccess(false);
    setIsSigningModalOpen(true);
  };

  const handleAdminSign = () => {
    if (pinInput !== '123456') {
      setPinError('Mã PIN chữ ký số không chính xác (Mặc định: 123456)');
      return;
    }

    setPinError('');
    setIsSignProcessing(true);
    setSignProgress(10);
    setSignMessage('Đang kết nối USB Token...');

    const steps = [
      { prg: 30, msg: 'Đang trích xuất chứng thư số (RSA 2048-bit)...' },
      { prg: 60, msg: 'Đang băm nội dung hợp đồng bằng mã hóa SHA-256...' },
      { prg: 85, msg: 'Đang nhúng mốc thời gian pháp lý (Timestamping)...' },
      { prg: 100, msg: 'Đã niêm phong tệp và ký số thành công!' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setSignProgress(steps[current].prg);
        setSignMessage(steps[current].msg);
        current++;
      } else {
        clearInterval(interval);
        finishSigning();
      }
    }, 800);
  };

  const finishSigning = () => {
    setSignSuccess(true);
    
    // Update contract status to 'completed' / 'Đã hoàn tất'
    const contractId = savedContract?.id;
    if (!contractId) return;

    // Update V2
    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
    if (rawV2) {
      try {
        let v2 = JSON.parse(rawV2);
        v2 = v2.map((c: any) => String(c.id) === String(contractId) ? { ...c, status: 'completed' } : c);
        localStorage.setItem('vietagri_contracts_v2', JSON.stringify(v2));
      } catch (e) {}
    }

    // Update V3
    const rawV3 = localStorage.getItem('vietagri_contracts_v3');
    if (rawV3) {
      try {
        let v3 = JSON.parse(rawV3);
        v3 = v3.map((c: any) => String(c.id) === String(contractId) ? { ...c, status: 'completed' } : c);
        localStorage.setItem('vietagri_contracts_v3', JSON.stringify(v3));
      } catch (e) {}
    }

    // Update Simple
    const rawSimple = localStorage.getItem('vietagri_contracts');
    if (rawSimple) {
      try {
        let simple = JSON.parse(rawSimple);
        simple = simple.map((c: any) => String(c.id) === String(contractId) ? { ...c, status: 'Đã hoàn tất' } : c);
        localStorage.setItem('vietagri_contracts', JSON.stringify(simple));
      } catch (e) {}
    }

    // Update local state
    setSavedContract({ ...savedContract, status: 'completed' });
  };

  if (isSaved && savedContract) {
    const dVal = contract.date ? contract.date.split('/') : [];
    const docDay = dVal[0] || new Date().getDate();
    const docMonth = dVal[1] || (new Date().getMonth() + 1);
    const docYear = dVal[2] || new Date().getFullYear();

    return (
      <>
      <div className="min-h-screen bg-slate-100 py-6 px-4 font-sans text-slate-900 print:bg-white print:p-0 overflow-hidden print:overflow-visible">
        
        <div className="max-w-[1000px] mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/60 print:shadow-none print:border-none print:rounded-none animate-fade-in h-[calc(100vh-3rem)] print:h-auto flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 print:hidden shrink-0">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mục duyệt hợp đồng điện tử</span>
             <h3 className="text-xl font-black text-[#004d40] flex items-center gap-2">
               <FileText className="text-[#004d40]" size={22} />
               CHI TIẾT HỢP ĐỒNG SỐ #{savedContract.contractNo}
             </h3>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              @page { size: A4 portrait; margin: 0 !important; }
              body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .a4-page { box-shadow: none !important; margin: 0 !important; border: none !important; width: 210mm !important; min-height: 297mm !important; }
            }
            .a4-page {
              width: 100%;
              margin: 0 auto;
              background: white;
              padding: 25mm 20mm 25mm 32mm;
              font-family: "Times New Roman", Times, serif;
              box-sizing: border-box;
              color: #000;
              line-height: 1.5;
              position: relative;
            }
            .vn-title {
              font-family: "Times New Roman", Times, serif;
              font-size: 15pt;
              font-weight: bold;
              text-transform: uppercase;
              text-align: center;
              margin-top: 10pt;
              margin-bottom: 4pt;
            }
            .vn-paragraph {
              font-family: "Times New Roman", Times, serif;
              font-size: 13pt;
              line-height: 1.5;
              text-align: justify;
              margin-bottom: 6pt;
            }
            .vn-heading-article {
              font-family: "Times New Roman", Times, serif;
              font-size: 13.5pt;
              font-weight: bold;
              margin-top: 10pt;
              margin-bottom: 5pt;
            }
            .quoc-hieu { font-size: 12.5pt; font-weight: bold; text-transform: uppercase; }
            .tieu-ngu { font-size: 13pt; font-weight: bold; margin-top: 2pt; }
            
            .custom-scrollbar::-webkit-scrollbar { width: 5px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { 
              background: #e2e8f0; 
              border-radius: 10px; 
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
          `}} />

          {/* Scrollable Viewport for the A4 contract */}
          <div className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-12 print:p-0 print:bg-white custom-scrollbar print:overflow-visible overflow-x-hidden">
            <div className="space-y-8 print:space-y-0 max-w-[900px] mx-auto">
              
              {/* Page 1 */}
              <div className="a4-page rounded-[1.5rem] md:rounded-[2rem] border border-slate-200/80 shadow-2xl print:shadow-none print:border-none print:rounded-none">
                <div className="text-center mb-6">
                  <h4 className="quoc-hieu">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                  <h5 className="tieu-ngu">Độc lập - Tự do - Hạnh phúc</h5>
                  <div className="w-40 h-[1.5px] bg-black mx-auto mt-2"></div>
                </div>

                <div className="text-center mb-8">
                  <h1 className="vn-title">HỢP ĐỒNG HỢP TÁC SẢN XUẤT NÔNG NGHIỆP</h1>
                  <p style={{ fontSize: '12pt', fontWeight: 'bold' }} className="text-center">
                    Số: {savedContract.contractNo}
                  </p>
                </div>

                <div className="mb-6 italic border-l-2 border-slate-300 pl-4" style={{ fontSize: '11pt' }}>
                  <p>– Căn cứ Bộ luật Dân sự 2015;</p>
                  <p>– Căn cứ Luật Thương mại 2005;</p>
                  <p>– Căn cứ nhu cầu và khả năng thực tế của các bên.</p>
                </div>

                <p className="vn-paragraph indent-10">
                  Hôm nay, ngày {docDay} tháng {docMonth} năm {docYear}, tại {contract.location || 'Lâm Đồng'}, chúng tôi gồm:
                </p>

                {/* Party Information Cards */}
                <div className="space-y-6 pt-2 font-sans">
                   <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-3">
                      <div className="font-bold text-[#004d40] uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#004d40]" /> BÊN BÁN (Bên A)
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700 leading-normal text-[11px]">
                        <div className="md:col-span-2"><strong>Họ và tên nông dân:</strong> {contract.seller.name}</div>
                        <div className="md:col-span-2"><strong>Số CCCD:</strong> {contract.seller.taxCode}</div>
                        <div className="md:col-span-2"><strong>Địa chỉ cư trú:</strong> {contract.seller.address}</div>
                        <div><strong>Người đại diện:</strong> {contract.seller.rep}</div>
                        <div><strong>Chức danh:</strong> {contract.seller.position}</div>
                        <div><strong>CMND/CCCD:</strong> {contract.seller.id || '...'}</div>
                        <div><strong>Cấp ngày:</strong> {contract.seller.idDate || '...'} (tại {contract.seller.idPlace || '...'})</div>
                        <div><strong>Số điện thoại:</strong> {contract.seller.phone}</div>
                        <div><strong>Fax:</strong> {contract.seller.fax || '...'}</div>
                        <div className="md:col-span-2"><strong>Tài khoản ngân hàng số:</strong> {contract.seller.bankAcc} <strong>Mở tại ngân hàng:</strong> {contract.seller.bankName}</div>
                      </div>
                    </div>

                    <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-3">
                      <div className="font-bold text-indigo-700 uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> BÊN MUA (Bên B)
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700 leading-normal text-[11px]">
                        <div className="md:col-span-2"><strong>Tên doanh nghiệp:</strong> {contract.buyer.name}</div>
                        <div className="md:col-span-2"><strong>Mã số doanh nghiệp:</strong> {contract.buyer.taxCode}</div>
                        <div className="md:col-span-2"><strong>Địa chỉ trụ sở:</strong> {contract.buyer.address}</div>
                        <div><strong>Người đại diện:</strong> {contract.buyer.rep}</div>
                        <div><strong>Chức danh:</strong> {contract.buyer.position}</div>
                        <div><strong>CMND/CCCD:</strong> {contract.buyer.id || '...'}</div>
                        <div><strong>Cấp ngày:</strong> {contract.buyer.idDate || '...'} (tại {contract.buyer.idPlace || '...'})</div>
                        <div><strong>Số điện thoại:</strong> {contract.buyer.phone}</div>
                        <div><strong>Fax:</strong> {contract.buyer.fax || '...'}</div>
                        <div className="md:col-span-2"><strong>Tài khoản ngân hàng số:</strong> {contract.buyer.bankAcc} <strong>Mở tại ngân hàng:</strong> {contract.buyer.bankName}</div>
                      </div>
                    </div>
                </div>

                <p className="vn-paragraph italic font-semibold mt-6 text-slate-800">
                  Hai bên cùng thỏa thuận ký kết hợp đồng hợp tác sản xuất nông nghiệp với các điều khoản sau:
                </p>

                <div className="pt-2">
                   <h4 className="vn-heading-article">Điều 1: Tên hàng hóa, số lượng, chất lượng, giá trị hợp đồng</h4>
                   <p className="vn-paragraph">Bên A cung ứng cho bên B sản phẩm nông nghiệp sau đây:</p>
                   <div className="border border-slate-200 rounded-xl overflow-hidden mb-4 font-sans">
                    <table className="w-full text-left text-[10.5px] border-collapse bg-white">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 uppercase font-black text-slate-500">
                          <th className="p-2 text-center w-[6%] border-r border-slate-200">STT</th>
                          <th className="p-2 border-r border-slate-200">Tên Sản Phẩm</th>
                          <th className="p-2 text-center border-r border-slate-200">Đơn vị</th>
                          <th className="p-2 text-center border-r border-slate-200">Số lượng</th>
                          <th className="p-2 text-right border-r border-slate-200">Đơn giá (VNĐ)</th>
                          <th className="p-2 text-right">Thành tiền (VNĐ)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 text-center border-r border-slate-200">1</td>
                          <td className="p-2 font-bold text-slate-800 border-r border-slate-200">{contract.product.name}</td>
                          <td className="p-2 text-center border-r border-slate-200">{contract.product.unit || 'kg'}</td>
                          <td className="p-2 text-center font-bold text-slate-900 border-r border-slate-200">{parseFloat(contract.product.quantity || '0').toLocaleString('vi-VN')}</td>
                          <td className="p-2 text-right border-r border-slate-200">{parseFloat(contract.product.price || '0').toLocaleString('vi-VN')}</td>
                          <td className="p-2 text-right font-black text-[#004d40]">{(parseFloat(contract.product.quantity || '0') * parseFloat(contract.product.price || '0')).toLocaleString('vi-VN')}</td>
                        </tr>
                        <tr className="bg-slate-50 border-t border-slate-200">
                          <td colSpan={5} className="p-2 text-right font-bold text-slate-700">Tổng giá trị tạm tính (VNĐ):</td>
                          <td className="p-2 text-right font-black text-rose-600">{(parseFloat(contract.product.quantity || '0') * parseFloat(contract.product.price || '0')).toLocaleString('vi-VN')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] font-sans space-y-1 mb-4">
                    <p><strong>Tổng cộng bằng tiền:</strong> {(parseFloat(contract.product.quantity || '0') * parseFloat(contract.product.price || '0')).toLocaleString('vi-VN')} đồng Việt Nam.</p>
                    <p><strong>Bằng chữ:</strong> <span className="italic font-bold text-slate-900 underline">{docSoTienBangChu(parseFloat(contract.product.quantity || '0') * parseFloat(contract.product.price || '0'))}</span></p>
                  </div>
                </div>
              </div>

              {/* Page 2 */}
              <div className="a4-page rounded-[1.5rem] md:rounded-[2rem] border border-slate-200/80 shadow-2xl print:shadow-none print:border-none print:rounded-none">
                <div className="space-y-4 pt-1">
                  <div>
                     <h4 className="vn-heading-article">Điều 2: Thanh toán</h4>
                     <p className="vn-paragraph">1. Bên B phải thanh toán cho Bên A số tiền ghi tại Điều 1 của Hợp đồng này dứt điểm muộn nhất theo thỏa thuận về phương thức thanh toán.</p>
                     <p className="vn-paragraph">2. Bên B thanh toán cho Bên A theo hình thức: <span className="font-bold underline">{contract.paymentMethod}</span>.</p>
                     <p className="vn-paragraph">3. {(() => {
                        if (contract.paymentType === '"Tiền tươi thóc thật" (Thanh toán ngay khi giao hàng)') {
                          return "Thanh toán ngay khi giao nhận: Cân hàng xong, chốt số ký thực tế là thanh toán 100%.";
                        } else if (contract.paymentType === '"Thanh toán theo tiến độ Vụ Mùa" (Đặt cọc giữ ruộng)') {
                          return `Đặt cọc giữ ruộng: Bên B ứng trước ${contract.paymentPhase1 || '20%'} đặt cọc; phần còn lại ${contract.paymentPhase2 || '80%'} thanh toán sau thu hoạch.`;
                        } else {
                          const days = contract.paymentDate === 'Chốt sổ sau 3 ngày' ? '3 ngày' : contract.paymentDate === 'Chốt sổ sau 5 ngày' ? '5 ngày' : '7 ngày';
                          return `Neo tiền ngắn hạn: Giao hàng xong, thanh toán trong vòng ${days}.`;
                        }
                     })()}</p>
                  </div>

                  <div>
                    <h4 className="vn-heading-article">Điều 3: Thời gian, địa điểm, phương thức giao hàng</h4>
                    <p className="vn-paragraph">1. Thời gian bắt đầu: {contract.startTime || `ngày ${docDay} tháng ${docMonth} năm ${docYear}`} và kết thúc vào {contract.endTime || '...'}.</p>
                    <p className="vn-paragraph">2. Địa điểm giao nhận: {contract.deliveryLocation || 'Tại vùng trồng/kho của Bên A'}.</p>
                    <p className="vn-paragraph">3. Phương tiện vận chuyển và chi phí bốc xếp do hai bên thỏa thuận phối hợp nhịp nhàng.</p>
                  </div>

                  <div>
                    <h4 className="vn-heading-article">Điều 4: Trách nhiệm của các bên</h4>
                    <p className="vn-paragraph">1. Bên A có trách nhiệm sản xuất nông sản đúng quy trình kỹ thuật, đảm bảo tiêu chuẩn {contract.product.qualityStandard || 'VietGAP'}.</p>
                    <p className="vn-paragraph">2. Bên B cam kết thu mua theo đúng sản lượng và giá cả đã thỏa thuận.</p>
                  </div>

                  <div>
                    <h4 className="vn-heading-article">Điều 5: Bảo hành và hướng dẫn sử dụng hàng hóa</h4>
                    <p className="vn-paragraph">Bên A có trách nhiệm bảo hành chất lượng sản phẩm nông nghiệp trong suốt quá trình thu hoạch và bàn giao cho Bên B.</p>
                  </div>

                  <div>
                    <h4 className="vn-heading-article">Điều 6: Ngưng thanh toán tiền mua hàng</h4>
                    <p className="vn-paragraph">Bên B có quyền tạm ngừng thanh toán nếu có bằng chứng về việc Bên A giao hàng không phù hợp với tiêu chuẩn chất lượng cam kết cho đến khi Bên A khắc phục.</p>
                  </div>

                  <div>
                    <h4 className="vn-heading-article">Điều 7: Điều khoản phạt vi phạm hợp đồng</h4>
                    <p className="vn-paragraph">Bên nào không thực hiện hoặc đơn phương hủy bỏ hợp đồng mà không có lý do chính đáng thì sẽ bị phạt tới <strong className="font-bold">{contract.penaltyPercentage || '8'}%</strong> giá trị của hợp đồng bị vi phạm.</p>
                  </div>

                  <div>
                    <h4 className="vn-heading-article">Điều 8: Bất khả kháng và giải quyết tranh chấp</h4>
                    <p className="vn-paragraph">Mọi tranh chấp phát sinh sẽ được hai bên hòa giải thương lượng. Nếu không thể thương thảo, mọi tranh chấp sẽ được giải quyết tại {contract.displayCourt || contract.disputeResolutionCourt || 'Tòa án nhân dân có thẩm quyền'}.</p>
                  </div>

                  <div>
                    <h4 className="vn-heading-article">Điều 9: Điều khoản chung</h4>
                    <p className="vn-paragraph">
                      {(() => {
                          const fromD = contract.validFrom ? `ngày ${contract.validFrom.split('-')[2]} tháng ${contract.validFrom.split('-')[1]} năm ${contract.validFrom.split('-')[0]}` : `ngày ${docDay} tháng ${docMonth} năm ${docYear}`;
                          const toD = contract.validTo ? `ngày ${contract.validTo.split('-')[2]} tháng ${contract.validTo.split('-')[1]} năm ${contract.validTo.split('-')[0]}` : `ngày 31 tháng 12 năm ${docYear}`;
                          return `1. Hợp đồng này có hiệu lực từ ${fromD} đến ${toD}.`;
                      })()}
                    </p>
                    <p className="vn-paragraph">2. Hợp đồng được lập thành {contract.contractCopies || '2'} bản, mỗi bên giữ 01 bản có giá trị pháp lý như nhau.</p>
                    <p className="vn-paragraph">3. Hợp đồng này thay thế mọi thỏa thuận trước đây.</p>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-2 text-center text-xs font-bold gap-8 select-none border-t border-slate-200 pt-8" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div className="space-y-4 flex flex-col items-center">
                    <div>
                      <p style={{ fontSize: '13.5pt', fontWeight: 'bold' }} className="uppercase tracking-wide">ĐẠI DIỆN BÊN A</p>
                      <p className="text-[10px] text-slate-400 font-sans italic font-normal mt-1">(Ký, ghi rõ họ tên, đóng dấu)</p>
                    </div>
                    {savedContract.status === 'awaiting_admin_signature' || 
                     savedContract.status === 'Đang chờ ký (Admin)' || 
                     savedContract.status === 'completed' || 
                     savedContract.status === 'signed' || 
                     savedContract.status === 'Nông dân đã ký' || 
                     (typeof savedContract.status === 'string' && (savedContract.status.includes('đã ký') || savedContract.status.includes('admin_signature'))) ? (
                      <div className="my-2 border border-red-500 rounded p-2 text-left text-[9px] text-red-600 font-sans max-w-[240px] bg-red-50/50 relative flex flex-col gap-0.5 select-text normal-case">
                        <span className="uppercase text-red-700 tracking-wider font-extrabold text-[9.5px] border-b border-red-200 pb-0.5">✔ CHỮ KÝ SỐ HỢP LỆ</span>
                        <span className="font-bold">Ký bởi: {contract.seller.rep}</span>
                        <span>Mã định danh CCCD: {contract.seller.id || contract.seller.taxCode || '1234567890'}</span>
                        <span className="font-mono text-[8px] tracking-tight">Mã giao dịch: {savedContract.farmerSignatureCode || 'SIG-COOP-' + Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        <span>Thời gian: {savedContract.createdAt ? new Date(savedContract.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}</span>
                      </div>
                    ) : (
                      <div className="h-[120px] flex items-center justify-center text-slate-300 italic text-[10px] uppercase font-sans tracking-widest mt-2">
                        (Chưa ký số)
                      </div>
                    )}
                    <div>
                      <p className="font-bold" style={{ fontSize: '13pt' }}>{contract.seller.rep}</p>
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col items-center">
                    <div>
                      <p style={{ fontSize: '13.5pt', fontWeight: 'bold' }} className="uppercase tracking-wide">ĐẠI DIỆN BÊN B</p>
                      <p className="text-[10px] text-slate-400 font-sans italic font-normal mt-1">(Ký, ghi rõ họ tên, đóng dấu)</p>
                    </div>
                    {savedContract.status === 'completed' ? (
                      <div className="my-2 border border-emerald-600 rounded p-2 text-left text-[9px] text-emerald-700 font-sans max-w-[240px] bg-emerald-50/50 relative flex flex-col gap-0.5 select-text normal-case">
                        <span className="uppercase text-emerald-800 tracking-wider font-extrabold text-[9.5px] border-b border-emerald-200 pb-0.5">✔ CHỮ KÝ SỐ COOP-HSM</span>
                        <span className="font-bold">Ký bởi: {contract.buyer.rep}</span>
                        <span>Chức vụ: {contract.buyer.position || 'Đại diện HTX'}</span>
                        <span className="font-mono text-[8px] tracking-tight">Số hiệu: HSM-{savedContract.id?.slice(-6).toUpperCase() || 'COOP-2026'}</span>
                        <span>Thời gian: {new Date().toLocaleString('vi-VN')}</span>
                      </div>
                    ) : (
                      <div className="h-[120px] flex items-center justify-center text-slate-300 italic text-[10px] uppercase font-sans tracking-widest mt-2">
                        (Chờ ký số...)
                      </div>
                    )}
                    <div>
                      <p className="font-bold" style={{ fontSize: '13pt' }}>{contract.buyer.rep}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-white border-t border-slate-100 flex justify-center flex-wrap gap-4 print:hidden shrink-0">
             <button 
               type="button"
               onClick={() => navigate('/admin', { replace: true, state: { activeTab: 'contracts' } })}
               className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-200"
             >
               <ChevronLeft size={16} /> Quay lại dashboard
             </button>
             
             {savedContract.status === 'awaiting_farmer_signature' ? (

               <div className="px-8 py-3 bg-amber-50 text-amber-700 rounded-xl font-bold text-xs uppercase tracking-widest border border-amber-200 flex items-center gap-2 animate-pulse">
                 <Clock size={16} /> Đang chờ nông dân ký duyệt...
               </div>
             ) : savedContract.status === 'signed' || savedContract.status === 'awaiting_admin_signature' || savedContract.status === 'Đang chờ ký (Admin)' || savedContract.status === 'Nông dân đã ký' || (typeof savedContract.status === 'string' && (savedContract.status.includes('đã ký') || savedContract.status.includes('admin_signature'))) ? (
                <button 
                  type="button"
                  onClick={startSignProcess}
                  className="px-8 py-3 bg-[#004d40] hover:bg-[#003d33] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-[#004d40]/20 flex items-center gap-2"
                >
                  <FileSignature size={16} /> Thực hiện ký số (Admin)
                </button>
             ) : savedContract.status === 'completed' ? (
                <div className="px-8 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest border border-emerald-200 flex items-center gap-2">
                  <CheckCircle size={16} /> Hợp đồng đã ký kết hoàn tất
                </div>
             ) : (
                <button 
                  type="button"
                  onClick={() => {
                    // 1. Approve the pending registration/request if found
                    const memberId = productId;
                    let foundCropApproval: any = null;
                    
                    // Update pending_registration_members
                    const rawPending = localStorage.getItem('pending_registration_members');
                    if (rawPending) {
                      try {
                        let pending = JSON.parse(rawPending);
                        if (Array.isArray(pending)) {
                          pending = pending.map((p: any) => {
                            if (String(p.id) === String(memberId)) {
                              foundCropApproval = p;
                              return { ...p, status: 'approved' };
                            }
                            return p;
                          });
                          localStorage.setItem('pending_registration_members', JSON.stringify(pending));
                        }
                      } catch (e) {
                          console.error(e);
                      }
                    }

                    // If it was a crop approval request, also add the crop to the farmer's active profile
                    if (foundCropApproval && foundCropApproval.type === 'crop_approval') {
                      try {
                        const savedFarmersRaw = localStorage.getItem('vietagri_active_farmers');
                        if (savedFarmersRaw) {
                          let farmersList = JSON.parse(savedFarmersRaw);
                          if (Array.isArray(farmersList)) {
                            const farmerIndex = farmersList.findIndex((f: any) => f.phone === foundCropApproval.phone);
                            if (farmerIndex !== -1) {
                              if (!farmersList[farmerIndex].crops) farmersList[farmerIndex].crops = [];
                              const alreadyHas = farmersList[farmerIndex].crops.some((cr: any) => cr.name === foundCropApproval.cropName);
                              if (!alreadyHas) {
                                farmersList[farmerIndex].crops.push({
                                  name: foundCropApproval.cropName,
                                  type: foundCropApproval.cropType === 'veggie' || foundCropApproval.cropType === 'rice' ? 'short-term' : 'perennial',
                                  area: foundCropApproval.area
                                });
                                localStorage.setItem('vietagri_active_farmers', JSON.stringify(farmersList));
                              }
                            }
                          }
                        }
                      } catch (err) {
                        console.error("Error adding crop to active farmers:", err);
                      }
                    }

                    // Update vietagri_farmer_requests if needed
                    const rawRequests = localStorage.getItem('vietagri_farmer_requests');
                    if (rawRequests) {
                        try {
                            let requests = JSON.parse(rawRequests);
                            if (Array.isArray(requests)) {
                                const cleanId = String(memberId).replace('REQ-', '');
                                requests = requests.map((r: any) => 
                                    String(r.id) === cleanId ? { ...r, status: 'approved' } : r
                                );
                                localStorage.setItem('vietagri_farmer_requests', JSON.stringify(requests));
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    // 2. Update status in localStorage
                    const contractId = savedContract ? savedContract.id : productId;
                    
                    // Update vietagri_contracts_v2
                    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
                    if (rawV2) {
                        try {
                            let contractsV2 = JSON.parse(rawV2);
                            contractsV2 = contractsV2.map((c: any) => 
                                String(c.id) === String(contractId) ? { ...c, status: 'awaiting_farmer_signature' } : c
                            );
                            localStorage.setItem('vietagri_contracts_v2', JSON.stringify(contractsV2));
                        } catch (e) { console.error(e); }
                    }

                    // Update vietagri_contracts_v3
                    const rawV3 = localStorage.getItem('vietagri_contracts_v3');
                    if (rawV3) {
                        try {
                            let contractsV3 = JSON.parse(rawV3);
                            contractsV3 = contractsV3.map((c: any) => 
                                String(c.id) === String(contractId) ? { ...c, status: 'awaiting_farmer_signature' } : c
                            );
                            localStorage.setItem('vietagri_contracts_v3', JSON.stringify(contractsV3));
                        } catch (e) { console.error(e); }
                    }

                    // Update vietagri_contracts
                    const rawSimple = localStorage.getItem('vietagri_contracts');
                    if (rawSimple) {
                        try {
                            let contractsSimple = JSON.parse(rawSimple);
                            contractsSimple = contractsSimple.map((c: any) => 
                                String(c.id) === String(contractId) ? { ...c, status: 'Chờ nông dân ký' } : c
                            );
                            localStorage.setItem('vietagri_contracts', JSON.stringify(contractsSimple));
                        } catch (e) { console.error(e); }
                    }

                    // Điều hướng về dashboard
                    navigate('/admin', { 
                      replace: true,
                      state: { 
                        activeTab: 'contracts', 
                        subTab: 'all',
                        toast: 'Đã gửi hợp đồng thành công!'
                      } 
                    });
                  }}
                  className="px-8 py-2.5 bg-[#004d40] hover:bg-[#003d33] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
                >
                  <Send size={16} /> Gửi Hợp đồng hợp tác
                </button>
             )}
          </div>
        </div>
      </div>
      {/* Admin Digital Signing Modal */}
      <AnimatePresence>
        {isSigningModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" 
              onClick={() => !isSignProcessing && !signSuccess && setIsSigningModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100"
            >
              <div className="p-8">
                {signSuccess ? (
                  <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck size={44} />
                    </div>
                    <h3 className="text-2xl font-black text-[#004d40] mb-2 font-sans tracking-tight">Ký số thành công!</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">Hợp đồng đã được xác thực mốc thời gian và lưu trữ an toàn trong chuỗi cung ứng HTX.</p>
                    <button 
                      onClick={() => setIsSigningModalOpen(false)}
                      className="w-full py-4 bg-[#004d40] hover:bg-[#003d33] text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg"
                    >
                      Hoàn tất & Đóng
                    </button>
                  </div>
                ) : isSignProcessing ? (
                  <div className="py-8 space-y-8">
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-6">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                        <div 
                          className="absolute inset-0 border-4 border-[#004d40] rounded-full border-t-transparent animate-spin"
                          style={{ borderRightColor: signProgress > 40 ? '#004d40' : 'transparent', borderBottomColor: signProgress > 80 ? '#004d40' : 'transparent' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-[#004d40]">
                          {signProgress}%
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-forest animate-pulse">{signMessage}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-2">Vui lòng không đóng trình duyệt...</p>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${signProgress}%` }}
                        className="h-full bg-[#004d40]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-12 h-12 bg-emerald-50 text-[#004d40] rounded-2xl flex items-center justify-center shrink-0">
                         <FileSignature size={24} />
                       </div>
                       <div>
                         <h3 className="text-xl font-black text-[#004d40] font-sans tracking-tight">Ký số bảo mật</h3>
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Xác nhận quyền ký Bên Mua (Bên B)</p>
                       </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] text-slate-600 leading-relaxed font-medium italic">
                      Bạn đang thực hiện ký số điện tử với tư cách là người đại diện HTX. Hành động này có giá trị pháp lý tương đương con dấu và chữ ký tay.
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Nhập mã PIN chữ ký số</label>
                      <input 
                        type="password"
                        placeholder="••••••"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-black tracking-[1em] focus:border-[#004d40] focus:bg-white outline-none transition-all placeholder:tracking-normal placeholder:text-slate-200"
                        maxLength={6}
                        autoFocus
                      />
                      {pinError && <p className="text-[10px] text-[#004d40] font-bold ml-1">{pinError}</p>}
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsSigningModalOpen(false)}
                        className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold uppercase tracking-widest text-[10px] rounded-2xl transition-all"
                      >
                        Hủy bỏ
                      </button>
                      <button 
                        onClick={handleAdminSign}
                        className="flex-[2] py-4 bg-[#004d40] hover:bg-[#003d33] text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-lg shadow-[#004d40]/20"
                      >
                        Xác nhận ký số
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </>
    );
  }

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
            <h1 className="text-xl font-black uppercase text-[#004d40]">HỢP ĐỒNG HỢP TÁC SẢN XUẤT NÔNG NGHIỆP</h1>
            <p className="text-sm font-bold text-slate-400 mt-2">Số: {formattedContractNumber}</p>
          </div>

          {/* Section: Common Info */}
          <section className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h2 className="text-xs font-black uppercase text-slate-400 mb-6 flex items-center gap-2">
              <FileText size={16} /> Thông tin chung
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Ngày ký" value={contract.date} onChange={(val: any) => setContract({...contract, date: val})} showInfo={activeInfo === 'date'} onToggleInfo={() => setActiveInfo(activeInfo === 'date' ? null : 'date')} info="Ngày hai bên chính thức đặt bút ký kết. Mặc định tự sinh là hôm nay, có thể thay đổi linh hoạt nếu ký lùi ngày hoặc ký trước." />
              <InputField label="Tại địa chỉ" value={contract.location} onChange={(val: any) => setContract({...contract, location: val})} showInfo={activeInfo === 'location'} onToggleInfo={() => setActiveInfo(activeInfo === 'location' ? null : 'location')} info="Tỉnh thành hoặc địa chỉ cơ sở nơi lập và thực hiện ký kết văn bản hợp đồng này." />
            </div>
          </section>

          {/* Section: Parties */}
          <div className="grid md:grid-cols-2 gap-8">
            <section className="p-6 border border-slate-200 rounded-2xl">
              <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Bên Bán (Bên A)</h2>
              <div className="space-y-4">
                <InputField required label="Họ và tên nông dân" info="Điền chính xác họ và tên đầy đủ của Nông dân ký kết. Ví dụ: Nguyễn Văn Hợp." value={contract.seller.name} onChange={(v: string) => handleUpdate('seller', 'name', v)} showInfo={activeInfo === 'seller.name'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.name' ? null : 'seller.name')} />
                <InputField type="number" required label="Số CCCD" info="Số Căn cước công dân (12 chữ số) chính xác của Nông dân để làm cơ sở pháp lý và xác minh danh tính trên hợp đồng." value={contract.seller.taxCode} onChange={(v: string) => handleUpdate('seller', 'taxCode', v)} showInfo={activeInfo === 'seller.taxCode'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.taxCode' ? null : 'seller.taxCode')} />
                <InputField required label="Địa chỉ cư trú" info="Địa chỉ nơi cư trú thường trú hoặc tạm trú hiện tại của Nông dân ký kết hợp tác." value={contract.seller.address} onChange={(v: string) => handleUpdate('seller', 'address', v)} showInfo={activeInfo === 'seller.address'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.address' ? null : 'seller.address')} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField required label="Người đại diện" info="Họ và tên người ký chính thức (mặc định là Nông dân làm đại diện hoặc người được ủy quyền hợp pháp)." value={contract.seller.rep} onChange={(v: string) => handleUpdate('seller', 'rep', v)} showInfo={activeInfo === 'seller.rep'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.rep' ? null : 'seller.rep')} />
                    <InputField required label="Chức danh" info="Ghi rõ vị thế/chức danh. Ví dụ: Chủ hộ, Đại diện hộ nông dân, Cá nhân..." value={contract.seller.position} onChange={(v: string) => handleUpdate('seller', 'position', v)} showInfo={activeInfo === 'seller.position'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.position' ? null : 'seller.position')} />
                </div>
                <InputField type="number" required label="Số điện thoại" info="Số điện thoại liên lạc chính thức của nông dân để trao đổi kế hoạch, điều xe thu gom nông sản." value={contract.seller.phone} onChange={(v: string) => handleUpdate('seller', 'phone', v)} showInfo={activeInfo === 'seller.phone'} onToggleInfo={() => setActiveInfo(activeInfo === 'seller.phone' ? null : 'seller.phone')} />
              </div>
            </section>

            <section className="p-6 border border-slate-200 rounded-2xl">
              <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Bên Mua (Bên B)</h2>
              <div className="space-y-4">
                <InputField required label="Tên doanh nghiệp" info="Điền chính xác tên đầy đủ của Công ty/Doanh nghiệp theo Giấy chứng nhận đăng ký doanh nghiệp. Không viết tắt tên riêng. Ví dụ: Công ty Cổ phần Xuất Nhập Khẩu Nông sản Toàn Cầu." value={contract.buyer.name} onChange={(v: string) => handleUpdate('buyer', 'name', v)} showInfo={activeInfo === 'buyer.name'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.name' ? null : 'buyer.name')} />
                <InputField type="number" required label="Mã số doanh nghiệp (Mã số thuế)" info="Là mã số thuế gồm 10 số của doanh nghiệp. Hệ thống sẽ dùng mã số này để đối chiếu dữ liệu hóa đơn điện tử và kiểm tra tính hợp pháp của doanh nghiệp trên cổng thông tin quốc gia." value={contract.buyer.taxCode} onChange={(v: string) => handleUpdate('buyer', 'taxCode', v)} showInfo={activeInfo === 'buyer.taxCode'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.taxCode' ? null : 'buyer.taxCode')} />
                <InputField required label="Địa chỉ trụ sở chính" info="Địa chỉ đăng ký kinh doanh trên giấy phép của Công ty. Địa chỉ này sẽ được dùng để xuất hóa đơn GTGT (Hóa đơn đỏ) cho đơn hàng nông sản. Lưu ý: Tránh nhầm lẫn với địa chỉ kho nhận hàng hoặc nhà máy chế biến." value={contract.buyer.address} onChange={(v: string) => handleUpdate('buyer', 'address', v)} showInfo={activeInfo === 'buyer.address'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.address' ? null : 'buyer.address')} />
                <div className="grid grid-cols-2 gap-4">
                    <InputField required label="Người đại diện" info="Họ và tên của người giữ quyền quản lý cao nhất của doanh nghiệp (thường là Giám đốc, Tổng Giám đốc hoặc Chủ tịch HĐQT) được ghi trên giấy phép kinh doanh." value={contract.buyer.rep} onChange={(v: string) => handleUpdate('buyer', 'rep', v)} showInfo={activeInfo === 'buyer.rep'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.rep' ? null : 'buyer.rep')} />
                    <InputField required label="Chức danh" info="Ghi rõ chức vụ của người ký. Ví dụ: Giám đốc, Tổng Giám đốc... (Trường hợp ký thay phải có văn bản ủy quyền hợp pháp đính kèm)." value={contract.buyer.position} onChange={(v: string) => handleUpdate('buyer', 'position', v)} showInfo={activeInfo === 'buyer.position'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.position' ? null : 'buyer.position')} />
                </div>
                <InputField type="number" required label="Số điện thoại" info="Số điện thoại hotline của phòng thu mua hoặc số của người phụ trách trực tiếp hợp đồng này để phối hợp lịch nhận hàng, kiểm tra chất lượng nông sản. (Có thể bỏ trống mục Fax)." value={contract.buyer.phone} onChange={(v: string) => handleUpdate('buyer', 'phone', v)} showInfo={activeInfo === 'buyer.phone'} onToggleInfo={() => setActiveInfo(activeInfo === 'buyer.phone' ? null : 'buyer.phone')} />
              </div>
            </section>
          </div>

          {/* Section: Items */}
          <section className="p-6 border border-slate-200 rounded-2xl mt-8">
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Thông tin hàng hóa</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField readOnly label="Mã hàng hóa" info="Mã định danh sản phẩm bán sẵn." value={contract.product.id} onChange={(v: string) => handleProductUpdate('id', v)} />
                  <InputField label="Tên hàng hóa" info="Ví dụ: Gạo ST25, Cà phê Arabica Cầu Đất, dâu tây New Zealand..." value={contract.product.name} onChange={(v: string) => handleProductUpdate('name', v)} />
                  <InputField label="Đơn vị tính" info="Đơn vị đo lường sản lượng. Ví dụ: kg, tấn, tạ, thùng, giỏ..." value={contract.product.unit} onChange={(v: string) => handleProductUpdate('unit', v)} />
                  <InputField type="number" label="Số lượng" info="Quy mô sản lượng giao hàng thực tế." value={contract.product.quantity} onChange={(v: string) => handleProductUpdate('quantity', v)} />
                  <InputField type="number" label="Đơn giá" info="Giá trên một đơn vị tính (VND)." value={contract.product.price} onChange={(v: string) => handleProductUpdate('price', v)} />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thành tiền</label>
                    <input readOnly value={calculateTotal().toLocaleString('vi-VN')} className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-100 font-semibold" />
                  </div>
            </div>
            <div className="mt-4">
                <InputField label="Ghi chú" info="Yêu cầu bảo quản hoặc đóng gói." value={contract.product.note} onChange={(v: string) => handleProductUpdate('note', v)} />
            </div>
            <div className="mt-4">
                <InputField 
                    label="Tiêu chuẩn chất lượng" 
                    info="Nhằm Bên A cam kết sản xuất nông sản theo tiêu chuẩn chất lượng được quy định tại hợp đồng này, bao gồm VietGAP, GlobalGAP, hoặc tiêu chuẩn khác. Bên B chịu trách nhiệm thu mua, chế biến và phân phối sản phẩm theo đúng cam kết." 
                    placeholder="Ví dụ: tiêu chuẩn VietGAP, GlobalGAP, hoặc tiêu chuẩn khác..." 
                    value={contract.product.qualityStandard} 
                    onChange={(v: string) => handleProductUpdate('qualityStandard', v)} 
                />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng cộng</label>
                    <input readOnly value={calculateTotal().toLocaleString('vi-VN')} className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-100 font-bold" />
                </div>
                <InputField 
                    readOnly
                    label="Tổng tiền bằng chữ (Tự động hóa)" 
                    info="Hệ thống tự động dịch giá trị tổng cộng của hợp đồng thành chữ để đảm bảo tính pháp lý chính xác và tránh nhầm lẫn giữa hai bên." 
                    value={contract.totalInWords} 
                    onChange={() => {}} 
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
                        <div onClick={(e) => e.stopPropagation()} className="absolute top-full left-0 z-10 mt-1 p-3 bg-white border border-slate-200 rounded-xl shadow-lg w-80 text-xs text-slate-600 leading-relaxed italic font-normal">
                            Phương thức thanh toán được thiết kế đặc thù cho giao dịch nông sản, giúp tối ưu hóa dòng tiền và bảo vệ sinh kế cho nông dân và Hợp tác xã trước áp lực chi phí mùa vụ.
                        </div>
                    )}
                    <select 
                        value={contract.paymentType} 
                        onChange={(e) => {
                            const val = e.target.value;
                            let defaultDate = '';
                            let defaultPhase1 = '';
                            let defaultPhase2 = '';
                            if (val === 'Thanh toán ngay khi giao hàng') {
                                defaultDate = 'Trong vòng 24 giờ sau khi giao nhận';
                            } else if (val === 'Thanh toán theo tiến độ Vụ Mùa (Đặt cọc)') {
                                defaultDate = 'Đặt cọc đầu vụ, quyết toán sau thu hoạch';
                                defaultPhase1 = '10% giá trị dự kiến';
                                defaultPhase2 = 'Thanh toán phần còn lại sau khi thu hoạch';
                            } else if (val === 'Thanh toán ngắn hạn (từ 3 - 7 ngày)') {
                                defaultDate = 'Chốt sổ sau 3 ngày';
                            }
                            setContract(prev => ({ 
                                ...prev, 
                                paymentType: val, 
                                paymentDate: defaultDate, 
                                paymentPhase1: defaultPhase1, 
                                paymentPhase2: defaultPhase2, 
                                paymentPhase3: '' 
                            }));
                        }} 
                        className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none font-medium bg-white"
                    >
                        <option value='Thanh toán ngay khi giao hàng'>Thanh toán ngay khi giao hàng</option>
                        <option value='Thanh toán theo tiến độ Vụ Mùa (Đặt cọc)'>Thanh toán theo tiến độ Vụ Mùa (Đặt cọc)</option>
                        <option value='Thanh toán ngắn hạn (từ 3 - 7 ngày)'>Thanh toán ngắn hạn (từ 3 - 7 ngày)</option>
                    </select>
                </div>
                {(() => {
                    const type = contract.paymentType;
                    
                    if (type === 'Thanh toán ngay khi giao hàng') {
                        return null;
                    }
                    
                    if (type === 'Thanh toán theo tiến độ Vụ Mùa (Đặt cọc)') {
                        return (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đợt 1 (Mức Đặt cọc giữ ruộng đầu vụ)</label>
                                        <select 
                                            value={contract.paymentPhase1} 
                                            onChange={(e) => setContract(prev => ({ ...prev, paymentPhase1: e.target.value }))} 
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none bg-white font-medium text-slate-700"
                                        >
                                            <option value="10% giá trị dự kiến">Đặt cọc 10% giá trị dự kiến</option>
                                            <option value="20% giá trị dự kiến">Đặt cọc 20% giá trị dự kiến</option>
                                            <option value="1.000.000 đ/công">Tạm ứng 1.000.000 đ/công (khoảng sào Nam Bộ)</option>
                                            <option value="1.500.000 đ/công">Tạm ứng 1.500.000 đ/công (khoảng sào Nam Bộ)</option>
                                            <option value="2.000.000 đ/công">Tạm ứng 2.000.000 đ/công (khoảng sào Nam Bộ)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đợt 2 (Phần còn lại sau thu hoạch)</label>
                                        <input 
                                            type="text" 
                                            readOnly 
                                            value="Khấu trừ cọc & trả hết phần còn lại ngay sau khi hoàn tất thu hoạch và giao nhận sản phẩm" 
                                            className="border border-slate-200 rounded-xl px-4 py-3 text-xs bg-slate-100 text-slate-600 outline-none font-medium truncate" 
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    
                    if (type === 'Thanh toán ngắn hạn (từ 3 - 7 ngày)') {
                        return (
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn số ngày neo tiền thực tế</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { label: 'Chốt sổ sau 3 ngày', value: 'Chốt sổ sau 3 ngày' },
                                            { label: 'Chốt sổ sau 5 ngày', value: 'Chốt sổ sau 5 ngày' },
                                            { label: 'Chốt sổ sau 7 ngày', value: 'Chốt sổ sau 7 ngày' }
                                        ].map(item => (
                                            <label 
                                                key={item.value} 
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                                                    contract.paymentDate === item.value 
                                                    ? 'bg-sky-50/50 border-[#004d40] text-[#004d40] font-semibold shadow-sm' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentDateNeo"
                                                    value={item.value}
                                                    checked={contract.paymentDate === item.value}
                                                    onChange={(e) => setContract(prev => ({ ...prev, paymentDate: e.target.value }))}
                                                    className="w-4 h-4 text-[#004d40] border-slate-300 focus:ring-[#004d40]"
                                                />
                                                <span className="text-xs">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    
                    return null;
                })()}
                
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hình thức thanh toán</label>
                    <select value={contract.paymentMethod} onChange={(e) => setContract(prev => ({ ...prev, paymentMethod: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                        <option value="Chuyển khoản (TMCP/Chuyển khoản ngân hàng)">Chuyển khoản (TMCP/Chuyển khoản ngân hàng)</option>
                        <option value="Tiền mặt">Tiền mặt</option>
                    </select>
                </div>
                
                {contract.paymentMethod === 'Chuyển khoản (TMCP/Chuyển khoản ngân hàng)' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <InputField required label="Tài khoản ngân hàng" value={contract.seller.bankAcc} onChange={(v: string) => handleUpdate('seller', 'bankAcc', v)} />
                        <InputField required label="Ngân hàng" value={contract.seller.bankName} onChange={(v: string) => handleUpdate('seller', 'bankName', v)} />
                    </div>
                )}
            </div>
          </section>

          <section className="p-6 border border-slate-200 rounded-2xl mt-8">
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">Thời gian, địa điểm, phương thức giao hàng</h2>
            <div className="space-y-4">
                <InputField label="Thời gian giao hàng" placeholder="Ví dụ: 25/05/2026 hoặc 6h-8h sáng mỗi ngày" value={contract.deliveryTime} onChange={(v: string) => setContract(prev => ({ ...prev, deliveryTime: v }))} showInfo={activeInfo === 'deliveryTime'} onToggleInfo={() => setActiveInfo(activeInfo === 'deliveryTime' ? null : 'deliveryTime')} info="Điều khoản quy định mốc thời gian chính xác (ngày, giờ hoặc khoảng thời gian) mà Hợp tác xã (Bên bán) phải hoàn thành việc gom hàng, bốc xếp và bàn giao toàn bộ số lượng nông sản cho Doanh nghiệp (Bên mua)." />
                
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Thời gian bắt đầu" placeholder="VD: ngày 01 tháng 06 năm 2026" value={contract.startTime} onChange={(v: string) => setContract(prev => ({ ...prev, startTime: v }))} showInfo={activeInfo === 'startTime'} onToggleInfo={() => setActiveInfo(activeInfo === 'startTime' ? null : 'startTime')} info="Ngày bắt đầu giao hàng." />
                  <InputField label="Thời gian kết thúc" placeholder="VD: ngày 30 tháng 06 năm 2026" value={contract.endTime} onChange={(v: string) => setContract(prev => ({ ...prev, endTime: v }))} showInfo={activeInfo === 'endTime'} onToggleInfo={() => setActiveInfo(activeInfo === 'endTime' ? null : 'endTime')} info="Ngày kết thúc giao hàng." />
                </div>
                
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
                        <option value="Giao tại vườn/kho Bên bán (Nông dân)">Giao tại vườn/kho Bên bán (Nông dân)</option>
                        <option value="Giao tại kho Bên mua (HTX)">Giao tại kho Bên mua (HTX)</option>
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
                                Điều khoản quy định rõ Bên nào có trách nhiệm thuê và trả tiền cho công nhân (hoặc xe nâng, băng chuyền) để xúc lúa, khiêng vác các thùng trái cây, bao nông sản từ dưới đất/kho lên trên xe.
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
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">CÔNG CHỨNG HỢP ĐỒNG</h2>
            <div className="space-y-4">
                <div className="flex flex-col gap-1 relative">
                    <div className="flex items-center gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thỏa thuận chi phí công chứng do</label>
                    </div>
                    <select value={contract.notaryFeeBy || 'Hai bên'} onChange={(e) => setContract(prev => ({ ...prev, notaryFeeBy: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none">
                        <option value="Bên A">Bên A chịu</option>
                        <option value="Bên B">Bên B chịu</option>
                        <option value="Hai bên">Cả hai bên chia đều</option>
                    </select>
                </div>
            </div>
          </section>

          <section className="p-6 border border-slate-200 rounded-2xl mt-8">
            <h2 className="text-sm font-black uppercase text-[#004d40] mb-6">GIẢI QUYẾT TRANH CHẤP</h2>
            <div className="space-y-4">
                <InputField 
                    label="Tòa án nhân dân có thẩm quyền" 
                    value={contract.disputeResolutionCourt} 
                    onChange={(v: string) => setContract(prev => ({ ...prev, disputeResolutionCourt: v }))} 
                />
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
                    <p className="text-sm text-slate-700"><strong>Khoản 1:</strong> Hợp đồng này có hiệu lực từ</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <InputField type="text" label="Từ ngày" placeholder="Ví dụ: 26/05/2026" value={contract.validFrom} onChange={(v: string) => setContract(prev => ({ ...prev, validFrom: v }))} />
                        <InputField type="text" label="Đến ngày" placeholder="Ví dụ: 31/12/2026" value={contract.validTo} onChange={(v: string) => setContract(prev => ({ ...prev, validTo: v }))} />
                    </div>
                    <p className="text-sm text-slate-700 mt-2">Hợp đồng tự động thanh lý khi Bên B nhận đủ nông sản và Bên A nhận đủ 100% tiền.</p>
                    <p className="text-sm text-slate-700 pt-2"><strong>Khoản 2 & 3:</strong> Hợp đồng này thay thế mọi thỏa thuận trước đây. Mọi sửa đổi phải được lập thành văn bản hoặc phụ lục.</p>
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
