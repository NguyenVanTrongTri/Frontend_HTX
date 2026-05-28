import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  QrCode, 
  Truck, 
  Star, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight,
  Package,
  MapPin,
  ShieldCheck,
  Zap,
  ArrowRight,
  Heart,
  Filter,
  Plus,
  Clock,
  Building2,
  X,
  Lock,
  Calendar,
  Layers,
  Leaf,
  History,
  Info,
  ExternalLink,
  ClipboardCheck,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Printer,
  Eye,
  FileText,
  AlertCircle,
  Briefcase,
  Repeat
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'orders' | 'traceability' | 'contracts' | 'feedback'>('marketplace');
  const [showAllContracts, setShowAllContracts] = useState(false);
  const [contractSearchQuery, setContractSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [userData, setUserData] = useState<any>(() => {
    const saved = localStorage.getItem('current_user');
    if (saved) return JSON.parse(saved);
    return null;
  });

  
  // Contract-related state variables
  const [contractsList, setContractsList] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('vietagri_contracts_v2');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        console.log("Contracts loaded from storage:", parsed);
        setContractsList(parsed);
      } catch (e) {
        console.error("Error parsing contracts:", e);
      }
    }
  }, []);


  const [selectedContractForModal, setSelectedContractForModal] = useState<any | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedContractForPayment, setSelectedContractForPayment] = useState<any | null>(null);
  const [selectedPhaseToPay, setSelectedPhaseToPay] = useState<'phase1' | 'phase2'>('phase1');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Digital signing states for Enterprise/Buyer
  const [signingStep, setSigningStep] = useState<'idle' | 'pincode' | 'signing' | 'success'>('idle');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [signProgress, setSignProgress] = useState(0);
  const [signStatusMessage, setSignStatusMessage] = useState('');

  const startDigitalSigningProcess = () => {
    setPinInput('');
    setPinError('');
    setSignProgress(0);
    setSignStatusMessage('');
    setSigningStep('pincode');
  };

  const handleCloseContractModal = () => {
    setSelectedContractForModal(null);
    setSigningStep('idle');
    setPinInput('');
    setPinError('');
    setSignProgress(0);
    setSignStatusMessage('');
  };

  const handleVerifyPinAndSign = () => {
    if (pinInput !== '123456') {
      setPinError('Mã PIN chữ ký số không chính xác. Mặc định là 123456.');
      return;
    }

    setPinError('');
    setSigningStep('signing');
    setSignProgress(10);
    setSignStatusMessage('Đang kết nối thiết bị Token bảo mật hoặc chữ ký số Cloud...');

    const statuses = [
      { prg: 25, msg: 'Đang giải mã Khóa riêng doanh nghiệp RSA 2048-bit bảo mật...' },
      { prg: 50, msg: 'Đang băm nội dung tài liệu Hợp đồng số SHA-256...' },
      { prg: 75, msg: 'Đang đóng con dấu điện tử pháp lý doanh nghiệp & nhúng Chứng thư số...' },
      { prg: 90, msg: 'Đang ghi chữ ký số và xác thực mốc thời gian (Timestamp)...' },
      { prg: 100, msg: 'Ký số hoàn tất! Hợp đồng chính thức có hiệu lực.' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < statuses.length) {
        setSignProgress(statuses[currentIdx].prg);
        setSignStatusMessage(statuses[currentIdx].msg);
        currentIdx++;
      } else {
        clearInterval(interval);
        if (selectedContractForModal) {
          completeSigningCustomer(selectedContractForModal.id);
        }
      }
    }, 600);
  };

  const docSoTienBangChu = (soTien: number): string => {
    if (soTien === 0) return 'Không đồng';
    
    // Quick translation mapping for the expected mock contract values:
    if (soTien === 650000000) return 'Sáu trăm năm mươi triệu đồng chẵn';
    if (soTien === 220000000) return 'Hai trăm hai mươi triệu đồng chẵn';
    if (soTien === 350000000) return 'Ba trăm năm mươi triệu đồng chẵn';
    if (soTien === 850000000) return 'Tám trăm năm mươi triệu đồng chẵn';
    if (soTien === 180000000) return 'Một trăm tám mươi triệu đồng chẵn';
    if (soTien === 120000000) return 'Một trăm hai mươi triệu đồng chẵn';
    if (soTien === 250000000) return 'Hai trăm năm mươi triệu đồng chẵn';

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

  
  const handlePrintContract = (c: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Không thể mở cửa sổ in. Vui lòng cho phép popup để tải bản in PDF.');
      return;
    }
    
    const moneyWords = docSoTienBangChu(c.totalVal || 0);
    const createdDate = new Date(c.createdAt || new Date());
    const day = createdDate.getDate();
    const month = createdDate.getMonth() + 1;
    const year = createdDate.getFullYear();

    const currentContractNo = c.contractNo?.includes('/2026/HĐMB') ? c.contractNo : `${c.contractNo || '01'}/2026/HĐMB`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Hop_Dong_Mua_Ban_${c.id || currentContractNo}</title>
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
            
            /* Visual Stamp Styles */
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
            
            <div class="contract-title">HỢP ĐỒNG MUA BÁN HÀNG HÓA</div>
            <div class="contract-no">Số: ${currentContractNo}</div>
          </div>
          
          <div class="legal-basis">
            <p>– Căn cứ Bộ luật Dân sự 2015;</p>
            <p>– Căn cứ Luật Thương mại 2005;</p>
            <p>– Căn cứ nhu cầu và khả năng thực tế của các bên.</p>
          </div>
          
          <p style="text-indent: 25px; margin-bottom: 15px; font-size: 14px;">
            Hôm nay, ngày ${day} tháng ${month} năm ${year}, tại địa chỉ: Văn phòng Ban quản trị Hợp tác xã, chúng tôi gồm có:
          </p>
          
          <div>
            <div class="party-header">BÊN BÁN (Bên A)</div>
            <div class="party-details">
              <table>
                <tr>
                  <td style="width: 20%; font-weight: bold;">Tên doanh nghiệp:</td>
                  <td class="dotted-fill" style="width: 80%;">${c.seller?.name || c.coopName || 'HTX Cà phê Cầu Đất'}</td>
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
                  <td class="dotted-fill" style="width: 35%;">${c.seller?.rep || c.sellerRep || 'Nguyễn Văn Hợp'}</td>
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
                  <td class="dotted-fill" style="width: 80%;">${c.buyer?.name || c.enterpriseName || 'Công ty Cổ phần VietAgri'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Mã số doanh nghiệp:</td>
                  <td class="dotted-fill">${c.buyer?.taxCode || c.taxCode || '0312345678'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Địa chỉ trụ sở chính:</td>
                  <td class="dotted-fill">${c.buyer?.address || '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'}</td>
                </tr>
              </table>
              
              <table style="margin-top: 5px;">
                <tr>
                  <td style="width: 25%; font-weight: bold;">Người đại diện pháp luật:</td>
                  <td class="dotted-fill" style="width: 35%;">${c.buyer?.rep || c.buyerRep || 'Trần Văn Bảo'}</td>
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
                <td style="text-align: right;">${c.unitPrice?.split(' ')[0] || '130.000'}</td>
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
            <p>3. Phân kỳ tài chính: Đặt cọc <strong>${c.paymentPhase1 || '30%'}</strong> trong vòng 03 ngày làm việc sau khi ký số; thanh toán nốt <strong>${c.paymentPhase2 || '70%'}</strong> sau khi bốc dỡ bàn giao.</p>
          </div>
          
          <div class="section-title">Điều 3. Thời gian, địa điểm, phương thức giao hàng</div>
          <div style="padding-left: 15px;">
            <p>1. Bên A giao hàng cho bên B theo lịch giao nông sản định kỳ: <strong>${c.deliveryTime || 'Thu hoạch và giao nhận trong 15 ngày'}</strong>.</p>
            <p>2. Địa điểm giao nhận hàng hóa: <span class="underline">${c.deliveryLocation || 'Kho bãi vật lý bên Bán (Lâm Đồng)'}</span>.</p>
            <p>3. Phương tiện vận chuyển và chi phí vận chuyển do bên <span style="font-weight: bold; text-decoration: underline;">Bên B (Bên Mua)</span> chịu. Chi phí bốc xếp hai bên phối hợp bàn giao tại đầu kho.</p>
            <p>4. Quy định lịch giao nhận hàng hóa mà bên mua không đến nhận hàng thì phải chịu chi phí lưu kho bãi là 1.000.000 đồng/ngày. Nếu phương tiện vận chuyển bên mua đến mà bên bán không có hàng giao thì bên bán phải chịu chi phí thực tế cho việc điều động phương tiện.</p>
            <p>5. Khi nhận hàng, bên mua có trách nhiệm kiểm nhận phẩm chất, quy cách hàng hóa tại chỗ. Nếu phát hiện hàng thiếu hoặc không đúng tiêu chuẩn chất lượng v.v… thì lập biên bản tại chỗ, yêu cầu bên bán xác nhận. Hàng đã ra khỏi kho bên bán không chịu trách nhiệm (trừ loại hàng có quy định thời hạn bảo hành).</p>
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
            <p>1. Bên A có trách nhiệm bảo hành chất lượng hàng nông sản sạch cho bên mua trong suốt quá trình vận tải đóng gói trong thời gian quy định.</p>
            <p>2. Bên A phải cung cấp đủ phiếu xuất kho, phiếu kiểm nghiệm chỉ tiêu hữu cơ, CO/CQ hướng dẫn quy cách dán nhãn của cơ quan hải quan (nếu cần).</p>
          </div>
          
          <div class="section-title">Điều 6: NGƯNG THANH TOÁN TIỀN MUA HÀNG</div>
          <div style="padding-left: 15px;">
            <p>1. Bên B có bằng chứng về việc bên A lừa dối thì có quyền tạm ngừng việc thanh toán;</p>
            <p>2. Bên B có bằng chứng về việc hàng hóa đang là đối tượng bị tranh chấp thì có quyền tạm ngừng thanh toán cho đến khi việc tranh chấp đã được giải quyết;</p>
            <p>3. Bên B có bằng chứng về việc bên A đã giao hàng không phù hợp với hợp đồng thì có quyền tạm ngừng thanh toán cho đến khi bên A đã khắc phục sự không phù hợp đó;</p>
            <p>4. Trường hợp tạm ngừng thanh toán mà bằng chứng do bên B đưa ra không xác thực, gây thiệt hại cho bên A thì bên B phải bồi thường thiệt hại đó và chịu các chế tài khác theo luật định.</p>
          </div>
          
          <div class="section-title">Điều 7: ĐIỀU KHOẢN PHẠT VI PHẠM HỢP ĐỒNG</div>
          <div style="padding-left: 15px;">
            <p>1. Hai bên cam kết thực hiện nghiêm túc các điều khoản đã thỏa thuận trên, không được đơn phương thay đổi hoặc hủy bỏ hợp đồng, bên nào không thực hiện hoặc đơn phương đình chỉ thực hiện hợp đồng mà không có lý do chính đáng thì sẽ bị phạt tới <strong style="font-family: Arial;">8%</strong> giá trị của hợp đồng bị vi phạm.</p>
            <p>2. Bên nào vi phạm các điều khoản trên đây sẽ phải chịu trách nhiệm vật chất theo quy định đối với bất cứ hành vi cố ý phá vỡ liên kết thương mại.</p>
          </div>
          
          <div class="section-title">Điều 8: BẤT KHẢ KHÁNG VÀ GIẢI QUYẾT TRANH CHẤP</div>
          <div style="padding-left: 15px;">
             <p>1. Bất khả kháng nghĩa là các sự kiện xảy ra một cách khách quan, không thể lường trước được và không thể khắc phục được mặc dù đã áp dụng mọi biện pháp cần thiết trong khả năng cho phép.</p>
             <p>2. Khi xảy ra sự kiện bất khả kháng, bên gặp phải bất khả kháng phải thông báo ngay cho bên kia trong vòng 24 giờ kể từ khi sự việc phát sinh.</p>
             <p>3. Mọi tranh chấp phát sinh sẽ được hai bên hòa giải thương lượng trên tinh thần tôn trọng quyền lợi của nhau. Nếu không thể thương thảo tự thỏa thuận, mọi tranh chấp sẽ được giải quyết tại ${c.disputeResolutionCourt || 'Tòa án nhân dân có thẩm quyền'} theo quy định của Bộ luật Tố tụng Dân sự 2015.</p>
          </div>
          
          <div class="section-title">Điều 9. Điều khoản chung</div>
          <div style="padding-left: 15px; margin-bottom: 30px;">
            <p>1. Hợp đồng này có hiệu lực kể từ ngày ký chữ ký số và tự động thanh lý hợp đồng kể từ khi Bên B đã nhận đủ hàng và Bên A đã nhận đủ tiền.</p>
            <p>2. Mọi sự bổ sung, sửa đổi hợp đồng này đều phải có sự đồng ý bằng văn bản của hai bên hoặc ký kết phụ lục hợp đồng thương mại điện tử liên kết.</p>
            <p>3. Hợp đồng được thành lập dưới dạng tệp điện tử PDF định dạng chuẩn lưu trữ quốc gia, có giá trị pháp lý tương đương văn bản giấy thông thường.</p>
          </div>
          
          <div class="signatures-container">
            <div class="signature-box">
              <div class="signature-label">ĐẠI DIỆN BÊN BÁN (BÊN A)</div>
              <div class="signature-sub">(Ký, ghi rõ họ tên và đóng dấu)</div>
              
              ${(c.status === 'pending_super_admin' || c.status === 'Chờ duyệt') ? `
                <div style="min-height: 80px; display: flex; align-items: center; font-style: italic; color: #777;">
                  Chưa ký số pháp lý
                </div>
              ` : `
                <div class="stamp-wrapper">
                  <!-- Circular seal SVG embedded -->
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
                  Ký bởi: ${c.seller?.name || c.coopName || 'Chủ Tịch Hợp Tác xã'}<br/>
                  Thời gian ký: ${new Date(c.createdAt || new Date()).toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}<br/>
                  Số sê-ri CA: CA-2026-Viettel-HSM-902A<br/>
                  Nhà cung cấp: Viettel-CA National Certificate Authority
                </div>
              `}
              
              <div style="margin-top: 15px; font-weight: bold; text-decoration: underline; font-size: 14.5px;">
                ${c.seller?.rep || c.sellerRep || 'Nguyễn Văn Hợp'}
              </div>
            </div>
            
            <div class="signature-box">
              <div class="signature-label">ĐẠI DIỆN BÊN MUA (BÊN B)</div>
              <div class="signature-sub">(Ký, ghi rõ họ tên và đóng dấu)</div>
              
              ${c.status === 'active' ? `
                <div class="stamp-wrapper">
                  <!-- Partner SVG circular seal in green -->
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
                  Ký bởi: ${c.buyer?.name || c.enterpriseName || 'Doanh nghiệp'}<br/>
                  Đại diện: ${c.buyer?.rep || c.buyerRep || 'Trần Văn Bảo'}<br/>
                  Thời gian: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}<br/>
                  Số sê-ri CA: CA-2026-FPT-CA-91A2
                </div>
              ` : `
                <div style="min-height: 80px; display: flex; align-items: center; font-style: italic; color: #777;">
                  Chờ doanh nghiệp ký số liên kết
                </div>
              `}
              
              <div style="margin-top: 15px; font-weight: bold; text-decoration: underline; font-size: 14.5px;">
                ${c.buyer?.rep || c.buyerRep || 'Trần Văn Bảo'}
              </div>
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

  const completeSigningCustomer = (contractId: string) => {
    // 1. Update contractsList in memory & save to 'vietagri_contracts_v2' in localStorage
    const updatedContractsList = contractsList.map((c: any) => {
      if (String(c.id) === String(contractId)) {
        return { 
          ...c, 
          status: 'active'
        };
      }
      return c;
    });
    setContractsList(updatedContractsList);
    localStorage.setItem('vietagri_contracts_v2', JSON.stringify(updatedContractsList));

    // 2. Also keep simpler 'vietagri_contracts' in sync if it exists in localStorage
    const rawSimple = localStorage.getItem('vietagri_contracts');
    if (rawSimple) {
      try {
        const parsedSimple = JSON.parse(rawSimple);
        const updatedSimple = parsedSimple.map((s: any) => {
          if (String(s.id) === String(contractId)) {
            return {
              ...s,
              status: 'Đang thực hiện'
            };
          }
          return s;
        });
        localStorage.setItem('vietagri_contracts', JSON.stringify(updatedSimple));
      } catch (e) {
        console.error("Error keeping vietagri_contracts in sync", e);
      }
    }

    // 3. Update the view modal reference too so that beneath or beside, the signature reflects instantly
    const matchedContract = updatedContractsList.find((c: any) => String(c.id) === String(contractId));
    if (matchedContract) {
      setSelectedContractForModal(matchedContract);
    }

    // 4. Update step to show completion details
    setSigningStep('success');
  };

  // Read router navigation state for successful contract creation or saved notice
  useEffect(() => {
    if (location.state?.savedSuccess && location.state?.savedContractNo) {
      setSuccessBanner(`Hợp đồng ${location.state.savedContractNo} đã được khởi tạo thành công và đang chờ Ban quản trị phê duyệt!`);
      // Reload contractsList from localStorage
      const raw = localStorage.getItem('vietagri_contracts_v2');
      if (raw) {
        try {
          setContractsList(JSON.parse(raw));
        } catch (e) {}
      }
      // Clean up state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: user } = await authService.me();
        if (user && user.role !== 'customer') {
          setUserData(user);
          localStorage.setItem('current_user', JSON.stringify(user));
          if (user.role === 'enterprise' && user.passwordChanged === false) {
            navigate('/customer/change-password');
          }
        }
      } catch (err) {
        console.error('Check user error', err);
      }
    };
    checkUser();
    
    // Always reload contracts from localStorage on mount/navigation
    const raw = localStorage.getItem('vietagri_contracts_v2');
    if (raw) {
        try {
            setContractsList(JSON.parse(raw));
        } catch (e) {}
    }
  }, [navigate, location.pathname, activeTab]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Mock Products
  const [products, setProducts] = useState(() => {
    const defaultProducts = [
      { 
        id: '1', 
        name: 'Cà Phê Arabica Cầu Đất', 
        tag: 'Chuẩn 5*', 
        price: '450.000 ₫', 
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400',
        origin: 'Lâm Đồng',
        htxId: 'HTX-001',
        htxName: 'HTX Cà phê Cầu Đất',
        story: 'Sinh ra từ độ cao 1.650m, nơi sương mù bao phủ quanh năm, những hạt cà phê Arabica Cầu Đất mang hương thơm nồng nàn và vị chua thanh khiết đặc trưng.',
        standards: ['VietGAP', 'Organic certified', 'Traceability QR'],
        plantingDate: 'Tháng 10/2023',
        harvestDate: 'Tháng 03/2024',
        type: 'Thượng hạng'
      },
      { 
        id: '2', 
        name: 'Mật Ong Hoa Nhãn', 
        tag: 'Chuẩn 4*', 
        price: '280.000 ₫', 
        unit: 'lít',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400',
        origin: 'Hưng Yên',
        htxId: 'HTX-008',
        htxName: 'HTX Hải Châu Nông Sản',
        story: 'Khai thác từ những rừng nhãn cổ thụ Hưng Yên trong tiết trời tháng 3, mật ong có màu vàng óng, hương thơm dịu nhẹ và vị ngọt đậm đà.',
        standards: ['ISO 22000', 'HACCP'],
        plantingDate: 'Mùa hoa 2024',
        harvestDate: 'Tháng 05/2024',
        type: 'Nguyên chất'
      },
      { 
        id: '3', 
        name: 'Trà Xanh Thái Nguyên', 
        tag: 'Chuẩn 5*', 
        price: '1.200.000 ₫', 
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1544787210-282ddc37db4e?auto=format&fit=crop&q=80&w=400',
        origin: 'Thái Nguyên',
        htxId: 'HTX-009',
        htxName: 'HTX Cầu Giấy Xanh',
        story: 'Hái từ những đồi chè Tân Cương lúc sáng sớm, quy trình sao tay truyền thống giữ trọn hương vị cốm non và hậu vị ngọt sâu.',
        standards: ['OCOP 5 sao', 'GlobalGAP'],
        plantingDate: 'Vụ Xuân 2024',
        harvestDate: 'T6/2024 (Dự kiến)',
        type: 'Tân Cương Loại 1'
      },
      { 
        id: '4', 
        name: 'Gạo ST25 Sóc Trăng', 
        tag: 'Gạo ngon nhất TG', 
        price: '45.000 ₫', 
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
        origin: 'Sóc Trăng',
        htxId: 'HTX-010',
        htxName: 'HTX Thanh Khê Hải Sản',
        story: 'Gạo ST25 nổi danh thế giới với hạt gạo dài, trắng trong, khi chín cơm mềm dẻo, thơm hương lá dứa hòa quyện hương cốm.',
        standards: ['GlobalGAP', 'Non-GMO'],
        plantingDate: 'Vụ Lúa - Tôm 2023',
        harvestDate: 'Tháng 01/2024',
        type: 'Organic'
      },
    ];

    const savedPosts = localStorage.getItem('vietagri_sale_posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const transformedPosts = posts.map((post: any) => ({
        id: post.id || Math.random().toString(),
        name: post.title || post.productName,
        tag: 'Mới đăng',
        price: post.price.split(' ')[0] + ' ₫',
        unit: post.unit || 'kg',
        category: post.category || 'Nông sản',
        image: post.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
        origin: post.origin || 'Việt Nam',
        htxId: post.cooperativeId || 'HTX-001',
        htxName: post.cooperativeName || 'HTX Cà phê Cầu Đất',
        story: post.story || 'Sản phẩm được canh tác theo quy trình nông nghiệp thông minh, ứng dụng công nghệ IoT và Blockchain để giám sát chất lượng từ gốc.',
        standards: post.standards || ['VietGAP', 'Truy xuất nguồn gốc'],
        plantingDate: post.plantingDate || 'Liên hệ để biết thêm',
        harvestDate: post.harvestDate || post.date || 'Sẵn sàng giao hàng',
        type: post.baseProduct || 'Nông sản sạch'
      }));
      
      const allProducts = [...transformedPosts, ...defaultProducts];
      // Filter out duplicates by ID
      const uniqueProducts = allProducts.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
      return uniqueProducts;
    }
    return defaultProducts;
  });

  const handleMockPayment = () => {
    if (!selectedContractForPayment) return;

    const contractId = selectedContractForPayment.id;
    let paymentAmount = 0;
    
    // Calculate how much we are paying
    if (selectedPhaseToPay === 'phase1') {
      const percentage = parseInt(selectedContractForPayment.paymentPhase1 || '30', 10) / 100;
      paymentAmount = selectedContractForPayment.totalVal * percentage;
    } else {
      const percentage = parseInt(selectedContractForPayment.paymentPhase2 || '70', 10) / 100;
      paymentAmount = selectedContractForPayment.totalVal * percentage;
    }

    const updated = contractsList.map(c => {
      if (c.id === contractId) {
        let newPaid = c.paidAmount || 0;
        let phase1Status = c.paymentPhase1Status;
        let phase2Status = c.paymentPhase2Status;

        if (selectedPhaseToPay === 'phase1') {
          if (c.paymentPhase1Status !== 'paid') {
            newPaid += paymentAmount;
            phase1Status = 'paid';
          }
        } else {
          if (c.paymentPhase2Status !== 'paid') {
            newPaid += paymentAmount;
            phase2Status = 'paid';
          }
        }

        // Check if both are paid, then completed
        const isCompleted = Math.min(newPaid, c.totalVal) === c.totalVal;
        return {
          ...c,
          paidAmount: Math.min(newPaid, c.totalVal),
          paymentPhase1Status: phase1Status,
          paymentPhase2Status: phase2Status,
          status: isCompleted ? 'Đã hoàn tất' : 'Đang thực hiện'
        };
      }
      return c;
    });

    setContractsList(updated);
    localStorage.setItem('vietagri_contracts_v2', JSON.stringify(updated));
    
    // Also sync back to simpler vietagri_contracts if it exists
    const rawSimple = localStorage.getItem('vietagri_contracts');
    if (rawSimple) {
      try {
        const parsedSimple = JSON.parse(rawSimple);
        const updatedSimple = parsedSimple.map((s: any) => {
          if (s.id === contractId) {
            const matched = updated.find(u => u.id === contractId);
            const statusLabel = matched?.paidAmount === matched?.totalVal ? 'Đã hoàn tất' : 'Đang thực hiện';
            return {
              ...s,
              status: statusLabel
            };
          }
          return s;
        });
        localStorage.setItem('vietagri_contracts', JSON.stringify(updatedSimple));
      } catch (e) {}
    }

    setShowPaymentModal(false);
    setSelectedContractForPayment(null);
    setSuccessBanner("Thanh toán thành công! Công nợ của bạn đã được giảm trừ ngay lập tức trên hệ thống.");
    setTimeout(() => setSuccessBanner(null), 3000); // Auto-hide success message
  };

  const activeContracts = contractsList.filter(c => c.status === 'active');

  // Mock Orders
  const orders = [
    { id: 'ORD-8829', date: '05/05/2024', status: 'shipping', total: '12,500,000 VNĐ', items: 3 },
    { id: 'ORD-8812', date: '01/05/2024', status: 'delivered', total: '4,200,000 VNĐ', items: 1 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Premium Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 hidden xl:flex flex-col h-screen sticky top-0 shrink-0 overflow-y-auto">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#004d40] rounded-2xl flex items-center justify-center shadow-xl shadow-[#004d40]/20">
              <span className="text-white font-black text-2xl">V</span>
            </div>
            <span className="text-2xl font-black tracking-widest text-[#004d40]">VIETAGRI</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-3">
          {[
            { id: 'marketplace', label: 'Cửa hàng nông sản', icon: <ShoppingBag size={22} /> },
            { id: 'contracts', label: 'Hợp đồng & Công nợ', icon: <MapPin size={22} /> },
            { id: 'traceability', label: 'Truy xuất nguồn gốc', icon: <QrCode size={22} /> },
            { id: 'orders', label: 'Đơn hàng của tôi', icon: <Truck size={22} /> },
            { id: 'feedback', label: 'Đánh giá & Phản hồi', icon: <Star size={22} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between p-5 rounded-[2rem] transition-all group ${
                activeTab === item.id ? 'bg-[#004d40] text-white shadow-2xl shadow-[#004d40]/30 scale-105' : 'text-slate-400 hover:bg-slate-50 hover:text-[#004d40]'
              }`}
            >
              <div className="flex items-center gap-4 font-black text-sm uppercase tracking-widest">
                {item.icon}
                {item.label}
              </div>
              {activeTab === item.id && <Zap size={14} className="text-[#4ade80] animate-pulse" />}
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="bg-gradient-to-br from-[#4ade80] to-[#004d40] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mt-16 -mr-16 transition-transform group-hover:scale-150 duration-700" />
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Hội viên Vàng</p>
              <p className="text-lg font-black leading-tight mb-6">Bạn có 12 mã ưu đãi <br /> vận chuyển 0đ</p>
              <button className="w-full py-4 bg-white text-[#004d40] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4ade80] transition-colors">Xem ưu đãi</button>
            </div>
          </div>
          
          <button 
            onClick={() => {
              localStorage.removeItem('userRole');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userPhone');
              navigate('/login');
            }}
            className="flex items-center gap-3 mt-10 ml-4 text-slate-400 hover:text-red-500 transition-colors font-black text-xs uppercase tracking-widest"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-40 px-10 py-8 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-6">
             <div className="lg:flex hidden items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 w-[500px]">
                <Search className="text-slate-400" size={20} />
                <input type="text" placeholder="Tìm kiếm nông sản, tên hợp tác xã..." className="bg-transparent outline-none w-full text-sm font-bold text-[#004d40] placeholder:text-slate-300" />
                <Filter className="text-slate-300 cursor-pointer hover:text-[#004d40] transition-colors" size={18} />
             </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="relative text-slate-400 hover:text-[#004d40] transition-colors">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4ade80] border-4 border-white rounded-full flex items-center justify-center shadow-lg" />
            </button>
            <Link 
              to="/customer/profile"
              className="flex items-center gap-4 pl-8 border-l border-slate-100 hover:opacity-80 transition-opacity"
            >
              <div className="text-right">
                <p className="text-sm font-black text-[#004d40]">{userData?.name || 'Doanh Nghiệp Đối Tác'}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-end gap-2">
                  <ShieldCheck size={12} className="text-[#4ade80]" /> Đối tác tin cậy
                </p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden shadow-inner border-2 border-white flex items-center justify-center text-[#004d40] font-black italic border-slate-200">
                {userData?.avatar ? (
                  <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{userData?.name?.charAt(0) || 'D'}</span>
                )}
              </div>
            </Link>
          </div>
        </header>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'marketplace' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >


                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <motion.div 
                      key={product.id}
                      whileHover={{ y: -10 }}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-50 relative group flex flex-col h-full cursor-pointer"
                    >
                      <div className="h-64 relative overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-[#004d40]">
                          {product.tag}
                        </div>
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                          <Heart size={18} />
                        </button>
                      </div>
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <MapPin size={12} className="text-[#4ade80]" /> {product.origin}
          </p>
          {product.htxId && (
            <span className="text-[10px] font-black text-[#004d40] bg-[#004d40]/5 px-2 py-0.5 rounded italic">
              {product.htxId}
            </span>
          )}
        </div>
        <h4 className="text-lg font-black text-[#004d40] mb-2 leading-tight min-h-[3rem] line-clamp-2">{product.name}</h4>
        
        {product.htxName && (
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={12} className="text-slate-400" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{product.htxName}</p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
                          <div className="flex-1 text-left">
                            <p className="text-[10px] font-black text-[#4ade80] uppercase tracking-widest mb-1">Giá niêm yết</p>
                            <p className="text-lg font-black text-[#004d40]">{product.price}<span className="text-xs text-slate-400 font-bold ml-1">/{product.unit}</span></p>
                          </div>
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className="w-12 h-12 bg-slate-50 group-hover:bg-[#004d40] transition-colors rounded-2xl flex items-center justify-center text-[#004d40] group-hover:text-white shadow-inner"
                          >
                            <ArrowRight size={20} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'traceability' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto py-12"
              >
                <div className="bg-white rounded-[4rem] p-16 shadow-2xl border border-slate-50 text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4ade80] via-[#004d40] to-[#4ade80]" />
                   <div className="w-24 h-24 bg-[#004d40]/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-[#004d40]">
                      <QrCode size={48} />
                   </div>
                   <h2 className="text-4xl font-black text-[#004d40] mb-6 tracking-tight">Cổng Truy Xuất Minh Bạch</h2>
                   <p className="text-slate-500 font-medium text-lg mb-12 max-w-xl mx-auto leading-relaxed">Mỗi sản phẩm từ VIETAGRI đều mang một định danh số duy nhất. Quét mã QR trên bao bì để xem lịch sử hành trình từ hạt giống đến bàn ăn.</p>
                   
                   <div className="bg-slate-50 rounded-[3rem] p-12 border-2 border-dashed border-slate-200 mb-12">
                      <div className="w-48 h-48 bg-white p-4 rounded-3xl mx-auto shadow-2xl border border-slate-100 flex items-center justify-center mb-8">
                         <QrCode size={120} className="text-[#004d40] opacity-80" />
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Nhập mã định danh sản phẩm</p>
                      <div className="flex gap-4 max-w-md mx-auto">
                        <input type="text" placeholder="Ví dụ: VA-2024-8891" className="flex-1 px-8 py-5 bg-white rounded-2xl border border-slate-100 outline-none font-black text-[#004d40] shadow-sm focus:border-[#004d40] transition-all" />
                        <button className="bg-[#004d40] text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4ade80] transition-all shadow-xl shadow-[#004d40]/20">Kiểm tra</button>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-3 gap-8">
                      {[
                        { icon: <ShieldCheck size={24} />, title: "Chống giả mạo", desc: "Định danh NFC/QR Blockchain" },
                        { icon: <MapPin size={24} />, title: "Vùng trồng GIS", desc: "Tọa độ GPS chính xác" },
                        { icon: <Package size={24} />, title: "Logistics 4.0", desc: "Theo dõi nhiệt độ, độ ẩm" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-3">
                           <div className="text-[#4ade80] inline-block p-4 bg-[#4ade80]/5 rounded-2xl mb-2">{item.icon}</div>
                           <h4 className="font-black text-[#004d40] text-sm uppercase tracking-wide">{item.title}</h4>
                           <p className="text-xs text-slate-400 leading-relaxed font-bold">{item.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-10"
              >
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black text-[#004d40]">Đơn hàng của bạn</h3>
                   <div className="flex gap-4">
                      <button className="px-6 py-3 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:border-[#004d40] hover:text-[#004d40] transition-all">Đang xử lý</button>
                      <button className="px-6 py-3 bg-[#004d40] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Lịch sử</button>
                   </div>
                </div>

                <div className="space-y-6">
                   {activeContracts.length === 0 ? (
                      <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-xl">
                        <Package size={48} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-wider">Chưa có đơn hàng nào / Chưa có hợp đồng đang hiệu lực</p>
                      </div>
                   ) : activeContracts.map((contract) => {
                      const cName = contract.cropName.toLowerCase();
                      const isShortTerm = cName.includes('rau') || cName.includes('cải') || cName.includes('dưa') || cName.includes('hành') || cName.includes('nấm');
                      const baseDate = new Date(contract.deliveryTime).getTime();

                      if (isShortTerm) {
                        return (
                          <div key={contract.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 flex flex-col gap-6 group transition-all hover:border-blue-200">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                                  <Repeat size={32} />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Sản phẩm ngắn ngày (Giao nhiều lần)</p>
                                  <h4 className="text-xl font-black text-[#004d40]">{contract.cropName}</h4>
                                  <p className="text-sm text-slate-400 font-bold max-w-md truncate">Đối tác: {contract.coopName}</p>
                                </div>
                              </div>
                              <div className="text-left lg:text-right">
                                <p className="text-2xl font-black text-[#004d40] mb-1">{contract.totalVolume}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100 shadow-sm"><Repeat size={12} className="inline mr-1.5 -mt-0.5 text-blue-500" />Định kỳ hàng tuần</p>
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-100/60">
                               <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center"><Calendar size={14} className="mr-2 text-blue-600" /> Lịch trình giao nhận (Dự kiến)</p>
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* Đợt 1 */}
                                  <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                                     <div className="flex justify-between items-center mb-3">
                                       <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest bg-emerald-100/50 px-2.5 py-1 rounded-md">Đợt 1</span>
                                       <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider flex items-center"><CheckCircle2 size={12} className="mr-1"/> Hoàn thành</span>
                                     </div>
                                     <p className="text-lg font-black text-emerald-900 tracking-tight">{(parseInt(contract.totalVolume.replace(/\D/g,'')) / 3).toLocaleString('vi-VN')} {contract.totalVolume.replace(/[0-9,\s]/g, '')}</p>
                                     <p className="text-[11px] font-bold text-emerald-700/70 mt-1.5">{new Date(baseDate - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}</p>
                                  </div>
                                  {/* Đợt 2 */}
                                  <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200 shadow-md shadow-amber-900/5 relative overflow-hidden ring-1 ring-amber-400/20">
                                     <div className="flex justify-between items-center mb-3 relative z-10">
                                       <span className="text-[10px] font-black uppercase text-amber-800 tracking-widest bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200">Đợt 2</span>
                                       <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider animate-pulse flex items-center"><Truck size={12} className="mr-1"/> Đang nhận</span>
                                     </div>
                                     <p className="text-lg font-black text-amber-950 tracking-tight relative z-10">{(parseInt(contract.totalVolume.replace(/\D/g,'')) / 3).toLocaleString('vi-VN')} {contract.totalVolume.replace(/[0-9,\s]/g, '')}</p>
                                     <p className="text-[11px] font-bold text-amber-700/80 mt-1.5 relative z-10">{new Date(baseDate - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}</p>
                                     <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-300 w-[65%]" />
                                  </div>
                                  {/* Đợt 3 */}
                                  <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200/60">
                                     <div className="flex justify-between items-center mb-3">
                                       <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest bg-slate-200/50 px-2.5 py-1 rounded-md">Đợt 3</span>
                                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center"><Clock size={12} className="mr-1"/> Chờ xử lý</span>
                                     </div>
                                     <p className="text-lg font-black text-slate-700 tracking-tight">{(parseInt(contract.totalVolume.replace(/\D/g,'')) / 3).toLocaleString('vi-VN')} {contract.totalVolume.replace(/[0-9,\s]/g, '')}</p>
                                     <p className="text-[11px] font-bold text-slate-500 mt-1.5">{new Date(contract.deliveryTime).toLocaleDateString('vi-VN')}</p>
                                  </div>
                               </div>
                            </div>
                          </div>
                        );
                      } else {
                        // Long term -> single batch
                        return (
                          <div key={contract.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-50 flex flex-col gap-6 group transition-all hover:border-[#004d40]/30 hover:shadow-2xl">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-[#004d40] shadow-inner group-hover:bg-[#004d40] group-hover:text-white transition-colors duration-300 shrink-0">
                                  <Package size={32} />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-[#004d40]/70 uppercase tracking-[0.2em]">Sản phẩm dài ngày (Giao 1 lần)</p>
                                  <h4 className="text-xl font-black text-[#004d40]">Lô {contract.cropName}</h4>
                                  <p className="text-sm text-slate-400 font-bold max-w-md truncate">Đối tác: {contract.coopName}</p>
                                </div>
                              </div>
                              <div className="text-left lg:text-right">
                                <p className="text-2xl font-black text-[#004d40] mb-1">{contract.totalVolume}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest bg-slate-50 inline-flex items-center px-3 py-1 rounded-full border border-slate-100 shadow-sm"><Calendar size={12} className="mr-1.5 text-[#004d40]"/>Hạn giao: {contract.deliveryTime}</p>
                              </div>
                            </div>

                            <div className="w-full bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                               <div className="flex-1 w-full space-y-3">
                                  <div className="flex items-center justify-between mb-1">
                                     <span className="text-[10px] font-black text-[#004d40] uppercase tracking-widest flex items-center"><Truck size={14} className="mr-1.5" /> Trạng thái: Đang vận chuyển về kho</span>
                                     <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">60%</span>
                                  </div>
                                  <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
                                     <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 animate-[pulse_3s_ease-in-out_infinite]" style={{ width: '60%' }} />
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-bold">Vị trí hiện tại: <span className="text-[#004d40]">Trạm trung chuyển liên tỉnh</span></p>
                               </div>
                               <div className="shrink-0 mt-4 md:mt-0">
                                  <button className="px-6 py-3.5 bg-white border border-[#004d40]/20 text-[#004d40] hover:bg-[#004d40] hover:text-white hover:shadow-lg hover:-translate-y-0.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center">
                                    Chi tiết hành trình <ChevronRight size={14} className="ml-1" />
                                  </button>
                               </div>
                            </div>
                          </div>
                        );
                      }
                   })}
                </div>
              </motion.div>
            )}
            {activeTab === 'contracts' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-12"
              >
                {/* Custom alert notification banner */}
                {successBanner && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-6 bg-emerald-50 border border-emerald-200 rounded-[2rem] flex items-start gap-4 text-left shadow-lg relative overflow-hidden"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="flex-1 pr-6">
                      <h4 className="text-sm font-black text-[#004d40] uppercase tracking-wider mb-1">Chỉ thị hệ thống</h4>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{successBanner}</p>
                    </div>
                    <button 
                      onClick={() => setSuccessBanner(null)} 
                      className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}

                {/* Liabilities Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Contracts Value */}
                  <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[180px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-12 -translate-y-12 -z-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng Hợp Đồng Ký Kết</span>
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#004d40]">
                        <Briefcase size={18} />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-[#004d40] tracking-tight">{activeContracts.reduce((sum, c) => sum + (c.totalVal || 0), 0).toLocaleString('vi-VN')} ₫</p>
                      <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{activeContracts.length} hợp đồng có hiệu lực</p>
                    </div>
                  </div>

                  {/* Total Paid */}
                  <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[180px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-12 -translate-y-12 -z-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng Đã Thanh Toán</span>
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={18} />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-emerald-600 tracking-tight">{activeContracts.reduce((sum, c) => sum + (c.paidAmount || 0), 0).toLocaleString('vi-VN')} ₫</p>
                      <p className="text-[11px] text-emerald-600/70 font-bold mt-1 uppercase tracking-wider">
                        Đạt {activeContracts.reduce((sum, c) => sum + (c.totalVal || 0), 0) > 0 ? Math.round((activeContracts.reduce((sum, c) => sum + (c.paidAmount || 0), 0) / activeContracts.reduce((sum, c) => sum + (c.totalVal || 0), 0)) * 100) : 0}% giá trị ký kết
                      </p>
                    </div>
                  </div>

                  {/* Remaining Debt / Liabilities */}
                  <div className="bg-amber-50/40 rounded-[3rem] p-8 border border-amber-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[180px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-full translate-x-12 -translate-y-12 -z-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-amber-800/80 uppercase tracking-[0.2em]">Công Nợ Phải Trả</span>
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                        <AlertCircle size={18} />
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-amber-600 tracking-tight">{(activeContracts.reduce((sum, c) => sum + (c.totalVal || 0), 0) - activeContracts.reduce((sum, c) => sum + (c.paidAmount || 0), 0)).toLocaleString('vi-VN')} ₫</p>
                      <p className="text-[11px] text-amber-800/80 font-bold mt-1 uppercase tracking-wider">Số dư nợ hiện tại</p>
                    </div>
                  </div>
                </div>

                {/* Sub-header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-[#004d40] tracking-tight">Hồ sơ Hợp đồng & Công nợ</h3>
                    <p className="text-sm text-slate-400 font-bold mt-0.5">Danh sách các thỏa thuận ký kết liên kết của doanh nghiệp</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setActiveTab('marketplace')} 
                      className="py-3 px-6 bg-[#004d40] text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#4ade80] hover:scale-[1.02] transition-all flex items-center gap-2 self-start sm:self-center shrink-0 shadow-lg shadow-emerald-950/10"
                    >
                      <Plus size={16} /> Tạo Hợp Đồng Mới
                    </button>
                    <button 
                      onClick={() => setShowAllContracts(true)}
                      className="py-3 px-6 text-[#004d40] font-black text-xs uppercase tracking-wider hover:text-emerald-600 transition-all flex items-center gap-1 self-start sm:self-center shrink-0"
                    >
                      Xem tất cả <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                                {/* Contract Custom Row Layout */}
                {contractsList.length === 0 ? (
                  <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-xl">
                    <FileText size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-wider">Chưa có hợp đồng nào được ký kết</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    {[...contractsList]
                      .filter(c => c.contractNo?.includes('HĐMB'))
                      .sort((a,b) => (new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime()))
                      .slice(0, 5)
                      .map((c) => {
                      const totalC = c.totalVal || 0;
                      const paidC = c.paidAmount || 0;
                      const debtC = totalC - paidC;
                      
                      return (
                        <div key={c.id} 
                             className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:-translate-y-0.5 group"
                             onClick={() => setSelectedContractForModal(c)}
                        >
                           {/* Info Group 1: Contract Name & Date */}
                           <div className="flex bg-slate-50 p-4 rounded-2xl xl:bg-transparent xl:p-0 xl:rounded-none shrink-0 xl:w-56 gap-4 items-center transition-colors group-hover:bg-emerald-50/30">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-100/50 text-[#004d40] group-hover:bg-[#004d40] group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0">
                                 <FileText size={22} />
                              </div>
                              <div>
                                 <div className="text-sm font-black text-[#004d40] tracking-tight mb-1">{c.contractNo || 'Hợp đồng'}</div>
                                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center">
                                    <Calendar size={11} className="mr-1.5" /> {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                                 </div>
                              </div>
                           </div>
                           
                           {/* Info Group 2: Coop & Crop */}
                           <div className="flex-1 min-w-0 flex flex-col justify-center font-sans space-y-1.5">
                              <div className="text-xs font-black text-slate-700 uppercase truncate flex items-center gap-2">
                                 <span className="text-slate-400"><Building2 size={12}/></span> {c.coopName}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-2">
                                 <span className="text-slate-400">Nông sản:</span>
                                 <span className="font-bold text-slate-700">{c.cropName}</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                 <span className="font-bold text-[#004d40]">{c.totalVolume}</span>
                              </div>
                           </div>
                           
                           {/* Info Group 3: Financials */}
                           <div className="flex-1 min-w-0 font-sans space-y-1.5 xl:text-right">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá trị hợp đồng</div>
                              <div className="flex items-baseline xl:justify-end gap-2">
                                <span className="text-sm font-black text-[#004d40]">{totalC.toLocaleString('vi-VN')} ₫</span>
                                {debtC > 0 && <span className="text-[11px] font-bold text-amber-600" title="Công nợ còn lại">({debtC.toLocaleString('vi-VN')} ₫)</span>}
                              </div>
                           </div>

                           {/* Info Group 4: Status and Action */}
                           <div className="flex items-center justify-between xl:justify-end gap-5 shrink-0 xl:w-48">
                              <div>
                                {c.status === 'pending_super_admin' ? (
                                  <span className="px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100 whitespace-nowrap">
                                    Chờ ký số
                                  </span>
                                ) : (c.status === 'rejected_super_admin' || c.status === 'Hợp đồng đã bị từ chối' || c.status === 'rejected') ? (
                                  <span className="px-3.5 py-1.5 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-100 whitespace-nowrap">
                                    Bị từ chối
                                  </span>
                                ) : c.status === 'Thương thảo' ? (
                                  <span className="px-3.5 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-yellow-200 whitespace-nowrap">
                                    Thương thảo
                                  </span>
                                ) : (c.status === 'signed' || c.status === 'Chờ DN ký') ? (
                                  <span className="px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100 whitespace-nowrap">
                                    Chờ DN ký
                                  </span>
                                ) : (c.status === 'pending' || c.status === 'awaiting_signature') ? (
                                  <span className="px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100 whitespace-nowrap">
                                    Chờ duyệt
                                  </span>
                                ) : debtC === 0 ? (
                                  <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100 whitespace-nowrap">
                                    Đã tất toán
                                  </span>
                                ) : (
                                  <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100 whitespace-nowrap">
                                    Đang thực hiện
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-300 group-hover:text-[#004d40] transition-colors bg-slate-50 group-hover:bg-emerald-50 p-2 rounded-full hidden sm:block">
                                {(c.status === 'pending_super_admin' || c.status === 'signed' || c.status === 'Chờ DN ký') ? <Zap size={16} className="text-amber-500" /> : <Eye size={16} />}
                              </div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* All Contracts Modal */}
                <AnimatePresence>
                  {showAllContracts && (() => {
                    const b2bContracts = [...contractsList]
                      .filter(c => c.contractNo?.includes('HĐMB'))
                      .sort((a,b) => (new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime()));

                    const filteredContracts = b2bContracts.filter(c => {
                      const query = contractSearchQuery.toLowerCase().trim();
                      if (!query) return true;
                      return (
                        c.contractNo?.toLowerCase().includes(query) ||
                        c.coopName?.toLowerCase().includes(query) ||
                        c.cropName?.toLowerCase().includes(query)
                      );
                    });

                    return (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAllContracts(false)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white rounded-[3rem] p-8 w-full max-w-5xl max-h-[85vh] flex flex-col relative shadow-2xl z-10"
                        >
                           <button onClick={() => setShowAllContracts(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors z-20"><X size={24} /></button>
                           
                           <div className="shrink-0 mb-4 text-left">
                             <h2 className="text-2xl font-black text-[#004d40] mb-1">Tất cả hợp đồng</h2>
                             <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">
                               Số lượng hợp đồng: <span className="text-[#004d40] font-black">{b2bContracts.length}</span>
                               {contractSearchQuery && <span className="ml-1 text-[#004d40]">/ Tìm thấy: {filteredContracts.length}</span>}
                             </p>
                           </div>

                           <div className="relative mb-6 shrink-0 text-left">
                             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                               <Search size={18} />
                             </div>
                             <input 
                               type="text"
                               placeholder="Tìm kiếm theo mã hợp đồng, tên HTX, nông sản..."
                               value={contractSearchQuery}
                               onChange={(e) => setContractSearchQuery(e.target.value)}
                               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#004d40] focus:bg-white transition-all shadow-sm"
                             />
                           </div>

                           <div className="space-y-4 overflow-y-auto pr-2 flex-1 pb-4">
                              {filteredContracts.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl">
                                  <FileText className="mx-auto text-slate-300 mb-2" size={32} />
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Không tìm thấy hợp đồng phù hợp</p>
                                </div>
                              ) : (
                                filteredContracts.map((c) => {
                                  const totalC = c.totalVal || 0;
                                  const paidC = c.paidAmount || 0;
                                  const debtC = totalC - paidC;
                                  
                                  return (
                                    <div key={c.id} 
                                         className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:-translate-y-0.5 group text-left"
                                         onClick={() => { setSelectedContractForModal(c); setShowAllContracts(false); }}
                                    >
                                       {/* Info Group 1: Contract Name & Date */}
                                       <div className="flex bg-slate-50 p-4 rounded-2xl xl:bg-transparent xl:p-0 xl:rounded-none shrink-0 xl:w-56 gap-4 items-center transition-colors group-hover:bg-emerald-50/30">
                                          <div className="w-12 h-12 rounded-2xl bg-emerald-100/50 text-[#004d40] group-hover:bg-[#004d40] group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0">
                                             <FileText size={22} />
                                          </div>
                                          <div>
                                             <div className="text-sm font-black text-[#004d40] tracking-tight mb-1">{c.contractNo || 'Hợp đồng'}</div>
                                             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center">
                                                <Calendar size={11} className="mr-1.5" /> {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                                             </div>
                                          </div>
                                       </div>
                                       
                                       {/* Info Group 2: Coop & Crop */}
                                       <div className="flex-1 min-w-0 flex flex-col justify-center font-sans space-y-1.5">
                                          <div className="text-xs font-black text-slate-700 uppercase truncate flex items-center gap-2">
                                             <span className="text-slate-400"><Building2 size={12}/></span> {c.coopName}
                                          </div>
                                          <div className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-2">
                                             <span className="text-slate-400">Nông sản:</span>
                                             <span className="font-bold text-slate-700">{c.cropName}</span>
                                             <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                             <span className="font-bold text-[#004d40]">{c.totalVolume}</span>
                                          </div>
                                       </div>
                                       
                                       {/* Info Group 3: Financials */}
                                       <div className="flex-1 min-w-0 font-sans space-y-1.5 xl:text-right">
                                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá trị hợp đồng</div>
                                          <div className="flex items-baseline xl:justify-end gap-2">
                                            <span className="text-sm font-black text-[#004d40]">{totalC.toLocaleString('vi-VN')} ₫</span>
                                            {debtC > 0 && <span className="text-[11px] font-bold text-amber-600" title="Công nợ còn lại">({debtC.toLocaleString('vi-VN')} ₫)</span>}
                                          </div>
                                       </div>

                                       {/* Info Group 4: Status and Action */}
                                       <div className="flex items-center justify-between xl:justify-end gap-5 shrink-0 xl:w-48">
                                          <div>
                                            {c.status === 'pending_super_admin' ? (
                                              <span className="px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100 whitespace-nowrap">
                                                Chờ ký số
                                              </span>
                                            ) : (c.status === 'rejected_super_admin' || c.status === 'Hợp đồng đã bị từ chối' || c.status === 'rejected') ? (
                                              <span className="px-3.5 py-1.5 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-100 whitespace-nowrap">
                                                Bị từ chối
                                              </span>
                                            ) : c.status === 'Thương thảo' ? (
                                              <span className="px-3.5 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-yellow-200 whitespace-nowrap">
                                                Thương thảo
                                              </span>
                                            ) : (c.status === 'signed' || c.status === 'Chờ DN ký') ? (
                                              <span className="px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100 whitespace-nowrap">
                                                Chờ DN ký
                                              </span>
                                            ) : (c.status === 'pending' || c.status === 'awaiting_signature') ? (
                                              <span className="px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100 whitespace-nowrap">
                                                Chờ duyệt
                                              </span>
                                            ) : debtC === 0 ? (
                                              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100 whitespace-nowrap">
                                                Đã tất toán
                                              </span>
                                            ) : (
                                              <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100 whitespace-nowrap">
                                                Đang thực hiện
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-slate-300 group-hover:text-[#004d40] transition-colors bg-slate-50 group-hover:bg-emerald-50 p-2 rounded-full hidden sm:block">
                                            {(c.status === 'pending_super_admin' || c.status === 'signed' || c.status === 'Chờ DN ký') ? <Zap size={16} className="text-amber-500" /> : <Eye size={16} />}
                                          </div>
                                       </div>
                                    </div>
                                  );
                                })
                              )}
                           </div>
                        </motion.div>
                      </div>
                    );
                  })()}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'feedback' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[4rem] p-16 shadow-2xl border border-slate-50 text-center relative overflow-hidden"
              >
                <div className="w-24 h-24 bg-[#004d40]/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-[#004d40]">
                   <Star size={48} />
                </div>
                <h2 className="text-4xl font-black text-[#004d40] mb-6 tracking-tight">Đang phát triển</h2>
                <p className="text-slate-500 font-medium text-lg mb-12 max-w-xl mx-auto leading-relaxed">Tính năng Phản hồi & Đánh giá đang được hoàn thiện. Vui lòng quay lại sau.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row border border-white/20"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-8 right-8 z-20 w-12 h-12 text-white/70 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-[45%] h-64 md:h-auto relative overflow-hidden shrink-0">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent flex flex-col justify-end p-12">
                   <div className="flex items-center gap-3 mb-4">
                      <span className="px-5 py-2 bg-mint text-emerald-900 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl">{selectedProduct.tag}</span>
                      <span className="px-5 py-2 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-[11px] font-black uppercase tracking-widest">{selectedProduct.type}</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2 tracking-tight">{selectedProduct.name}</h2>
                   <p className="flex items-center gap-2 text-white/70 font-black text-xs uppercase tracking-widest"><MapPin size={16} className="text-mint" /> {selectedProduct.origin}</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                   {/* Story */}
                   <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                        <div className="w-8 h-px bg-slate-200" /> Câu chuyện sản phẩm
                      </h3>
                      <p className="text-base text-slate-700 font-medium leading-relaxed italic">"{selectedProduct.story}"</p>
                   </section>

                   {/* Key Specs Grid */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-2">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#004d40] shadow-sm"><Calendar size={18} /></div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Canh tác</p>
                            <p className="text-sm font-black text-[#004d40]">{selectedProduct.plantingDate}</p>
                         </div>
                      </div>
                      <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-2">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#004d40] shadow-sm"><Leaf size={18} /></div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Thu hoạch</p>
                            <p className="text-sm font-black text-[#004d40]">{selectedProduct.harvestDate}</p>
                         </div>
                      </div>
                   </div>

                   {/* Standards */}
                   <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                        <div className="w-8 h-px bg-slate-200" /> Tiêu chuẩn chất lượng
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.standards.map((std: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100/50">
                             <ShieldCheck size={16} className="text-emerald-500" />
                             <span className="text-xs font-bold tracking-tight">{std}</span>
                          </div>
                        ))}
                      </div>
                   </section>

                   {/* Business Metadata */}
                   <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#004d40] font-black italic shadow-inner">{selectedProduct.htxId?.slice(-3)}</div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Đơn vị cung ứng</p>
                            <p className="text-sm font-black text-[#004d40]">{selectedProduct.htxName}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Giá chào bán</p>
                         <p className="text-2xl font-black text-[#004d40] whitespace-nowrap">{selectedProduct.price}<span className="text-sm text-slate-400 font-bold ml-1">/{selectedProduct.unit}</span></p>
                      </div>
                   </div>

                   {/* Action Bridge */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <button className="py-4 px-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-slate-100 transition-all flex items-center justify-center gap-3 whitespace-nowrap border border-slate-100">
                        <Star size={16} /> Theo dõi
                      </button>
                      <button 
                        onClick={() => navigate(`/contract/${selectedProduct.id}`)}
                        className="py-4 px-4 bg-[#004d40] text-white rounded-2xl font-black text-[11px] uppercase tracking-wider hover:bg-[#4ade80] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 whitespace-nowrap"
                      >
                        <ClipboardCheck size={16} /> Ký kết hợp đồng
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contract Detail Clause Modal (Vietnamese Legal layout) */}
      <AnimatePresence>
        {selectedContractForModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseContractModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Header block */}
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#004d40]/10 rounded-xl flex items-center justify-center text-[#004d40]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#004d40] tracking-tight">Chi tiết Hợp đồng mua bán</h3>
                    <p className="text-xs text-slate-400 font-bold font-sans">Ký ngày: {new Date(selectedContractForModal.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedContractForModal.status === 'active' ? (
                    <button 
                      type="button"
                      onClick={() => handlePrintContract(selectedContractForModal)}
                      className="p-2.5 bg-white text-emerald-700 hover:text-emerald-800 rounded-xl border border-slate-200 transition-all flex items-center gap-2 text-xs font-bold cursor-pointer"
                    >
                      <Printer size={16} /> In hợp đồng
                    </button>
                  ) : (
                    <button 
                      type="button"
                      disabled
                      className="p-2.5 bg-slate-50 text-slate-400 rounded-xl border border-slate-200 flex items-center gap-2 text-xs font-bold cursor-not-allowed"
                      title="Chưa thể tải/In hợp đồng khi chưa hoàn tất chữ ký số cả 2 bên"
                    >
                      <Lock size={16} /> Chưa thể In (Chờ ký 2 bên)
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={handleCloseContractModal}
                    className="w-10 h-10 bg-white text-slate-400 hover:text-slate-600 rounded-xl flex items-center justify-center border border-slate-200 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Legal Doc Printable Paper Container */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-slate-100/50 text-slate-800 leading-relaxed font-sans text-xs">
                {signingStep !== 'idle' ? (
                  <div className="bg-white p-10 md:p-14 shadow-lg border border-slate-200 rounded-[2rem] max-w-3xl mx-auto space-y-8 select-text min-h-[450px] flex flex-col items-center justify-center text-center">
                    {signingStep === 'pincode' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full space-y-6"
                      >
                        <div className="mx-auto w-16 h-16 bg-[#004d40]/10 rounded-full flex items-center justify-center text-[#004d40] mb-4">
                          <Lock size={32} />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-800">Xác thực Chữ ký số Doanh nghiệp</h4>
                          <p className="text-xs text-slate-400 font-bold mt-1">Vui lòng nhập Mã PIN kiểm soát chữ ký số HSM doanh nghiệp để ký số Hợp đồng mua bán này.</p>
                        </div>
                        <div className="space-y-3">
                          <input 
                            type="password"
                            placeholder="Nhập mã PIN"
                            value={pinInput}
                            onChange={(e) => {
                              setPinInput(e.target.value);
                              setPinError('');
                            }}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center font-bold tracking-widest text-[#004d40] focus:ring-2 focus:ring-[#004d40] focus:border-transparent outline-none text-base"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleVerifyPinAndSign();
                            }}
                          />
                          {pinError ? (
                            <p className="text-xs text-rose-500 font-semibold">{pinError}</p>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-bold font-sans">Mã PIN mặc định cấu hình cứng cho hệ thống thử nghiệm là: <strong className="text-[#004d40]">123456</strong></p>
                          )}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setSigningStep('idle')}
                            className="w-1/2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Quay lại
                          </button>
                          <button
                            type="button"
                            onClick={handleVerifyPinAndSign}
                            className="w-1/2 py-3.5 bg-[#004d40] hover:bg-emerald-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer animate-pulse"
                          >
                            Xác nhận ký
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {signingStep === 'signing' && (
                      <div className="max-w-lg w-full space-y-6">
                        {/* Animated Circular Spinner */}
                        <div className="relative w-28 h-28 mx-auto">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                            <motion.circle 
                              cx="50" 
                              cy="50" 
                              r="42" 
                              stroke="#004d40" 
                              strokeWidth="6" 
                              fill="transparent"
                              strokeDasharray="264"
                              animate={{ strokeDashoffset: 264 - (264 * signProgress) / 100 }}
                              transition={{ duration: 0.3 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-lg text-[#004d40]">
                            {signProgress}%
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-base font-black text-slate-800">Đang thực hiện Ký số bảo mật...</h4>
                          <p className="text-xs text-slate-500 font-mono italic max-w-sm mx-auto">{signStatusMessage}</p>
                        </div>

                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#004d40] h-full transition-all duration-300" style={{ width: `${signProgress}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black font-mono">Powered by Viettel-CA HSM Secure Signature Tool</p>
                      </div>
                    )}

                    {signingStep === 'success' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full space-y-6"
                      >
                        <div className="mx-auto w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                          <CheckCircle2 size={36} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-emerald-600">Đã Phê duyệt & Ký số thành công!</h4>
                          <p className="text-xs text-slate-400 font-bold mt-1">Doanh nghiệp đã hoàn tất ký số Hợp đồng mua bán. Mã mộc điện tử đã được ghi danh pháp lý.</p>
                        </div>
                        
                        <div className="bg-slate-50 p-6 border border-slate-100 rounded-3xl space-y-2.5 text-left font-sans">
                          <p className="text-[11px] font-bold text-slate-500">Mã giao dịch ký số HSM: <span className="font-mono text-slate-900 font-black">TX-HSM-{Math.floor(Math.random() * 900000 + 100000)}</span></p>
                          <p className="text-[11px] font-bold text-slate-500">Người ký số thương mại: <span className="text-[#004d40] font-black">{selectedContractForModal.buyerRep || 'Trần Văn Bảo'}</span></p>
                          <p className="text-[11px] font-bold text-slate-500">Trạng thái hợp đồng: <span className="text-[#004d40] font-black uppercase tracking-wider">Đang thực hiện (Có hiệu lực)</span></p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            handleCloseContractModal();
                          }}
                          className="w-full py-4 bg-[#004d40] hover:bg-emerald-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg cursor-pointer"
                        >
                          Hoàn tất quy trình
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  /* Printable Whitepaper Legal Doc Styled Area with Standard A4 template styling */
                  <div className="bg-slate-50 border border-slate-200/80 rounded-[2rem] p-6 md:p-12 text-[#1c1c1c] font-serif leading-relaxed text-sm space-y-8 max-h-[52vh] overflow-y-auto scrollbar-thin shadow-inner select-text relative">
                    {/* National Header in template style */}
                    <div className="text-center font-serif text-slate-900 space-y-0.5">
                      <div className="font-bold text-[14px] leading-tight tracking-normal">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                      <div className="font-bold text-[13.5px] tracking-wide">Độc lập – Tự do – Hạnh phúc</div>
                      <div className="w-36 h-[1.5px] bg-slate-950 mx-auto mt-2"></div>
                    </div>

                    {/* Contract Title */}
                    <div className="text-center font-serif py-3 space-y-1">
                      <h4 className="text-[17px] font-bold text-slate-900 tracking-wide">HỢP ĐỒNG MUA BÁN HÀNG HÓA</h4>
                      <p className="text-xs font-sans tracking-wide">Số: {selectedContractForModal.contractNo?.includes('/2026/HĐMB') ? selectedContractForModal.contractNo : `${selectedContractForModal.contractNo || '01'}/2026/HĐMB`}</p>
                    </div>

                    {/* Legal foundations */}
                    <div className="text-xs space-y-1 pl-4 italic border-l-2 border-slate-300">
                      <p>– Căn cứ Bộ luật Dân sự 2015;</p>
                      <p>– Căn cứ Luật Thương mại 2005;</p>
                      <p>– Căn cứ nhu cầu và khả năng thực tế của các bên.</p>
                    </div>

                    {/* Opening statement */}
                    <p className="text-xs leading-relaxed text-justify indent-8 pt-2">
                      Hôm nay, ngày {new Date(selectedContractForModal.createdAt || new Date()).getDate()} tháng {new Date(selectedContractForModal.createdAt || new Date()).getMonth() + 1} năm {new Date(selectedContractForModal.createdAt || new Date()).getFullYear()}, tại địa chỉ: Văn phòng Ban Giám đốc Hợp tác xã, chúng tôi gồm có:
                    </p>

                    {/* Buyer & Seller details in legal structure representation */}
                    <div className="space-y-6 pt-2 font-sans text-xs">
                      {/* Bên Bán */}
                      <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-3">
                        <div className="font-bold text-forest uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                          BÊN BÁN (Bên A)
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700 leading-normal">
                          <div className="md:col-span-2"><strong>Tên doanh nghiệp:</strong> {selectedContractForModal.seller?.name || selectedContractForModal.coopName || 'HTX Cà phê Cầu Đất'}</div>
                          <div className="md:col-span-2"><strong>Mã số doanh nghiệp:</strong> {selectedContractForModal.seller?.taxCode || '3901284560'}</div>
                          <div className="md:col-span-2"><strong>Địa chỉ trụ sở chính:</strong> {selectedContractForModal.seller?.address || 'Khu phố 1, Huyện Đức Trọng, Tỉnh Lâm Đồng'}</div>
                          <div><strong>Người đại diện pháp luật:</strong> {selectedContractForModal.seller?.rep || selectedContractForModal.sellerRep || 'Nguyễn Văn Hợp'}</div>
                          <div><strong>Chức danh:</strong> {selectedContractForModal.seller?.position || 'Chủ tịch HĐQT'}</div>
                          <div><strong>CMND/CCCD/Hộ chiếu:</strong> {selectedContractForModal.seller?.cccd || '068092004561'}</div>
                          <div><strong>Cấp ngày:</strong> {selectedContractForModal.seller?.cccdDate || '15/08/2021'} (tại {selectedContractForModal.seller?.cccdPlace || 'Cục Cảnh sát QLHC'})</div>
                          <div><strong>Số điện thoại:</strong> {selectedContractForModal.seller?.phone || '0988777666'}</div>
                          <div><strong>Fax:</strong> {selectedContractForModal.seller?.fax || '02633 847 112'}</div>
                          <div className="md:col-span-2"><strong>Tài khoản ngân hàng số:</strong> {selectedContractForModal.seller?.bankAcc || '999988887777'} <strong>Mở tại ngân hàng:</strong> {selectedContractForModal.seller?.bankName || 'Agribank Lâm Đồng'}</div>
                        </div>
                      </div>

                      {/* Bên Mua */}
                      <div className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-3">
                        <div className="font-bold text-indigo-700 uppercase tracking-wider border-b border-dashed border-slate-200 pb-1 flex items-center gap-1.5 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          BÊN MUA (Bên B)
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700 leading-normal">
                          <div className="md:col-span-2"><strong>Tên doanh nghiệp:</strong> {selectedContractForModal.buyer?.name || selectedContractForModal.enterpriseName || 'Công ty Cổ phần VietAgri'}</div>
                          <div className="md:col-span-2"><strong>Mã số doanh nghiệp:</strong> {selectedContractForModal.buyer?.taxCode || selectedContractForModal.taxCode || '0312345678'}</div>
                          <div className="md:col-span-2"><strong>Địa chỉ trụ sở chính:</strong> {selectedContractForModal.buyer?.address || '156 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'}</div>
                          <div><strong>Người đại diện pháp luật:</strong> {selectedContractForModal.buyer?.rep || selectedContractForModal.buyerRep || 'Trần Văn Bảo'}</div>
                          <div><strong>Chức danh:</strong> {selectedContractForModal.buyer?.position || 'Giám đốc mua hàng'}</div>
                          <div><strong>CMND/CCCD/Hộ chiếu:</strong> {selectedContractForModal.buyer?.cccd || '079093004455'}</div>
                          <div><strong>Cấp ngày:</strong> {selectedContractForModal.buyer?.cccdDate || '20/10/2020'} (tại {selectedContractForModal.buyer?.cccdPlace || 'Cục Cảnh sát QLHC'})</div>
                          <div><strong>Số điện thoại:</strong> {selectedContractForModal.buyer?.phone || '0912345678'}</div>
                          <div><strong>Fax:</strong> {selectedContractForModal.buyer?.fax || '02838 123 456'}</div>
                          <div className="md:col-span-2"><strong>Tài khoản ngân hàng số:</strong> {selectedContractForModal.buyer?.bankAcc || '1029384756'} <strong>Mở tại ngân hàng:</strong> {selectedContractForModal.buyer?.bankName || 'Vietcombank'}</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-justify pt-3">
                      Trên cơ sở thỏa thuận hoàn toàn tự nguyện, hai bên thống nhất ký kết hợp đồng mua bán hàng hóa với các điều khoản như sau:
                    </p>

                    {/* ALL 9 ARTICLES (ĐIỀU KHOẢN) DETAILED EXPLICITLY */}
                    <div className="space-y-6 font-serif text-[13.5px]">
                      
                      {/* Điều 1 */}
                      <div className="space-y-2">
                        <h5 className="font-bold text-slate-900 border-b pb-1">Điều 1: Tên hàng hóa, số lượng, chất lượng, giá trị hợp đồng</h5>
                        <p className="text-justify text-xs text-slate-600">Bên A bán cho bên B hàng hóa sau đây:</p>
                        <div className="border border-slate-200 rounded-xl overflow-hidden font-sans">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-3 font-bold text-slate-700 text-center w-[8%]">STT</th>
                                <th className="p-3 font-bold text-slate-700">Tên Hàng Hóa</th>
                                <th className="p-3 font-bold text-slate-700 text-center">Đơn vị</th>
                                <th className="p-3 font-bold text-slate-700 text-center">Số lượng</th>
                                <th className="p-3 font-bold text-slate-700 text-right">Đơn giá (VNĐ)</th>
                                <th className="p-3 font-bold text-slate-700 text-right">Thành tiền (VNĐ)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-200">
                                <td className="p-3 text-center">1</td>
                                <td className="p-3 font-bold text-slate-800">{selectedContractForModal.cropName}</td>
                                <td className="p-3 text-center">kg</td>
                                <td className="p-3 text-center font-bold text-slate-900">{selectedContractForModal.totalVolume}</td>
                                <td className="p-3 text-right">{selectedContractForModal.unitPrice?.split(' ')[0]}</td>
                                <td className="p-3 text-right font-black text-forest">{(selectedContractForModal.totalVal || 0).toLocaleString('vi-VN')} VNĐ</td>
                              </tr>
                              <tr className="bg-slate-50/50">
                                <td className="p-3 text-center">2</td>
                                <td className="p-3 text-slate-400">---</td>
                                <td className="p-3 text-center text-slate-400">---</td>
                                <td className="p-3 text-center text-slate-400">---</td>
                                <td className="p-3 text-right text-slate-400">---</td>
                                <td className="p-3 text-right text-slate-400">---</td>
                              </tr>
                              <tr className="border-t border-slate-200">
                                <td colSpan={5} className="p-3 text-right font-bold text-slate-700 text-xs">Tổng số tiền cộng cộng:</td>
                                <td className="p-3 text-right font-black text-rose-600">{(selectedContractForModal.totalVal || 0).toLocaleString('vi-VN')} VNĐ</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border text-xs space-y-1 text-slate-700">
                          <p><strong>Tổng cộng bằng tiền:</strong> {selectedContractForModal.totalVal?.toLocaleString('vi-VN')} đồng Việt Nam.</p>
                          <p><strong>Bằng chữ:</strong> <span className="italic font-bold text-slate-900 underline">{docSoTienBangChu(selectedContractForModal.totalVal || 0)}</span></p>
                        </div>
                      </div>

                      {/* Điều 2 */}
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-900 border-b pb-1">Điều 2: Thanh toán</h5>
                        <div className="text-xs text-slate-700 pl-4 space-y-1">
                          <p>1. Bên B phải thanh toán cho Bên A số tiền ghi tại Điều 1 của Hợp đồng này dứt điểm muộn nhất vào ngày 15 tháng 12 năm 2026.</p>
                          <p>2. Bên B thanh toán cho Bên A theo hình thức: <span className="font-bold underline text-slate-900">{selectedContractForModal.paymentMethod || 'Chuyển khoản liên ngân hàng 24/7'}</span> vào số tài khoản do bên A chỉ định tại hợp đồng.</p>
                          <p>3. Phân kỳ tài chính: Đặt cọc <strong>{selectedContractForModal.paymentPhase1 || '30%'}</strong> trong vòng 03 ngày làm việc sau khi ký số; thanh toán nốt <strong>{selectedContractForModal.paymentPhase2 || '70%'}</strong> sau khi bốc dỡ bàn giao.</p>
                        </div>
                      </div>

                      {/* Điều 3 */}
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-900 border-b pb-1">Điều 3: Thời gian, địa điểm, phương thức giao hàng</h5>
                        <div className="text-xs text-slate-700 pl-4 space-y-1">
                          <p>1. Bên A giao hàng cho bên B theo lịch giao nông sản định kỳ: <strong>{selectedContractForModal.deliveryTime || 'Thu hoạch và giao nhận trong 15 ngày'}</strong>.</p>
                          <p>2. Địa điểm giao nhận hàng hóa: <span className="underline">{selectedContractForModal.deliveryLocation || 'Kho bãi vật lý bên Bán (Lâm Đồng)'}</span>.</p>
                          <p>3. Phương tiện vận chuyển và chi phí vận chuyển do bên <span className="font-bold underline">Bên B</span> chịu. Chi phí bốc xếp hai bên phối hợp bàn giao tại đầu kho.</p>
                          <p>4. Quy định lịch giao nhận hàng hóa mà bên mua không đến nhận hàng thì phải chịu chi phí lưu kho bãi là 1.000.000 đồng/ngày. Nếu phương tiện vận chuyển bên mua đến mà bên bán không có hàng giao thì bên bán phải chịu chi phí thực tế cho việc điều động phương tiện.</p>
                          <p>5. Khi nhận hàng, bên mua có trách nhiệm kiểm nhận phẩm chất, quy cách hàng hóa tại chỗ. Nếu phát hiện hàng thiếu hoặc không đúng tiêu chuẩn chất lượng v.v… thì lập biên bản tại chỗ, yêu cầu bên bán xác nhận. Hàng đã ra khỏi kho bên bán không chịu trách nhiệm (trừ loại hàng có quy định thời hạn bảo hành).</p>
                        </div>
                      </div>

                      {/* Điều 4 */}
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-900 border-b pb-1">Điều 4: Trách nhiệm của các bên</h5>
                        <div className="text-xs text-slate-700 pl-4 space-y-1">
                          <p>1. Bên bán không chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá nếu vào thời điểm giao kết hợp đồng bên mua đã biết hoặc phải biết về những khiếm khuyết đó;</p>
                          <p>2. Trừ trường hợp quy định tại khoản 1 Điều này, trong thời hạn khiếu nại theo quy định của Luật thương mại năm 2005, bên bán phải chịu trách nhiệm về bất kỳ khiếm khuyết nào của hàng hoá đã có trước thời điểm chuyển rủi ro cho bên mua, kể cả trường hợp khiếm khuyết đó được phát hiện sau thời điểm chuyển rủi ro;</p>
                          <p>3. Bên bán phải chịu trách nhiệm về khiếm khuyết của hàng hóa phát sinh sau thời điểm chuyển rủi ro nếu khiếm khuyết đó do bên bán vi phạm hợp đồng.</p>
                          <p>4. Bên mua có trách nhiệm thanh toán và nhận hàng theo đúng thời gian đã thỏa thuận.</p>
                        </div>
                      </div>

                      {/* Điều 5 */}
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-900 border-b pb-1">Điều 5: Bảo hành và hướng dẫn sử dụng hàng hóa</h5>
                        <div className="text-xs text-slate-700 pl-4 space-y-1">
                          <p>1. Bên A có trách nhiệm bảo hành chất lượng hàng nông sản sạch cho bên mua trong suốt quá trình vận tải đóng gói trong thời gian quy định.</p>
                          <p>2. Bên A phải cung cấp đủ phiếu xuất kho, phiếu kiểm nghiệm chỉ tiêu hữu cơ, CO/CQ hướng dẫn quy cách dán nhãn của cơ quan hải quan (nếu cần).</p>
                        </div>
                      </div>

                      {/* Điều 6 */}
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-900 border-b pb-1">Điều 6: Ngưng thanh toán tiền mua hàng</h5>
                        <div className="text-xs text-slate-700 pl-4 space-y-1">
                          <p>1. Bên B có bằng chứng về việc bên A lừa dối thì có quyền tạm ngừng việc thanh toán;</p>
                          <p>2. Bên B có bằng chứng về việc hàng hóa đang là đối tượng bị tranh chấp thì có quyền tạm ngừng thanh toán cho đến khi việc tranh chấp đã được giải quyết;</p>
                          <p>3. Bên B có bằng chứng về việc bên A đã giao hàng không phù hợp với hợp đồng thì có quyền tạm ngừng thanh toán cho đến khi bên A đã khắc phục sự không phù hợp đó;</p>
                          <p>4. Trường hợp tạm ngừng thanh toán mà bằng chứng do bên B đưa ra không xác thực, gây thiệt hại cho bên A thì bên B phải bồi thường thiệt hại đó và chịu các chế tài khác theo luật định.</p>
                        </div>
                      </div>

                      {/* Điều 7 */}
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-900 border-b pb-1">Điều 7: Điều khoản phạt vi phạm hợp đồng</h5>
                        <div className="text-xs text-slate-700 pl-4 space-y-1">
                          <p>1. Hai bên cam kết thực hiện nghiêm túc các điều khoản đã thỏa thuận trên, không được đơn phương thay đổi hoặc hủy bỏ hợp đồng, bên nào không thực hiện hoặc đơn phương đình chỉ thực hiện hợp đồng mà không có lý do chính đáng thì sẽ bị phạt tới <strong className="font-bold">8%</strong> giá trị của hợp đồng bị vi phạm.</p>
                          <p>2. Bên nào vi phạm các điều khoản trên đây sẽ phải chịu trách nhiệm vật chất theo quy định đối với bất cứ hành vi cố ý phá vỡ liên kết thương mại.</p>
                        </div>
                      </div>

                      {/* Điều 8 */}
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-900 border-b pb-1">Điều 8: Bất khả kháng và giải quyết tranh chấp</h5>
                        <div className="text-xs text-slate-700 pl-4 space-y-1">
                          <p>1. Bất khả kháng nghĩa là các sự kiện xảy ra một cách khách quan, không thể lường trước được và không thể khắc phục được mặc dù đã áp dụng mọi biện pháp cần thiết trong khả năng cho phép.</p>
                          <p>2. Khi xảy ra sự kiện bất khả kháng, bên gặp phải bất khả kháng phải thông báo ngay cho bên kia trong vòng 24 giờ kể từ khi sự việc phát sinh.</p>
                          <p>3. Mọi tranh chấp phát sinh sẽ được hai bên hòa giải thương lượng trên tinh thần tôn trọng quyền lợi của nhau. Nếu không thể thương thảo tự thỏa thuận, mọi tranh chấp sẽ được giải quyết tại {selectedContractForModal.disputeResolutionCourt || 'Tòa án nhân dân có thẩm quyền'} theo quy định của Bộ luật Tố tụng Dân sự 2015.</p>
                        </div>
                      </div>

                      {/* Điều 9 */}
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-slate-900 border-b pb-1">Điều 9: Điều khoản chung</h5>
                        <div className="text-xs text-slate-700 pl-4 space-y-1">
                          <p>1. Hợp đồng này có hiệu lực kể từ ngày ký chữ ký số và tự động thanh lý hợp đồng kể từ khi Bên B đã nhận đủ hàng và Bên A đã nhận đủ tiền.</p>
                          <p>2. Mọi sự bổ sung, sửa đổi hợp đồng này đều phải có sự đồng ý bằng văn bản của hai bên hoặc ký kết phụ lục hợp đồng thương mại điện tử liên kết.</p>
                          <p>3. Hợp đồng được thành lập dưới dạng tệp điện tử PDF định dạng chuẩn lưu trữ quốc gia, có giá trị pháp lý tương đương văn bản giấy thông thường.</p>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Signature Underlays conforming with state */}
                    <div className="flex justify-between items-center pt-8 border-t border-slate-200 font-sans">
                      <div className="text-center w-1/2 flex flex-col items-center">
                        <p className="text-[10px] font-black uppercase text-slate-400">Đại diện Bên bán (Bên A)</p>
                        {(selectedContractForModal.status === 'pending_super_admin' || selectedContractForModal.status === 'Chờ duyệt') ? (
                          <div className="text-xs italic text-slate-400 py-6 font-sans font-bold">Chưa ký số (Chờ Hợp tác xã ký)</div>
                        ) : (
                          <div className="my-2 border border-rose-500 rounded-xl bg-rose-50/70 p-2 text-center text-[10px] text-rose-600 font-bold max-w-xs relative flex flex-col gap-0.5 shadow-sm">
                            <span className="uppercase text-rose-700 block tracking-wider font-extrabold">ĐÃ KÝ SỐ CA</span>
                            <span className="font-mono">Ký bởi: {selectedContractForModal.seller?.name || selectedContractForModal.coopName || 'Chủ Tịch Hợp Tác xã'}</span>
                            <span>Thời gian: {new Date(selectedContractForModal.createdAt || new Date()).toLocaleDateString('vi-VN')}</span>
                            <span className="text-[9px] font-mono text-slate-500 font-normal">Mã sê-ri: Viettel-HSM-902A</span>
                          </div>
                        )}
                        <p className="text-xs font-bold text-slate-700 underline">{selectedContractForModal.seller?.rep || selectedContractForModal.sellerRep || 'Nguyễn Văn Hợp'}</p>
                      </div>

                      <div className="text-center w-1/2 flex flex-col items-center">
                        <p className="text-[10px] font-black uppercase text-slate-400">Đại diện Bên mua (Bên B)</p>
                        {selectedContractForModal.status === 'active' ? (
                          <div className="my-2 border border-emerald-500 rounded-xl bg-emerald-50/70 p-2 text-center text-[10px] text-emerald-600 font-bold max-w-xs relative flex flex-col gap-0.5 shadow-sm">
                            <span className="uppercase text-emerald-700 block tracking-wider font-extrabold">ĐÃ KÝ SỐ DOANH NGHIỆP</span>
                            <span className="font-mono">Ký bởi: {selectedContractForModal.buyer?.name || selectedContractForModal.enterpriseName || 'Doanh nghiệp'}</span>
                            <span>Thời gian: {new Date().toLocaleDateString('vi-VN')}</span>
                            <span className="text-[9px] font-mono text-slate-500 font-normal">Xác thực: FPT-CA-91A2</span>
                          </div>
                        ) : selectedContractForModal.status === 'signed' ? (
                          <div className="my-2 border-2 border-dashed border-rose-400 text-rose-500 px-4 py-3.5 rounded-2xl bg-rose-50/50 flex flex-col items-center gap-1.5 shadow-sm max-w-[150px] mx-auto">
                            <span className="text-[9px] font-black tracking-wider uppercase text-rose-500">CHƯA BÚT KÝ SỐ</span>
                            <button
                              type="button"
                              onClick={startDigitalSigningProcess}
                              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-black rounded-lg uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Zap size={10} /> KÝ CHỮ KÝ SỐ
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs italic text-slate-400 py-6 font-sans font-bold">Chưa ký số (Chờ Doanh nghiệp ký)</div>
                        )}
                        <p className="text-xs font-bold text-slate-700 underline">{selectedContractForModal.buyer?.rep || selectedContractForModal.buyerRep || 'Trần Văn Bảo'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer action block depending on signing status */}
              {signingStep === 'idle' && (
                <>
                  {selectedContractForModal.status === 'pending_super_admin' && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 px-8 rounded-b-[3rem]">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-amber-500" size={18} />
                        <span className="text-xs text-slate-500 font-bold">
                          Hợp đồng đang chờ đại diện Hợp tác xã (Bên bán) phê duyệt ký số trước. Doanh nghiệp sẽ có thể ký số sau khi bên bán hoàn tất.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <span className="px-4 py-2.5 bg-amber-50 text-amber-700 text-xs font-black uppercase tracking-wider rounded-xl border border-amber-200">
                          Chờ bên bán ký duyệt
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedContractForModal.status === 'Thương thảo' && (
                    <div className="p-6 bg-yellow-50 border-t border-yellow-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 px-8 rounded-b-[3rem]">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-yellow-600" size={18} />
                        <span className="text-xs text-slate-500 font-bold">
                          Ban quản trị Hợp tác xã đang đề xuất Thương thảo để điều chỉnh các điều khoản hợp đồng. Vui lòng liên hệ trực tiếp để thống nhất nội dung sửa đổi.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <span className="px-4 py-2.5 bg-yellow-100 text-yellow-700 text-xs font-black uppercase tracking-wider rounded-xl border border-yellow-200">
                          Đang thương thảo
                        </span>
                      </div>
                    </div>
                  )}

                  {(selectedContractForModal.status === 'Hợp đồng đã bị từ chối' || selectedContractForModal.status === 'rejected_super_admin' || selectedContractForModal.status === 'rejected') && (
                    <div className="p-6 bg-rose-50 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 px-8 rounded-b-[3rem]">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-rose-500" size={18} />
                        <span className="text-xs text-slate-500 font-bold">
                          Hợp đồng này đã bị Ban quản trị Từ chối phê duyệt. Quý khách vui lòng liên hệ trực tiếp hoặc tạo lại hồ sơ hợp đồng mới đúng quy chuẩn.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <span className="px-4 py-2.5 bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider rounded-xl border border-rose-200">
                          Bị từ chối
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedContractForModal.status === 'signed' && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 px-8 rounded-b-[3rem]">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-emerald-600" size={18} />
                        <span className="text-xs text-slate-500 font-bold">
                          Đại diện Bên bán đã ký số đóng dấu. Vui lòng duyệt và thực hiện ký điện tử của Doanh nghiệp bạn để hoàn thành hiệu lực hợp đồng.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <button
                          type="button"
                          onClick={startDigitalSigningProcess}
                          className="w-full sm:w-auto px-6 py-3 bg-[#004d40] hover:bg-emerald-800 text-white font-extrabold text-[#ffffff] text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Zap size={14} /> Ký số chữ ký điện tử
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedContractForModal.status === 'active' && (
                    <div className="p-6 bg-emerald-50/30 border-t border-emerald-100 flex flex-col gap-5 shrink-0 px-8 rounded-b-[3rem]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="text-[#004d40]" size={20} />
                          <span className="text-sm text-[#004d40] font-black uppercase tracking-wider">
                            Tiến độ thanh toán hợp đồng
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-500">
                          {selectedContractForModal.paidAmount === selectedContractForModal.totalVal ? (
                             <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14} /> Đã tất toán toàn bộ hợp đồng</span>
                          ) : (
                             <span>Dư nợ còn lại: <span className="text-rose-600 font-black ml-1">{((selectedContractForModal.totalVal || 0) - (selectedContractForModal.paidAmount || 0)).toLocaleString('vi-VN')} ₫</span></span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Đợt 1 */}
                        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 border border-slate-200 shadow-sm relative overflow-hidden">
                           <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                              <span>Đợt 1 ({selectedContractForModal.paymentPhase1 || '30%'})</span>
                              {selectedContractForModal.paidAmount > 0 ? (
                                <span className="text-emerald-600 uppercase flex items-center justify-center tracking-wider text-[10px] bg-emerald-50 px-2 py-1 rounded-md font-black border border-emerald-100">
                                  <CheckCircle2 size={12} className="mr-1" /> Đã thanh toán
                                </span>
                              ) : (
                                <span className="text-amber-600 uppercase tracking-wider text-[10px] bg-amber-50 px-2 py-1 rounded-md font-black border border-amber-100">Chờ thanh toán</span>
                              )}
                           </div>
                           <div className="text-lg font-black text-[#004d40]">
                              {((selectedContractForModal.totalVal * parseInt(selectedContractForModal.paymentPhase1 || '30', 10)) / 100).toLocaleString('vi-VN')} ₫
                           </div>
                           {selectedContractForModal.paidAmount === 0 && (
                             <button
                               onClick={() => {
                                 setSelectedContractForPayment(selectedContractForModal);
                                 setSelectedPhaseToPay('phase1');
                                 setShowPaymentModal(true);
                               }}
                               className="mt-1 w-full py-2.5 bg-white border-2 border-[#004d40] text-[#004d40] hover:bg-emerald-50 font-bold rounded-xl text-[11px] uppercase tracking-widest transition-colors cursor-pointer"
                             >
                               Thanh toán ngay
                             </button>
                           )}
                        </div>

                        {/* Đợt 2 */}
                        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 border border-slate-200 shadow-sm relative overflow-hidden">
                           <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                              <span>Đợt 2 ({selectedContractForModal.paymentPhase2 || '70%'})</span>
                              {((selectedContractForModal.totalVal || 0) - (selectedContractForModal.paidAmount || 0)) === 0 && selectedContractForModal.paidAmount > 0 ? (
                                <span className="text-emerald-600 uppercase flex items-center justify-center tracking-wider text-[10px] bg-emerald-50 px-2 py-1 rounded-md font-black border border-emerald-100">
                                  <CheckCircle2 size={12} className="mr-1" /> Đã thanh toán
                                </span>
                              ) : (
                                <span className="text-amber-600 uppercase tracking-wider text-[10px] bg-amber-50 px-2 py-1 rounded-md font-black border border-amber-100">Chờ thanh toán</span>
                              )}
                           </div>
                           <div className="text-lg font-black text-[#004d40]">
                              {((selectedContractForModal.totalVal * parseInt(selectedContractForModal.paymentPhase2 || '70', 10)) / 100).toLocaleString('vi-VN')} ₫
                           </div>
                           {selectedContractForModal.paidAmount > 0 && selectedContractForModal.paidAmount < selectedContractForModal.totalVal && (
                             <button
                               onClick={() => {
                                 setSelectedContractForPayment(selectedContractForModal);
                                 setSelectedPhaseToPay('phase2');
                                 setShowPaymentModal(true);
                               }}
                               className="mt-1 w-full py-2.5 bg-white border-2 border-[#004d40] text-[#004d40] hover:bg-emerald-50 font-bold rounded-xl text-[11px] uppercase tracking-widest transition-colors cursor-pointer"
                             >
                               Thanh toán ngay
                             </button>
                           )}
                           {selectedContractForModal.paidAmount === 0 && (
                             <button
                               disabled
                               className="mt-1 w-full py-2.5 bg-slate-50 border-2 border-slate-200 text-slate-400 font-bold rounded-xl text-[11px] uppercase tracking-widest cursor-not-allowed"
                             >
                               Thanh toán ngay (Đang khóa)
                             </button>
                           )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock Banking Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedContractForPayment && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative border border-slate-100 space-y-6 text-left font-sans text-slate-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <CreditCard size={18} />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-xs tracking-wider">Thanh toán công nợ B2B</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="w-8 h-8 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg flex items-center justify-center border border-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Payment Details info section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>HỢP ĐỒNG:</span>
                  <span className="text-slate-800 font-black font-mono">{selectedContractForPayment.contractNo}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500 font-sans">
                  <span>ĐỢT THANH TOÁN:</span>
                  <span className="text-emerald-600 font-extrabold uppercase font-sans">
                    Đợt {selectedPhaseToPay === 'phase1' ? `1 (${selectedContractForPayment.paymentPhase1 || '30%'})` : `2 (${selectedContractForPayment.paymentPhase2 || '70%'})`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200/60 font-sans">
                  <span className="text-xs font-black text-slate-800">SỐ TIỀN THANH TOÁN:</span>
                  <span className="text-lg font-black text-emerald-600 text-right">
                    {((selectedContractForPayment.totalVal * (parseInt(selectedPhaseToPay === 'phase1' ? (selectedContractForPayment.paymentPhase1 || '30') : (selectedContractForPayment.paymentPhase2 || '70'), 10)) / 100)).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              {/* Simulated QR Code Transfer or Bank Details */}
              <div className="text-center space-y-3 font-sans">
                <p className="text-[10px] text-slate-400 font-black tracking-wide uppercase">Quét mã QR VietQR / Chuyển khoản ngân hàng</p>
                
                {/* Visual Simulation of QR code */}
                <div className="w-40 h-40 bg-zinc-50 border-2 border-[#004d40]/10 rounded-2xl mx-auto flex flex-col items-center justify-center p-3 shadow-inner relative group overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-900/5 backdrop-blur-xs flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-300">
                    <span className="text-[9px] font-black text-[#004d40]">VIETAGRI SECURE</span>
                  </div>
                  {/* Styled mock vector QR grids */}
                  <div className="w-full h-full border border-slate-300/40 rounded-lg flex flex-col justify-between p-2 select-none">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-4 border-slate-800 rounded-sm" />
                      <div className="w-8 h-8 border-4 border-slate-800 rounded-sm" />
                    </div>
                    <div className="flex items-center justify-center text-[10px] font-black text-slate-800 font-sans">
                      Agribank B2B
                    </div>
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-4 border-slate-800 rounded-sm" />
                      <div className="w-6 h-6 bg-slate-800 rounded-xs" />
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-500 font-medium">
                  <p className="font-bold text-slate-700">Ngân hàng Nông nghiệp & Phát triển Nông thôn Việt Nam</p>
                  <p>Số tài khoản: <span className="font-bold text-slate-900 font-mono">999988887777</span></p>
                  <p>Chủ tài khoản: <span className="font-bold text-slate-900 uppercase">HTX CA PHE CAU DAT</span></p>
                </div>
              </div>

              {/* Confirmation Bridge */}
              <div className="pt-2 flex gap-3 text-center">
                <button 
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors border border-slate-100"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="button"
                  onClick={handleMockPayment}
                  className="flex-1 py-3 px-4 bg-[#004d40] text-white hover:bg-emerald-600 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/10 font-sans"
                >
                  Xác nhận đã trả
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
