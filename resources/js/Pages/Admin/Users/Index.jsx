import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AdminPagination from '@/Components/AdminPagination'; // 👇 Import

export default function UserIndex({ users }) {

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Xóa người dùng này?',
            text: "Hành động này sẽ xóa vĩnh viễn tài khoản khỏi hệ thống.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.users.destroy', id), {
                    onSuccess: () => Swal.fire('Thành công', 'Đã xóa tài khoản thành công.', 'success')
                });
            }
        });
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    return (
        <AdminLayout title="Quản lý Khách hàng">
            <Head title="Danh sách khách hàng" />

            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">Danh sách Khách hàng</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider font-['Be_Vietnam_Pro']">
                        <tr>
                            <th className="p-4 border-b w-16 text-center">STT</th>
                            <th className="p-4 border-b">Tên khách hàng</th>
                            <th className="p-4 border-b">Email</th>
                            <th className="p-4 border-b">Ngày tham gia</th>
                            <th className="p-4 border-b text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.data.length > 0 ? (
                            users.data.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-center font-bold text-gray-500">{index + 1 + (users.current_page - 1) * users.per_page}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-gray-800">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => handleDelete(user.id)} className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-all text-xs font-bold flex items-center justify-center gap-1 mx-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">Chưa có khách hàng nào đăng ký.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 👇 Phân trang */}
            <AdminPagination links={users.links} />
        </AdminLayout>
    );
}