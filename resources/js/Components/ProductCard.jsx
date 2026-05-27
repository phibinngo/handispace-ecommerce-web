import React from 'react';
import { useCart } from '@/Contexts/CartContext';
import { usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { auth } = usePage().props; 

    const getThumbnail = () => {
        if (Array.isArray(product.image) && product.image.length > 0) return product.image[0];
        if (typeof product.image === 'string') {
            try {
                const images = JSON.parse(product.image);
                return Array.isArray(images) && images.length > 0 ? images[0] : product.image;
            } catch (e) { return product.image; }
        }
        return 'https://via.placeholder.com/300?text=No+Image';
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleAddToCart = (e) => {
        e.preventDefault(); 
        e.stopPropagation();

        if (!auth?.user) { 
            Swal.fire({
                icon: 'info',
                title: 'Vui lòng đăng nhập',
                text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!',
                confirmButtonText: 'Đăng nhập ngay',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) router.get('/login');
            });
            return; 
        }

        if (product.quantity <= 0) {
            Swal.fire('Hết hàng', 'Sản phẩm này hiện đang tạm hết.', 'warning');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: getThumbnail(),
            quantity: 1,
            max_stock: product.quantity
        });
    };

    return (
        // hiệu ứng hover cho ảnh
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
            
            {/* 1. ẢNH SẢN PHẨM (Có hiệu ứng phóng to) */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img 
                    src={getThumbnail()}
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Loại SP */}
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded shadow-sm text-white uppercase tracking-wider ${product.category?.type === 'material' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                    {product.category?.type === 'material' ? 'Nguyên liệu' : 'Thành Phẩm'}
                </span>

                {/* Hết hàng */}
                {product.quantity <= 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded">Hết hàng</span>
                    </div>
                )}
            </div>

            {/* 2. THÔNG TIN & NÚT BẤM  */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium truncate">{product.category?.name}</div>
                
                <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2 min-h-[3rem] group-hover:text-orange-600 transition-colors">
                    {product.name}
                </h3>
                
                <div className="mb-4">
                    <p className="text-orange-600 font-extrabold text-lg">
                        {formatPrice(product.price)}
                    </p>
                </div>

                {/* Nút bấm nằm tĩnh ở dưới cùng */}
                <div className="mt-auto">
                    <button 
                        onClick={handleAddToCart}
                        disabled={product.quantity <= 0}
                        className={`w-full py-2.5 rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                            product.quantity > 0 
                            ? 'bg-gray-900 text-white hover:bg-orange-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {product.quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                </div>
            </div>
        </div>
    );
}