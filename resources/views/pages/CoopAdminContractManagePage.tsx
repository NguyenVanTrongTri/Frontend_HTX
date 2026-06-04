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

const COOPERATIVES = [
  { id: 'HTX-001', name: 'HTX Cà phê Cầu Đất' },
  { id: 'HTX-002', name: 'HTX Chè Ô Long Cầu Đất' },
  { id: 'HTX-003', name: 'HTX Rau Quả Sạch Đà Lạt' }
];

interface CoopAdminContractManagePageProps {
  cooperativeId?: string;
}

export default function CoopAdminContractManagePage({ cooperativeId = 'HTX-001' }: CoopAdminContractManagePageProps) {
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
          else if (v2.status === 'denied' || v2.status === 'rejected') simplifiedStatus = 'Đã từ chối';
          else if (v2.status === 'super_admin_approved' || v2.status === 'pending_super_admin') simplifiedStatus = 'Chờ duyệt';
          else if (v2.status === 'pending_coop_admin') simplifiedStatus = 'Chờ HTX ký duyệt';
          else if (v2.status === 'coop_signed_pending_super' || v2.status === 'awaiting_super_admin_signature') simplifiedStatus = 'HTX đã ký • Chờ duyệt Super Admin';

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

        // 2. Also check local storage for un-migrated contracts (v2/v3)
        const rawV2 = localStorage.getItem('vietagri_contracts_v2');
        if (rawV2) {
          try {
            const parsedV2 = JSON.parse(rawV2);
            if (Array.isArray(parsedV2)) {
              parsedV2.forEach((v2: any) => {
                if (!currentSimple.find(s => String(s.id) === String(v2.id))) {
                  // Add from legacy local storage if not already from API
                  let simplifiedStatus = 'Chờ duyệt';
                  if (v2.status === 'awaiting_signature') simplifiedStatus = 'Chờ ký duyệt';
                  else if (v2.status === 'awaiting_farmer_signature') simplifiedStatus = 'Chờ nông dân ký';
                  else if (v2.status === 'awaiting_admin_signature' || v2.status === 'Đang chờ ký (Admin)' || v2.status === 'in_progress' || v2.status === 'Đang thực hiện') simplifiedStatus = 'Đang thực hiện';
                  else if (v2.status === 'signed') simplifiedStatus = (v2.type === 'individual' ? 'Nông dân đã ký' : 'Chờ DN ký');
                  else if (v2.status === 'completed') simplifiedStatus = 'Đã hoàn tất';
                  else if (v2.status === 'active') simplifiedStatus = 'Đang thực hiện';
                  else if (v2.status === 'denied' || v2.status === 'rejected') simplifiedStatus = 'Đã từ chối';
                  else if (v2.status === 'super_admin_approved' || v2.status === 'pending_super_admin') simplifiedStatus = 'Chờ duyệt';
                  else if (v2.status === 'pending_coop_admin') simplifiedStatus = 'Chờ HTX ký duyệt';
                  else if (v2.status === 'coop_signed_pending_super' || v2.status === 'awaiting_super_admin_signature') simplifiedStatus = 'HTX đã ký • Chờ duyệt Super Admin';

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

        // 3. Filter out mock IDs if any
        const mockIds = ['HD-XV-2940', 'HD-XV-2941', 'HD-XV-2942', 'B2B-1029', 'B2B-1030', 'B2B-1031'];
        currentSimple = currentSimple.filter(s => !mockIds.includes(String(s.id)));

        setContracts(currentSimple);
        setFullContracts(apiContracts);
        localStorage.setItem('vietagri_contracts', JSON.stringify(currentSimple));

      } catch (e) {
        console.error("Failed to sync contracts via API:", e);
      }
    };

    fetchData();
  }, []);

  // Filter ONLY contracts belonging to THIS specific cooperative!
  const filteredContracts = contracts.filter((c: any) => c.cooperativeId === cooperativeId);
  const activeCooperative = COOPERATIVES.find(c => c.id === cooperativeId) || { id: 'HTX-001', name: 'HTX Cà phê Cầu Đất' };

  // Detailed views
  const [selectedB2BContract, setSelectedB2BContract] = useState<any | null>(null);

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
  const [signingStep, setSigningStep] = useState<'idle' | 'otp' | 'success'>('idle');
  const [otpCode, setOtpCode] = useState('');

  const handleViewB2BContract = (simpleContract: any) => {
    // Ket noi API
    let detailed = fullContracts.find((c: any) => String(c.id) === String(simpleContract.id));

    if (!detailed) {
      const rawV2 = localStorage.getItem('vietagri_contracts_v2');
      if (rawV2) {
        try {
          const parsed = JSON.parse(rawV2);
          detailed = parsed.find((c: any) => String(c.id) === String(simpleContract.id));
        } catch (e) {}
      }
    }
    
    if (!detailed) {
      detailed = {
        id: simpleContract.id,
        contractNo: simpleContract.contractNo || 'HĐ-XV-Chưa rõ',
        createdAt: new Date().toISOString(),
        status: simpleContract.status === 'Chờ duyệt' || simpleContract.status === 'pending_super_admin' ? 'pending_super_admin' : 'signed',
        type: simpleContract.type || 'b2b',
        totalVal: parseFloat(simpleContract.val || '0') * 1000000 || 120000000,
        cooperativeId: simpleContract.cooperativeId || cooperativeId,
        coopName: activeCooperative.name,
        party: simpleContract.party,
        cropName: simpleContract.cropName || 'Cà phê Arabica',
        totalVolume: simpleContract.qty || '5,000 kg',
        unitPrice: '120,000 VNĐ / kg',
        deliveryTime: simpleContract.date || '30/12/2026',
        
        seller: {
          name: activeCooperative.name,
          rep: 'Nguyễn Văn Hợp',
          position: 'Chủ tịch HĐQT',
          phone: '0988777666',
          address: 'Trụ sở chính HTX, Cầu Đất, Đà Lạt, Lâm Đồng',
          taxCode: '3901284560',
          bankAcc: '999988887777',
          bankName: 'Agribank Chi nhánh Lâm Đồng'
        },
        buyer: {
          name: simpleContract.party,
          rep: 'Trần Văn Bảo',
          position: 'Giám đốc thu mua',
          phone: '0912345678',
          address: '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
          taxCode: '0312345678',
          bankAcc: '123456789012',
          bankName: 'Vietcombank Chi nhánh Sài Gòn'
        }
      };
    }
    
    setSelectedB2BContract(detailed);
    setSigningStep('idle');
  };

  const startDigitalSigningProcess = (contractId: string) => {
    setSigningStep('otp');
    setOtpCode('');
  };

  const handleConfirmOtpSignature = async () => {
    // Ket noi API
    try {
      const newStatus = selectedB2BContract.status === 'pending_coop_admin' ? 'coop_signed_pending_super' : 'awaiting_super_admin_signature';
      const updatedData = { 
        ...selectedB2BContract, 
        status: newStatus,
        approverNotes: 'Hội đồng quản trị HTX đã nhất trí thông qua, ký số đại diện Bên A. Chờ kết quả phê duyệt pháp lý trung ương.'
      };

      // 1. Update via API
      await contractService.updateContract(selectedB2BContract.id, updatedData);

      // 2. Sync Local Storage (Legacy/Fallback support)
      const rawV2 = localStorage.getItem('vietagri_contracts_v2');
      if (rawV2) {
        try {
          let listV2 = JSON.parse(rawV2);
          if (Array.isArray(listV2)) {
            const updatedV2 = listV2.map((c: any) => {
              if (String(c.id) === String(selectedB2BContract.id)) {
                return updatedData;
              }
              return c;
            });
            localStorage.setItem('vietagri_contracts_v2', JSON.stringify(updatedV2));
          }
        } catch (e) {}
      }

      // 3. Update main state list
      const updatedContracts = contracts.map((c: any) => {
        if (String(c.id) === String(selectedB2BContract.id)) {
          const isFarmerContract = c.status === 'Chờ HTX ký duyệt' || c.status === 'pending_coop_admin';
          return { 
            ...c, 
            status: isFarmerContract ? 'HTX đã ký' : 'Đã ký (HTX) • Chờ duyệt' 
          };
        }
        return c;
      });
      setContracts(updatedContracts);
      localStorage.setItem('vietagri_contracts', JSON.stringify(updatedContracts));

      setSelectedB2BContract(updatedData);
      setSigningStep('success');
      setToastMessage('HTX đã thực hiện ký duyệt thành công! Trực hệ thống đã cập nhật trạng thái văn kiện.');
    } catch (error) {
      console.error("Failed to update signature via API:", error);
      alert("Lỗi khi ký duyệt hợp đồng! Vui lòng thử lại.");
    }
  };

  const handleLocalCoopApproveAction = (contractId: string) => {
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

  const docSoTienBangChu = (soTien: number): string => {
    if (soTien === 0) return 'Không đồng';
    const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const Tien = ["", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ"];
    
    let viTriDoDoc = 1;
    let lap = true;
    let soTemp = soTien;
    let chuoiDoc = "";
    
    while (soTemp > 0) {
      const baChuSo = soTemp % 1000;
      soTemp = Math.floor(soTemp / 1000);
      
      if (baChuSo > 0) {
        let hangTram = Math.floor(baChuSo / 100);
        let hangChuc = Math.floor((baChuSo % 100) / 10);
        let hangDonVi = baChuSo % 10;
        let chuoiBaSo = "";
        
        if (hangTram > 0 || chuoiDoc !== "") {
          chuoiBaSo += ChuSo[hangTram] + " trăm ";
        }
        
        if (hangChuc > 0) {
          if (hangChuc === 1) chuoiBaSo += "mười ";
          else chuoiBaSo += ChuSo[hangChuc] + " mươi ";
        } else if (hangTram > 0 && hangDonVi > 0) {
          chuoiBaSo += "lẻ ";
        }
        
        if (hangDonVi > 0) {
          if (hangDonVi === 1 && hangChuc > 1) chuoiBaSo += "mốt ";
          else if (hangDonVi === 5 && hangChuc > 0) chuoiBaSo += "lăm ";
          else chuoiBaSo += ChuSo[hangDonVi];
        }
        
        chuoiDoc = chuoiBaSo + Tien[viTriDoDoc - 1] + " " + chuoiDoc;
      }
      viTriDoDoc++;
    }
    
    chuoiDoc = chuoiDoc.trim();
    return chuoiDoc.charAt(0).toUpperCase() + chuoiDoc.slice(1) + " đồng chẵn";
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
          <title>Bản in Hợp đồng - ${currentContractNo}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display&display=swap');
            body { font-family: 'Times New Roman', Times, serif; padding: 50px; line-height: 1.6; color: #111; font-size: 14px; }
            .header-national { text-align: center; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; }
            .title-main { text-align: center; font-family: 'Times New Roman', Times, serif; font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 5px; text-transform: uppercase; }
            .contract-no { text-align: center; font-style: italic; margin-bottom: 30px; }
            .section-title { font-weight: bold; text-transform: uppercase; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #111; display: inline-block; }
            .party-info { margin-bottom: 15px; }
            .party-name { font-weight: bold; text-transform: uppercase; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 50px; text-align: center; page-break-inside: avoid; }
            .signature-box { width: 45%; }
            .secured-stamp { border: 2px solid #1e293b; border-radius: 8px; padding: 10px; margin: 15px auto; font-size: 10px; text-transform: uppercase; font-weight: bold; background: #f8fafc; font-family: monospace; display: block; max-width: 250px; }
          </style>
        </head>
        <body>
          <div class="header-national">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
            Độc lập - Tự do - Hạnh phúc<br>
            ---------------------------
          </div>
          
          <div class="title-main">
            ${c.type === 'internal' ? 'HỢP ĐỒNG LIÊN KẾT NỘI BỘ XÃ HỘI VIÊN' : 'HỢP ĐỒNG LIÊN KẾT THU MUA HÀNG HÓA'}
          </div>
          <div class="contract-no">Số văn kiện: ${currentContractNo}</div>

          <p><em>- Căn cứ Bộ luật Dân sự số 91/2015/QH13 ban hành ngày 24/11/2015;<br>
          - Căn cứ Luật Hợp tác xã số 17/2012/QH13 ban hành ngày 20/11/2012;<br>
          - Căn cứ nhu cầu và năng lực thực tế của hai bên ký kết liên doanh nông vụ.</em></p>

          <p>Hôm nay, ngày ${day} tháng ${month} năm ${year}, tại văn phòng Hội đồng quản trị Hợp tác xã chủ quản, hai bên nhất trí thiết lập hợp đồng nguyên tắc dưới đây:</p>

          <div class="section-title">BÊN BÁN (BÊN A)</div>
          <div class="party-info">
            <span class="party-name">${c.seller?.name || c.coopName || 'HỢP TÁC XÃ NÔNG NGHIỆP'}</span><br>
            • Địa chỉ trụ sở chính: ${c.seller?.address || 'Khu vực Đà Lạt, Lâm Đồng'}<br>
            • Mã số doanh nghiệp: ${c.seller?.taxCode || '3901284560'}<br>
            • Người đại diện pháp luật: <strong>${c.seller?.rep || 'Nguyễn Văn Hợp'}</strong> - Chức vụ: Chủ tịch HĐQT HTX<br>
            • Tài khoản ngân hàng số: ${c.seller?.bankAcc || '999988887777'} mở tại ${c.seller?.bankName || 'Agribank'}
          </div>

          <div class="section-title">BÊN MUA (BÊN B)</div>
          <div class="party-info">
            <span class="party-name">${c.buyer?.name || c.party || 'DOANH NGHIỆP LIÊN KẾT'}</span><br>
            • Địa chỉ trụ sở chính: ${c.buyer?.address || 'Khu vực liên doanh Việt Nam'}<br>
            • Mã số doanh nghiệp / CMND: ${c.buyer?.taxCode || c.buyer?.cccd || '0312345678'}<br>
            • Người đại diện pháp luật: <strong>${c.buyer?.rep || c.party}</strong> - Chức vụ: Giám đốc thu mua<br>
            • Tài khoản ngân hàng số: ${c.buyer?.bankAcc || '123456789012'} mở tại ${c.buyer?.bankName || 'Vietcombank'}
          </div>

          <div class="section-title">ĐIỀU 1: TÊN HÀNG HÓA, SỐ LƯỢNG, CHẤT LƯỢNG, GIÁ TRỊ HỢP ĐỒNG</div>
          <p>Bên A độc quyền bảo dưỡng và tiến bốc dỡ các khối lượng nông vụ đạt tiêu chuẩn, bên B đồng ý thực hiện bao tiêu thu gom toàn bộ mặt hàng nông sản theo thông số sau:</p>
          <ul>
            <li><strong>Tên hàng nông sản:</strong> ${c.cropName || 'Cà phê Arabica Cầu Đất'} đạt chỉ số VietGAP.</li>
            <li><strong>Chỉ số sản lượng cam kết:</strong> ${c.totalVolume || 'Không giới hạn'} sản phẩm hữu cơ sạch.</li>
            <li><strong>Đơn giá bảo hiểm tối thiểu:</strong> ${c.unitPrice || 'Thỏa thuận kiểm tra theo tuần'} tại nông trường.</li>
            <li><strong>Tổng giá trị dự phóng:</strong> ${c.totalVal ? c.totalVal.toLocaleString('vi-VN') : 'Dựa trên thực trạng khai thác thực tế'} VNĐ.</li>
            <li><strong>Bằng chữ:</strong> <em>${moneyWords}</em></li>
          </ul>

          <div class="section-title">ĐIỀU 2: TIÊU CHUẨN GIAO NHẬN VÀ QUYẾT TOÁN</div>
          <p>1. Tất cả hàng nông sản phải được kiểm định chất lượng nghiêm ngặt dựa theo quy tắc VietGAP / Organic nội bộ trước khi thực hiện bốc dỡ.<br>
          2. Lịch trình bốc dỡ và chuyển giao chính thức dự kiến: ${c.deliveryTime || 'Trong chu kỳ năm tài chính'}.<br>
          3. Hình thức thanh toán: Chuyển khoản qua tài khoản ngân hằng chỉ định của hai bên.</p>

          <div class="signature-section">
            <div class="signature-box">
              <strong>ĐẠI DIỆN BÊN A</strong><br>
              <em>(Ký, đóng dấu hoặc xác lập chữ ký số)</em>
              ${includeStamp ? `
              <div class="secured-stamp">
                ★ CHỨNG THỰC HTX ★<br>
                ${(c.seller?.name || c.coopName || 'HTX').toUpperCase()}<br>
                KHÓA CHỮ KÝ: SHA256-HTX-SECURED
              </div>
              ` : `
              <div style="min-height: 80px;"></div>
              `}
              ${includeStamp ? `
              <p style="margin-top: 10px; font-weight: bold;">${c.seller?.rep || 'Nguyễn Văn Hợp'}</p>
              ` : ''}
            </div>
            <div class="signature-box">
              <strong>ĐẠI DIỆN BÊN B</strong><br>
              <em>(Ký, ghi rõ họ tên hoặc xác lập chữ ký số)</em>
              ${includeStamp ? `
              <div class="secured-stamp" style="border-style: dashed;">
                ★ ĐÃ KHỞI TẠO CHỮ KÝ SỐ ★<br>
                ${(c.buyer?.name || c.party).toUpperCase()}<br>
                ID CHỮ KÝ: SHA256-B-PARTNER
              </div>
              ` : `
              <div style="min-height: 80px;"></div>
              `}
              ${includeStamp ? `
              <p style="margin-top: 10px; font-weight: bold;">${c.buyer?.rep || c.party}</p>
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
    <div id="coop-admin-contract-manage-container" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 bg-white rounded-[2.5rem] shadow-xl">
      <div className="flex flex-col sm:flex-row items-sm-center justify-between gap-4">
        <div>
          <span className="bg-emerald-900/10 text-emerald-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            {activeCooperative.name} • Portal
          </span>
          <h2 id="coop-admin-main-title" className="text-3xl font-black text-forest tracking-tight mt-2">Quản lý Hợp đồng Liên kết</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Hệ thống ký số trực tuyến, soạn thảo văn kiện nội bộ và xét duyệt liên kết đối tác doanh nghiệp của Hợp tác xã</p>
        </div>
        <div className="flex gap-3">
          <button 
            id="coop-btn-create-contract"
            onClick={() => setIsCreateContractTypeModalOpen(true)} 
            className="px-6 py-3 bg-forest text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-mint hover:text-forest transition-all shadow-xl shadow-forest/20 flex items-center gap-2"
          >
            <FileSignature size={16} /> Tạo hợp đồng / Văn kiện mới
          </button>
        </div>
      </div>

      {/* Stats Grid - Localized to this Cooperative only */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div id="coop-stat-active" className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đang hiệu lực (HTX)</h4>
            <span className="text-2xl font-black text-slate-800">
              {24 + filteredContracts.filter((c: any) => c.status === 'Đang thực hiện' || c.status === 'Đã ký' || c.status === 'signed' || c.status === 'Hợp tác xã đã ký').length}
            </span>
          </div>
        </div>
        <div id="coop-stat-pending" className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cần HTX xử lý Ký duyệt</h4>
            <span className="text-2xl font-black text-slate-800">
              {filteredContracts.filter((c: any) => 
                c.status === 'Chờ duyệt' || 
                c.status === 'pending_super_admin' || 
                c.status === 'pending_coop_admin' || 
                c.status === 'Chờ ký duyệt' || 
                c.status === 'Chờ HTX ký duyệt' ||
                c.status === 'Chờ duyệt (Super Admin)'
              ).length}
            </span>
          </div>
        </div>
        <div id="coop-stat-b2b" className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Handshake size={24} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đối tác & DN xuất nhập</h4>
            <span className="text-2xl font-black text-slate-800">
              {3 + filteredContracts.filter((c: any) => c.type === 'b2b').length}
            </span>
          </div>
        </div>
      </div>

      {/* Cooperative Actions / Signings section */}
      <div id="coop-pending-actions-section" className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-150 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-forest flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-600" />
              Yêu cầu Cần Xét Duyệt & Ký số của HTX
            </h3>
            <p className="text-xs text-slate-500 font-medium">Danh sách các hợp đồng thu mua, thỏa thuận liên kết đối tác hoặc giao khoán hộ xã viên đang chờ Ban Quản trị xác nhận</p>
          </div>
          {filteredContracts.filter((c: any) => c.status === 'Chờ duyệt' || c.status === 'pending_super_admin' || c.status === 'pending_coop_admin' || c.status === 'Chờ ký duyệt' || c.status === 'Chờ HTX ký duyệt').length > 0 && (
            <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1.5 rounded-full font-black animate-pulse">
              {filteredContracts.filter((c: any) => c.status === 'Chờ duyệt' || c.status === 'pending_super_admin' || c.status === 'pending_coop_admin' || c.status === 'Chờ ký duyệt' || c.status === 'Chờ HTX ký duyệt').length} Hồ sơ chờ xử lý
            </span>
          )}
        </div>

        {filteredContracts.filter((c: any) => 
          c.status === 'Chờ duyệt' || 
          c.status === 'pending_super_admin' || 
          c.status === 'pending_coop_admin' || 
          c.status === 'Chờ ký duyệt' || 
          c.status === 'signed' ||
          c.status === 'Chờ HTX ký duyệt' || 
          c.status === 'HTX đã ký • Chờ duyệt' ||
          c.status === 'draft'
        ).length === 0 ? (
          <div className="flex items-center gap-4 bg-emerald-50/50 border border-emerald-100/40 p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Mọi hồ sơ và dữ liệu liên kết địa bàn đã được xử lý xong</h4>
              <p className="text-xs text-slate-400 font-medium">Hiện tại không có yêu cầu ký số hay thương lượng B2B dở dang của thành viên hợp tác xã.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContracts.filter((c: any) => c.status === 'Chờ duyệt' || c.status === 'pending_super_admin' || c.status === 'pending_coop_admin' || c.status === 'Chờ ký duyệt' || c.status === 'Chờ HTX ký duyệt').map((item: any, i: number) => (
              <div 
                key={i}
                className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-500/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-black text-emerald-800 tracking-wider uppercase bg-emerald-50 border border-emerald-100/40 px-3 py-1 rounded-full">
                      Mã số: {item.id}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-wider">
                      <Clock size={12} /> {item.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-emerald-800 transition-colors">
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
                    Xem văn bản
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLocalCoopApproveAction(item.id)}
                    className="py-3 bg-forest hover:bg-mint hover:text-forest text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center"
                  >
                    Ký duyệt số
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Lists Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Hợp đồng Thu mua (Xã viên) */}
        <div id="coop-individual-contracts" className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-forest">Giao kèo Xã viên</h3>
                <p className="text-xs text-slate-500 font-medium">Bao tiêu hộ thành viên nội bộ</p>
              </div>
            </div>
            <button 
              onClick={() => setIsViewAllIndividualContractsModalOpen(true)}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-black flex items-center gap-1 uppercase tracking-wider"
            >
              Xem tất cả <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4 relative z-10">
            {filteredContracts.filter((c: any) => !c.contractNo?.includes('HĐMB') && !c.contractNo?.includes('HĐNB')).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <FileText className="text-slate-300" size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400">Chưa có giao kèo nào</p>
              </div>
            ) : (
              filteredContracts.filter((c: any) => !c.contractNo?.includes('HĐMB') && !c.contractNo?.includes('HĐNB')).slice(0, 4).map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/contract-customer/${item.id}`)}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl group hover:border-mint transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-800">{item.party}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.qty || 'Hàng tiêu chuẩn'} • {item.cropName || 'Nông sản'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700">
                      {item.status}
                    </span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-mint transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hợp đồng B2B xuất khẩu */}
        <div id="coop-b2b-contracts" className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-700">
                <Handshake size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Đại diện B2B</h3>
                <p className="text-xs text-slate-500 font-medium">Bao tiêu xuất khẩu sản lượng lớn</p>
              </div>
            </div>
            <button 
              onClick={() => setIsViewAllB2BContractsModalOpen(true)}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-black flex items-center gap-1 uppercase tracking-wider"
            >
              Xem tất cả <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4 relative z-10">
            {filteredContracts.filter((c: any) => c.contractNo?.includes('HĐMB')).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <Handshake className="text-slate-300" size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400">Chưa có hợp đồng nào</p>
              </div>
            ) : (
              filteredContracts.filter((c: any) => c.contractNo?.includes('HĐMB')).slice(0, 4).map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => handleViewB2BContract(item)}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl group hover:border-mint transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-800">{item.party}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.amount || '0.1 Triệu'} • {item.cropName || 'Nông sản'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-700">
                      {item.status}
                    </span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-mint transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hợp đồng Nội bộ của HTX */}
        <div id="coop-internal-contracts" className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-800">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-forest">Hợp đồng Nội bộ</h3>
                <p className="text-xs text-slate-500 font-medium">Sản xuất nội hạt &amp; Giao khoán</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg">
              Lưu bản điện tử
            </span>
          </div>
          <div className="space-y-4 relative z-10">
            {filteredContracts.filter((c: any) => c.contractNo?.includes('HĐNB')).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <FileSignature className="text-slate-300" size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400">Chưa có giao nhận nội vụ nào</p>
              </div>
            ) : (
              filteredContracts.filter((c: any) => c.contractNo?.includes('HĐNB')).slice(0, 4).map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => handleViewB2BContract(item)}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl group hover:border-mint transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-800">{item.party}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.totalVolume || 'Đã chứng thực'} • {item.cropName || 'Nông sản'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700">
                      Chứng thực kép
                    </span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-mint transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modern Toast Notification */}
      {toastMessage && (
        <div id="coop-toast-notification" className="fixed bottom-10 right-10 z-[300] bg-slate-900 border border-slate-800 text-white font-bold p-5 rounded-2xl shadow-2xl flex items-center gap-3.5 animate-bounce">
          <CheckCircle2 className="text-emerald-500" size={22} />
          <span className="text-xs uppercase tracking-wider leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* View Detailed modal & signature flow */}
      {selectedB2BContract && (
        <div id="coop-contract-view-modal" className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl bg-white rounded-[2.5rem] p-6 md:p-8 relative z-10 shadow-2xl flex flex-col my-8"
          >
            <div className="border-b border-slate-100 pb-5 mb-5 flex items-center justify-between font-sans shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Chi tiết Hợp đồng Điện tử</h3>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">Mã tài liệu số: <span className="font-mono text-slate-600 font-black">{cleanContractNo(selectedB2BContract.contractNo, selectedB2BContract.id)}</span></p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedB2BContract(null);
                  setSigningStep('idle');
                }}
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh] pr-1 pb-6 space-y-6">
              {signingStep === 'otp' ? (
                <div className="text-center py-10 max-w-md mx-auto space-y-6 font-sans">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-800 mx-auto shadow-inner">
                    <Lock size={32} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Ký số Bảo mật CA (HTX)</h2>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed mt-1">Xin vui lòng điền mã số xác thực OTP gửi qua hệ thống nông nghiệp số để thực thi ký duyệt đại diện Ban Quản trị Hợp tác xã.</p>
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      maxLength={6}
                      placeholder="Mã OTP 6 số (Thử '123456')" 
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-4 text-center text-xl tracking-widest font-mono font-black border border-slate-200 bg-slate-50 rounded-2xl focus:border-emerald-800 focus:bg-white outline-none transition-all"
                    />
                    <div className="flex gap-3 pt-3">
                      <button 
                        type="button"
                        onClick={() => setSigningStep('idle')}
                        className="w-1/2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                      >
                        Quay lại
                      </button>
                      <button 
                        type="button"
                        onClick={handleConfirmOtpSignature}
                        disabled={otpCode.length < 4}
                        className={`w-1/2 py-3.5 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all ${otpCode.length >= 4 ? 'bg-forest hover:bg-mint hover:text-forest' : 'bg-slate-300 cursor-not-allowed'}`}
                      >
                        Xác nhận Ký duyệt
                      </button>
                    </div>
                  </div>
                </div>
              ) : signingStep === 'success' ? (
                <div className="text-center py-10 max-w-md mx-auto space-y-6 font-sans">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-black text-emerald-950 uppercase tracking-tight">Ký số Hợp đồng Thành công</h2>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">Ban điều hành hợp tác xã đã thiết lập hoàn tất chữ ký số đại lý phía Bên A. Hệ thống đã tự động chuyển giao tài liệu thẩm duyệt về máy chủ Super Admin để hoàn thành bảo án.</p>
                  </div>
                  <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-[11px] text-slate-500 text-left space-y-2">
                    <p>• <strong>Bên A (HTX):</strong> Đã xác thực bảo an CA bởi Nguyễn Văn Hợp</p>
                    <p>• <strong>Trạng thái chữ ký:</strong> Đang chờ ban thẩm xét Quốc gia VietAgri đóng dấu</p>
                    <p>• <strong>Mã đóng dấu:</strong> SHA256-PENDING-SUPERADMIN</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedB2BContract(null);
                      setSigningStep('idle');
                    }}
                    className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black"
                  >
                    Hoàn thành đóng lại
                  </button>
                </div>
              ) : (
                <div className="space-y-6 font-serif leading-relaxed text-xs">
                  {/* National Brand Header */}
                  <div className="text-center border-b border-dashed border-slate-200 pb-5 font-bold text-slate-900">
                    <p className="uppercase text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="text-[11px]">Độc lập - Tự do - Hạnh phúc</p>
                    <p className="tracking-widest">---***---</p>
                    <h4 className="uppercase text-slate-800 text-sm mt-5 tracking-tight font-black">
                      {selectedB2BContract.type === 'internal' ? 'VĂN BẢN GIAO KHOÁN / LIÊN KẾT NỘI BỘ' : 'HỢP ĐỒNG LIÊN KẾT THU MUA HÀNG HÓA'}
                    </h4>
                  </div>

                  <p className="italic text-slate-650">
                    - Căn cứ Bộ luật Dân sự nước Cộng hòa xã hội chủ nghĩa Việt Nam ban hành năm 2015;<br />
                    - Căn cứ Luật Hợp tác xã số 17/2012/QH13 ban hành ngày 20/11/2012;<br />
                    - Căn cứ chức năng, điều lệ hoạt động của các bên tham gia.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 pt-4">
                    {/* Seller Section */}
                    <div className="border border-slate-200 rounded-2xl bg-white p-5 space-y-3">
                      <div className="font-bold text-[#004d40] uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                        BÊN BÁN (Bên A - Hợp tác xã)
                      </div>
                      <div className="grid grid-cols-1 gap-y-1.5 text-slate-700">
                        <div><strong>Tên doanh nghiệp:</strong> {selectedB2BContract.seller?.name || selectedB2BContract.coopName}</div>
                        <div><strong>Mã số doanh nghiệp:</strong> {selectedB2BContract.seller?.taxCode || '3901284560'}</div>
                        <div><strong>Địa chỉ trụ sở:</strong> {selectedB2BContract.seller?.address || 'Khu vực Đà Lạt, Lâm Đồng'}</div>
                        <div><strong>Đại diện pháp luật:</strong> <span className="underline font-bold text-slate-800">{selectedB2BContract.seller?.rep}</span></div>
                        <div><strong>Chức vụ:</strong> {selectedB2BContract.seller?.position || 'Chủ tịch HĐQT'}</div>
                        <div><strong>Tài khoản ngân hàng:</strong> {selectedB2BContract.seller?.bankAcc} - {selectedB2BContract.seller?.bankName}</div>
                      </div>
                    </div>

                    {/* Buyer Section */}
                    {selectedB2BContract.type === 'internal' ? (
                      <div className="border border-slate-200 rounded-2xl bg-white p-5 space-y-3">
                        <div className="font-bold text-emerald-800 uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                          XÃ VIÊN LIÊN KẾT (Bên B)
                        </div>
                        <div className="grid grid-cols-1 gap-y-1.5 text-slate-700">
                          <div><strong>Họ và tên xã viên:</strong> {selectedB2BContract.buyer?.name || selectedB2BContract.party}</div>
                          <div><strong>Số CCCD:</strong> {selectedB2BContract.buyer?.cccd || '068092004512'}</div>
                          <div><strong>Nơi cấp:</strong> {selectedB2BContract.buyer?.cccdPlace || 'CA Tỉnh Lâm Đồng'}</div>
                          <div><strong>Số điện thoại liên hệ:</strong> {selectedB2BContract.buyer?.phone || '0982345671'}</div>
                          <div><strong>Thường trú:</strong> {selectedB2BContract.buyer?.address}</div>
                          <div><strong>Mã vùng canh tác liên kết:</strong> <span className="text-emerald-800 font-black">{selectedB2BContract.buyer?.growingAreaCode || 'VT-LĐ-0941'}</span></div>
                          <div><strong>Diện tích:</strong> <span className="text-slate-800 font-bold">{selectedB2BContract.buyer?.landArea || '1.5 ha'}</span></div>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-2xl bg-white p-5 space-y-3">
                        <div className="font-bold text-indigo-700 uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          BÊN MUA (Bên B)
                        </div>
                        <div className="grid grid-cols-1 gap-y-1.5 text-slate-700">
                          <div><strong>Tên doanh nghiệp:</strong> {selectedB2BContract.buyer?.name || selectedB2BContract.enterpriseName}</div>
                          <div><strong>Mã số doanh nghiệp:</strong> {selectedB2BContract.buyer?.taxCode || '0312345678'}</div>
                          <div><strong>Địa chỉ trụ sở chính:</strong> {selectedB2BContract.buyer?.address || '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'}</div>
                          <div><strong>Đại diện pháp lý:</strong> <span className="underline font-bold text-slate-800">{selectedB2BContract.buyer?.rep || 'Trần Văn Bảo'}</span></div>
                          <div><strong>Chức danh:</strong> {selectedB2BContract.buyer?.position || 'Giám đốc thu mua'}</div>
                          <div><strong>Số điện thoại:</strong> {selectedB2BContract.buyer?.phone || '0912345678'}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 font-serif text-[13.5px]">
                    <p className="font-black text-slate-800 uppercase text-[11px] tracking-wider">ĐIỀU 1: TÊN HÀNG HÓA, SỐ LƯỢNG, CHẤT LƯỢNG, GIÁ TRỊ HỢP ĐỒNG</p>
                    <p>Bên A độc quyền bảo dưỡng và tiến bốc dỡ các khối lượng nông vụ đạt tiêu chuẩn, Bên B chịu trách nhiệm bao tiêu hoặc ủy quyền kinh tế cho bên bán.</p>
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2 mt-2 leading-relaxed text-xs border border-slate-150">
                      <p>• <strong>Giống loại nông sản chuẩn hóa:</strong> {selectedB2BContract.cropName}</p>
                      <p>• <strong>Sản lượng tối thiểu cam kết bốc xếp:</strong> {selectedB2BContract.totalVolume}</p>
                      <p>• <strong>Dự phóng đơn giá:</strong> {selectedB2BContract.unitPrice || '120.000 VNĐ / kg'}</p>
                      <p>• <strong>Thời hạn bốc dỡ bàn giao:</strong> Trước ngày {selectedB2BContract.deliveryTime || 'hạn cuối năm'}</p>
                      <p className="mt-2 text-[#004d40] font-bold">★ TỔNG GIÁ TRỊ CAM KẾTƯỚC LƯỢNG: {selectedB2BContract.totalVal ? selectedB2BContract.totalVal.toLocaleString('vi-VN') : 'Dựa trên vụ mùa'} VNĐ</p>
                      <p className="italic text-slate-500">• <strong>Bằng chữ:</strong> {selectedB2BContract.totalVal ? docSoTienBangChu(selectedB2BContract.totalVal) : 'Dựa trên thực trạng vụ vụ'}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-slate-200 font-sans">
                    <div className="text-center w-1/2 flex flex-col items-center">
                      <p className="text-[10px] uppercase font-black text-slate-400">Đại diện Bên bán (Bên A)</p>
                      {selectedB2BContract.status === 'pending_super_admin' ? (
                        <div className="text-xs italic text-slate-400 py-6 font-bold">Chưa ký số (Chờ HTX ký duyệt B2B)</div>
                      ) : (
                        <div className="my-2 border border-rose-500 rounded-xl bg-rose-50 p-2 text-[10px] text-rose-600 font-bold max-w-xs relative flex flex-col gap-0.5">
                          <span className="uppercase text-rose-700 font-black">HTX-SIGNED-CA</span>
                          <span className="font-mono">{activeCooperative.name}</span>
                        </div>
                      )}
                      <p className="text-xs font-bold text-slate-700 underline">{selectedB2BContract.seller?.rep || 'Nguyễn Văn Hợp'}</p>
                    </div>

                    <div className="text-center w-1/2 flex flex-col items-center">
                      <p className="text-[10px] uppercase font-black text-slate-400">Đại diện Bên mua (Bên B)</p>
                      {selectedB2BContract.status === 'signed' ? (
                        <div className="my-2 border border-emerald-500 rounded-xl bg-emerald-50 p-2 text-[10px] text-emerald-600 font-bold max-w-xs relative flex flex-col gap-0.5">
                          <span className="uppercase text-emerald-700 font-black">DOANH NGHIEP SIGNED</span>
                        </div>
                      ) : (
                        <div className="text-xs italic text-slate-400 py-6 font-bold">Chưa ký số (Chờ đối tác liên quan)</div>
                      )}
                      <p className="text-xs font-bold text-slate-700 underline">{selectedB2BContract.buyer?.rep || 'Trần Văn Bảo'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-3 border-t border-slate-100 font-sans shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedB2BContract(null);
                    setSigningStep('idle');
                  }}
                  className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-250 transition-colors"
                >
                  Đóng lại
                </button>

                {signingStep === 'idle' && (
                  selectedB2BContract.status === 'pending_super_admin' ? (
                    <button
                      type="button"
                      onClick={() => handleConfirmOtpSignature()}
                      className="px-8 py-3.5 bg-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-mint hover:text-forest shadow-lg flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle2 size={16} /> Duyệt & Xác nhận ký số đại diện
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePrintB2BContract(selectedB2BContract)}
                      className="px-8 py-3.5 bg-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-mint hover:text-forest shadow-lg flex items-center gap-2 transition-colors"
                    >
                      <Printer size={16} /> Tải bản in PDF / Chữ ký số
                    </button>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* View All Individual Contracts Modal */}
      {isViewAllIndividualContractsModalOpen && (
        <div id="coop-individual-all-modal" className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="border-b border-slate-100 pb-5 mb-6 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-forest">Sản lượng Giao kèo Xã viên ({activeCooperative.name})</h3>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  Số lượng hợp đồng: {filteredContracts.filter((c: any) => !c.contractNo?.includes('HĐMB') && !c.contractNo?.includes('HĐNB')).length}
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
                placeholder="Tìm kiếm theo họ tên xã viên hoặc sản phẩm cây trồng..." 
                value={individualContractsSearch}
                onChange={(e) => setIndividualContractsSearch(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-forest/10"
              />
              {filteredContracts
                .filter((c: any) => !c.contractNo?.includes('HĐMB') && !c.contractNo?.includes('HĐNB') && 
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
        <div id="coop-b2b-all-modal" className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="border-b border-slate-100 pb-5 mb-6 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-forest">Hợp đồng Đối tác Doanh nghiệp</h3>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  Số lượng hợp đồng: {filteredContracts.filter((c: any) => c.contractNo?.includes('HĐMB')).length}
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
                placeholder="Tìm kiếm theo đối tác thu mua hoặc loại quả..." 
                value={b2bContractsSearch}
                onChange={(e) => setB2BContractsSearch(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-forest/10"
              />
              {filteredContracts
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
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
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
        <div id="coop-create-contract-type-modal" className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-forest">Chọn loại hợp đồng cần lập</h3>
              <button 
                onClick={() => setIsCreateContractTypeModalOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button 
                type="button"
                onClick={() => {
                  setIsCreateContractTypeModalOpen(false);
                  navigate('/contract-internal');
                }}
                className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-forest hover:bg-forest/5 transition-all text-left flex items-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-forest shadow-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="font-black text-slate-800 text-sm">Hợp đồng Nội bộ HTX</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Giao khoán đất đai, vật tư trả chậm &amp; liên kết xã viên</div>
                </div>
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsCreateContractTypeModalOpen(false);
                  navigate('/contract-b2b');
                }}
                className="p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-left flex items-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <Handshake size={24} />
                </div>
                <div>
                  <div className="font-black text-slate-800 text-sm">Hợp đồng Đối tác Doanh nghiệp B2B</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Xuất xưởng hoặc bao tiêu vĩ mô với tập đoàn phân phối</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
