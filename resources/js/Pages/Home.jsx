import React from 'react';
import { Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

// get bestSellers từ Backend
export default function Home({ bestSellers }) {
    const getThumbnail = (product) => {
        if (!product.image) return 'https://via.placeholder.com/300?text=No+Image';
        
        // lấy ảnh đầu của chuỗi json
        if (typeof product.image === 'string' && product.image.startsWith('[')) {
            try {
                const images = JSON.parse(product.image);
                return Array.isArray(images) && images.length > 0 ? images[0] : product.image;
            } catch (e) { return product.image; }
        }
        return product.image;
    };
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const blogPosts = [
        { title: 'Ghi điểm tuyệt đối với 5+ món quà sinh nhật', img: '/images/hopqua.png' },
        { title: 'Top quà cưới tinh tế và cá nhân hóa', img: '/images/topquacuoi.png' },
        { title: 'Board game là gì? Tại sao lại hot?', img: '/images/boardgame.png' }
    ];

    return (
        <UserLayout title="Trang chủ - HandiSpace">
            {/* baner */}
            <div className="relative">
                <div className="h-[500px] w-full bg-red-900 relative overflow-hidden flex items-center justify-center text-center px-4">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/images/hero-pattern.png')" }}></div>
                    <div className="relative z-10 text-white">
                        <p className="text-xl md:text-2xl font-medium mb-2 italic text-yellow-200">Ưu đãi mùa lễ hội tại HandiSpace</p>
                        <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tight uppercase">
                            Mùa Noel <span className="text-yellow-400">25%</span>
                        </h1>
                        <p className="text-lg mb-8 opacity-90 font-medium">08.12 - 28.12.2025</p>
                        <div className="flex justify-center gap-4">
                            <Link href="/shop" className="bg-white text-red-800 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-red-900 transition transform hover:scale-105 shadow-lg">
                                Mua Quà Ngay
                            </Link>
                        </div>
                    </div>
                    <img src="/images/cookie.png" className="absolute bottom-10 right-10 w-32 md:w-48 opacity-80 animate-bounce" alt="cookie" />
                </div>
            </div>

            {/* Top bán chạy */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Quà Tặng Bán Chạy</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Mỗi sản phẩm quà tặng trong bộ sưu tập của chúng tôi được chế tác công phu, tôn vinh từng chi tiết tinh xảo.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bestSellers && bestSellers.map((item) => (
                        <Link href={`/product/${item.id}`} key={item.id} className="group cursor-pointer block">
                            <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-gray-100 shadow-sm border border-gray-100">
                                <img 
                                    src={getThumbnail(item)} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                                />
                                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">-15%</div>
                                <span className={`absolute bottom-3 right-3 text-[10px] font-bold px-2 py-1 rounded shadow-sm text-white uppercase tracking-wider ${item.category_id ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                    Hot
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition line-clamp-1" title={item.name}>
                                {item.name}
                            </h3>

                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-orange-600 font-extrabold">{formatPrice(item.price)}</span>
                                <span className="text-gray-400 text-sm line-through font-medium">
                                    {formatPrice(item.price * 1.2)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/shop" className="inline-block border-2 border-gray-800 px-8 py-3 rounded-full font-bold hover:bg-gray-800 hover:text-white transition uppercase text-sm tracking-wider">
                        Xem tất cả sản phẩm →
                    </Link>
                </div>
            </div>

            {/* BLOG  */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-black text-gray-900 mb-10 text-center uppercase tracking-tight">Crafting Stories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blogPosts.map((post, idx) => (
                            <div key={idx} className="group cursor-pointer">
                                <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3] shadow-md">
                                    <img src={post.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={post.title} />
                                </div>
                                <h3 className="font-bold text-xl mb-2 group-hover:text-orange-600 leading-tight">{post.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2">Khám phá những câu chuyện thú vị đằng sau mỗi sản phẩm thủ công đầy tâm huyết...</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CAM KẾT  */}
            <div className="py-16 border-t border-gray-200 bg-[#faf9f6]">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { icon: '🏷️', title: 'Miễn phí giao hàng', desc: 'Giao hàng toàn quốc. Miễn phí vận chuyển với đơn hàng trên 500k.' },
                        { icon: '💎', title: 'Cam kết chất lượng', desc: 'Chất lượng thủ công tinh tế, độc đáo trong từng sản phẩm.' },
                        { icon: '🛡️', title: 'Bảo hành 12 tháng', desc: 'Áp dụng với tất cả sản phẩm. An tâm khi mua sắm tại HandiSpace.' }
                    ].map((item, idx) => (
                        <div key={idx}>
                            <div className="text-4xl mb-4 grayscale opacity-80">{item.icon}</div>
                            <h4 className="font-bold text-lg mb-2 text-gray-800 uppercase">{item.title}</h4>
                            <p className="text-gray-500 text-sm px-8">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}