import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function ProductCreate({ categories }) {
    const [previewImages, setPreviewImages] = useState([]);
    
    // 👇 ĐÃ SỬA: Dùng quantity thay vì stock
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', price: '', quantity: '', category_id: '', description: '', images: [], 
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + data.images.length > 5) {
            Swal.fire('Lỗi', 'Chỉ được tải lên tối đa 5 ảnh!', 'error');
            return;
        }
        const newPreviews = files.map(file => ({ name: file.name, url: URL.createObjectURL(file) }));
        setData('images', [...data.images, ...files]);
        setPreviewImages([...previewImages, ...newPreviews]);
        e.target.value = null; 
    };

    const removeImage = (index) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);
        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index].url);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            onSuccess: () => {
                Swal.fire('Thành công', 'Đã thêm sản phẩm mới!', 'success');
                reset();
                setPreviewImages([]);
            }
        });
    };

    useEffect(() => {
        return () => previewImages.forEach(file => URL.revokeObjectURL(file.url));
    }, []);

    return (
        <AdminLayout title="Thêm sản phẩm mới" backUrl="/admin/products">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nhập tên sản phẩm..." value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Giá tiền (VNĐ)</label>
                            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={data.price} onChange={e => setData('price', e.target.value)} />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng kho</label>
                            {/* 👇 ĐÃ SỬA: Bind vào data.quantity */}
                            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={data.quantity} onChange={e => setData('quantity', e.target.value)} />
                            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả chi tiết</label>
                        <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-64 resize-y" placeholder="Nhập thông tin chi tiết..." value={data.description} onChange={e => setData('description', e.target.value)}></textarea>
                    </div>

                    <div className="border-t pt-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh (Tối đa 5)</label>
                        <div className="mb-4">
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                        {previewImages.length > 0 && (
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
                                        <tr>
                                            <th className="px-4 py-3 text-center w-16">STT</th>
                                            <th className="px-4 py-3 w-24 text-center">Ảnh</th>
                                            <th className="px-4 py-3">Tên ảnh</th>
                                            <th className="px-4 py-3 w-24 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {previewImages.map((img, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-center font-bold text-gray-500">{index + 1}</td>
                                                <td className="px-4 py-3 flex justify-center"><img src={img.url} alt="preview" className="h-12 w-12 object-cover rounded border border-gray-300" /></td>
                                                <td className="px-4 py-3 text-gray-700 font-medium truncate max-w-xs">{img.name}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button type="button" onClick={() => removeImage(index)} className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 mx-auto">
                                                        <span className="text-xs font-bold">Xóa</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Link href="/admin/products" className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">Hủy bỏ</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-all active:scale-95">
                            {processing ? 'Đang lưu...' : 'Lưu sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}