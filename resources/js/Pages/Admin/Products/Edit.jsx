import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function ProductEdit({ product, categories }) {
    const [previewImages, setPreviewImages] = useState([]);

    // 👇 ĐÃ SỬA: Dùng quantity thay vì stock, dùng ?? để lấy giá trị 0
    const { data, setData, post, processing, errors } = useForm({
        name: product.name || '',
        price: product.price || '',
        quantity: product.quantity ?? '', 
        category_id: product.category_id || '',
        description: product.description || '',
        images: [],         
        existing_images: [], 
        _method: 'put' 
    });

    // 1. Load dữ liệu ảnh
    useEffect(() => {
        if (product.image) {
            let existingImages = [];
            if (Array.isArray(product.image)) {
                existingImages = product.image;
            } else if (typeof product.image === 'string') {
                try {
                    existingImages = JSON.parse(product.image);
                    if (!Array.isArray(existingImages)) existingImages = [product.image];
                } catch (e) {
                    existingImages = [product.image];
                }
            }
            setData(prev => ({ ...prev, existing_images: existingImages }));
            
            const formattedPreviews = existingImages.map((url) => ({
                name: url.split('/').pop(), 
                url: url,
                isExisting: true 
            }));
            setPreviewImages(formattedPreviews);
        }
    }, [product]);

    // 2. Chọn ảnh MỚI
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + data.existing_images.length + data.images.length > 5) {
            Swal.fire('Lỗi', 'Tổng số lượng ảnh không được quá 5!', 'error');
            return;
        }
        const newPreviews = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
            isExisting: false
        }));
        setData('images', [...data.images, ...files]);
        setPreviewImages([...previewImages, ...newPreviews]);
        e.target.value = null;
    };

    // 3. Xóa ảnh
    const removeImage = (index) => {
        const targetImage = previewImages[index];
        if (targetImage.isExisting) {
            const updatedExisting = data.existing_images.filter(url => url !== targetImage.url);
            setData('existing_images', updatedExisting);
        } else {
            const updatedNewImages = data.images.filter(file => file.name !== targetImage.name);
            setData('images', updatedNewImages);
            URL.revokeObjectURL(targetImage.url);
        }
        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.products.update', product.id), data, {
            onSuccess: () => {
                Swal.fire('Thành công', 'Đã cập nhật sản phẩm!', 'success');
            }
        });
    };

    useEffect(() => {
        return () => {
            previewImages.forEach(img => {
                if (!img.isExisting) URL.revokeObjectURL(img.url);
            });
        };
    }, [previewImages]);

    return (
        <AdminLayout title="Cập nhật sản phẩm" backUrl="/admin/products">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => ( <option key={cat.id} value={cat.id}>{cat.name}</option> ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Giá tiền</label>
                            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={data.price} onChange={e => setData('price', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Số Lượng Kho</label>
                            {/* 👇 ĐÃ SỬA: Bind vào data.quantity */}
                            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={data.quantity} onChange={e => setData('quantity', e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả</label>
                        <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-64 resize-y" value={data.description} onChange={e => setData('description', e.target.value)}></textarea>
                    </div>

                    <div className="border-t pt-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh</label>
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
                                            <th className="px-4 py-3 w-32 text-center">Trạng thái</th>
                                            <th className="px-4 py-3 w-24 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {previewImages.map((img, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-center font-bold text-gray-500">{index + 1}</td>
                                                <td className="px-4 py-3 flex justify-center"><img src={img.url} alt="preview" className="h-12 w-12 object-cover rounded border border-gray-300" /></td>
                                                <td className="px-4 py-3 text-gray-700 font-medium truncate max-w-xs" title={img.name}>{img.name}</td>
                                                <td className="px-4 py-3 text-center text-sm">
                                                    {img.isExisting ? <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md text-xs border border-green-200">Ảnh cũ</span> : <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md text-xs border border-blue-200">Mới thêm</span>}
                                                </td>
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
                            {processing ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}