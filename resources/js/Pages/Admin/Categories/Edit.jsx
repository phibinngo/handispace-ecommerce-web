import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        type: category.type || 'product',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    return (
        <AdminLayout 
            title="Sửa Danh mục" 
            backUrl={route('admin.categories.index')} 
        >
            <Head title="Sửa danh mục" />

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
                                className="px-5 py-2.5 bg-orange-600 rounded-lg text-white font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 transition transform hover:-translate-y-0.5"
                            >
                                {processing ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}