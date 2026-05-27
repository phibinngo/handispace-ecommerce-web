import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import Swal from 'sweetalert2';

export default function UserLayout({ children, title = "HandiSpace" }) {
    const { auth } = usePage().props;
    const { cart } = useCart();
    const [showAboutModal, setShowAboutModal] = useState(false);
    
    //state  giá trị email người dùng nhập lúc đk nhận ưu đãi
    const [emailInput, setEmailInput] = useState('');

    const handleCartClick = (e) => {
        e.preventDefault();
        if (auth?.user) {
            router.get('/cart');
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Vui lòng đăng nhập',
                text: 'Bạn cần đăng nhập để xem giỏ hàng của mình!',
                confirmButtonText: 'Đăng nhập ngay',
                showCancelButton: true,
                cancelButtonText: 'Để sau',
            }).then((result) => {
                if (result.isConfirmed) router.get('/login');
            });
        }
    };

    //check và gửi đăng ký
    const handleSubscribe = () => {
        // kiểm tra email (phải có ký tự + @ + ký tự + . + ký tự)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // test định dạng email
        //sai
        if (!emailInput || !emailRegex.test(emailInput)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi định dạng',
                text: 'Vui lòng nhập đúng địa chỉ email !',
                confirmButtonText: 'Nhập lại',
                confirmButtonColor: '#d33', 
            });
            return;
        }

        //đúng
        Swal.fire({
            icon: 'success',
            title: 'Cảm ơn bạn!',
            text: 'Cảm ơn bạn đã quan tâm, chúng tôi sẽ gửi cho bạn những thông tin ưu đãi sớm nhất.',
            confirmButtonText: 'Tuyệt vời',
            confirmButtonColor: '#ea580c',
        });
        //reset lại ô input
        setEmailInput('');
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] text-gray-800 font-['Be_Vietnam_Pro'] flex flex-col">
            
            <Head>
                <title>{title}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </Head>

            {/* thanh nav trên */}
            <nav className="sticky top-0 z-50 bg-[#faf9f6]/95 backdrop-blur-sm border-b border-gray-200 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 relative">
                        <div className="hidden md:flex space-x-8 text-sm font-bold uppercase tracking-wide text-gray-600">
                            <Link href="/" className="hover:text-orange-600 transition">Trang chủ</Link>
                            <Link href="/shop" className="hover:text-orange-600 transition">Shop</Link>
                            <button onClick={() => setShowAboutModal(true)} className="hover:text-orange-600 transition uppercase focus:outline-none">Về chúng tôi</button>
                        </div>

                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <Link href="/">
                                <div className="bg-orange-600 text-white p-2 font-black text-xl tracking-tighter leading-none text-center transform hover:rotate-2 transition duration-300 shadow-md">
                                    HANDI<br/>SPACE
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-6">
                            {auth?.user ? (
                                <Link href="/my-account" className="hover:text-orange-600 font-bold text-sm">
                                    Chào, {auth.user.name}
                                </Link>
                            ) : (
                                <Link href="/login" className="hover:text-orange-600"><span className="text-xl">👤</span></Link>
                            )}

                            <button onClick={handleCartClick} className="relative hover:text-orange-600 group focus:outline-none">
                                <span className="text-xl">🛒</span>
                                {auth?.user && cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                        {cart.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-[#f0ece4] pt-16 pb-8 border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div className="md:col-span-1">
                            <h3 className="text-2xl font-black mb-4 text-gray-800">Đăng ký</h3>
                            <p className="text-gray-600 text-sm mb-4">Nhận ngay ưu đãi độc quyền dành riêng cho thành viên!</p>
                            
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="E-mail của bạn" 
                                    value={emailInput} // Liên kết với state
                                    onChange={(e) => setEmailInput(e.target.value)} // Cập nhật state khi gõ
                                    className="w-full p-3 rounded-l-lg border border-r-0 border-gray-300 outline-none focus:border-orange-500" 
                                />
                                <button 
                                    onClick={handleSubscribe} 
                                    className="bg-gray-800 text-white px-4 rounded-r-lg hover:bg-orange-600 transition font-bold"
                                >
                                    GỬI
                                </button>
                            </div>
                            
                        </div>
                        <div className="md:col-span-2">
                            <h4 className="font-bold text-sm uppercase mb-4 tracking-wider text-gray-800">HandiSpace</h4>
                            <p className="text-gray-600 text-sm mb-2"> Địa chỉ: Hòa Hải, Ngũ Hành Sơn, Đà Nẵng</p>
                            <p className="text-gray-600 text-sm mb-2"> Email: contact@binio.id.vn</p>
                            <p className="text-gray-600 text-sm mb-2"> Điện thoại: 0932540817</p>
                            <p className="text-gray-600 text-sm mb-2"> Hotline: 1900 1234</p>
                            <div className="mt-4 opacity-80 hover:opacity-100 transition">
                                <img src="/images/bocongthuong.png" className="w-32" alt="BCT" onError={(e) => e.target.style.display='none'}/>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase mb-4 tracking-wider text-gray-800">Chính sách</h4>
                            <ul className="space-y-2 text-sm text-gray-600 font-medium">
                                <li><a href="#" className="hover:text-orange-600 transition">Đổi trả & Hoàn tiền</a></li>
                                <li><a href="#" className="hover:text-orange-600 transition">Bảo mật thông tin</a></li>
                                <li><a href="#" className="hover:text-orange-600 transition">Vận chuyển & Giao nhận</a></li>
                                <li><a href="#" className="hover:text-orange-600 transition">Liên hệ hỗ trợ</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© 2025 HandiSpace. All rights reserved.</p>
                        <div className="flex space-x-6 text-lg font-bold mt-4 md:mt-0">
                            <a href="https://www.facebook.com/PhiBin.Ngo" className="hover:text-blue-600 transition"><i className="fa-brands fa-facebook"></i></a>
                            <a href="https://www.instagram.com/phibinngo/" className="hover:text-pink-600 transition"><i className="fa-brands fa-instagram"></i></a>
                            <a href="https://www.youtube.com/@phibinngo" className="hover:text-red-600 transition"><i className="fa-brands fa-youtube"></i></a>
                            <a href="https://www.pinterest.com/" className="hover:text-red-800 transition"><i className="fa-brands fa-pinterest"></i></a>
                            <a href="https://www.tiktok.com/@phibin.ngo" className="hover:text-black transition"><i className="fa-brands fa-tiktok"></i></a>
                        </div>
                    </div>
                </div>
            </footer>

            {showAboutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAboutModal(false)}></div>
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
                        <button onClick={() => setShowAboutModal(false)} className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded-full p-2 transition-colors z-20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="h-64 md:h-auto bg-gray-200 relative">
                                <img src="/images/introduce.png" alt="About Us" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <div className="text-white">
                                        <p className="font-serif italic text-lg opacity-90">Since 2025</p>
                                        <h3 className="text-3xl font-black uppercase">HandiSpace</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 md:p-10 flex flex-col justify-center">
                                <h2 className="text-2xl font-black text-gray-800 mb-4 uppercase">Câu chuyện của chúng tôi</h2>
                                <div className="space-y-4 text-gray-600 text-sm leading-relaxed text-justify">
                                    <p>Chào mừng bạn đến với <strong>HandiSpace</strong> – không gian của những sản phẩm thủ công tinh xảo và đầy tâm huyết.</p>
                                    <p>Sứ mệnh của chúng tôi là kết nối những đôi bàn tay tài hoa với những trái tim yêu cái đẹp.</p>
                                    <p className="font-medium text-orange-600">"HandiSpace - Nơi len lỏi cảm xúc"</p>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-2 uppercase text-xs tracking-wider">Liên hệ hợp tác</h4>
                                    <p className="text-sm text-gray-500">Email: contact@binio.id.vn</p>
                                    <p className="text-sm text-gray-500">Hotline: 1900 1234</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}