import React, { useState } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';

export default function AdminLayout({ children, title, backUrl }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { url } = usePage();

    const menuItems = [
        { name: 'Dashboard', url: '/admin', icon: '' },
        { name: 'Đơn hàng', url: '/admin/orders', icon: '' },
        
        // 👇 ĐÃ THÊM MỤC DANH MỤC Ở ĐÂY
        { name: 'Danh mục', url: '/admin/categories', icon: '' }, 

        { name: 'Sản phẩm', url: '/admin/products', icon: '' },
        { name: 'Khách hàng', url: '/admin/users', icon: '' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-['Be_Vietnam_Pro']">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
                <style>{`
                    body { font-family: 'Be Vietnam Pro', sans-serif; }
                `}</style>
            </Head>

            {/* === SIDEBAR === */}
            <aside 
                className={`${
                    isSidebarOpen ? 'w-64' : 'w-20'
                } bg-[#1a1f37] text-white flex flex-col transition-all duration-300 shadow-xl flex-shrink-0 relative z-20 overflow-x-hidden`}
            >
                {/* Header Sidebar */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700/50 relative flex-shrink-0">
                    <div className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                        <h1 className="text-xl font-bold text-orange-500 tracking-wider font-['Be_Vietnam_Pro']">ADMIN</h1>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`text-gray-400 hover:text-white transition-colors p-2 rounded-lg ${!isSidebarOpen && 'mx-auto'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-1">
                    {menuItems.map((item) => {
                        // Logic Active: Nếu url hiện tại bắt đầu bằng item.url thì active
                        // Riêng Dashboard (/admin) phải check chính xác
                        const isActive = item.url === '/admin' ? url === '/admin' : url.startsWith(item.url);
                        return (
                            <Link
                                key={item.name}
                                href={item.url}
                                className={`flex items-center px-4 py-3 transition-all relative group
                                    ${isActive 
                                        ? 'bg-gray-700/50 text-white border-r-4 border-orange-500' 
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }
                                    ${!isSidebarOpen && 'justify-center'}
                                `}
                            >
                                <span className="text-xl flex-shrink-0">{item.icon}</span>
                                <span className={`ml-3 font-medium whitespace-nowrap transition-all duration-200 ${
                                    isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 hidden'
                                }`}>
                                    {item.name}
                                </span>
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none shadow-lg border border-gray-700 font-['Be_Vietnam_Pro']">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
                    <Link href="/admin/logout" method="post" as="button" className={`flex items-center w-full text-red-400 hover:bg-gray-800 p-2 rounded-lg transition-colors ${!isSidebarOpen && 'justify-center'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                        </svg>
                        <span className={`ml-3 font-medium whitespace-nowrap ${!isSidebarOpen && 'hidden w-0'}`}>Đăng xuất</span>
                    </Link>
                </div>
            </aside>

            {/* === MAIN CONTENT === */}
            <main className="flex-1 h-screen overflow-y-auto bg-gray-50 w-full relative">
                
                {/* HEADER */}
                <header className="bg-white shadow-sm sticky top-0 z-10 px-8 py-4 grid grid-cols-3 items-center min-h-[80px]">
                    <div className="flex justify-start">
                        {backUrl && (
                            <Link 
                                href={backUrl} 
                                className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors font-semibold group px-3 py-2 rounded-lg hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Quay lại danh sách
                            </Link>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <h2 className="text-3xl font-black text-gray-800 text-center uppercase tracking-wide font-['Be_Vietnam_Pro']">
                            {title}
                        </h2>
                    </div>

                    <div className="flex justify-end items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:block font-medium">Xin chào, Admin</span>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shadow-sm">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}