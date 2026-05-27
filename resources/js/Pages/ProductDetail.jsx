import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Swal from 'sweetalert2';
import { useCart } from '@/Contexts/CartContext'; 
import axios from 'axios'; // 👇 Import axios

export default function ProductDetail({ product, relatedProducts, reviews }) {
    const { addToCart: contextAddToCart } = useCart();
    const { auth } = usePage().props;

    let images = [];
    try {
        images = typeof product.image === 'string' ? JSON.parse(product.image) : product.image;
        if (!Array.isArray(images)) images = [product.image];
    } catch (e) {
        images = ['https://via.placeholder.com/500x500?text=No+Image'];
    }
    if (images.length === 0) images = ['https://via.placeholder.com/500x500?text=No+Image'];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(nextImage, 5000);
            return () => clearInterval(interval);
        }
    }, [currentIndex, images.length]);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleQuantityChange = (val) => {
        let newQty = quantity + val;
        if (newQty < 1) newQty = 1;
        if (newQty > product.quantity) newQty = product.quantity; 
        setQuantity(newQty);
    };

    const handleAction = (isBuyNow) => {
        if (!auth?.user) {
            Swal.fire({
                icon: 'info', title: 'Vui lòng đăng nhập', text: 'Bạn cần đăng nhập để mua hàng!',
                confirmButtonText: 'Đăng nhập ngay', showCancelButton: true
            }).then((res) => { if (res.isConfirmed) router.get('/login'); });
            return;
        }

        if (product.quantity <= 0) {
            Swal.fire('Hết hàng', 'Sản phẩm này tạm thời hết hàng', 'warning');
            return;
        }

        if (isBuyNow) {
            router.get('/checkout', {
                buy_now_mode: true,
                product_id: product.id,
                quantity: quantity
            });
        } else {
            // --- THÊM VÀO GIỎ: Phải gọi API lưu vào DB trước ---
            axios.post('/cart/add', {
                product_id: product.id,
                quantity: quantity
            })
            .then(() => {
                // Lưu thành công -> Cập nhật Context để hiển thị trên Navbar
                contextAddToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: images[0],
                    quantity: quantity,
                    max_stock: product.quantity
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Đã thêm vào giỏ',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((error) => {
                console.error("Lỗi thêm giỏ hàng:", error);
                Swal.fire('Lỗi', 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.', 'error');
            });
        }
    };

    return (
        <UserLayout>
            <Head title={product.name} />
            <div className="bg-gray-50 py-8 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                        <Link href="/" className="hover:text-orange-500">Trang chủ</Link> <span>/</span>
                        <Link href="/shop" className="hover:text-orange-500">Sản phẩm</Link> <span>/</span>
                        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                        <div className="md:col-span-5 flex flex-col gap-4">
                            <div className="w-full aspect-square border border-gray-100 rounded-lg overflow-hidden relative group bg-white">
                                <img src={images[currentIndex]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">❮</button>
                                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">❯</button>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, index) => (
                                    <button key={index} onClick={() => setCurrentIndex(index)} className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${currentIndex === index ? 'border-orange-500' : 'border-transparent'}`}>
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-7 space-y-6">
                            <h1 className="text-2xl md:text-3xl font-medium text-gray-800">{product.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <a href = "#rview"><span className="font-bold text-orange-500 border-b border-orange-500">{reviews.length}  Đánh giá</span></a>
                                <div className="w-[1px] h-4 bg-gray-300"></div>
                                <span>{product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 rounded-lg"><span className="text-3xl font-bold text-orange-600">{formatPrice(product.price)}</span></div>
                            
                            <div className="flex items-center gap-6">
                                <span className="text-gray-500 text-sm">Số lượng</span>
                                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                    <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1 hover:bg-gray-100 border-r">-</button>
                                    <input type="text" value={quantity} readOnly className="w-14 text-center outline-none border-none" />
                                    <button onClick={() => handleQuantityChange(1)} className="px-3 py-1 hover:bg-gray-100 border-l">+</button>
                                </div>
                                <span className="text-sm text-gray-400">{product.quantity} sản phẩm có sẵn</span>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => handleAction(false)} className="px-6 py-3 bg-orange-50 border border-orange-500 text-orange-600 font-bold rounded hover:bg-orange-100 flex items-center gap-2">
                                    Thêm vào giỏ hàng
                                </button>
                                <button onClick={() => handleAction(true)} className="px-8 py-3 bg-orange-600 text-white font-bold rounded shadow-md hover:bg-orange-700">
                                    Mua Ngay
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/*  Mô tả vs Đánh giá  */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 bg-gray-50 p-3 rounded uppercase">Mô tả sản phẩm</h2>
                            <div className="text-gray-600 leading-relaxed whitespace-pre-line px-2">
                                {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm" id = "rview">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase border-b pb-2" >Đánh giá sản phẩm ({reviews.length})</h2>
                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((review, idx) => (
                                        <div key={idx} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500 font-bold text-sm">
                                                {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-800">{review.user_name || 'Khách hàng'}</p>
                                                <div className="text-green-500 text-xs my-1 flex items-center gap-1"><i className="fa-solid fa-circle-check"></i> <span>Đã mua hàng</span></div>
                                                <div className="text-xs text-gray-400 mb-2">{new Date(review.created_at).toLocaleString('vi-VN')}</div>
                                                <p className="text-gray-700 text-sm mt-2">{review.review_content}</p>
                                                {review.review_image && (<div className="mt-3"><img src={review.review_image} className="w-24 h-24 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-90" alt="Review Image" onClick={() => Swal.fire({ imageUrl: review.review_image, showConfirmButton: false, width: 'auto' })} /></div>)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                                    <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sản phẩm cùng danh mục */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase">Sản phẩm tương tự</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {relatedProducts.map(p => {
                                    let pImg = ''; try { const parsed = JSON.parse(p.image); pImg = Array.isArray(parsed) ? parsed[0] : parsed; } catch(e) { pImg = p.image; }
                                    return (
                                        <Link key={p.id} href={`/product/${p.id}`} className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition group">
                                            <div className="aspect-square rounded-md overflow-hidden mb-2"><img src={pImg || 'https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-105 transition" alt="" /></div>
                                            <h4 className="text-sm font-medium text-gray-800 line-clamp-2 h-10">{p.name}</h4>
                                            <p className="text-orange-600 font-bold mt-1">{formatPrice(p.price)}</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}