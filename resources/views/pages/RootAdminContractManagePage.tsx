import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Package, 
  Wallet,
  TrendingUp,
  Search,
  Eye,
  ChevronRight,
  PlusCircle,
  Sprout,
  MapPin,
  Building2,
  Calendar,
  FileSignature,
  FileText,
  Handshake,
  Clock,
  Briefcase,
  Printer,
  ArrowLeft,
  XCircle,
  CheckCircle2,
  Lock,
  Edit2,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contractService } from '../../services/contractService';

export default function RootAdminContractManagePage() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<any[]>(() => {
    const saved = localStorage.getItem('vietagri_contracts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Error parsing vietagri_contracts:", e);
      }
    }
    return [];
  });
  const [fullContracts, setFullContracts] = useState<any[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    localStorage.setItem('vietagri_contracts', JSON.stringify(contracts));
  }, [contracts]);

  const [isViewAllIndividualContractsModalOpen, setIsViewAllIndividualContractsModalOpen] = useState(false);
  const [isViewAllB2BContractsModalOpen, setIsViewAllB2BContractsModalOpen] = useState(false);
  const [isCreateContractTypeModalOpen, setIsCreateContractTypeModalOpen] = useState(false);
  const [individualContractsSearch, setIndividualContractsSearch] = useState('');
  const [b2bContractsSearch, setB2BContractsSearch] = useState('');

  const [isNegotiatingInline, setIsNegotiatingInline] = useState(false);
  const [negotiationNotes, setNegotiationNotes] = useState('');
  const [isRejectingInline, setIsRejectingInline] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Sync latest contracts from API and fallback to local storage
  useEffect(() => {
    const fetchData = async () => {
      // Ket noi API
      try {
        const response = await contractService.getAllContracts();
        const apiContracts = Array.isArray(response) ? response : (response?.data || []);
        
        let currentSimple: any[] = [];
        
        // 1. Process API contracts into simplified format
        apiContracts.forEach((v2: any) => {
          let simplifiedStatus = 'Chờ duyệt';
          if (v2.status === 'awaiting_signature') simplifiedStatus = 'Chờ ký duyệt';
          else if (v2.status === 'awaiting_farmer_signature') simplifiedStatus = 'Chờ nông dân ký';
          else if (v2.status === 'awaiting_admin_signature' || v2.status === 'Đang chờ ký (Admin)' || v2.status === 'in_progress' || v2.status === 'Đang thực hiện') simplifiedStatus = 'Đang thực hiện';
          else if (v2.status === 'signed') simplifiedStatus = (v2.type === 'individual' ? 'Nông dân đã ký' : 'Chờ DN ký');
          else if (v2.status === 'completed') simplifiedStatus = 'Đã hoàn tất';
          else if (v2.status === 'active') simplifiedStatus = 'Đang thực hiện';
          else if (v2.status === 'denied' || v2.status === 'rejected' || v2.status === 'rejected_super_admin' || v2.status === 'Hợp đồng đã bị từ chối' || v2.status === 'Đã từ chối') simplifiedStatus = 'Đã từ chối';
          else if (v2.status === 'Thương thảo' || v2.status === 'negotiating' || v2.status === 'Đang thương thảo') simplifiedStatus = 'Thương thảo';
          else if (v2.status === 'super_admin_approved' || v2.status === 'pending_super_admin' || v2.status === 'Chờ duyệt') simplifiedStatus = 'Chờ duyệt';
          else if (v2.status === 'pending_coop' || v2.status === 'pending_coop_admin' || v2.status === 'Chờ HTX duyệt') simplifiedStatus = 'Chờ HTX duyệt';
          else if (v2.status === 'coop_signed_pending_super') simplifiedStatus = 'Chờ ký duyệt';

          currentSimple.push({
            id: v2.id,
            contractNo: v2.contractNo || 'HĐ-XV-Chưa rõ',
            party: v2.type === 'individual' 
              ? (v2.seller?.name || v2.coopName || 'Nông dân') 
              : (v2.enterpriseName || v2.buyer?.name || 'Đối tác Liên kết'),
            cropName: v2.cropName || 'Nông sản',
            qty: v2.totalVolume || 'Không rõ sản lượng',
            status: simplifiedStatus,
            val: v2.totalVal ? `${(v2.totalVal / 1000000).toFixed(1)}M` : (v2.val || '0M'),
            amount: v2.amount || (v2.totalVal ? `${(v2.totalVal / 1000000).toFixed(1)} Triệu` : '0.1 Triệu'),
            type: v2.type || 'b2b',
            cooperativeId: v2.cooperativeId || (v2.type === 'individual' ? v2.seller?.id : v2.buyer?.id) || 'HTX-001',
            date: v2.deliveryTime || 'Gần đây'
          });
        });

        // 2. Also check local storage for un-migrated contracts
        const rawV2 = localStorage.getItem('vietagri_contracts_v2');
        if (rawV2) {
          try {
            const parsedV2 = JSON.parse(rawV2);
            if (Array.isArray(parsedV2)) {
              parsedV2.forEach((v2: any) => {
                if (!currentSimple.find(s => String(s.id) === String(v2.id))) {
                  let simplifiedStatus = 'Chờ duyệt';
                  if (v2.status === 'awaiting_signature') simplifiedStatus = 'Chờ ký duyệt';
                  else if (v2.status === 'awaiting_farmer_signature') simplifiedStatus = 'Chờ nông dân ký';
                  else if (v2.status === 'awaiting_admin_signature' || v2.status === 'Đang chờ ký (Admin)' || v2.status === 'in_progress' || v2.status === 'Đang thực hiện') simplifiedStatus = 'Đang thực hiện';
                  else if (v2.status === 'signed') simplifiedStatus = (v2.type === 'individual' ? 'Nông dân đã ký' : 'Chờ DN ký');
                  else if (v2.status === 'completed') simplifiedStatus = 'Đã hoàn tất';
                  else if (v2.status === 'active') simplifiedStatus = 'Đang thực hiện';
                  else if (v2.status === 'denied' || v2.status === 'rejected' || v2.status === 'rejected_super_admin' || v2.status === 'Hợp đồng đã bị từ chối' || v2.status === 'Đã từ chối') simplifiedStatus = 'Đã từ chối';
                  else if (v2.status === 'Thương thảo' || v2.status === 'negotiating' || v2.status === 'Đang thương thảo') simplifiedStatus = 'Thương thảo';
                  else if (v2.status === 'super_admin_approved' || v2.status === 'pending_super_admin' || v2.status === 'Chờ duyệt') simplifiedStatus = 'Chờ duyệt';
                  else if (v2.status === 'pending_coop' || v2.status === 'pending_coop_admin' || v2.status === 'Chờ HTX duyệt') simplifiedStatus = 'Chờ HTX duyệt';
                  else if (v2.status === 'coop_signed_pending_super') simplifiedStatus = 'Chờ ký duyệt';

                  currentSimple.push({
                    id: v2.id,
                    contractNo: v2.contractNo || 'HĐ-XV-Chưa rõ',
                    party: v2.type === 'individual' 
                      ? (v2.seller?.name || v2.coopName || 'Nông dân') 
                      : (v2.enterpriseName || v2.buyer?.name || 'Đối tác Liên kết'),
                    cropName: v2.cropName || 'Nông sản',
                    qty: v2.totalVolume || 'Không rõ sản lượng',
                    status: simplifiedStatus,
                    val: v2.totalVal ? `${(v2.totalVal / 1000000).toFixed(1)}M` : (v2.val || '0M'),
                    amount: v2.amount || (v2.totalVal ? `${(v2.totalVal / 1000000).toFixed(1)} Triệu` : '0.1 Triệu'),
                    type: v2.type || 'b2b',
                    cooperativeId: v2.cooperativeId || (v2.type === 'individual' ? v2.seller?.id : v2.buyer?.id) || 'HTX-001',
                    date: v2.deliveryTime || 'Gần đây'
                  });
                }
              });
            }
          } catch (e) {}
        }

        const mockIds = ['HD-XV-2940', 'HD-XV-2941', 'HD-XV-2942', 'B2B-1029', 'B2B-1030', 'B2B-1031'];
        currentSimple = currentSimple.filter(s => !mockIds.includes(String(s.id)));

        setContracts(currentSimple);
        setFullContracts(apiContracts);
        localStorage.setItem('vietagri_contracts', JSON.stringify(currentSimple));
      } catch (error) {
        console.error("Failed to fetch contracts via API:", error);
      }
    };

    fetchData();
  }, []);

  const [selectedB2BContract, setSelectedB2BContract] = useState<any>(null);
  
  const cleanContractNo = (rawNo: string | undefined, originalId?: string) => {
    if (!rawNo) {
      const defaultNum = originalId?.split('-').pop() || '01';
      return `${defaultNum}/2026/HĐMB`;
    }
    const parts = rawNo.split('/');
    const cleanParts = parts.filter(p => !p.toUpperCase().includes('HTX'));
    let numPart = cleanParts[0] || originalId?.split('-').pop() || '01';
    let yearPart = '2026';
    const foundYear = parts.find(p => p.length === 4 && !isNaN(Number(p)));
    if (foundYear) {
      yearPart = foundYear;
    }
    let codePart = 'HĐMB';
    if (rawNo.includes('HĐHTSXNN')) {
      codePart = 'HĐHTSXNN';
    } else if (rawNo.includes('HDLKTMHH')) {
      codePart = 'HDLKTMHH';
    } else if (rawNo.includes('HĐMB')) {
      codePart = 'HĐMB';
    } else {
      const foundCode = cleanParts.find(p => isNaN(Number(p)) && p.length > 2 && p !== yearPart);
      if (foundCode) {
        codePart = foundCode;
      }
    }
    return `${numPart}/${yearPart}/${codePart}`;
  };
  
  // Custom digital signing workflow states
  const [signingStep, setSigningStep] = useState<'idle' | 'pincode' | 'signing' | 'success'>('idle');
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [signProgress, setSignProgress] = useState<number>(0);
  const [signStatusMessage, setSignStatusMessage] = useState<string>('');

  const docSoTienBangChu = (soTien: number): string => {
    if (soTien === 0) return 'Không đồng';
    if (soTien === 650000000) return 'Sáu trăm năm mươi triệu đồng chẵn';
    if (soTien === 220000000) return 'Hai trăm hai mươi triệu đồng chẵn';
    if (soTien === 350000000) return 'Ba trăm năm mươi triệu đồng chẵn';
    if (soTien === 850000000) return 'Tám trăm năm mươi triệu đồng chẵn';
    if (soTien === 180000000) return 'Một trăm tám mươi triệu đồng chẵn';
    if (soTien === 120000000) return 'Một trăm hai mươi triệu đồng chẵn';
    if (soTien === 250000000) return 'Hai trăm năm mươi triệu đồng chẵn';
    return "Sáu trăm năm mươi triệu đồng chẵn";
  };

  const handleViewB2BContract = (simpleContract: any) => {
    setSigningStep('idle');
    setPinInput('');
    setPinError('');
    setSignProgress(0);
    setSignStatusMessage('');
    setIsNegotiatingInline(false);
    setNegotiationNotes('');
    setIsRejectingInline(false);
    setRejectionReason('');

    // Ket noi API
    let detailed = fullContracts.find((c: any) => String(c.id) === String(simpleContract.id) || String(c.contractNo) === String(simpleContract.contractNo));

    if (!detailed) {
      const rawV2 = localStorage.getItem('vietagri_contracts_v2');
      if (rawV2) {
        try {
          const parsed = JSON.parse(rawV2);
          detailed = parsed.find((c: any) => String(c.id) === String(simpleContract.id) || String(c.contractNo) === String(simpleContract.contractNo));
        } catch (e) {}
      }
    }
    
    if (detailed) {
      setSelectedB2BContract(detailed);
    } else {
      const mockDetailed = {
        id: simpleContract.id,
        contractNo: simpleContract.id || simpleContract.contractNo || 'HĐMB-2026/01',
        createdAt: new Date().toISOString(),
        status: simpleContract.status === 'Chờ duyệt' || simpleContract.status === 'pending_super_admin' ? 'pending_super_admin' : 'signed',
        totalVal: simpleContract.val === '650M' ? 650000000 : 
                  (simpleContract.val === '220M' ? 220000000 : 
                  (simpleContract.val === '350M' ? 350000000 : 
                  (simpleContract.val === '250M' ? 250000000 : 
                  (simpleContract.val === '180M' ? 180000000 : 120000000)))),
        cropName: simpleContract.qty?.includes('Cà phê') ? 'Cà phê Arabica Cầu Đất' :
                  (simpleContract.qty?.includes('Sầu') ? 'Sầu Riêng Ri6' : 'Nông sản Organic chất lượng cao'),
        totalVolume: simpleContract.qty || '5 Tấn',
        unitPrice: simpleContract.qty?.includes('Cà phê') ? '130.000 VNĐ / kg' : '90.000 VNĐ / kg',
        coopName: 'Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất',
        enterpriseName: simpleContract.party,
        paymentPhase1: '30%',
        paymentPhase2: '70%',
        paymentMethod: 'Chuyển khoản liên ngân hàng 24/7',
        deliveryTime: simpleContract.date || 'Thu hoạch và giao nhận trong vòng 15 ngày lấy hàng',
        deliveryLocation: 'Kho bãi vật lý bên Bán (Lâm Đồng)',
        seller: {
          name: 'Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất',
          taxCode: '3901284560',
          rep: 'Nguyễn Văn Hợp',
          position: 'Chủ tịch HĐQT / Giám đốc điều hành',
          phone: '0988777666',
          cccd: '068092004561',
          cccdDate: '15/08/2021',
          cccdPlace: 'Cục Cảnh sát QLHC về trật tự xã hội',
          fax: '02633 847 112',
          bankAcc: '999988887777',
          bankName: 'Ngân hàng Nông nghiệp & Phát triển Nông thôn Việt Nam (Agribank) - Chi nhánh Tỉnh Lâm Đồng',
          address: 'Khu phố 1, Huyện Đức Trọng, Tỉnh Lâm Đồng'
        },
        buyer: {
          name: simpleContract.party || 'Công ty Cổ phần Nông sản Sạch Việt Nam',
          taxCode: '0312345678',
          rep: 'Trần Văn Bảo',
          position: 'Giám đốc thu mua miền Nam',
          phone: '0912345678',
          cccd: '079093004455',
          cccdDate: '20/10/2020',
          cccdPlace: 'Cục Cảnh sát QLHC về trật tự xã hội',
          fax: '02838 123 456',
          bankAcc: '1029384756',
          bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank) - Chi nhánh Nam Sài Gòn',
          address: '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'
        }
      };
      setSelectedB2BContract(mockDetailed);
    }
  };

  const startDigitalSigningProcess = (contractId: string) => {
    setPinInput('');
    setPinError('');
    setSignProgress(0);
    setSignStatusMessage('');
    setSigningStep('pincode');
  };

  const handleVerifyPinAndSign = () => {
    if (pinInput !== '123456') {
      setPinError('Mã PIN chữ ký số không chính xác. Mặc định là 123456.');
      return;
    }

    setPinError('');
    setSigningStep('signing');
    setSignProgress(10);
    setSignStatusMessage('Đang kết nối thiết bị Token mật mã...');

    const statuses = [
      { prg: 25, msg: 'Đang giải mã Khóa riêng bảo mật (RSA 2048-bit Private Key)...' },
      { prg: 50, msg: 'Đang băm tệp nội dung Hợp đồng bằng thuật toán SHA-256...' },
      { prg: 75, msg: 'Đang nhúng Chứng thư số & Xác thực mốc thời gian pháp lý (Timestamp)...' },
      { prg: 90, msg: 'Đang mã hóa chữ ký khóa riêng và hoàn tất niêm phong tài liệu...' },
      { prg: 100, msg: 'Ký số hoàn tất! Đóng gói hợp đồng định dạng PDF/A chuẩn quốc gia.' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < statuses.length) {
        setSignProgress(statuses[currentIdx].prg);
        setSignStatusMessage(statuses[currentIdx].msg);
        currentIdx++;
      } else {
        clearInterval(interval);
        completeSigningApproved(selectedB2BContract.id);
      }
    }, 600);
  };

  const completeSigningApproved = async (contractId: string) => {
    // Ket noi API
    try {
      const newStatus = selectedB2BContract?.type === 'individual' ? 'completed' : 'signed';
      const updatedData = { ...selectedB2BContract, status: newStatus };

      // 1. Update via API
      await contractService.updateContract(contractId, updatedData);

      // 2. Local State Sync
      const updatedContracts = contracts.map((c: any) => {
        if (String(c.id) === String(contractId)) {
          return { ...c, status: c.type === 'individual' ? 'Đã hoàn tất' : 'Chờ DN ký' };
        }
        return c;
      });
      setContracts(updatedContracts);
      localStorage.setItem('vietagri_contracts', JSON.stringify(updatedContracts));

      // 3. V2 Fallback Sync
      const rawV2 = localStorage.getItem('vietagri_contracts_v2');
      if (rawV2) {
        try {
          const parsedV2 = JSON.parse(rawV2);
          const updatedV2 = parsedV2.map((c: any) => {
            if (String(c.id) === String(contractId)) {
              return updatedData;
            }
            return c;
          });
          localStorage.setItem('vietagri_contracts_v2', JSON.stringify(updatedV2));
        } catch (e) {}
      }

      setSelectedB2BContract(updatedData);
      setSigningStep('success');
      setToastMessage('Đã duyệt & hoàn tất ký số bảo mật chữ ký số thành công!');
    } catch (error) {
      console.error("Failed to approve and sign via API:", error);
      alert("Lỗi khi phê duyệt ký số! Vui lòng thử lại.");
    }
  };

  const handleRejectB2BContract = async (contractId: string, reason?: string) => {
    // Ket noi API
    try {
      const updatedData = { 
        ...selectedB2BContract, 
        status: 'rejected_super_admin', 
        rejectReason: reason || 'Nội dung hợp đồng không đáp ứng quy chuẩn hệ thống.' 
      };

      // 1. Update via API
      await contractService.updateContract(contractId, updatedData);

      const updatedContracts = contracts.map((c: any) => {
        if (String(c.id) === String(contractId)) {
          return { ...c, status: 'Đã từ chối' };
        }
        return c;
      });
      setContracts(updatedContracts);
      localStorage.setItem('vietagri_contracts', JSON.stringify(updatedContracts));

      // Sync V2 fallback
      const rawV2 = localStorage.getItem('vietagri_contracts_v2');
      if (rawV2) {
        try {
          const parsedV2 = JSON.parse(rawV2);
          const updatedV2 = parsedV2.map((c: any) => {
            if (String(c.id) === String(contractId)) {
              return updatedData;
            }
            return c;
          });
          localStorage.setItem('vietagri_contracts_v2', JSON.stringify(updatedV2));
        } catch (e) {}
      }

      setSelectedB2BContract(updatedData);
      setToastMessage('Đã từ chối phê duyệt hợp đồng này.');
    } catch (error) {
      console.error("Failed to reject via API:", error);
      alert("Lỗi khi từ chối hợp đồng! Vui lòng thử lại.");
    }
  };

  const handleNegotiateB2BContract = async (contractId: string, notes?: string) => {
    // Ket noi API
    try {
      const updatedData = { ...selectedB2BContract, status: 'Thương thảo', negotiationNotes: notes || '' };

      // 1. Update via API
      await contractService.updateContract(contractId, updatedData);

      const updatedContracts = contracts.map((c: any) => {
        if (String(c.id) === String(contractId)) {
          return { ...c, status: 'Thương thảo' };
        }
        return c;
      });
      setContracts(updatedContracts);
      localStorage.setItem('vietagri_contracts', JSON.stringify(updatedContracts));

      // 2. V2 fallback sync
      const rawV2 = localStorage.getItem('vietagri_contracts_v2');
      if (rawV2) {
        try {
          const parsedV2 = JSON.parse(rawV2);
          const updatedV2 = parsedV2.map((c: any) => {
            if (String(c.id) === String(contractId)) {
              return updatedData;
            }
            return c;
          });
          localStorage.setItem('vietagri_contracts_v2', JSON.stringify(updatedV2));
        } catch (e) {}
      }

      setSelectedB2BContract(updatedData);
      setToastMessage('Đã gửi yêu cầu thương thảo để điều chỉnh hợp đồng.');
    } catch (error) {
      console.error("Failed to negotiate via API:", error);
      alert("Lỗi khi kết nối API thương thảo! Vui lòng thử lại.");
    }
  };

  const handleApproveB2BContract = (contractId: string) => {
    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
    let detailed = null;
    if (rawV2) {
      try {
        const parsed = JSON.parse(rawV2);
        detailed = parsed.find((c: any) => String(c.id) === String(contractId));
      } catch (e) {}
    }
    
    if (!detailed) {
      detailed = contracts.find((c: any) => String(c.id) === String(contractId));
    }

    if (detailed) {
      setSelectedB2BContract(detailed);
    }
    startDigitalSigningProcess(contractId);
  };

  const handlePrintB2BContract = (c: any) => {
    const includeStamp = window.confirm(
      "Hệ thống hỗ trợ 2 mẫu in:\n\n" +
      "• Nhấn OK để tải: Bản in CÓ đầy đủ Mộc đỏ & Chữ ký số điện tử pháp lý.\n" +
      "• Nhấn CANCEL để tải: Bản in SẠCH (bản ký tay truyền thống / chưa đóng dấu)."
    );

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Không thể mở cửa sổ in. Vui lòng cho phép popup để tải bản in PDF.');
      return;
    }
    
    const moneyWords = docSoTienBangChu(c.totalVal || 650000000);
    const createdDate = new Date(c.createdAt || new Date());
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1;
    const year = createdDate.getFullYear();
    const currentContractNo = cleanContractNo(c.contractNo, c.id);

    printWindow.document.write(`
      <html>
        <head>
          <title>Hop_Dong_Mua_Ban_${currentContractNo}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display&display=swap');
            body { 
              font-family: "Times New Roman", Times, serif; 
              padding: 50px 70px; 
              line-height: 1.6; 
              color: #111; 
              font-size: 14.5px; 
              background-color: #fff;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .uppercase { text-transform: uppercase; }
            .font-bold { font-weight: bold; }
            .underline { text-decoration: underline; }
            
            .national-header {
              text-align: center;
              font-size: 15px;
              font-weight: bold;
              line-height: 1.3;
              margin-bottom: 25px;
            }
            .national-header .submotto {
              font-weight: bold;
              font-size: 14px;
              margin-top: 2px;
            }
            .line-separator {
              margin: 4px auto 15px auto;
              width: 150px;
              border-bottom: 1.5px solid #000;
            }
            
            .contract-title {
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 30px;
              margin-bottom: 3px;
              letter-spacing: 0.5px;
            }
            .contract-no {
              font-size: 13.5px;
              font-family: Arial, sans-serif;
              margin-bottom: 25px;
            }
            
            .legal-basis {
              font-style: italic;
              margin-bottom: 25px;
              font-size: 14px;
              padding-left: 10px;
            }
            .legal-basis p {
              margin: 4px 0;
            }
            
            .party-header { 
              font-weight: bold; 
              font-size: 15px; 
              margin-top: 22px; 
              margin-bottom: 8px;
              text-transform: uppercase;
            }
            
            .party-details {
              margin-bottom: 12px;
              padding-left: 5px;
            }
            .party-details table {
              width: 100%;
              border: none !important;
            }
            .party-details td {
              border: none !important;
              padding: 2.5px 0 !important;
              font-size: 14px;
              vertical-align: top;
            }
            .dotted-fill {
              border-bottom: 1px dotted #777;
              font-weight: bold;
              padding-left: 4px;
            }
            
            .section-title {
              font-weight: bold;
              margin-top: 20px;
              margin-bottom: 8px;
              font-size: 14.5px;
            }
            
            table.commodity-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px; 
              margin-bottom: 12px; 
            }
            table.commodity-table th, table.commodity-table td { 
              border: 1px solid #000; 
              padding: 7px 10px; 
              text-align: left; 
              font-size: 13.5px; 
            }
            table.commodity-table th { 
              background-color: #f5f5f5; 
              font-weight: bold; 
              text-align: center;
            }
            
            .signatures-container { 
              display: flex; 
              justify-content: space-between; 
              margin-top: 50px; 
              page-break-inside: avoid;
            }
            .signature-box { 
              width: 46%; 
              text-align: center; 
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
            }
            .signature-label {
              font-weight: bold;
              font-size: 13.5px;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .signature-sub {
              font-style: italic;
              font-size: 12px;
              color: #444;
              margin-bottom: 15px;
            }
            
            .stamp-wrapper {
              position: relative;
              height: 125px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 10px 0;
            }
            
            .cryptographic-meta {
              font-family: monospace, Courier, monospace;
              text-align: left;
              border: 1px solid #777;
              padding: 8px 10px;
              font-size: 10.5px;
              line-height: 1.35;
              color: #1a4f1a;
              background-color: #f7fbf7;
              border-radius: 4px;
              margin-top: 10px;
              width: 90%;
              box-shadow: 1px 1px 4px rgba(0,0,0,0.05);
            }
            
            @media print {
              body { 
                padding: 30px 40px; 
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="national-header">
            <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div class="submotto">Độc lập – Tự do – Hạnh phúc</div>
            <div class="line-separator"></div>
            
            <div class="contract-title">${currentContractNo.includes('HĐHTSXNN') ? 'HỢP ĐỒNG HỢP TÁC SẢN XUẤT NÔNG NGHIỆP' : (currentContractNo.includes('HDLKTMHH') ? 'HỢP ĐỒNG LIÊN KẾT THU MUA HÀNG HÓA' : 'HỢP ĐỒNG MUA BÁN HÀNG HÓA')}</div>
            <div class="contract-no">Số: ${currentContractNo}</div>
          </div>
          
          <div class="legal-basis">
            <p>– Căn cứ Bộ luật Dân sự 2015;</p>
            <p>– Căn cứ Luật Thương mại 2005;</p>
            <p>– Căn cứ nhu cầu và khả năng thực tế của các bên.</p>
          </div>
          
          <p style="text-indent: 25px; margin-bottom: 15px; font-size: 14px;">
            Hôm nay, ngày ${day} tháng ${month} năm 2026, tại địa chỉ: Văn phòng Ban quản trị Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất, Việt Nam. Chúng tôi, gồm có:
          </p>
          
          <div>
            <div class="party-header">BÊN BÁN (Bên A)</div>
            <div class="party-details">
              <table>
                <tr>
                  <td style="width: 20%; font-weight: bold;">Tên doanh nghiệp:</td>
                  <td class="dotted-fill" style="width: 80%;">${c.seller?.name || 'Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Mã số doanh nghiệp:</td>
                  <td class="dotted-fill">${c.seller?.taxCode || '3901284560'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Địa chỉ trụ sở chính:</td>
                  <td class="dotted-fill">${c.seller?.address || 'Khu phố 1, Huyện Đức Trọng, Tỉnh Lâm Đồng'}</td>
                </tr>
              </table>
              
              <table style="margin-top: 5px;">
                <tr>
                  <td style="width: 25%; font-weight: bold;">Người đại diện pháp luật:</td>
                  <td class="dotted-fill" style="width: 35%;">${c.seller?.rep || 'Nguyễn Văn Hợp'}</td>
                  <td style="width: 12%; font-weight: bold; text-align: center;">Chức danh:</td>
                  <td class="dotted-fill" style="width: 28%;">${c.seller?.position || 'Chủ tịch HĐQT'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">CMND/CCCD/Hộ chiếu:</td>
                  <td class="dotted-fill">${c.seller?.cccd || '068092004561'}</td>
                  <td style="font-weight: bold; text-align: center;">Cấp ngày:</td>
                  <td class="dotted-fill">${c.seller?.cccdDate || '15/08/2021'} tại ${c.seller?.cccdPlace || 'Cục Cảnh sát QLHC'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Số điện thoại:</td>
                  <td class="dotted-fill">${c.seller?.phone || '0988777666'}</td>
                  <td style="font-weight: bold; text-align: center;">Fax:</td>
                  <td class="dotted-fill">${c.seller?.fax || '02633 847 112'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Tài khoản ngân hàng:</td>
                  <td class="dotted-fill">${c.seller?.bankAcc || '999988887777'}</td>
                  <td style="font-weight: bold; text-align: center;">Mở tại:</td>
                  <td class="dotted-fill">${c.seller?.bankName || 'Agribank - Chi nhánh Tỉnh Lâm Đồng'}</td>
                </tr>
              </table>
            </div>
            
            <div class="party-header">BÊN MUA (Bên B)</div>
            <div class="party-details">
              <table>
                <tr>
                  <td style="width: 20%; font-weight: bold;">Tên doanh nghiệp:</td>
                  <td class="dotted-fill" style="width: 80%;">${c.buyer?.name || c.enterpriseName || 'Công ty Cổ phần Nông sản Sạch Việt Nam'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Mã số doanh nghiệp:</td>
                  <td class="dotted-fill">${c.buyer?.taxCode || '0312345678'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Địa chỉ trụ sở chính:</td>
                  <td class="dotted-fill">${c.buyer?.address || '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'}</td>
                </tr>
              </table>
              
              <table style="margin-top: 5px;">
                <tr>
                  <td style="width: 25%; font-weight: bold;">Người đại diện pháp luật:</td>
                  <td class="dotted-fill" style="width: 35%;">${c.buyer?.rep || 'Trần Văn Bảo'}</td>
                  <td style="width: 12%; font-weight: bold; text-align: center;">Chức danh:</td>
                  <td class="dotted-fill" style="width: 28%;">${c.buyer?.position || 'Giám đốc mua hàng'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">CMND/CCCD/Hộ chiếu:</td>
                  <td class="dotted-fill">${c.buyer?.cccd || '079093004455'}</td>
                  <td style="font-weight: bold; text-align: center;">Cấp ngày:</td>
                  <td class="dotted-fill">${c.buyer?.cccdDate || '20/10/2020'} tại ${c.buyer?.cccdPlace || 'Cục Cảnh sát QLHC'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Số điện thoại:</td>
                  <td class="dotted-fill">${c.buyer?.phone || '0912345678'}</td>
                  <td style="font-weight: bold; text-align: center;">Fax:</td>
                  <td class="dotted-fill">${c.buyer?.fax || '02838 123 456'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Tài khoản ngân hàng:</td>
                  <td class="dotted-fill">${c.buyer?.bankAcc || '1029384756'}</td>
                  <td style="font-weight: bold; text-align: center;">Mở tại:</td>
                  <td class="dotted-fill">${c.buyer?.bankName || 'Vietcombank - Chi nhánh Nam Sài Gòn'}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <p style="margin-top: 25px; margin-bottom: 12px; font-weight: normal; text-align: justify; font-size: 14px;">
            Trên cơ sở thỏa thuận hoàn toàn tự nguyện, hai bên thống nhất ký kết hợp đồng mua bán hàng hóa với các điều khoản như sau:
          </p>
          
          <div class="section-title">Điều 1: Tên hàng hóa, số lượng, chất lượng, giá trị hợp đồng</div>
          <p style="margin: 0px 0 5px 0;">Bên A bán cho bên B hàng hóa sau đây:</p>
          
          <table class="commodity-table">
            <thead>
              <tr>
                <th style="width: 6%;">STT</th>
                <th style="width: 35%;">Tên hàng hóa</th>
                <th style="width: 10%;">Đơn vị</th>
                <th style="width: 12%;">Số lượng</th>
                <th style="width: 15%;">Đơn giá</th>
                <th style="width: 22%;">Thành tiền (VNĐ đồng)</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;">1</td>
                <td style="font-weight: bold;">${c.cropName || 'Cà phê Arabica Cầu Đất'}</td>
                <td style="text-align: center;">kg</td>
                <td style="text-align: center; font-weight: bold;">${c.totalVolume}</td>
                <td style="text-align: right;">${c.unitPrice || '130.000 VNĐ / kg'}</td>
                <td style="text-align: right; font-weight: bold;">${(c.totalVal || 0).toLocaleString('vi-VN')}</td>
                <td>Đạt chuẩn hữu cơ chất lượng cao xuất khẩu</td>
              </tr>
              <tr>
                <td style="text-align: center;">2</td>
                <td>--</td>
                <td style="text-align: center;">--</td>
                <td style="text-align: center;">--</td>
                <td style="text-align: right;">--</td>
                <td style="text-align: right;">--</td>
                <td>Hạng mục bao tiêu liên kết trọn gói</td>
              </tr>
              <tr>
                <td colspan="5" style="text-align: right; font-weight: bold;">Tổng cộng:</td>
                <td style="text-align: right; font-weight: bold; color: #b22222;">${(c.totalVal || 0).toLocaleString('vi-VN')} VNĐ</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          
          <div style="font-size: 14px; margin-bottom: 20px;">
            <p style="margin: 3px 0;"><strong>Tổng cộng:</strong> <span style="font-family: Arial; font-weight: bold;">${(c.totalVal || 0).toLocaleString('vi-VN')}</span> đồng</p>
            <p style="margin: 3px 0;"><strong>Bằng chữ:</strong> <span style="font-style: italic; text-decoration: underline; font-weight: bold;">${moneyWords}</span></p>
          </div>
          
          <div class="section-title">Điều 2. Thanh toán</div>
          <div style="padding-left: 15px;">
            <p>1. Bên B phải thanh toán cho Bên A số tiền ghi tại Điều 1 của Hợp đồng này muộn nhất vào ngày 15 tháng 12 năm 2026.</p>
            <p>2. Bên B thanh toán cho Bên A theo hình thức <span class="font-bold underline">${c.paymentMethod || 'Chuyển khoản liên ngân hàng 24/7'}</span> vào tài khoản chỉ định tại Điều trên.</p>
          </div>
          
          <div class="section-title">Điều 3. Thời gian, địa điểm, phương thức giao hàng</div>
          <div style="padding-left: 15px;">
            <p>1. Bên A giao hàng cho bên B theo lịch sau:</p>
            <table class="commodity-table" style="margin-top: 5px;">
              <thead>
                <tr>
                  <th style="width: 8%;">STT</th>
                  <th>Tên hàng hóa</th>
                  <th style="width: 10%;">Đơn vị</th>
                  <th style="width: 12%;">Số lượng</th>
                  <th>Thời gian giao hàng</th>
                  <th>Địa điểm giao hàng</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center;">1</td>
                  <td style="font-weight: bold;">${c.cropName || 'Cà phê Arabica Cầu Đất'}</td>
                  <td style="text-align: center;">kg</td>
                  <td style="text-align: center;">${c.totalVolume}</td>
                  <td>${c.deliveryTime || 'Trong vòng 15 ngày kể từ ngày ký'}</td>
                  <td>${c.deliveryLocation || 'Kho bãi bên bán'}</td>
                  <td>Theo đợt thu hoạch thực tế</td>
                </tr>
              </tbody>
            </table>
            
            <p>2. Phương tiện vận chuyển và chi phí vận chuyển do bên <span style="font-weight: bold; text-decoration: underline;">Bên B (Bên Mua)</span> chịu. Chi phí bốc xếp <span style="font-size: 13.5px; font-style: italic;">do bên A chịu trách nhiệm bốc xếp đưa lên container tại bãi kho bên bán</span>.</p>
            
            <p>3. Quy định lịch giao nhận hàng hóa mà bên mua không đến nhận hàng thì phải chịu chi phí lưu kho bãi là <strong style="font-family: Arial;">1.000.000</strong> đồng/ngày. Nếu phương tiện vận chuyển bên mua đến mà bên bán không có hàng giao thì bên bán phải chịu chi phí thực tế cho việc điều động phương tiện.</p>
            
            <p>4. Khi nhận hàng, bên mua có trách nhiệm kiểm nhận phẩm chất, quy cách hàng hóa tại chỗ. Nếu phát hiện hàng thiếu hoặc không đúng tiêu chuẩn chất lượng v.v… thì lập biên bản tại chỗ, yêu cầu bên bán xác nhận. Hàng đã ra khỏi kho bên bán không chịu trách nhiệm (trừ loại hàng có quy định thời hạn bảo hành).</p>
            
            <p>5. Trường hợp giao nhận hàng theo nguyên đai, nguyên kiện, nếu bên mua sau khi chở về nhập kho mới phát hiện vi phạm thì phải lập biên bản gọi cơ quan kiểm tra trung gian (<span style="font-weight: bold;">Trung tâm Kiểm định & Đo lường QUATEST Lâm Đồng</span>) đến xác nhận và phải gửi đến bên bán trong hạn 10 ngày tính từ khi lập biên bản. Sau 15 ngày nếu bên bán đã nhận được biên bản mà không có ý kiến gì thì coi như đã chịu trách nhiệm bồi thường lô hàng đó.</p>
            
            <p>6. Mỗi lô hàng khi giao nhận phải có xác nhận chất lượng bằng phiếu hoặc biên bản kiểm nghiệm; khi đến nhận hàng, người nhận phải có đủ:</p>
            <p style="padding-left: 20px; margin: 3px 0;">– Giấy giới thiệu của cơ quan bên mua;</p>
            <p style="padding-left: 20px; margin: 3px 0;">– Phiếu xuất kho của cơ quan bên bán;</p>
            <p style="padding-left: 20px; margin: 3px 0;">– Giấy chứng minh nhân dân.</p>
          </div>
          
          <div class="section-title">Điều 4: TRÁCH NHIỆM CỦA CÁC BÊN</div>
          <div style="padding-left: 15px;">
            <p>1. Bên bán không chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá nếu vào thời điểm giao kết hợp đồng bên mua đã biết hoặc phải biết về những khiếm khuyết đó;</p>
            <p>2. Trừ trường hợp quy định tại khoản 1 Điều này, trong thời hạn khiếu nại theo quy định của Luật thương mại năm 2005, bên bán phải chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá đã có trước thời điểm chuyển rủi ro cho bên mua, kể cả trường hợp khiếm khuyết đó được phát hiện sau thời điểm chuyển rủi ro;</p>
            <p>3. Bên bán phải chịu trách nhiệm về khiếm khuyết của hàng hóa phát sinh sau thời điểm chuyển rủi ro nếu khiếm khuyết đó do bên bán vi phạm hợp đồng.</p>
            <p>4. Bên mua có trách nhiệm thanh toán và nhận hàng theo đúng thời gian đã thỏa thuận.</p>
          </div>
          
          <div class="section-title">Điều 5: BẢO HÀNH VÀ HƯỚNG DẪN SỬ DỤNG HÀNG HÓA</div>
          <div style="padding-left: 15px;">
            <p>1. Bên A có trách nhiệm bảo hành chất lượng và giá trị sử dụng loại hàng <span style="font-weight: bold;">Nông sản xuất khẩu</span> cho bên mua trong thời gian là <span style="font-weight: bold;">03</span> tháng.</p>
            <p>2. Bên A phải cung cấp đủ mỗi đơn vị hàng hóa một giấy hướng dẫn sử dụng, chứng chỉ nguồn gốc xuất xứ CO/CQ (nếu cần).</p>
          </div>
          
          <div class="section-title">Điều 6: NGƯNG THANH TOÁN TIỀN MUA HÀNG</div>
          <div style="padding-left: 15px;">
            <p>1. Bên B có bằng chứng về việc bên A lừa dối thì có quyền tạm ngừng việc thanh toán;</p>
            <p>2. Bên B có bằng chứng về việc hàng hóa đang là đối tượng bị tranh chấp thì có quyền tạm ngừng thanh toán cho đến khi việc tranh chấp đã được giải quyết;</p>
            <p>3. Bên B có bằng chứng về việc bên A đã giao hàng không phù hợp với hợp đồng thì có quyền tạm ngừng thanh toán cho đến khi bên A đã khắc phục sự không phù hợp đó;</p>
            <p>4. Trường hợp tạm ngừng thanh toán theo quy định tại khoản 2 và khoản 3 Điều này mà bằng chứng do bên B đưa ra không xác thực, gây thiệt hại cho bên A thì bên B phải bồi thường thiệt hại đó và chịu các chế tài khác theo quy định của pháp luật.</p>
          </div>
          
          <div class="section-title">Điều 7: ĐIỀU KHOẢN PHẠT VI PHẠM HỢP ĐỒNG</div>
          <div style="padding-left: 15px;">
            <p>1. Hai bên cam kết thực hiện nghiêm túc các điều khoản đã thỏa thuận trên, không được đơn phương thay đổi hoặc hủy bỏ hợp đồng, bên nào không thực hiện hoặc đơn phương đình chỉ thực hiện hợp đồng mà không có lý do chính đáng thì sẽ bị phạt tới <strong style="font-family: Arial;">8%</strong> giá trị của hợp đồng bị vi phạm.</p>
            <p>2. Bên nào vi phạm các điều khoản trên đây sẽ phải chịu trách nhiệm vật chất theo quy định của các văn bản pháp luật có hiệu lực hiện hành về phạt vi phạm chất lượng, số lượng, thời gian, địa điểm, thanh toán, bảo hành v.v… mức phạt cụ thể do hai bên thỏa thuận dựa trên khung phạt Nhà nước đã quy định trong các văn bản pháp luật về loại hợp đồng này.</p>
          </div>
          
          <div class="section-title">Điều 8: BẤT KHẢ KHÁNG VÀ GIẢI QUYẾT TRANH CHẤP</div>
          <div style="padding-left: 15px;">
            <p>1. Bất khả kháng nghĩa là các sự kiện xảy ra một cách khách quan, không thể lường trước được và không thể khắc phục được mặc dù đã áp dụng mọi biện pháp cần thiết trong khả năng cho phép, một trong các Bên vẫn không có khả năng thực hiện được nghĩa vụ của mình theo Hợp đồng này; gồm nhưng không giới hạn ở: thiên tai, hỏa hoạn, lũ lụt, chiến tranh, can thiệp của chính quyền bằng vũ trang, cản trở giao thông vận tải và các sự kiện khác tương tự.</p>
            <p>2. Khi xảy ra sự kiện bất khả kháng, bên gặp phải bất khả kháng phải không chậm trễ, thông báo cho bên kia tình trạng thực tế, đề xuất phương án xử lý và nỗ lực giảm thiểu tổn thất, thiệt hại đến mức thấp nhất có thể.</p>
            <p>3. Trừ trường hợp bất khả kháng, hai bên phải thực hiện đầy đủ và đúng thời hạn các nội dung của hợp đồng này. Trong quá trình thực hiện hợp đồng, nếu có vướng mắc từ bất kỳ bên nào, hai bên sẽ cùng nhau giải quyết trên tinh thần hợp tác. Trong trường hợp không tự giải quyết được, hai bên thống nhất đưa ra giải quyết tại Tòa án có thẩm quyền. Phán quyết của tòa án là quyết định cuối cùng, có giá trị ràng buộc các bên. Bên thua phải chịu toàn bộ các chi phí giải quyết tranh chấp.</p>
          </div>
          
          <div class="section-title">Điều 9. Điều khoản chung</div>
          <div style="padding-left: 15px; margin-bottom: 30px;">
            <p>1. Hợp đồng này có hiệu lực từ ngày ký và tự động thanh lý hợp đồng kể từ khi Bên B đã nhận đủ hàng và Bên A đã nhận đủ tiền.</p>
            <p>2. Hợp đồng này có giá trị thay thế mọi giao dịch, thỏa thuận trước đây của hai bên. Mọi sự bổ sung, sửa đổi hợp đồng này đều phải có sự đồng ý bằng văn bản của hai bên.</p>
            <p>3. Trừ các trường hợp được quy định ở trên, hợp đồng này không thể bị hủy bỏ nếu không có thỏa thuận bằng văn bản của các bên. Trong trường hợp hủy hợp đồng, trách nhiệm liên quan tới phạt vi phạm hợp đồng và bồi thường thiệt hại được bảo lưu.</p>
            <p>4. Hợp đồng này được lập thành <span style="font-weight: bold;">04</span> bản, có giá trị như nhau. Mỗi bên giữ <span style="font-weight: bold;">02</span> bản và có giá trị pháp lý như nhau.</p>
          </div>
          
          <div class="signatures-container">
            <div class="signature-box">
              <div class="signature-label">ĐẠI DIỆN BÊN BÁN (BÊN A)</div>
              <div class="signature-sub">(Ký, ghi rõ họ tên và đóng dấu)</div>
              
              ${!includeStamp ? `
                <div style="min-height: 120px;"></div>
              ` : c.status === 'pending_super_admin' ? `
                <div style="min-height: 80px; display: flex; align-items: center; font-style: italic; color: #777;">
                  Chưa ký số pháp lý
                </div>
              ` : `
                <div class="stamp-wrapper">
                  <svg width="120" height="120" viewBox="0 0 140 140" style="color: #ea4335;">
                    <circle cx="70" cy="70" r="66" stroke="#ea4335" stroke-width="3" fill="none" />
                    <circle cx="70" cy="70" r="48" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="2,2" fill="none" />
                    <path id="pathPrint" d="M 23,70 A 47,47 0 0,1 117,70" fill="none" />
                    <path id="pathPrintBottom" d="M 117,70 A 47,47 0 0,1 23,70" fill="none" />
                    <text font-size="9" font-weight="bold" fill="#ea4335">
                      <textPath href="#pathPrint" startOffset="50%" text-anchor="middle">
                        HTX NONG NGHIEP CONG NGHE CAO
                      </textPath>
                    </text>
                    <text font-size="9" font-weight="bold" fill="#ea4335">
                      <textPath href="#pathPrintBottom" startOffset="50%" text-anchor="middle">
                        * CAU DAT - LAM DONG *
                      </textPath>
                    </text>
                    <text x="70" y="65" font-size="11" font-weight="bold" text-anchor="middle" fill="#ea4335">ĐÃ KÝ</text>
                    <text x="70" y="80" font-size="10" font-weight="bold" text-anchor="middle" fill="#ea4335">CHỮ KÝ SỐ</text>
                  </svg>
                </div>
                
                <div class="cryptographic-meta">
                  <strong>CHỮ KÝ SỐ VIETAGRI CA ĐỐI TÁC</strong><br/>
                  Ký bởi: Hợp tác xã Công nghệ cao Cầu Đất<br/>
                  Thời gian ký: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}<br/>
                  Số sê-ri CA: CA-2026-9902A1F8D<br/>
                  Nhà cung cấp: Viettel-CA National Certificate Authority
                </div>
              `}
              
              ${includeStamp ? `
                <div style="margin-top: 15px; font-weight: bold; text-decoration: underline; font-size: 14.5px;">
                  ${c.seller?.rep || 'Nguyễn Văn Hợp'}
                </div>
              ` : ''}
            </div>
            
            <div class="signature-box">
              <div class="signature-label">ĐẠI DIỆN BÊN MUA (BÊN B)</div>
              <div class="signature-sub">(Ký, ghi rõ họ tên và đóng dấu)</div>
              
              ${!includeStamp ? `
                <div style="min-height: 120px;"></div>
              ` : !(c.status === 'active' || c.status === 'completed' || c.status === 'Đang thực hiện' || c.status === 'Đã hoàn tất') ? `
                <div style="min-height: 80px; display: flex; align-items: center; font-style: italic; color: #777;">
                  Chờ doanh nghiệp ký số liên kết
                </div>
              ` : `
                <div class="stamp-wrapper">
                  <svg width="120" height="120" viewBox="0 0 140 140" style="color: #0d8a43;">
                    <circle cx="70" cy="70" r="66" stroke="#0d8a43" stroke-width="3" fill="none" />
                    <circle cx="70" cy="70" r="48" stroke="#0d8a43" stroke-width="1.5" stroke-dasharray="2,2" fill="none" />
                    <path id="pathPrintB" d="M 23,70 A 47,47 0 0,1 117,70" fill="none" />
                    <path id="pathPrintBBottom" d="M 117,70 A 47,47 0 0,1 23,70" fill="none" />
                    <text font-size="9.5" font-weight="bold" fill="#0d8a43">
                      <textPath href="#pathPrintB" startOffset="50%" text-anchor="middle">
                        CONG TY CP NONG SAN SACH VN
                      </textPath>
                    </text>
                    <text font-size="9" font-weight="bold" fill="#0d8a43">
                      <textPath href="#pathPrintBBottom" startOffset="50%" text-anchor="middle">
                        * CHI NHANH NAM SAI GON *
                      </textPath>
                    </text>
                    <text x="70" y="65" font-size="11" font-weight="bold" text-anchor="middle" fill="#0d8a43">ĐÃ KÝ</text>
                    <text x="70" y="80" font-size="10" font-weight="bold" text-anchor="middle" fill="#0d8a43">XÁC THỰC</text>
                  </svg>
                </div>
                
                <div class="cryptographic-meta" style="color: #1a442e; background-color: #f6fbf8; border-color: #7ab293;">
                  <strong>CHỮ KÝ SỐ QUỐC GIA FPT-CA</strong><br/>
                  Ký bởi: ${c.buyer?.name || c.enterpriseName}<br/>
                  Đại diện: ${c.buyer?.rep || 'Trần Văn Bảo'}<br/>
                  Thời gian: ${new Date().toLocaleDateString('vi-VN')} trước 3 giờ<br/>
                  Số sê-ri CA: CA-2026-FPT-0012A349C
                </div>
              `}
              
              ${includeStamp ? `
                <div style="margin-top: 15px; font-weight: bold; text-decoration: underline; font-size: 14.5px;">
                  ${c.buyer?.rep || 'Trần Văn Bảo'}
                </div>
              ` : ''}
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 bg-white rounded-[2.5rem] shadow-xl">
      <div className="flex flex-col sm:flex-row items-sm-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-forest tracking-tight">Quản lý Hợp đồng Toàn hệ thống</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Giám sát vĩ mô, ký kết và theo dõi trạng thái các hợp động điện tử với nông dân và đối tác doanh nghiệp</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsCreateContractTypeModalOpen(true)} className="px-6 py-3 bg-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 flex items-center gap-2">
            <FileSignature size={16} /> Tạo hợp đồng mới
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đang hiệu lực</h4>
            <span className="text-2xl font-black text-slate-800">
              {140 + contracts.filter((c: any) => c.status === 'Đang thực hiện' || c.status === 'Đã ký' || c.status === 'signed').length}
            </span>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chờ phê duyệt</h4>
            <span className="text-2xl font-black text-slate-800">
              {contracts.filter((c: any) => ['Chờ duyệt', 'pending_super_admin', 'Chờ ký duyệt', 'coop_signed_pending_super', 'Thương thảo', 'Đang thương thảo'].includes(c.status)).length}
            </span>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Handshake size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Với đối tác & DN</h4>
            <span className="text-2xl font-black text-slate-800">
              {12 + contracts.filter((c: any) => c.type === 'b2b').length}
            </span>
          </div>
        </div>
      </div>

      {/* Phê duyệt Hợp đồng section (Top Priority) */}
      <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-150 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-rose-600 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-rose-500 animate-pulse" />
              Yêu cầu Phê duyệt / Thương thảo mới
            </h3>
            <p className="text-xs text-slate-500 font-medium">Lệnh phê duyệt, thương thảo hợp đồng của mạng lưới hệ thống</p>
          </div>
          {contracts.filter((c: any) => 
            ['Chờ duyệt', 'pending_super_admin', 'Chờ ký duyệt', 'coop_signed_pending_super', 'Thương thảo', 'Đang thương thảo'].includes(c.status)
          ).length > 0 && (
            <span className="bg-rose-100 text-rose-700 text-xs px-3 py-1.5 rounded-full font-black animate-pulse">
              {contracts.filter((c: any) => 
                ['Chờ duyệt', 'pending_super_admin', 'Chờ ký duyệt', 'coop_signed_pending_super', 'Thương thảo', 'Đang thương thảo'].includes(c.status)
              ).length} Hồ sơ mới
            </span>
          )}
        </div>

        {contracts.filter((c: any) => 
          ['Chờ duyệt', 'pending_super_admin', 'Chờ ký duyệt', 'coop_signed_pending_super', 'Thương thảo', 'Đang thương thảo'].includes(c.status)
        ).length === 0 ? (
          <div className="flex items-center gap-4 bg-emerald-50/50 border border-emerald-100/40 p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Mọi hồ sơ và dữ liệu giao dịch đã được ký duyệt</h4>
              <p className="text-xs text-slate-400 font-medium">Hiện không có yêu cầu phê duyệt hoặc thương thảo mới nào được gửi từ doanh nghiệp liên kết.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.filter((c: any) => 
              ['Chờ duyệt', 'pending_super_admin', 'Chờ ký duyệt', 'coop_signed_pending_super', 'Thương thảo', 'Đang thương thảo'].includes(c.status)
            ).map((item: any, i: number) => (
              <div 
                key={i}
                className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-500/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-black text-[#004d40] tracking-wider uppercase bg-emerald-50 border border-emerald-100/40 px-3 py-1 rounded-full">
                      Mã số: {item.id}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-wider">
                      <Clock size={12} className="animate-spin" /> Chờ phê duyệt
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-[#004d40] transition-colors">
                      {item.party}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Nông sản giao dịch: <strong className="text-slate-800">{item.cropName || 'Nông sản'}</strong>
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Giá trị ước tính: <strong className="text-forest text-sm font-black">{item.val || item.amount}</strong>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/40">
                  <button
                    type="button"
                    onClick={() => handleViewB2BContract(item)}
                    className="py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center"
                  >
                    Xem & Kiểm định
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveB2BContract(item.id)}
                    className="py-3 bg-[#004d40] hover:bg-emerald-950 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 size={12} /> Ký số nhanh
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Hợp đồng Thu mua (Xã viên) */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-mint/10 rounded-xl flex items-center justify-center text-mint">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-forest">Hợp đồng Hợp tác xã</h3>
                <p className="text-xs text-slate-500 font-medium">Thỏa thuận bao tiêu/thu mua từ các hợp tác xã thành viên</p>
              </div>
            </div>
            <button 
              onClick={() => setIsViewAllIndividualContractsModalOpen(true)}
              className="text-mint font-black text-[10px] uppercase tracking-widest hover:text-forest transition-colors">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4 relative z-10">
            {contracts.filter((c: any) => c.contractNo?.includes('HDLKTMHH')).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <FileSignature className="text-slate-300" size={24} />
                </div>
                <p className="text-sm font-bold text-slate-400">Chưa có hợp đồng nào</p>
              </div>
            ) : (
              contracts.filter((c: any) => c.contractNo?.includes('HDLKTMHH')).slice(0, 4).map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/contract-customer/${item.id}`)}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl group hover:border-mint/50 transition-all cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-sm font-bold text-slate-800 truncate">{item.party}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                      {item.amount && !['0.0 Triệu', '0.1 Triệu', '0 Triệu'].includes(item.amount) ? `${item.amount} • ` : ''}
                      {item.cropName || 'Nông sản'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className={`px-2 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-widest ${
                      item.status === 'Đang thực hiện' || item.status === 'signed' || item.status === 'active' ? 'bg-blue-50 text-blue-600' :
                      item.status === 'Đã hoàn tất' || item.status === 'Hoàn tất' || item.status === 'completed' || item.status === 'Nông dân đã ký' || item.status === 'Đã ký' ? 'bg-emerald-50 text-emerald-600' :
                      item.status === 'Đã từ chối' || item.status === 'rejected' || item.status === 'denied' || item.status === 'rejected_super_admin' || item.status === 'Hợp đồng đã bị từ chối' ? 'bg-rose-50 text-rose-600' :
                      item.status === 'Thương thảo' || item.status === 'Đang thương thảo' || item.status === 'negotiating' ? 'bg-purple-50 text-purple-600' :
                      item.status === 'Chờ duyệt' || item.status === 'pending_super_admin' || item.status === 'Chờ DN ký' || item.status === 'Chờ ký duyệt' || item.status === 'Chờ nông dân ký' || item.status === 'awaiting_farmer_signature' ? 'bg-amber-50 text-amber-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status === 'awaiting_farmer_signature' || item.status === 'Chờ ký duyệt' ? 'Chờ nông dân ký' : 
                       item.status === 'signed' && item.type === 'individual' ? 'Nông dân đã ký' : 
                       item.status}
                    </span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-mint transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hợp đồng Đối tác (Khách hàng B2B) */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-forest">Hợp đồng Đối tác B2B</h3>
                <p className="text-xs text-slate-500 font-medium">Khách hàng DN / Siêu thị quy mô</p>
              </div>
            </div>
            <button 
              onClick={() => setIsViewAllB2BContractsModalOpen(true)}
              className="text-mint font-black text-[10px] uppercase tracking-widest hover:text-forest transition-colors">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4 relative z-10">
            {contracts.filter((c: any) => c.contractNo?.includes('HĐMB')).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <FileSignature className="text-slate-300" size={24} />
                </div>
                <p className="text-sm font-bold text-slate-400">Chưa có hợp đồng nào</p>
              </div>
            ) : (
              contracts.filter((c: any) => c.contractNo?.includes('HĐMB')).slice(0, 4).map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => handleViewB2BContract(item)}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl group hover:border-mint/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-800">{item.party}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.val || item.amount} • {item.qty || item.date || 'Tấn'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-widest ${
                      item.status === 'Đang thực hiện' || item.status === 'signed' || item.status === 'active' ? 'bg-blue-50 text-blue-600' :
                      item.status === 'Đã hoàn tất' || item.status === 'Hoàn tất' || item.status === 'completed' || item.status === 'Nông dân đã ký' || item.status === 'Đã ký' ? 'bg-emerald-50 text-emerald-600' :
                      item.status === 'Đã từ chối' || item.status === 'rejected' || item.status === 'denied' || item.status === 'rejected_super_admin' || item.status === 'Hợp đồng đã bị từ chối' ? 'bg-rose-50 text-rose-600' :
                      item.status === 'Thương thảo' || item.status === 'Đang thương thảo' || item.status === 'negotiating' ? 'bg-purple-50 text-purple-600' :
                      item.status === 'Chờ duyệt' || item.status === 'pending_super_admin' || item.status === 'Chờ DN ký' || item.status === 'Chờ ký duyệt' || item.status === 'Chờ nông dân ký' || item.status === 'awaiting_farmer_signature' ? 'bg-amber-50 text-amber-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>{item.status === 'signed' && item.type !== 'individual' ? 'Đang thực hiện' : (item.status === 'pending_super_admin' ? 'Chờ duyệt' : item.status)}</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-mint transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal overlays for detailed viewing, signing or printing */}
      {selectedB2BContract && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white rounded-[2.5rem] p-8 md:p-12 max-w-6xl w-full xl:max-w-7xl shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto flex flex-col gap-6"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mục duyệt hợp đồng điện tử</span>
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-forest flex items-center gap-2">
                    <FileText className="text-[#004d40]" size={22} />
                    CHI TIẾT HỢP ĐỒNG SỐ #{selectedB2BContract.contractNo?.includes('/2026') ? selectedB2BContract.contractNo : `${selectedB2BContract.contractNo || selectedB2BContract.id?.split('-').pop() || '01'}/2026/HĐMB`}
                  </h3>
                 
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedB2BContract(null);
                  setSigningStep('idle');
                }}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500"
              >
                ✕
              </button>
            </div>

            {signingStep !== 'idle' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                {signingStep === 'pincode' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full space-y-6"
                  >
                    <div className="mx-auto w-20 h-20 bg-[#f0f7f5] rounded-full flex items-center justify-center text-[#1a5f53] mb-6">
                      <Lock size={40} />
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-black text-slate-800">Ký số</h4>
                      <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto">Vui lòng nhập mã PIN bảo mật của USB Token Vietagri-CA để áp dụng chữ ký số.</p>
                    </div>

                    <div className="space-y-4">
                      <input 
                        type="password"
                        placeholder="Mã PIN Chữ ký số (Mặc định: 123456)"
                        className="w-full px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-center font-bold tracking-widest text-lg outline-none focus:border-[#1a5f53] transition-all text-slate-600 placeholder:text-slate-400"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleVerifyPinAndSign()}
                      />
                      {pinError && (
                        <p className="text-sm text-red-500 font-bold text-center">{pinError}</p>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setSigningStep('idle')}
                        className="w-1/2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyPinAndSign}
                        className="w-1/2 py-4 bg-[#1a5f53] hover:bg-[#0c4a3e] text-white rounded-2xl font-black text-xs uppercase shadow-md shadow-[#1a5f53]/20"
                      >
                        Xác nhận ký
                      </button>
                    </div>
                  </motion.div>
                )}

                {signingStep === 'signing' && (
                  <div className="max-w-lg w-full space-y-6">
                    <div className="relative w-28 h-28 mx-auto">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                        <motion.circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          stroke="#1a5f53" 
                          strokeWidth="6" 
                          fill="transparent"
                          strokeDasharray="264"
                          animate={{ strokeDashoffset: 264 - (2.64 * signProgress) }}
                          transition={{ duration: 0.3 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-slate-800 text-xl font-mono">
                        {signProgress}%
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-base font-black text-slate-800 animate-pulse">Đang thực hiện quy trình ký</h4>
                      <p className="text-xs text-slate-500 font-mono italic max-w-sm mx-auto">{signStatusMessage}</p>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1a5f53] h-full transition-all duration-300" style={{ width: `${signProgress}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Được hỗ trợ bởi Viettel-CA HSM Secure Signature Tool</p>
                  </div>
                )}

                {signingStep === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full space-y-6"
                  >
                    <div className="mx-auto w-16 h-16 bg-[#1a5f53] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#1a5f53]/20 mb-4">
                      <CheckCircle2 size={36} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#1a5f53]">Ký số Hợp tác xã Thành công!</h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Hợp đồng điện tử <strong>Số {selectedB2BContract.contractNo}</strong> đã được đại diện Hợp tác xã ký số HSM thành công. Hệ thống đã đồng bộ chuyển tiếp văn kiện này sang trang <strong>Customer Dashboard</strong> của Doanh nghiệp đối tác (Bên mua) để thực hiện ký số đối ứng. Hợp đồng chưa có hiệu lực pháp lý toàn vẹn và không thể tải bản in PDF cho tới khi cả hai bên đã hoàn tất ký số.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        disabled
                        className="w-1/2 py-3.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200"
                      >
                        <Lock size={14} /> Chưa thể tải bản in PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSigningStep('idle');
                          setSelectedB2BContract(null);
                        }}
                        className="w-1/2 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs uppercase"
                      >
                        Đóng / Hoàn tất
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : isRejectingInline ? (
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="max-w-md w-full space-y-6">
                  <div className="mx-auto w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-6 font-sans">
                    <XCircle size={40} />
                  </div>
                  <div className="text-center font-sans">
                    <h4 className="text-2xl font-black text-slate-800">Từ chối phê duyệt</h4>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">Vui lòng nhập lý do từ chối phê duyệt hợp đồng này để gửi phản hồi cho doanh nghiệp đối tác.</p>
                  </div>
                  <div className="space-y-4 font-sans">
                    <textarea 
                      placeholder="Nhập lý do từ chối (Ví dụ: Sản lượng không đúng đợt thu hoạch, sai thông tin đại diện pháp luật...)"
                      rows={4}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl text-left font-medium text-sm outline-none focus:border-rose-500 transition-all text-slate-700 placeholder:text-slate-400"
                      value={rejectionReason || ''}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4 pt-2 font-sans">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRejectingInline(false);
                        setRejectionReason('');
                      }}
                      className="w-1/2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleRejectB2BContract(selectedB2BContract.id, rejectionReason);
                        setIsRejectingInline(false);
                      }}
                      className="w-1/2 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase shadow-md shadow-rose-600/20"
                    >
                      Xác nhận từ chối
                    </button>
                  </div>
                </div>
              </div>
            ) : isNegotiatingInline ? (
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="max-w-md w-full space-y-6">
                  <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-6 font-sans">
                    <Clock size={40} />
                  </div>
                  <div className="text-center font-sans">
                    <h4 className="text-2xl font-black text-slate-800">Thương thảo điều khoản</h4>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">Vui lòng nhập nội dung đề xuất thương thảo/điều chỉnh để phản hồi cho doanh nghiệp đối tác.</p>
                  </div>
                  <div className="space-y-4 font-sans">
                    <textarea 
                      placeholder="Nhập nội dung đề xuất thương thảo (Ví dụ: Yêu cầu điều chỉnh đơn giá cà phê thành 135.000 VNĐ/kg hoặc thay đổi tiến độ giao đợt 1...)"
                      rows={4}
                      className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl text-left font-medium text-sm outline-none focus:border-amber-500 transition-all text-slate-700 placeholder:text-slate-400"
                      value={negotiationNotes || ''}
                      onChange={(e) => setNegotiationNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4 pt-2 font-sans">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNegotiatingInline(false);
                        setNegotiationNotes('');
                      }}
                      className="w-1/2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleNegotiateB2BContract(selectedB2BContract.id, negotiationNotes);
                        setIsNegotiatingInline(false);
                      }}
                      className="w-1/2 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase shadow-md shadow-amber-500/20"
                    >
                      Gửi yêu cầu thương thảo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-12 text-[#1c1c1c] font-serif leading-relaxed text-sm space-y-8 max-h-[68vh] overflow-y-auto scrollbar-thin shadow-inner select-text relative">
  {/* TIÊU NGỮ VÀ QUỐC HIỆU */}
  <div className="text-center font-serif text-slate-900 space-y-0.5">
    <div className="font-bold text-[14px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
    <div className="font-bold text-[13.5px]">Độc lập – Tự do – Hạnh phúc</div>
    <div className="w-36 h-[1.5px] bg-slate-950 mx-auto mt-2"></div>
  </div>

  {/* TÊN HỢP ĐỒNG */}
  <div className="text-center font-serif py-3 space-y-1">
    <h4 className="text-[17px] font-bold text-slate-900">
      {cleanContractNo(selectedB2BContract.contractNo, selectedB2BContract.id).includes('HĐHTSXNN') 
        ? 'HỢP ĐỒNG HỢP TÁC SẢN XUẤT NÔNG NGHIỆP' 
        : (cleanContractNo(selectedB2BContract.contractNo, selectedB2BContract.id).includes('HDLKTMHH') 
            ? 'HỢP ĐỒNG LIÊN KẾT THU MUA HÀNG HÓA' 
            : 'HỢP ĐỒNG MUA BÁN HÀNG HÓA')}
    </h4>
    <p className="text-xs font-sans">Số: {cleanContractNo(selectedB2BContract.contractNo, selectedB2BContract.id)}</p>
  </div>

  {/* CĂN CỨ PHÁP LÝ */}
  <div className="text-xs space-y-1 pl-4 italic border-l-2 border-slate-300">
    <p>– Căn cứ Bộ luật Dân sự 2015;</p>
    <p>– Căn cứ Luật Thương mại 2005;</p>
    <p>– Căn cứ nhu cầu và khả năng thực tế của các bên.</p>
  </div>

  {/* LỜI MỞ ĐẦU */}
  <p className="text-xs leading-relaxed text-justify indent-8 pt-2 font-serif">
    Hôm nay, ngày {new Date(selectedB2BContract.createdAt).getDate()} tháng {new Date(selectedB2BContract.createdAt).getMonth() + 1} năm 2026, tại địa chỉ: Văn phòng Ban quản trị Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất, Việt Nam, chúng tôi gồm có:
  </p>

  {/* THÔNG TIN CÁC BÊN THAM GIA */}
  <div className="space-y-6 pt-2 font-sans text-xs">
    {/* BÊN BÁN - BÊN A */}
    <div className="border border-slate-200 rounded-2xl bg-white p-5 space-y-3">
      <div className="font-bold text-forest uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
        <span className="w-1.5 h-1.5 rounded-full bg-forest" />
        BÊN BÁN (Bên A)
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700">
        <div className="md:col-span-2"><strong>Tên doanh nghiệp:</strong> {selectedB2BContract.seller?.name || 'Hợp tác xã Nông nghiệp Công nghệ cao Cầu Đất'}</div>
        <div className="md:col-span-2"><strong>Mã số doanh nghiệp:</strong> {selectedB2BContract.seller?.taxCode || '3901284560'}</div>
        <div className="md:col-span-2"><strong>Địa chỉ trụ sở chính:</strong> {selectedB2BContract.seller?.address || 'Khu phố 1, Huyện Đức Trọng, Tỉnh Lâm Đồng'}</div>
        <div><strong>Người đại diện pháp luật:</strong> {selectedB2BContract.seller?.rep || 'Nguyễn Văn Hợp'}</div>
        <div><strong>Chức danh:</strong> {selectedB2BContract.seller?.position || 'Chủ tịch HĐQT'}</div>
        <div><strong>CMND/CCCD/Hộ chiếu:</strong> {selectedB2BContract.seller?.cccd || '068092004561'}</div>
        <div><strong>Cấp ngày:</strong> {selectedB2BContract.seller?.cccdDate || '15/08/2021'} tại {selectedB2BContract.seller?.cccdPlace || 'Cục Cảnh sát QLHC'}</div>
        <div><strong>Số điện thoại:</strong> {selectedB2BContract.seller?.phone || '0988777666'}</div>
        <div><strong>Fax:</strong> {selectedB2BContract.seller?.fax || '02633 847 112'}</div>
        <div className="md:col-span-2"><strong>Tài khoản ngân hàng:</strong> {selectedB2BContract.seller?.bankAcc || '999988887777'} - <span className="italic">Mở tại: {selectedB2BContract.seller?.bankName || 'Agribank - Chi nhánh Tỉnh Lâm Đồng'}</span></div>
      </div>
    </div>

    {/* BÊN B - XÃ VIÊN HOẶC DOANH NGHIỆP MUA */}
    {selectedB2BContract.type === 'internal' ? (
      <div className="border border-slate-200 rounded-2xl bg-white p-5 space-y-3">
        <div className="font-bold text-emerald-800 uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
          XÃ VIÊN LIÊN KẾT (Bên B)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700">
          <div className="md:col-span-2"><strong>Họ và tên xã viên:</strong> {selectedB2BContract.buyer?.name || selectedB2BContract.party}</div>
          <div><strong>Số CCCD:</strong> {selectedB2BContract.buyer?.cccd || '068092004512'}</div>
          <div><strong>Cấp ngày:</strong> {selectedB2BContract.buyer?.cccdDate || '12/04/2019'} tại {selectedB2BContract.buyer?.cccdPlace || 'CA Tỉnh Lâm Đồng'}</div>
          <div><strong>Số điện thoại liên hệ:</strong> {selectedB2BContract.buyer?.phone || '0982345671'}</div>
          <div className="md:col-span-2"><strong>Địa chỉ thường trú:</strong> {selectedB2BContract.buyer?.address}</div>
          <div><strong>Mã vùng canh tác liên kết:</strong> <span className="text-emerald-800 font-black">{selectedB2BContract.buyer?.growingAreaCode || 'VT-LĐ-0941'}</span></div>
          <div><strong>Diện tích canh tác:</strong> <span className="text-slate-800 font-bold">{selectedB2BContract.buyer?.landArea || '1.5 ha'}</span></div>
        </div>
      </div>
    ) : (
      <div className="border border-slate-200 rounded-2xl bg-white p-5 space-y-3">
        <div className="font-bold text-indigo-700 uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          BÊN MUA (Bên B)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700">
          <div className="md:col-span-2"><strong>Tên doanh nghiệp:</strong> {selectedB2BContract.buyer?.name || selectedB2BContract.enterpriseName || 'Công ty Cổ phần Nông sản Sạch Việt Nam'}</div>
          <div className="md:col-span-2"><strong>Mã số doanh nghiệp:</strong> {selectedB2BContract.buyer?.taxCode || '0312345678'}</div>
          <div className="md:col-span-2"><strong>Địa chỉ trụ sở chính:</strong> {selectedB2BContract.buyer?.address || '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'}</div>
          <div><strong>Người đại diện pháp luật:</strong> {selectedB2BContract.buyer?.rep || 'Trần Văn Bảo'}</div>
          <div><strong>Chức danh:</strong> {selectedB2BContract.buyer?.position || 'Giám đốc mua hàng'}</div>
          <div><strong>CMND/CCCD/Hộ chiếu:</strong> {selectedB2BContract.buyer?.cccd || '079093004455'}</div>
          <div><strong>Cấp ngày:</strong> {selectedB2BContract.buyer?.cccdDate || '20/10/2020'} tại {selectedB2BContract.buyer?.cccdPlace || 'Cục Cảnh sát QLHC'}</div>
          <div><strong>Số điện thoại:</strong> {selectedB2BContract.buyer?.phone || '0912345678'}</div>
          <div><strong>Fax:</strong> {selectedB2BContract.buyer?.fax || '02838 123 456'}</div>
          <div className="md:col-span-2"><strong>Tài khoản ngân hàng:</strong> {selectedB2BContract.buyer?.bankAcc || '1029384756'} - <span className="italic">Mở tại: {selectedB2BContract.buyer?.bankName || 'Vietcombank - Chi nhánh Nam Sài Gòn'}</span></div>
        </div>
      </div>
    )}
  </div>

  <p className="text-xs text-justify font-serif">
    Trên cơ sở thỏa thuận hoàn toàn tự nguyện, hai bên thống nhất ký kết hợp đồng mua bán hàng hóa với các điều khoản như sau:
  </p>

  {/* ĐIỀU KHOẢN CHI TIẾT */}
  <div className="space-y-6 font-serif text-[13.5px]">
    
    {/* ĐIỀU 1 */}
    <div className="space-y-2">
      <h5 className="font-bold text-slate-900 border-b pb-1">Điều 1: Tên hàng hóa, số lượng, chất lượng, giá trị hợp đồng</h5>
      <p className="text-xs text-slate-700">Bên A bán cho bên B hàng hóa sau đây:</p>
      <div className="border border-slate-200 rounded-xl overflow-hidden font-sans">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-3 text-center style={{ width: '6%' }}">STT</th>
              <th className="p-3 style={{ width: '35%' }}">Tên hàng hóa</th>
              <th className="p-3 text-center style={{ width: '10%' }}">Đơn vị</th>
              <th className="p-3 text-center style={{ width: '12%' }}">Số lượng</th>
              <th className="p-3 text-right style={{ width: '15%' }}">Đơn giá</th>
              <th className="p-3 text-right style={{ width: '22%' }}">Thành tiền (VNĐ)</th>
              <th className="p-3">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {(selectedB2BContract.items && Array.isArray(selectedB2BContract.items)) ? (
              selectedB2BContract.items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3 font-bold text-slate-800">{item.cropName}</td>
                  <td className="p-3 text-center">{item.unit || 'kg'}</td>
                  <td className="p-3 text-center font-bold text-slate-900">{(item.totalVolume || item.quantity || 0).toLocaleString('vi-VN')}</td>
                  <td className="p-3 text-right">{(item.unitPrice || '0').toLocaleString('vi-VN')}</td>
                  <td className="p-3 text-right font-black text-forest">{(item.totalVal || 0).toLocaleString('vi-VN')} VNĐ</td>
                  <td className="p-3 text-slate-500 text-[11px]">{item.note || 'Đạt chuẩn chất lượng cam kết'}</td>
                </tr>
              ))
            ) : (
              <>
                <tr className="border-b border-slate-200">
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 font-bold text-slate-800">{selectedB2BContract.cropName || 'Cà phê Arabica Cầu Đất'}</td>
                  <td className="p-3 text-center">kg</td>
                  <td className="p-3 text-center font-bold text-slate-900">{(selectedB2BContract.totalVolume || 0).toLocaleString('vi-VN')}</td>
                  <td className="p-3 text-right">{selectedB2BContract.unitPrice ? selectedB2BContract.unitPrice.toLocaleString('vi-VN') : '130.000'}</td>
                  <td className="p-3 text-right font-black text-forest">{(selectedB2BContract.totalVal || 0).toLocaleString('vi-VN')} VNĐ</td>
                  <td className="p-3 text-slate-500 text-[11px]">Đạt chuẩn hữu cơ chất lượng cao xuất khẩu</td>
                </tr>
                <tr className="border-b border-slate-200 text-slate-400 italic">
                  <td className="p-3 text-center">2</td>
                  <td className="p-3">--</td>
                  <td className="p-3 text-center">--</td>
                  <td className="p-3 text-center">--</td>
                  <td className="p-3 text-right">--</td>
                  <td className="p-3 text-right">--</td>
                  <td className="p-3 text-slate-500 text-[11px] not-italic font-sans">Hạng mục bao tiêu liên kết trọn gói</td>
                </tr>
              </>
            )}
            <tr className="bg-slate-50/50 font-bold">
              <td colSpan={5} className="p-3 text-right text-slate-700">Tổng cộng:</td>
              <td className="p-3 text-right font-black text-rose-700">{(selectedB2BContract.totalVal || 0).toLocaleString('vi-VN')} VNĐ</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bg-white p-3.5 rounded-xl border text-xs text-slate-700 space-y-1">
        <p><strong>Tổng cộng bằng tiền:</strong> <span className="font-sans font-bold text-slate-900">{selectedB2BContract.totalVal?.toLocaleString('vi-VN')}</span> đồng.</p>
        <p><strong>Bằng chữ:</strong> <span className="italic font-bold text-slate-900 underline">{docSoTienBangChu(selectedB2BContract.totalVal)}</span></p>
      </div>
    </div>

    {/* ĐIỀU 2 */}
    <div className="space-y-1.5">
      <h5 className="font-bold text-slate-900 border-b pb-1">Điều 2: Thanh toán</h5>
      <div className="text-xs text-slate-700 pl-4 space-y-1">
        <p>1. Bên B phải thanh toán cho Bên A số tiền ghi tại Điều 1 của Hợp đồng này muộn nhất vào ngày 15 tháng 12 năm 2026.</p>
        <p>2. Bên B thanh toán cho Bên A theo hình thức <span className="font-bold underline">{selectedB2BContract.paymentMethod || 'Chuyển khoản liên ngân hàng 24/7'}</span> vào tài khoản chỉ định tại Điều trên.</p>
      </div>
    </div>

    {/* ĐIỀU 3 */}
    <div className="space-y-2">
      <h5 className="font-bold text-slate-900 border-b pb-1">Điều 3: Thời gian, địa điểm, phương thức giao hàng</h5>
      <div className="text-xs text-slate-700 pl-4 space-y-3">
        <p>1. Bên A giao hàng cho bên B theo lịch sau:</p>
        <div className="border border-slate-200 rounded-xl overflow-hidden font-sans mx-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-2.5 text-center style={{ width: '8%' }}">STT</th>
                <th className="p-2.5">Tên hàng hóa</th>
                <th className="p-2.5 text-center style={{ width: '10%' }}">Đơn vị</th>
                <th className="p-2.5 text-center style={{ width: '12%' }}">Số lượng</th>
                <th className="p-2.5">Thời gian giao hàng</th>
                <th className="p-2.5">Địa điểm giao hàng</th>
                <th className="p-2.5">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2.5 text-center">1</td>
                <td className="p-2.5 font-bold text-slate-800">{selectedB2BContract.cropName || 'Cà phê Arabica Cầu Đất'}</td>
                <td className="p-2.5 text-center">kg</td>
                <td className="p-2.5 text-center font-bold">{(selectedB2BContract.totalVolume || 0).toLocaleString('vi-VN')}</td>
                <td className="p-2.5">{selectedB2BContract.deliveryTime || 'Trong vòng 15 ngày kể từ ngày ký'}</td>
                <td className="p-2.5">{selectedB2BContract.deliveryLocation || 'Kho bãi bên bán'}</td>
                <td className="p-2.5 text-slate-500">Theo đợt thu hoạch thực tế</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>2. Phương tiện vận chuyển và chi phí vận chuyển do bên <span className="font-bold underline">Bên B (Bên Mua)</span> chịu. Chi phí bốc xếp <span className="italic">do bên A chịu trách nhiệm bốc xếp đưa lên container tại bãi kho bên bán</span>.</p>
        <p>3. Quy định lịch giao nhận hàng hóa mà bên mua không đến nhận hàng thì phải chịu chi phí lưu kho bãi là <strong className="font-sans">1.000.000</strong> đồng/ngày. Nếu phương tiện vận chuyển bên mua đến mà bên bán không có hàng giao thì bên bán phải chịu chi phí thực tế cho việc điều động phương tiện.</p>
        <p>4. Khi nhận hàng, bên mua có trách nhiệm kiểm nhận phẩm chất, quy cách hàng hóa tại chỗ. Nếu phát hiện hàng thiếu hoặc không đúng tiêu chuẩn chất lượng v.v… thì lập biên bản tại chỗ, yêu cầu bên bán xác nhận. Hàng đã ra khỏi kho bên bán không chịu trách nhiệm (trừ loại hàng có quy định thời hạn bảo hành).</p>
        <p>5. Trường hợp giao nhận hàng theo nguyên đai, nguyên kiện, nếu bên mua sau khi chở về nhập kho mới phát hiện vi phạm thì phải lập biên bản gọi cơ quan kiểm tra trung gian (<span className="font-bold">Trung tâm Kiểm định & Đo lường QUATEST Lâm Đồng</span>) đến xác nhận và phải gửi đến bên bán trong hạn 10 ngày tính từ khi lập biên bản. Sau 15 ngày nếu bên bán đã nhận được biên bản mà không có ý kiến gì thì coi như đã chịu trách nhiệm bồi thường lô hàng đó.</p>
        <p>6. Mỗi lô hàng khi giao nhận phải có xác nhận chất lượng bằng phiếu hoặc biên bản kiểm nghiệm; khi đến nhận hàng, người nhận phải có đủ:</p>
        <div className="pl-4 space-y-0.5 text-slate-600">
          <p>– Giấy giới thiệu của cơ quan bên mua;</p>
          <p>– Phiếu xuất kho của cơ quan bên bán;</p>
          <p>– Giấy chứng minh nhân dân / Căn cước công dân.</p>
        </div>
      </div>
    </div>

    {/* ĐIỀU 4 */}
    <div className="space-y-1.5">
      <h5 className="font-bold text-slate-900 border-b pb-1">Điều 4: Trách nhiệm của các bên</h5>
      <div className="text-xs text-slate-700 pl-4 space-y-1 text-justify">
        <p>1. Bên bán không chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá nếu vào thời điểm giao kết hợp đồng bên mua đã biết hoặc phải biết về những khiếm khuyết đó;</p>
        <p>2. Trừ trường hợp quy định tại khoản 1 Điều này, trong thời hạn khiếu nại theo quy định của Luật thương mại năm 2005, bên bán phải chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá đã có trước thời điểm chuyển rủi ro cho bên mua, kể cả trường hợp khiếm khuyết đó được phát hiện sau thời điểm chuyển rủi ro;</p>
        <p>3. Bên bán phải chịu trách nhiệm về khiếm khuyết của hàng hóa phát sinh sau thời điểm chuyển rủi ro nếu khiếm khuyết đó do bên bán vi phạm hợp đồng.</p>
        <p>4. Bên mua có trách nhiệm thanh toán và nhận hàng theo đúng thời gian đã thỏa thuận.</p>
      </div>
    </div>

    {/* ĐIỀU 5 */}
    <div className="space-y-1.5">
      <h5 className="font-bold text-slate-900 border-b pb-1">Điều 5: Bảo hành và hướng dẫn sử dụng hàng hóa</h5>
      <div className="text-xs text-slate-700 pl-4 space-y-1">
        <p>1. Bên A có trách nhiệm bảo hành chất lượng và giá trị sử dụng loại hàng <span className="font-bold">Nông sản xuất khẩu</span> cho bên mua trong thời gian là <span className="font-bold">03</span> tháng.</p>
        <p>2. Bên A phải cung cấp đủ mỗi đơn vị hàng hóa một giấy hướng dẫn sử dụng, chứng chỉ nguồn gốc xuất xứ CO/CQ (nếu cần).</p>
      </div>
    </div>

    {/* ĐIỀU 6 */}
    <div className="space-y-1.5">
      <h5 className="font-bold text-slate-900 border-b pb-1">Điều 6: Ngưng thanh toán tiền mua hàng</h5>
      <div className="text-xs text-slate-700 pl-4 space-y-1 text-justify">
        <p>1. Bên B có bằng chứng về việc bên A lừa dối thì có quyền tạm ngừng việc thanh toán;</p>
        <p>2. Bên B có bằng chứng về việc hàng hóa đang là đối tượng bị tranh chấp thì có quyền tạm ngừng thanh toán cho đến khi việc tranh chấp đã được giải quyết;</p>
        <p>3. Bên B có bằng chứng về việc bên A đã giao hàng không phù hợp với hợp đồng thì có quyền tạm ngừng thanh toán cho đến khi bên A đã khắc phục sự không phù hợp đó;</p>
        <p>4. Trường hợp tạm ngừng thanh toán theo quy định tại khoản 2 và khoản 3 Điều này mà bằng chứng do bên B đưa ra không xác thực, gây thiệt hại cho bên A thì bên B phải bồi thường thiệt hại đó và chịu các chế tài khác theo quy định của pháp luật.</p>
      </div>
    </div>

    {/* ĐIỀU 7 */}
    <div className="space-y-1.5">
      <h5 className="font-bold text-slate-900 border-b pb-1">Điều 7: Điều khoản phạt vi phạm hợp đồng</h5>
      <div className="text-xs text-slate-700 pl-4 space-y-1 text-justify">
        <p>1. Hai bên cam kết thực hiện nghiêm túc các điều khoản đã thỏa thuận trên, không được đơn phương thay đổi hoặc hủy bỏ hợp đồng, bên nào không thực hiện hoặc đơn phương đình chỉ thực hiện hợp đồng mà không có lý do chính đáng thì sẽ bị phạt tới <strong className="font-sans">8%</strong> giá trị của hợp đồng bị vi phạm.</p>
        <p>2. Bên nào vi phạm các điều khoản trên đây sẽ phải chịu trách nhiệm vật chất theo quy định của các văn bản pháp luật có hiệu lực hiện hành về phạt vi phạm chất lượng, số lượng, thời gian, địa điểm, thanh toán, bảo hành v.v… mức phạt cụ thể do hai bên thỏa thuận dựa trên khung phạt Nhà nước đã quy định trong các văn bản pháp luật về loại hợp đồng này.</p>
      </div>
    </div>

    {/* ĐIỀU 8 */}
    <div className="space-y-1.5">
      <h5 className="font-bold text-slate-900 border-b pb-1">Điều 8: Bất khả kháng và giải quyết tranh chấp</h5>
      <div className="text-xs text-slate-700 pl-4 space-y-1 text-justify">
        <p>1. Bất khả kháng nghĩa là các sự kiện xảy ra một cách khách quan, không thể lường trước được và không thể khắc phục được mặc dù đã áp dụng mọi biện pháp cần thiết trong khả năng cho phép, một trong các Bên vẫn không có khả năng thực hiện được nghĩa vụ của mình theo Hợp đồng này; gồm nhưng không giới hạn ở: thiên tai, hỏa hoạn, lũ lụt, chiến tranh, can thiệp của chính quyền bằng vũ trang, cản trở giao thông vận tải và các sự kiện khác tương tự.</p>
        <p>2. Khi xảy ra sự kiện bất khả kháng, bên gặp phải bất khả kháng phải không chậm trễ, thông báo cho bên kia tình trạng thực tế, đề xuất phương án xử lý và nỗ lực giảm thiểu tổn thất, thiệt hại đến mức thấp nhất có thể.</p>
        <p>3. Trừ trường hợp bất khả kháng, hai bên phải thực hiện đầy đủ và đúng thời hạn các nội dung của hợp đồng này. Trong quá trình thực hiện hợp đồng, nếu có vướng mắc từ bất kỳ bên nào, hai bên sẽ cùng nhau giải quyết trên tinh thần hợp tác. Trong trường hợp không tự giải quyết được, hai bên thống nhất đưa ra giải quyết tại Tòa án có thẩm quyền. Phán quyết của tòa án là quyết định cuối cùng, có giá trị ràng buộc các bên. Bên thua phải chịu toàn bộ các chi phí giải quyết tranh chấp.</p>
      </div>
    </div>

    {/* ĐIỀU 9 */}
    <div className="space-y-1.5">
      <h5 className="font-bold text-slate-900 border-b pb-1">Điều 9: Điều khoản chung</h5>
      <div className="text-xs text-slate-700 pl-4 space-y-1 text-justify pb-4">
        <p>1. Hợp đồng này có hiệu lực từ ngày ký và tự động thanh lý hợp đồng kể từ khi Bên B đã nhận đủ hàng và Bên A đã nhận đủ tiền.</p>
        <p>2. Hợp đồng này có giá trị thay thế mọi giao dịch, thỏa thuận trước đây của hai bên. Mọi sự bổ sung, sửa đổi hợp đồng này đều phải có sự đồng ý bằng văn bản của hai bên.</p>
        <p>3. Trừ các trường hợp được quy định ở trên, hợp đồng này không thể bị hủy bỏ nếu không có thỏa thuận bằng văn bản của các bên. Trong trường hợp hủy hợp đồng, trách nhiệm liên quan tới phạt vi phạm hợp đồng và bồi thường thiệt hại được bảo lưu.</p>
        <p>4. Hợp đồng này được lập thành <span className="font-bold">04</span> bản, có giá trị như nhau. Mỗi bên giữ <span className="font-bold">02</span> bản và có giá trị pháp lý như nhau.</p>
      </div>
    </div>

  </div>

  {/* KHU VỰC CHỮ KÝ SỐ / CON DẤU PHÁP LÝ */}
  <div className="flex justify-between items-start pt-8 border-t border-slate-200 font-sans">
    
    {/* ĐẠI DIỆN BÊN A */}
    <div className="text-center w-1/2 flex flex-col items-center">
      <p className="text-[10px] uppercase font-black text-slate-500">ĐẠI DIỆN BÊN BÁN (BÊN A)</p>
      <p className="text-[10px] text-slate-400 italic mb-2">(Ký, ghi rõ họ tên và đóng dấu)</p>
      
      {/* Logic hiển thị con dấu điện tử SVG vẽ tròn */}
      {selectedB2BContract.status === 'pending_super_admin' ? (
        <div className="text-xs italic text-slate-400 py-10 font-bold">Chưa ký số pháp lý</div>
      ) : (
        <div className="my-2 p-1 flex justify-center items-center bg-transparent transition-transform hover:scale-105">
          <svg width="120" height="120" viewBox="0 0 140 140" className="text-rose-600 select-none">
            <circle cx="70" cy="70" r="66" stroke="currentColor" strokeWidth="3" fill="none" />
            <circle cx="70" cy="70" r="48" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" fill="none" />
            <path id="pathPrint" d="M 23,70 A 47,47 0 0,1 117,70" fill="none" />
            <path id="pathPrintBottom" d="M 117,70 A 47,47 0 0,1 23,70" fill="none" />
            <text fontSize="8.5" fontWeight="bold" fill="currentColor">
              <textPath href="#pathPrint" startOffset="50%" textAnchor="middle">
                HTX NONG NGHIEP CONG NGHE CAO
              </textPath>
            </text>
            <text fontSize="9" fontWeight="bold" fill="currentColor">
              <textPath href="#pathPrintBottom" startOffset="50%" textAnchor="middle">
                * CAU DAT - LAM DONG *
              </textPath>
            </text>
            <text x="70" y="65" fontSize="12" fontWeight="black" textAnchor="middle" fill="currentColor">ĐÃ KÝ</text>
            <text x="70" y="82" fontSize="10" fontWeight="bold" textAnchor="middle" fill="currentColor">SỐ</text>
          </svg>
        </div>
      )}
      <p className="text-xs font-bold text-slate-700 underline mt-2 uppercase">{selectedB2BContract.seller?.rep || 'Nguyễn Văn Hợp'}</p>
    </div>

    {/* ĐẠI DIỆN BÊN B */}
    <div className="text-center w-1/2 flex flex-col items-center">
      <p className="text-[10px] uppercase font-black text-slate-500">ĐẠI DIỆN BÊN MUA (BÊN B)</p>
      <p className="text-[10px] text-slate-400 italic mb-2">(Ký, ghi rõ họ tên và đóng dấu)</p>
      
      {(selectedB2BContract.status === 'active' || selectedB2BContract.status === 'completed' || selectedB2BContract.status === 'Đang thực hiện' || selectedB2BContract.status === 'Đã hoàn tất' || selectedB2BContract.status === 'Hoàn tất' || selectedB2BContract.status === 'signed' || selectedB2BContract.status === 'Nông dân đã ký' || selectedB2BContract.status === 'Đã ký') ? (
        <div className="my-4 border border-emerald-500 rounded-xl bg-emerald-50 p-4 text-[10px] text-emerald-600 font-bold max-w-xs relative flex flex-col gap-0.5 transition-transform hover:scale-105">
          <span className="uppercase text-emerald-700 font-black text-center tracking-wider">ELECTRONICALLY SIGNED</span>
          <span className="font-mono text-center">{selectedB2BContract.buyer?.name || selectedB2BContract.enterpriseName || 'CONG TY CP NONG SAN SACH VN'}</span>
        </div>
      ) : (
        <div className="text-xs italic text-slate-400 py-10 font-bold">Chưa ký số (Chờ Doanh nghiệp ký)</div>
      )}
      <p className="text-xs font-bold text-slate-700 underline mt-2 uppercase">{selectedB2BContract.buyer?.rep || 'Trần Văn Bảo'}</p>
    </div>

  </div>
