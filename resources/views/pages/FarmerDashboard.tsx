import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sprout, 
  Map as MapIcon, 
  Calendar, 
  Bell, 
  Wallet, 
  TrendingUp, 
  LogOut, 
  Plus, 
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Navigation,
  Maximize,
  ChevronDown,
  Clock,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import authService from '../../services/authService';

const COOPERATIVES = [
  { id: 'HTX-001', name: 'HTX Cà phê Cầu Đất' },
  { id: 'HTX-002', name: 'HTX Hoa Đà Lạt' },
  { id: 'HTX-003', name: 'HTX Nông sản Đức Trọng' },
  { id: 'HTX-004', name: 'HTX Rừng Thông Lâm Đồng' },
  { id: 'HTX-005', name: 'HTX Công Nghệ Cao Q1' },
  { id: 'HTX-006', name: 'HTX Bình Thạnh Xanh' },
  { id: 'HTX-007', name: 'HTX Ba Đình Organic' },
  { id: 'HTX-008', name: 'HTX Hải Châu Nông Sản' },
  { id: 'HTX-009', name: 'HTX Cầu Giấy Xanh' },
  { id: 'HTX-010', name: 'HTX Thanh Khê Hải Sản' },
  { id: 'HTX-011', name: 'HTX Ninh Kiều Nông Sản' },
  { id: 'HTX-012', name: 'HTX Nông nghiệp Quận 2' },
  { id: 'HTX-013', name: 'HTX Công nghệ Thủ Đức' },
  { id: 'HTX-014', name: 'HTX Hoàn Kiếm Nông Sản' },
  { id: 'HTX-015', name: 'HTX Sơn Trà Hải Sản' },
  { id: 'HTX-016', name: 'HTX Cái Răng Nông Sản' },
];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'crops' | 'harvest' | 'receipts' | 'wallet'>('overview');
  const [farmerName, setFarmerName] = useState('Thành viên HTX');
  const [currentFarmerPhone, setCurrentFarmerPhone] = useState('');
  const [farmerCooperative, setFarmerCooperative] = useState('HTX Cà phê Cầu Đất');
  const [farmerCooperativeId, setFarmerCooperativeId] = useState('HTX-001');
  const [scheduledHarvests, setScheduledHarvests] = useState<any[]>([]);
  const [contractsList, setContractsList] = useState<any[]>([]);
  const [allContractsList, setAllContractsList] = useState<any[]>([]);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const [isContractsExpanded, setIsContractsExpanded] = useState(true);
  const [detailsModal, setDetailsModal] = useState<any>(null);
  const [deliveryModal, setDeliveryModal] = useState<any>(null);
  const formatDateSafe = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date.toLocaleDateString('vi-VN');
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const d = parseInt(parts[0]);
            const m = parseInt(parts[1]) - 1;
            const y = parseInt(parts[2]);
            const cDate = new Date(y, m, d);
            if (!isNaN(cDate.getTime())) return cDate.toLocaleDateString('vi-VN');
        }
    }
    return dateStr;
  };
  const [deliveryData, setDeliveryData] = useState({
    actualQty: '',
    deliveryTurn: '1',
    actualDate: new Date().toLocaleDateString('vi-VN'),
    actualValue: '',
    note: ''
  });

  const handleConfirmDelivery = () => {
    if (!deliveryModal) return;
    
    const deliveryRecord = {
      id: `DLV-${Date.now()}`,
      harvestId: deliveryModal.id,
      farmer: farmerName,
      farmerPhone: currentFarmerPhone,
      product: deliveryModal.product,
      plannedQty: deliveryModal.qty,
      actualQty: deliveryData.actualQty || deliveryModal.qty,
      deliveryTurn: deliveryData.deliveryTurn,
      actualDate: deliveryData.actualDate,
      actualValue: deliveryData.actualValue || deliveryModal.totalValue,
      note: deliveryData.note,
      status: 'Chờ QC',
      cooperativeId: farmerCooperativeId,
      timestamp: new Date().toISOString()
    };

    // Save to pending QC deliveries for Admin
    const pendingRaw = localStorage.getItem('vietagri_pending_qc_deliveries');
    const pendingDeliveries = pendingRaw ? JSON.parse(pendingRaw) : [];
    localStorage.setItem('vietagri_pending_qc_deliveries', JSON.stringify([deliveryRecord, ...pendingDeliveries]));

    // Update harvest schedule status locally
    const updatedSchedules = scheduledHarvests.map((s: any) => 
      s.id === deliveryModal.id ? {...s, status: 'delivered', isDelivered: true} : s
    );
    setScheduledHarvests(updatedSchedules);

    // Update global admin list
    const saved = localStorage.getItem('vietagri_harvest_schedules');
    if (saved) {
        const all = JSON.parse(saved);
        const newAll = all.map((s: any) => 
            s.id === deliveryModal.id ? {...s, status: 'delivered', isDelivered: true} : s
        );
        localStorage.setItem('vietagri_harvest_schedules', JSON.stringify(newAll));
    }

    alert('Đã gửi thông tin giao hàng thành công! Đang chờ bộ phận QC kiểm định.');
    setDeliveryModal(null);
    setDeliveryData({
        actualQty: '',
        deliveryTurn: '1',
        actualDate: new Date().toLocaleDateString('vi-VN'),
        actualValue: '',
        note: ''
    });
  };
  const confirmHarvest = (id: string) => {
    const updatedSchedules = scheduledHarvests.map((s: any) => s.id === id ? {...s, confirmed: true} : s);
    setScheduledHarvests(updatedSchedules);

    // Update global admin list
    const saved = localStorage.getItem('vietagri_harvest_schedules');
    if (saved) {
        const all = JSON.parse(saved);
        const newAll = all.map((s: any) => s.id === id ? {...s, confirmed: true} : s);
        localStorage.setItem('vietagri_harvest_schedules', JSON.stringify(newAll));
    }
    setDetailsModal(null);
  };

  useEffect(() => {
    if (!localStorage.getItem('vietagri_has_cleared_test_data')) {
        const keysToClear = [
            'pending_registration_members',
            'vietagri_active_farmers',
            'vietagri_contracts',
            'vietagri_contracts_v2',
            'vietagri_contracts_v3',
            'vietagri_farmer_requests'
        ];
        keysToClear.forEach(key => localStorage.removeItem(key));
        localStorage.setItem('vietagri_has_cleared_test_data', 'true');
        window.location.reload();
    }
  }, []);

  useEffect(() => {
    const checkPasswordStatus = async () => {
      const { data: user } = await authService.me();
      if (user && user.role !== 'customer' && user.passwordChanged === false) {
          navigate('/farmer/change-password');
          return;
      }
    };
    checkPasswordStatus();

    const phone = localStorage.getItem('userPhone') || '';
    setCurrentFarmerPhone(phone);
    let name = 'Thành viên HTX';
    let coopName = 'HTX Cà phê Cầu Đất';
    let coopId = 'HTX-001';
    if (phone === '001') {
        name = 'Lê Văn Tám';
        coopName = 'HTX Cà phê Cầu Đất';
        coopId = 'HTX-001';
    } else {
        const savedAdmins = localStorage.getItem('registered_admins');
        const parsedAdmins = savedAdmins ? JSON.parse(savedAdmins) : [];
        const foundUser = parsedAdmins.find((u: any) => u.phone === phone);
        if (foundUser) {
            name = foundUser.name;
            coopId = foundUser.cooperativeId || 'HTX-001';
            const userHtx = COOPERATIVES.find(c => c.id === foundUser.cooperativeId);
            if (userHtx) {
                coopName = userHtx.name;
            }
        }
    }
    setFarmerName(name);
    setFarmerCooperative(coopName);
    setFarmerCooperativeId(coopId);

    // Fetch schedules
    const savedSchedules = localStorage.getItem('vietagri_harvest_schedules');
    if (savedSchedules) {
        const allSchedules = JSON.parse(savedSchedules);
        setScheduledHarvests(allSchedules.filter((s: any) => s.farmer === name));
    }

    // Fetch contracts
    const rawV3 = localStorage.getItem('vietagri_contracts_v3');
    const rawV2 = localStorage.getItem('vietagri_contracts_v2');
    let allContracts: any[] = [];
    try {
        if (rawV3) allContracts = [...allContracts, ...JSON.parse(rawV3)];
        if (rawV2) allContracts = [...allContracts, ...JSON.parse(rawV2)];
        
        // Remove duplicates by ID, keeping the most advanced status
        const uniqueContractsMap: Record<string, any> = {};
        allContracts.forEach((c) => {
            if (!c || !c.id) return;
            const existing = uniqueContractsMap[c.id];
            if (!existing) {
                uniqueContractsMap[c.id] = c;
            } else {
                const completedStatuses = ['completed', 'signed', 'active', 'Đã hoàn tất', 'fully_signed'];
                if (completedStatuses.includes(c.status) && !completedStatuses.includes(existing.status)) {
                    uniqueContractsMap[c.id] = c;
                } else if (c.status === 'awaiting_admin_signature' || c.status === 'Đang chờ ký (Admin)') {
                    if (existing.status === 'awaiting_signature' || existing.status === 'Chờ ký') {
                        uniqueContractsMap[c.id] = c;
                    }
                }
            }
        });
        const uniqueContracts = Object.values(uniqueContractsMap);

        // Filter by farmer phone (Party A)
        // Fuzzy match phone
        const farmerContracts = uniqueContracts.filter((c: any) => {
            const sellerPhone = String(c.seller?.phone || c.phone || '').replace(/^0+/, '');
            const myPhone = phone.replace(/^0+/, '');
            return sellerPhone === myPhone && myPhone !== '';
        });
        
        setContractsList(farmerContracts);
        setAllContractsList(uniqueContracts);
    } catch (e) {
        console.error("Error loading contracts:", e);
    }
  }, [dataRefreshKey]);
  
  // Crops List State
  const [cropsList, setCropsList] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const calculateTotalArea = () => {
    let total = 0;
    cropsList.forEach(crop => {
      if (crop.isRejected) return;
      const areaStr = crop.area || '';
      const match = areaStr.match(/(\d+\.?\d*)\s*ha/);
      if (match) {
        total += parseFloat(match[1]);
      } else {
        const m2Match = areaStr.match(/(\d+,?\d*)\s*m²/);
        if (m2Match) {
          total += parseFloat(m2Match[1].replace(/,/g, '')) / 10000;
        }
      }
    });
    return total > 0 ? total.toFixed(1) : '0.0';
  };

  useEffect(() => {
    const handleDataUpdate = () => {
        setDataRefreshKey(prev => prev + 1);
    };
    window.addEventListener('vietagri_data_updated', handleDataUpdate);
    return () => window.removeEventListener('vietagri_data_updated', handleDataUpdate);
  }, []);

  useEffect(() => {
    const phone = localStorage.getItem('userPhone') || '';
    console.log("DEBUG: Current Phone:", phone);
    
    // Initial static list to preserve visual feel
    const baseList: any[] = [];

    // 1. First load pending, rejected, and approved crops/reports inside pending_registration_members
    const rawPending = localStorage.getItem('pending_registration_members');
    
    if (rawPending) {
        try {
            const pendingItems = JSON.parse(rawPending);
            // Show any crop registrations or reports matching this farmer's phone
            // Use fuzzy phone match
            const myPendingCrops = pendingItems.filter((m: any) => 
                (m.type === 'crop_approval' || m.type === 'crop_report') && 
                String(m.phone || '').replace(/^0+/, '') === String(phone).replace(/^0+/, '') &&
                m.status !== 'rejected' // Keep approved and pending
            );
            
            myPendingCrops.forEach((c: any) => {
                 const cropName = c.cropName || c.name || '';
                 const existingIdx = baseList.findIndex((b: any) => b.name.toLowerCase() === cropName.toLowerCase());
                 
                 if (existingIdx !== -1) {
                    baseList[existingIdx] = {
                        ...baseList[existingIdx],
                        seasonApprovalCode: c.seasonApprovalCode || baseList[existingIdx].seasonApprovalCode,
                        postHarvestAction: c.postHarvestAction || baseList[existingIdx].postHarvestAction,
                        seasonNumber: c.seasonNumber || baseList[existingIdx].seasonNumber || 1,
                        status: c.cropStatus || c.status || baseList[existingIdx].status,
                        expectedYield: c.expectedYield || baseList[existingIdx].expectedYield || '',
                        yieldUnit: c.yieldUnit || baseList[existingIdx].yieldUnit || 'tấn'
                    };
                 } else {
                    baseList.push({
                        id: c.id || `pending-${c.phone}-${cropName}`,
                        name: cropName,
                        type: c.cropType || (cropName.includes('Tiêu') ? 'fruit' : 'veggie'),
                        area: c.area,
                        status: c.cropStatus || c.status || 'cultivating',
                        growthStage: c.growthStage || 'Phát triển',
                        health: c.health || 'Bình thường',
                        plantingDate: c.plantingDate,
                        expectedHarvestDate: c.expectedHarvestDate,
                        expectedYield: c.expectedYield || '',
                        yieldUnit: c.yieldUnit || 'tấn',
                        seasonApprovalCode: c.seasonApprovalCode,
                        postHarvestAction: c.postHarvestAction,
                        seasonNumber: c.seasonNumber || 1,
                        farmerPhone: String(c.phone),
                        isPending: c.status === 'pending',
                        isApproved: c.status === 'approved',
                        isRejected: c.status === 'rejected',
                        diary: c.diary || []
                     });
                 }
            });
        } catch (e) {
            console.error("Error parsing/loading pending crop approvals", e);
        }
    }

    // 2. Also load crops stored under the farmer's profile in active farmers
    const savedFarmersRaw = localStorage.getItem('vietagri_active_farmers');
    
    if (savedFarmersRaw) {
        try {
            const farmersList = JSON.parse(savedFarmersRaw);
            // Fuzzy phone match
            const myProfile = farmersList.find((f: any) => String(f.phone).replace(/^0+/, '') === String(phone).replace(/^0+/, ''));
            
            if (myProfile && myProfile.crops) {
                myProfile.crops.forEach((c: any, index: number) => {
                    // Check if it already exists in baseList
                    const existingIdx = baseList.findIndex((b: any) => b.name.toLowerCase() === c.name.toLowerCase());
                    
                    if (existingIdx !== -1) {
                        // Merge update onto existing base crop
                        baseList[existingIdx] = {
                            ...baseList[existingIdx],
                            status: c.status || baseList[existingIdx].status,
                            isPending: false,
                            isApproved: true,
                            isRejected: false,
                            growthStage: c.growthStage || baseList[existingIdx].growthStage,
                            health: c.health || baseList[existingIdx].health,
                            plantingDate: c.plantingDate || baseList[existingIdx].plantingDate,
                            expectedHarvestDate: c.expectedHarvestDate || baseList[existingIdx].expectedHarvestDate,
                            expectedYield: c.expectedYield || baseList[existingIdx].expectedYield || '',
                            yieldUnit: c.yieldUnit || baseList[existingIdx].yieldUnit || 'tấn',
                            seasonApprovalCode: c.seasonApprovalCode || baseList[existingIdx].seasonApprovalCode,
                            postHarvestAction: c.postHarvestAction || baseList[existingIdx].postHarvestAction,
                            seasonNumber: c.seasonNumber || baseList[existingIdx].seasonNumber || 1,
                            diary: c.diary || baseList[existingIdx].diary || []
                        };
                    } else {
                        // Add as new crop
                        baseList.push({
                            id: c.id || `active-${phone}-${c.name}`,
                            name: c.name,
                            type: c.type === 'short-term' ? 'veggie' : 'fruit',
                            area: c.area,
                            status: c.status || 'cultivating',
                            growthStage: c.growthStage || 'Phát triển',
                            health: c.health || 'Bình thường',
                            plantingDate: c.plantingDate,
                            expectedHarvestDate: c.expectedHarvestDate,
                            expectedYield: c.expectedYield || '',
                            yieldUnit: c.yieldUnit || 'tấn',
                            seasonApprovalCode: c.seasonApprovalCode,
                            postHarvestAction: c.postHarvestAction,
                            seasonNumber: c.seasonNumber || 1,
                            farmerPhone: phone,
                            isPending: false,
                            isRejected: false,
                            isApproved: true,
                            diary: c.diary || []
                        });
                    }
                });
            }
        } catch (e) {
            console.error("Error parsing active farmers crops", e);
        }
    }

    setCropsList(phone === '001' ? baseList : baseList.filter(c => c.farmerPhone === phone || c.farmerPhone === '001'));
  }, [currentFarmerPhone, isUpdateModalOpen, dataRefreshKey]);

  // Selected Crop for Update Modal
  const [selectedCrop, setSelectedCrop] = useState<any>(null);

  // Keep selectedCrop in sync with cropsList
  useEffect(() => {
    if (isUpdateModalOpen && selectedCrop) {
      // Find matching crop using name and phone or ID
      const updated = cropsList.find(c => 
        (selectedCrop.id && c.id === selectedCrop.id) || 
        (c.name.toLowerCase() === selectedCrop.name.toLowerCase() && 
         String(c.farmerPhone || '').replace(/^0+/, '') === String(selectedCrop.farmerPhone || '').replace(/^0+/, ''))
      );
      
      if (updated && (updated.seasonApprovalCode !== selectedCrop.seasonApprovalCode || updated.status !== selectedCrop.status)) {
        console.log('Syncing selectedCrop with updated cropsList data', updated.seasonApprovalCode);
        setSelectedCrop(updated);
      }
    }
  }, [cropsList, isUpdateModalOpen]);
  const [selectedCropForDiary, setSelectedCropForDiary] = useState<any>(null);
  const [newDiaryEntry, setNewDiaryEntry] = useState({ date: new Date().toISOString().split('T')[0], type: 'checkup', description: '' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteCropId, setDeleteCropId] = useState<string | number | null>(null);

  const handleAddDiaryEntry = () => {
    if (!newDiaryEntry.date || !newDiaryEntry.description) {
        alert('Vui lòng chọn ngày và nhập nội dung!');
        return;
    }
    const entryToAdd = { ...newDiaryEntry };
    setCropsList(prev => prev.map(c => 
        c.id === selectedCropForDiary.id ? { ...c, diary: [entryToAdd, ...c.diary] } : c
    ));
    setSelectedCropForDiary((prev: any) => ({ ...prev, diary: [entryToAdd, ...prev.diary] }));
    setNewDiaryEntry({ date: new Date().toISOString().split('T')[0], type: 'checkup', description: '' });
  };
  // Financial request states
  const [selectedRequest, setSelectedRequest] = useState<string>('');
  const [customRequest, setCustomRequest] = useState('');

  // Detail request states
  const [seedRequestDetails, setSeedRequestDetails] = useState({
    variety: '', // Tên giống cây/Loại giống
    qty: '', // Số lượng yêu cầu
    unit: 'Bầu', // Đơn vị tính
    area: '', // Diện tích dự kiến trồng
    areaUnit: 'ha', // Đơn vị diện tích
    expectedDate: '' // Ngày mong muốn nhận
  });

  const [fertilizerRequestDetails, setFertilizerRequestDetails] = useState({
    type: '', // Loại phân bón
    brand: '', // Thương hiệu/Nhà sản xuất
    qty: '', // Khối lượng cần cấp
    unit: 'Bao (50kg)', // Đơn vị tính
    stage: '' // Giai đoạn bón phân
  });

  const [pesticideRequestDetails, setPesticideRequestDetails] = useState({
    type: '', // Loại thuốc/Công dụng
    reason: '', // Tình trạng thực tế
    image: null as string | null // Hình ảnh (base64)
  });

  const handleSendRequest = () => {
      if (!selectedRequest && !customRequest) {
          alert('Vui lòng chọn hoặc nhập yêu cầu!');
          return;
      }
      
      let finalCustomText = customRequest;
      
      if (selectedRequest === 'Cấp cây giống') {
          finalCustomText += `\n\n📌 [CHI TIẾT CẤP CÂY GIỐNG]\n- Giống: ${seedRequestDetails.variety}\n- Số lượng: ${seedRequestDetails.qty} ${seedRequestDetails.unit}\n- Diện tích dự kiến: ${seedRequestDetails.area ? `${seedRequestDetails.area} ${seedRequestDetails.areaUnit}` : ''}\n- Ngày mong muốn nhận: ${seedRequestDetails.expectedDate}`;
      }
      if (selectedRequest === 'Cấp phân bón') {
          finalCustomText += `\n\n📌 [CHI TIẾT CẤP PHÂN BÓN]\n- Loại phân: ${fertilizerRequestDetails.type}\n- Thương hiệu: ${fertilizerRequestDetails.brand}\n- Khối lượng: ${fertilizerRequestDetails.qty} ${fertilizerRequestDetails.unit}\n- Giai đoạn bón: ${fertilizerRequestDetails.stage}`;
      }
      if (selectedRequest === 'Cấp thuốc BVTV') {
          finalCustomText += `\n\n📌 [CHI TIẾT CẤP THUỐC BVTV]\n- Loại thuốc/Công dụng: ${pesticideRequestDetails.type}\n- Tình trạng thực tế: ${pesticideRequestDetails.reason}${pesticideRequestDetails.image ? '\n- [Có kèm hình ảnh thực tế]' : ''}`;
      }

      const request = {
          id: Date.now(),
          farmer: farmerName,
          requests: selectedRequest ? [selectedRequest] : [],
          custom: finalCustomText.trim(),
          image: pesticideRequestDetails.image, // pass image along if needed
          status: 'pending',
          timestamp: new Date().toISOString()
      };
      const raw = localStorage.getItem('vietagri_farmer_requests');
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem('vietagri_farmer_requests', JSON.stringify([...list, request]));
      alert('Yêu cầu đã được gửi thành công!');
      setSelectedRequest('');
      setCustomRequest('');
      setSeedRequestDetails({ variety: '', qty: '', unit: 'Bầu', area: '', areaUnit: 'ha', expectedDate: '' });
      setFertilizerRequestDetails({ type: '', brand: '', qty: '', unit: 'Bao (50kg)', stage: '' });
      setPesticideRequestDetails({ type: '', reason: '', image: null });
  };

  // Selected Crop for Update Modal
  const [newCrop, setNewCrop] = useState({
    type: '',
    variety: '',
    area: '',
    unit: '',
    coordinates: '',
    status: 'planned',
    growthStage: '',
    cancelReason: '',
    plantingDate: '',
    expectedHarvestDate: '',
    expectedYield: '',
    yieldUnit: 'tấn'
  });

  const handleConfirmCrop = () => {
    if (!newCrop.type || !newCrop.variety || !newCrop.area || !newCrop.unit) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Loại, Giống, Diện tích)');
      return;
    }

    if (newCrop.status === 'cancelled' && !newCrop.cancelReason) {
      alert('Vui lòng nhập lý do tạm dừng/hủy');
      return;
    }

    const cropEntry = {
      id: Date.now(),
      type: 'crop_approval',
      name: farmerName, // Farmer name
      phone: currentFarmerPhone, // Farmer phone
      cooperativeId: farmerCooperativeId || 'HTX-001', // We need to grab this from somewhere, let's see what variables we have 
      cropName: newCrop.variety,
      cropType: newCrop.type,
      area: getConvertedArea() || `${newCrop.area} ${newCrop.unit}`,
      status: 'pending',
      cropStatus: newCrop.status,
      growthStage: newCrop.growthStage || (newCrop.status === 'planned' ? 'Dự kiến' : 'N/A'),
      health: newCrop.status === 'cancelled' ? 'Ngưng' : 'Bình thường',
      plantingDate: newCrop.plantingDate,
      expectedHarvestDate: newCrop.expectedHarvestDate,
      expectedYield: newCrop.expectedYield,
      yieldUnit: newCrop.yieldUnit,
      seasonNumber: 1,
      createdAt: new Date().toISOString()
    };

    const rawPending = localStorage.getItem('pending_registration_members');
    let parsedPending = rawPending ? JSON.parse(rawPending) : [];
    parsedPending.push(cropEntry);
    localStorage.setItem('pending_registration_members', JSON.stringify(parsedPending));

    // Update cropsList state immediately
    const newCropItem = {
      id: cropEntry.id,
      name: cropEntry.cropName,
      type: cropEntry.cropType,
      area: cropEntry.area,
      status: cropEntry.cropStatus,
      growthStage: cropEntry.growthStage,
      health: cropEntry.health,
      plantingDate: cropEntry.plantingDate,
      expectedHarvestDate: cropEntry.expectedHarvestDate,
      expectedYield: cropEntry.expectedYield,
      yieldUnit: cropEntry.yieldUnit,
      farmerPhone: cropEntry.phone,
      isPending: true,
      isRejected: false,
      diary: []
    };
    setCropsList(prev => [...prev, newCropItem]);

    alert('✅ Đã gửi yêu cầu thêm cây trồng mới! Vui lòng chờ HTX phê duyệt.');
    
    setIsAddModalOpen(false);
    
    // Reset state
    setNewCrop({
      type: '',
      variety: '',
      area: '',
      unit: '',
      coordinates: '',
      status: 'planned',
      growthStage: '',
      cancelReason: '',
      plantingDate: '',
      expectedHarvestDate: '',
      expectedYield: '',
      yieldUnit: 'tấn'
    });
  };

  const handleDeleteCrop = () => {
    if (deleteCropId) {
      const rawPending = localStorage.getItem('pending_registration_members');
      if (rawPending) {
        const pendingItems = JSON.parse(rawPending);
        const updatedPending = pendingItems.filter((m: any) => m.id !== deleteCropId);
        localStorage.setItem('pending_registration_members', JSON.stringify(updatedPending));
      }
      setCropsList(prev => prev.filter(c => c.id !== deleteCropId));
      setDeleteCropId(null);
      alert('Đã xóa thành công!');
    }
  };

  const getStatusDisplay = (status: string) => {
    const map: Record<string, { label: string, style: string }> = {
      planned: { label: 'Dự kiến', style: 'bg-blue-50 text-blue-600' },
      cultivating: { label: 'Đang canh tác', style: 'bg-emerald-50 text-emerald-600' },
      harvested: { label: 'Đã thu hoạch', style: 'bg-slate-100 text-slate-500' },
      cancelled: { label: 'Tạm dừng/Hủy', style: 'bg-red-50 text-red-500' }
    };
    return map[status] || { label: status, style: 'bg-slate-50 text-slate-500' };
  };

  const isCropMatchingContract = (cropName: string, contractCropName: string) => {
    const cName = (contractCropName || '').toLowerCase().trim();
    const crName = (cropName || '').toLowerCase().trim();
    if (cName === crName || crName.includes(cName) || cName.includes(crName)) {
      return true;
    }
    
    // Flexible match by identifying keywords (e.g. "cà phê", "sầu riêng", "lúa", "dâu tây", "trà", "chè", "rau", "xà lách", "hoa")
    const cropKeywords = ['cà phê', 'sầu riêng', 'lúa', 'dâu tây', 'rau', 'xà lách', 'chè', 'hoa', 'cúc', 'hồng'];
    for (const kw of cropKeywords) {
      if (cName.includes(kw) && crName.includes(kw)) {
        return true;
      }
    }
    return false;
  };

  const hasCropContractCover = (cropName: string) => {
    const myPhone = currentFarmerPhone.replace(/^0+/, '');
    const completedStatuses = ['completed', 'signed', 'active', 'Đã hoàn tất', 'fully_signed', 'in_progress', 'Đang thực hiện'];
    const listToCheck = allContractsList.length > 0 ? allContractsList : contractsList;

    return listToCheck.some(c => {
      const contractCropName = c.cropName || c.product || c.crop || '';
      const isMatched = isCropMatchingContract(cropName, contractCropName);
      if (!isMatched) return false;

      const isStatusValid = completedStatuses.includes(c.status);
      if (!isStatusValid) return false;

      const sellerPhone = String(c.seller?.phone || c.phone || '').replace(/^0+/, '');
      const isMyIndividual = sellerPhone === myPhone && myPhone !== '';

      const isMyCoop = (c.cooperativeId && c.cooperativeId === farmerCooperativeId) || 
                       (c.seller?.id && c.seller?.id === farmerCooperativeId) ||
                       (c.buyer?.id && c.buyer?.id === farmerCooperativeId) ||
                       (farmerCooperative && (
                         (c.coopName && c.coopName.trim().toLowerCase() === farmerCooperative.trim().toLowerCase()) ||
                         (c.seller?.name && c.seller?.name.trim().toLowerCase() === farmerCooperative.trim().toLowerCase())
                       ));

      return isMyIndividual || isMyCoop;
    });
  };

  const getCropDynamicStatus = (crop: any) => {
    if (crop.isRejected) {
      return { label: 'Bị từ chối', style: 'bg-red-50 text-red-600' };
    }
    if (crop.isPending) {
      return { label: 'Chờ duyệt', style: 'bg-amber-50 text-amber-600' };
    }
    
    const listToCheck = allContractsList.length > 0 ? allContractsList : contractsList;
    const cropContract = listToCheck.find(c => {
      const contractCropName = c.cropName || c.product || c.crop || '';
      const isMatched = isCropMatchingContract(crop.name, contractCropName);
      if (!isMatched) return false;

      const sellerPhone = String(c.seller?.phone || c.phone || '').replace(/^0+/, '');
      const myPhone = currentFarmerPhone.replace(/^0+/, '');
      const isMyIndividual = sellerPhone === myPhone && myPhone !== '';

      const isMyCoop = (c.cooperativeId && c.cooperativeId === farmerCooperativeId) || 
                       (c.seller?.id && c.seller?.id === farmerCooperativeId) ||
                       (c.buyer?.id && c.buyer?.id === farmerCooperativeId) ||
                       (farmerCooperative && (
                         (c.coopName && c.coopName.trim().toLowerCase() === farmerCooperative.trim().toLowerCase()) ||
                         (c.seller?.name && c.seller?.name.trim().toLowerCase() === farmerCooperative.trim().toLowerCase())
                       ));

      return isMyIndividual || isMyCoop;
    });

    if (crop.isApproved) {
      if (cropContract) {
        if (cropContract.status === 'awaiting_signature' || cropContract.status === 'awaiting_farmer_signature') {
          return { label: 'Đang chờ ký', style: 'bg-amber-100 text-amber-600 font-bold animate-pulse' };
        }
        if (cropContract.status === 'awaiting_admin_signature' || cropContract.status === 'Đang chờ ký (Admin)') {
          return { label: 'Đang xử lý', style: 'bg-blue-100 text-blue-700 font-bold' };
        }
        const completedStatuses = ['completed', 'signed', 'active', 'Đã hoàn tất', 'fully_signed', 'in_progress', 'Đang thực hiện'];
        if (completedStatuses.includes(cropContract.status)) {
          return { label: 'Bình thường', style: 'bg-emerald-100 text-emerald-700 font-bold' };
        }
      } else {
        return { label: 'Bình thường', style: 'bg-emerald-50 text-emerald-600' };
      }
    }
    
    return getStatusDisplay(crop.status);
  };

  const isCropActionDisabled = (crop: any) => {
    if (crop.isPending) return true;
    if (crop.isRejected) return true;
    
    return false;
  };

  const getCropHeaderBadge = (crop: any) => {
    if (crop.isRejected) {
      return { label: 'Không đồng ý', style: 'bg-red-50 text-red-500' };
    }
    if (crop.isPending) {
      return { label: 'Chờ duyệt', style: 'bg-amber-50 text-amber-500' };
    }
    
    if (crop.isApproved) {
      return { label: 'Bình thường', style: 'bg-emerald-50 text-[#059669]' };
    }
    
    if (crop.health && crop.health.includes('Cảnh báo')) {
      return { label: crop.health, style: 'bg-red-50 text-red-500' };
    }
    
    return { label: 'Bình thường', style: 'bg-emerald-50 text-[#059669]' };
  };

  const GROWTH_STAGES_MAP: Record<string, string[]> = {
    rice: ['Gieo sạ', 'Đẻ nhánh', 'Làm đòng', 'Trổ bông', 'Chín/Thu hoạch'],
    veggie: ['Gieo hạt', 'Cây con', 'Phát triển lá/thân', 'Thu hoạch'],
    fruit: ['Kiến thiết (Cây nhỏ)', 'Ra hoa', 'Đậu quả', 'Nuôi trái', 'Thu hoạch', 'Phục hồi'],
    durian: ['Kiến thiết (Cây nhỏ)', 'Ra hoa', 'Đậu quả', 'Nuôi trái', 'Thu hoạch', 'Phục hồi'],
    coffee: ['Kiến thiết (Cây nhỏ)', 'Ra hoa', 'Đậu quả', 'Nuôi trái', 'Thu hoạch', 'Phục hồi'],
    pepper: ['Kiến thiết (Cây nhỏ)', 'Ra hoa', 'Đậu quả', 'Nuôi trái', 'Thu hoạch', 'Phục hồi']
  };

  const VARIETIES_MAP: Record<string, string[]> = {
    rice: ['Lúa ST25', 'Lúa OM5451', 'Lúa OM18', 'Lúa Đài thơm 8'],
    coffee: ['Cà phê Robusta', 'Cà phê Cherry (Mít)', 'Cà phê Culi'],
    durian: ['Sầu riêng Ri6', 'Sầu riêng Monthong (Dona)', 'Sầu riêng Musang King', 'Sầu riêng Chuồng Bò'],
    pepper: ['Tiêu Vĩnh Linh', 'Tiêu Lộc Ninh', 'Tiêu Sẻ'],
    veggie: ['Cải ngọt', 'Cải bẹ xanh', 'Xà lách thủy canh', 'Cà chua bi'],
    fruit: ['Xoài Cát Hòa Lộc', 'Bưởi Da Xanh', 'Thanh Long ruột đỏ', 'Nhãn Xuồng']
  };

  const getGrowthStages = () => {
    return GROWTH_STAGES_MAP[newCrop.type] || [];
  };

  const getVarieties = () => {
    return VARIETIES_MAP[newCrop.type] || [];
  };
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewCrop(prev => ({
            ...prev,
            coordinates: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập vị trí trên trình duyệt.");
          setIsGettingLocation(false);
        }
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ định vị.");
      setIsGettingLocation(false);
    }
  };

  const getConvertedArea = () => {
    const value = parseFloat(newCrop.area);
    if (isNaN(value)) return null;

    let inM2 = 0;
    if (newCrop.unit === 'cong') inM2 = value * 1000;
    else if (newCrop.unit === 'mau') inM2 = value * 10000;
    else inM2 = value * 10000; // ha

    if (newCrop.unit === 'ha') return `${value} ha`;
    return `${inM2.toLocaleString()} m² (${(inM2 / 10000).toFixed(2)} ha)`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans pb-20 lg:pb-0">
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col fixed inset-y-0 left-0">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#059669] rounded-lg flex items-center justify-center text-white">
              <span className="font-black text-xl">V</span>
            </div>
            <span className="text-xl font-black tracking-widest text-[#059669]">VIETAGRI</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {[
            { id: 'overview', label: 'Tổng quan', icon: <TrendingUp size={20} /> },
            { id: 'crops', label: 'Cây trồng', icon: <Sprout size={20} /> },
            { id: 'harvest', label: 'Thu hoạch', icon: <Calendar size={20} /> },
            { id: 'receipts', label: 'Bảng kê', icon: <CheckCircle2 size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-[#059669] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-[#059669]'
              }`}
            >
              {item.icon}
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => {
              localStorage.removeItem('userRole');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userPhone');
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 p-4 text-slate-400 hover:text-red-500 transition-colors font-bold text-sm"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-between p-2 z-50">
        {[
          { id: 'overview', label: 'Tổng quan', icon: <TrendingUp size={24} /> },
          { id: 'crops', label: 'Cây trồng', icon: <Sprout size={24} /> },
          { id: 'harvest', label: 'Thu hoạch', icon: <Calendar size={24} /> },
          { id: 'receipts', label: 'Bảng kê', icon: <CheckCircle2 size={24} /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl flex-1 ${
              activeTab === item.id ? 'text-[#059669]' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">VIETAGRI</h2>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-emerald-700 transition-colors">
              <Bell size={22} />
            </button>
            <div 
              onClick={() => navigate('/farmer/profile')}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
              title="Xem thông tin cá nhân"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800">{farmerName}</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{farmerCooperative}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm">
                XV
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">

          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Stats Bar */}
              <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6">
                <motion.div whileHover={{ y: -5 }} className="bg-white p-3 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shrink-0"><MapIcon size={18} /></div>
                  <div className="min-w-0">
                    <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-1 truncate">Diện tích sản xuất</p>
                    <p className="text-base md:text-2xl font-black text-slate-800">{calculateTotalArea()} ha</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-white p-3 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#004d40] text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shrink-0"><Sprout size={18} /></div>
                  <div className="min-w-0">
                    <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-1 truncate">Sản lượng vụ trước</p>
                    <p className="text-base md:text-2xl font-black text-slate-800">4.2 Tấn</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-white p-3 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shrink-0"><Wallet size={18} /></div>
                  <div className="min-w-0">
                    <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-1 truncate">Lợi nhuận tích lũy</p>
                    <p className="text-base md:text-2xl font-black text-slate-800">125M VNĐ</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-white p-3 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shrink-0"><Bell size={18} /></div>
                  <div className="min-w-0">
                    <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-1 truncate">Thông báo kỹ thuật</p>
                    <p className="text-base md:text-2xl font-black text-slate-800">3 mới</p>
                  </div>
                </motion.div>
              </div>

              {/* Left Column - Crop Management */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                  <div className="flex flex-col sm:flex-row items-sm-center justify-between gap-4 mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">Vườn trồng hiện tại</h3>
                      <p className="text-sm text-slate-500 font-medium">Theo dõi và cập nhật tình trạng canh tác</p>
                    </div>
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#059669] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4ade80] transition-colors shadow-lg"
                    >
                      <Plus size={18} /> Thêm cây trồng
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {cropsList.length > 0 ? (
                      cropsList.map((crop) => (
                        <motion.div 
                          key={crop.id}
                          className="bg-slate-50 rounded-[1.5rem] p-4 md:p-6 border border-slate-100 group hover:border-[#059669] transition-all"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#059669] shadow-sm">
                              <Sprout size={18} />
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                              getCropHeaderBadge(crop).style
                            }`}>
                              {getCropHeaderBadge(crop).label}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-800 mb-0.5">{crop.name}</h4>
                          <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 mb-4">
                            <MapIcon size={12} /> {crop.area}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-white p-2 rounded-lg border border-slate-100">
                              <p className="text-[8px] text-slate-400 font-black uppercase mb-1">Trạng thái</p>
                              <div className="flex">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black truncate ${
                                  getCropDynamicStatus(crop).style
                                }`}>
                                  {getCropDynamicStatus(crop).label}
                                </span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-slate-100">
                              <p className="text-[8px] text-slate-400 font-black uppercase mb-1">Giai đoạn</p>
                              <p className={`text-[9px] font-black uppercase truncate ${
                                crop.isRejected ? 'text-red-500' :
                                crop.isPending ? 'text-amber-500' : 'text-[#059669]'
                              }`}>
                                {crop.isRejected ? 'Dừng lại' : crop.isPending ? 'Chờ duyệt' : crop.growthStage}
                              </p>
                            </div>
                          </div>

                          {crop.expectedYield && (
                            <div className="mb-4 px-3 py-1.5 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                              <span className="text-[8px] font-black text-purple-700 uppercase tracking-widest">SL dự kiến</span>
                              <span className="text-[11px] font-black text-purple-900 font-bold">{crop.expectedYield} {crop.yieldUnit || 'tấn'}</span>
                            </div>
                          )}

                          {crop.status === 'cancelled' && crop.cancelReason && (
                            <div className="mb-6 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                              <p className="text-[9px] text-red-500 font-black uppercase mb-1">Lý do hủy/tạm dừng:</p>
                              <p className="text-xs text-red-500/80 font-medium italic">"{crop.cancelReason}"</p>
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                              <button 
                                disabled={isCropActionDisabled(crop)}
                                onClick={() => {
                                  setSelectedCrop({...crop});
                                  setIsUpdateModalOpen(true);
                                }}
                                className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                                  isCropActionDisabled(crop) ? 'text-slate-400 opacity-50 cursor-not-allowed' : 'text-[#059669] hover:gap-3'
                                }`}
                              >
                                Cập nhật tình hình <ChevronRight size={16} />
                              </button>

                            {crop.isRejected && (
                              <button 
                                onClick={() => setDeleteCropId(crop.id)}
                                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100/50"
                                title="Xóa cây trồng bị từ chối"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                          <Sprout size={32} />
                        </div>
                        <p className="text-slate-500 font-bold text-center px-6">Chưa có cây trồng nào được đăng ký.</p>
                        <p className="text-slate-400 text-xs font-medium mt-1">Bấm "Thêm cây trồng" để bắt đầu.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Notifications */}
              <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                  <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                    <Bell size={24} className="text-amber-500" /> Thông báo mới
                  </h3>
                  <div className="space-y-6">
                    {[
                      { type: 'warning', text: 'Cảnh báo mưa lớn cực đoan từ ngày 15/05.', time: '2 giờ trước' },
                      { type: 'info', text: 'Khuyến cáo bón phân cân đối cho vườn sầu riêng.', time: '1 ngày trước' },
                      { type: 'success', text: 'HTX đã phê duyệt báo cáo gieo trồng vụ mới.', time: '3 ngày trước' },
                    ].map((msg, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          msg.type === 'warning' ? 'bg-red-50 text-red-500' : msg.type === 'info' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-[#059669]'
                        }`}>
                          {msg.type === 'warning' ? <AlertCircle size={20} /> : msg.type === 'info' ? <Info size={20} /> : <CheckCircle2 size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-tight mb-2">{msg.text}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agricultural Support Request */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Yêu cầu hỗ trợ nông nghiệp</h3>
                  <div className="space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-3">
                      {['Cấp cây giống', 'Cấp phân bón', 'Cấp thuốc BVTV', 'Hỗ trợ kỹ thuật'].map(type => (
                        <label key={type} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <input 
                            type="radio" 
                            name="agricultural_request_type"
                            checked={selectedRequest === type}
                            onChange={() => setSelectedRequest(type)}
                            className="text-emerald-600 focus:ring-emerald-600 w-4 h-4"
                          />
                          {type}
                        </label>
                      ))}
                    </div>

                    {/* Conditional Forms for Detailed Requests */}
                    {selectedRequest === 'Cấp cây giống' && (
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
                        <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2 border-b border-emerald-100 pb-2">📦 Yêu cầu Cấp cây giống</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block">Tên giống cây/Loại giống</label>
                            <select 
                              className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                              value={seedRequestDetails.variety}
                              onChange={(e) => setSeedRequestDetails({...seedRequestDetails, variety: e.target.value})}
                            >
                              <option value="">Chọn giống cây</option>
                              <option value="Lúa ST25">Lúa ST25</option>
                              <option value="Hạt giống dưa hấu">Hạt giống dưa hấu</option>
                              <option value="Cây giống mít ruột đỏ">Cây giống mít ruột đỏ</option>
                              <option value="Sầu riêng Ri6">Sầu riêng Ri6</option>
                              <option value="Sầu riêng Dona">Sầu riêng Dona</option>
                              <option value="Khác">Khác...</option>
                            </select>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                               <label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block truncate">Số lượng</label>
                               <input type="text" placeholder="Vd: 100" className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                                value={seedRequestDetails.qty} onChange={(e) => setSeedRequestDetails({...seedRequestDetails, qty: e.target.value})} />
                            </div>
                            <div>
                               <label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block truncate">Đơn vị</label>
                               <select className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                                value={seedRequestDetails.unit} onChange={(e) => setSeedRequestDetails({...seedRequestDetails, unit: e.target.value})}>
                                  <option value="Bầu">Bầu</option>
                                  <option value="Cây">Cây</option>
                                  <option value="Kg">Kg</option>
                                  <option value="Khay">Khay</option>
                               </select>
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid grid-cols-12 gap-3">
                               <div className="col-span-8">
                                 <label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block truncate">Diện tích dự kiến</label>
                                 <input type="text" inputMode="decimal" placeholder="Số lượng" className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                                  value={seedRequestDetails.area} 
                                  onKeyPress={(e) => {
                                    if (!/[0-9.]/.test(e.key)) e.preventDefault();
                                  }}
                                  onChange={(e) => setSeedRequestDetails({...seedRequestDetails, area: e.target.value})} />
                               </div>
                               <div className="col-span-4">
                                  <label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block truncate">Đơn vị</label>
                                  <select className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                                   value={seedRequestDetails.areaUnit} onChange={(e) => setSeedRequestDetails({...seedRequestDetails, areaUnit: e.target.value})}>
                                     <option value="ha">ha</option>
                                     <option value="m²">m²</option>
                                     <option value="công">Công</option>
                                  </select>
                               </div>
                            </div>
                            <div>
                               <label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block truncate">Ngày mong muốn nhận</label>
                               <input type="text" placeholder="DD/MM/YYYY" className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                                value={seedRequestDetails.expectedDate} onChange={(e) => setSeedRequestDetails({...seedRequestDetails, expectedDate: e.target.value})} />
                            </div>
                          </div>
                          <div>
                             <label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block">Mô tả thêm (nếu có)</label>
                             <textarea placeholder="Mô tả chi tiết hơn về tình trạng hiện tại, hoặc ghi chú thêm..." className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500" rows={2}
                              value={customRequest} onChange={(e) => setCustomRequest(e.target.value)}></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRequest === 'Cấp phân bón' && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
                        <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-2 border-b border-amber-100 pb-2">🌱 Yêu cầu Cấp phân bón</h4>
                        <div className="space-y-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                               <label className="text-[10px] font-bold text-amber-700 uppercase mb-1 block truncate">Loại phân bón</label>
                               <select className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-amber-500"
                                value={fertilizerRequestDetails.type} onChange={(e) => setFertilizerRequestDetails({...fertilizerRequestDetails, type: e.target.value})}>
                                  <option value="">Chọn loại</option>
                                  <option value="Phân NPK">Phân NPK</option>
                                  <option value="Phân Đạm/Urea">Phân Đạm/Urea</option>
                                  <option value="Phân Lân">Phân Lân</option>
                                  <option value="Phân Hữu cơ vi sinh">Phân Hữu cơ vi sinh</option>
                               </select>
                            </div>
                            <div>
                               <label className="text-[10px] font-bold text-amber-700 uppercase mb-1 block truncate">Thương hiệu</label>
                               <select className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-amber-500"
                                value={fertilizerRequestDetails.brand} onChange={(e) => setFertilizerRequestDetails({...fertilizerRequestDetails, brand: e.target.value})}>
                                  <option value="">Chọn NSX</option>
                                  <option value="Đầu Trâu">Đầu Trâu</option>
                                  <option value="Phú Mỹ">Phú Mỹ</option>
                                  <option value="Bình Điền">Bình Điền</option>
                                  <option value="Khác">Khác</option>
                               </select>
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                               <label className="text-[10px] font-bold text-amber-700 uppercase mb-1 block truncate">Số lượng</label>
                               <input type="text" placeholder="Vd: 20" className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-amber-500"
                                value={fertilizerRequestDetails.qty} onChange={(e) => setFertilizerRequestDetails({...fertilizerRequestDetails, qty: e.target.value})} />
                            </div>
                            <div>
                               <label className="text-[10px] font-bold text-amber-700 uppercase mb-1 block truncate">Đơn vị</label>
                               <select className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-amber-500"
                                value={fertilizerRequestDetails.unit} onChange={(e) => setFertilizerRequestDetails({...fertilizerRequestDetails, unit: e.target.value})}>
                                  <option value="Bao (50kg)">Bao (50kg)</option>
                                  <option value="Kg">Kg</option>
                                  <option value="Lít">Lít (Dịch)</option>
                               </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-amber-700 uppercase mb-1 block">Giai đoạn bón / Mục đích</label>
                            <input type="text" placeholder="Bón lót đầu vụ, bón đón đòng, nuôi trái..." className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-amber-500"
                            value={fertilizerRequestDetails.stage} onChange={(e) => setFertilizerRequestDetails({...fertilizerRequestDetails, stage: e.target.value})} />
                          </div>
                          <div>
                             <label className="text-[10px] font-bold text-amber-700 uppercase mb-1 block">Mô tả thêm (nếu có)</label>
                             <textarea placeholder="Mô tả chi tiết hơn về tình trạng hiện tại, hoặc ghi chú thêm..." className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-amber-500" rows={2}
                              value={customRequest} onChange={(e) => setCustomRequest(e.target.value)}></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRequest === 'Cấp thuốc BVTV' && (
                      <div className="p-4 bg-red-50 rounded-2xl border border-red-100 space-y-3">
                        <h4 className="text-xs font-black text-red-800 uppercase tracking-widest flex items-center gap-2 border-b border-red-100 pb-2">🛡️ Yêu cầu Cấp thuốc BVTV</h4>
                        <div className="space-y-3">
                          <div>
                             <label className="text-[10px] font-bold text-red-700 uppercase mb-1 block">Loại thuốc / Công dụng</label>
                             <select className="w-full p-2.5 bg-white border border-red-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-red-500"
                                value={pesticideRequestDetails.type} onChange={(e) => setPesticideRequestDetails({...pesticideRequestDetails, type: e.target.value})}>
                                  <option value="">Chọn nhóm thuốc</option>
                                  <option value="Thuốc trừ sâu">Thuốc trừ sâu sinh học (VietGAP)</option>
                                  <option value="Thuốc trị bệnh nấm">Thuốc trị bệnh nấm</option>
                                  <option value="Thuốc trừ cỏ">Thuốc trừ cỏ</option>
                                  <option value="Chế phẩm sinh học">Kích thích sinh trưởng (Sinh học)</option>
                             </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-red-700 uppercase mb-1 block">Tình trạng thực tế tại ruộng (Lý do xin cấp)</label>
                            <textarea placeholder="Ví dụ: Ruộng xuất hiện rầy nâu mật độ dày, lá dưa bị vàng cuốn lá..." className="w-full p-2.5 bg-white border border-red-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-red-500" rows={2}
                            value={pesticideRequestDetails.reason} onChange={(e) => setPesticideRequestDetails({...pesticideRequestDetails, reason: e.target.value})}></textarea>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-red-700 uppercase mb-1 block">Hình ảnh thực tế tại ruộng</label>
                            <div className="w-full flex items-center justify-center p-4 border-2 border-dashed border-red-200 bg-white rounded-xl text-center relative hover:bg-slate-50 transition-colors">
                              {pesticideRequestDetails.image ? (
                                <div className="space-y-2 w-full">
                                  <img src={pesticideRequestDetails.image} alt="Tình trạng ruộng" className="max-h-32 mx-auto rounded-lg object-contain" />
                                  <button type="button" onClick={() => setPesticideRequestDetails({...pesticideRequestDetails, image: null})} className="text-[10px] uppercase font-black text-red-600 bg-red-100 px-3 py-1.5 rounded-lg w-full">Xóa ảnh</button>
                                </div>
                              ) : (
                                <>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                          setPesticideRequestDetails({...pesticideRequestDetails, image: ev.target?.result as string});
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <div className="text-red-400 space-y-1">
                                    <div className="mx-auto w-8 h-8 flex items-center justify-center bg-red-50 rounded-full">📷</div>
                                    <p className="text-xs font-bold">Chạm để chụp / tải ảnh lên</p>
                                    <p className="text-[9px] text-red-400 font-medium">Giúp kỹ sư KS nhận đúng thuốc</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                             <label className="text-[10px] font-bold text-red-700 uppercase mb-1 block">Mô tả thêm (nếu có)</label>
                             <textarea placeholder="Mô tả chi tiết hơn về tình trạng hiện tại, hoặc ghi chú thêm..." className="w-full p-2.5 bg-white border border-red-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-red-500" rows={2}
                              value={customRequest} onChange={(e) => setCustomRequest(e.target.value)}></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRequest === 'Hỗ trợ kỹ thuật' && (
                      <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                        <h4 className="text-xs font-black text-sky-800 uppercase tracking-widest flex items-center gap-2 border-b border-sky-100 pb-2">🛠️ Yêu cầu Hỗ trợ kỹ thuật</h4>
                        <div className="space-y-3">
                            <div>
                               <label className="text-[10px] font-bold text-sky-700 uppercase mb-1 block">Mô tả thêm (nếu có)</label>
                               <textarea placeholder="Mô tả chi tiết hơn về tình trạng hiện tại, hoặc ghi chú thêm..." className="w-full p-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-sky-500" rows={2}
                                value={customRequest} onChange={(e) => setCustomRequest(e.target.value)}></textarea>
                            </div>
                        </div>
                      </div>
                    )}

                    <button onClick={handleSendRequest} className="w-full py-4 bg-[#059669] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4ade80] transition-colors shadow-lg">
                      Gửi yêu cầu
                    </button>
                  </div>
                </div>
                
                {/* Profit Sidebar */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-8">Tình hình tài chính</h3>
                  <div className="bg-slate-50 rounded-3xl p-8 mb-8 border border-slate-100 shadow-inner">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Tạm ứng có thể nhận</p>
                    <p className="text-4xl font-black text-emerald-600">25M</p>
                  </div>
                  <div className="space-y-4 px-2 mb-8 text-left">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-500">Đã chi trả:</span>
                      <span className="text-slate-800">100M</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-emerald-600">
                      <span className="text-slate-500">Còn lại (Dự kiến):</span>
                      <span>45M</span>
                    </div>
                  </div>
                  <button className="w-full py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-not-allowed">
                    Yêu cầu tạm ứng (Sắp ra mắt)
                  </button>
                </div>
              </div>
            </div>
          )}



          {activeTab === 'harvest' && (
            <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                <h3 className="text-xl font-black text-forest mb-6">Lịch thu hoạch từ HTX</h3>
                {scheduledHarvests.length > 0 ? (
                  <div className="space-y-4">
                    {scheduledHarvests
                      .sort((a, b) => {
                        const timeA = a.timestamp || '';
                        const timeB = b.timestamp || '';
                        if (timeA && timeB) return timeB.localeCompare(timeA);
                        return b.id.localeCompare(a.id);
                      })
                      .map((h, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-forest text-sm">{h.product}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ngày: {formatDateSafe(h.date)} • Số lượng: {h.qty}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setDetailsModal(h)}
                            className="px-4 py-2 bg-slate-200 text-slate-700 text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-slate-300 transition-colors"
                          >
                            Xem chi tiết
                          </button>
                          {!h.confirmed ? (
                            h.isRefused ? (
                              <span className="px-4 py-2 bg-red-100 text-red-700 text-[10px] font-black rounded-lg uppercase italic flex items-center">Không xác nhận</span>
                            ) : (
                              <button 
                                onClick={() => confirmHarvest(h.id)}
                                className="px-4 py-2 bg-[#059669] text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-forest transition-colors"
                              >
                                Xác nhận
                              </button>
                            )
                          ) : (
                            <span className="px-4 py-2 bg-green-100 text-green-700 text-[10px] font-black rounded-lg uppercase italic flex items-center">Đã xác nhận</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                    <p className="text-sm text-slate-400">Hiện chưa có lịch thu hoạch nào từ HTX.</p>
                )}
              </div>
            </div>
          )}

          {/* Details Modal */}
          <AnimatePresence>
            {detailsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDetailsModal(null)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                      <h3 className="text-lg font-black text-slate-800">Chi tiết Lịch Thu hoạch</h3>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Thông tin từ Hợp tác xã</p>
                    </div>
                    <button 
                      onClick={() => setDetailsModal(null)}
                      className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Loại cây</p>
                        <p className="text-sm font-bold text-forest">{detailsModal.product}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày dự kiến</p>
                        <p className="text-sm font-bold text-forest">{formatDateSafe(detailsModal.date)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Số lượng</p>
                        <p className="text-sm font-bold text-forest">{detailsModal.qty}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Batch</p>
                        <p className="text-sm font-bold text-forest">{detailsModal.batch || 'Chưa cập nhật'}</p>
                      </div>
                      <div className="col-span-2 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Khu vực</p>
                        <p className="text-sm font-bold text-forest">{detailsModal.area}</p>
                      </div>
                      <div className="col-span-2 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng giá trị sản phẩm</p>
                        <p className="text-sm font-bold text-forest">{detailsModal.totalValue || 'Chưa cập nhật'}{detailsModal.totalValue ? ' VNĐ' : ''}</p>
                      </div>
                      <div className="col-span-2 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Yêu cầu đặc biệt</p>
                        <p className="text-xs font-bold text-forest/70 italic text-pretty">"{detailsModal.requirements || 'Không có ghi chú đặc biệt'}"</p>
                      </div>
                    </div>

                    {detailsModal.isRefused ? (
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Lý do từ chối:</p>
                            <p className="text-xs font-bold text-red-600 italic">"{detailsModal.refusalReason}"</p>
                        </div>
                    ) : (
                      detailsModal.showRefusalInput && (
                          <div className="space-y-3 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                              <label className="text-[10px] font-black text-red-500 uppercase tracking-widest">Lý do không xác nhận</label>
                              <textarea 
                                  value={detailsModal.refusalReason || ''}
                                  onChange={(e) => setDetailsModal({...detailsModal, refusalReason: e.target.value})}
                                  placeholder="Nhập lý do tại đây..."
                                  className="w-full px-4 py-3 bg-white border border-red-200 focus:border-red-500 rounded-xl outline-none font-bold text-red-600 text-sm shadow-sm"
                                  rows={3}
                              />
                              <div className="flex gap-2">
                                  <button 
                                      onClick={() => {
                                          const refusalReason = detailsModal.refusalReason;
                                          setScheduledHarvests(prev => prev.map(s => s.id === detailsModal.id ? {...s, confirmed: false, isRefused: true, refusalReason: refusalReason} : s));
                                          
                                          const saved = localStorage.getItem('vietagri_harvest_schedules');
                                          if (saved) {
                                              const all = JSON.parse(saved);
                                              const newAll = all.map((s: any) => s.id === detailsModal.id ? {...s, confirmed: false, isRefused: true, refusalReason: refusalReason} : s);
                                              localStorage.setItem('vietagri_harvest_schedules', JSON.stringify(newAll));
                                          }

                                          setDetailsModal(null);
                                      }}
                                      className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                  >
                                      Gửi lý do
                                  </button>
                                  <button 
                                      onClick={() => setDetailsModal({...detailsModal, showRefusalInput: false})}
                                      className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-colors"
                                  >
                                      Quay lại
                                  </button>
                              </div>
                          </div>
                      )
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 bg-white flex gap-3 sticky bottom-0 z-10 mt-auto">
                    {!detailsModal.isRefused && !detailsModal.showRefusalInput && !detailsModal.confirmed && (
                      <>
                        <button 
                          onClick={() => confirmHarvest(detailsModal.id)}
                          className="flex-1 py-4 bg-[#059669] text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-[#047857] transition-all shadow-lg shadow-emerald-200"
                        >
                          Xác nhận
                        </button>
                        <button 
                          onClick={() => setDetailsModal({...detailsModal, showRefusalInput: true})}
                          className="flex-1 py-4 bg-red-50 text-red-600 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-red-100 transition-all"
                        >
                          Không xác nhận
                        </button>
                      </>
                    )}

                    {detailsModal.confirmed && (
                      <div className="w-full space-y-3">
                        <button 
                            onClick={() => {
                                setDeliveryModal(detailsModal);
                                setDetailsModal(null);
                            }}
                            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                            Giao nông sản
                        </button>
                        <button disabled className="w-full py-4 bg-slate-50 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border border-slate-100">
                           <CheckCircle2 size={16} /> Đã xác nhận lịch
                        </button>
                      </div>
                    )}

                    {(detailsModal.isRefused || (detailsModal.showRefusalInput === false && !detailsModal.confirmed)) && (
                      <button 
                        onClick={() => setDetailsModal(null)}
                        className="w-full py-4 bg-slate-50 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-colors"
                      >
                        Đóng chi tiết
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          
          {/* Receipt Details Modal */}
          <AnimatePresence>
            {deleteCropId && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDeleteCropId(null)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trash2 size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Xác nhận xóa?</h3>
                  <p className="text-sm text-slate-500 font-medium mb-8">Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa cây trồng này?</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setDeleteCropId(null)}
                      className="py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      onClick={handleDeleteCrop}
                      className="py-4 bg-red-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    >
                      Xác nhận xóa
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Delivery Modal */}
          <AnimatePresence>
            {deliveryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDeliveryModal(null)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="relative w-[95vw] md:w-[60vw] lg:w-[40vw] bg-white rounded-[2rem] shadow-2xl p-6 md:p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800">Giao nông sản</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cập nhật thông tin chi tiết</p>
                        </div>
                        <button onClick={() => setDeliveryModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Delivery Slip Summary Section */}
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Nông sản</p>
                                <p className="text-sm font-bold text-forest mt-0.5">{deliveryModal.product}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Ngày dự kiến</p>
                                <p className="text-sm font-bold text-forest mt-0.5">{new Date(deliveryModal.date).toLocaleDateString('vi-VN')}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Sản lượng dự kiến</p>
                                <p className="text-sm font-bold text-forest mt-0.5">{deliveryModal.qty}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Giá trị dự kiến</p>
                                <p className="text-sm font-bold text-forest mt-0.5">{deliveryModal.totalValue ? `${deliveryModal.totalValue} VNĐ` : 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                        
                        {/* Delivery Details Form */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Số lượng thực giao</label>
                                  <input 
                                    type="text" 
                                    value={deliveryData.actualQty}
                                    onChange={(e) => setDeliveryData({...deliveryData, actualQty: e.target.value})}
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-[#059669] transition-all" 
                                    placeholder={`Ví dụ: ${deliveryModal.qty.split(' ')[0]}`} 
                                  />
                              </div>
                              <div className="space-y-1">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Lần giao</label>
                                  <input 
                                    type="number" 
                                    value={deliveryData.deliveryTurn}
                                    onChange={(e) => setDeliveryData({...deliveryData, deliveryTurn: e.target.value})}
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-[#059669] transition-all" 
                                    placeholder="Ví dụ: 1" 
                                  />
                              </div>
                          </div>
                          
                          <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Ngày giao thực tế</label>
                              <input 
                                type="text" 
                                value={deliveryData.actualDate}
                                onChange={(e) => setDeliveryData({...deliveryData, actualDate: e.target.value})}
                                placeholder={new Date().toLocaleDateString('vi-VN')}
                                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-[#059669] transition-all" 
                              />
                          </div>
                          
                          <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Giá trị thực tế (VNĐ)</label>
                              <input 
                                type="number" 
                                value={deliveryData.actualValue}
                                onChange={(e) => setDeliveryData({...deliveryData, actualValue: e.target.value})}
                                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-[#059669] transition-all" 
                                placeholder={deliveryModal.totalValue || "Ví dụ: 10000000"} 
                              />
                          </div>
                          
                          <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Ghi chú thêm</label>
                              <textarea 
                                value={deliveryData.note}
                                onChange={(e) => setDeliveryData({...deliveryData, note: e.target.value})}
                                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-[#059669] transition-all resize-none" 
                                placeholder="Ghi chú về tình trạng nông sản..." 
                                rows={2} 
                              />
                          </div>
                        </div>
                        
                        <button 
                            onClick={handleConfirmDelivery}
                            className="w-full py-4 bg-[#059669] text-white font-black rounded-2xl uppercase tracking-widest hover:bg-forest transition-all shadow-lg shadow-emerald-900/10"
                        >
                            Xác nhận giao nộp
                        </button>
                    </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {activeTab === 'crops' && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
              <div className="flex flex-col sm:flex-row items-sm-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Quản lý cây trồng</h3>
                  <p className="text-sm text-slate-500 font-medium">Theo dõi và cập nhật nhật ký canh tác</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#059669] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4ade80] transition-colors shadow-lg"
                >
                  <Plus size={18} /> Thêm cây trồng
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cropsList.length > 0 ? (
                  cropsList.map((crop) => (
                    <motion.div 
                      key={crop.id}
                      onClick={() => setSelectedCropForDiary(crop)}
                      className={`bg-slate-50 rounded-[2rem] p-6 border-2 transition-all flex flex-col justify-between cursor-pointer ${
                          selectedCropForDiary?.id === crop.id ? 'border-[#059669] shadow-lg shadow-[#059669]/10' : 'border-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#059669] shadow-sm">
                            <Sprout size={20} />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            getCropHeaderBadge(crop).style
                          }`}>
                            {getCropHeaderBadge(crop).label}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-1">{crop.name}</h4>
                        <p className="text-xs text-slate-500 font-bold flex items-center gap-2 mb-6">
                          <MapIcon size={14} /> {crop.area}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-white p-3 rounded-xl border border-slate-100">
                            <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Trạng thái</p>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${getCropDynamicStatus(crop).style}`}>
                              {getCropDynamicStatus(crop).label}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-100">
                            <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Giai đoạn</p>
                            <p className={`text-[10px] font-black uppercase truncate ${crop.isPending ? 'text-amber-500' : 'text-[#059669]'}`}>{crop.isPending ? 'Chờ duyệt' : crop.growthStage}</p>
                          </div>
                        </div>

                        {crop.expectedYield && (
                          <div className="mb-6 px-4 py-2 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                            <span className="text-[9px] font-black text-purple-700 uppercase tracking-widest">Sản lượng dự kiến</span>
                            <span className="text-xs font-black text-purple-900">{crop.expectedYield} {crop.yieldUnit || 'tấn'}</span>
                          </div>
                        )}

                        {crop.status === 'cancelled' && crop.cancelReason && (
                          <div className="mb-6 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                            <p className="text-[9px] text-red-500 font-black uppercase mb-1">Lý do:</p>
                            <p className="text-xs text-red-500/80 font-medium italic">"{crop.cancelReason}"</p>
                          </div>
                        )}
                      </div>

                      <button 
                        disabled={isCropActionDisabled(crop)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCrop({...crop});
                          setIsUpdateModalOpen(true);
                        }}
                        className={`mt-4 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                          isCropActionDisabled(crop) ? 'text-slate-400 opacity-50 cursor-not-allowed' : 'text-[#059669] hover:gap-3'
                        }`}
                      >
                        Cập nhật tình hình <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                      <Sprout size={32} />
                    </div>
                    <p className="text-slate-500 font-bold text-center px-6">Chưa có cây trồng nào được đăng ký.</p>
                    <p className="text-slate-400 text-xs font-medium mt-1">Bấm "Thêm cây trồng" để bắt đầu.</p>
                  </div>
                )}
              </div>

              {/* Diary View Section */}
              {selectedCropForDiary && (
                <div className="mt-12 pt-12 border-t-2 border-slate-50">
                  <h3 className="text-xl font-black text-slate-800 mb-8">Nhật ký trồng trọt: {selectedCropForDiary.name}</h3>

                  <div className="mb-10 space-y-4">
                    <p className="font-black text-emerald-800 text-sm uppercase tracking-widest">Thêm hoạt động mới</p>
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          value={newDiaryEntry.date} 
                          readOnly 
                          placeholder="10/01/2025"
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-500 text-sm outline-none cursor-not-allowed" 
                        />
                        <select value={newDiaryEntry.type} onChange={e => setNewDiaryEntry({...newDiaryEntry, type: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm outline-none focus:border-[#059669]">
                            <option value="checkup">Kiểm tra</option>
                            <option value="fertilizer">Bón phân</option>
                            <option value="pest_control">Phun thuốc</option>
                            <option value="pest_problem">Sâu bệnh</option>
                            <option value="note">Ghi chú</option>
                        </select>
                    </div>
                    <textarea value={newDiaryEntry.description} onChange={e => setNewDiaryEntry({...newDiaryEntry, description: e.target.value})} placeholder="Chi tiết hoạt động..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm outline-none focus:border-[#059669] resize-none" rows={2} />
                    <button onClick={handleAddDiaryEntry} className="w-full py-3 bg-[#059669] text-white font-black text-xs uppercase rounded-xl hover:bg-emerald-700 transition-colors">Thêm nhật ký</button>
                  </div>

                  <div className="space-y-4">
                    {selectedCropForDiary.diary.length === 0 && <p className="text-slate-400 font-medium">Chưa có nhật ký hoạt động.</p>}
                    {selectedCropForDiary.diary.map((entry: any, index: number) => (
                        <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="text-[#059669] pt-1">
                                <Clock size={20} />
                             </div>
                             <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{entry.date.split('-').reverse().join('/')}</p>
                                <p className="text-sm font-bold text-slate-800">{entry.description}</p>
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                    entry.type === 'fertilizer' ? 'bg-amber-100 text-amber-700' :
                                    entry.type === 'pest_control' ? 'bg-red-100 text-red-700' :
                                    entry.type === 'checkup' ? 'bg-blue-100 text-blue-700' :
                                    entry.type === 'pest_problem' ? 'bg-red-50 text-red-500' : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {entry.type === 'fertilizer' ? 'Bón phân' : 
                                    entry.type === 'pest_control' ? 'Phun thuốc' : 
                                    entry.type === 'checkup' ? 'Kiểm tra' : 
                                    entry.type === 'pest_problem' ? 'Sâu bệnh' : 'Ghi chú'}
                                </span>
                             </div>
                        </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'receipts' && (
            <div className="space-y-6">
              {/* My Contracts Section */}
              <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 overflow-hidden">
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => setIsContractsExpanded(!isContractsExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">Hợp đồng của tui</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Danh sách các thỏa thuận hợp tác</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isContractsExpanded ? 0 : -90 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isContractsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {contractsList.length > 0 ? (
                        <div className="space-y-2">
                          {contractsList.map((contract) => (
                            <div 
                              key={contract.id}
                              onClick={() => navigate(`/contract-farmer/${contract.id}?productId=${contract.product || ''}`)}
                              className="bg-slate-50 rounded-2xl py-2 px-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-[#059669] hover:bg-white transition-all group/item"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover/item:text-[#059669] group-hover/item:border-[#059669]/30 transition-colors">
                                  <FileText size={16} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-sm font-bold text-slate-800">#{contract.contractNo || contract.id.slice(-6)}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                      contract.status === 'signed' || contract.status === 'active' || contract.status === 'completed' || contract.status === 'in_progress' || contract.status === 'Đang thực hiện' ? 'bg-emerald-100 text-emerald-700 font-bold' :
                                      contract.status === 'rejected' || contract.status === 'unsigned' || contract.status === 'Từ chối' || contract.status === 'Hợp đồng đã bị từ chối' ? 'bg-rose-100 text-rose-700 font-bold' :
                                      contract.status === 'awaiting_admin_signature' || contract.status === 'Đang chờ ký (Admin)' ? 'bg-blue-100 text-blue-700 font-bold' :
                                      contract.status === 'pending_cooperative' || contract.status === 'Chờ HTX ký' ? 'bg-sky-100 text-sky-700' :
                                      contract.status === 'expired' || contract.status === 'Hết hạn' ? 'bg-slate-200 text-slate-700' :
                                      contract.status === 'pending_super_admin' || contract.status === 'Chờ duyệt' ? 'bg-amber-100 text-amber-500' :
                                      'bg-amber-100 text-amber-600'
                                    }`}>
                                      {contract.status === 'signed' || contract.status === 'active' || contract.status === 'completed' || contract.status === 'in_progress' || contract.status === 'Đang thực hiện' ? 'Đã hoàn tất' : 
                                       contract.status === 'rejected' || contract.status === 'unsigned' || contract.status === 'Từ chối' || contract.status === 'Hợp đồng đã bị từ chối' ? 'Từ chối' :
                                       contract.status === 'awaiting_admin_signature' || contract.status === 'Đang chờ ký (Admin)' ? 'Đang thực hiện' :
                                       contract.status === 'pending_cooperative' || contract.status === 'Chờ HTX ký' ? 'Chờ HTX ký' :
                                       contract.status === 'expired' || contract.status === 'Hết hạn' ? 'Hết hạn' :
                                       contract.status === 'pending_super_admin' || contract.status === 'Chờ duyệt' ? 'Chờ duyệt' :
                                       'Chờ ký'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] font-bold text-slate-500 truncate max-w-[150px]">
                                    {contract.enterpriseName || contract.buyer?.name || 'Đối tác HTX'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {(!contract.status || contract.status === 'awaiting_signature' || contract.status === 'Chờ ký') ? (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/contract-farmer/${contract.id}?productId=${contract.product || ''}`);
                                    }}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-[#059669] text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#047857] transition-all"
                                  >
                                    Ký ngay
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Chưa có hợp đồng nào</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Receipts Placeholder */}
              <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-100">
                <CheckCircle2 size={40} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-black text-slate-400">Bảng kê thanh toán</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-1">Tính năng đang được hoàn thiện</p>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-100">
              <Wallet size={48} className="text-[#059669] mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-800 mb-2">Ví điện tử</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Đang được hoàn thiện</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Crop Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-lg font-black text-slate-800">Thêm cây trồng mới</h3>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Khai báo thông tin canh tác</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                
                {/* Section I: Thông tin chung */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
                    <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                      <Sprout size={18} />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">I. Thông tin cây trồng</h4>
                  </div>

                  {/* Crop Type Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Loại cây trồng (HTX quy định)</label>
                    <div className="relative group">
                      <select 
                        value={newCrop.type}
                        onChange={(e) => {
                          const type = e.target.value;
                          setNewCrop({
                            ...newCrop, 
                            type, 
                            variety: '', 
                            growthStage: ''
                          });
                        }}
                        className={`w-full px-4 py-3 bg-white border outline-none font-bold text-xs rounded-xl transition-all appearance-none cursor-pointer ${
                          !newCrop.type ? 'text-slate-400 border-slate-200 focus:border-emerald-500' : 'text-slate-800 border-emerald-500 shadow-sm'
                        }`}
                      >
                        <option value="">Chọn loại cây trồng...</option>
                        <option value="rice">Lúa gạo</option>
                        <option value="coffee">Cà phê</option>
                        <option value="durian">Sầu riêng</option>
                        <option value="pepper">Hồ tiêu</option>
                        <option value="veggie">Rau hữu cơ</option>
                        <option value="fruit">Cây ăn trái khác</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Variety Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Giống cây cụ thể</label>
                    <div className="relative group">
                      <select 
                        disabled={!newCrop.type}
                        value={newCrop.variety}
                        onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                        className={`w-full px-4 py-3 bg-white border outline-none font-bold text-xs rounded-xl transition-all appearance-none ${
                          !newCrop.type ? 'text-slate-300 border-slate-100 bg-slate-50' : 'text-slate-800 border-emerald-500 shadow-sm'
                        }`}
                      >
                        <option value="">{newCrop.type ? 'Chọn giống cây...' : 'Vui lòng chọn loại cây trước'}</option>
                        {getVarieties().map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                {/* Section II: Trạng thái & Giai đoạn */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
                    <div className="text-amber-600 bg-amber-50 p-2 rounded-lg">
                      <Clock size={18} />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">II. Trạng thái & Giai đoạn</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Trạng thái hiện tại</label>
                      <div className="relative group">
                        <select 
                          disabled={!newCrop.variety}
                          value={newCrop.status}
                          onChange={(e) => {
                            const nextStatus = e.target.value;
                            setNewCrop({
                              ...newCrop, 
                              status: nextStatus,
                              growthStage: nextStatus !== 'cultivating' ? '' : newCrop.growthStage
                            });
                          }}
                          className={`w-full px-4 py-3 bg-white border outline-none font-bold text-xs rounded-xl transition-all appearance-none cursor-pointer ${
                            !newCrop.variety ? 'text-slate-300 border-slate-100 bg-slate-50' : 'text-slate-800 border-emerald-500 shadow-sm'
                          }`}
                        >
                          <option value="planned">Dự kiến</option>
                          <option value="cultivating">Đang canh tác</option>
                          <option value="harvested">Đã thu hoạch</option>
                          <option value="cancelled">Tạm dừng/Hủy</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Giai đoạn sinh trưởng</label>
                      <div className="relative group">
                        <select 
                          disabled={!newCrop.type || newCrop.status !== 'cultivating'}
                          value={newCrop.growthStage}
                          onChange={(e) => setNewCrop({...newCrop, growthStage: e.target.value})}
                          className={`w-full px-4 py-3 bg-white border outline-none font-bold text-xs rounded-xl transition-all appearance-none ${
                            (!newCrop.type || newCrop.status !== 'cultivating') ? 'text-slate-300 border-slate-100 bg-slate-50' : 'text-slate-800 border-emerald-500 shadow-sm'
                          }`}
                        >
                          <option value="">Chọn giai đoạn...</option>
                          {getGrowthStages().map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  {newCrop.status === 'cancelled' && (
                    <div className="space-y-1.5 pt-2">
                      <label className="text-[9px] font-black text-red-500 uppercase tracking-widest pl-1">Lý do tạm dừng/hủy</label>
                      <textarea 
                        value={newCrop.cancelReason}
                        onChange={(e) => setNewCrop({...newCrop, cancelReason: e.target.value})}
                        placeholder="Nhập lý do tại đây..."
                        className="w-full px-4 py-3 bg-red-50 border border-red-200 focus:border-red-500 rounded-xl outline-none font-bold text-xs text-red-800 transition-all shadow-sm"
                        rows={2}
                      />
                    </div>
                  )}
                </div>

                {/* Section III: Thông tin sản xuất */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
                    <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">
                      <MapIcon size={18} />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">III. Thông tin sản xuất</h4>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-8 space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Diện tích đất</label>
                      <input 
                        type="text"
                        inputMode="decimal"
                        placeholder="Số lượng"
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-slate-800 transition-all shadow-sm"
                        value={newCrop.area}
                        onKeyPress={(e) => {
                          if (!/[0-9.]/.test(e.key)) e.preventDefault();
                        }}
                        onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                      />
                    </div>
                    <div className="col-span-4 space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Đơn vị</label>
                      <div className="relative group">
                        <select 
                          value={newCrop.unit}
                          onChange={(e) => setNewCrop({...newCrop, unit: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-slate-800 appearance-none transition-all shadow-sm"
                        >
                          <option value="">Đơn vị</option>
                          <option value="ha">Hectare (ha)</option>
                          <option value="mau">Mẫu</option>
                          <option value="cong">Công</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                      </div>
                    </div>
                    {newCrop.area && newCrop.unit && (
                      <div className="col-span-12 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-700">Quy đổi: {getConvertedArea()}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Vị trí (tọa độ GIS)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="text"
                          readOnly
                          placeholder="Chưa có tọa độ"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs text-slate-600 cursor-not-allowed"
                          value={newCrop.coordinates}
                        />
                      </div>
                      <button 
                        onClick={handleGetLocation}
                        disabled={isGettingLocation}
                        className="px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 disabled:bg-slate-300 disabled:shadow-none min-w-[100px] justify-center"
                      >
                        {isGettingLocation ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Navigation size={14} />
                        )}
                        {isGettingLocation ? '...' : 'Lấy vị trí'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section IV: Thời gian dự kiến */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
                    <div className="text-purple-600 bg-purple-50 p-2 rounded-lg">
                      <Calendar size={18} />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">IV. Thời gian dự kiến</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Ngày xuống giống</label>
                      <input 
                        type="text"
                        placeholder="DD/MM/YYYY"
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-slate-800 transition-all shadow-sm"
                        value={newCrop.plantingDate}
                        onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Ngày thu hoạch dự kiến</label>
                      <input 
                        type="text"
                        placeholder="DD/MM/YYYY"
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-slate-800 transition-all shadow-sm"
                        value={newCrop.expectedHarvestDate}
                        onChange={(e) => setNewCrop({...newCrop, expectedHarvestDate: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-12 gap-3 sm:gap-4">
                      <div className="col-span-7 sm:col-span-8 space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 block truncate">Sản lượng dự kiến</label>
                        <input 
                          type="text"
                          inputMode="decimal"
                          placeholder="Số lượng"
                          className="w-full px-3 sm:px-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-slate-800 transition-all shadow-sm"
                          value={newCrop.expectedYield || ''}
                          onKeyPress={(e) => {
                            if (!/[0-9.]/.test(e.key)) e.preventDefault();
                          }}
                          onChange={(e) => setNewCrop({...newCrop, expectedYield: e.target.value})}
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-4 space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 block truncate">Đơn vị tính</label>
                        <div className="relative group">
                          <select 
                            value={newCrop.yieldUnit || 'tấn'}
                            onChange={(e) => setNewCrop({...newCrop, yieldUnit: e.target.value})}
                            className="w-full px-3 sm:px-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-slate-800 appearance-none transition-all shadow-sm"
                          >
                            <option value="tấn">Tấn</option>
                            <option value="Kg">Kg</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0" size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex gap-3 sticky bottom-0 z-10">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleConfirmCrop}
                  disabled={!newCrop.type || !newCrop.variety || !newCrop.area || !newCrop.unit}
                  className="flex-2 py-4 bg-[#059669] text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-[#047857] transition-colors shadow-lg shadow-emerald-200 disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400"
                >
                  Xác nhận thêm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Crop Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && selectedCrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-lg font-black text-slate-800 leading-tight">Cập nhật cây trồng</h3>
                  <p className="text-xs font-bold text-indigo-600 mb-1">Mùa vụ thứ {selectedCrop.seasonNumber || 1}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest leading-none">{selectedCrop.name} • {selectedCrop.area}</p>
                </div>
                <button 
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                
                {/* Section I: Tình trạng & Giai đoạn */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
                    <div className="text-amber-600 bg-amber-50 p-2 rounded-lg">
                      <Clock size={18} />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">I. Tình trạng canh tác</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Trạng thái</label>
                      <div className="relative group">
                        <select 
                          disabled={selectedCrop.status === 'harvested' || selectedCrop.status === 'cancelled'}
                          value={selectedCrop.status}
                          onChange={(e) => {
                            const nextStatus = e.target.value;
                            setSelectedCrop({
                              ...selectedCrop, 
                              status: nextStatus,
                              growthStage: nextStatus !== 'cultivating' ? '' : selectedCrop.growthStage
                            });
                          }}
                          className={`w-full px-4 py-3 bg-white border outline-none font-bold text-xs rounded-xl transition-all appearance-none cursor-pointer ${
                            (selectedCrop.status === 'harvested' || selectedCrop.status === 'cancelled') 
                              ? 'text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed'
                              : 'text-slate-800 border-emerald-500 shadow-sm'
                          }`}
                        >
                          <option value="planned" disabled={selectedCrop.status !== 'planned'}>Dự kiến</option>
                          <option value="cultivating" disabled={selectedCrop.status === 'planned' ? false : true}>Đang canh tác</option>
                          <option value="harvested">Đã thu hoạch</option>
                          <option value="cancelled">Tạm dừng/Hủy</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Giai đoạn</label>
                      <div className="relative group">
                        <select 
                          disabled={selectedCrop.status !== 'cultivating'}
                          value={selectedCrop.growthStage}
                          onChange={(e) => setSelectedCrop({...selectedCrop, growthStage: e.target.value})}
                          className={`w-full px-4 py-3 bg-white border outline-none font-bold text-xs rounded-xl transition-all appearance-none ${
                            selectedCrop.status !== 'cultivating' ? 'text-slate-300 border-slate-100 bg-slate-50' : 'text-slate-800 border-emerald-500 shadow-sm'
                          }`}
                        >
                          <option value="" disabled={!!selectedCrop.growthStage}>Chọn giai đoạn...</option>
                          {(GROWTH_STAGES_MAP[selectedCrop.type] || []).map((stage: string, index: number) => {
                            const stages = GROWTH_STAGES_MAP[selectedCrop.type] || [];
                            const currentIndex = stages.indexOf(selectedCrop.growthStage);
                            return (
                              <option 
                                key={stage} 
                                value={stage}
                                disabled={currentIndex !== -1 && index < currentIndex}
                              >
                                {stage}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  {selectedCrop.status === 'cancelled' && (
                    <div className="space-y-1.5 pt-2">
                      <label className="text-[9px] font-black text-red-500 uppercase tracking-widest pl-1">Lý do thay đổi</label>
                      <textarea 
                        value={selectedCrop.cancelReason || ''}
                        onChange={(e) => setSelectedCrop({...selectedCrop, cancelReason: e.target.value})}
                        placeholder="Nhập lý do tại đây..."
                        className="w-full px-4 py-3 bg-red-50 border border-red-200 focus:border-red-500 rounded-xl outline-none font-bold text-xs text-red-800 transition-all shadow-sm"
                        rows={2}
                      />
                    </div>
                  )}
                </div>

                {/* Section II: Sức khỏe & Thông tin khác */}
                {selectedCrop.status === 'cultivating' && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
                      <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                        <CheckCircle2 size={18} />
                      </div>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">II. Theo dõi sức khỏe</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {['Tốt', 'Bình thường', 'Cần chú ý', 'Cảnh báo sâu bệnh'].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setSelectedCrop({...selectedCrop, health: h})}
                          className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                            selectedCrop.health === h 
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100' 
                              : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 block truncate">Ngày xuống giống</label>
                        <div className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 shadow-inner flex items-center justify-between gap-1.5">
                          <span className="truncate">{selectedCrop.plantingDate ? formatDateSafe(selectedCrop.plantingDate) : 'Chưa cập nhật'}</span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded font-black tracking-widest uppercase shrink-0">Khóa</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 block truncate">Ngày thu hoạch dự kiến</label>
                        <div className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 shadow-inner flex items-center justify-between gap-1.5">
                          <span className="truncate">{selectedCrop.expectedHarvestDate ? formatDateSafe(selectedCrop.expectedHarvestDate) : 'Chưa cập nhật'}</span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded font-black tracking-widest uppercase shrink-0">Khóa</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-3 sm:gap-4">
                        <div className="col-span-7 sm:col-span-8 space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 block truncate">Sản lượng dự kiến</label>
                          <div className="w-full px-3 sm:px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 shadow-inner flex items-center justify-between gap-1.5">
                            <span className="truncate">{selectedCrop.expectedYield ? selectedCrop.expectedYield : 'Chưa cập nhật'}</span>
                            <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded font-black tracking-widest uppercase shrink-0">Khóa</span>
                          </div>
                        </div>
                        <div className="col-span-5 sm:col-span-4 space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 block truncate">Đơn vị tính</label>
                          <div className="w-full px-3 sm:px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 shadow-inner flex items-center justify-between gap-1.5">
                            <span className="capitalize truncate">{selectedCrop.yieldUnit || 'Tấn'}</span>
                            <span className="text-[7px] sm:text-[8px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded font-black tracking-widest uppercase shrink-0">Khóa</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section II: Quyết định sau thu hoạch (Chỉ hiển thị khi Trạng thái là Đã thu hoạch) */}
                {selectedCrop.status === 'harvested' && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
                      <div className="text-teal-600 bg-teal-50 p-2 rounded-lg">
                        <CheckCircle2 size={18} />
                      </div>
                      <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">II. QUYẾT ĐỊNH SAU THU HOẠCH</h4>
                    </div>

                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-1 uppercase tracking-tight">
                      Bạn đã hoàn tất quy trình thu hoạch. Hãy chọn hướng đi cho mùa vụ tiếp theo:
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                      {selectedCrop.seasonApprovalCode && (
                        <div className="mb-2 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                            <Navigation size={20} />
                          </div>
                          <div>
                            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-0.5">Mã phê duyệt mùa vụ mới</p>
                            <p className="text-sm font-black text-slate-800 font-mono tracking-wider">{selectedCrop.seasonApprovalCode}</p>
                          </div>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        disabled={!!selectedCrop.seasonApprovalCode}
                        onClick={() => setSelectedCrop({
                          ...selectedCrop,
                          postHarvestAction: 'end_cultivation'
                        })}
                        className={`p-4 rounded-2xl text-left border transition-all duration-200 ${
                          selectedCrop.postHarvestAction === 'end_cultivation'
                            ? 'bg-rose-50/50 border-rose-350 shadow-sm ring-1 ring-rose-300/30'
                            : !!selectedCrop.seasonApprovalCode 
                              ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'
                              : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedCrop.postHarvestAction === 'end_cultivation' ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                          }`}>
                            {selectedCrop.postHarvestAction === 'end_cultivation' && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wider">KẾT THÚC ĐỢT CANH TÁC</p>
                            <p className="text-[9px] text-[#94a3b8] font-bold mt-0.5 leading-normal">
                              Quá trình sản xuất kết thúc hoàn toàn. Hợp đồng hợp tác sản xuất nông nghiệp giữa bạn và HTX sẽ chính thức vô hiệu (hết hạn hợp đồng).
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCrop({
                          ...selectedCrop,
                          postHarvestAction: 'new_season'
                        })}
                        className={`p-4 rounded-2xl text-left border transition-all duration-200 ${
                          selectedCrop.postHarvestAction === 'new_season' || !selectedCrop.postHarvestAction
                            ? 'bg-emerald-50/50 border-emerald-355 shadow-sm ring-1 ring-emerald-300/30'
                            : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedCrop.postHarvestAction === 'new_season' || !selectedCrop.postHarvestAction ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                          }`}>
                            {(selectedCrop.postHarvestAction === 'new_season' || !selectedCrop.postHarvestAction) && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-extrabold text-[11px] text-slate-800 uppercase tracking-wider">TIẾP TỤC MÙA VỤ MỚI</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5 leading-normal">
                              Gia hạn hợp đồng hiện tại để chuẩn bị bước vào mùa gieo cấy lứa tiếp theo cho dòng cây trồng này trên cùng quỹ đất.
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex gap-3 sticky bottom-0 z-10">
                <button 
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>

                
                {! (selectedCrop.status === 'harvested' && selectedCrop.postHarvestAction) && (
                    <button 
                      onClick={() => {
                        let finalCrop = { ...selectedCrop };
                        const isNewSeasonConfirm = !!finalCrop.seasonApprovalCode;

                        if (isNewSeasonConfirm) {
                            finalCrop.status = 'planned';
                            finalCrop.growthStage = 'Chuẩn bị'; 
                            finalCrop.health = 'Bình thường';
                            delete (finalCrop as any).seasonApprovalCode;
                        }

                        // Update state
                        setCropsList(prev => prev.map(c => c.id === finalCrop.id ? finalCrop : c));
                        
                        // Generate report description
                        const originalCrop = cropsList.find(c => c.id === finalCrop.id);
                        let changeDesc = `Cập nhật cây trồng ${finalCrop.name}:`;
                        if (originalCrop) {
                            const changes = [];
                            if (originalCrop.status !== finalCrop.status) {
                                const statusMap: any = { planned: 'Dự kiến', cultivating: 'Đang canh tác', harvested: 'Đã thu hoạch', cancelled: 'Tạm dừng/Hủy' };
                                changes.push(`Trạng thái: ${statusMap[originalCrop.status] || originalCrop.status} ➔ ${statusMap[finalCrop.status] || finalCrop.status}`);
                            }
                            if (originalCrop.growthStage !== finalCrop.growthStage) changes.push(`Giai đoạn: ${originalCrop.growthStage || 'N/A'} ➔ ${finalCrop.growthStage || 'N/A'}`);
                            if (originalCrop.health !== finalCrop.health) changes.push(`Sức khỏe: ${originalCrop.health || 'N/A'} ➔ ${finalCrop.health || 'N/A'}`);
                            if (originalCrop.plantingDate !== finalCrop.plantingDate) changes.push(`Ngày xuống giống: ${originalCrop.plantingDate || 'Chưa cập nhật'} ➔ ${finalCrop.plantingDate || 'Chưa cập nhật'}`);
                            if (originalCrop.expectedHarvestDate !== finalCrop.expectedHarvestDate) changes.push(`Thu hoạch dự kiến: ${originalCrop.expectedHarvestDate || 'Chưa cập nhật'} ➔ ${finalCrop.expectedHarvestDate || 'Chưa cập nhật'}`);
                            if (originalCrop.expectedYield !== finalCrop.expectedYield || originalCrop.yieldUnit !== finalCrop.yieldUnit) {
                                changes.push(`Sản lượng: ${originalCrop.expectedYield || 'Chưa cập nhật'} ${originalCrop.yieldUnit || ''} ➔ ${finalCrop.expectedYield || 'Chưa cập nhật'} ${finalCrop.yieldUnit || ''}`);
                            }
                            
                            if (changes.length > 0) changeDesc += " " + changes.join(" | ");
                            else changeDesc += " Giữ nguyên thông tin.";
                        } 

                        // Sync updated crop details into vietagri_active_farmers
                        try {
                            const rawFarmers = localStorage.getItem('vietagri_active_farmers');
                            if (rawFarmers) {
                                let farmersList = JSON.parse(rawFarmers);
                                const idx = farmersList.findIndex((f: any) => f.phone === currentFarmerPhone);
                                if (idx !== -1) {
                                    const cropIdx = farmersList[idx].crops.findIndex((c: any) => c.name === finalCrop.name);
                                    if (cropIdx !== -1) {
                                        farmersList[idx].crops[cropIdx] = { ...finalCrop };
                                        localStorage.setItem('vietagri_active_farmers', JSON.stringify(farmersList));
                                    }
                                }
                            }
                        } catch(e) { console.error(e); }

                        // 2. Sync to pending_registration_members if it is linked
                        try {
                          const rawPending = localStorage.getItem('pending_registration_members');
                          if (rawPending) {
                            let pendingList = JSON.parse(rawPending);
                            if (Array.isArray(pendingList)) {
                              const pIdx = pendingList.findIndex((p: any) => p.type === 'crop_approval' && String(p.id) === String(finalCrop.id));
                              if (pIdx !== -1) {
                                pendingList[pIdx] = {
                                  ...pendingList[pIdx],
                                  cropStatus: finalCrop.status,
                                  growthStage: finalCrop.growthStage,
                                  health: finalCrop.health,
                                  plantingDate: finalCrop.plantingDate,
                                  expectedHarvestDate: finalCrop.expectedHarvestDate,
                                  expectedYield: finalCrop.expectedYield,
                                  yieldUnit: finalCrop.yieldUnit,
                                  postHarvestAction: finalCrop.postHarvestAction
                                };
                                localStorage.setItem('pending_registration_members', JSON.stringify(pendingList));
                              }
                            }
                          }
                        } catch (e) {
                          console.error("Error updating pending crop status:", e);
                        }

                        // 3. Send Crop Report to Admin
                        try {
                          const rawPending = localStorage.getItem('pending_registration_members') || '[]';
                          let pendingList = JSON.parse(rawPending);
                          const reportId = `REP-${Date.now()}`;
                          const reportEntry = {
                            id: reportId,
                            type: 'crop_report',
                            name: farmerName,
                            phone: currentFarmerPhone,
                            cooperativeId: farmerCooperativeId || 'HTX-001',
                            cropName: finalCrop.name,
                            area: finalCrop.area,
                            status: 'pending',
                            cropStatus: finalCrop.status,
                            growthStage: finalCrop.growthStage || 'N/A',
                            health: finalCrop.health || 'Bình thường',
                            plantingDate: finalCrop.plantingDate || 'Chưa cập nhật',
                            expectedHarvestDate: finalCrop.expectedHarvestDate || 'Chưa cập nhật',
                            expectedYield: finalCrop.expectedYield || '',
                            yieldUnit: finalCrop.yieldUnit || 'tấn',
                            postHarvestAction: finalCrop.postHarvestAction || 'new_season',
                            seasonNumber: finalCrop.seasonNumber || 1,
                            reportDetails: changeDesc,
                            createdAt: new Date().toISOString()
                          };
                          pendingList.push(reportEntry);
                          localStorage.setItem('pending_registration_members', JSON.stringify(pendingList));
                        } catch (e) {
                          console.error("Error saving crop reports into pending registrations:", e);
                        }
                        
                        alert(isNewSeasonConfirm ? 'Xác nhận tiếp tục mùa vụ mới thành công!' : 'Đã cập nhật thông tin cây trồng và tự động gửi báo cáo tiến độ về HTX!');
                        
                        setIsUpdateModalOpen(false);
                      }}
                      className="flex-2 py-4 bg-[#059669] text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-[#047857] transition-colors shadow-lg shadow-emerald-100"
                    >
                      {selectedCrop.seasonApprovalCode ? 'Xác nhận tiếp tục mùa vụ mới' : 'Lưu thay đổi'}
                    </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
