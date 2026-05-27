import React, { useState } from 'react'; // 👇 Nhớ import useState
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminPagination from '@/Components/AdminPagination';

export default function ProductIndex({ products }) {
    
    // 👇 1. STATE TÌM KIẾM (Lấy từ URL để khi reload không mất chữ)
    const [searchTerm, setSearchTerm] = useState(new URLSearchParams(window.location.search).get('search') || '');

    // 👇 2. HÀM XỬ LÝ KHI NHẤN ENTER
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('admin.products.index'), { search: searchTerm }, { // vd  http://localhost:8000/admin/products?search=banh_mi.
                preserveState: true, // Inertia chỉ thay cái ruột danh sách sản phẩm thôi, còn thanh cuộn chuột, vị trí con trỏ giữ nguyên y xì.
                replace: true,       // Thay thế lịch sử duyệt web Ấn nút Back phát là về trang chủ luôn
            });
        }
    };

    // Hàm xử lý xóa sản phẩm
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống.",
            icon: 'warning', // Hiện cái icon dấu chấm than màu vàng
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.products.destroy', id), {
                    onSuccess: (page) => {
                        const flash = page.props.flash;
                        if (flash.error) {
                            Swal.fire({ icon: 'error', title: 'Không thể xóa!', text: flash.error, confirmButtonColor: '#d33' });
                        } else {
                            Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã xóa sản phẩm thành công.', confirmButtonColor: '#3085d6' });
                        }
                    },
                    onError: () => Swal.fire('Lỗi', 'Đã có lỗi xảy ra phía máy chủ.', 'error')
                });
            }
        });
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // Hàm xử lý ảnh 
    const getThumbnail = (imgData) => {
        let path = imgData;
        if (typeof imgData === 'string') {
            try {
                const parsed = JSON.parse(imgData);// parse: chuyển chuổi string json thành mảng để máy tính hiểu đc
                if (Array.isArray(parsed) && parsed.length > 0) path = parsed[0];
            } catch (e) { path = imgData; }
        } else if (Array.isArray(imgData) && imgData.length > 0) {
            path = imgData[0];
        }
        if (!path) return 'https://via.placeholder.com/50';
        if (!path.startsWith('http') && !path.startsWith('/storage/')) return `/storage/${path}`;
        return path;
    };

    return (
        <AdminLayout title="Quản lý Sản phẩm">
            <Head title="Sản phẩm" />
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                 <h2 className="text-2xl font-bold text-gray-800">Danh sách Sản phẩm</h2>
                 
                 {/* TÌM KIẾM vs THÊM MỚI */}
                 <div className="flex items-center gap-3">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Tìm sản phẩm..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm w-64 transition-all"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>

                    <Link href={route('admin.products.create')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-indigo-700 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 whitespace-nowrap">
                        <span className="text-lg font-bold">+</span> Thêm mới
                    </Link>
                 </div>
            </div>
             
             {/* in list sp */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            {/* th: table header */}
                            <th className="p-4 border-b w-16 text-center">STT</th> 
                            <th className="p-4 border-b w-20">Hình ảnh</th>
                            <th className="p-4 border-b">Tên sản phẩm</th>
                            <th className="p-4 border-b">Danh mục</th>
                            <th className="p-4 border-b">Giá</th>
                            <th className="p-4 border-b text-center">Số lượng</th>
                            <th className="p-4 border-b w-32 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.data.length > 0 ? (
                            products.data.map((product, index) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 font-bold text-gray-400 text-center">{index + 1 + (products.current_page - 1) * products.per_page}</td> 
                                    {/* Ví dụ ở trang 2 (mỗi trang 10 cái), nó sẽ lấy 0 + 1 + (2-1)*10 = 11. Vậy là trang 2 sẽ bắt đầu từ số 11 */}
                                    <td className="p-4">
                                        <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                            <img src={getThumbnail(product.image)} className="w-full h-full object-cover" alt="" />
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                    <td className="p-4 text-sm text-gray-500">{product.category?.name}</td>
                                    <td className="p-4 font-bold text-indigo-600">{formatPrice(product.price)}</td>
                                    <td className="p-4 text-center font-medium text-gray-700">{product.quantity ?? 0}</td> 
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Link href={route('admin.products.edit', product.id)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">Sửa</Link>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="p-12 text-center text-gray-500 italic">Chưa có sản phẩm nào.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AdminPagination links={products.links} />
        </AdminLayout>
    );
}