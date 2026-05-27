import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Head, Link } from '@inertiajs/react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load dữ liệu đơn hàng
    const fetchOrders = () => {
        // Gọi đúng đường dẫn: /admin/api/orders (do prefix 'admin' trong web.php)
        axios.get('/admin/api/orders') 
            .then(res => {
                setOrders(res.data.data); // data của paginate
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Hàm đổi trạng thái đơn hàng (Duyệt đơn)
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/admin/api/orders/${orderId}`, { status: newStatus });
            
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Trạng thái đơn hàng đã được cập nhật!',
                timer: 1500,
                showConfirmButton: false
            });

            fetchOrders(); // Load lại bảng sau khi update
        } catch (error) {
            Swal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error');
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // Màu sắc cho từng trạng thái
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        processing: 'bg-blue-100 text-blue-800 border-blue-200',
        shipping: 'bg-purple-100 text-purple-800 border-purple-200',
        completed: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Head title="Quản lý đơn hàng" />
            
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Đơn Hàng 🛠️</h1>
                        <p className="text-gray-500 mt-1">Xem và duyệt đơn hàng của khách</p>
                    </div>
                    <Link href="/shop" className="bg-white border px-4 py-2 rounded-lg shadow hover:bg-gray-50 text-indigo-600 font-bold">
                        ← Về trang bán hàng
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    {loading ? (
                        <div className="p-10 text-center">Đang tải dữ liệu...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái hiện tại</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động (Duyệt)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                Chưa có đơn hàng nào được đặt.
                                            </td>
                                        </tr>
                                    ) : orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-bold text-gray-700">#{order.id}</span>
                                                <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('vi-VN')}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{order.shipping_name}</div>
                                                <div className="text-sm text-gray-500">{order.shipping_phone}</div>
                                                <div className="text-xs text-gray-400 mt-1">{order.shipping_address}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold text-base">
                                                {formatPrice(order.total_price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${statusColors[order.status]}`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-gray-50 cursor-pointer"
                                                >
                                                    <option value="pending">⏳ Chờ xác nhận</option>
                                                    <option value="processing">⚙️ Đang xử lý</option>
                                                    <option value="shipping">🚚 Đang giao hàng</option>
                                                    <option value="completed">✅ Hoàn thành</option>
                                                    <option value="cancelled">❌ Hủy đơn</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}