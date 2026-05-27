import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import ProfileLayout from '@/Layouts/ProfileLayout';
import Swal from 'sweetalert2';

export default function UserDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(() => {
        // 1. Lấy tham số trên URL (ví dụ: ?tab=addresses)
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        
        // 2. Nếu có tham số 'tab' thì dùng nó, nếu không thì mặc định vào 'profile'
        return tabParam ? tabParam : 'profile';
    });
    const [filterStatus, setFilterStatus] = useState('all');

    // State Modal & Form
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null); 
    const [addressForm, setAddressForm] = useState({
        receiver_name: '', receiver_phone: '', address_name: '',
        province: '', ward: '', street_address: '', is_default: false
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = () => {
        axios.get('/api/my-profile').then(res => {
            setData(res.data);
            setProfileForm({ name: res.data.user.name, phone: res.data.user.phone || '' });
            setLoading(false);
        }).catch(err => console.error(err));
    };

    // --- LOGIC HELPER ---
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    
    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'return_pending': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'returned': return 'bg-gray-700 text-white border-gray-800';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusName = (status) => {
        const map = {
            'pending': 'Chờ xử lý', 'processing': 'Đang chuẩn bị', 'shipped': 'Đang giao',
            'completed': 'Hoàn thành', 'cancelled': 'Đã hủy', 'return_pending': 'Đang trả hàng', 'returned': 'Đã trả hàng'
        };
        return map[status.toLowerCase()] || status;
    };

    const filteredOrders = data?.orders ? data.orders.filter(order => {
        if (filterStatus === 'all') return true;
        return order.status.toLowerCase() === filterStatus;
    }) : [];

    // --- LOGIC XỬ LÝ ĐƠN HÀNG ---
    const handleCancelOrder = (id) => {
        Swal.fire({
            title: 'Yêu cầu hủy đơn', text: 'Vui lòng cho biết lý do :',
            input: 'textarea',
            showCancelButton: true, confirmButtonText: 'Xác nhận hủy', confirmButtonColor: '#d33', cancelButtonText: 'Quay lại',
            preConfirm: (value) => { if (!value) Swal.showValidationMessage('Vui lòng chọn lý do hủy đơn!'); return value; }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                axios.post(`/api/orders/${id}/cancel`, { reason: result.value })
                    .then(() => { Swal.fire('Đã hủy', 'Đơn hàng đã hủy thành công.', 'success'); fetchProfile(); })
                    .catch(err => Swal.fire('Lỗi', err.response?.data?.message || 'Lỗi', 'error'));
            }
        });
    };

    const handleReturnRequest = (id) => {
        Swal.fire({
            title: 'Yêu cầu trả hàng', text: 'Vui lòng cho biết lý do và tình trạng sản phẩm:',
            input: 'textarea', inputPlaceholder: 'Ví dụ: Sản phẩm lỗi...',
            showCancelButton: true, confirmButtonText: 'Gửi yêu cầu', confirmButtonColor: '#f39c12', cancelButtonText: 'Hủy',
            preConfirm: (value) => { if (!value.trim()) Swal.showValidationMessage('Yêu cầu nhập lý do trả hàng!'); return value; }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                axios.post(`/api/orders/${id}/return`, { reason: result.value })
                    .then(() => { Swal.fire('Thành công', 'Đã gửi yêu cầu trả hàng.', 'success'); fetchProfile(); })
                    .catch(err => Swal.fire('Lỗi', err.response?.data?.message || 'Lỗi', 'error'));
            }
        });
    };

    const handleRating = async (id) => {
        const { value: formValues } = await Swal.fire({
            title: 'Đánh giá đơn hàng',
            html: '<p class="text-sm text-gray-500 mb-2">Chia sẻ cảm nhận của bạn!</p><textarea id="swal-content" class="swal2-textarea" placeholder="Nhập nội dung..."></textarea><input id="swal-image" type="file" accept="image/*" class="swal2-file" style="display:flex; margin: 10px auto;">',
            focusConfirm: false, showCancelButton: true, confirmButtonText: 'Gửi đánh giá', confirmButtonColor: '#28a745',
            preConfirm: () => {
                const content = document.getElementById('swal-content').value;
                const imageInput = document.getElementById('swal-image');
                if (!content.trim()) { Swal.showValidationMessage('Vui lòng nhập nội dung đánh giá!'); return false; }
                return { content: content, image: imageInput.files[0] };
            }
        });

        if (formValues) {
            const formData = new FormData();
            formData.append('content', formValues.content);
            if (formValues.image) formData.append('image', formValues.image);

            axios.post(`/api/orders/${id}/rate`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(() => { Swal.fire('Tuyệt vời!', 'Cảm ơn bạn đã đánh giá.', 'success'); fetchProfile(); })
                .catch(err => {
                    const message = err.response?.data?.message || 'Có lỗi xảy ra';
                    const errors = err.response?.data?.errors;
                    let errorDetails = '';
                    if (errors) { errorDetails = Object.values(errors).flat().join('\n'); }
                    Swal.fire('Không gửi được!', errorDetails || message, 'error');
                });
        }
    };

    // --- CÁC HÀM XỬ LÝ KHÁC ---
    const handleUpdateProfile = (e) => { e.preventDefault(); axios.post('/api/update-info', profileForm).then(() => { Swal.fire('Thành công', 'Đã cập nhật!', 'success'); fetchProfile(); }).catch(() => Swal.fire('Lỗi', 'Lỗi cập nhật', 'error')); };
    const openAddModal = () => { setEditingAddressId(null); setAddressForm({ receiver_name: '', receiver_phone: '', address_name: '', province: '', ward: '', street_address: '', is_default: false }); setShowAddressModal(true); };
    const openEditModal = (addr) => { setEditingAddressId(addr.id); setAddressForm({ receiver_name: addr.receiver_name, receiver_phone: addr.receiver_phone, address_name: addr.address_name, province: addr.province, ward: addr.ward, street_address: addr.street_address, is_default: Boolean(addr.is_default) }); setShowAddressModal(true); };
    const handleSaveAddress = (e) => { e.preventDefault(); const apiCall = editingAddressId ? axios.put(`/api/update-address/${editingAddressId}`, addressForm) : axios.post('/api/add-address', addressForm); apiCall.then(() => { setShowAddressModal(false); Swal.fire('Thành công', 'Đã lưu địa chỉ!', 'success'); fetchProfile(); }).catch(() => Swal.fire('Lỗi', 'Kiểm tra lại thông tin', 'error')); };
    const handleDeleteAddress = (id) => { Swal.fire({ title: 'Xóa địa chỉ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa' }).then((r) => { if (r.isConfirmed) axios.delete(`/api/delete-address/${id}`).then(() => fetchProfile()); }); };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div></div>;

    return (
        <UserLayout title="Tài khoản của tôi">
            <ProfileLayout user={data.user} activeTab={activeTab} setActiveTab={setActiveTab}>
                
                {/* 1. TAB ORDERS */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-fade-in-up">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
                            <h3 className="text-xl font-bold text-gray-800">Đơn hàng của tôi ({data.orders.length})</h3>
                            <div className="relative">
                                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-sm">
                                    <option value="all">Tất cả</option>
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="processing">Đang chuẩn bị</option>
                                    <option value="shipped">Đang giao</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                    <option value="return_pending">Đang trả hàng</option>
                                    <option value="returned">Đã trả hàng</option>
                                </select>
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed">
                                <p className="text-gray-500 font-medium">Không tìm thấy đơn hàng nào.</p>
                                {filterStatus !== 'all' && <button onClick={() => setFilterStatus('all')} className="text-indigo-600 hover:underline mt-2 text-sm">Xóa bộ lọc</button>}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map(order => (
                                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition bg-white">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                                            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${getStatusColor(order.status)}`}>{getStatusName(order.status)}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-t pt-3">
                                            <div>
                                                <p className="text-sm text-gray-600">Tổng tiền: <span className="font-bold text-gray-900 text-lg">{formatPrice(order.total_price)}</span></p>
                                                <p className="text-xs text-gray-400">{order.items ? order.items.length : 0} sản phẩm</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setSelectedOrder(order)} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded font-bold transition">CHI TIẾT</button>
                                                
                                                {/* NÚT HỦY (Pending) */}
                                                {order.status === 'pending' && <button onClick={() => handleCancelOrder(order.id)} className="text-xs bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded font-bold transition">HỦY ĐƠN</button>}
                                                
                                                {/* NÚT TRẢ/ĐÁNH GIÁ (Completed) */}
                                                {order.status === 'completed' && (
                                                    <>
                                                        {!Boolean(order.is_rated) && order.status !== 'return_pending' && (
                                                            <>
                                                                <button onClick={() => handleReturnRequest(order.id)} className="text-xs bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white px-3 py-2 rounded font-bold transition">TRẢ HÀNG</button>
                                                                <button onClick={() => handleRating(order.id)} className="text-xs bg-green-100 text-green-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded font-bold transition">ĐÁNH GIÁ</button>
                                                            </>
                                                        )}
                                                        {Boolean(order.is_rated) && <span className="text-xs px-3 py-2 rounded bg-green-50 text-green-700 font-bold border border-green-200 cursor-default select-none flex items-center gap-1"><i className="fa-solid fa-check"></i> Đã đánh giá</span>}
                                                        {order.status === 'return_pending' && <span className="text-xs px-3 py-2 rounded bg-orange-50 text-orange-700 font-bold border border-orange-200 cursor-default">⏳ Đang chờ duyệt trả</span>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. TAB PROFILE */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Chỉnh sửa thông tin</h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                            <div><label className="block text-sm font-medium mb-1">Họ tên</label><input className="w-full p-3 border rounded-lg" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium mb-1">SĐT</label><input className="w-full p-3 border rounded-lg" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium mb-1">Email</label><input className="w-full p-3 border rounded-lg bg-gray-100" value={data.user.email} disabled /></div>
                            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Lưu thay đổi</button>
                        </form>
                    </div>
                )}

                {/* 👇 3. TAB ADDRESSES - ĐÃ SỬA GIAO DIỆN HOVER + ICON */}
                {activeTab === 'addresses' && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-xl font-bold text-gray-800">Sổ địa chỉ</h3>
                            <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition hover:bg-indigo-700">
                                <span className="text-lg">+</span> Thêm mới
                            </button>
                        </div>
                        {data.addresses.length === 0 ? <p className="text-center py-10 text-gray-500">Chưa có địa chỉ nào.</p> : (
                            <div className="space-y-4">
                                {data.addresses.map(addr => (
                                    <div key={addr.id} className={`border p-5 rounded-lg relative transition-all bg-gray-50/30 hover:border-indigo-300 hover:shadow-sm group ${Boolean(addr.is_default) ? 'ring-1 ring-green-500 bg-green-50/20' : ''}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">{addr.address_name || 'Địa chỉ'}</span>
                                                {Boolean(addr.is_default) && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold border border-green-200">Mặc định</span>}
                                            </div>
                                            
                                            {/* 👇 BUTTONS: CHỈ HIỆN KHI HOVER TRÊN PC (NHƯ ADMIN) */}
                                            <div className="flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                                <button onClick={() => openEditModal(addr)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 transition-colors">                                                    
                                                    Sửa
                                                </button>
                                                <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors">
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-700 mt-3">
                                            <p className="font-bold text-base text-gray-900">{addr.receiver_name}</p>
                                            <p>{addr.receiver_phone}</p>
                                            <p>{addr.street_address}, {addr.ward}, {addr.province}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </ProfileLayout>

            {/* MODAL CHI TIẾT ĐƠN HÀNG */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative z-10 p-0 overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <div><h3 className="text-lg font-bold text-gray-800">Chi tiết đơn hàng #{selectedOrder.id}</h3><p className="text-sm text-gray-500">Ngày đặt: {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p></div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="space-y-6">
                                <div><h4 className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-wider border-b pb-1">Địa chỉ nhận hàng</h4><div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200"><p className="font-bold text-gray-900 text-base mb-1">{selectedOrder.shipping_name}</p><p className="mb-1"><i className="fa-solid fa-phone text-gray-400 mr-1"></i> {selectedOrder.shipping_phone}</p><p><i className="fa-solid fa-map-pin text-gray-400 mr-1"></i> {selectedOrder.shipping_address}</p>{selectedOrder.note && <p className="mt-2 text-orange-600 italic border-t border-dashed pt-2 mt-2">" {selectedOrder.note} "</p>}</div></div>
                                <div><h4 className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-wider border-b pb-1">Thanh toán</h4><div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200"><div className="flex justify-between mb-2"><span>Phương thức:</span> <span className="font-bold uppercase text-gray-800">{selectedOrder.payment_method}</span></div><div className="flex justify-between items-center"><span>Trạng thái:</span> <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getStatusColor(selectedOrder.status)}`}>{getStatusName(selectedOrder.status)}</span></div></div></div>
                            </div>
                            <div><h4 className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-wider border-b pb-1">Sản phẩm</h4><div className="border rounded-lg overflow-hidden"><table className="w-full text-sm text-left"><thead className="bg-gray-100 text-gray-600 font-bold"><tr><th className="p-3">Món</th><th className="p-3 text-center">SL</th><th className="p-3 text-right">Tổng</th></tr></thead><tbody className="divide-y divide-gray-100">{selectedOrder.items && selectedOrder.items.map((item, idx) => (<tr key={idx}><td className="p-3">{item.product ? <Link href={`/product/${item.product.id}`} className="font-bold text-indigo-600 hover:underline hover:text-indigo-800 block">{item.product.name}</Link> : <span className="font-bold text-gray-500 italic">Sản phẩm đã xóa</span>}{item.custom_text && <p className="text-xs text-gray-500 mt-0.5">Note: {item.custom_text}</p>}</td><td className="p-3 text-center">x{item.quantity}</td><td className="p-3 text-right font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</td></tr>))}</tbody></table></div></div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-right space-y-2"><div className="flex justify-between text-gray-600"><span>Tạm tính:</span><span>{formatPrice(selectedOrder.subtotal)}</span></div><div className="flex justify-between text-gray-600"><span>Phí vận chuyển:</span><span>30.000 ₫</span></div>{Number(selectedOrder.discount_amount) > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Giảm giá:</span><span>-{formatPrice(selectedOrder.discount_amount)}</span></div>}<div className="flex justify-between text-lg font-extrabold text-indigo-700 border-t border-gray-300 pt-3 mt-2"><span>Tổng cộng:</span><span>{formatPrice(selectedOrder.total_price)}</span></div></div>
                            {selectedOrder.cancel_reason && <div className="bg-red-50 p-3 rounded text-sm text-red-700"><strong>Lý do hủy:</strong> {selectedOrder.cancel_reason}</div>}
                            {selectedOrder.return_reason && <div className="bg-orange-50 p-3 rounded text-sm text-orange-700"><strong>Lý do trả:</strong> {selectedOrder.return_reason}</div>}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ĐỊA CHỈ */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddressModal(false)}></div>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">{editingAddressId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                            <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleSaveAddress} className="space-y-4">
                            <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận</label><input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" required value={addressForm.receiver_name} onChange={e => setAddressForm({...addressForm, receiver_name: e.target.value})} /></div>
                            <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label><input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" required value={addressForm.receiver_phone} onChange={e => setAddressForm({...addressForm, receiver_phone: e.target.value})} /></div>
                            <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">Loại địa chỉ (Tùy chọn)</label><input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Nhà riêng, Công ty..." value={addressForm.address_name} onChange={e => setAddressForm({...addressForm, address_name: e.target.value})} /></div>
                            
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label><input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Tỉnh / Thành Phố" required value={addressForm.province} onChange={e => setAddressForm({...addressForm, province: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Xã / Phường</label><input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Xã / Phường" required value={addressForm.ward} onChange={e => setAddressForm({...addressForm, ward: e.target.value})} /></div>
                        
                            <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</label><input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="Số nhà, tên đường..." required value={addressForm.street_address} onChange={e => setAddressForm({...addressForm, street_address: e.target.value})} /></div>
                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100 transition"><input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" checked={addressForm.is_default} onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})} /><span className="text-sm font-medium text-gray-700">Đặt làm địa chỉ mặc định</span></label>
                            <div className="flex gap-3 mt-6"><button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition">Hủy</button><button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">Lưu địa chỉ</button></div>
                        </form>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}