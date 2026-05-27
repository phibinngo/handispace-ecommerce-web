    import React, { useState, useEffect } from 'react';
    import { useCart } from '@/Contexts/CartContext';
    import { usePage, Link, useForm } from '@inertiajs/react';
    import axios from 'axios';
    import Swal from 'sweetalert2';
    import UserLayout from '@/Layouts/UserLayout';

    export default function Checkout({ cartItems, user, summary, buyNowParams }) {
        const { auth } = usePage().props;

        // State quản lý địa chỉ
        const [savedAddresses, setSavedAddresses] = useState([]);
        const [showAddressModal, setShowAddressModal] = useState(false);
        const [selectedAddressLabel, setSelectedAddressLabel] = useState('');

        const { data, setData, post, processing, errors } = useForm({
            shipping_name: user.name || '',
            shipping_phone: user.phone || '',
            shipping_address: '',
            payment_method: 'COD',
            note: '',
            buy_now_params: buyNowParams // Gửi kèm tham số mua ngay nếu có
        });

        const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

        // Load danh sách địa chỉ
        useEffect(() => {
            if (auth.user) {
                axios.get('/api/my-profile')
                    .then(res => {
                        setSavedAddresses(res.data.addresses);
                        const defaultAddr = res.data.addresses.find(a => a.is_default);
                        if (defaultAddr) selectAddress(defaultAddr);
                    })
                    .catch(err => console.error(err));
            }
        }, [auth.user]);

        const selectAddress = (addr) => {
            setData(prev => ({
                ...prev,
                shipping_name: addr.receiver_name,
                shipping_phone: addr.receiver_phone,
                shipping_address: `${addr.street_address}, ${addr.ward}, ${addr.province}`
            }));
            setSelectedAddressLabel(addr.address_name || 'Địa chỉ'); 
            setShowAddressModal(false);
        };

        const handlePaymentChange = (e) => {
            const method = e.target.value;
            if (method === 'banking') {
                Swal.fire({
                    icon: 'info',
                    title: 'Tính năng đang phát triển',
                    html: 'Hệ thống thanh toán qua Ngân hàng/QR đang được bảo trì.<br>Vui lòng chọn thanh toán khi nhận hàng (COD).',
                    confirmButtonText: 'Đã hiểu',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            setData('payment_method', method);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!data.shipping_address) {
                Swal.fire('Thiếu thông tin', 'Vui lòng chọn địa chỉ giao hàng từ sổ địa chỉ', 'warning');
                return;
            }

            post(route('checkout.process'), {
                onSuccess: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đặt hàng thành công!',
                        text: 'Cảm ơn bạn đã mua sắm tại HandiSpace.',
                        confirmButtonColor: '#ea580c'
                    }).then(() => {
                        // Chỉ xóa giỏ hàng nếu mua bình thường (không phải mua ngay)
                        if (!buyNowParams) localStorage.removeItem('shopping-cart');
                    });
                },
                onError: (errors) => {
                    const msg = errors.error || 'Vui lòng kiểm tra lại thông tin giao hàng.';
                    Swal.fire('Lỗi', msg, 'error');
                }
            });
        };

        const handleImageError = (e) => { e.target.src = 'https://via.placeholder.com/64?text=No+Img'; };

        if (cartItems.length === 0 && !buyNowParams) {
            return (
                <UserLayout title="Thanh toán">
                    <div className="p-20 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-xl text-gray-500 mb-6">Giỏ hàng của bạn đang trống!</p>
                        <Link href="/shop" className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition">Tiếp tục mua sắm</Link>
                    </div>
                </UserLayout>
            );
        }

        return (
            <UserLayout title="Thanh toán - HandiSpace">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight text-center">Xác nhận thanh toán</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> Thông tin giao hàng
                                    </h2>
                                    <button type="button" onClick={() => setShowAddressModal(true)} className="text-sm text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                        <i className="fa-solid fa-address-book"></i> Chọn từ sổ địa chỉ
                                    </button>
                                </div>
                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-medium mb-1">Họ và tên</label><input required type="text" value={data.shipping_name} onChange={e => setData('shipping_name', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50" readOnly /></div>
                                        <div><label className="block text-sm font-medium mb-1">Số điện thoại</label><input required type="text" value={data.shipping_phone} onChange={e => setData('shipping_phone', e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50" readOnly /></div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Địa chỉ nhận hàng</label>
                                        <div className={`w-full p-3 border rounded-lg min-h-[50px] flex items-center ${data.shipping_address ? 'bg-gray-50 text-gray-800' : 'bg-white text-gray-400 border-dashed'}`}>
                                            {data.shipping_address || 'Vui lòng chọn từ sổ địa chỉ...'}
                                        </div>
                                        {data.shipping_address && (
                                            <div className="mt-2 text-sm text-green-800 bg-green-50 p-3 rounded border border-green-200 flex items-start gap-2">
                                                <i className="fa-solid fa-circle-check mt-0.5 text-green-600"></i> 
                                                <span><strong className="uppercase">{selectedAddressLabel}:</strong> {data.shipping_address}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div><label className="block text-sm font-medium mb-1">Ghi chú</label><textarea value={data.note} onChange={e => setData('note', e.target.value)} className="w-full p-3 border rounded-lg" rows="2" placeholder="Lời nhắn cho người bán..." /></div>
                                </form>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-4"><span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> Phương thức thanh toán</h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${data.payment_method === 'COD' ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'}`}>
                                        <input type="radio" name="payment_method" value="COD" checked={data.payment_method === 'COD'} onChange={handlePaymentChange} className="text-orange-600 focus:ring-orange-500" />
                                        <span className="font-bold text-gray-700">Thanh toán khi nhận hàng (COD)</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${data.payment_method === 'banking' ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'}`}>
                                        <input type="radio" name="payment_method" value="banking" checked={data.payment_method === 'banking'} onChange={handlePaymentChange} className="text-orange-600 focus:ring-orange-500" />
                                        <span className="font-bold text-gray-700">Chuyển khoản ngân hàng</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* phải */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Đơn hàng của bạn</h2>
                                <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                    {cartItems.map((item, index) => {
                                        let img = 'https://via.placeholder.com/50';
                                        try { 
                                            const parsed = typeof item.product.image === 'string' ? JSON.parse(item.product.image) : item.product.image;
                                            img = Array.isArray(parsed) ? parsed[0] : parsed;
                                        } catch(e) { img = item.product.image; }

                                        return (
                                            <div key={index} className="flex gap-3 items-center">
                                                <div className="relative">
                                                    <img src={img} alt={item.product.name} onError={handleImageError} className="w-14 h-14 object-cover rounded border" />
                                                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow">{item.quantity}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-800 truncate">{item.product.name}</h4>
                                                    <p className="text-xs text-gray-500">{formatPrice(item.product.price)}</p>
                                                </div>
                                                <div className="font-bold text-sm text-gray-700">{formatPrice(item.product.price * item.quantity)}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/*  PHẦN TỔNG KẾT SỬ DỤNG DỮ LIỆU TỪ SERVER  */}
                                <div className="space-y-3 pt-4 border-t border-dashed border-gray-200 text-sm">
                                    <div className="flex justify-between text-gray-600"><span>Tạm tính:</span><span className="font-medium">{formatPrice(summary.subtotal)}</span></div>
                                    <div className="flex justify-between text-gray-600"><span>Phí vận chuyển:</span><span className="font-medium">{formatPrice(summary.shipping_fee)}</span></div>
                                    
                                    {summary.discount_amount > 0 && (
                                        <div className="flex justify-between text-green-600 font-bold bg-green-50 p-2 rounded border border-green-100 animate-pulse">
                                            <span className="flex items-center gap-1">
                                                <i className="fa-solid fa-crown text-yellow-500"></i> 
                                                Ưu đãi {user.loyalty_level?.name} (-{summary.discount_percent}%):
                                            </span>
                                            <span>-{formatPrice(summary.discount_amount)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center text-xl font-black text-orange-600 mt-6 pt-4 border-t border-gray-200">
                                    <span>Tổng cộng:</span><span>{formatPrice(summary.total)}</span>
                                </div>

                                <button type="submit" form="checkout-form" disabled={processing} className={`w-full text-white font-bold py-4 rounded-xl mt-6 transition-all ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-orange-600'}`}>
                                    {processing ? 'Đang xử lý...' : 'ĐẶT HÀNG NGAY'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MODAL CHỌN ĐỊA CHỈ */}
                    {showAddressModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddressModal(false)}></div>
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 p-6 animate-fade-in-up max-h-[80vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">Chọn địa chỉ giao hàng</h3>
                                    <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                                </div>
                                
                                {savedAddresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {savedAddresses.map(addr => (
                                            <div key={addr.id} onClick={() => selectAddress(addr)} className="border p-4 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition group">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-gray-800">{addr.receiver_name}</p>
                                                        <p className="text-sm text-gray-500">{addr.receiver_phone}</p>
                                                    </div>
                                                    {Boolean(addr.is_default) && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold border border-green-200">Mặc định</span>}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2">{addr.street_address}, {addr.ward}, {addr.province}</p>
                                                <p className="text-xs text-indigo-600 mt-1 uppercase font-bold bg-indigo-50 inline-block px-2 py-0.5 rounded">{addr.address_name}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : <div className="text-center py-8 text-gray-500">Chưa có địa chỉ nào trong sổ địa chỉ.</div>}

                                <Link 
                                    href="/my-account?tab=addresses" 
                                    className="block w-full mt-6 py-3 text-center border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-500 transition"
                                >
                                    <i className="fa-solid fa-plus mr-2"></i> Quản lý / Thêm địa chỉ mới
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </UserLayout>
        );
    }