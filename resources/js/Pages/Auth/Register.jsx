import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Swal from 'sweetalert2';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        phone: '',
        birth_year: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        // --- 👇 1. RÀNG BUỘC DỮ LIỆU (VALIDATION CLIENT-SIDE) ---
        
        // Kiểm tra SĐT: Phải đúng 10 số
        if (data.phone.length !== 10) {
            Swal.fire('Lỗi nhập liệu', 'Số điện thoại phải có đúng 10 chữ số!', 'warning');
            return;
        }

        // Kiểm tra Username: Phải trên 5 ký tự
        if (data.username.length < 5) {
            Swal.fire('Lỗi nhập liệu', 'Tên đăng nhập phải dài hơn 8 ký tự!', 'warning');
            return;
        }

        // Kiểm tra Mật khẩu: Phải từ 8 ký tự
        if (data.password.length < 8) {
            Swal.fire('Lỗi nhập liệu', 'Mật khẩu phải dài hơn 8 ký tự!', 'warning');
            return;
        }

        // --- HẾT RÀNG BUỘC ---

        post(route('register'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công',
                    text: 'Chào mừng bạn đến với HandiSpace!',
                    confirmButtonColor: '#ea580c'
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi đăng ký',
                    text: 'Vui lòng kiểm tra lại thông tin nhập vào.',
                    confirmButtonColor: '#d33'
                });
            }
        });
    };

    // Hàm xử lý nhập SĐT: Chỉ cho nhập số, max 10
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Regex: Chỉ cho phép nhập số (0-9)
        if (/^\d*$/.test(value)) {
            // Giới hạn 10 số
            if (value.length <= 10) {
                setData('phone', value);
            }
        }
    };

    return (
        <UserLayout title="Đăng ký - HandiSpace">
            <div className="flex justify-center items-center py-12 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl border border-gray-100">
                    
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Đăng Ký</h2>
                        <p className="text-gray-500 text-sm mt-2">Tạo tài khoản để khám phá thế giới Handmade</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        
                        {/* Họ tên */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 italic">{errors.name}</p>}
                        </div>


                        {/* Số điện thoại (Đã áp dụng chặn nhập chữ) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                type="text" // Dùng type text để kiểm soát tốt hơn với regex
                                inputMode="numeric" // Hiện bàn phím số trên điện thoại
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                value={data.phone}
                                onChange={handlePhoneChange} 
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1 italic">{errors.phone}</p>}
                        </div>
                        {/* Năm sinh */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Năm sinh</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                value={data.birth_year}
                                onChange={(e) => setData('birth_year', e.target.value)}
                            />
                            {errors.birth_year && <p className="text-red-500 text-xs mt-1 italic">{errors.birth_year}</p>}
                        </div>


                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 italic">{errors.email}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tên đăng nhập (Username)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1 italic">{errors.username}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all pr-10"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-600 transition"
                                >
                                    <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1 italic">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nhập lại mật khẩu</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all pr-10"
                                    placeholder="Xác nhận mật khẩu..."
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-600 transition"
                                >
                                    <i className={`fa-solid ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-red-500 text-xs mt-1 italic">{errors.password_confirmation}</p>}
                        </div>

                        {/* Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition duration-300 shadow-md active:scale-95 disabled:opacity-70"
                            >
                                {processing ? 'Đang đăng ký...' : 'ĐĂNG KÝ TÀI KHOẢN'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-600 text-sm">
                            Đã có tài khoản?{' '}
                            <Link href={route('login')} className="text-blue-600 font-bold hover:underline hover:text-blue-800 transition">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}