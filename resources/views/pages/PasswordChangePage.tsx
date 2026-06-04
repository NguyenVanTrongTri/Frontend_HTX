import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function PasswordChangePage() {
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const currentRaw = localStorage.getItem('current_user');
        const user = JSON.parse(currentRaw || '{}');
        const phone = user.phone || localStorage.getItem('userPhone');
        
        if (phone) {
            try {
                // Ket noi API
                await authService.updateAdminPassword(phone, newPassword);
                
                // Update local storage so the prompt doesn't show again
                if (currentRaw) {
                    const updatedUser = { ...user, passwordChanged: true };
                    localStorage.setItem('current_user', JSON.stringify(updatedUser));
                }

                // Keep password in sync with other lists if they exist (Legacy support)
                const savedFarmersRaw = localStorage.getItem('vietagri_active_farmers');
                if (savedFarmersRaw) {
                    try {
                        const farmersList = JSON.parse(savedFarmersRaw);
                        const updatedFarmers = farmersList.map((f: any) => 
                            f.phone === phone ? { ...f, password: newPassword, passwordChanged: true } : f
                        );
                        localStorage.setItem('vietagri_active_farmers', JSON.stringify(updatedFarmers));
                    } catch (e) {}
                }

                setIsSuccess(true);
                
                // Delay navigation to show success message
                setTimeout(() => {
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
                    } else if (role === 'enterprise' || role === 'customer') {
                        navigate('/customer-dashboard');
                    } else if (role === 'admin' || role === 'admin1' || role === 'admin2' || role === 'admin3') {
                        navigate('/admin');
                    } else if (role === 'super-admin' || role === 'superadmin') {
                        navigate('/super-admin');
                    } else {
                        navigate('/');
                    }
                }, 1500);
            } catch (err) {
                console.error("Password update error:", err);
                setError('Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6 font-sans">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-emerald-100">
                <h2 className="text-3xl font-extrabold mb-2 text-slate-900">Thiết lập mật khẩu</h2>
                <p className="text-slate-500 mb-8">Vui lòng thay đổi mật khẩu của bạn để bảo mật tài khoản.</p>
                
                {isSuccess && (
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl mb-6 font-bold text-center border border-emerald-200 animate-pulse">
                        Cập nhật mật khẩu thành công! Đang chuyển hướng...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 font-medium text-center border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Mật khẩu mới</label>
                        <input 
                            type="password" 
                            disabled={isLoading || isSuccess}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading || isSuccess}
                        className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                    >
                        {isLoading ? 'Đang cập nhật...' : 'Xác nhận thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
}
