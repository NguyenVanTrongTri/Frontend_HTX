import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function PasswordChangePage() {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
        const phone = user.phone || localStorage.getItem('userPhone');
        
        if (phone) {
            try {
                await authService.updateAdminPassword(phone, newPassword);
                
                // Keep password in sync with other lists if they exist
                const savedFarmersRaw = localStorage.getItem('vietagri_active_farmers');
                if (savedFarmersRaw) {
                    const farmersList = JSON.parse(savedFarmersRaw);
                    const updatedFarmers = farmersList.map((f: any) => 
                        f.phone === phone ? { ...f, password: newPassword } : f
                    );
                    localStorage.setItem('vietagri_active_farmers', JSON.stringify(updatedFarmers));
                }

                // Get role for navigation
                const role = user.role || localStorage.getItem('userRole');

                if (role && (
                    role === 'farmer' || 
                    role === 'farmer-member' || 
                    role === 'Nhân viên' || 
                    role === 'Kế toán HTX' || 
                    role === 'Nhân viên Thu mua' || 
                    role === 'Nhân viên Kho' || 
                    role === 'Quản lý Vùng trồng'
                )) {
                    navigate('/farmer-dashboard');
                } else if (role === 'enterprise') {
                    navigate('/customer-dashboard');
                } else if (role === 'admin' || role === 'admin1' || role === 'admin2' || role === 'admin3') {
                    navigate('/admin');
                } else if (role === 'super-admin' || role === 'superadmin') {
                    navigate('/super-admin');
                } else {
                    navigate('/');
                }
            } catch (err) {
                setError('Có lỗi xảy ra, vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 font-sans">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-emerald-100">
                <h2 className="text-3xl font-extrabold mb-2 text-slate-900">Thiết lập mật khẩu</h2>
                <p className="text-slate-500 mb-8">Vui lòng thay đổi mật khẩu của bạn để bảo mật tài khoản.</p>
                {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
                <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật khẩu mới"
                    className="w-full p-4 border border-slate-200 rounded-2xl mb-6 text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                />
                <button type="submit" className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">
                    Cập nhật mật khẩu
                </button>
            </form>
        </div>
    );
}