</div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-3 border-t border-slate-100 font-sans">
              <button
                type="button"
                onClick={() => {
                  setSelectedB2BContract(null);
                  setSigningStep('idle');
                  setIsNegotiatingInline(false);
                  setIsRejectingInline(false);
                }}
                className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Đóng lại
              </button>

              {signingStep === 'idle' && !isRejectingInline && !isNegotiatingInline && (
                (selectedB2BContract.status === 'pending_super_admin' || selectedB2BContract.status === 'Chờ duyệt' || selectedB2BContract.status === 'Chờ ký duyệt' || selectedB2BContract.status === 'coop_signed_pending_super') ? (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setIsRejectingInline(true)}
                      className="px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle size={16} /> Từ chối
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNegotiatingInline(true)}
                      className="px-6 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock size={16} /> Thương thảo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveB2BContract(selectedB2BContract.id)}
                      className="px-8 py-3.5 bg-[#004d40] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 size={16} /> Phê duyệt & Ký số
                    </button>
                  </div>
                ) : (
                  (selectedB2BContract?.status === 'active' || selectedB2BContract?.status === 'completed' || selectedB2BContract?.status === 'Đã hoàn tất' || selectedB2BContract?.status === 'Đang thực hiện' || selectedB2BContract?.status === 'Hoàn tất' || selectedB2BContract?.status === 'signed' || selectedB2BContract?.status === 'Nông dân đã ký' || selectedB2BContract?.status === 'Đã ký') ? (
                    <button
                      type="button"
                      onClick={() => handlePrintB2BContract(selectedB2BContract)}
                      className="px-8 py-3.5 bg-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-mint hover:text-forest shadow-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileText size={16} /> Tải bản in PDF / Chữ ký số
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0 font-sans text-right">
                      <span className="text-xs text-rose-500 font-bold flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl">
                        <Lock size={14} /> Hồ sơ chưa sẵn sàng quy trình ký số hoặc đã bị từ chối
                      </span>
                    </div>
                  )
                )
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* View All Individual Contracts Modal */}
      {isViewAllIndividualContractsModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="border-b border-slate-100 pb-5 mb-6 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-forest">Hợp đồng Hợp tác xã</h3>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  Số lượng hợp đồng: {contracts.filter((c: any) => c.contractNo?.includes('HDLKTMHH')).length}
                </p>
              </div>
              <button 
                onClick={() => setIsViewAllIndividualContractsModalOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto space-y-4 max-h-[60vh] pr-2">
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên hoặc nông sản..." 
                value={individualContractsSearch}
                onChange={(e) => setIndividualContractsSearch(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-forest/10"
              />
              {contracts
                .filter((c: any) => (c.contractNo?.includes('HDLKTMHH')) && 
                  (c.party.toLowerCase().includes(individualContractsSearch.toLowerCase()) || 
                   c.cropName.toLowerCase().includes(individualContractsSearch.toLowerCase())))
                .map((item: any, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      setIsViewAllIndividualContractsModalOpen(false);
                      navigate(`/contract-customer/${item.id}`);
                    }}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-mint transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">{item.party}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.cropName}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      {item.status}
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* View All B2B Contracts Modal */}
      {isViewAllB2BContractsModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="border-b border-slate-100 pb-5 mb-6 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-forest">Hợp đồng Đối tác B2B</h3>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  Số lượng hợp đồng: {contracts.filter((c: any) => c.contractNo?.includes('HĐMB')).length}
                </p>
              </div>
              <button 
                onClick={() => setIsViewAllB2BContractsModalOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto space-y-4 max-h-[60vh] pr-2">
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên hoặc nông sản..." 
                value={b2bContractsSearch}
                onChange={(e) => setB2BContractsSearch(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-forest/10"
              />
              {contracts
                .filter((c: any) => c.contractNo?.includes('HĐMB') && 
                  (c.party.toLowerCase().includes(b2bContractsSearch.toLowerCase()) || 
                   c.cropName.toLowerCase().includes(b2bContractsSearch.toLowerCase())))
                .map((item: any, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      setIsViewAllB2BContractsModalOpen(false);
                      handleViewB2BContract(item);
                    }}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-mint transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">{item.party}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.cropName} • {item.qty}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      item.status === 'Đang thực hiện' || item.status === 'signed' ? 'bg-blue-50 text-blue-600' :
                      item.status === 'Chờ duyệt' || item.status === 'Chờ ký duyệt' ? 'bg-amber-50 text-amber-600' : 
                      item.status === 'Đang thương thảo' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      item.status === 'Đã từ chối' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      )}
      {/* Select Contract Type Modal */}
      {isCreateContractTypeModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-forest">Chọn loại hợp đồng</h3>
              <button 
                onClick={() => setIsCreateContractTypeModalOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => {
                  setIsCreateContractTypeModalOpen(false);
                  navigate('/contract-internal');
                }}
                className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-forest hover:bg-forest/5 transition-all text-left flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-forest shadow-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="font-black text-slate-800">Hợp đồng Hợp tác xã</div>
                  <div className="text-xs text-slate-500 font-medium">Ký kết liên kết thu mua với hợp tác xã thành viên</div>
                </div>
              </button>
              <button 
                onClick={() => {
                  setIsCreateContractTypeModalOpen(false);
                  navigate('/contract-b2b');
                }}
                className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-left flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <Handshake size={24} />
                </div>
                <div>
                  <div className="font-black text-slate-800">Hợp đồng Đối tác B2B</div>
                  <div className="text-xs text-slate-500 font-medium">Ký kết hợp tác với doanh nghiệp liên kết</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
