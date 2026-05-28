import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, FileText, Printer, CheckCircle, Clock, Send, Phone, ShieldCheck, X } from 'lucide-react';
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

export default function ContractPageFarmer() {
  const { contractId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<any>(null);
  
  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpStep, setOtpStep] = useState(1); // 1: Phone, 2: OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let foundContract: any = null;
    
    const updateFromSource = (raw: string | null) => {
      if (!raw) return;
      try {
        const arr = JSON.parse(raw);
        const match = arr.find((c: any) => String(c.id) === String(contractId));
        if (match) {
          if (!foundContract) {
            foundContract = match;
          } else {
            const completedStatuses = ['completed', 'signed', 'active', 'Đã hoàn tất', 'fully_signed'];
            if (completedStatuses.includes(match.status) && !completedStatuses.includes(foundContract.status)) {
              foundContract = match;
            } else if (match.status === 'awaiting_admin_signature' || match.status === 'Đang chờ ký (Admin)') {
              if (foundContract.status === 'awaiting_signature' || foundContract.status === 'Chờ ký') {
                foundContract = match;
              }
            }
          }
        }
      } catch (e) {
        console.error("Error parsing contracts source", e);
      }
    };

    updateFromSource(localStorage.getItem('vietagri_contracts_v2'));
    updateFromSource(localStorage.getItem('vietagri_contracts_v3'));

    if (foundContract) {
      setContract(foundContract);
    }
  }, [contractId]);

  // Timer logic for OTP
  useEffect(() => {
    let interval: any;
    if (showOtpModal && otpStep === 2 && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, otpStep, timer]);

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) return;
    setOtpStep(2);
    setTimer(45);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValue];
    newOtp[index] = value.slice(-1);
    setOtpValue(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const fullOtp = otpValue.join('');
    if (fullOtp === '123456') {
      setIsVerifying(true);
      setTimeout(() => {
        completeSignature();
        setIsVerifying(false);
        setShowOtpModal(false);
      }, 1500);
    } else {
      alert('Mã OTP không chính xác. Vui lòng thử lại với mã 123456');
    }
  };

  const completeSignature = () => {
    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
    if (rawV2) {
      try {
        let contractsV2 = JSON.parse(rawV2);
        const idx = contractsV2.findIndex((c: any) => String(c.id) === String(contract.id));
        if (idx !== -1) {
          const sigCode = 'SIG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
          contractsV2[idx].status = 'awaiting_admin_signature';
          contractsV2[idx].farmerSignatureCode = sigCode;
          // Also sync user notification / activity if needed
          localStorage.setItem('vietagri_contracts_v2', JSON.stringify(contractsV2));
          setContract({ ...contract, status: 'awaiting_admin_signature', farmerSignatureCode: sigCode });
          
          const rawSimple = localStorage.getItem('vietagri_contracts');
          if (rawSimple) {
            let simpleArr = JSON.parse(rawSimple);
            const sIdx = simpleArr.findIndex((s: any) => String(s.id) === String(contract.id));
            if (sIdx !== -1) {
              simpleArr[sIdx].status = 'Đang chờ ký (Admin)';
              localStorage.setItem('vietagri_contracts', JSON.stringify(simpleArr));
            }
          }

          const rawV3 = localStorage.getItem('vietagri_contracts_v3');
          if (rawV3) {
            try {
              let contractsV3 = JSON.parse(rawV3);
              const idxC = contractsV3.findIndex((c: any) => String(c.id) === String(contract.id));
              if (idxC !== -1) {
                contractsV3[idxC].status = 'awaiting_admin_signature';
                contractsV3[idxC].farmerSignatureCode = sigCode;
                localStorage.setItem('vietagri_contracts_v3', JSON.stringify(contractsV3));
              }
            } catch (eC) {}
          }
        }
      } catch (e) {}
    }
  };

  if (!contract) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">Không tìm thấy hợp đồng</h3>
          <p className="text-sm text-slate-500 mb-6 font-bold uppercase tracking-wider">Hợp đồng này có thể đã bị xóa hoặc không tồn tại</p>
          <button 
            onClick={() => navigate('/farmer-dashboard')}
            className="w-full py-3 bg-[#059669] text-white rounded-xl font-black text-xs uppercase tracking-widest"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const dVal = contract.createdAt ? new Date(contract.createdAt).toLocaleDateString('vi-VN').split('/') : [];
  const docDay = dVal[0] || new Date().getDate();
  const docMonth = dVal[1] || (new Date().getMonth() + 1);
  const docYear = dVal[2] || new Date().getFullYear();

  return (
    <>
      <div className="min-h-screen bg-slate-100 py-3 md:py-6 px-2 md:px-4 font-sans text-slate-900 print:bg-white print:p-0 overflow-hidden print:overflow-visible">
        <div className="max-w-[1000px] mx-auto bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-slate-200/60 print:shadow-none print:border-none print:rounded-none animate-fade-in h-[calc(100vh-1.5rem)] md:h-[calc(100vh-3rem)] print:h-auto flex flex-col">
          
          {/* Header UI */}
          <div className="p-4 md:p-6 border-b border-slate-100 print:hidden shrink-0">
             <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mục duyệt hợp đồng điện tử</span>
             <h3 className="text-base md:text-xl font-black text-[#004d40] flex items-center gap-2 truncate">
               <FileText className="text-[#004d40] shrink-0" size={20} />
               <span className="truncate">CHI TIẾT HĐ #{contract.contractNo || contract.id?.slice(-8)}</span>
             </h3>
          </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            @page { size: A4 portrait; margin: 0 !important; }
            body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .a4-page { box-shadow: none !important; margin: 0 !important; border: none !important; width: 210mm !important; min-height: 297mm !important; padding: 25mm 20mm 25mm 30mm !important; }
          }
          .a4-page {
            width: 100%;
            margin: 0 auto;
            background: white;
            padding: 1.25rem;
            font-family: "Times New Roman", Times, serif;
            box-sizing: border-box;
            color: #000;
            line-height: 1.4;
            position: relative;
          }
          @media (min-width: 768px) {
            .a4-page { padding: 2.5rem 2rem 2.5rem 3rem; }
          }
          .vn-title {
            font-family: "Times New Roman", Times, serif;
            font-size: 1rem;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
            margin-top: 0.5rem;
            margin-bottom: 0.25rem;
          }
          @media (min-width: 768px) { .vn-title { font-size: 14pt; } }
          .vn-paragraph {
            font-family: "Times New Roman", Times, serif;
            font-size: 0.9rem;
            line-height: 1.4;
            text-align: justify;
            margin-bottom: 0.5rem;
          }
          @media (min-width: 768px) { .vn-paragraph { font-size: 12pt; } }
          .vn-heading-article {
            font-family: "Times New Roman", Times, serif;
            font-size: 0.95rem;
            font-weight: bold;
            margin-top: 0.75rem;
            margin-bottom: 0.25rem;
          }
          @media (min-width: 768px) { .vn-heading-article { font-size: 13pt; } }
          .quoc-hieu { font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
          .tieu-ngu { font-size: 0.85rem; font-weight: bold; margin-top: 1px; }
          @media (min-width: 768px) {
            .quoc-hieu { font-size: 11.5pt; }
            .tieu-ngu { font-size: 12pt; }
          }
          
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: #e2e8f0; 
            border-radius: 10px; 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        `}} />

        {/* Scrollable Viewport for the A4 contract */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-2 md:p-12 print:p-0 print:bg-white custom-scrollbar print:overflow-visible overflow-x-hidden">
          <div className="space-y-4 print:space-y-0 max-w-[900px] mx-auto">
            <div className="a4-page rounded-xl md:rounded-[2rem] border border-slate-200/80 shadow-2xl print:shadow-none print:border-none print:rounded-none">
              {/* Quoc Hieu */}
              <div className="text-center mb-4">
                <h4 className="quoc-hieu">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                <h5 className="tieu-ngu">Độc lập - Tự do - Hạnh phúc</h5>
                <div className="w-24 md:w-32 h-[1px] bg-black mx-auto mt-1"></div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="vn-title leading-tight">HỢP ĐỒNG HỢP TÁC<br className="md:hidden"/> SẢN XUẤT NÔNG NGHIỆP</h1>
                <p style={{ fontSize: '9pt', fontWeight: 'bold' }} className="text-center opacity-70">
                  Số: {contract.contractNo || contract.id?.slice(-8)}
                </p>
              </div>

              <div className="mb-4 italic border-l-2 border-slate-200 pl-3 py-1 bg-slate-50/50" style={{ fontSize: '9pt' }}>
                <p>– Căn cứ Bộ luật Dân sự 2015;</p>
                <p>– Căn cứ Luật Thương mại 2005;</p>
                <p>– Căn cứ nhu cầu và khả năng thực tế của các bên.</p>
              </div>

              <p className="vn-paragraph">
                Hôm nay, ngày {docDay} tháng {docMonth} năm {docYear}, tại Lâm Đồng, chúng tôi gồm:
              </p>

              {/* Parties */}
              <div className="space-y-3 pt-1 font-sans">
                 <div className="border border-slate-200/80 rounded-xl bg-white p-3 md:p-4 space-y-2">
                    <div className="font-black text-[#004d40] uppercase tracking-wider border-b border-dashed border-slate-100 pb-1 flex items-center gap-1.5 text-[8px] md:text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#004d40]" /> BÊN BÁN (BÊN A)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-slate-700 leading-tight text-[10px]">
                      <div className="md:col-span-2"><strong>Họ và tên:</strong> {contract.seller?.name || '...'}</div>
                      <div className="md:col-span-2"><strong>CCCD:</strong> {contract.seller?.taxCode || '...'}</div>
                      <div className="md:col-span-2"><strong>Địa chỉ:</strong> {contract.seller?.address || '...'}</div>
                      <div className="flex justify-between"><span><strong>Đại diện:</strong> {contract.seller?.rep || '...'}</span></div>
                      <div className="flex justify-between"><span><strong>Chức danh:</strong> {contract.seller?.position || 'Chủ hộ'}</span></div>
                    </div>
                  </div>

                  <div className="border border-slate-200/80 rounded-xl bg-white p-3 md:p-4 space-y-2">
                    <div className="font-black text-indigo-700 uppercase tracking-wider border-b border-dashed border-slate-100 pb-1 flex items-center gap-1.5 text-[8px] md:text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> BÊN MUA (BÊN B)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-slate-700 leading-tight text-[10px]">
                      <div className="md:col-span-2"><strong>Doanh nghiệp:</strong> {contract.buyer?.name || '...'}</div>
                      <div className="md:col-span-2"><strong>MST:</strong> {contract.buyer?.taxCode || '...'}</div>
                      <div className="md:col-span-2"><strong>Trụ sở:</strong> {contract.buyer?.address || '...'}</div>
                      <div className="flex justify-between"><span><strong>Đại diện:</strong> {contract.buyer?.rep || '...'}</span></div>
                      <div className="flex justify-between"><span><strong>Chức danh:</strong> {contract.buyer?.position || 'Giám đốc'}</span></div>
                    </div>
                  </div>
              </div>

              <p className="vn-paragraph italic font-semibold mt-4 text-slate-800 text-[10px] md:text-[12pt]">
                Hai bên cùng thỏa thuận ký kết hợp đồng:
              </p>

              <div className="pt-1">
                 <h4 className="vn-heading-article">Điều 1: Nội dung hợp tác</h4>
                 <div className="border border-slate-200 rounded-lg overflow-hidden mb-3 font-sans">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[9px] border-collapse bg-white whitespace-nowrap md:whitespace-normal">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500">
                          <th className="p-2 border-r border-slate-200">Sản Phẩm</th>
                          <th className="p-2 text-center border-r border-slate-200">ĐV</th>
                          <th className="p-2 text-center border-r border-slate-200">SL</th>
                          <th className="p-2 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold text-slate-800 border-r border-slate-200">{contract.cropName || contract.productName || 'Nông sản'}</td>
                          <td className="p-2 text-center border-r border-slate-200">{contract.unit || 'kg'}</td>
                          <td className="p-2 text-center font-bold text-slate-900 border-r border-slate-200">{contract.totalVolume || '...'}</td>
                          <td className="p-2 text-right font-black text-[#004d40]">{(contract.totalVal || 0).toLocaleString('vi-VN')}</td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td colSpan={3} className="p-2 text-right text-slate-700">TỔNG CỘNG:</td>
                          <td className="p-2 text-right font-black text-rose-600">{(contract.totalVal || 0).toLocaleString('vi-VN')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 md:p-3 rounded-lg border border-slate-100 text-[9px] md:text-[10px] font-sans italic mb-3">
                  <strong>Bằng chữ:</strong> <span className="font-bold text-slate-900 underline lowercase">{convertNumberToVietnameseWords(contract.totalVal || 0)}</span>
                </div>
              </div>

              <div className="space-y-1 pt-0">
                <h4 className="vn-heading-article">Điều 2: Thanh toán & Giao hàng</h4>
                <p className="vn-paragraph text-[9px] md:text-[12pt]">1. Thanh toán: {contract.paymentMethod || 'Chuyển khoản'}.</p>
                <p className="vn-paragraph text-[9px] md:text-[12pt]">2. Địa điểm: {contract.deliveryLocation || 'Tại vườn Bên A'}.</p>
              </div>

              <div className="mt-8 grid grid-cols-2 text-center gap-4 select-none border-t border-slate-200 pt-6">
                <div className="space-y-12">
                  <div className="text-[10pt] uppercase font-bold">BÊN A</div>
                  {contract.status === 'signed' || 
                   contract.status === 'awaiting_admin_signature' || 
                   contract.status === 'Đang chờ ký (Admin)' || 
                   contract.status === 'completed' || 
                   contract.status === 'Đã hoàn tất' || 
                   contract.status === 'Nông dân đã ký' || 
                   (typeof contract.status === 'string' && (contract.status.includes('đã ký') || contract.status.includes('admin_signature'))) ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 mb-1">
                        <CheckCircle size={20} />
                      </div>
                      <p className="font-bold text-emerald-700 text-[10px] truncate w-full">{contract.seller?.rep}</p>
                    </div>
                  ) : <div className="h-12"></div>}
                </div>
                <div className="space-y-12">
                  <div className="text-[10pt] uppercase font-bold">BÊN B</div>
                  {contract.status === 'signed' || 
                   contract.status === 'completed' || 
                   contract.status === 'Đã hoàn tất' || 
                   contract.status === 'fully_signed' ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-100 mb-1">
                        <CheckCircle size={20} />
                      </div>
                      <p className="font-bold text-slate-900 text-[10px] truncate w-full">{contract.buyer?.rep}</p>
                    </div>
                  ) : (
                    <div className="h-12 flex items-center justify-center">
                      <p className="text-[8px] text-slate-300 italic font-medium uppercase tracking-tighter">Đang chờ ký duyệt...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer UI */}
        <div className="p-3 md:p-4 bg-white border-t border-slate-100 flex items-center gap-2 print:hidden shrink-0">
           <button 
             type="button"
             onClick={() => navigate('/farmer-dashboard')}
             className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200"
           >
             <ChevronLeft size={16} /> QUAY LẠI
           </button>

           {contract.status === 'signed' || contract.status === 'completed' || contract.status === 'Đã hoàn tất' ? (
             <div className="flex-[2] px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-emerald-200 flex items-center justify-center gap-2">
               <CheckCircle size={16} /> HỢP ĐỒNG ĐÃ HOÀN TẤT
             </div>
           ) : contract.status === 'awaiting_admin_signature' || contract.status === 'Đang chờ ký (Admin)' ? (
             <div className="flex-[2] px-[2] py-3 bg-amber-50 text-amber-700 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-amber-200 flex items-center justify-center gap-2">
               <CheckCircle size={16} /> ĐÃ KÝ SỐ (CHỜ HTX KÝ SỐ)
             </div>
           ) : (
             <button 
               type="button"
               onClick={() => setShowOtpModal(true)}
               className="flex-[2] px-4 py-3 bg-[#004d40] hover:bg-[#003d33] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10"
             >
               <Send size={16} /> KÝ TÊN
             </button>
           )}
        </div>
      </div>
    </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOtpModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative z-10"
            >
              {/* Modal Header */}
              <div className="p-6 pb-0 flex justify-between items-start">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={28} />
                </div>
                <button 
                  onClick={() => setShowOtpModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 pt-4">
                {otpStep === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-800">Xác thực ký tên</h3>
                      <p className="text-sm text-slate-500 font-medium">Vui lòng nhập số điện thoại để nhận mã OTP xác thực hợp đồng.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone size={18} />
                      </div>
                      <input 
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Số điện thoại của bạn"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
                      />
                    </div>

                    <button 
                      onClick={handleSendOtp}
                      disabled={phoneNumber.length < 10}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-200"
                    >
                      NHẬN MÃ OTP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                    <div>
                      <h3 className="text-xl font-black text-slate-800">Nhập mã OTP</h3>
                      <p className="text-sm text-slate-500 font-medium">Mã OTP đã được gửi đến số <span className="text-slate-800 font-black">{phoneNumber}</span></p>
                    </div>

                    <div className="flex justify-center gap-2">
                       {otpValue.map((digit, idx) => (
                         <input 
                           key={idx}
                           id={`otp-${idx}`}
                           type="text"
                           maxLength={1}
                           value={digit}
                           onChange={(e) => handleOtpChange(idx, e.target.value)}
                           className="w-11 h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-black text-emerald-600 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                         />
                       ))}
                    </div>

                    <div>
                      {timer > 0 ? (
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-2">
                          <Clock size={14} /> Gửi lại mã sau {timer}s
                        </p>
                      ) : (
                        <button 
                          onClick={() => { setOtpStep(1); setTimer(45); }}
                          className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline"
                        >
                          Gửi lại mã OTP mới
                        </button>
                      )}
                    </div>

                    <button 
                      onClick={handleVerifyOtp}
                      disabled={otpValue.some(v => v === '') || isVerifying}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                    >
                      {isVerifying ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                      XÁC NHẬN KÝ TÊN
                    </button>

                    <p className="text-[10px] text-slate-400 font-medium italic">
                      Lưu ý: Mã OTP giả định là 123456 để kiểm duyệt hệ thống.
                    </p>
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
