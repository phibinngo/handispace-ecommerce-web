import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react'; // Import Link
import ProductCard from '@/Components/ProductCard';
import UserLayout from '@/Layouts/UserLayout';

export default function Shop() {
    const [paginatedData, setPaginatedData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        name: '',
        type: '',
        sort: 'newest'
    });

    const fetchProducts = (url = '/api/products') => {
        setLoading(true);
        axios.get(url, { params: filters }) 
            .then(response => {
                setPaginatedData(response.data.data); 
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi tải hàng:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handlePageChange = (url) => {
        if (url) {
            fetchProducts(url);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const products = paginatedData ? paginatedData.data : [];

    return (
        <UserLayout title="Cửa hàng - HandiSpace">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Tiêu đề */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">
                        Cửa Hàng <span className="text-orange-600">Handmade</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Khám phá những sản phẩm thủ công độc đáo hoặc tìm kiếm nguyên liệu để tự tay sáng tạo.
                    </p>
                </div>

                {/* BỘ LỌC */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-10 border border-gray-100 sticky top-24 z-30">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="w-full md:w-1/3 relative">
                            {/* icon kính lúp */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>

                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
                            />
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <div>
                                <select 
                                    className="appearance-none px-6 py-3 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer hover:bg-white transition-all font-medium text-gray-700"
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value=""> Tất cả loại</option>
                                    <option value="material"> Nguyên liệu</option>
                                    <option value="product" > Thành phẩm</option>
                                </select>
                            </div>

                            <div>
                                <select 
                                    className="appearance-none px-6 py-3 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer hover:bg-white transition-all font-medium text-gray-700"
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price_asc">Giá: Thấp - Cao</option>
                                    <option value="price_desc">Giá: Cao - Thấp</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DANH SÁCH SẢN PHẨM */}
                {loading ? (
                    <div className="text-center py-32">
                        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-orange-600 mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Đang tải các mặt hàng...</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                            {products.map(product => (
                                // Bọc ProductCard trong Link để chuyển hướng khi nhấp vào thẻ
                                <Link 
                                    key={product.id} 
                                    href={`/product/${product.id}`} 
                                    className="group block h-full"
                                >
                                    <ProductCard product={product} />
                                </Link>
                            ))}
                        </div>

                        {/* PHÂN TRANG */}
                        {paginatedData && paginatedData.last_page > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                {paginatedData.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(link.url)}
                                        disabled={!link.url || link.active}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-orange-600 text-white border-orange-600'
                                                : !link.url
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-orange-600'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <h3 className="text-xl font-bold text-gray-800">Không tìm thấy sản phẩm nào</h3>
                        <p className="text-gray-500 mt-2">Hãy thử tìm từ khóa khác</p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}