import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminPagination from '@/Components/AdminPagination'; // 👇 Import

export default function Index({ categories }) {
    
    // Hàm xử lý xóa danh mục
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Hành động này sẽ xóa vĩnh viễn danh mục khỏi hệ thống.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.categories.destroy', id), {
                    onSuccess: (page) => {
                        const flash = page.props.flash;
                        if (flash.error) {
                            Swal.fire({ icon: 'error', title: 'Không thể xóa!', text: flash.error, confirmButtonColor: '#d33' });
                        } else {
                            Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã xóa danh mục thành công.', confirmButtonColor: '#3085d6' });
                        }
                    },
                    onError: () => Swal.fire('Lỗi', 'Đã có lỗi xảy ra phía máy chủ.', 'error')
                });
            }
        });
    };

    return (
        <AdminLayout title="Quản lý Danh mục">
            <Head title="Danh mục" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Danh sách Danh mục</h2>
                <Link href={route('admin.categories.create')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-indigo-700 flex items-center gap-2 transition-all transform hover:-translate-y-0.5">
                    <span className="text-lg font-bold">+</span> Thêm mới
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="p-4 border-b w-16 text-center">STT</th>
                            <th className="p-4 border-b">Tên danh mục</th>
                            <th className="p-4 border-b w-40">Loại</th>
                            <th className="p-4 border-b w-32 text-center"></th> 
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.data.length > 0 ? (
                            categories.data.map((cat, index) => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 font-bold text-gray-400 text-center">{index + 1 + (categories.current_page - 1) * categories.per_page}</td>
                                    <td className="p-4 font-medium text-gray-800 text-base">{cat.name}</td>
                                    <td className="p-4">
                                        {cat.type === 'material' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Nguyên liệu</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-800">Thành phẩm</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Link href={route('admin.categories.edit', cat.id)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 transition-colors">
                                                Sửa
                                            </Link>
                                            <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors">
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="p-12 text-center text-gray-500 italic">Chưa có danh mục nào được tạo.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 👇 Phân trang */}
            <AdminPagination links={categories.links} />
        </AdminLayout>
    );
}