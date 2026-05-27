import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminPagination from '@/Components/AdminPagination';

export default function OrderIndex({ orders }) {
    
    // Hàm xử lý đổi trạng thái
    const handleStatusChange = (id, newStatus) => {
        // Nếu là chấp nhận trả hàng
        if (newStatus === 'returned') {
            Swal.fire({
                title: 'Chấp nhận trả hàng?',
                text: "Kho sẽ được cộng lại số lượng sản phẩm từ đơn này và trừ điểm tích lũy của khách.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#10B981', // Màu xanh lá
                cancelButtonColor: '#d33',
                confirmButtonText: 'Đồng ý duyệt',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) executeStatusChange(id, newStatus);
            });
        } 
        // Nếu là từ chối trả hàng (Quay về completed)
        else if (newStatus === 'completed' && orders.data.find(o => o.id === id).status === 'return_pending') {
            Swal.fire({
                title: 'Từ chối trả hàng?',
                text: "Đơn hàng sẽ quay lại trạng thái 'Hoàn thành'.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xác nhận từ chối',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) executeStatusChange(id, newStatus);
            });
        }
        else {
            executeStatusChange(id, newStatus);
        }
    };

    // Hàm gọi API thực thi
    const executeStatusChange = (id, newStatus) => {
        router.put(route('admin.orders.update', id), { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => {
                const Toast = Swal.mixin({
                    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true
                });
                Toast.fire({ icon: 'success', title: 'Cập nhật thành công!' });
            }
        });
    }

    // Hàm xem lý do trả hàng
    const showReturnReason = (reason) => {
        Swal.fire({
            title: 'Lý do trả hàng',
            html: `
                <div class="text-left">
                    <p class="mb-2"><strong>Lý do khách trả hàng : </strong>  ${reason }</p>
                </div>
            `,
            confirmButtonText: 'Cancel'
        });
    };

    // Helper: Màu sắc trạng thái
    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'return_pending': return 'bg-orange-100 text-orange-800 border-orange-200 animate-pulse'; 
            case 'returned': return 'bg-gray-800 text-white border-gray-600'; 
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    
    // Helper dịch tên trạng thái hiển thị
    const getStatusLabel = (status) => {
         switch(status) {
            case 'return_pending': return 'Yêu cầu trả hàng';
            case 'returned': return 'Đã trả hàng';
            case 'pending': return 'Chờ xử lý';
            case 'processing': return 'Đang chuẩn bị';
            case 'shipped': return 'Đang giao';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    }

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    return (
        <AdminLayout title="Quản lý Đơn hàng">
            <Head title="Danh sách đơn hàng" />

            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">Danh sách Đơn hàng</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider font-['Be_Vietnam_Pro']">
                        <tr>
                            <th className="p-4 border-b text-center w-24">Mã đơn</th>
                            <th className="p-4 border-b">Khách hàng</th>
                            <th className="p-4 border-b">Chi tiết</th>
                            <th className="p-4 border-b">Tổng tiền</th>
                            <th className="p-4 border-b">Ngày đặt</th>
                            <th className="p-4 border-b text-center w-48">Trạng thái / Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders && orders.data && orders.data.length > 0 ? (
                            orders.data.map((order) => (
                                <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${order.status === 'return_pending' ? 'bg-orange-50' : ''}`}>
                                    <td className="p-4 text-center font-bold text-gray-500">#{order.id}</td>
                                    
                                    <td className="p-4">
                                        <p className="font-bold text-gray-800">{order.user ? order.user.name : 'Khách vãng lai'}</p>
                                        <p className="text-xs text-gray-500">{order.user ? order.user.email : order.phone || 'N/A'}</p>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            {order.order_items && order.order_items.map((item, idx) => (
                                                <div key={idx} className="text-sm text-gray-600 flex justify-between w-64 border-b border-dashed border-gray-200 pb-1 last:border-0">
                                                    <span className="truncate w-40" title={item.product?.name}>{item.product ? item.product.name : 'SP đã xóa'}</span>
                                                    <span className="font-bold">x{item.quantity}</span>
                                                </div>
                                            ))}
                                            
                                            {/*  THÔNG BÁO KHÁCH MUỐN TRẢ */}
                                            {order.status === 'return_pending' && (
                                                <div className="mt-2 text-xs text-orange-600 font-bold flex items-center gap-1 animate-bounce">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    Khách muốn trả hàng!
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="p-4 font-bold text-indigo-600">{formatCurrency(order.total_price)}</td>
                                    <td className="p-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>

                                    <td className="p-4 text-center align-top">
                                        <div className="flex flex-col items-center gap-2">
                                            {/* SELECT TRẠNG THÁI CHÍNH */}
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none text-center transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 w-full ${getStatusColor(order.status)}`}
                                            >
                                                <option value="pending">{getStatusLabel('pending')}</option>
                                                <option value="processing">{getStatusLabel('processing')}</option>
                                                <option value="shipped">{getStatusLabel('shipped')}</option>
                                                <option value="completed">{getStatusLabel('completed')}</option>
                                                <option value="return_pending" disabled>{getStatusLabel('return_pending')}</option>
                                                <option value="returned">{getStatusLabel('returned')}</option>
                                                <option value="cancelled">{getStatusLabel('cancelled')}</option>
                                            </select>

                                            {/*  CÁC NÚT HÀNH ĐỘNG KHI CÓ YÊU CẦU TRẢ */}
                                            {order.status === 'return_pending' && (
                                                <div className="flex flex-col gap-1 w-full mt-1">
                                                    
                                                    {/*  NÚT XEM LÝ DO */}
                                                    <button 
                                                        onClick={() => showReturnReason(order.return_reason, order.note)} // Giả sử cột DB là return_reason
                                                        className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] px-2 py-1.5 rounded shadow flex items-center justify-center gap-1 transition-all w-full"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        Xem lý do
                                                    </button>

                                                    <div className="flex gap-1">
                                                        {/* NÚT CHẤP NHẬN (XANH) */}
                                                        <button 
                                                            onClick={() => handleStatusChange(order.id, 'returned')}
                                                            className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-2 py-1.5 rounded shadow flex-1 flex items-center justify-center gap-1 transition-all"
                                                            title="Đồng ý trả hàng"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            Duyệt
                                                        </button>

                                                        {/*  NÚT TỪ CHỐI (ĐỎ) */}
                                                        <button 
                                                            onClick={() => handleStatusChange(order.id, 'completed')}
                                                            className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-2 py-1.5 rounded shadow flex-1 flex items-center justify-center gap-1 transition-all"
                                                            title="Từ chối trả hàng (Về Hoàn thành)"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            Từ chối
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-400 italic">Chưa có đơn hàng nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AdminPagination links={orders.links} />
        </AdminLayout>
    );
}