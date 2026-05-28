import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Phone, 
  User, 
  CreditCard, 
  ShieldCheck, 
  Sprout, 
  Landmark, 
  LogOut, 
  Briefcase,
  Mail,
  MapPin,
  Calendar,
  Save,
  Edit2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import authService from '../../services/authService';

const COOPERATIVES = [
  { id: 'HTX-001', name: 'HTX Cà phê Cầu Đất' },
  { id: 'HTX-002', name: 'HTX Hoa Đà Lạt' },
  { id: 'HTX-003', name: 'HTX Nông sản Đức Trọng' },
  { id: 'HTX-004', name: 'HTX Rừng Thông Lâm Đồng' },
  { id: 'HTX-005', name: 'HTX Công Nghệ Cao Q1' },
];

export default function FarmerProfilePage() {
    const navigate = useNavigate();
    const [farmer, setFarmer] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [saveMessage, setSaveMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const phone = localStorage.getItem('userPhone') || JSON.parse(localStorage.getItem('current_user') || '{}').phone;
                
                if (!phone) {
                    navigate('/login');
                    return;
                }

                const savedFarmersRaw = localStorage.getItem('vietagri_active_farmers');
                let foundFarmer: any = null;
                
                if (savedFarmersRaw) {
                    const farmers = JSON.parse(savedFarmersRaw);
                    foundFarmer = farmers.find((f: any) => f.phone === phone);
                }

                const storedAdminsRaw = localStorage.getItem('registered_admins');
                const allAdmins = storedAdminsRaw ? JSON.parse(storedAdminsRaw) : [];

                if (!foundFarmer) {
                    const foundAdmin = allAdmins.find((a: any) => a.phone === phone);
                    if (foundAdmin) {
                        foundFarmer = { ...foundAdmin };
                    }
                }

                if (!foundFarmer && phone === '001') {
                    foundFarmer = {
                        id: 'F-001',
                        memberId: 'XV-001',
                        name: 'Lê Văn Tám',
                        phone: '001',
                        dob: '15/05/1985',
                        gender: 'Nam',
                        nationality: 'Việt Nam',
                        permanentAddress: 'Lâm Hà, Lâm Đồng',
                        contactAddress: 'Lâm Hà, Lâm Đồng',
                        cccd: '079204001122',
                        idDate: '20/10/2021',
                        idPlace: 'Cục CS QLHC về TTXH',
                        joiningDate: '12/03/2022',
                        terminationDate: '---',
                        capitalContribution: '50000000',
                        capitalRatio: '2.5',
                        contributionDate: '15/03/2022',
                        email: 'vantam@gmail.com',
                        area: '3.0',
                        location: 'Tổ 5, Thôn 2, Lâm Hà',
                        crop: 'Cà phê Arabica',
                        qualityStandard: 'VietGAP',
                        bankAccNumber: '123456789',
                        bankName: 'Agribank',
                        bankAccHolder: 'LE VAN TAM',
                        cooperativeId: 'HTX-001'
                    };
                }

                const fullProfile = {
                    memberId: foundFarmer?.memberId || foundFarmer?.id || `XV-${phone}`,
                    name: foundFarmer?.name || 'Thành viên HTX',
                    dob: foundFarmer?.dob || '',
                    gender: foundFarmer?.gender || 'Nam',
                    nationality: foundFarmer?.nationality || 'Việt Nam',
                    permanentAddress: foundFarmer?.permanentAddress || foundFarmer?.address || '',
                    contactAddress: foundFarmer?.contactAddress || foundFarmer?.address || '',
                    cccd: foundFarmer?.cccd || '',
                    idDate: foundFarmer?.idDate || '',
                    idPlace: foundFarmer?.idPlace || '',
                    joiningDate: foundFarmer?.joiningDate || '',
                    terminationDate: foundFarmer?.terminationDate || '---',
                    capitalContribution: foundFarmer?.capitalContribution || '0',
                    capitalRatio: foundFarmer?.capitalRatio || '0',
                    contributionDate: foundFarmer?.contributionDate || '',
                    phone: foundFarmer?.phone || phone,
                    email: foundFarmer?.email || '',
                    area: foundFarmer?.area || '0',
                    location: foundFarmer?.location || '',
                    crop: foundFarmer?.crop || 'Cà phê Arabica',
                    qualityStandard: foundFarmer?.qualityStandard || 'VietGAP',
                    bankAccNumber: foundFarmer?.bankAccNumber || '',
                    bankName: foundFarmer?.bankName || '',
                    bankAccHolder: foundFarmer?.bankAccHolder || (foundFarmer?.name || '').toUpperCase(),
                    cooperativeId: foundFarmer?.cooperativeId || 'HTX-001',
                    htxName: '', 
                    id: foundFarmer?.id || `F-${phone}`
                };

                const htx = COOPERATIVES.find(c => c.id === fullProfile.cooperativeId);
                fullProfile.htxName = htx ? htx.name : 'HTX Cà phê Cầu Đất';

                setFarmer(fullProfile);
                setFormData(fullProfile);
            } catch (err) {
                console.error("Error loading profile:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const handleSave = () => {
        setIsLoading(true);
        const savedFarmersRaw = localStorage.getItem('vietagri_active_farmers');
        let farmers = savedFarmersRaw ? JSON.parse(savedFarmersRaw) : [];
        const existingIndex = farmers.findIndex((f: any) => f.phone === farmer.phone);
        if (existingIndex >= 0) {
            farmers[existingIndex] = { ...farmers[existingIndex], ...formData };
        } else {
            farmers.push(formData);
        }
        localStorage.setItem('vietagri_active_farmers', JSON.stringify(farmers));

        const storedAdmins = localStorage.getItem('registered_admins');
        if (storedAdmins) {
            const admins = JSON.parse(storedAdmins);
            const updatedAdmins = admins.map((a: any) => a.phone === farmer.phone ? { ...a, ...formData } : a);
            localStorage.setItem('registered_admins', JSON.stringify(updatedAdmins));
        }

        const currentUser = localStorage.getItem('current_user');
        if (currentUser) {
            const parsed = JSON.parse(currentUser);
            localStorage.setItem('current_user', JSON.stringify({ ...parsed, name: formData.name, phone: formData.phone }));
        }
        localStorage.setItem('userPhone', formData.phone);

        setFarmer(formData);
        setIsEditing(false);
        setIsLoading(false);
        setSaveMessage('Cập nhật thành công!');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (isLoading && !farmer) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!farmer) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10">
            {/* Native Mobile Style Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => navigate('/farmer-dashboard')} 
                        className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-600"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <span className="font-black text-xs uppercase tracking-widest text-slate-400">Hồ sơ nông dân</span>
                </div>
                
                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-100"
                        >
                            <Edit2 size={18} />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => { setFormData(farmer); setIsEditing(false); }}
                                className="bg-slate-100 text-slate-500 p-2.5 rounded-xl"
                            >
                                <X size={18} />
                            </button>
                            <button 
                                onClick={handleSave}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100"
                            >
                                <Save size={16} /> Lưu
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="p-2.5 bg-rose-50 text-rose-500 rounded-xl border border-rose-100"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className="px-4 pt-6 space-y-6 max-w-lg mx-auto">
                {/* Profile Summary Card */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="w-20 h-20 bg-forest text-white rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 shadow-xl shadow-emerald-900/10">
                        {farmer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl font-black text-slate-900 truncate tracking-tight">{farmer.name}</h1>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 truncate">
                            {farmer.htxName}
                        </p>
                        <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[8px] font-black uppercase tracking-wider border border-emerald-100">
                                nông dân
                            </span>
                            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md text-[8px] font-black uppercase tracking-wider border border-slate-100">
                                ID: {farmer.memberId}
                            </span>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {saveMessage && (
                        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="p-3 bg-emerald-600 text-white rounded-xl text-center text-[10px] font-black uppercase tracking-widest">
                            {saveMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form Sections */}
                <div className="space-y-4">
                    <SectionContainer title="I. Định danh Cá nhân" icon={<User size={18} />}>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <FieldItem label="Mã số nông dân" value={formData.memberId} disabled />
                            <FieldItem label="Họ và tên" value={formData.name} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, name: v}))} />
                            <div className="grid grid-cols-2 gap-4">
                                <FieldItem label="Ngày sinh" value={formData.dob} isEditing={isEditing} placeholder="23/05/1985" onChange={(v) => setFormData((prev: any) => ({...prev, dob: v}))} />
                                <FieldItem label="Giới tính" value={formData.gender} isEditing={isEditing} type="select" options={['Nam', 'Nữ', 'Khác']} onChange={(v) => setFormData((prev: any) => ({...prev, gender: v}))} />
                            </div>
                            <FieldItem label="Quốc tịch" value={formData.nationality} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, nationality: v}))} />
                            <FieldItem label="Địa chỉ thường trú" value={formData.permanentAddress} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, permanentAddress: v}))} />
                            <FieldItem label="Địa chỉ liên lạc" value={formData.contactAddress} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, contactAddress: v}))} />
                        </div>
                    </SectionContainer>

                    <SectionContainer title="II. Giấy tờ Chứng thực" icon={<CreditCard size={18} />}>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <FieldItem label="Số CCCD" value={formData.cccd} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, cccd: v}))} />
                            <div className="grid grid-cols-2 gap-4">
                                <FieldItem label="Ngày cấp" value={formData.idDate} isEditing={isEditing} placeholder="DD/MM/YYYY" onChange={(v) => setFormData((prev: any) => ({...prev, idDate: v}))} />
                                <FieldItem label="Nơi cấp" value={formData.idPlace} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, idPlace: v}))} />
                            </div>
                        </div>
                    </SectionContainer>

                    <SectionContainer title="III. Thành viên & Vốn" icon={<Briefcase size={18} />}>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <FieldItem label="Ngày gia nhập" value={formData.joiningDate} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, joiningDate: v}))} />
                            <FieldItem label="Ngày chấm dứt" value={formData.terminationDate} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, terminationDate: v}))} />
                            <div className="grid grid-cols-2 gap-4">
                                <FieldItem label="Vốn góp (VNĐ)" value={formData.capitalContribution} type="number" isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, capitalContribution: v}))} />
                                <FieldItem label="Tỷ lệ (%)" value={formData.capitalRatio} type="number" isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, capitalRatio: v}))} />
                            </div>
                            <FieldItem label="Thời điểm góp vốn" value={formData.contributionDate} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, contributionDate: v}))} />
                        </div>
                    </SectionContainer>

                    <SectionContainer title="IV. Liên hệ & Sản xuất" icon={<Sprout size={18} />}>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <FieldItem label="Số điện thoại" value={formData.phone} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, phone: v}))} />
                            <FieldItem label="Email" value={formData.email} isEditing={isEditing} type="email" onChange={(v) => setFormData((prev: any) => ({...prev, email: v}))} />
                            <div className="grid grid-cols-2 gap-4">
                                <FieldItem label="Diện tích (ha)" value={formData.area} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, area: v}))} />
                                <FieldItem label="Nông sản chính" value={formData.crop} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, crop: v}))} />
                            </div>
                            <FieldItem label="Vị trí vùng trồng" value={formData.location} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, location: v}))} />
                            <FieldItem label="Tiêu chuẩn áp dụng" value={formData.qualityStandard} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, qualityStandard: v}))} />
                        </div>
                    </SectionContainer>

                    <SectionContainer title="V. Ngân hàng" icon={<Landmark size={18} />}>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <FieldItem label="Số tài khoản" value={formData.bankAccNumber} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, bankAccNumber: v}))} />
                            <FieldItem label="Ngân hàng" value={formData.bankName} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, bankName: v}))} />
                            <FieldItem label="Chủ tài khoản" value={formData.bankAccHolder} isEditing={isEditing} onChange={(v) => setFormData((prev: any) => ({...prev, bankAccHolder: v.toUpperCase()}))} />
                        </div>
                    </SectionContainer>
                </div>
            </main>
        </div>
    );
}

function SectionContainer({ title, icon, children }: any) {
    return (
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg">{icon}</div>
                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{title}</h3>
            </div>
            {children}
        </section>
    );
}

function FieldItem({ label, value, isEditing, onChange, type = 'text', options = [], placeholder = '', disabled = false }: any) {
    return (
        <div className="space-y-1.5 min-w-0">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
            {!isEditing || disabled ? (
                <div className={`px-4 py-3 rounded-xl font-bold text-xs border border-transparent transition-all truncate ${disabled ? 'bg-slate-50 text-slate-400' : 'bg-slate-50 text-slate-800'}`}>
                    {value || '---'}
                </div>
            ) : (
                <div className="relative">
                    {type === 'select' ? (
                        <select 
                            className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-slate-800 appearance-none transition-all shadow-sm"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                        >
                            {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                        </select>
                    ) : (
                        <input 
                            type={type}
                            placeholder={placeholder}
                            className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-xs text-slate-800 transition-all shadow-sm placeholder:text-slate-300 placeholder:italic placeholder:font-normal"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

