import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout'; // 👇 Đổi sang AdminLayout
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    // Không cần nhận prop { auth } nữa vì AdminLayout tự xử lý
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'product', 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'));
    };

    return (
        <AdminLayout 
            title="Thêm Danh mục" 
            backUrl={route('admin.categories.index')} // 👇 Hiển thị nút quay lại
        >
            <Head title="Thêm danh mục" />

            <div className="max-w-md mx-auto">
                <div className="bg-white p-8 shadow-sm rounded-lg border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Tên danh mục */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tên danh mục</label>
                            <input 
                                type="text" 
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="VD: Len Milk Cotton, Túi xách..."
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Chọn Loại */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Loại danh mục</label>
                            <select 
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 bg-white"
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                            >
                                <option value="product">Thành phẩm (Handmade)</option>
                                <option value="material">Nguyên liệu</option>
                            </select>
                            <p className="text-gray-500 text-xs mt-2 italic">* Chọn "Nguyên liệu" nếu đây là len, kim móc... Chọn "Thành phẩm" nếu là đồ đã làm xong.</p>
                            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                        </div>

                        {/* Nút bấm */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Link 
                                href={route('admin.categories.index')} 
                                className="px-5 py-2.5 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition"
                            >
                                Hủy bỏ
                            </Link>
                            <button 
                                disabled={processing} 
                                type="submit" 
                                className="px-5 py-2.5 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5"
                            >
                                {processing ? 'Đang lưu...' : 'Lưu danh mục'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}