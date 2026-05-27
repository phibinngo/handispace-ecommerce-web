import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function ProfileLayout({ children, user, activeTab, setActiveTab }) {
    // State quản lý modal xem hạng
    const [showLevelModal, setShowLevelModal] = useState(false);

    // Dữ liệu các hạng thành viên (Dựa trên DB của bạn)
    const loyaltyLevels = [
        { name: 'Thành viên Mới', min_spend: 0, discount: 0, color: 'text-green-600 bg-green-50 border-green-200' },
        { name: 'Thành viên Bạc', min_spend: 2000000, discount: 2, color: 'text-slate-600 bg-slate-100 border-slate-300' },
        { name: 'Thành viên Vàng', min_spend: 5000000, discount: 5, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
        { name: 'Thành viên Kim Cương', min_spend: 10000000, discount: 10, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Đăng xuất?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đăng xuất',
            confirmButtonColor: '#d33'
        }).then((result) => { 
            if (result.isConfirmed) router.post('/logout'); 
        });
    };

    // Hàm chọn màu cho huy hiệu (Logic hiển thị đẹp)
    const getBadgeStyle = (levelName) => {
        if (!levelName) return 'bg-gray-100 text-gray-600 border-gray-200';
        const name = levelName.toLowerCase();
        
        if (name.includes('kim cương') || name.includes('diamond')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (name.includes('vàng') || name.includes('gold')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        if (name.includes('bạc') || name.includes('silver')) return 'bg-slate-100 text-slate-700 border-slate-300';
        return 'bg-green-50 text-green-700 border-green-200'; 
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // Tính toán số tiền cần chi thêm để lên hạng tiếp theo
    const getNextLevelInfo = () => {
        if (!user) return null;
        const currentSpent = parseFloat(user.total_spent || 0);
        // Tìm level tiếp theo có min_spend > currentSpent
        const nextLevel = loyaltyLevels.find(l => l.min_spend > currentSpent);
        
        if (nextLevel) {
            const needed = nextLevel.min_spend - currentSpent;
            return { nextLevelName: nextLevel.name, needed: needed };
        }
        return null; // Đã đạt max level
    };

    const nextLevelInfo = getNextLevelInfo();

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-10 relative">
            
            {/* --- MENU TRÁI (SIDEBAR) --- */}
            <div className="md:col-span-1">
                <div className="sticky top-24 space-y-4">
                    
                    {/* Avatar & Tên & Hạng */}
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-3xl mb-4 text-indigo-600">
                            👤
                        </div>
                        <h2 className="font-bold text-xl text-gray-800 truncate" title={user?.name}>
                            {user?.name || 'User'}
                        </h2>
                        
                        {/* 👇 Hiển thị Huy hiệu Thành viên (Bấm vào để mở Modal) */}
                        <div 
                            onClick={() => setShowLevelModal(true)}
                            className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border cursor-pointer hover:opacity-80 transition select-none ${getBadgeStyle(user?.loyalty_level?.name)}`}
                            title="Click để xem quyền lợi thành viên"
                        >
                            {user?.loyalty_level ? user.loyalty_level.name : 'Thành viên'} <i className="fa-solid fa-circle-info ml-1 text-[10px]"></i>
                        </div>

                        {/* Hiển thị tổng chi tiêu */}
                        <p className="text-xs text-gray-400 mt-2">
                            Chi tiêu: <span className="font-medium text-gray-600">{formatPrice(user?.total_spent || 0)}</span>
                        </p>
                    </div>

                    {/* Danh sách Menu */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <button 
                            onClick={() => setActiveTab('profile')} 
                            className={`w-full text-left px-6 py-4 border-b hover:bg-gray-50 transition flex items-center gap-3 ${activeTab === 'profile' ? 'font-bold text-indigo-600 border-l-4 border-l-indigo-600 bg-indigo-50' : ''}`}
                        >
                            Thông tin cá nhân
                        </button>
                        
                        <button 
                            onClick={() => setActiveTab('addresses')} 
                            className={`w-full text-left px-6 py-4 border-b hover:bg-gray-50 transition flex items-center gap-3 ${activeTab === 'addresses' ? 'font-bold text-indigo-600 border-l-4 border-l-indigo-600 bg-indigo-50' : ''}`}
                        >
                            Danh sách địa chỉ
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')} 
                            className={`w-full text-left px-6 py-4 border-b hover:bg-gray-50 transition flex items-center gap-3 ${activeTab === 'orders' ? 'font-bold text-indigo-600 border-l-4 border-l-indigo-600 bg-indigo-50' : ''}`}
                        >
                            Lịch sử đơn hàng
                        </button>
                        
                        <button 
                            onClick={handleLogout} 
                            className="w-full text-left px-6 py-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition flex items-center gap-3 border-t border-gray-100"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>

            {/* --- NỘI DUNG PHẢI (CONTENT) --- */}
            <div className="md:col-span-3">
                {children}
            </div>

            {/* 👇 MODAL CHI TIẾT HẠNG THÀNH VIÊN 👇 */}
            {showLevelModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLevelModal(false)}></div>
                    
                    {/* Modal Content */}
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-fade-in-up">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-600 to-red-500 p-6 text-white text-center">
                            <h3 className="text-xl font-bold uppercase tracking-wide">Hạng Thành Viên</h3>
                            <p className="text-sm opacity-90 mt-1">Chi tiêu tích lũy để nhận ưu đãi</p>
                            <button 
                                onClick={() => setShowLevelModal(false)} 
                                className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            {/* Current User Status */}
                            <div className="text-center mb-6">
                                <p className="text-gray-500 text-sm">Bạn đang chi tiêu</p>
                                <p className="text-2xl font-black text-gray-800">{formatPrice(user?.total_spent || 0)}</p>
                                {nextLevelInfo ? (
                                    <p className="text-xs text-orange-600 mt-1 font-medium">
                                        Cần thêm {formatPrice(nextLevelInfo.needed)} để lên <span className="uppercase">{nextLevelInfo.nextLevelName}</span>
                                    </p>
                                ) : (
                                    <p className="text-xs text-green-600 mt-1 font-bold">Bạn đã đạt cấp cao nhất!</p>
                                )}
                            </div>

                            {/* List Levels */}
                            <div className="space-y-3">
                                {loyaltyLevels.map((level, idx) => {
                                    const isCurrent = user?.loyalty_level?.name === level.name;
                                    return (
                                        <div key={idx} className={`flex justify-between items-center p-3 rounded-lg border ${isCurrent ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-100 hover:bg-gray-50'}`}>
                                            <div>
                                                <h4 className={`font-bold text-sm ${level.name.includes('Kim Cương') ? 'text-purple-600' : level.name.includes('Vàng') ? 'text-yellow-600' : 'text-gray-700'}`}>
                                                    {level.name} {isCurrent && <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded ml-2">Của bạn</span>}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">Chi tiêu: {formatPrice(level.min_spend)}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-bold text-green-600">Giảm {level.discount}%</span>
                                                <span className="text-[10px] text-gray-400">trên đơn hàng</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}